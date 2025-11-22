import { useReducer } from "react"
import { autoResolveBattle } from "../lib/auto-battles"
import { updateFleetsFromBattleReport } from "../lib/battle-operations"
import { bombColony, removeOneColonyShip } from "../lib/colony-operations"
import { getBattleAt } from "../lib/derived-state"
import { addNewFleet, factionHasBattles, transferShips } from "../lib/fleet-operations"
import type { BattleReport, Dialog, Fleet, GameState, Star } from "../lib/model"
import { progressTurn } from "../lib/progress-turn"
import { findById, isSet } from "../lib/util"
import { createBalancedColonyBudget, createBudgetWithAllIn, type ColonyBudgetItem } from "../lib/colony-budget"
import { setBudgetAmount } from "../lib/budget"

type ColonyControlAction = {
    type: 'set-star-construction-design',
    starId: number,
    designId?: number
} | {
    type: 'star-budget-lock',
    starId: number,
    itemName: ColonyBudgetItem,
    locked: boolean
} | {
    type: 'set-star-budget',
    starId: number,
    itemName: ColonyBudgetItem,
    targetPercentage: number
};

type FleetDialogAction = {
    type: 'fleets:transfer-ships',
    fleetId: number,
    sourceFleetMap: Record<number, number[]>
} | {
    type: 'fleets:transfer-to-new-fleet',
    sourceFleetMap: Record<number, number[]>,
};

type SelectionAction = {
    type: 'select-star',
    target?: Star,
} | {
    type: 'select-fleet'
    target?: Fleet
};

type FleetOrderActions = {
    type: 'pick-destination',
    target?: Star,
} | {
    type: 'start-colony'
    starId: number,
    fleetId: number,
} | {
    type: 'order-bombing',
    starId: number,
    fleetId: number,
};

type SpaceBattleActions = {
    type: 'battles:auto-resolve'
    starId: number
} | {
    type: 'battles:launch',
    starId: number,
} | {
    type: 'battles:result',
    report: BattleReport,
};

export type Action = ColonyControlAction | FleetDialogAction | SelectionAction | FleetOrderActions | SpaceBattleActions |
{
    type: 'next-turn'
} | {
    type: 'open-dialog'
    dialog: Dialog
} | {
    type: 'close-dialog'
};

export const gameStateReducer = (state: GameState, action: Action): GameState => {
    if (state.dialog) {
        switch (action.type) {
            case 'close-dialog': {
                return { ...state, dialog: undefined }
            }
            case 'fleets:transfer-ships':
            case 'fleets:transfer-to-new-fleet':
            case 'battles:auto-resolve':
            case 'battles:launch':
            case 'battles:result':
                break;
            default:
                return state
        }
    }

    switch (action.type) {
        case 'open-dialog':
            return { ...state, dialog: action.dialog }
        case 'close-dialog':
            return state
        case 'select-star':
            // to do - optionally select the first fleet on the list for this star
            return { ...state, focusedStarId: action.target?.id, selectedFleetId: undefined }
        case 'set-star-construction-design': {
            const stars = structuredClone(state.galaxy.stars)
            const star = findById(action.starId, stars)
            if (star) {
                star.shipDesignToConstruct = action.designId
            }

            return {
                ...state,
                galaxy: {
                    ...state.galaxy, stars
                }
            }
        }
        case 'set-star-budget': {
            const stars = structuredClone(state.galaxy.stars)
            const star = findById(action.starId, stars)
            if (star) {
                const oldBudget = structuredClone(star.budget) || createBalancedColonyBudget();
                star.budget = setBudgetAmount(action.itemName, action.targetPercentage, oldBudget)
            }

            return {
                ...state,
                galaxy: {
                    ...state.galaxy, stars
                }
            }
        }
        case 'star-budget-lock': {
            const stars = structuredClone(state.galaxy.stars)
            const star = findById(action.starId, stars)
            if (star) {
                const oldBudget = structuredClone(star.budget) || createBalancedColonyBudget();
                oldBudget.items[action.itemName].locked = action.locked
                star.budget = oldBudget
            }

            return {
                ...state,
                galaxy: {
                    ...state.galaxy, stars
                }
            }
        }
        case 'start-colony': {
            const fleets = structuredClone(state.fleets)
            const stars = structuredClone(state.galaxy.stars)

            const star = findById(action.starId, stars);
            const fleet = findById(action.fleetId, fleets);
            const faction = findById(fleet?.factionId, state.factions);
            if (!star || !fleet || !faction) {
                console.warn('could not find star or fleet for start-colony', { action, star, fleet, faction })
                return state
            }

            const colonyShipUsed = removeOneColonyShip(fleet, faction)
            if (colonyShipUsed) {
                star.factionId = faction.id
                star.population = 1
                star.budget = createBudgetWithAllIn('industry');
            }

            return {
                ...state,
                fleets: fleets.filter(fleet => fleet.ships.length > 0),
                galaxy: {
                    ...state.galaxy, stars
                },
                reports: [...state.reports, {
                    reportType: 'colonyStart',
                    turnNumber: state.turnNumber,
                    star: action.starId,
                    faction: fleet.factionId
                }]
            }
        }
        case 'order-bombing': {
            const pendingBattle = getBattleAt(action.starId, state)
            if (pendingBattle) {
                console.warn('could not bomb as battle needs to be resolve first', pendingBattle)
                return state
            }

            const fleets = structuredClone(state.fleets)
            const stars = structuredClone(state.galaxy.stars)

            const star = findById(action.starId, stars);
            const fleet = findById(action.fleetId, fleets);
            const bombingFaction = findById(fleet?.factionId, state.factions);
            const bombedFaction = findById(star?.factionId, state.factions)
            if (!star || !fleet || !bombingFaction || !bombedFaction) {
                console.warn('could not find star or fleet for order-bombing', { action, star, fleet, bombingFaction, bombedFaction })
                return state
            }

            const report = bombColony(bombingFaction, fleet, bombedFaction, star, state.turnNumber)

            return {
                ...state,
                fleets,
                galaxy: {
                    ...state.galaxy, stars
                },
                reports: [...state.reports, report]
            }
        }
        case 'pick-destination':
            const activeFleet = findById(state.selectedFleetId, state.fleets);
            if (!activeFleet) {
                return state
            }
            activeFleet.destinationStarId = action.target?.id
            return { ...state }
        case 'select-fleet':
            return {
                ...state,
                selectedFleetId: action.target?.id,
                focusedStarId: !action.target ? state.focusedStarId : isSet(action.target?.orbitingStarId) ? state.focusedStarId : undefined,
            }
        case 'fleets:transfer-ships': {
            const { sourceFleetMap, fleetId } = action;
            const fleets = structuredClone(state.fleets)
            const destinationFleet = findById(fleetId, fleets)
            if (!destinationFleet) {
                console.warn('no destination fleet', fleetId)
                return { ...state }
            }
            transferShips(sourceFleetMap, destinationFleet, fleets)
            return { ...state, fleets }
        }
        case 'fleets:transfer-to-new-fleet': {
            const { sourceFleetMap } = action;
            const star = findById(state.focusedStarId, state.galaxy.stars)
            if (!star) {
                console.warn('no such star', state.focusedStarId)
                return { ...state }
            }
            const fleets = structuredClone(state.fleets)
            const destinationFleet = addNewFleet(state.activeFactionId, star, [], fleets);
            transferShips(sourceFleetMap, destinationFleet, fleets)
            return { ...state, fleets }
        }

        case 'next-turn':
            return progressTurn(state);
        case 'battles:auto-resolve': {
            const battle = getBattleAt(action.starId, state);
            if (!battle) {
                console.warn('no battle at star:', action.starId, state)
                return { ...state }
            }
            const battlesModalWasOpen = state.dialog?.role === 'battles';
            const newState = autoResolveBattle(battle, state);
            return {
                ...newState,
                starsWhereBattlesFoughtAlready: [...newState.starsWhereBattlesFoughtAlready, action.starId],
                dialog: battlesModalWasOpen && factionHasBattles(state.activeFactionId, newState)
                    ? { role: 'battles' }
                    : undefined
            }
        }
        case 'battles:launch':
            return {
                ...state,
                subProgram: {
                    type: 'battle',
                    starId: action.starId,
                }
            }
        case 'battles:result':
            const { report } = action
            const battlesModalWasOpen = state.dialog?.role === 'battles';

            const newState = structuredClone({
                ...state,
                reports: [...state.reports, report],
                starsWhereBattlesFoughtAlready: [...state.starsWhereBattlesFoughtAlready, report.star],
                fleets: updateFleetsFromBattleReport(report, state.fleets, state.factions)
            })
            return {
                ...newState,
                subProgram: undefined,
                dialog: battlesModalWasOpen && factionHasBattles(newState.activeFactionId, newState)
                    ? { role: 'battles' }
                    : undefined
            }
    }

}

export const useGameStateReducer = (inital: GameState) => {
    return useReducer(gameStateReducer, inital)
}
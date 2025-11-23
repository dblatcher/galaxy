import { useReducer } from "react"
import { reduceColonyAction, type ColonyControlAction } from "../actions/colony-control-actions"
import { reduceFleetDialogAction, type FleetDialogAction } from "../actions/fleet-dialog-actions"
import { reduceFleetOrderAction, type FleetOrderAction } from "../actions/fleet-order-actions"
import { autoResolveBattle } from "../lib/auto-battles"
import { updateFleetsFromBattleReport } from "../lib/battle-operations"
import { getBattleAt } from "../lib/derived-state"
import { factionHasBattles } from "../lib/fleet-operations"
import type { BattleReport, Dialog, Fleet, GameState, Star } from "../lib/model"
import { progressTurn } from "../lib/progress-turn"
import { isSet } from "../lib/util"



type SelectionAction = {
    type: 'select-star',
    target?: Star,
} | {
    type: 'select-fleet'
    target?: Fleet
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

export type Action = ColonyControlAction | FleetDialogAction | SelectionAction | FleetOrderAction | SpaceBattleActions |
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
        case 'select-fleet':
            return {
                ...state,
                selectedFleetId: action.target?.id,
                focusedStarId: !action.target ? state.focusedStarId : isSet(action.target?.orbitingStarId) ? state.focusedStarId : undefined,
            }
        case 'set-star-construction-design':
        case 'set-star-budget':
        case 'star-budget-lock':
            return reduceColonyAction(state, action)

        case "pick-destination":
        case "start-colony":
        case "order-bombing":
            return reduceFleetOrderAction(state, action)

        case 'fleets:transfer-ships':
        case 'fleets:transfer-to-new-fleet':
            return reduceFleetDialogAction(state, action);

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
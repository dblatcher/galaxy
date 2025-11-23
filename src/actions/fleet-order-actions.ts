import { createBudgetWithAllIn } from "../lib/colony-budget";
import { removeOneColonyShip, bombColony } from "../lib/colony-operations";
import { getBattleAt } from "../lib/derived-state";
import type { GameState, Star } from "../lib/model";
import { findById } from "../lib/util";

export type FleetOrderAction = {
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

export const reduceFleetOrderAction = (state: GameState, action: FleetOrderAction): GameState => {

    switch (action.type) {
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
    }

}
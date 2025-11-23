import { addNewFleet, transferShips } from "../lib/fleet-operations";
import type { GameState } from "../lib/model";
import { findById } from "../lib/util";

export type FleetDialogAction = {
    type: 'fleets:transfer-ships',
    fleetId: number,
    sourceFleetMap: Record<number, number[]>
} | {
    type: 'fleets:transfer-to-new-fleet',
    sourceFleetMap: Record<number, number[]>,
};


export const reduceFleetDialogAction = (state: GameState, action: FleetDialogAction): GameState => {
    switch (action.type) {
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
    }
}

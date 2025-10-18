import { useReducer } from "react"
import type { Action, GameState } from "../lib/model"
import { findById } from "../lib/util"

const gameStateReducer = (state: GameState, action: Action): GameState => {
    switch (action.type) {
        case "focus-star":
            // to do - optionally select the first fleet on the list for this star
            return { ...state, focusedStarId: action.target?.id, selectedFleetId: undefined }
        case "pick-destination":
            const activeFleet = findById(state.selectedFleetId, state.fleets);
            if (!activeFleet) {
                return state
            }
            activeFleet.destinationStarId = action.target.id
            return { ...state }
        case "select-fleet":
            return { ...state, selectedFleetId: action.target?.id }
    }

}

export const useGameStateReducer = (inital: GameState) => {
    return useReducer(gameStateReducer, inital)
}
import { useReducer } from "react"
import type { Fleet, GameState, Star } from "../lib/model"
import { progressTurn } from "../lib/progress-turn"
import { findById } from "../lib/util"

export type Action = {
    type: 'focus-star',
    target?: Star,
} | {
    type: 'pick-destination',
    target: Star,
} | {
    type: 'select-fleet'
    target?: Fleet
} | {
    type: 'next-turn'
}

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
        case "next-turn":
            return progressTurn(state);
    }

}

export const useGameStateReducer = (inital: GameState) => {
    return useReducer(gameStateReducer, inital)
}
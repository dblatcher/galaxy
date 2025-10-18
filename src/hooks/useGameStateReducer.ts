import { useReducer } from "react"
import type { Action, GameState } from "../lib/model"

const gameStateReducer = (state: GameState, action: Action): GameState => {
    switch (action.type) {
        case "pick-start":
            return { ...state, startStarId: action.target.id, }
        case "pick-destination":
            return { ...state, endStarId: action.target.id }
        case "clear-line":
            return { ...state, startStarId: undefined, endStarId: undefined }
        case "select-fleet":
            return { ...state, selectedFleetId: action.target?.id }
    }

}

export const useGameStateReducer = (inital: GameState) => {
    return useReducer(gameStateReducer, inital)
}
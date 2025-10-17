import { useReducer } from "react"
import type { Galaxy, Star } from "../lib/model"

type GameState = {
    galaxy: Galaxy
    startStarId?: number
    endStarId?: number
}

type Action = {
    type: 'clear-line'
} | {
    type: 'pick-start',
    target: Star,
} | {
    type: 'pick-destination',
    target: Star,
}

const gameStateReducer = (state: GameState, action: Action,): GameState => {
    switch (action.type) {
        case "pick-start":
            return { ...state, startStarId: action.target.id, }
        case "pick-destination":
            return { ...state, endStarId: action.target.id }
        case "clear-line":
            return { ...state, startStarId: undefined, endStarId: undefined }
    }

}

export const useGameState = (inital: GameState) => {

    return useReducer(gameStateReducer, inital)
}
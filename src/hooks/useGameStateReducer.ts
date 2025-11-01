import { useReducer } from "react"
import type { Dialog, Fleet, GameState, Star } from "../lib/model"
import { progressTurn } from "../lib/progress-turn"
import { findById } from "../lib/util"
import { getBattleAt } from "../lib/derived-state"
import { autoResolveBattle } from "../lib/auto-battles"

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
} | {
    type: 'resolve-battle'
    starId: number
} | {
    type: 'open-dialog'
    dialog: Dialog
} | {
    type: 'close-dialog'
}

const gameStateReducer = (state: GameState, action: Action): GameState => {
    if (state.dialog) {
        switch (action.type) {
            case 'close-dialog': {
                return { ...state, dialog: undefined }
            }
            default:
                return state
        }
    }

    switch (action.type) {
        case "open-dialog":
            return { ...state, dialog: action.dialog }
        case "close-dialog":
            return state
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
        case "resolve-battle": {
            const battle = getBattleAt(action.starId, state);
            if (!battle) {
                console.warn('no battle at star:', action.starId, state)
                return { ...state }
            }
            // TO DO - state to switch game mode to battle view
            return autoResolveBattle(battle, state)
        }
        case "next-turn":
            return progressTurn(state);
    }

}

export const useGameStateReducer = (inital: GameState) => {
    return useReducer(gameStateReducer, inital)
}
import type { ActionDispatch } from "react";
import type { Action, GameState, Star } from "./model";

export const handleStarClickFunction = ({ startStarId }: GameState, dispatch: ActionDispatch<[action: Action]>) => (star: Star) => {
    if (star.id === startStarId) {
        dispatch({ type: 'clear-line' })
        return
    }
    if (!startStarId) {
        dispatch({ type: 'pick-start', target: star })
        return
    }
    dispatch({ type: 'pick-destination', target: star })
}

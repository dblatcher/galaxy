import type { ActionDispatch } from "react";
import type { GameState, Star } from "./model";
import { isSet } from "./util";
import type { Action } from "../hooks/useGameStateReducer";

export const handleStarClickFunction = ({ focusedStarId, selectedFleetId }: GameState, dispatch: ActionDispatch<[action: Action]>) => (star: Star) => {

    if (isSet(selectedFleetId) && isSet(focusedStarId) && star.id !== focusedStarId) {
        dispatch({ type: 'pick-destination', target: star })
        return
    }
    if (star.id === focusedStarId) {
        dispatch({ type: 'focus-star' });
        return
    }
    dispatch({ type: 'focus-star', target: star })
}

import type { ActionDispatch } from "react";
import type { Action, GameState, Star } from "./model";
import { isSet } from "./util";

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

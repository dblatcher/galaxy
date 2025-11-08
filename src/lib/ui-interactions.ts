import type { ActionDispatch } from "react";
import type { GameState, Star } from "./model";
import { findById, isSet } from "./util";
import type { Action } from "../hooks/useGameStateReducer";

export const handleStarClickFunction = (
    { focusedStarId, selectedFleetId, fleets }: GameState,
    dispatch: ActionDispatch<[action: Action]>
) => (star: Star) => {

    const selectedFleet = findById(selectedFleetId, fleets);
    const clickedOnFocusedStar = star.id === focusedStarId

    if (selectedFleet && !clickedOnFocusedStar) {
        dispatch({ type: 'pick-destination', target: star })
        return
    }
    if (
        clickedOnFocusedStar &&
        selectedFleet &&
        selectedFleet.orbitingStarId === star.id &&
        isSet(selectedFleet.destinationStarId)
    ) {
        dispatch({ type: 'pick-destination', target: undefined })
        return
    }
    if (clickedOnFocusedStar) {
        dispatch({ type: 'focus-star', target: undefined });
        return
    }
    dispatch({ type: 'focus-star', target: star })
}

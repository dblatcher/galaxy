import type { ActionDispatch } from "react";
import type { GameState, Star } from "./model";
import { findById, isSet } from "./util";
import type { Action } from "../hooks/useGameStateReducer";

export const handleStarClickFunction = (
    { focusedStarId, selectedFleetId, fleets, activeFactionId }: GameState,
    dispatch: ActionDispatch<[action: Action]>
) => (star: Star) => {

    const selectedFleet = findById(selectedFleetId, fleets);
    const clickedOnFocusedStar = star.id === focusedStarId;
    const clickedOnOrbitedStart = star.id === selectedFleet?.orbitingStarId;
    const canDirectFleet = selectedFleet?.factionId === activeFactionId && isSet(selectedFleet.orbitingStarId);

    if (canDirectFleet && !clickedOnOrbitedStart) {
        return dispatch({ type: 'pick-destination', target: star })
    }
    if (
        canDirectFleet &&
        clickedOnOrbitedStart &&
        isSet(selectedFleet.destinationStarId)
    ) {
        return dispatch({ type: 'pick-destination', target: undefined })
    }
    if (clickedOnFocusedStar) {
        return dispatch({ type: 'select-star', target: undefined });
    }
    return dispatch({ type: 'select-star', target: star })
}

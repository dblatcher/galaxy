import { useContext } from "react";
import { GameStateContext } from "../context/gameStateContext";
import type { GameState } from "../lib/model";

const getDerivedState = (gameState: GameState) => {
    const { galaxy, focusedStarId } = gameState;
    const startStar = galaxy.stars.find(star => star.id === focusedStarId);
    const activeStarId = focusedStarId;

    return { activeStarId, startStar }
}

export const useGameStateContext = () => {
    const gameStateContext = useContext(GameStateContext)
    return { ...gameStateContext, ...getDerivedState(gameStateContext.gameState) }
}

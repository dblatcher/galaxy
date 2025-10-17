import { useContext } from "react";
import { GameStateContext } from "../context/gameStateContext";
import type { GameState, Line } from "../lib/model";

const getDerivedState = (gameState: GameState) => {
    const { galaxy, startStarId, endStarId } = gameState;
    const startStar = galaxy.stars.find(star => star.id === startStarId);
    const endStar = galaxy.stars.find(star => star.id === endStarId);
    const line: Line | undefined = startStar && endStar ? { points: [startStar, endStar] } : undefined;

    const activeStarId = startStarId;

    return { line, activeStarId }
}

export const useGameStateContext = () => {
    const gameStateContext = useContext(GameStateContext)
    return { ...gameStateContext, ...getDerivedState(gameStateContext.gameState) }
}

import { useContext } from "react";
import { GameStateContext } from "./gameStateContext";
import { getDerivedState } from "./derived-state";


export const useGameStateContext = () => {
    const gameStateContext = useContext(GameStateContext)
    return { ...gameStateContext, ...getDerivedState(gameStateContext.gameState) }
}

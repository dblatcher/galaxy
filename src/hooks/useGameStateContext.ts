import { useContext } from "react";
import { GameStateContext } from "../context/gameStateContext";
import { getDerivedState } from "../lib/derived-state";


export const useGameStateContext = () => {
    const gameStateContext = useContext(GameStateContext)
    return { ...gameStateContext, ...getDerivedState(gameStateContext.gameState) }
}

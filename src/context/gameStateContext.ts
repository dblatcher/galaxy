import { createContext } from "react";
import type { GameState } from "../lib/model";
import type { Action } from "../hooks/useGameStateReducer";

export const GameStateContext = createContext<{ gameState: GameState, dispatch: { (action: Action): void } }>({
    gameState: {
        turnNumber: 0,
        galaxy: {
            stars: [],
            width: 100,
            height: 100
        },
        fleets: [],
        factions: [
            {
                id: 0,
                name: "",
                color: "",
                playerType: "LOCAL"
            }
        ],
        activeFactionId: 0,
    },
    dispatch() { },
});

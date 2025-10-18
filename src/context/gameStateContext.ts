import { createContext } from "react";
import type { Action, GameState } from "../lib/model";

export const GameStateContext = createContext<{ gameState: GameState, dispatch: { (action: Action): void } }>({
    gameState: {
        galaxy: {
            stars: [],
            width: 100,
            height: 100
        },
        fleets: [],
        factions: [],
    },
    dispatch() { },
});

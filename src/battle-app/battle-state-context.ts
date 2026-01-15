import { createContext, useContext, type ActionDispatch } from "react";
import type { BattleAction, BattleState } from "./model";

export const BattleStateContext = createContext<{
    battleState: BattleState,
    dispatch: ActionDispatch<[action: BattleAction]>
}>({
    battleState: {
        sides: [],
        shipStates: {},
        activeFaction: 0
    },
    dispatch: () => { }
})

export const useBattleState = () => useContext(BattleStateContext)

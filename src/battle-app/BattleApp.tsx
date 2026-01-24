import { useEffect, useReducer } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { BattleParameters } from "../lib/model"
import { BattleStateContext } from "./battle-state-context"
import { dispatchBattleAction, getInitialState } from "./battle-state-reducer"
import { MainLayout } from "./components/MainLayout"
import { startCpuPlayerAutomation } from "./cpu-automation"
import { getActiveFaction } from "./helpers"

interface Props {
    params: BattleParameters
}

export const BattleApp = ({ params }: Props) => {
    const { gameState, dispatch: gameStateDispatch } = useGameStateContext()
    const [battleState, dispatch] = useReducer(
        dispatchBattleAction,
        getInitialState(params.starId, gameState)
    )

    useEffect(() => {
        const faction = getActiveFaction(battleState);
        if (faction?.playerType === 'CPU') {
            startCpuPlayerAutomation(battleState, dispatch)
        }
    }, [battleState.activeFaction])

    const conclude = () => {
        gameStateDispatch({
            type: 'battles:result', report: {
                star: params.starId,
                reportType: 'battle',
                turnNumber: gameState.turnNumber,
                sides: battleState.sides,
            }
        })
    }

    return (
        <BattleStateContext.Provider value={{ battleState, dispatch }}>
            <button onClick={conclude}>conclude</button>
            <MainLayout />
        </BattleStateContext.Provider>
    )
}
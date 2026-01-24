import { useEffect, useReducer } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { BattleParameters } from "../lib/model"
import { AnimationContext } from "./animation-context"
import { animationDispatcher, getInitialAnimationState } from "./animation-reducer"
import { BattleStateContext } from "./battle-state-context"
import { dispatchBattleAction, getInitialState } from "./battle-state-reducer"
import { MainLayout } from "./components/MainLayout"
import { ANIMATION_STEP_MS } from "./constants"
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
    const [animationState, dispatchAnimationAction] = useReducer(
        animationDispatcher,
        getInitialAnimationState()
    )

    useEffect(() => {
        const progressAnimations =() => {
            dispatchAnimationAction({type: 'tick'})
        }
        const timer = setInterval(progressAnimations, ANIMATION_STEP_MS)
        return () => {
            clearInterval(timer)
        }
    }, [])

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
            <AnimationContext.Provider value={{ animationState, dispatchAnimationAction }}>
                <button onClick={conclude}>conclude</button>
                <MainLayout />
            </AnimationContext.Provider>
        </BattleStateContext.Provider>
    )
}
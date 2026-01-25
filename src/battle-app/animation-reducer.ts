import type { XY } from "typed-geometry"
import { filterInPlace } from "../lib/util"

export type BattleAnimation = {
    type: 'beam-fire',
    from: XY,
    to: XY,
    totalSteps: number,
    currentStep: number
} | {
    type: 'ship-explode',
    at: XY,
    totalSteps: number,
    currentStep: number
}

export type AnimationState = {
    animations: BattleAnimation[]
}

export type AnimationAction =
    { type: 'tick' } |
    { type: 'clear' } |
    { type: 'add', effects: BattleAnimation[] }

export const getInitialAnimationState = (): AnimationState => (
    { animations: [] }
)

export const animationDispatcher = (prevState: AnimationState, action: AnimationAction): AnimationState => {
    const state = structuredClone(prevState)

    switch (action.type) {
        case "tick":
            state.animations.forEach(animation => {
                animation.currentStep += 1
            })
            filterInPlace(state.animations, (animation => animation.currentStep < animation.totalSteps))
            return { ...state }
        case "clear":
            return getInitialAnimationState()
        case "add":
            state.animations.push(...action.effects)
            return { ...state }
    }
}
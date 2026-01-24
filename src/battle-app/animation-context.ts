import { createContext, useContext, type ActionDispatch } from "react";
import type { AnimationAction, AnimationState } from "./animation-reducer";

export const AnimationContext = createContext<{
    animationState: AnimationState,
    dispatchAnimationAction: ActionDispatch<[action: AnimationAction]>
}>({
    animationState: {
        animations: []
    },
    dispatchAnimationAction: () => { }
})

export const useAnimationState = () => useContext(AnimationContext)

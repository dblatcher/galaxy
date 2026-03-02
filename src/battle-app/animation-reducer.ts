import { getDistance, getHeadingFrom, getXYVector, translate, type XY } from "typed-geometry"
import { filterInPlace } from "../lib/util"
import type { BattleState, ShipIdent } from "./model"
import { destringifyIdent, getShipStateFromIdent, stringifyIdent } from "./helpers"
import { ANIMATION_MOVE_PER_STEP } from "./constants"

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
} | {
    type: 'show-damage',
    at: XY,
    totalSteps: number,
    currentStep: number,
    value: number,
}

export type AnimationState = {
    animations: BattleAnimation[]
    shipMoves: Record<string, { displayPosition: XY }>
}

export type AnimationAction =
    { type: 'tick', battleState: BattleState } |
    { type: 'clear' } |
    { type: 'add', effects: BattleAnimation[] } |
    { type: 'set-display-location', ident: ShipIdent, location: XY | undefined }

export const getInitialAnimationState = (): AnimationState => (
    { animations: [], shipMoves: {} }
)

export const animationDispatcher = (prevState: AnimationState, action: AnimationAction): AnimationState => {
    const state = structuredClone(prevState)

    switch (action.type) {
        case "tick":
            const movingShipKeys = Object.keys(state.shipMoves)
            if (state.animations.length === 0 && movingShipKeys.length === 0) {
                return prevState
            }
            state.animations.forEach(animation => {
                animation.currentStep += 1
            })
            filterInPlace(state.animations, (animation => animation.currentStep < animation.totalSteps))
            movingShipKeys.forEach(key => {
                const { displayPosition } = state.shipMoves[key];
                const ident = destringifyIdent(key)
                const shipState = getShipStateFromIdent(ident, action.battleState)
                if (shipState) {
                    const distance = getDistance(displayPosition, shipState.position)
                    const heading = getHeadingFrom(displayPosition, shipState.position)
                    if (distance < 1) {
                        delete state.shipMoves[key]
                    } else {
                        state.shipMoves[key] = { displayPosition: translate(displayPosition, getXYVector(ANIMATION_MOVE_PER_STEP, heading)) };
                    }
                }
            })
            return { ...state }
        case "clear":
            return getInitialAnimationState()
        case "add":
            state.animations.push(...action.effects)
            return { ...state }
        case "set-display-location":
            const { location, ident } = action
            const key = stringifyIdent(ident)
            if (location) {
                state.shipMoves[key] = { displayPosition: location }
            } else {
                delete state.shipMoves[key]
            }
            return { ...state }
    }
}
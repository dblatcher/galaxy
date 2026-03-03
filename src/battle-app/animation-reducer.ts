import { getDistance, getHeadingFrom, getXYVector, translate, type XY } from "typed-geometry"
import { filterInPlace } from "../lib/util"
import { ANIMATION_MOVE_PER_STEP } from "./constants"
import { stringifyIdent } from "./helpers"
import type { ShipIdent } from "./model"

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

export type MovementAnimation = { displayPosition: XY, waypoints: XY[] };

export type AnimationState = {
    animations: BattleAnimation[]
    shipMoves: Partial<Record<string, MovementAnimation>>
}

export type AnimationAction =
    { type: 'tick' } |
    { type: 'clear' } |
    { type: 'add', effects: BattleAnimation[] } |
    { type: 'set-display-location', ident: ShipIdent, location: XY, destination: XY }

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
                const { displayPosition, waypoints } = state.shipMoves[key]!;
                const [nextPoint] = waypoints;

                if (!nextPoint) {
                    delete state.shipMoves[key]
                    return
                }
                const distance = getDistance(displayPosition, nextPoint)
                const heading = getHeadingFrom(displayPosition, nextPoint)
                if (distance < 1) {
                    waypoints.shift();
                    state.shipMoves[key] = {
                        displayPosition: nextPoint,
                        waypoints
                    }
                    return
                }
                state.shipMoves[key] = {
                    displayPosition: translate(displayPosition, getXYVector(ANIMATION_MOVE_PER_STEP, heading)),
                    waypoints
                };
            })
            return { ...state }
        case "clear":
            return getInitialAnimationState()
        case "add":
            state.animations.push(...action.effects)
            return { ...state }
        case "set-display-location":
            const { location, ident, destination } = action
            const key = stringifyIdent(ident)

            const existingAnimation = state.shipMoves[key];

            if (existingAnimation) {
                existingAnimation.waypoints.push(destination)
            } else {
                state.shipMoves[key] = {
                    displayPosition: location,
                    waypoints: [destination]
                }
            }

            return { ...state }
    }
}
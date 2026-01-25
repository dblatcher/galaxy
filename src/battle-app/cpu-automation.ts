import { type ActionDispatch } from "react";
import { getDistance, translate } from "typed-geometry";
import { limitDistance } from "../lib/util";
import type { AnimationAction, BattleAnimation } from "./animation-reducer";
import { dispatchBattleAction } from "./battle-state-reducer";
import { ANIMATION_MOVE_PER_STEP, ANIMATION_STEP_MS } from "./constants";
import { handleFiring } from "./game-logic";
import { getAllActiveSideShips, getAllOtherSideShips } from "./helpers";
import type { BattleAction, BattleState } from "./model";


const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const calculateMovementAnimationTime = (greatestDistance: number): number => {
    return ANIMATION_STEP_MS * (greatestDistance / ANIMATION_MOVE_PER_STEP)
}

type ActionGenerator = {
    (battleState: BattleState): {
        battleActions: BattleAction[],
        animations: BattleAnimation[]
        animationTime: number
    }
}

const moveAllAtRandom = (xd: number): ActionGenerator => (battleState) => {
    const battleActions: BattleAction[] = []
    const animations: BattleAnimation[] = []
    const ships = getAllActiveSideShips(battleState);
    const valuesForTiming = { greatestDistance: 0 }

    ships.forEach(({ ident, state }) => {
        const y = Math.floor((Math.random() * 30) - 20)
        const newDestination = translate(state.position, { x: xd, y });
        const newLocation = limitDistance(state.remainingMovement, state.position, newDestination);
        const distance = getDistance(state.position, newLocation);
        valuesForTiming.greatestDistance = Math.max(distance, valuesForTiming.greatestDistance)
        battleActions.push({
            type: 'move-ship',
            ident,
            location: newLocation
        })
    })

    return {
        battleActions,
        animations,
        animationTime: calculateMovementAnimationTime(valuesForTiming.greatestDistance)
    }
}


const allFireOnTargets: ActionGenerator = (battleState) => {
    const battleActions: BattleAction[] = []
    const animations: BattleAnimation[] = []
    const ships = getAllActiveSideShips(battleState);
    const targets = getAllOtherSideShips(battleState)

    ships.forEach((ship) => {
        const targetShip = targets[0]; // TO DO - select from ships in range
        const outcome = handleFiring(ship, targetShip)
        if (!outcome) { return }
        animations.push(...outcome.animations);
        battleActions.push(outcome.battleAction)
    })

    return {
        battleActions,
        animations,
        animationTime: Math.max(...animations.map(animation => animation.totalSteps)) * ANIMATION_STEP_MS
    }
}

export const startCpuPlayerAutomation = async (
    battleState: BattleState,
    dispatchAction: ActionDispatch<[action: BattleAction]>,
    dispatchAnimation: ActionDispatch<[action: AnimationAction]>
) => {

    let localCopyOfState = structuredClone(battleState);
    const dispatchAndUpdateLocal = (action: BattleAction) => {
        dispatchAction(action)
        localCopyOfState = dispatchBattleAction(localCopyOfState, action)
    }

    const doActions = async (generate: ActionGenerator) => {
        const { battleActions, animationTime, animations } = generate(localCopyOfState)
        battleActions.forEach(dispatchAndUpdateLocal)
        dispatchAnimation({
            type: 'add',
            effects: animations
        })
        await delay(animationTime)
    }

    await doActions(moveAllAtRandom(-20))
    await doActions(allFireOnTargets)

    dispatchAction(({ type: 'end-turn' }))
}

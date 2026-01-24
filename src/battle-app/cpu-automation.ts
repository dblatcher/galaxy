import { type ActionDispatch } from "react";
import { getDistance, translate } from "typed-geometry";
import { dispatchBattleAction } from "./battle-state-reducer";
import { ANIMATION_MOVE_PER_STEP, ANIMATION_STEP_MS } from "./constants";
import { getActiveSide, getInstancesForSide } from "./helpers";
import type { BattleAction, BattleState } from "./model";


const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const calculateAnimationTime = (greatestDistance: number): number => {
    return ANIMATION_STEP_MS * (greatestDistance / ANIMATION_MOVE_PER_STEP)
}

export const startCpuPlayerAutomation = async (battleState: BattleState, dispatch: ActionDispatch<[action: BattleAction]>) => {

    let localCopyOfState = structuredClone(battleState);
    const dispatchAndUpdateLocal = (action: BattleAction) => {
        dispatch(action)
        localCopyOfState = dispatchBattleAction(localCopyOfState, action)
    }

    const side = getActiveSide(localCopyOfState);
    if (!side) {
        return
    }

    const ships = getInstancesForSide(side, localCopyOfState, true)
    const valuesForTiming = {
        greatestDistance: 0
    }

    ships.forEach(({ ident, state }) => {
        const y = Math.floor((Math.random() * 20) - 10)
        const newLocation = translate(state.position, { x: -20, y });
        const distance = getDistance(state.position, newLocation);
        valuesForTiming.greatestDistance = Math.max(distance, valuesForTiming.greatestDistance)
        dispatchAndUpdateLocal({
            type: 'move-ship',
            ident,
            location: newLocation
        })
    })

    await delay(calculateAnimationTime(valuesForTiming.greatestDistance))


    dispatch(({ type: 'end-turn' }))
}

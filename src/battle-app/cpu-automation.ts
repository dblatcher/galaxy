import { type ActionDispatch } from "react";
import { getDistance, translate, type XY } from "typed-geometry";
import { limitDistance } from "../lib/util";
import type { AnimationAction, BattleAnimation } from "./animation-reducer";
import { dispatchBattleAction } from "./battle-state-reducer";
import { ANIMATION_MOVE_PER_STEP, ANIMATION_STEP_MS } from "./constants";
import { handleFiring, handleMove } from "./game-logic";
import { getAllActiveSideShips, getAllOtherSideShips, identsMatch } from "./helpers";
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

    ships.forEach((ship) => {
        const { state } = ship
        const newDestination = translate(state.position, { x: xd, y: Math.floor((Math.random() * 30) - 20) });
        const newLocation = limitDistance(state.remainingMovement, state.position, newDestination);
        const distance = getDistance(state.position, newLocation);

        const outcome = handleMove(ship, newLocation, battleState);
        battleActions.push(...outcome.battleActions)
        valuesForTiming.greatestDistance = Math.max(distance, valuesForTiming.greatestDistance)
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
        animations.push(...outcome.animations);
        battleActions.push(...outcome.battleActions)
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

        const placesWithDamage = new Map<string, number>()
        const stingifyXy = ({ x, y }: XY) => `${x},${y}`
        animations.filter(a => a.type === 'show-damage').forEach((a) => {
            const damageEffectsCountAtPlaceSoFar = placesWithDamage.get(stingifyXy(a.at)) ?? 0
            a.currentStep -= damageEffectsCountAtPlaceSoFar * 40
            placesWithDamage.set(stingifyXy(a.at), (damageEffectsCountAtPlaceSoFar + 1))
        })

        dispatchAnimation({
            type: 'add',
            effects: animations
        })
        await delay(animationTime)
    }

    await doActions(moveAllAtRandom(-20))
    await doActions(allFireOnTargets)

    // allFireOnTargets can fail to add explosions when a ship ist destroyed
    // with multiple simulataneou attacks 
    const shipsThatDied = getAllOtherSideShips(battleState)
        .filter(initialShip =>
            !getAllOtherSideShips(localCopyOfState)
                .some(finalShip =>
                    identsMatch(initialShip.ident, finalShip.ident)));
    dispatchAnimation({
        type: 'add', effects: shipsThatDied.map((ship): BattleAnimation => {
            return {
                type: 'ship-explode',
                at: ship.state.position,
                currentStep: 0,
                totalSteps: 50,
            }
        })
    });


    dispatchAction(({ type: 'end-turn' }))
}

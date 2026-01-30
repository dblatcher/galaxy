import { getDistance, type XY } from "typed-geometry";
import type { BattleAnimation } from "./animation-reducer";
import { DEFAULT_WEAPON_RANGE } from "./constants";
import { isAlive } from "./helpers";
import type { BattleAction, BattleState, ShipInstanceInfo } from "./model";

export const handleFiring = (
    firingShipInstance: ShipInstanceInfo,
    targetShipInstance: ShipInstanceInfo
): {
    animations: BattleAnimation[],
    battleActions: BattleAction[],
} => {
    const animations: BattleAnimation[] = []
    const battleActions: BattleAction[] = []

    if (firingShipInstance.state.hasFired || !isAlive(firingShipInstance) || !isAlive(targetShipInstance)) {
        return { animations, battleActions }
    }

    const distance = getDistance(targetShipInstance.state.position, firingShipInstance.state.position);
    if (distance > DEFAULT_WEAPON_RANGE) {
        return { animations, battleActions }
    }
    const damage = 1 // TO DO - use shipInstance.design.slots to roll damage for weapons and subtract defense
    const beamSteps = Math.floor(distance / 2);
    animations.push({
        type: "beam-fire",
        from: { ...firingShipInstance.state.position },
        to: { ...targetShipInstance.state.position },
        totalSteps: beamSteps,
        currentStep: 0
    })

    animations.push({
        type: 'show-damage',
        at: { ...targetShipInstance.state.position },
        value: damage,
        totalSteps: 100,
        currentStep: 0
    })

    const spaceVehicleWillBeDestroyed = targetShipInstance.ship.damage + damage >= targetShipInstance.design.hp;
    if (spaceVehicleWillBeDestroyed) {
        animations.push({
            type: 'ship-explode',
            at: { ...targetShipInstance.state.position },
            currentStep: -beamSteps,
            totalSteps: 50
        })
        // PROBLEM - if many ships fire at once, do not know cumulative damage
        // have added a work-around in cpu-automation
    }



    battleActions.push({
        type: 'resolve-fire',
        damage,
        distance,
        target: {
            ...targetShipInstance.ident
        },
        attacker: {
            ...firingShipInstance.ident
        }
    })

    return { battleActions, animations }
}

export const handleMove = (
    movingShipInstance: ShipInstanceInfo,
    location: XY,
    _battleState: BattleState,
): {
    animations: BattleAnimation[],
    battleActions: BattleAction[],
} => {

    if (!isAlive(movingShipInstance)) {
        return {
            animations: [],
            battleActions: [],
        }
    }
    // TO DO - prevent moving into other ships (OR ALLOW RAMMING!)
    // TO DO - no moving out of bounds

    const distance = getDistance(location, movingShipInstance.state.position)
    if (distance > movingShipInstance.state.remainingMovement) {
        return {
            animations: [],
            battleActions: [],
        }
    }

    return {
        animations: [],
        battleActions: [
            { type: 'move-ship', location, ident: movingShipInstance.ident, }
        ]
    }
}


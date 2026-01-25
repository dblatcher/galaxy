import { getDistance, type XY } from "typed-geometry";
import type { BattleAnimation } from "./animation-reducer";
import { DEFAULT_WEAPON_RANGE } from "./constants";
import type { ShipInstanceInfo, BattleAction, BattleState } from "./model";

export const handleFiring = (
    firingShipInstance: ShipInstanceInfo,
    targetShipInstance: ShipInstanceInfo
): {
    animations: BattleAnimation[],
    battleAction: BattleAction,
} | undefined => {

    if (firingShipInstance.state.hasFired) {
        return undefined
    }

    const distance = getDistance(targetShipInstance.state.position, firingShipInstance.state.position);
    if (distance > DEFAULT_WEAPON_RANGE) {
        return undefined
    }
    const damage = 1 // TO DO - use shipInstance.design.slots to roll damage for weapons and subtract defense
    const beamSteps = Math.floor(distance / 2);
    const beamAnimation: BattleAnimation = {
        type: "beam-fire",
        from: { ...firingShipInstance.state.position },
        to: { ...targetShipInstance.state.position },
        totalSteps: beamSteps,
        currentStep: 0
    }
    // TO DO - if the target will die, add explosion effect with currentStep at -beamSteps

    const battleAction: BattleAction = {
        type: 'resolve-fire',
        damage,
        distance,
        target: {
            ...targetShipInstance.ident
        },
        attacker: {
            ...firingShipInstance.ident
        }
    }

    return { battleAction, animations: [beamAnimation] }
}

export const handleMove = (
    movingShipInstance: ShipInstanceInfo,
    destination: XY,
    _battleState: BattleState,
): {
    animations: BattleAnimation[],
    battleAction: BattleAction,
} | undefined => {

    // TO DO - prevent moving into other ships (OR ALLOW RAMMING!)
    // TO DO - no moving out of bounds

    const distance = getDistance(destination, movingShipInstance.state.position)

    if (distance > movingShipInstance.state.remainingMovement) {
        return undefined
    }

    return {
        animations: [],
        battleAction: {
            type: 'move-ship',
            location: destination,
            ident: movingShipInstance.ident,
        }
    }
}


import { getDistance, type XY } from "typed-geometry";
import { getMaybeEquipment } from "../data/ship-equipment";
import { diceRoll, sum } from "../lib/util";
import type { AnimationAction, BattleAnimation } from "./animation-reducer";
import { DEFAULT_WEAPON_RANGE, MAP_HEIGHT, MAP_WIDTH, SHIP_RADIUS } from "./constants";
import { checkCanFire, getAllActiveSideShips, getAllOtherSideShips, identsMatch, isAlive } from "./helpers";
import type { BattleAction, BattleState, ShipInstanceInfo } from "./model";

const rollDamage = (
    firingShipInstance: ShipInstanceInfo,
): number => {
    const weapons = firingShipInstance.design.slots
        .map(getMaybeEquipment)
        .flatMap(e => e?.info.type == 'beam' ? e.info : [])

    const rolls = weapons.map(beam =>
        sum(beam.damage.map(die => diceRoll(die)))
    )
    return sum(rolls)
}

const doNothing = () => ({
    animations: [],
    battleActions: [],
    animationActions: [],
})

export const handleFiring = (
    firingShipInstance: ShipInstanceInfo,
    targetShipInstance: ShipInstanceInfo
): {
    animations: BattleAnimation[],
    battleActions: BattleAction[],
} => {
    const animations: BattleAnimation[] = []
    const battleActions: BattleAction[] = []

    if (!checkCanFire(firingShipInstance) || !isAlive(firingShipInstance) || !isAlive(targetShipInstance)) {
        return doNothing();
    }

    const distance = getDistance(targetShipInstance.state.position, firingShipInstance.state.position);
    if (distance > DEFAULT_WEAPON_RANGE) {
        return doNothing();
    }
    const damage = rollDamage(firingShipInstance) // TO DO - use shipInstance.design.slots to roll damage for weapons and subtract defense
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

export const getCannotMoveReason = (
    movingShipInstance: ShipInstanceInfo,
    location: XY,
    battleState: BattleState,
) => {

    if (!isAlive(movingShipInstance)) {
        return 'dead'
    }

    if (
        location.x < 0 ||
        location.y < 0 ||
        location.x > MAP_WIDTH ||
        location.y > MAP_HEIGHT
    ) {
        return 'out-of-bounds'
    }

    const distance = getDistance(location, movingShipInstance.state.position)
    if (distance > movingShipInstance.state.remainingMovement) {
        return 'too-far'
    }

    const otherShips = [
        ...getAllActiveSideShips(battleState),
        ...getAllOtherSideShips(battleState)
    ]
        .filter(ship => !identsMatch(ship.ident, movingShipInstance.ident))

    const tooClose = otherShips.find(ship => getDistance(ship.state.position, location) < SHIP_RADIUS)
    if (tooClose) {
        return 'too-close-to-other'
    }

    return undefined
}

export const handleMove = (
    movingShipInstance: ShipInstanceInfo,
    location: XY,
    battleState: BattleState,
): {
    animations: BattleAnimation[],
    battleActions: BattleAction[],
    animationActions: AnimationAction[],
} => {

    const cannotMove = getCannotMoveReason(movingShipInstance, location, battleState)
    if (cannotMove) {
        return doNothing();
    }
    // TO DO - prevent passing through  other ships (OR ALLOW RAMMING!)

    return {
        animations: [],
        battleActions: [
            { type: 'move-ship', location, ident: movingShipInstance.ident, }
        ],
        animationActions: [
            { type: 'set-display-location', ident: movingShipInstance.ident, location: { ...movingShipInstance.state.position } },
        ]
    }
}


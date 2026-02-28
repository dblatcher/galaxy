import { type ActionDispatch } from "react";
import { getDistance, translate, type XY } from "typed-geometry";
import { limitDistance } from "../lib/util";
import type { AnimationAction, BattleAnimation } from "./animation-reducer";
import { dispatchBattleAction } from "./battle-state-reducer";
import { ANIMATION_MOVE_PER_STEP, ANIMATION_STEP_MS, DEFAULT_WEAPON_RANGE } from "./constants";
import { handleFiring, handleMove } from "./game-logic";
import { getAllActiveSideShips, getAllOtherSideShips, getShipStateFromIdent, identsMatch } from "./helpers";
import type { BattleAction, BattleState, ShipIdent, ShipInstanceInfo } from "./model";


const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const calculateMovementAnimationTime = (greatestDistance: number): number => {
    return ANIMATION_STEP_MS * (greatestDistance / ANIMATION_MOVE_PER_STEP)
}

type ActionGenerator = {
    (battleState: Readonly<BattleState>): {
        battleActions: BattleAction[],
        animations: BattleAnimation[]
        animationTime: number
    }
}

const decidePlace = (ident: ShipIdent, state: Readonly<BattleState>): XY | undefined => {
    const ship = getShipStateFromIdent(ident, state)
    if (!ship) { return }
    // const others = getAllActiveSideShips(state).filter(otherShip => !identsMatch(ident, otherShip.ident))
    const newDestination = translate(ship.position, { x: -10, y: Math.floor((Math.random() * 30) - 20) });
    const newLocation = limitDistance(ship.remainingMovement, ship.position, newDestination);
    return newLocation
}

const moveEachInTurn = (): ActionGenerator => (battleState) => {
    let anticipatedState = structuredClone(battleState);
    const battleActions: BattleAction[] = []
    const animations: BattleAnimation[] = []
    const valuesForTiming = { greatestDistance: 0 }

    const ships = getAllActiveSideShips(anticipatedState);

    ships.forEach(ship => {
        const place = decidePlace(ship.ident, anticipatedState)
        if (place) {
            const distance = getDistance(place, ship.state.position)
            const outcome = handleMove(ship, place, battleState);
            battleActions.push(...outcome.battleActions)
            animations.push(...outcome.animations)
            outcome.battleActions.forEach(action => {
                anticipatedState = dispatchBattleAction(anticipatedState, action)
            })

            valuesForTiming.greatestDistance = Math.max(distance, valuesForTiming.greatestDistance)
        }
    })

    return {
        battleActions,
        animations,
        animationTime: calculateMovementAnimationTime(valuesForTiming.greatestDistance)
    }
}

const decideTarget = (ident: ShipIdent, state: Readonly<BattleState>): ShipInstanceInfo | undefined => {
    const ship = getShipStateFromIdent(ident, state)
    if (!ship) {
        return undefined
    }
    const targets =
        getAllOtherSideShips(state)
            .filter(t => getDistance(t.state.position, ship.position) <= DEFAULT_WEAPON_RANGE) 
            
    //  TO DO - select from ships in range based on threat, value, damage etc
    return targets[0]
}

const allFireOnTargets: ActionGenerator = (battleState) => {
    let anticipatedState = structuredClone(battleState);
    const battleActions: BattleAction[] = []
    const animations: BattleAnimation[] = []

    const ships = getAllActiveSideShips(battleState);

    ships.forEach((ship) => {
        const targetShip = decideTarget(ship.ident, anticipatedState)

        if (targetShip) {
            const outcome = handleFiring(ship, targetShip)
            outcome.battleActions.forEach(action => {
                anticipatedState = dispatchBattleAction(anticipatedState, action)
            })
            animations.push(...outcome.animations);
            battleActions.push(...outcome.battleActions)
        }
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

    await doActions(moveEachInTurn())
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

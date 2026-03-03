import { type ActionDispatch } from "react";
import { getDistance, translate, xy, type XY } from "typed-geometry";
import type { AnimationAction, AnimationState, BattleAnimation } from "./animation-reducer";
import { dispatchBattleAction } from "./battle-state-reducer";
import { ANIMATION_STEP_MS, DEFAULT_WEAPON_RANGE } from "./constants";
import { getCannotMoveReason, handleFiring, handleMove } from "./game-logic";
import { getAllActiveSideShips, getAllOtherSideShips, getInstanceFromIdent, getShipStateFromIdent } from "./helpers";
import type { BattleAction, BattleState, ShipIdent, ShipInstanceInfo } from "./model";

const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type ActionGenerator = {
    (battleState: Readonly<BattleState>): {
        battleActions: BattleAction[],
        animations: BattleAnimation[],
        animationActions: AnimationAction[],
        animationTime: number
    }
}

const getPossibleLocations = (ship: ShipInstanceInfo, state: Readonly<BattleState>, moveGranularity = 20): XY[] => {
    const { position, remainingMovement } = ship.state;

    const possibleDistances = [
        ...Array(Math.floor(remainingMovement / moveGranularity)).fill(0).map((_v, i) => i * moveGranularity),
        remainingMovement
    ]
    const possibleDistancesWithNegatives = [
        ...possibleDistances,
        ...possibleDistances.filter(v => v > 0).map(v => -v)
    ]
    const locations: XY[] = possibleDistancesWithNegatives
        .flatMap(xd => possibleDistancesWithNegatives
            .map(yd => xy(xd, yd)))
        .map(displacement => translate(position, displacement))

    return locations.filter(location => !getCannotMoveReason(ship, location, state))
}

const decidePlace = (ident: ShipIdent, state: Readonly<BattleState>): XY | undefined => {
    const ship = getInstanceFromIdent(ident, state)
    if (!ship) { return }

    const options = getPossibleLocations(ship, state);
    if (!options.length) {
        return undefined
    }

    return options[Math.floor(Math.random() * options.length)]
}

const moveEachInTurn = (): ActionGenerator => (battleState) => {
    let localState = structuredClone(battleState);
    const battleActions: BattleAction[] = []
    const animations: BattleAnimation[] = []
    const animationActions: AnimationAction[] = []
    const valuesForTiming = { greatestDistance: 0 }

    getAllActiveSideShips(localState).forEach(ship => {
        const place = decidePlace(ship.ident, localState)
        if (place) {
            const distance = getDistance(place, ship.state.position)
            const outcome = handleMove(ship, place, battleState);
            battleActions.push(...outcome.battleActions)
            animationActions.push(...outcome.animationActions)
            animations.push(...outcome.animations)
            outcome.battleActions.forEach(action => {
                localState = dispatchBattleAction(localState, action)
            })

            valuesForTiming.greatestDistance = Math.max(distance, valuesForTiming.greatestDistance)
        }
    })

    return {
        battleActions,
        animations,
        animationActions,
        animationTime: 0,
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

const allFireOnTargets = (): ActionGenerator => (battleState) => {
    let localState = structuredClone(battleState);
    const battleActions: BattleAction[] = []
    const animations: BattleAnimation[] = []

    getAllActiveSideShips(battleState).forEach((ship) => {
        const targetShip = decideTarget(ship.ident, localState)

        if (targetShip) {
            const outcome = handleFiring(ship, targetShip)
            outcome.battleActions.forEach(action => {
                localState = dispatchBattleAction(localState, action)
            })
            animations.push(...outcome.animations);
            battleActions.push(...outcome.battleActions)
        }
    })

    return {
        battleActions,
        animations,
        animationActions: [],
        animationTime: Math.max(...animations.map(animation => animation.totalSteps)) * ANIMATION_STEP_MS
    }
}

const waitForShipsToFinishMoving = (eventTarget: EventTarget): Promise<boolean> => {
    return new Promise(resolve => {
        const handleUpdate = (event: Event) => {
            if (event instanceof MessageEvent) {
                const data = event.data as AnimationState['shipMoves']
                if (Object.keys(data).length === 0) {
                    eventTarget.removeEventListener('ship-moves', handleUpdate);
                    resolve(true)
                }
            }
        }
        eventTarget.addEventListener('ship-moves', handleUpdate)
    })
}

export const startCpuPlayerAutomation = async (
    battleState: BattleState,
    dispatchAction: ActionDispatch<[action: BattleAction]>,
    dispatchAnimation: ActionDispatch<[action: AnimationAction]>,
    eventTarget: EventTarget
) => {
    let localState = structuredClone(battleState);

    const doActions = async (generate: ActionGenerator) => {
        const { battleActions, animations, animationActions, animationTime } = generate(localState)
        battleActions.forEach((action) => {
            dispatchAction(action)
            localState = dispatchBattleAction(localState, action)
        })

        const placesWithDamage = new Map<string, number>()
        const stringifyXy = ({ x, y }: XY) => `${x},${y}`
        animations.filter(a => a.type === 'show-damage').forEach((a) => {
            const damageEffectsCountAtPlaceSoFar = placesWithDamage.get(stringifyXy(a.at)) ?? 0
            a.currentStep -= damageEffectsCountAtPlaceSoFar * 40
            placesWithDamage.set(stringifyXy(a.at), (damageEffectsCountAtPlaceSoFar + 1))
        })

        dispatchAnimation({
            type: 'add',
            effects: animations
        })
        animationActions.forEach(dispatchAnimation)
        if (animationTime > 0) {
            await delay(animationTime)
        }
    }

    await doActions(moveEachInTurn())
    await waitForShipsToFinishMoving(eventTarget)
    await doActions(allFireOnTargets())


    dispatchAction(({ type: 'end-turn' }))
}

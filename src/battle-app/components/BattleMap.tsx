import { useCallback, useState, type MouseEvent } from "react"
import type { XY } from "../../lib/model"
import { limitDistance } from "../../lib/util"
import { useAnimationState } from "../animation-context"
import { useBattleState } from "../battle-state-context"
import { DEFAULT_WEAPON_RANGE } from "../constants"
import { handleFiring, handleMove } from "../game-logic"
import { getActiveShipInstance, getActiveShipState, getInstancesForSide } from "../helpers"
import type { ShipInstanceInfo } from "../model"
import { AnimationPlotter } from "./AnimationPlotter"
import { RangeCircle } from "./RangeCircle"
import { ShipOnMap } from "./ShipOnMap"
import { TargetLine } from "./TargetLine"


interface Props {
    scale: number
    isNotLocalPlayerTurn: boolean
}

const mapMargin = 25
const width = 200;
const height = 200

export const BattleMap = ({ scale, isNotLocalPlayerTurn }: Props) => {
    const [targetPoint, setTargetPoint] = useState<XY>()
    const { battleState, dispatch } = useBattleState()
    const { dispatchAnimationAction } = useAnimationState()
    const { sides, activeFaction, targetAction } = battleState
    const stateOfActiveShip = getActiveShipState(battleState);

    const findPointOnMap = useCallback((event: MouseEvent<SVGElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const raw = { x: event.clientX - rect.x, y: event.clientY - rect.y }
        const adjust = (v: number) => Math.round((v / scale) - mapMargin)
        return {
            x: adjust(raw.x),
            y: adjust(raw.y)
        }
    }, [scale]);

    const handleClickOnMap = (event: MouseEvent<SVGElement>) => {
        if (!stateOfActiveShip || isNotLocalPlayerTurn || targetAction !== 'move') {
            return
        }
        const instance = getActiveShipInstance(battleState)
        if (!instance) { return }
        const moveOutcome = handleMove(instance, findPointOnMap(event), battleState);
        if (!moveOutcome) { return }
        dispatchAnimationAction({
            type: 'add',
            effects: moveOutcome.animations
        })
        dispatch(moveOutcome.battleAction)
    }

    const handleMoveOnMap = (event: MouseEvent<SVGElement>) => {
        setTargetPoint(findPointOnMap(event))
    }

    const handleClickOnShip = (shipInstance: ShipInstanceInfo) => {
        if (isNotLocalPlayerTurn) {
            return
        }
        if (shipInstance.faction.id === activeFaction) {
            return dispatch({
                type: 'select-ship',
                ident: shipInstance.ident,
            })
        }

        if (targetAction === 'fire') {
            const firingShipInstance = getActiveShipInstance(battleState)
            if (!firingShipInstance) {
                return
            }

            const firingOutcome = handleFiring(firingShipInstance, shipInstance);
            if (!firingOutcome) {
                return
            }
            const { animations, battleAction } = firingOutcome
            dispatchAnimationAction({
                type: 'add',
                effects: animations
            })

            return dispatch(battleAction)
        }
    }

    return (
        <svg
            onClick={handleClickOnMap}
            onMouseMove={handleMoveOnMap}
            viewBox={`${-mapMargin} ${-mapMargin} ${width + 2 * mapMargin} ${height + 2 * mapMargin}`}
            style={{
                width: (width + (mapMargin * 2)) * scale,
                height: (height + (mapMargin * 2)) * scale,
                borderColor: 'red',
                borderStyle: 'dotted',
                borderWidth: 1,
                backgroundColor: 'black',
            }}>
            <rect x={0} y={0} width={width} height={height} stroke="yellow" />
            <AnimationPlotter />
            {sides.map(side =>
                getInstancesForSide(side, battleState, true).map(shipInstance =>
                    <ShipOnMap
                        key={JSON.stringify(shipInstance.ident)}
                        handleClickOnShip={handleClickOnShip}
                        shipInstance={shipInstance}
                    />
                )
            )}
            {(battleState.targetAction === 'move' && stateOfActiveShip) && <>
                <RangeCircle
                    type="move"
                    r={stateOfActiveShip.remainingMovement}
                    position={stateOfActiveShip.position}
                />
                {targetPoint && !stateOfActiveShip.hasFired &&
                    <RangeCircle
                        type="fire"
                        r={DEFAULT_WEAPON_RANGE}
                        position={limitDistance(stateOfActiveShip.remainingMovement, stateOfActiveShip.position, targetPoint)} />
                }
            </>}
            {(battleState.targetAction === 'fire' && stateOfActiveShip && !stateOfActiveShip.hasFired) && <>
                <RangeCircle
                    type="fire"
                    r={DEFAULT_WEAPON_RANGE}
                    position={stateOfActiveShip.position} />
                {targetPoint &&
                    <TargetLine
                        origin={stateOfActiveShip.position}
                        targetPoint={targetPoint}
                        range={DEFAULT_WEAPON_RANGE} />}
            </>}
        </svg>
    )
}
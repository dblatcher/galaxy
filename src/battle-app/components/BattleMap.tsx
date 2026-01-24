import { useState, type MouseEvent } from "react"
import { getDistance } from "typed-geometry"
import type { XY } from "../../lib/model"
import { limitDistance } from "../../lib/util"
import { useAnimationState } from "../animation-context"
import { useBattleState } from "../battle-state-context"
import { DEFAULT_WEAPON_RANGE } from "../constants"
import { getActiveShipIdent, getActiveShipInstance, getActiveShipState, getInstance } from "../helpers"
import type { ShipInstanceInfo } from "../model"
import { AnimationPlotter } from "./AnimationPlotter"
import { RangeCircle } from "./RangeCircle"
import { ShipOnMap } from "./ShipOnMap"
import { TargetLine } from "./TargetLine"
import { handleFiring } from "../game-logic"


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

    const findPointOnMap = (event: MouseEvent<SVGElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const raw = { x: event.clientX - rect.x, y: event.clientY - rect.y }
        const adjust = (v: number) => Math.round((v / scale) - mapMargin)
        return {
            x: adjust(raw.x),
            y: adjust(raw.y)
        }
    }
    const handleClickOnMap = (event: MouseEvent<SVGElement>) => {
        if (isNotLocalPlayerTurn) {
            return
        }
        const pointOnMap = findPointOnMap(event)
        const ident = getActiveShipIdent(battleState)
        if (!stateOfActiveShip || !ident) {
            return
        }
        const distance = getDistance(pointOnMap, stateOfActiveShip?.position)
        if (distance <= stateOfActiveShip.remainingMovement) {
            dispatch({
                type: 'move-ship',
                location: pointOnMap,
                ident,
            })
        }
    }
    const handleMoveOnMap = (event: MouseEvent<SVGElement>) => {
        const pointOnMap = findPointOnMap(event)
        setTargetPoint(pointOnMap)
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

            animations.forEach(animation => {
                dispatchAnimationAction({
                    type: 'add',
                    effect: animation
                })
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
                side.fleets.map(fleet =>
                    fleet.ships.map((ship, shipIndex) => {
                        const shipInstance = getInstance(ship, side.faction, fleet.id, shipIndex, battleState)
                        if (!shipInstance) {
                            return null
                        }
                        return <ShipOnMap
                            key={shipIndex}
                            handleClickOnShip={handleClickOnShip}
                            shipInstance={shipInstance}
                        />
                    })
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
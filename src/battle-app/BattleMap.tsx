import { useState, type MouseEvent } from "react"
import { getDistance } from "typed-geometry"
import type { XY } from "../lib/model"
import { useBattleState } from "./battle-state-context"
import { getInstance, getShipState } from "./helpers"
import { ShipOnMap } from "./ShipOnMap"
import { RangeCircle } from "./RangeCircle"
import { TargetLine } from "./TargetLine"
import type { ShipInstanceInfo } from "./model"


interface Props {
    scale: number
}

const mapMargin = 25
const width = 200;
const height = 200


export const BattleMap = ({ scale }: Props) => {
    const { battleState, dispatch } = useBattleState()
    const { sides, shipStates, activeFaction, activeShip, targetAction } = battleState
    const [targetPoint, setTargetPoint] = useState<XY>()

    const stateOfActiveShip = activeShip && getShipState(activeFaction, activeShip?.fleetId, activeShip?.shipIndex, shipStates)

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
        const pointOnMap = findPointOnMap(event)
        if (!stateOfActiveShip) {
            return
        }
        const distance = getDistance(pointOnMap, stateOfActiveShip?.position)
        if (distance <= stateOfActiveShip.remainingMovement) {
            dispatch({
                type: 'move-ship',
                location: pointOnMap,
                distance,
            })
        }
    }
    const handleMoveOnMap = (event: MouseEvent<SVGElement>) => {
        const pointOnMap = findPointOnMap(event)
        setTargetPoint(pointOnMap)
    }

    const handleClickOnShip = (shipInstance: ShipInstanceInfo) => {
        if (shipInstance.faction.id === activeFaction) {
            return dispatch({
                type: 'select-ship',
                factionId: shipInstance.faction.id,
                fleetId: shipInstance.fleetId,
                shipIndex: shipInstance.shipIndex
            })
        } else if (targetAction === 'fire' && stateOfActiveShip) {
            return dispatch({
                type: 'attempt-fire',
                target: {
                    factionId: shipInstance.faction.id,
                    fleetId: shipInstance.fleetId,
                    shipIndex: shipInstance.shipIndex,
                },
                attacker: {
                    factionId: activeFaction,
                    fleetId: activeShip.fleetId,
                    shipIndex: activeShip.shipIndex
                }
            })
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
            {sides.map(side =>
                side.fleets.map(fleet =>
                    fleet.ships.map((ship, shipIndex) => {
                        const shipInstance = getInstance(ship, side.faction, fleet.id, shipIndex, shipStates)
                        if (!shipInstance) {
                            return null
                        }
                        return <ShipOnMap
                            key={shipIndex}
                            handleClickOnShip={handleClickOnShip}
                            shipInstance={shipInstance}
                            isPlayerShip={activeFaction === shipInstance.faction.id}
                            isSelected={
                                activeFaction === shipInstance.faction.id &&
                                activeShip?.fleetId == shipInstance.fleetId &&
                                activeShip.shipIndex === shipInstance.shipIndex
                            }
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
                    <RangeCircle type="fire" r={50} position={targetPoint} />
                }
            </>}
            {(battleState.targetAction === 'fire' && stateOfActiveShip && !stateOfActiveShip.hasFired) && <>
                <RangeCircle
                    type="fire"
                    r={50}
                    position={stateOfActiveShip.position} />
                {targetPoint &&
                    <TargetLine
                        origin={stateOfActiveShip.position}
                        targetPoint={targetPoint}
                        range={50} />}
            </>}

        </svg>
    )
}
import { useState, type MouseEvent } from "react"
import { getDistance } from "typed-geometry"
import type { XY } from "../lib/model"
import { useBattleState } from "./battle-state-context"
import { getInstance, getShipState } from "./helpers"
import { ShipOnMap } from "./ShipOnMap"


interface Props {
    scale: number
}

const mapMargin = 25
const width = 400;
const height = 300


export const BattleMap = ({ scale }: Props) => {
    const { battleState, dispatch } = useBattleState()
    const { sides, shipStates, activeFaction, activeShip } = battleState
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
                            shipInstance={shipInstance}
                            isSelected={activeFaction === side.faction.id && activeShip?.fleetId == fleet.id && activeShip.shipIndex === shipIndex}
                        />
                    })
                )
            )}
            {(battleState.targetAction === 'move' && stateOfActiveShip) && <circle
                cx={stateOfActiveShip.position.x}
                cy={stateOfActiveShip.position.y}
                r={stateOfActiveShip.remainingMovement}
                stroke="yellow"
                fill="none"
                strokeDasharray={"1,3"}
            />}
            {(battleState.targetAction === 'fire' && stateOfActiveShip) && <circle
                cx={stateOfActiveShip.position.x}
                cy={stateOfActiveShip.position.y}
                r={50}
                stroke="red"
                fill="none"
                strokeDasharray={"1,1"}
            />}

            {(stateOfActiveShip && targetPoint) && <line stroke="grey"
                x1={stateOfActiveShip.position.x}
                y1={stateOfActiveShip.position.y}
                x2={targetPoint.x}
                y2={targetPoint.y}
            />}
        </svg>
    )
}
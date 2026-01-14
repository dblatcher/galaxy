import { useState, type ActionDispatch, type MouseEvent } from "react"
import { getInstance, getShipState } from "./helpers"
import type { BattleAction, BattleState } from "./model"
import { ShipOnMap } from "./ShipOnMap"
import type { XY } from "../lib/model"
import { getDistance } from "typed-geometry"


interface Props {
    scale: number
    battleState: BattleState
    dispatch: ActionDispatch<[action: BattleAction]>
}

const mapMargin = 25
const width = 400;
const height = 300


export const BattleMap = ({ scale, battleState, dispatch }: Props) => {
    const { sides, shipStates, activeFaction, activeShip } = battleState
    const [clickedPoint, setClickedPoint] = useState<XY>()

    const stateOfActiveShip = activeShip && getShipState(activeFaction, activeShip?.fleetId, activeShip?.shipIndex, shipStates)

    const handleClickOnMap = (event: MouseEvent<SVGElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const raw = { x: event.clientX - rect.x, y: event.clientY - rect.y }
        const adjust = (v: number) => Math.round((v / scale) - mapMargin)
        const pointOnMap = {
            x: adjust(raw.x),
            y: adjust(raw.y)
        }

        if (!stateOfActiveShip) {
            setClickedPoint(pointOnMap)
            return
        }
        const distance = getDistance(pointOnMap, stateOfActiveShip?.position)
        if (distance <= stateOfActiveShip.remainingMovement) {
            dispatch({
                type: 'move-ship',
                location: pointOnMap,
                distance,
            })
        } else {
            setClickedPoint(pointOnMap)
        }
    }

    return (
        <svg
            onClick={handleClickOnMap}
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
                        return <ShipOnMap key={shipIndex}
                            shipInstance={shipInstance}
                            isSelected={activeFaction === side.faction.id && activeShip?.fleetId == fleet.id && activeShip.shipIndex === shipIndex}
                        />
                    })
                )
            )}
            {stateOfActiveShip && <circle
                cx={stateOfActiveShip.position.x}
                cy={stateOfActiveShip.position.y}
                r={stateOfActiveShip.remainingMovement}
                stroke="yellow"
                fill="none"
                strokeDasharray={"1,3"}
            />}
            {clickedPoint && <circle cx={clickedPoint.x} cy={clickedPoint.y} r={4} stroke="white" />}

            {(stateOfActiveShip && clickedPoint) && <line stroke="grey"
                x1={stateOfActiveShip.position.x}
                y1={stateOfActiveShip.position.y}
                x2={clickedPoint.x}
                y2={clickedPoint.y}
            />}
        </svg>
    )
}
import { useState } from "react"
import { getInstance } from "./helpers"
import type { BattleState } from "./model"
import { ShipOnMap } from "./ShipOnMap"
import type { XY } from "../lib/model"

interface Props {
    scale: number
    battleState: BattleState
}

const mapMargin = 25
const width = 400;
const height = 300


export const BattleMap = ({ scale, battleState }: Props) => {
    const { sides, shipStates, activeFaction, activeShip } = battleState
    const [clickedPoint, setClickedPoint] = useState<XY>()

    return (
        <svg
            onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                const raw = { x: event.clientX - rect.x, y: event.clientY - rect.y }
                const adjust = (v: number) => Math.round((v / scale) - mapMargin)
                const adjusted = {
                    x: adjust(raw.x),
                    y: adjust(raw.y)
                }
                setClickedPoint(adjusted)
            }}
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
            {clickedPoint && <circle cx={clickedPoint.x} cy={clickedPoint.y} r={4} stroke="white" />}
        </svg>
    )
}
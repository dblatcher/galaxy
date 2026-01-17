import { useCallback, useEffect, useState } from "react"
import { getDistance, getHeadingFrom, getXYVector, translate, xy } from "typed-geometry"
import { FleetSymbol } from "../components/FleetSymbol"
import type { ShipInstanceInfo } from "./model"

interface Props {
    shipInstance: ShipInstanceInfo,
    isSelected: boolean,
}

export const ShipOnMap = ({ shipInstance, isSelected }: Props) => {
    const { ship, faction, fleetId, design, shipIndex } = shipInstance
    const { position, heading } = shipInstance.state
    const { name, hp } = design
    const [displayPosition, setDisplayPosition] = useState(position)

    const updateDisplayPosition = useCallback(() => {
        requestAnimationFrame(() => {
            setDisplayPosition(displayPosition => {
                const distance = getDistance(displayPosition, position)
                const heading = getHeadingFrom(displayPosition, position)
                if (distance < 2) {
                    return position
                }
                return translate(displayPosition, getXYVector(.75, heading))
            })
        })
    }, [position])

    useEffect(() => {
        const timer = setInterval(updateDisplayPosition, 10)
        return () => {
            clearInterval(timer)
        }
    }, [updateDisplayPosition])


    if (ship.damage >= hp) {
        return null
    }

    return <g
        key={`${faction.id}-${fleetId}-${shipIndex}`}
        data-side={faction.name}
        data-ship-type={name}>
        <FleetSymbol color={faction.color} location={displayPosition ?? position} h={heading} />
        <text {...translate(position, xy(-4, 8))} fontSize={5} fill="white">{name} {isSelected && "*"}</text>
    </g>
}

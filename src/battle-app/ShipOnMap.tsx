import { translate, xy } from "typed-geometry"
import { FleetSymbol } from "../components/FleetSymbol"
import type { ShipInstanceInfo } from "./model"

interface Props {
    shipInstance: ShipInstanceInfo,
    isSelected: boolean,
}

export const ShipOnMap = ({ shipInstance, isSelected }: Props) => {
    const { ship, faction, fleetId, design, shipIndex } = shipInstance
    const { name, hp } = design
    if (ship.damage >= hp) {
        return null
    }
    const { position, heading } = shipInstance.state
    return <g
        key={`${faction.id}-${fleetId}-${shipIndex}`}
        data-side={faction.name}
        data-ship-type={name}>
        <FleetSymbol color={faction.color} location={position} h={heading} />
        <text {...translate(position, xy(-4, 8))} fontSize={5} fill="white">{name} {isSelected && "*"}</text>
    </g>
}

import { FleetIcon } from "../components/FleetSymbol"
import type { ShipInstanceInfo } from "./model"

interface Props {
    shipInstance: ShipInstanceInfo
}

export const ShipInfo = ({ shipInstance }: Props) => {

    const { faction, ship, state } = shipInstance
    const { hp, name } = shipInstance.design;

    return <div>
        <div>
            <FleetIcon color={faction.color} />
            <span>{name}</span>
            <span>{hp - ship.damage}/{hp}</span>
        </div>
        <div>
            [{state.position.x},{state.position.y}]
            moves: {state.remainingMovement.toFixed(2)}
        </div>
    </div>
}
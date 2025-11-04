import type { Faction, Ship } from "../../lib/model"
import { FleetIcon } from "../FleetSymbol"


interface Props {
    ship: Ship
    faction: Faction
}

export const ShipProfile = ({ ship, faction }: Props) => {

    const design = faction.shipDesigns.find(design => design.id == ship.designId)

    if (!design) {
        return <div>NO DESIGN</div>
    }

    return <div>
        <FleetIcon color={faction.color} />
        <span>{design.name}</span>
        <span>{design.hp - ship.damage}/{design.hp}</span>
    </div>
}
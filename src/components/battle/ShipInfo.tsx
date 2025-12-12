import type { Faction, Ship } from "../../lib/model"
import { enhanceShipDesign } from "../../lib/ship-design-helpers"
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
    const {hp, name} = enhanceShipDesign(design)

    return <div>
        <FleetIcon color={faction.color} />
        <span>{name}</span>
        <span>{hp - ship.damage}/{hp}</span>
    </div>
}
import { getDesignMap } from "./fleet-operations";
import type { Faction, Fleet } from "./model";
import { findById } from "./util";


export const removeDead = (fleets: Fleet[], factions: Faction[]): Fleet[] => {
    fleets.forEach(fleet => {
        const faction = findById(fleet.factionId, factions);
        if (!faction) {
            fleet.ships = []
            return
        }
        const designMap = getDesignMap(faction)
        fleet.ships = fleet.ships.filter(ship => ship.damage < designMap[ship.designId].hp)
    })
    return fleets.filter(fleet => fleet.ships.length > 0)
}

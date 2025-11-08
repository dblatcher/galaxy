import { getDesignMap } from "./fleet-operations";
import type { Faction, Fleet, Ship, Star } from "./model";
import { filterInPlace } from "./util";

export const findColonisingFleets = (star: Star, fleets: Fleet[], faction: Faction): Fleet[] => {
    const designs = getDesignMap(faction)
    return fleets.filter(fleet =>
        fleet.factionId === faction.id &&
        fleet.orbitingStarId === star.id &&
        fleet.ships.some(ship => designs[ship.designId]?.specials.colonise)
    )
}

export const removeOneColonyShip = (fleet: Fleet, faction: Faction): Ship | undefined => {
    const designs = getDesignMap(faction)
    const firstColonyShip = fleet.ships.find(ship => designs[ship.designId]?.specials.colonise)
    filterInPlace(fleet.ships, ship => ship !== firstColonyShip) 
    return firstColonyShip
}
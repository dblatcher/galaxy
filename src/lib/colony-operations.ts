import { getDesignMap } from "./fleet-operations";
import type { Faction, Fleet, Ship, Star } from "./model";
import { filterInPlace, isSet } from "./util";

export const findColonisingFleets = (star: Star, fleets: Fleet[], faction: Faction): Fleet[] => {

    if (fleets.some(fleet => fleet.factionId !== faction.id && fleet.orbitingStarId === star.id)) {
        return []
    }

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

export const findBombingFleets = (star: Star, fleets: Fleet[], faction: Faction): Fleet[] => {
    const designs = getDesignMap(faction)
    return fleets.filter(fleet =>
        fleet.factionId === faction.id &&
        fleet.orbitingStarId === star.id &&
        fleet.ships.some(ship => designs[ship.designId]?.specials.bomb && !ship.hasBombed)
    )
}

export const getShipsThatCouldBomb = (fleet: Fleet, faction: Faction, star: Star): Ship[] => {
    const designs = getDesignMap(faction)
    const inRightPlace = fleet.factionId === faction.id && // correct faction
        fleet.orbitingStarId === star.id && // right star
        isSet(star.factionId) && star.factionId !== fleet.factionId// at colony of other faction
    return inRightPlace ? fleet.ships.filter(ship => designs[ship.designId]?.specials.bomb && !ship.hasBombed) : [];
}


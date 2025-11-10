import { getDesignMap } from "./fleet-operations";
import type { Faction, Fleet, Ship, Star } from "./model";
import { filterInPlace, findById, isSet } from "./util";

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

export const calculateConstructionPoints = (star: Star): number => {
    return Math.max(1, Math.floor(star.population))
}

export const getNewShipsFromStar = (star: Star, faction: Faction): Ship[] | undefined => {
    const design = findById(star.shipDesignToConstruct, faction.shipDesigns)
    if (!design) {
        return undefined
    }
    const { shipConstructionProgress = 0 } = star
    const newProgress = calculateConstructionPoints(star) + shipConstructionProgress;

    if (newProgress < design.constructionCost) {
        star.shipConstructionProgress = newProgress
        return undefined
    }

    const numberOfShips = Math.floor(newProgress / design.constructionCost);
    star.shipConstructionProgress = newProgress % design.constructionCost;
    const newShips: Ship[] = new Array(numberOfShips).fill(undefined).map(_ => ({ designId: design.id, damage: 0 }))
    return newShips;
}
import { addNewFleet, getDesignMap } from "./fleet-operations";
import type { Faction, Fleet, MessageReport, Ship, Star } from "./model";
import { filterInPlace, findById, isSet } from "./util";

const MAX_POPULATION = 10
const GROWTH_RATE = .1


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

export const runColonyConstruction = (star: Star, faction: Faction, fleets: Fleet[]) => {
    const newShips = getNewShipsFromStar(star, faction);

    if (newShips) {
        // TO DO - let the player pick which fleet gets the new ships ?
        const factionsFleetsHere = fleets.filter(fleet =>
            fleet.factionId === faction.id && fleet.orbitingStarId === star.id
        )
        const [firstFleet] = factionsFleetsHere;

        if (!firstFleet) {
            addNewFleet(faction.id, star, newShips, fleets)
        } else {
            firstFleet.ships.push(...newShips)
        }
    }
}

export const runColonyGrowth = (star: Star) => {
    star.population = Math.min(MAX_POPULATION, star.population + GROWTH_RATE)
}

export const bombColony = (bombingFaction: Faction, fleet: Fleet, bombedFaction: Faction, star: Star, turnNumber: number) => {
    const bombers = getShipsThatCouldBomb(fleet, bombingFaction, star)
    bombers.forEach(ship => ship.hasBombed = true)

    const damage = bombers.length * .25;
    const startingPopulation = star.population;
    star.population -= damage

    if (star.population <= 0) {
        star.factionId = undefined;
        star.population = 0
    }

    const report: MessageReport = {
        reportType: 'message',
        turnNumber,
        message: [
            `${bombingFaction.name} bombed the ${bombedFaction?.name} colony at ${star.name}.`,
            star.factionId === undefined ? `It was completely destroyed.` : `${damage} of ${startingPopulation} killed.`
        ].join(" ")
    }
    return report
}
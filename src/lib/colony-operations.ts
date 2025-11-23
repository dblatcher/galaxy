import { createBalancedColonyBudget, type ColonyBudgetItem } from "./colony-budget";
import { getAllBattles } from "./derived-state";
import { addNewFleet, getDesignMap } from "./fleet-operations";
import type { BombingReport, Faction, Fleet, GameState, Ship, Star } from "./model";
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

export const couldFleetColoniseStar = (fleet: Fleet, faction: Faction, star: Star) => {

    if (isSet(star.factionId)) {
        return false
    }

    if (fleet.orbitingStarId !== star.id) {
        return false
    }
    const designs = getDesignMap(faction)
    return fleet.ships.some(ship => designs[ship.designId]?.specials.colonise)
}

export const removeOneColonyShip = (fleet: Fleet, faction: Faction): Ship | undefined => {
    const designs = getDesignMap(faction)
    const firstColonyShip = fleet.ships.find(ship => designs[ship.designId]?.specials.colonise)
    filterInPlace(fleet.ships, ship => ship !== firstColonyShip)
    return firstColonyShip
}

export const getShipsThatCouldBomb = (fleet: Fleet, faction: Faction, star: Star): Ship[] => {
    const designs = getDesignMap(faction)
    const inRightPlace = fleet.factionId === faction.id && // correct faction
        fleet.orbitingStarId === star.id && // right star
        isSet(star.factionId) && star.factionId !== fleet.factionId// at colony of other faction
    return inRightPlace ? fleet.ships.filter(ship => designs[ship.designId]?.specials.bomb && !ship.hasBombed) : [];
}

export const calculateConstructionPoints = (star: Star, budgetItem?: ColonyBudgetItem): number => {
    const budget = star.budget ?? createBalancedColonyBudget();
    const portion = budgetItem ? budget.items[budgetItem].percentage / 100 : 1;
    return Math.max(1, Math.floor(star.population)) * portion;
}

export const getNewShipsFromStar = (star: Star, faction: Faction): Ship[] | undefined => {
    const design = findById(star.shipDesignToConstruct, faction.shipDesigns)
    if (!design) {
        return undefined
    }
    const { shipConstructionProgress = 0 } = star
    const newProgress = calculateConstructionPoints(star, 'ships') + shipConstructionProgress;

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

export const bombColony = (bombingFaction: Faction, fleet: Fleet, bombedFaction: Faction, star: Star, turnNumber: number): BombingReport => {
    const bombers = getShipsThatCouldBomb(fleet, bombingFaction, star)
    bombers.forEach(ship => ship.hasBombed = true)

    const populationDamage = bombers.length * .25;
    const startingPopulation = star.population;
    star.population -= populationDamage

    if (star.population <= 0) {
        star.factionId = undefined;
        star.population = 0
    }

    const report: BombingReport = {
        reportType: "bombing",
        turnNumber,
        bombingFactionId: bombingFaction.id,
        bombedFactionId: bombedFaction.id,
        star: star.id,
        startingPopulation,
        populationDamage,
    }
    return report
}
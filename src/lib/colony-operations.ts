import { ALL_EQUIPMENT } from "../data/ship-equipment";
import { createBalancedColonyBudget, createBudgetWithAllIn, type ColonyBudgetItem } from "./colony-budget";
import { addNewFleet, getDesignMap } from "./fleet-operations";
import type { BombingReport, Faction, Fleet, Ship, Star } from "./model";
import { getConstructionCost } from "./ship-design-helpers";
import { diceRoll, filterInPlace, findById, isSet } from "./util";

const MAX_POPULATION = 10
const GROWTH_RATE = .1
const FACTORY_COST = 5
const FACTORY_OUTPUT = 2
const POPULATION_DAMAGE_PER_BOMB_POINT = .04


export const findColonisingFleets = (star: Star, fleets: Fleet[], faction: Faction): Fleet[] => {

    if (fleets.some(fleet => fleet.factionId !== faction.id && fleet.orbitingStarId === star.id)) {
        return []
    }

    const designs = getDesignMap(faction)
    return fleets.filter(fleet =>
        fleet.factionId === faction.id &&
        fleet.orbitingStarId === star.id &&
        fleet.ships.some(ship => designs[ship.designId]?.canColonise)
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
    return fleet.ships.some(ship => designs[ship.designId]?.canColonise)
}

export const removeOneColonyShip = (fleet: Fleet, faction: Faction): Ship | undefined => {
    const designs = getDesignMap(faction)
    const firstColonyShip = fleet.ships.find(ship => designs[ship.designId]?.canColonise)
    filterInPlace(fleet.ships, ship => ship !== firstColonyShip)
    return firstColonyShip
}

export const getShipsThatCouldBomb = (fleet: Fleet, faction: Faction, star: Star): Ship[] => {
    const designs = getDesignMap(faction)
    const inRightPlace = fleet.factionId === faction.id && // correct faction
        fleet.orbitingStarId === star.id && // right star
        isSet(star.factionId) && star.factionId !== fleet.factionId// at colony of other faction
    return inRightPlace ? fleet.ships.filter(ship => designs[ship.designId]?.hasBombs && !ship.hasBombed) : [];
}

// TO DO - faction advances will allow for higher productivity
export const calculateMaxFactoryUsage = (star: Star) => {
    return Math.max(1, Math.floor(star.population))
}

export const calculateConstructionPoints = (star: Star, budgetItem?: ColonyBudgetItem): number => {
    const workerUnits = Math.max(1, Math.floor(star.population));
    const staffedFactories = Math.min(star.factories, calculateMaxFactoryUsage(star));
    const totalPoints = workerUnits + (staffedFactories * FACTORY_OUTPUT);

    const budget = star.budget ?? createBalancedColonyBudget();
    const portion = budgetItem ? budget.items[budgetItem].percentage / 100 : 1;
    return totalPoints * portion;
}

export const getNewShipsFromStar = (star: Star, faction: Faction): Ship[] | undefined => {
    const design = findById(star.shipDesignToConstruct, faction.shipDesigns)
    if (!design) {
        return undefined
    }
    const { shipConstructionProgress = 0 } = star
    const newProgress = calculateConstructionPoints(star, 'ships') + shipConstructionProgress;
    const constructionCost = getConstructionCost(design)

    if (newProgress < constructionCost) {
        star.shipConstructionProgress = newProgress
        return undefined
    }

    const numberOfShips = Math.floor(newProgress / constructionCost);
    star.shipConstructionProgress = newProgress % constructionCost;
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


    const factoryProduction = (star.factoryConstructionProgress ?? 0) + calculateConstructionPoints(star, 'industry');
    const factoriesAdded = Math.floor(factoryProduction / FACTORY_COST);
    star.factories = star.factories + factoriesAdded; // TO DO - limit total factories
    star.factoryConstructionProgress = factoryProduction % FACTORY_COST;
}

export const runColonyGrowth = (star: Star) => {
    star.population = Math.min(MAX_POPULATION, star.population + GROWTH_RATE)
}

export const createColony = (star: Star, faction: Faction) => {
    star.factionId = faction.id;
    star.population = 1
    star.budget = createBudgetWithAllIn('industry');
    star.factoryConstructionProgress = 0
    star.shipConstructionProgress = 0
    star.shipDesignToConstruct = 0
}

const removeColony = (star: Star) => {
    star.factionId = undefined;
    star.population = 0;
    star.budget = undefined;
    star.shipConstructionProgress = 0;
    star.factoryConstructionProgress = 0;
}

const determineDamage = (bombers: Ship[], faction: Faction): { populationDamage: number } => {

    const designMap = getDesignMap(faction)

    const bombs = bombers
        .map(ship => designMap[ship.designId])
        .flatMap(design => design.slots)
        .flatMap(slot => slot ? ALL_EQUIPMENT[slot] : [])
        .flatMap(equipment => equipment.info.type === 'bomb' ? equipment.info : [])

    const damage = {
        populationDamage: 0
    }

    bombs.forEach(bomb => {
        bomb.damage.forEach(die => damage.populationDamage += diceRoll(die) * POPULATION_DAMAGE_PER_BOMB_POINT)
    })

    return damage
}

export const bombColony = (bombingFaction: Faction, fleet: Fleet, bombedFaction: Faction, star: Star, turnNumber: number): BombingReport => {
    const bombers = getShipsThatCouldBomb(fleet, bombingFaction, star)
    bombers.forEach(ship => ship.hasBombed = true)
    const { populationDamage } = determineDamage(bombers, bombingFaction)

    const startingPopulation = star.population;
    star.population -= populationDamage

    if (star.population <= 0) {
        removeColony(star)
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
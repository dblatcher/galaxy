import { getDistance, getHeadingFrom, getXYVector, translate } from "typed-geometry";
import { autoResolveAllBattles } from "./auto-battles";
import { addNewFleet, factionHasBattles } from "./fleet-operations";
import type { Faction, Fleet, GameState, Ship, Star } from "./model";
import { findById, isSet, mapOnId } from "./util";

const SPEED = 4;
const CLOSE_ENOUGH = 5

const calculateConstructionPoints = (_star: Star): number => {
    return 1
}

const moveFleetInGalaxy = ({ galaxy }: GameState) => (fleet: Fleet) => {
    const destination = findById(fleet.destinationStarId, galaxy.stars);
    if (!destination) {
        return
    }
    if (isSet(fleet.orbitingStarId)) {
        const starleavingFrom = findById(fleet.orbitingStarId, galaxy.stars);
        if (starleavingFrom) {
            fleet.location = translate(
                getXYVector(CLOSE_ENOUGH, getHeadingFrom(starleavingFrom, destination)),
                starleavingFrom
            )
        }
        fleet.orbitingStarId = undefined
    }
    const distanceLeft = getDistance(fleet.location, destination);
    if (distanceLeft - CLOSE_ENOUGH <= SPEED) {
        fleet.location = { x: destination.x, y: destination.y }
        fleet.destinationStarId = undefined
        fleet.orbitingStarId = destination.id
    } else {
        const displacement = getXYVector(SPEED, getHeadingFrom(fleet.location, destination))
        fleet.location = translate(fleet.location, displacement)
    }
    return fleet
}


const getNewShipsFromStar = (star: Star, faction: Faction): Ship[] | undefined => {
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

const runConstruction = (gameState: GameState) => {
    const { fleets } = gameState
    const factionMap = mapOnId(gameState.factions);

    gameState.galaxy.stars.forEach(star => {
        const faction = isSet(star.factionId) ? factionMap[star.factionId] : undefined;
        if (faction) {
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
    })
}


const startNewTurn = (oldGameState: GameState): GameState => {
    const gameState = autoResolveAllBattles({ ...oldGameState, reports: [] });
    const { galaxy, fleets, factions, turnNumber, reports } = gameState
    fleets.forEach(moveFleetInGalaxy(gameState))
    runConstruction(gameState)

    const [firstFaction] = factions

    return {
        activeFactionId: firstFaction.id,
        galaxy,
        fleets,
        factions,
        turnNumber: turnNumber + 1,
        starsWhereBattlesFoughtAlready: [],
        reports,
        dialog: factionHasBattles(firstFaction.id, gameState) ? {
            role: 'battles'
        } : undefined
    }
}

const takeCpuTurn = (_faction: Faction, gameState: GameState): GameState => {
    // TO DO - modify state with CPU actions
    // - decide which ships to build at each star
    // - issue orders (or no orders) to each fleet
    // - start colonies on planets with orbiting colony ships
    // should be able to import `gameStateReducer` and use it to recursively modify gamestate
    // with actions until CPU has none left to take.
    return gameState
}

export const progressTurn = (oldGameState: GameState): GameState => {
    const gameState = structuredClone(oldGameState)

    const cycleThroughFactions = (factionIndex: number): GameState => {
        const nextFaction: Faction | undefined = gameState.factions[factionIndex + 1]
        // last faction has gone, starting next turn
        if (!nextFaction) {
            return startNewTurn(gameState);
        }

        switch (nextFaction.playerType) {
            case "LOCAL":
                return {
                    ...gameState,
                    activeFactionId: nextFaction.id,
                    dialog: factionHasBattles(nextFaction.id, gameState) ? {
                        role: 'battles'
                    } : undefined
                }
            case "CPU":
                takeCpuTurn(nextFaction, gameState);
                return cycleThroughFactions(factionIndex + 1)
            case "REMOTE":
                return {
                    ...gameState,
                    activeFactionId: nextFaction.id,
                }
        }
    }

    const currentFactionIndex = gameState.factions.findIndex(faction => faction.id === gameState.activeFactionId);
    return cycleThroughFactions(currentFactionIndex)
}
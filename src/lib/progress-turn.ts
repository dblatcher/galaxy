import { getDistance, getHeadingFrom, getXYVector, translate } from "typed-geometry";
import { autoResolveAllBattles } from "./auto-battles";
import { appendFleet, factionHasBattles } from "./fleet-operations";
import type { Faction, Fleet, GameState, Ship, Star } from "./model";
import { findById, isSet } from "./util";

const SPEED = 4;
const CLOSE_ENOUGH = 5

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


const getNewShipsFromStar = (star: Star, { turnNumber }: GameState): Ship[] | undefined => {
    // TO DO - star's build queue
    return ((isSet(star.factionId)) && turnNumber % 4 === 0)
        ? [{ designId: 0, damage: 0 }]
        : undefined;
}

const addNewFleets = (gameState: GameState) => (fleets: Fleet[]) => {
    gameState.galaxy.stars.forEach(star => {
        const { factionId } = star;
        if (isSet(factionId)) {
            const newShips = getNewShipsFromStar(star, gameState)

            if (newShips) {
                // TO DO - let the player pick which fleet get the new ships
                const factionsFleetsHere = fleets.filter(fleet =>
                    fleet.factionId === factionId && fleet.orbitingStarId === star.id
                )
                const [firstFleet] = factionsFleetsHere;

                if (!firstFleet) {
                    appendFleet(factionId, star, newShips, fleets)
                } else {
                    firstFleet.ships.push(...newShips)
                }
            }
        }
    })
    return fleets
}


const startNewTurn = (oldGameState: GameState): GameState => {
    const gameState = autoResolveAllBattles({ ...oldGameState, reports: [] });
    const { galaxy, fleets: existingFleets, factions, turnNumber, reports } = gameState
    existingFleets.forEach(moveFleetInGalaxy(gameState))
    const fleets = addNewFleets(gameState)(existingFleets)

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
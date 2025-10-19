import { getHeadingFrom, getXYVector, getDistance, translate } from "typed-geometry";
import type { Fleet, Galaxy, GameState } from "./model";
import { findById, isSet, nextId } from "./util";

const SPEED = 4;
const CLOSE_ENOUGH = 5

const moveFleetInGalaxy = (galaxy: Galaxy) => (fleet: Fleet) => {
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

const appendFleet = (newFleet: Omit<Fleet, 'id'>, fleets: Fleet[]) => {
    fleets.push({ ...newFleet, id: nextId(fleets) })
    return fleets
}

const addNewFleets = (galaxy: Galaxy) => (fleets: Fleet[]) => {
    galaxy.stars.forEach(star => {
        // to do - build queue - not every star produces a new fleet each turn
        if (isSet(star.factionId)) {
            appendFleet({
                factionId: star.factionId,
                orbitingStarId: star.id,
                location: {
                    x: star.x,
                    y: star.y
                }
            }, fleets)
        }
    })
    return fleets
}

export const progressTurn = (gameState: GameState): GameState => {
    const state = structuredClone(gameState)
    const { galaxy, fleets: existingFleets, factions, turnNumber } = state;
    existingFleets.forEach(moveFleetInGalaxy(galaxy))
    const fleets = addNewFleets(galaxy)(existingFleets)
    return {
        galaxy,
        fleets,
        factions,
        turnNumber: turnNumber + 1
    }
}
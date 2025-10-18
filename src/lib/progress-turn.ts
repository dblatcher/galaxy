import { getHeadingFrom, getXYVector, getDistance, translate } from "typed-geometry";
import type { Fleet, Galaxy, GameState } from "./model";
import { findById, isSet } from "./util";

const SPEED = 2;
const CLOSE_ENOUGH = 4

const moveFleetInGalaxy = (galaxy: Galaxy) => (fleet: Fleet) => {
    const destination = findById(fleet.destinationStarId, galaxy.stars);
    if (!destination) {
        return
    }
    if (isSet(fleet.orbitingStarId)) {
        const starleavingFrom = findById(fleet.orbitingStarId, galaxy.stars);
        if (starleavingFrom) {
            fleet.location = { x: starleavingFrom.x, y: starleavingFrom.y }
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
}

export const progressTurn = (gameState: GameState): GameState => {
    const { galaxy, fleets, factions, turnNumber } = gameState;
    fleets.forEach(moveFleetInGalaxy(galaxy))

    return {
        galaxy,
        fleets,
        factions,
        turnNumber: turnNumber + 1
    }
}
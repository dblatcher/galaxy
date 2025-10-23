import { getDistance, getHeadingFrom, getXYVector, translate } from "typed-geometry";
import type { Battle, Faction, Fleet, Galaxy, GameState } from "./model";
import { findById, isSet, nextId, splitArray, removeDuplicates } from "./util";

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

const appendFleet = (newFleet: Omit<Fleet, 'id'>, fleets: Fleet[]) => {
    fleets.push({ ...newFleet, id: nextId(fleets) })
    return fleets
}

const addNewFleets = ({ galaxy, turnNumber }: GameState) => (fleets: Fleet[]) => {
    galaxy.stars.forEach(star => {
        // to do - build queue - not every star produces a new fleet each turn
        if (isSet(star.factionId)) {
            if (turnNumber % 4 === 0) {
                appendFleet({
                    factionId: star.factionId,
                    orbitingStarId: star.id,
                    location: {
                        x: star.x,
                        y: star.y
                    }
                }, fleets)
            }
        }
    })
    return fleets
}

const assembleBattles = (galaxy: Galaxy, factions: Faction[], fleets: Fleet[]): Battle[] => {

    const battles: Battle[] = [];
    let unassignedFleets = [...fleets].filter(f => isSet(f.orbitingStarId));

    galaxy.stars.forEach(star => {
        const [fleetsHere, fleetsElsewhere] = splitArray(unassignedFleets, f => f.orbitingStarId === star.id)
        unassignedFleets = fleetsElsewhere;
        const factionsHere = removeDuplicates(fleetsHere.map(f => f.factionId)).flatMap(id => findById(id, factions) ?? []);

        if (factionsHere.length > 1) {
            const sides = factionsHere.map(faction => (
                {
                    faction: faction.id,
                    fleets: fleetsHere.filter(f => f.factionId == faction.id).map(f => f.id)
                }
            ));
            battles.push({ star: star.id, sides })
        }
    })
    return battles
}


const startNewTurn = (gameState: GameState): GameState => {
    const { galaxy, fleets: existingFleets, factions, turnNumber } = gameState;
    existingFleets.forEach(moveFleetInGalaxy(gameState))
    const fleets = addNewFleets(gameState)(existingFleets)
    const battles = assembleBattles(galaxy, factions, fleets);

    return {
        activeFactionId: factions[0].id,
        galaxy,
        fleets,
        factions,
        battles,
        turnNumber: turnNumber + 1
    }
}

const takeCpuTurn = (_faction: Faction, gameState: GameState): GameState => {
    return gameState
}

export const progressTurn = (oldGameState: GameState): GameState => {
    const gameState = structuredClone(oldGameState)

    const cycleThroughFactions = (factionIndex: number) => {
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
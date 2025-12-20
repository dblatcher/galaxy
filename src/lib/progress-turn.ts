import { getDistance, getHeadingFrom, getXYVector, translate } from "typed-geometry";
import { getTech } from "../data/tech-list";
import { autoResolveAllBattles } from "./auto-battles";
import { calculateConstructionPoints, runColonyConstruction, runColonyGrowth } from "./colony-operations";
import { takeCpuTurn } from "./cpu-turn";
import { factionHasBattlesOrCanBomb } from "./fleet-operations";
import type { Faction, Fleet, GameState, Ship } from "./model";
import { findById, isSet, mapOnId } from "./util";

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


const updateColonies = (gameState: GameState) => {
    const { fleets } = gameState
    const factionMap = mapOnId(gameState.factions);
    gameState.galaxy.stars.forEach(star => {
        const faction = isSet(star.factionId) ? factionMap[star.factionId] : undefined;
        if (faction) {
            runColonyConstruction(star, faction, fleets);
            runColonyGrowth(star);
            const researchPoints = calculateConstructionPoints(star, 'research')
            faction.researchPoints += researchPoints
        }
    })
}


const resetShip = (ship: Ship) => {
    ship.hasBombed = false
}

const startNewTurn = (oldGameState: GameState): GameState => {
    const gameState = autoResolveAllBattles({ ...oldGameState, reports: [] });
    const { galaxy, fleets, factions, turnNumber, reports } = gameState
    fleets.forEach(moveFleetInGalaxy(gameState))
    fleets.forEach(fleet => {
        fleet.ships.forEach(resetShip)
    })
    updateColonies(gameState)

    const techToAnnounce: GameState['techToAnnounce'] = []

    factions.forEach(faction => {

        const { reasearchGoal } = faction
        if (!reasearchGoal) {
            return
        }
        const goal = getTech(reasearchGoal);

        if (faction.researchPoints >= goal.cost) {
            faction.reasearchGoal = undefined
            faction.researchPoints = faction.researchPoints - goal.cost
            faction.tech[reasearchGoal] = true
            techToAnnounce.push({ factionId: faction.id, techId: reasearchGoal })
        }

        // TO DO - add completed research to faction tech
    })

    const [firstFaction] = factions

    return {
        activeFactionId: firstFaction.id,
        techToAnnounce,
        galaxy,
        fleets,
        factions,
        turnNumber: turnNumber + 1,
        starsWhereBattlesFoughtAlready: [],
        reports,
        focusedStarId: gameState.focusedStarId,
        dialog: factionHasBattlesOrCanBomb(firstFaction.id, gameState) ? {
            role: 'battles'
        } : undefined
    }
}


export const progressTurn = (oldGameState: GameState): GameState => {
    let gameState = structuredClone(oldGameState)

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
                    dialog: factionHasBattlesOrCanBomb(nextFaction.id, gameState) ? {
                        role: 'battles'
                    } : undefined
                }
            case "CPU":
                gameState = takeCpuTurn(nextFaction, gameState);
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
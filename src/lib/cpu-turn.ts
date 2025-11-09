import { gameStateReducer, type Action } from "../hooks/useGameStateReducer";
import type { Faction, GameState } from "./model";
import { findById, isSet } from "./util";


export const takeCpuTurn = (faction: Faction, oldGameState: GameState): GameState => {
    // TO DO = CPU decision logi
    // - decide which ships to build at each star
    // - issue orders (or no orders) to each fleet
    // - start colonies on planets with orbiting colony ships

    let gameState = structuredClone(oldGameState);
    const act = (action: Action) => {
        gameState = gameStateReducer(gameState, action)
    }

    const factionColonies = gameState.galaxy.stars.filter(star => star.factionId === faction.id);
    factionColonies.forEach(star => {
        if (!isSet(star.shipDesignToConstruct)) {
            act({ type: 'set-star-construction-design', starId: star.id, designId: 1 })
        }
    })

    const factionFleets = gameState.fleets.filter(fleet => fleet.factionId === faction.id)
    factionFleets.forEach(fleet => {
        const destinationStarId = 4
        const destinationStar = findById(destinationStarId, gameState.galaxy.stars)
        if (isSet(fleet.orbitingStarId) && fleet.orbitingStarId !== destinationStarId) {
            act({ type: 'select-fleet', target: fleet })
            act({ type: 'pick-destination', target: destinationStar })
        }
    })

    return gameState
}
import { getAllBattles } from "./derived-state";
import type { Battle, GameState } from "./model";

// TO DO - should this be mutating rather than returning a new GameState?
export const autoResolveBattle = (battle: Battle, oldGameState: GameState): GameState => {
    const gameState = structuredClone(oldGameState)

    // TO DO - for now, assume all fleets destroyed
    const idsOfAllShipInBattle = battle.sides.flatMap(side => side.fleets)
    const fleetsIfAllShipsDieInBattle = gameState.fleets.filter(fleet => !idsOfAllShipInBattle.includes(fleet.id))

    // TO DO - more state for reports on the battle outcomes to show the player
    return { ...gameState, fleets: fleetsIfAllShipsDieInBattle }
}

export const autoResolveAllBattles = (oldGameState: GameState): GameState => {
    let gameState = structuredClone(oldGameState);
    const battles = getAllBattles(gameState);

    battles.forEach(battle => {
        gameState = autoResolveBattle(battle, gameState)
    })

    return gameState
}
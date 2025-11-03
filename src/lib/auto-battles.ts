import { getAllBattles } from "./derived-state";
import type { Battle, BattleReport, GameState } from "./model";
import { findById } from "./util";

// TO DO - should this be mutating rather than returning a new GameState?
export const autoResolveBattle = (battle: Battle, oldGameState: GameState): GameState => {
    const gameState = structuredClone(oldGameState)

    // TO DO - for now, assume all fleets destroyed
    const idsOfAllFleetsInBattle = battle.sides.flatMap(side => side.fleets)
    const fleetsIfAllShipsDieInBattle = gameState.fleets.filter(fleet => !idsOfAllFleetsInBattle.includes(fleet.id))

    
    const report: BattleReport = {
        reportType: 'battle',
        turnNumber: gameState.turnNumber,
        star: battle.star,
        sides: battle.sides.map(side => {
            return {
                faction: side.faction,
                losses: side.fleets.flatMap(fleetId => findById(fleetId, oldGameState.fleets) ?? []).flatMap(fleet => fleet.ships),
                survivors: []
            }
        })
    }

    // TO DO - more state for reports on the battle outcomes to show the player
    return {
        ...gameState,
        fleets: fleetsIfAllShipsDieInBattle,
        reports: [...gameState.reports, report]
    }
}

export const autoResolveAllBattles = (oldGameState: GameState): GameState => {
    let gameState = structuredClone(oldGameState);
    const battles = getAllBattles(gameState);

    battles.forEach(battle => {
        gameState = autoResolveBattle(battle, gameState)
    })

    return gameState
}
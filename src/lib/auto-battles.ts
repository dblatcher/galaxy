import { populateBattleSides, removeDead } from "./battle-operations";
import { getAllBattles } from "./derived-state";
import type { Battle, BattleReport, GameState } from "./model";


export const autoResolveBattle = (battle: Battle, oldGameState: GameState): GameState => {
    const gameState = structuredClone(oldGameState)

    const populatedSides = populateBattleSides(battle, gameState)

    // TO DO - for now, assume all fleets destroyed
    populatedSides.forEach(side => {
        side.fleets.forEach(fleet => {
            fleet.ships.forEach(ship => ship.damage = Infinity)
        })
    })

    const report: BattleReport = structuredClone({
        reportType: 'battle',
        turnNumber: gameState.turnNumber,
        star: battle.star,
        sides: populatedSides,
    })

    return {
        ...gameState,
        fleets: removeDead(gameState.fleets, gameState.factions),
        reports: [...gameState.reports, report]
    }
}

export const autoResolveAllBattles = (oldGameState: GameState): GameState => {
    let gameState = structuredClone(oldGameState);
    const battles = getAllBattles(gameState);
    battles.forEach(battle => {
        gameState = autoResolveBattle(battle, gameState)
    })
    return { ...gameState, starsWhereBattlesFoughtAlready: [] }
}
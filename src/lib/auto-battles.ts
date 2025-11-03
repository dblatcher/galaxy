import { getAllBattles } from "./derived-state";
import { getDesignMap } from "./fleet-operations";
import type { Battle, BattleReport, Faction, Fleet, GameState } from "./model";
import { findById } from "./util";


const removeDead = (fleets: Fleet[], factions: Faction[]): Fleet[] => {

    
    fleets.forEach(fleet => {
        const faction = findById(fleet.factionId, factions);
        if (!faction) {
            fleet.ships = []
            return
        }
        console.log(fleet.id, faction.name)
        const designMap = getDesignMap(faction)
        fleet.ships = fleet.ships.filter(ship => ship.damage < designMap[ship.designId].hp)
    })

    return fleets.filter(fleet => fleet.ships.length > 0)
}

export const autoResolveBattle = (battle: Battle, oldGameState: GameState): GameState => {
    const gameState = structuredClone(oldGameState)

    const populatedSides = battle.sides.flatMap(side => {
        const faction = findById(side.faction, gameState.factions);
        return faction ? {
            faction,
            fleets: side.fleets.flatMap(fleetId => findById(fleetId, gameState.fleets) ?? [])
        } : []
    })

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

    return gameState
}
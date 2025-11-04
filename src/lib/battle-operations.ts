import { getDesignMap } from "./fleet-operations";
import type { Battle, BattleReport, Faction, Fleet, GameState } from "./model";
import { findById } from "./util";


export const populateBattleSides = (battle: Battle, gameState: GameState) => {
    return battle.sides.flatMap(side => {
        const faction = findById(side.faction, gameState.factions);
        return faction ? {
            faction,
            fleets: side.fleets.flatMap(fleetId => findById(fleetId, gameState.fleets) ?? [])
        } : []
    })
}

export const removeDead = (fleets: Fleet[], factions: Faction[]): Fleet[] => {
    fleets.forEach(fleet => {
        const faction = findById(fleet.factionId, factions);
        if (!faction) {
            fleet.ships = []
            return
        }
        const designMap = getDesignMap(faction)
        fleet.ships = fleet.ships.filter(ship => ship.damage < designMap[ship.designId].hp)
    })
    return fleets.filter(fleet => fleet.ships.length > 0)
}

export const updateFleetsFromBattleReport = (battleReport: BattleReport, fleets: Fleet[], factions: Faction[]): Fleet[] => {
    const fleetsInvolved = structuredClone( battleReport.sides.flatMap(side => side.fleets));
    return removeDead(fleets.map(fleet => {
        return fleetsInvolved.find(fleetFromReport => fleetFromReport.id === fleet.id) ?? fleet
    }), factions)
}

import type { Faction, Fleet, Ship } from "../lib/model";
import { enhanceShipDesign } from "../lib/ship-design-helpers";
import type { BattleState, ShipIdent, ShipInstanceInfo, ShipState } from "./model";

const getShipState = (
    factionId: number,
    fleetId: number | undefined,
    shipIndex: number | undefined,
    battleState: BattleState,
) => {
    if (typeof fleetId === 'undefined' || typeof shipIndex === 'undefined') {
        return undefined
    }
    return battleState.shipStates[factionId]?.[fleetId]?.[shipIndex]
}

export const getActiveShipIdent = (battleState: BattleState): ShipIdent | undefined => {
    const { activeShip, activeFaction } = battleState
    return activeShip && {
        factionId: activeFaction,
        fleetId: activeShip.fleetId,
        shipIndex: activeShip.shipIndex
    }
}

export const getShipStateFromIdent = (
    ident: ShipIdent,
    battleState: BattleState,
) => {
    return getShipState(ident.factionId, ident.fleetId, ident.shipIndex, battleState)
}

export const getInstance = (
    ship: Ship,
    faction: Faction,
    fleetId: number,
    shipIndex: number,
    battleState: BattleState,
): ShipInstanceInfo | undefined => {
    const state = battleState.shipStates[faction.id]?.[fleetId]?.[shipIndex];
    const design = faction.shipDesigns.find(design => design.id == ship.designId);
    if (!state || !design) {
        console.error('failed to get ship instance info', { ship, faction, fleetId, shipIndex, state, design })
        return undefined
    }
    return {
        ship,
        design: enhanceShipDesign(design),
        state,
        faction,
        ident: {
            factionId: faction.id,
            fleetId,
            shipIndex,
        }
    }
}

export const getShipFromIdent = (ident: ShipIdent, battleState: BattleState): Ship | undefined =>
    battleState.sides.find(side => side.faction.id === ident.factionId)
        ?.fleets.find(fleet => fleet.id === ident.fleetId)
        ?.ships[ident.shipIndex];

export const getActiveSide = (battleState: BattleState): {
    faction: Faction;
    fleets: Fleet[];
} | undefined =>
    battleState.sides.find(side => side.faction.id === battleState.activeFaction)

export const getActiveFaction = (battleState: BattleState): Faction | undefined =>
    getActiveSide(battleState)?.faction

export const getActiveShipState = (battleState: BattleState): ShipState | undefined => {
    const ident = getActiveShipIdent(battleState);
    return ident && getShipState(ident.factionId, ident.fleetId, ident.shipIndex, battleState)
}

export const getActiveShipInstance = (battleState: BattleState): ShipInstanceInfo | undefined => {
    const ident = getActiveShipIdent(battleState);
    const ship = ident && getShipFromIdent(ident, battleState)
    const faction = battleState.sides[battleState.activeFaction]?.faction
    if (!ship || !faction) { return undefined }
    return getInstance(ship, faction, ident.fleetId, ident.shipIndex, battleState)
}

export const identsMatch = (identA?: ShipIdent, identB?: ShipIdent): boolean =>
    !!(identA && identB) &&
    identA.factionId === identB.factionId &&
    identA.fleetId === identB.fleetId &&
    identA.shipIndex === identB.shipIndex
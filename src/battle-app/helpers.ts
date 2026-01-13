import type { Ship, Faction } from "../lib/model";
import { enhanceShipDesign } from "../lib/ship-design-helpers";
import type { ShipInstanceInfo, ShipStatesByFaction } from "./model";


export const getShipState = (
    factionId: number,
    fleetId: number,
    shipIndex: number,
    shipsByFaction: ShipStatesByFaction
) => {
    return shipsByFaction[factionId]?.[fleetId]?.[shipIndex]
}

export const getInstance = (
    ship: Ship,
    faction: Faction,
    fleetId: number,
    shipIndex: number,
    shipsByFaction: ShipStatesByFaction
): ShipInstanceInfo | undefined => {
    const state = shipsByFaction[faction.id]?.[fleetId]?.[shipIndex];
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
        fleetId,
        shipIndex,
    }
}
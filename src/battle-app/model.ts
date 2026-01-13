import type { Faction, Fleet, XY } from "../lib/model";

export type ShipState = {
    position: XY,
    remainingMovement: number
};

export type ShipStatesByFleet = Record<number, ShipState[]>;
export type ShipStatesByFaction = Record<number, ShipStatesByFleet>;

export type BattleState = {
    sides: {
        faction: Faction;
        fleets: Fleet[];
    }[];
    locations: ShipStatesByFaction;
    activeFaction: number;
    activeShip?: { fleetId: number, shipIndex: number };
}

export type BattleAction = {
    type: 'apply-damage',
    factionId: number,
    fleetId: number,
    shipIndex: number
} | {
    type: 'select-ship',
    factionId: number,
    fleetId: number,
    shipIndex: number
};

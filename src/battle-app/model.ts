import type { Faction, Fleet, Ship, XY } from "../lib/model";
import type { EnhancedShipDesign } from "../lib/ship-design-helpers";

export type ShipState = {
    position: XY;
    remainingMovement: number;
    heading: number;
    hasFired: boolean; // TO DO - model as array to track each weapon
};

export type ShipStatesByFleet = Record<number, ShipState[]>;
export type ShipStatesByFaction = Record<number, ShipStatesByFleet>;

export type BattleState = {
    sides: {
        faction: Faction;
        fleets: Fleet[];
    }[];
    shipStates: ShipStatesByFaction;
    activeFaction: number;
    activeShip?: { fleetId: number, shipIndex: number };
    targetAction?: 'move' | 'fire'
}

export type ShipIdent = {
    factionId: number,
    fleetId: number,
    shipIndex: number
}

export type BattleAction =
    { type: 'apply-damage' } & ShipIdent |
    { type: 'select-ship' } & ShipIdent |
    { type: 'clear-selected-ship' } |
    {
        type: 'set-target-mode',
        mode: 'move' | 'fire'
    } | {
        type: 'move-ship',
        location: XY,
        ident: ShipIdent
    } | {
        type: 'attempt-fire',
        target: ShipIdent,
        attacker: ShipIdent,
    } | {
        type: 'end-turn'
    };

export type ShipInstanceInfo = {
    ship: Ship;
    state: ShipState;
    design: EnhancedShipDesign;
    faction: Faction;
    fleetId: number;
    shipIndex: number;
}

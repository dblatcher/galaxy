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
export type TargetMode = 'move' | 'fire'

export type BattleState = {
    sides: {
        faction: Faction;
        fleets: Fleet[];
    }[];
    shipStates: ShipStatesByFaction;
    activeFaction: number;
    activeShip?: { fleetId: number, shipIndex: number };
    targetAction?: TargetMode;
}

export type ShipIdent = {
    factionId: number,
    fleetId: number,
    shipIndex: number
}

export type BattleAction =
    { type: 'apply-damage', ident: ShipIdent, amount: number } |
    { type: 'select-ship-and-mode', ident?: ShipIdent, mode?: TargetMode } |
    { type: 'clear-selected-ship' } |
    {
        type: 'move-ship',
        location: XY,
        ident: ShipIdent
    } | {
        type: 'resolve-fire',
        target: ShipIdent,
        attacker: ShipIdent,
        damage: number,
        distance: number,
    } | {
        type: 'end-turn'
    };

export type ShipInstanceInfo = {
    ship: Ship;
    state: ShipState;
    design: EnhancedShipDesign;
    faction: Faction;
    ident: ShipIdent
}

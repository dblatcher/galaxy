import type { Faction, Fleet, Ship, XY } from "../lib/model";
import type { EnhancedShipDesign } from "../lib/ship-design-helpers";

export type ShipState = {
    position: XY,
    remainingMovement: number
    heading: number
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
} | {
    type: 'clear-selected-ship'
} | {
    type: 'move-ship',
    location: XY,
    distance: number,
} | {
    type: 'set-target-mode',
    mode: 'move' | 'fire'
};

export type ShipInstanceInfo = {
    ship: Ship;
    state: ShipState;
    design: EnhancedShipDesign;
    faction: Faction;
    fleetId: number;
    shipIndex: number;
}

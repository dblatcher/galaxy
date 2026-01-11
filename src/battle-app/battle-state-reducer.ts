import { type XY, xy } from "typed-geometry";
import { populateBattleSides } from "../lib/battle-operations";
import { getBattleAt } from "../lib/derived-state";
import type { Faction, Fleet, GameState } from "../lib/model";

export type ShipState = {
    position: XY,
};
type ShipStatesByFleet = Record<number, ShipState[]>
type ShipStatesByFaction = Record<number, ShipStatesByFleet>;


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

export const getInitialState = (starId: number, gameState: GameState): BattleState => {
    const initialBattle = getBattleAt(starId, gameState);
    const sides = initialBattle ? populateBattleSides(initialBattle, gameState) : [];
    const locations: ShipStatesByFaction = {};
    sides.forEach((side, sideIndex) => {
        const factionData: ShipStatesByFleet = {}
        let shipY = 0
        side.fleets.forEach((fleet) => {
            factionData[fleet.id] = fleet.ships
                .map((_ship, shipIndex) => ({
                    position: xy((100 * sideIndex) + 50, (1 + shipY + shipIndex) * 50)
                }));
            shipY = shipY + fleet.ships.length
        })
        locations[side.faction.id] = factionData
    })

    return {
        sides,
        locations,
        activeFaction: sides[0].faction.id,
    }
}

export const dispatchBattleAction = (prevState: BattleState, action: BattleAction): BattleState => {
    const state = structuredClone(prevState);
    switch (action.type) {
        case "apply-damage": {
            const { factionId, fleetId, shipIndex } = action;
            const sides = state.sides
            const ship = sides.find(side => side.faction.id === factionId)
                ?.fleets.find(fleet => fleet.id === fleetId)
                ?.ships[shipIndex]
            if (ship) {
                ship.damage = ship.damage + 1
            }
            return state
        }
        case "select-ship": {
            const { factionId, fleetId, shipIndex } = action;
            if (factionId !== state.activeFaction) {
                return state
            }

            return {
                ...state,
                activeShip: { fleetId, shipIndex }
            }
        }
    }
}

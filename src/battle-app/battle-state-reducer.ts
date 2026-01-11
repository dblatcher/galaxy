import { type XY, xy } from "typed-geometry";
import { populateBattleSides } from "../lib/battle-operations";
import { getBattleAt } from "../lib/derived-state";
import type { Faction, Fleet, GameState } from "../lib/model";
import { shuffleArray } from "../lib/util";

export type ShipPosition = XY;
type ShipLocationByFleet = Record<number, ShipPosition[]>
type ShipLocationsByFaction = Record<number, ShipLocationByFleet>;


type BattleState = {
    sides: {
        faction: Faction;
        fleets: Fleet[];
    }[],
    locations: ShipLocationsByFaction
}

type BattleAction = {
    type: 'apply-damage',
    factionId: number,
    fleetId: number,
    shipIndex: number
};

export const getInitialState = (starId: number, gameState: GameState): BattleState => {
    const initialBattle = getBattleAt(starId, gameState);
    const sides = initialBattle ? populateBattleSides(initialBattle, gameState) : [];
    const locations: ShipLocationsByFaction = {};
    sides.forEach(side => {
        const factionData: ShipLocationByFleet = {}
        side.fleets.forEach(fleet => {
            factionData[fleet.id] = shuffleArray(fleet.ships)
                .map((_ship, index) =>
                    xy(1, 2 + index))
        })
        locations[side.faction.id] = factionData
    })

    return {
        sides,
        locations
    }
}

export const dispatchBattleAction = (prevState: BattleState, action: BattleAction): BattleState => {
    const state = structuredClone(prevState);
    switch (action.type) {
        case "apply-damage":
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
}

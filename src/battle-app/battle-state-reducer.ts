import { type XY, xy } from "typed-geometry";
import { populateBattleSides } from "../lib/battle-operations";
import { getBattleAt } from "../lib/derived-state";
import type { Faction, Fleet, GameState } from "../lib/model";
import { shuffleArray } from "../lib/util";

export type ShipPosition = XY;
type ShipLocationByFleet = Record<number, ShipPosition[]>
type ShipLocationsByFaction = Record<number, ShipLocationByFleet>;


export type BattleState = {
    sides: {
        faction: Faction;
        fleets: Fleet[];
    }[],
    locations: ShipLocationsByFaction
}

export type BattleAction = {
    type: 'apply-damage',
    factionId: number,
    fleetId: number,
    shipIndex: number
};

export const getInitialState = (starId: number, gameState: GameState): BattleState => {
    const initialBattle = getBattleAt(starId, gameState);
    const sides = initialBattle ? populateBattleSides(initialBattle, gameState) : [];
    const locations: ShipLocationsByFaction = {};
    sides.forEach((side, sideIndex) => {
        const factionData: ShipLocationByFleet = {}
        let shipY = 0
        side.fleets.forEach((fleet) => {
            factionData[fleet.id] = shuffleArray(fleet.ships)
                .map((_ship, shipIndex) =>
                    xy((100 * sideIndex) + 50, (1 + shipY + shipIndex) * 50))
            shipY = shipY + fleet.ships.length
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

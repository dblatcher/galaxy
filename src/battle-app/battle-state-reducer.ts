import { xy, _DEG, getHeadingFrom } from "typed-geometry";
import { populateBattleSides } from "../lib/battle-operations";
import { getBattleAt } from "../lib/derived-state";
import type { GameState } from "../lib/model";
import type { BattleAction, BattleState, ShipStatesByFaction, ShipStatesByFleet } from "./model";
import { getShipState } from "./helpers";

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
                    position: xy((100 * sideIndex) + 50, (1 + shipY + shipIndex) * 50),
                    remainingMovement: 100,
                    heading: sideIndex % 2 ? _DEG * 270 : _DEG * 90,
                }));
            shipY = shipY + fleet.ships.length
        })
        locations[side.faction.id] = factionData
    })

    return {
        sides,
        shipStates: locations,
        activeFaction: sides[0].faction.id,
        targetAction: 'move',
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
        case "clear-selected-ship": {
            return {
                ...state,
                activeShip: undefined,
            }
        }
        case "move-ship": {
            const { activeFaction, activeShip, shipStates } = state;
            const shipStateToChange = getShipState(activeFaction, activeShip?.fleetId, activeShip?.shipIndex, shipStates)

            const oldPostion = shipStateToChange ? { ...shipStateToChange.position } : xy(0, 0);

            if (shipStateToChange) {
                shipStateToChange.position.x = action.location.x;
                shipStateToChange.position.y = action.location.y;
                shipStateToChange.remainingMovement = shipStateToChange.remainingMovement - action.distance
                shipStateToChange.heading = getHeadingFrom(oldPostion, action.location)
            }

            return {
                ...state
            }
        }
        case "set-target-mode": {
            return {
                ...state,
                targetAction: action.mode
            }
        }
    }
}

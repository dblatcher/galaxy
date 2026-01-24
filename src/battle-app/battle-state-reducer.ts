import { _DEG, getDistance, getHeadingFrom, xy } from "typed-geometry";
import { populateBattleSides } from "../lib/battle-operations";
import { getBattleAt } from "../lib/derived-state";
import type { GameState } from "../lib/model";
import { getShipFromIdent, getShipStateFromIdent } from "./helpers";
import type { BattleAction, BattleState, ShipStatesByFaction, ShipStatesByFleet } from "./model";

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
                    position: xy((100 * sideIndex) + 50, (1 + shipY + shipIndex) * 30),
                    remainingMovement: 100,
                    heading: sideIndex % 2 ? _DEG * 270 : _DEG * 90,
                    hasFired: false,
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
            const ship = getShipFromIdent(action.ident, state)
            if (ship) {
                ship.damage = ship.damage + action.amount
            }
            return { ...state }
        }
        case "select-ship": {
            const { factionId, fleetId, shipIndex } = action.ident;
            if (factionId !== state.activeFaction) {
                return { ...state }
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
            const shipStateToChange = getShipStateFromIdent(action.ident, state)
            if (shipStateToChange) {
                const distance = Math.ceil(getDistance(shipStateToChange?.position, action.location))
                shipStateToChange.heading = getHeadingFrom({ ...shipStateToChange.position }, action.location)
                shipStateToChange.position.x = action.location.x;
                shipStateToChange.position.y = action.location.y;
                shipStateToChange.remainingMovement = shipStateToChange.remainingMovement - distance
            }
            return { ...state }
        }
        case "set-target-mode": {
            return {
                ...state,
                targetAction: action.mode
            }
        }
        case "resolve-fire": {
            const targetShipState = getShipStateFromIdent(action.target, state)
            const attackerShipState = getShipStateFromIdent(action.attacker, state)
            const targetShip = getShipFromIdent(action.target, state)
            if (!targetShipState || !attackerShipState || !targetShip) {
                console.error('invalid idents', action)
                return { ...state }
            }

            targetShip.damage = targetShip.damage + action.damage
            attackerShipState.hasFired = true
            return { ...state }
        }
        case "end-turn": {
            const { activeFaction, sides, shipStates } = state
            const currentFactionIndex = sides.findIndex(side => side.faction.id === activeFaction);
            const newSide = sides[currentFactionIndex + 1] ?? sides[0];

            state.activeFaction = newSide.faction.id

            Object.values(shipStates)
                .forEach(factionShipState =>
                    Object.values(factionShipState)
                        .forEach(fleetShipStates =>
                            fleetShipStates
                                .forEach(shipState => {
                                    shipState.hasFired === false;
                                    shipState.remainingMovement = 100;
                                })
                        )
                )

            return { ...state }
        }
    }
}

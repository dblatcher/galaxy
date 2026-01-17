import { xy, _DEG, getHeadingFrom, getDistance } from "typed-geometry";
import { populateBattleSides } from "../lib/battle-operations";
import { getBattleAt } from "../lib/derived-state";
import type { GameState } from "../lib/model";
import type { BattleAction, BattleState, ShipStatesByFaction, ShipStatesByFleet, ShipIdent } from "./model";
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

    const lookUpState = (ident: ShipIdent) => {
        return getShipState(ident.factionId, ident.fleetId, ident.shipIndex, state.shipStates)
    }

    const lookUpShip = (ident: ShipIdent) => {
        const { factionId, fleetId, shipIndex } = ident;
        return state.sides.find(side => side.faction.id === factionId)
            ?.fleets.find(fleet => fleet.id === fleetId)
            ?.ships[shipIndex]
    }

    switch (action.type) {
        case "apply-damage": {
            const ship = lookUpShip(action)
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
                shipStateToChange.remainingMovement = shipStateToChange.remainingMovement - Math.ceil(action.distance)
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
        case "attempt-fire": {
            const targetShipState = lookUpState(action.target)
            const attackerShipState = lookUpState(action.attacker)
            const targetShip = lookUpShip(action.target)
            console.log(targetShipState, attackerShipState)
            if (attackerShipState?.hasFired || !targetShipState || !attackerShipState || !targetShip) {
                return { ...state }
            }

            const distance = getDistance(targetShipState.position, attackerShipState.position);
            if (distance > 50) {
                return { ...state }
            }

            targetShip.damage = targetShip.damage + 1
            attackerShipState.hasFired = true
            return {
                ...state
            }
        }
    }
}

import { Fragment, useReducer } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { BattleParameters } from "../lib/model"
import { dispatchBattleAction, getInitialState } from "./battle-state-reducer"
import { BattleMap } from "./BattleMap"
import type { ShipState } from "./model"
import { ShipProfile } from "./ShipInfo"


interface Props {
    params: BattleParameters
}


export const BattleApp = ({ params }: Props) => {
    const { gameState, dispatch: gameStateDispatch } = useGameStateContext()
    const [battleState, dispatch] = useReducer(
        dispatchBattleAction,
        getInitialState(params.starId, gameState)
    )

    const lookUpShipState = (factionId: number, fleetId: number, shipIndex: number): ShipState | undefined => {
        return battleState.locations[factionId]?.[fleetId]?.[shipIndex]
    }

    const conclude = () => {
        gameStateDispatch({
            type: 'battles:result', report: {
                star: params.starId,
                reportType: 'battle',
                turnNumber: gameState.turnNumber,
                sides: battleState.sides,
            }
        })
    }

    return (
        <main>
            <p>Battle</p>

            <div style={{ display: 'flex', gap: 20 }}>
                {battleState.sides.map(side => (
                    <div key={side.faction.id}>
                        <h3>
                            {side.faction.name}
                            {side.faction.id === battleState.activeFaction && "*"}
                        </h3>

                        {side.fleets.map(fleet =>
                            <Fragment key={fleet.id}>
                                {fleet.ships.map((ship, index) => (
                                    <div key={index} style={{ display: 'flex', gap: 5 }}>
                                        <button
                                            disabled={side.faction.id !== battleState.activeFaction}
                                            onClick={() => dispatch({
                                                type: 'select-ship',
                                                factionId: side.faction.id,
                                                fleetId: fleet.id,
                                                shipIndex: index
                                            })}
                                        >select</button>
                                        <button onClick={() => dispatch({
                                            type: 'apply-damage',
                                            factionId: side.faction.id,
                                            fleetId: fleet.id,
                                            shipIndex: index
                                        })}>damage</button>
                                        <div>
                                            <ShipProfile faction={side.faction} ship={ship} />
                                            <div>
                                                [
                                                {lookUpShipState(side.faction.id, fleet.id, index)!.position.x},
                                                {lookUpShipState(side.faction.id, fleet.id, index)!.position.y}
                                                ]
                                                moves: {lookUpShipState(side.faction.id, fleet.id, index)!.remainingMovement}
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </Fragment>
                        )}
                    </div>
                ))}

            </div>
            <BattleMap scale={3} battleState={battleState} />
            <button onClick={conclude}>conclude</button>
        </main>
    )

}
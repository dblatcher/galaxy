import { Fragment, useReducer } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { BattleParameters } from "../lib/model"
import { dispatchBattleAction, getInitialState } from "./battle-state-reducer"
import { BattleMap } from "./BattleMap"
import { getInstance } from "./helpers"
import { ShipControls } from "./ShipControls"

interface Props {
    params: BattleParameters
}

export const BattleApp = ({ params }: Props) => {
    const { gameState, dispatch: gameStateDispatch } = useGameStateContext()
    const [battleState, dispatch] = useReducer(
        dispatchBattleAction,
        getInitialState(params.starId, gameState)
    )

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
            <header>
                <h1>Battle</h1>
                <button onClick={conclude}>conclude</button>
            </header>

            <div style={{ display: 'flex', gap: 20 }}>
                {battleState.sides.map(side => (
                    <div key={side.faction.id}>
                        <h3>
                            {side.faction.name}
                            {side.faction.id === battleState.activeFaction && "*"}
                        </h3>

                        {side.fleets.map(fleet =>
                            <Fragment key={fleet.id}>
                                {fleet.ships.map((ship, shipIndex) => {
                                    const shipInstance = getInstance(ship, side.faction, fleet.id, shipIndex, battleState.shipStates)
                                    if (!shipInstance) { return null }

                                    return <ShipControls key={shipIndex}
                                        shipInstance={shipInstance}
                                        isSelected={battleState.activeShip?.fleetId === shipInstance.fleetId && battleState.activeShip?.shipIndex === shipInstance.shipIndex}
                                        dispatch={dispatch}
                                        isActiveFaction={battleState.activeFaction === shipInstance.faction.id}
                                    />

                                })}
                            </Fragment>
                        )}
                    </div>
                ))}
            </div>
            <BattleMap scale={2} battleState={battleState} />
        </main>
    )
}
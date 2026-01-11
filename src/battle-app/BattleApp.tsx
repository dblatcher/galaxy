import { Fragment, useReducer } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { BattleParameters } from "../lib/model"
import { ShipProfile } from "./ShipInfo"
import { dispatchBattleAction, getInitialState, type ShipPosition } from "./battle-state-reducer"


interface Props {
    params: BattleParameters
}


export const BattleApp = ({ params }: Props) => {
    const { gameState, dispatch: gameStateDispatch } = useGameStateContext()
    const [battleState, dispatch] = useReducer(
        dispatchBattleAction,
        getInitialState(params.starId, gameState)
    )

    const lookUpLocation = (factionId: number, fleetId: number, shipIndex: number): ShipPosition | undefined => {
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
                        <h3>{side.faction.name}</h3>

                        {side.fleets.map(fleet =>
                            <Fragment key={fleet.id}>
                                {fleet.ships.map((ship, index) => (
                                    <div key={index} style={{ display: 'flex', gap: 5 }}>
                                        <div>
                                            <ShipProfile faction={side.faction} ship={ship} />
                                            <div>
                                                [
                                                {lookUpLocation(side.faction.id, fleet.id, index)!.x},
                                                {lookUpLocation(side.faction.id, fleet.id, index)!.y}
                                                ]
                                            </div>
                                        </div>
                                        <button onClick={() => dispatch({
                                            type: 'apply-damage',
                                            factionId: side.faction.id,
                                            fleetId: fleet.id,
                                            shipIndex: index
                                        })}>damage</button>
                                    </div>

                                ))}
                            </Fragment>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={conclude}>conclude</button>
        </main>
    )

}
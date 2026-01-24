import { Fragment, useEffect, useReducer } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { BattleParameters } from "../lib/model"
import { BattleStateContext } from "./battle-state-context"
import { dispatchBattleAction, getInitialState } from "./battle-state-reducer"
import { BattleMap } from "./BattleMap"
import { getActiveFaction, getInstance } from "./helpers"
import { ShipControls } from "./ShipControls"
import { TargetModeControl } from "./TargetModeControl"
import { startCpuPlayerAutomation } from "./cpu-automation"

interface Props {
    params: BattleParameters
}

export const BattleApp = ({ params }: Props) => {
    const { gameState, dispatch: gameStateDispatch } = useGameStateContext()
    const [battleState, dispatch] = useReducer(
        dispatchBattleAction,
        getInitialState(params.starId, gameState)
    )

    const isNotLocalPlayerTurn = getActiveFaction(battleState)?.playerType !== 'LOCAL'

    useEffect(() => {
        const faction = getActiveFaction(battleState);
        console.log('it is now the turn of:', faction?.name, faction?.playerType)
        if (faction?.playerType === 'CPU') {
            startCpuPlayerAutomation(battleState, dispatch)
        }
        // TO DO - if not local player, kick off the automation in real time
    }, [battleState.activeFaction])

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
        <BattleStateContext.Provider value={{ battleState, dispatch }}>
            <main>
                <header>
                    <h1>Battle</h1>
                    <button onClick={conclude}>conclude</button>
                </header>

                <TargetModeControl />
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
                                        const shipInstance = getInstance(ship, side.faction, fleet.id, shipIndex, battleState)
                                        if (!shipInstance) { return null }

                                        return <ShipControls key={shipIndex}
                                            shipInstance={shipInstance}
                                            isSelected={battleState.activeShip?.fleetId === shipInstance.fleetId && battleState.activeShip?.shipIndex === shipInstance.shipIndex}
                                            isActiveFaction={battleState.activeFaction === shipInstance.faction.id}
                                        />

                                    })}
                                </Fragment>
                            )}
                        </div>
                    ))}
                    <BattleMap scale={2} isNotLocalPlayerTurn={isNotLocalPlayerTurn} />
                </div>
                <button
                    disabled={isNotLocalPlayerTurn}
                    onClick={() => dispatch({ type: 'end-turn' })}>next turn</button>
            </main>
        </BattleStateContext.Provider>
    )
}
import { Fragment } from "react"
import { getActiveFaction, getInstance } from "../helpers"
import { TargetModeControl } from "../TargetModeControl"
import { BattleMap } from "./BattleMap"
import { ShipControls } from "./ShipControls"
import { useBattleState } from "../battle-state-context"


export const MainLayout = () => {
    const { battleState, dispatch } = useBattleState()
    const isNotLocalPlayerTurn = getActiveFaction(battleState)?.playerType !== 'LOCAL';

    return <main>
        <header>
            <h1>Battle</h1>
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
}
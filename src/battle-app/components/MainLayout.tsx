import { useBattleState } from "../battle-state-context"
import { getActiveFaction, getActiveShipIdent, getInstancesForSide, identsMatch } from "../helpers"
import { TargetModeControl } from "../TargetModeControl"
import { BattleMap } from "./BattleMap"
import { ShipControls } from "./ShipControls"


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
                <div key={side.faction.id} style={{ minWidth: 150 }}>
                    <h3>
                        {side.faction.name}
                        {side.faction.id === battleState.activeFaction && "*"}
                    </h3>
                    {getInstancesForSide(side, battleState).map(shipInstance =>
                        <ShipControls key={JSON.stringify(shipInstance.ident)}
                            shipInstance={shipInstance}
                            isSelected={identsMatch(shipInstance.ident, getActiveShipIdent(battleState))}
                            isActiveFaction={battleState.activeFaction === shipInstance.faction.id}
                        />
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
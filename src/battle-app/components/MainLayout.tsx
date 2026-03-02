import { useState } from "react"
import { useBattleState } from "../battle-state-context"
import { getActiveFaction, getActiveShipIdent, getInstanceFromIdent, getInstancesForSide, identsMatch, stringifyIdent } from "../helpers"
import { TargetModeControl } from "../TargetModeControl"
import { BattleMap } from "./BattleMap"
import { ShipControls } from "./ShipControls"
import type { ShipIdent } from "../model"
import { ShipInfo } from "./ShipInfo"


export const MainLayout = () => {
    const { battleState, dispatch } = useBattleState()
    const isNotLocalPlayerTurn = getActiveFaction(battleState)?.playerType !== 'LOCAL';
    const [hoveredIdent, setHoveredIdent] = useState<ShipIdent>()

    const hoveredShipInstance = hoveredIdent && getInstanceFromIdent(hoveredIdent, battleState)

    return <main>
        <header>
            <h1>Battle</h1>
        </header>

        <div style={{ minHeight: 60, display: 'flex' }}>
            <TargetModeControl />
            {hoveredShipInstance && <ShipInfo shipInstance={hoveredShipInstance} />}
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
            <BattleMap scale={2} isNotLocalPlayerTurn={isNotLocalPlayerTurn} setHoveredIdent={setHoveredIdent} />
            {battleState.sides.map(side => (
                <div key={side.faction.id} style={{ minWidth: 170 }}>
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
        </div>
        <button
            disabled={isNotLocalPlayerTurn}
            onClick={() => dispatch({ type: 'end-turn' })}>next turn</button>
    </main>
}
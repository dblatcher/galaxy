import { useState } from "react"
import { useBattleState } from "../battle-state-context"
import { getActiveFaction, getActiveShipIdent, getActiveSide, getInstanceFromIdent, getInstancesForSide, identsMatch, stringifyIdent } from "../helpers"
import { BattleMap } from "./BattleMap"
import { ShipControls } from "./ShipControls"
import type { ShipIdent } from "../model"
import { ShipInfo } from "./ShipInfo"


export const MainLayout = () => {
    const { battleState, dispatch } = useBattleState()
    const isNotLocalPlayerTurn = getActiveFaction(battleState)?.playerType !== 'LOCAL';
    const [hoveredIdent, setHoveredIdent] = useState<ShipIdent>()

    const hoveredShipInstance = hoveredIdent && getInstanceFromIdent(hoveredIdent, battleState)
    const side = getActiveSide(battleState)

    return <main>
        <header>
            <h1>Battle</h1>
        </header>

        <div style={{ minHeight: 60, display: 'flex' }}>
            <button
                disabled={isNotLocalPlayerTurn}
                onClick={() => dispatch({ type: 'end-turn' })}>next turn</button>
            {hoveredShipInstance && <ShipInfo shipInstance={hoveredShipInstance} />}
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
            <BattleMap scale={2} isNotLocalPlayerTurn={isNotLocalPlayerTurn} setHoveredIdent={setHoveredIdent} />

            {side && (
                <div className="semantic-box" style={{ minWidth: 300 }}>
                    <header>
                        {side.faction.name}
                    </header>
                    {getInstancesForSide(side, battleState).map(shipInstance =>
                        <ShipControls key={JSON.stringify(shipInstance.ident)}
                            shipInstance={shipInstance}
                            isHovered={identsMatch(shipInstance.ident, hoveredIdent)}
                            isSelected={identsMatch(shipInstance.ident, getActiveShipIdent(battleState))}
                        />
                    )}
                </div>
            )}
        </div>

    </main>
}
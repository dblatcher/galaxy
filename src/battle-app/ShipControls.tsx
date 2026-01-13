import type { ActionDispatch } from "react"
import type { BattleAction, ShipInstanceInfo } from "./model"
import { ShipInfo } from "./ShipInfo"


export const ShipControls = ({
    shipInstance,
    isActiveFaction,
    dispatch,
}: {
    shipInstance: ShipInstanceInfo,
    isSelected: boolean,
    isActiveFaction: boolean,
    dispatch: ActionDispatch<[action: BattleAction]>
}) => {
    const {  faction, fleetId, shipIndex } = shipInstance

    return <div key={shipIndex} style={{ display: 'flex', gap: 5 }}>
        <button
            disabled={!isActiveFaction}
            onClick={() => dispatch({
                type: 'select-ship',
                factionId: faction.id,
                fleetId: fleetId,
                shipIndex: shipIndex
            })}
        >select</button>
        <button onClick={() => dispatch({
            type: 'apply-damage',
            factionId: faction.id,
            fleetId: fleetId,
            shipIndex: shipIndex
        })}>damage</button>
        <ShipInfo shipInstance={shipInstance} />
    </div>

}
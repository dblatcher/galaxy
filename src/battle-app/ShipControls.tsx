import type { ActionDispatch } from "react"
import type { BattleAction, ShipInstanceInfo } from "./model"
import { ShipInfo } from "./ShipInfo"
import { ToggleableBox } from "../components/ToggleableBox"


export const ShipControls = ({
    shipInstance,
    isActiveFaction,
    isSelected,
    dispatch,
}: {
    shipInstance: ShipInstanceInfo,
    isActiveFaction: boolean,
    isSelected: boolean,
    dispatch: ActionDispatch<[action: BattleAction]>
}) => {
    const { faction, fleetId, shipIndex } = shipInstance

    return <div key={shipIndex} style={{ display: 'flex', gap: 5 }}>
        <button onClick={() => dispatch({
            type: 'apply-damage',
            factionId: faction.id,
            fleetId: fleetId,
            shipIndex: shipIndex
        })}>damage</button>

        <ToggleableBox
            disabled={!isActiveFaction}
            checked={isSelected}
            setChecked={(checked) => {
                dispatch(checked
                    ? { type: 'select-ship', factionId: faction.id, fleetId: fleetId, shipIndex: shipIndex }
                    : { type: 'clear-selected-ship' }
                )
            }}>
            <ShipInfo shipInstance={shipInstance} />
        </ToggleableBox>
    </div>

}
import { ToggleableBox } from "../components/ToggleableBox"
import { useBattleState } from "./battle-state-context"
import type { ShipInstanceInfo } from "./model"
import { ShipInfo } from "./ShipInfo"


export const ShipControls = ({
    shipInstance,
    isActiveFaction,
    isSelected,
}: {
    shipInstance: ShipInstanceInfo,
    isActiveFaction: boolean,
    isSelected: boolean,
}) => {
    const { dispatch } = useBattleState()
    const { faction, fleetId, shipIndex } = shipInstance

    return <div key={shipIndex} style={{ display: 'flex', gap: 5 }}>
        <button onClick={() => dispatch({
            type: 'apply-damage',
            factionId: faction.id,
            fleetId: fleetId,
            shipIndex: shipIndex
        })}>Dmg</button>

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
import { ToggleableBox } from "../../components/ToggleableBox"
import { useBattleState } from "../battle-state-context"
import type { ShipInstanceInfo } from "../model"
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

    return <ToggleableBox key={shipIndex}
        disabled={!isActiveFaction}
        checked={isSelected}
        setChecked={(checked) => {
            dispatch(checked
                ? {
                    type: 'select-ship',
                    ident: {
                        factionId: faction.id,
                        fleetId,
                        shipIndex
                    }
                }
                : { type: 'clear-selected-ship' }
            )
        }}>
        <ShipInfo shipInstance={shipInstance} />
    </ToggleableBox>
}
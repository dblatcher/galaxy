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
    const { ident } = shipInstance

    return <ToggleableBox key={ident.shipIndex}
        disabled={!isActiveFaction}
        checked={isSelected}
        setChecked={(checked) => {
            dispatch(checked
                ? {
                    type: 'select-ship',
                    ident
                }
                : { type: 'clear-selected-ship' }
            )
        }}>
        <ShipInfo shipInstance={shipInstance} />
    </ToggleableBox>
}
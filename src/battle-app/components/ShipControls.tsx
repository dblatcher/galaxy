import type { ReactNode } from "react"
import { useBattleState } from "../battle-state-context"
import { checkCanFire, isAlive } from "../helpers"
import type { ShipInstanceInfo, TargetMode } from "../model"
import { ShipInfo } from "./ShipInfo"


export const ShipControls = ({
    shipInstance,
    isSelected,
    isHovered
}: {
    shipInstance: ShipInstanceInfo,
    isSelected: boolean,
    isHovered: boolean,
}) => {
    const { dispatch, battleState } = useBattleState()
    const { ident } = shipInstance

    const ModeButton = ({ children, mode, disabled }: { children: ReactNode, mode: TargetMode, disabled?: boolean }) => <button
        style={{
            borderWidth: 1,
            padding: 4,
            minWidth: 50,
            borderColor: (isSelected && battleState.targetAction === mode) ? 'white' : 'black',
            borderStyle: 'solid',
        }}
        disabled={!isAlive(shipInstance) || disabled}
        onClick={() => {
            dispatch(
                {
                    type: 'select-ship-and-mode',
                    ident,
                    mode
                }
            )
        }}>
        {children}
    </button>


    return <div style={{
        display: 'flex',
        marginBottom: 2,
        justifyContent: 'space-between',
        gap: 4,
        minWidth: 240,
        backgroundColor: isHovered ? 'black' : undefined,
        padding: '4px 6px',
        borderRadius: 4,
    }}>
        <div style={{ marginRight: 'auto', alignSelf: 'center' }}>
            <ShipInfo shipInstance={shipInstance} noActionState />
        </div>
        <ModeButton mode="move">
            <div>Move</div>
            <div>{shipInstance.state.remainingMovement}</div>
        </ModeButton>
        <ModeButton mode="fire" disabled={!checkCanFire(shipInstance)}>
            fire
        </ModeButton>
    </div>
}
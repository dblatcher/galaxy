import { FleetIcon } from "../../components/FleetSymbol"
import { useBattleState } from "../battle-state-context"
import { checkCanFire, isAlive } from "../helpers"
import type { ShipInstanceInfo } from "../model"

interface Props {
    shipInstance: ShipInstanceInfo
    noActionState?: boolean
}

export const ShipInfo = ({ shipInstance, noActionState }: Props) => {
    const { battleState } = useBattleState()
    const { faction, ship, state } = shipInstance
    const { hp, name } = shipInstance.design;
    const isDead = !isAlive(shipInstance)
    const canFire = checkCanFire(shipInstance);
    const showActionState = !noActionState && battleState.activeFaction === faction.id

    return <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FleetIcon color={isDead ? 'black' : faction.color} />
            {isDead ? <s>{name}</s> : <span>{name}</span>}
            <span>{hp - ship.damage}/{hp}</span>
        </div>
        {showActionState && (
            <div>
                <span>
                    moves: {state.remainingMovement.toFixed(0)}
                </span>
                {', '}
                <span>
                    Can fire: {canFire ? '*' : '-'}
                </span>
            </div>
        )}
    </div>
}
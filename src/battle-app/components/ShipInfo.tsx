import { FleetIcon } from "../../components/FleetSymbol"
import { useBattleState } from "../battle-state-context"
import { checkCanFire, isAlive } from "../helpers"
import type { ShipInstanceInfo } from "../model"

interface Props {
    shipInstance: ShipInstanceInfo
}

export const ShipInfo = ({ shipInstance }: Props) => {
    const { battleState } = useBattleState()
    const { faction, ship, state } = shipInstance
    const { hp, name } = shipInstance.design;
    const isDead = !isAlive(shipInstance)
    const canFire = checkCanFire(shipInstance);
    const showActionState = battleState.activeFaction === faction.id

    return <div>
        <div>
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
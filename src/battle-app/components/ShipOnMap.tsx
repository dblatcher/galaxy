import { useCallback, useEffect, useState } from "react"
import { getDistance, getHeadingFrom, getXYVector, translate, xy } from "typed-geometry"
import { FleetSymbol } from "../../components/FleetSymbol"
import type { ShipInstanceInfo } from "../model"
import { useBattleState } from "../battle-state-context"
import { getActiveShipState } from "../helpers"
import { ANIMATION_MOVE_PER_STEP, ANIMATION_STEP_MS, DEFAULT_WEAPON_RANGE } from "../constants"

interface Props {
    shipInstance: ShipInstanceInfo,
    handleClickOnShip: { (shipInstance: ShipInstanceInfo): void }
}

export const ShipOnMap = ({ shipInstance, handleClickOnShip }: Props) => {
    const { battleState } = useBattleState();
    const { activeShip, activeFaction, targetAction } = battleState;
    const activeShipState = getActiveShipState(battleState);
    const isPlayerShip = shipInstance.faction.id === battleState.activeFaction;
    const isActiveShip = activeFaction === shipInstance.faction.id &&
        activeShip?.fleetId == shipInstance.ident.fleetId &&
        activeShip.shipIndex === shipInstance.ident.shipIndex

    const { ship, faction, ident, design } = shipInstance
    const { position, heading } = shipInstance.state
    const { name, hp } = design
    const [displayPosition, setDisplayPosition] = useState(position)

    const updateDisplayPosition = useCallback(() => {
        requestAnimationFrame(() => {
            setDisplayPosition(displayPosition => {
                if (position.x === displayPosition.x && position.y === displayPosition.y) { return displayPosition }
                const distance = getDistance(displayPosition, position)
                const heading = getHeadingFrom(displayPosition, position)
                if (distance < 1) {
                    return position
                }
                return translate(displayPosition, getXYVector(ANIMATION_MOVE_PER_STEP, heading))
            })
        })
    }, [position])

    useEffect(() => {
        const timer = setInterval(updateDisplayPosition, ANIMATION_STEP_MS)
        return () => {
            clearInterval(timer)
        }
    }, [updateDisplayPosition])


    if (ship.damage >= hp) {
        return null
    }

    const onClick = (!isActiveShip)
        ? () => handleClickOnShip(shipInstance)
        : undefined;

    const isPotentialTarget = !isPlayerShip && targetAction === 'fire' && activeShipState?.hasFired === false;
    const isInRange = activeShip && isPotentialTarget
        ? getDistance(activeShipState.position, shipInstance.state.position) <= DEFAULT_WEAPON_RANGE
        : false

    const cursor = isPlayerShip
        ? 'pointer'
        : targetAction === 'fire'
            ? isInRange
                ? 'crosshair'
                : 'not-allowed'
            : 'default'

    return <g
        key={`${ident.factionId}-${ident.fleetId}-${ident.shipIndex}`}
        data-side={faction.name}
        data-ship-type={name}>
        <FleetSymbol
            color={faction.color}
            location={displayPosition ?? position}
            h={heading}
            onClick={onClick}
            cursor={cursor}
        />
        <text {...translate(position, xy(-4, 8))}
            fontSize={5}
            fill="white"
            style={{ cursor: 'default' }}
        >{name}</text>
    </g>
}

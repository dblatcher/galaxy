import type { MouseEvent } from "react"
import { getDistance, getHeadingFrom, translate, xy } from "typed-geometry"
import { FleetSymbol } from "../../components/FleetSymbol"
import { LineTo } from "../../components/LineTo"
import { useAnimationState } from "../animation-context"
import { useBattleState } from "../battle-state-context"
import { DEFAULT_WEAPON_RANGE } from "../constants"
import { getActiveShipState, stringifyIdent } from "../helpers"
import type { ShipIdent, ShipInstanceInfo } from "../model"

interface Props {
    shipInstance: ShipInstanceInfo,
    handleClickOnShip: { (shipInstance: ShipInstanceInfo, event: MouseEvent): void }
    setHoveredIdent: { (ident?: ShipIdent): void }
}

export const ShipOnMap = ({ shipInstance, handleClickOnShip, setHoveredIdent }: Props) => {
    const { battleState } = useBattleState();
    const { animationState: { shipMoves } } = useAnimationState()
    const { activeShip, activeFaction, targetAction } = battleState;
    const activeShipState = getActiveShipState(battleState);
    const isPlayerShip = shipInstance.faction.id === battleState.activeFaction;
    const isActiveShip = activeFaction === shipInstance.faction.id &&
        activeShip?.fleetId == shipInstance.ident.fleetId &&
        activeShip.shipIndex === shipInstance.ident.shipIndex

    const { ship, faction, ident, design } = shipInstance
    const { position, heading } = shipInstance.state
    const { name, hp } = design

    const { waypoints = [], displayPosition } = shipMoves[stringifyIdent(ident)] ?? {}
    const [nextWaypoint] = waypoints;
    const displayHeading = (displayPosition && nextWaypoint) ? getHeadingFrom(displayPosition, nextWaypoint) : undefined

    if (ship.damage >= hp) {
        return null
    }

    const onClick = (event: MouseEvent) => handleClickOnShip(shipInstance, event)

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

    return <>
        <g
            key={`${ident.factionId}-${ident.fleetId}-${ident.shipIndex}`}
            data-side={faction.name}
            data-ship-type={name}
        >
            <FleetSymbol
                color={faction.color}
                location={displayPosition ?? position}
                h={displayHeading ?? heading}
                onClick={onClick}
                cursor={cursor}
                onPointerEnter={() => {
                    setHoveredIdent(ident)
                }}
                onPointerLeave={() => {
                    setHoveredIdent(undefined)
                }}
            />
            <text {...translate(position, xy(-4, 8))}
                fontSize={5}
                fontWeight={isActiveShip ? 700 : 300}
                fill="white"
                style={{ cursor: 'default' }}
            >{name}</text>
        </g>
        {waypoints.map((point, index) => (
            <LineTo key={index}
                priority="subdued"
                line={{ points: [waypoints[index - 1] ?? displayPosition ?? position, point] }}
            />
        ))}
    </>
}

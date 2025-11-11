import { getHeadingFrom } from "typed-geometry"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Fleet, XY } from "../lib/model"
import { LineTo } from "./LineTo"
import { findById } from "../lib/util"
import { FleetSymbol } from "./FleetSymbol"

interface Props {
    fleet: Fleet
}


export const FleetPlot = ({ fleet }: Props) => {
    const { gameState: { galaxy, selectedFleetId, factions }, dispatch } = useGameStateContext()
    const orbiting = findById(fleet.orbitingStarId, galaxy.stars)
    const destination = findById(fleet.destinationStarId, galaxy.stars)
    const faction = findById(fleet.factionId, factions);
    const location: XY = orbiting ?? fleet.location
    const priority = selectedFleetId === fleet.id ? undefined : 'subdued'

    const h = destination ? getHeadingFrom(location, destination) : undefined;
    const onClick = !orbiting ? () => {
        dispatch({ type: 'select-fleet', target: fleet })
    } : undefined

    const className = orbiting ? 'fleet' : 'fleet fleet--clickable'

    const shouldRenderSymbol = fleet.id === selectedFleetId || !orbiting;

    return (
        <>
            {shouldRenderSymbol && (
                <g className={className}>
                    <FleetSymbol h={h} color={faction?.color} location={location} onClick={onClick} />
                </g>
            )}
            {destination && (
                <LineTo line={{ points: [location, destination] }} priority={priority} />
            )}
        </>
    )
}
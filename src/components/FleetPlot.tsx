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
    const { gameState: { galaxy, selectedFleetId, factions } } = useGameStateContext()
    const orbiting = findById(fleet.orbitingStarId, galaxy.stars)
    const destination = findById(fleet.destinationStarId, galaxy.stars)
    const faction = findById(fleet.factionId, factions);
    const location: XY = orbiting ?? fleet.location
    const priority = selectedFleetId === fleet.id ? undefined : 'subdued'

    const h = destination && !orbiting ? getHeadingFrom(location, destination) : undefined

    return (
        <>
            <FleetSymbol h={h} color={faction?.color} location={location} />
            {destination && (
                <LineTo line={{ points: [location, destination] }} priority={priority} />
            )}
        </>
    )

}
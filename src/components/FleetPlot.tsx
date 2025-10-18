import { getHeadingFrom } from "typed-geometry"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Fleet, XY } from "../lib/model"
import { LineTo } from "./LineTo"
import { findById } from "../lib/util"

interface Props {
    fleet: Fleet
}

const getPoints = (x: number, y: number) => `${x},${y - 3} ${x + 3},${y + 3} ${x},${y + 2} ${x - 3},${y + 3}`

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
            <polygon
                style={{
                    transformBox: 'border-box',
                    transformOrigin: 'center',
                    transform: h ? `rotate(${180 - (h * 180 / Math.PI)}deg)` : undefined
                }}
                points={getPoints(location.x, location.y)}
                fill={faction?.color}
                stroke="white"
                strokeWidth={.5}
                pointerEvents={orbiting ? 'none' : 'hover'}
            />
            {destination && (
                <LineTo line={{ points: [location, destination] }} priority={priority} />
            )}
        </>
    )

}
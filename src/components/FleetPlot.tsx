import { getHeadingFrom } from "typed-geometry"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Fleet, XY } from "../lib/model"
import { LineTo } from "./LineTo"

interface Props {
    fleet: Fleet
}

const getPoints = (x: number, y: number) => `${x},${y - 3} ${x + 3},${y + 3} ${x},${y + 2} ${x - 3},${y + 3}`

export const FleetPlot = ({ fleet }: Props) => {
    const { gameState: { galaxy, selectedFleetId } } = useGameStateContext()
    const orbiting = fleet.orbitingStarId ? galaxy.stars.find(star => star.id === fleet.orbitingStarId) : undefined;
    const destination = fleet.destinationStarId ? galaxy.stars.find(star => star.id === fleet.destinationStarId) : undefined;
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
                fill="white"
                pointerEvents={orbiting ? 'none' : 'hover'}
            />
            {destination && (
                <LineTo line={{ points: [location, destination] }} priority={priority} />
            )}
        </>
    )

}
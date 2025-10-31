import { useGameStateContext } from "../hooks/useGameStateContext"
import { handleStarClickFunction } from "../lib/ui-interactions"
import { FleetPlot } from "./FleetPlot"
import { StarPlot } from "./StarPlot"

interface Props {
    scale: number
}

const mapMargin = 10


export const GalaxyMap = ({ scale }: Props) => {
    const { dispatch, gameState, activeStarId } = useGameStateContext()
    const { fleets } = gameState
    const { stars, width, height } = gameState.galaxy


    return (
        <svg viewBox={`${-mapMargin} ${-mapMargin} ${width + 2 * mapMargin} ${height + 2 * mapMargin}`} style={{
            width: width * scale,
            height: height * scale,
        }} onClick={() => dispatch({ type: 'focus-star' })}>
            {stars.map((star, index) => (
                <StarPlot key={index}
                    isActive={activeStarId === star.id}
                    star={star}
                    onClick={handleStarClickFunction(gameState, dispatch)} />
            ))}
            {fleets.map((fleet) => <FleetPlot key={fleet.id} fleet={fleet} />)}

        </svg>
    )

}
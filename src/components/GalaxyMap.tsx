import { useGameStateContext } from "../hooks/useGameStateContext"
import { handleStarClickFunction } from "../lib/ui-interactions"
import { FleetPlot } from "./FleetPlot"
import { LineTo } from "./LineTo"
import { StarPlot } from "./StarPlot"

interface Props {
    scale: number
}

const mapMargin = 10


export const GalaxyMap = ({ scale }: Props) => {
    const { dispatch, gameState, line, activeStarId } = useGameStateContext()
    const { fleets } = gameState
    const { stars, width, height } = gameState.galaxy

    const lines = [line ?? []].flat()

    return (
        <svg viewBox={`${-mapMargin} ${-mapMargin} ${width + 2 * mapMargin} ${height + 2 * mapMargin}`} style={{
            width: width * scale,
            height: height * scale,
            border: '1px solid red',
        }} onClick={() => dispatch({ type: 'clear-line' })}>
            {stars.map((star, index) => (
                <StarPlot key={index}
                    isActive={activeStarId === star.id}
                    star={star}
                    onClick={handleStarClickFunction(gameState, dispatch)} />
            ))}
            {lines.map((line, index) => <LineTo key={index} line={line} />)}
            {fleets.map((fleet) => <FleetPlot key={fleet.id} fleet={fleet} />)}

        </svg>
    )

}
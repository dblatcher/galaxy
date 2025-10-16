import type { Galaxy, Line, Star } from "../lib/model"
import { LineTo } from "./LineTo"
import { StarPlot } from "./StarPlot"

interface Props {
    galaxy: Galaxy
    activeStarId?: number
    scale: number
    handleStarClick: { (star: Star): void };
    lines: Line[]
}

const mapMargin = 10


export const GalaxyMap = ({ galaxy, scale, handleStarClick, lines, activeStarId }: Props) => {
    const { stars, width, height } = galaxy

    return (
        <svg viewBox={`${-mapMargin} ${-mapMargin} ${width + 2 * mapMargin} ${height + 2 * mapMargin}`} style={{
            width: width * scale,
            height: height * scale,
            border: '1px solid red'
        }}>
            {stars.map((star, index) => (
                <StarPlot key={index}
                    isActive={activeStarId === star.id}
                    star={star}
                    onClick={handleStarClick} />
            ))}

            {lines.map((line, index) => <LineTo key={index} line={line} />)}

        </svg>
    )

}
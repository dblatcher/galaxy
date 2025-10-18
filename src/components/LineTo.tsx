import type { Line } from "../lib/model";

interface Props {
    line: Line
    priority?: 'subdued'
}

export const LineTo = ({ line, priority }: Props) => {
    const [start, end] = line.points;
    const stroke = priority === 'subdued' ? 'grey' : 'white'
    return <g>
        <line className="animated-line"
            pointerEvents={'none'}
            x1={start.x} y1={start.y}
            x2={end.x} y2={end.y}
            stroke={stroke}
            strokeDasharray={"1,2"}
        />
    </g>

}
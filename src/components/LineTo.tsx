import type { Line } from "../lib/model";

interface Props {
    line: Line
}

export const LineTo = ({ line }: Props) => {

    const [start, end] = line.points;

    return <g>
        <line className="animated-line"
            x1={start.x} y1={start.y}
            x2={end.x} y2={end.y}
            stroke="white"
            strokeDasharray={"1,2"}
        />
    </g>

}
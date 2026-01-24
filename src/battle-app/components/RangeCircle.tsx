import type { XY } from "typed-geometry";

interface Props {
    position: XY;
    r: number;
    type: 'move' | 'fire';
}

const getAttributes = (type: 'move' | 'fire') => {

    switch (type) {
        case "move":
            return {
                stroke: "yellow",
                strokeDasharray: "1,3",
            }
        case "fire":
            return {
                stroke: "red",
                strokeDasharray: "1,1",
            }
    }

}

export const RangeCircle = ({ position, type, r }: Props) => {

    return (
        <circle
            cx={position.x}
            cy={position.y}
            r={r}
            fill="none"
            {...getAttributes(type)}
        />
    )
}
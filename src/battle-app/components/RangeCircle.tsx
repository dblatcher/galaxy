import type { XY } from "typed-geometry";
import type { TargetMode } from "../model";

interface Props {
    position: XY;
    r: number;
    type: TargetMode;
}

const getAttributes = (type: TargetMode) => {

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
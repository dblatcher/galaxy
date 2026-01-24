import { getDistance, type XY } from "typed-geometry"

interface Props {
    targetPoint: XY,
    origin: XY,
    range: number,
}


export const TargetLine = ({ targetPoint, origin, range }: Props) => {

    const distance = getDistance(targetPoint, origin);
    const inRange = distance <= range;

    return <line stroke={inRange ? 'red' : 'grey'}
        x1={origin.x}
        y1={origin.y}
        x2={targetPoint.x}
        y2={targetPoint.y}
        className="animated-line"
        strokeDasharray={"2,4"}
    />

}
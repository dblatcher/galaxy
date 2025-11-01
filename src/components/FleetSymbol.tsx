import type { XY } from "../lib/model";

interface Props {
    color?: string;
    location?: XY;
    h?: number
}

const getPoints = (x: number, y: number) => `${x},${y - 3} ${x + 3},${y + 3} ${x},${y + 2} ${x - 3},${y + 3}`

export const FleetSymbol = ({ color, location = { x: 3, y: 3 }, h }: Props) => {
    return <polygon
        style={{
            transformBox: 'border-box',
            transformOrigin: 'center',
            transform: h ? `rotate(${180 - (h * 180 / Math.PI)}deg)` : undefined
        }}
        points={getPoints(location.x, location.y)}
        fill={color}
        stroke="white"
        strokeWidth={.5}
        pointerEvents={'none'}
    />
}


interface IconProps {
    color?: string;
    size?: number
}

export const FleetIcon = ({ color = 'white', size = 20 }: IconProps) => {
    return <svg viewBox="0 0 6 6" style={{ width: size, height: size }}>
        <FleetSymbol color={color} />
    </svg>
}

import type { XY } from "../lib/model";

interface Props {
    color?: string;
    location?: XY;
    h?: number
    onClick?: { (): void }
    scale?: number
}

const getPoints = (x: number, y: number, scale = 1) => `${x},${y - (3 * scale)} ${x + (3 * scale)},${y + (3 * scale)} ${x},${y + (2 * scale)} ${x - (3 * scale)},${y + (3 * scale)}`

export const FleetSymbol = ({ color, location = { x: 3, y: 3 }, h, onClick, scale = 1 }: Props) => {
    return <polygon
        style={{
            transformBox: 'border-box',
            transformOrigin: 'center',
            transform: h ? `rotate(${180 - (h * 180 / Math.PI)}deg)` : undefined,
            cursor: onClick ? 'pointer' : undefined,
        }}
        points={getPoints(location.x, location.y, scale)}
        fill={color}
        stroke="white"
        strokeWidth={.5 * scale}
        pointerEvents={onClick ? undefined : 'none'}
        onClick={onClick ? event => {
            event.stopPropagation()
            onClick()
        } : undefined}
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

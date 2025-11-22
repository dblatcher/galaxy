import type { XY } from "../lib/model"

interface Props {
    location: XY,
    frame: XY,
    width: number,
    height: number,
    h?: number
}

const COLS = 8
const ROWS = 11



export const ShipSprite = ({ location, frame, height, width, h }: Props) => {
    const { x, y } = location

    const sheetWidth = width * COLS
    const sheetHeight = height * ROWS
    const clipTop = height * frame.y
    const clipRight = width * (frame.x + 1)
    const clipBottom = height * (frame.y + 1)
    const clipLeft = 0 + width * frame.x

    const rotate = h ? `rotate(${180 - (h * 180 / Math.PI)}deg)` : ' '

    return <image
        preserveAspectRatio="none"
        x={x - clipLeft}
        y={y - clipTop}
        href="/ships.png"
        height={sheetHeight}
        width={sheetWidth}
        style={{
            transformBox: 'border-box',
            transformOrigin: `${clipLeft}px ${clipTop}px`,
            transform: `translateX(-${width / 2}px) translateY(-${height / 2}px) ${rotate}`,
            clipPath: `rect(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px)`
        }}
    />
}
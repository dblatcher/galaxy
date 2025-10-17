
export type XY = {
    x: number;
    y: number;
}

export type Star = XY & {
    id: number;
    name: string;
}

export type Galaxy = {
    stars: Star[];
    width: number;
    height: number;
}

export type Line = {
    points: [XY, XY],
}


export type GameState = {
    galaxy: Galaxy
    startStarId?: number
    endStarId?: number
}

export type Action = {
    type: 'clear-line'
} | {
    type: 'pick-start',
    target: Star,
} | {
    type: 'pick-destination',
    target: Star,
}

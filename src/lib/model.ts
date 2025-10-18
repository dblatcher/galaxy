
export type XY = {
    x: number;
    y: number;
}

export type Star = XY & {
    id: number;
    name: string;
}

export type Faction = {
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

export type Fleet = {
    id: number;
    orbitingStarId?: number
    destinationStarId?: number
    location: XY
    factionId: number
}


export type GameState = {
    galaxy: Galaxy
    fleets: Fleet[]
    factions: Faction[]
    startStarId?: number
    endStarId?: number
    selectedFleetId?: number
}

export type Action = {
    type: 'clear-line'
} | {
    type: 'pick-start',
    target: Star,
} | {
    type: 'pick-destination',
    target: Star,
} | {
    type: 'select-fleet'
    target?: Fleet   
}

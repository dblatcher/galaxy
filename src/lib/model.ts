
export type XY = {
    x: number;
    y: number;
}

export type Star = XY & {
    id: number;
    name: string;
    factionId?: number;
}

export type Faction = {
    id: number;
    name: string;
    color: string;
    playerType: 'LOCAL' | 'CPU' | 'REMOTE'
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

export type Battle = {
    star: number;
    sides: {
        faction: number,
        fleets: number[]
    }[]
}

export type BattleReport = {
    reportType: 'battle',
    star: number;
    turnNumber: number;
    sides: {
        faction: number,
        losses: Fleet[],
        survivors: Fleet[],
    }[]
}

export type Report = BattleReport

export type GameState = {
    turnNumber: number
    activeFactionId: number
    galaxy: Galaxy
    fleets: Fleet[]
    factions: [Faction, ...Faction[]]
    focusedStarId?: number
    selectedFleetId?: number
    reports: Report[]
}


export type XY = {
    x: number;
    y: number;
}

export type Star = XY & {
    id: number;
    name: string;
    factionId?: number;
    shipDesignToConstruct?: number;
    shipConstructionProgress?: number;
}

export type Faction = {
    id: number;
    name: string;
    color: string;
    playerType: 'LOCAL' | 'CPU' | 'REMOTE'
    shipDesigns: ShipDesign[]
}

export type Galaxy = {
    stars: Star[];
    width: number;
    height: number;
}

export type Line = {
    points: [XY, XY],
}

export type ShipDesign = {
    id: number
    name: string
    constructionCost: number;
    hp: number
    atk: number
}

export type Ship = {
    designId: number;
    damage: number,
}

export type Fleet = {
    id: number;
    orbitingStarId?: number
    destinationStarId?: number
    location: XY
    factionId: number
    ships: Ship[]
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
        faction: Faction;
        fleets: Fleet[];
    }[]
}

export type MessageReport = {
    reportType: 'message'
    turnNumber: number
    message: string
}

export type Report = BattleReport | MessageReport

export type Dialog = {
    role: 'fleets'
} | {
    role: 'battles'
} | {
    role: 'reports'
}

export type BattleParameters = {
    type: 'battle',
    starId: number,
}

export type GameState = {
    turnNumber: number
    activeFactionId: number
    galaxy: Galaxy
    starsWhereBattlesFoughtAlready: number[]
    fleets: Fleet[]
    factions: [Faction, ...Faction[]]
    focusedStarId?: number
    selectedFleetId?: number
    reports: Report[]
    dialog?: Dialog
    subProgram?: BattleParameters
}

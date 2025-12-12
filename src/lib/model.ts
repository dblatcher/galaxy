import type { PatternId } from "../data/ship-patterns";
import type { ColonyBudget } from "./colony-budget";
import type { FactionTechs, TechId } from "../data/tech-list";

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
    population: number;
    factories: number;
    factoryConstructionProgress?: number;
    budget?: ColonyBudget;
}

export type Faction = {
    id: number;
    name: string;
    color: string;
    playerType: 'LOCAL' | 'CPU' | 'REMOTE';
    shipDesigns: ShipDesign[];
    tech: FactionTechs;
    researchPoints: number;
    reasearchGoal?: TechId;
}

export type Galaxy = {
    stars: Star[];
    width: number;
    height: number;
}

export type Line = {
    points: [XY, XY];
}

export type ShipDesign = {
    id: number
    name: string
    pattern: PatternId
    hp: number;
    atk: number;
    specials: {
        colonise?: boolean
        bomb?: boolean
    }
}

export type Ship = {
    designId: number;
    damage: number;
    hasBombed?: boolean;
}

export type Fleet = {
    id: number;
    orbitingStarId?: number;
    destinationStarId?: number;
    location: XY;
    factionId: number;
    ships: Ship[];
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

export type BombingReport = {
    reportType: 'bombing'
    turnNumber: number
    bombingFactionId: number;
    bombedFactionId: number;
    star: number;
    startingPopulation: number;
    populationDamage: number;
}

export type ColonyStartReport = {
    reportType: 'colonyStart'
    turnNumber: number
    star: number
    faction: number
}

export type Report = BattleReport | MessageReport | ColonyStartReport | BombingReport

export type Dialog = {
    role: 'fleets'
} | {
    role: 'battles'
} | {
    role: 'reports'
} | {
    role: 'tech'
}

export type BattleParameters = {
    type: 'battle',
    starId: number,
}

export type DesignerParameters = {
    type: 'ship-designer'
}


export type GameState = {
    turnNumber: number
    activeFactionId: number
    galaxy: Galaxy
    starsWhereBattlesFoughtAlready: number[]
    techToAnnounce: { factionId: number, techId: TechId }[]
    fleets: Fleet[]
    factions: [Faction, ...Faction[]]
    focusedStarId?: number
    selectedFleetId?: number
    reports: Report[]
    dialog?: Dialog
    subProgram?: BattleParameters | DesignerParameters
}

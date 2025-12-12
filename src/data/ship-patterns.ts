import type { TechId } from "./tech-list";

export type ShipPattern = {
    name: string;
    baseCost: number;
    baseHp: number;
    prerequisites: TechId[];
}

export const ALL_PATTERNS = {
    small: {
        name: 'small',
        baseCost: 20,
        baseHp: 3,
        prerequisites: []
    },
    medium: {
        name: 'medium',
        baseCost: 100,
        baseHp: 10,
        prerequisites: []
    },
    big: {
        name: 'big',
        baseCost: 200,
        baseHp: 25,
        prerequisites: ['solarSails']
    },
} satisfies Record<string, ShipPattern>;


export type PatternId = keyof typeof ALL_PATTERNS;
export const patternIds = Object.keys(ALL_PATTERNS) as PatternId[];


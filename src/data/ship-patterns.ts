import type { TechId } from "../lib/tech-list";

export type ShipPattern = {
    name: string;
    baseCost: number;
    prerequisites: TechId[];
}

export const ALL_PATTERNS = {
    small: {
        name: 'small',
        baseCost: 20,
        prerequisites: []
    },
    medium: {
        name: 'medium',
        baseCost: 100,
        prerequisites: []
    },
    big: {
        name: 'big',
        baseCost: 200,
        prerequisites: ['solarSails']
    },
} satisfies Record<string, ShipPattern>;


export type PatternId = keyof typeof ALL_PATTERNS;
export const patternIds = Object.keys(ALL_PATTERNS) as PatternId[];


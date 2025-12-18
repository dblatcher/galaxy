import type { TechId } from "./tech-list";

export type ShipPattern = {
    name: string;
    baseCost: number;
    baseHp: number;
    prerequisite?: TechId;
    slotCount: number;
}

export const ALL_PATTERNS = {
    small: {
        name: 'small',
        baseCost: 20,
        baseHp: 3,
        prerequisite: undefined,
        slotCount: 1,
    },
    medium: {
        name: 'medium',
        baseCost: 100,
        baseHp: 10,
        prerequisite: undefined,
        slotCount: 3,
    },
    big: {
        name: 'big',
        baseCost: 200,
        baseHp: 25,
        prerequisite: 'solarSails',
        slotCount: 7
    },
} satisfies Record<string, ShipPattern>;


export type PatternId = keyof typeof ALL_PATTERNS;
export const patternIds = Object.keys(ALL_PATTERNS) as PatternId[];


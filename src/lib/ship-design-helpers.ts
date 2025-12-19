import { ALL_EQUIPMENT } from "../data/ship-equipment";
import { ALL_PATTERNS } from "../data/ship-patterns"
import type { ShipDesign } from "./model"

export type EnhancedShipDesign = ShipDesign & {
    constructionCost: number;
    hp: number;
    hasBombs: boolean;
}

const getConstructionCost = (design: ShipDesign): number =>
    ALL_PATTERNS[design.pattern].baseCost +
    design.slots.reduce((sum, patternId) => !patternId ? sum : sum + ALL_EQUIPMENT[patternId].baseCost, 0)

const getHp = (design: ShipDesign): number => ALL_PATTERNS[design.pattern].baseHp

const enhanceShipDesign = (design: ShipDesign): EnhancedShipDesign => {
    return {
        ...design,
        constructionCost: getConstructionCost(design),
        hp: getHp(design),
        hasBombs: design.slots.some(equipmentId => equipmentId && ALL_EQUIPMENT[equipmentId]?.info.type==='bomb')
    }
}

export { enhanceShipDesign, getConstructionCost }
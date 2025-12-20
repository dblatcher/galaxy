import { getEquipment } from "../data/ship-equipment";
import { getPattern } from "../data/ship-patterns";
import type { ShipDesign } from "./model";

export type EnhancedShipDesign = ShipDesign & {
    constructionCost: number;
    hp: number;
    hasBombs: boolean;
    canColonise: boolean;
}

const getConstructionCost = (design: ShipDesign): number =>
    getPattern(design.pattern).baseCost +
    design.slots.reduce((sum, equipmentId) => !equipmentId ? sum : sum + getEquipment(equipmentId).baseCost, 0)

const getHp = (design: ShipDesign): number => getPattern(design.pattern).baseHp

const enhanceShipDesign = (design: ShipDesign): EnhancedShipDesign => {
    return {
        ...design,
        constructionCost: getConstructionCost(design),
        hp: getHp(design),
        hasBombs: design.slots.some(equipmentId => equipmentId && getEquipment(equipmentId).info.type==='bomb'),
        canColonise: design.slots.some(equipmentId => equipmentId && getEquipment(equipmentId).info.type==='colonise')
    }
}

export { enhanceShipDesign, getConstructionCost };


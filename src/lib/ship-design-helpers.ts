import { getEquipment, getMaybeEquipment } from "../data/ship-equipment";
import { getPattern } from "../data/ship-patterns";
import type { ShipDesign } from "./model";

export type EnhancedShipDesign = ShipDesign & {
    constructionCost: number;
    hp: number;
    hasBombs: boolean;
    hasWeapons: boolean;
    shieldLevel: number;
    canColonise: boolean;
}

const getConstructionCost = (design: ShipDesign): number =>
    getPattern(design.pattern).baseCost +
    design.slots.reduce((sum, equipmentId) => !equipmentId ? sum : sum + getEquipment(equipmentId).baseCost, 0)

const getHp = (design: ShipDesign): number => getPattern(design.pattern).baseHp

const enhanceShipDesign = (design: ShipDesign): EnhancedShipDesign => {
    const { slots } = design
    return {
        ...design,
        constructionCost: getConstructionCost(design),
        hp: getHp(design),
        hasWeapons: slots.some(equipmentId => equipmentId && getEquipment(equipmentId).info.type === 'beam'),
        hasBombs: slots.some(equipmentId => equipmentId && getEquipment(equipmentId).info.type === 'bomb'),
        canColonise: slots.some(equipmentId => equipmentId && getEquipment(equipmentId).info.type === 'colonise'),
        shieldLevel: slots.reduce((acc, equipmentId) => {
            const equip =  getMaybeEquipment(equipmentId)
            return equip?.info.type === 'shield' ? acc + equip.info.level : acc
        }, 0)
    }
}

export { enhanceShipDesign, getConstructionCost };


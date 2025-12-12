import { ALL_PATTERNS } from "../data/ship-patterns"
import type { ShipDesign } from "./model"

type EnhancedShipDesign = ShipDesign & {
    constructionCost: number;
}

const getConstructionCost = (design: ShipDesign):number => ALL_PATTERNS[design.pattern].baseCost

const enhanceShipDesign = (design: ShipDesign): EnhancedShipDesign => {
    return {
        ...design,
        constructionCost: getConstructionCost(design)
    }
}

export { enhanceShipDesign, getConstructionCost }
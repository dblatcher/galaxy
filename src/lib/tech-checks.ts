import { equipmentIds, getEquipment, type EquipmentId } from "../data/ship-equipment";
import { getPattern, patternIds, type PatternId } from "../data/ship-patterns";
import { getMaybeTech, getTech, techIds, type TechId } from "../data/tech-list";
import type { Faction } from "./model";

export const getKnownTechIds = (faction: Faction): TechId[] => Object.entries(faction.tech).flatMap(([techId, has]) => {
    if (!has) {
        return []
    }
    return techId as TechId
})

export const getCurrentGoalTech = (faction: Faction) => getMaybeTech(faction.reasearchGoal);

export const getAvailableResearchGoals = (faction: Faction): TechId[] => {
    const techsIdsKnown = getKnownTechIds(faction);
    return techIds.filter(techId => {
        if (techsIdsKnown.includes(techId)) {
            return false
        }
        const tech = getTech(techId);
        return tech.prerequisites.every(prereqId => techsIdsKnown.includes(prereqId as TechId))
    })
}

export const getAvailableEquipment = (faction: Faction): EquipmentId[] => equipmentIds.filter(equipmentId => {
    const equip = getEquipment(equipmentId);
    return equip.prerequisite ? !!faction.tech[equip.prerequisite] : true
})

export const getAvailablePatterns = (faction: Faction): PatternId[] => patternIds.filter(id => {
    const pattern = getPattern(id);
    return pattern.prerequisite ? !!faction.tech[pattern.prerequisite] : true
})

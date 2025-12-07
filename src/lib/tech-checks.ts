import type { Faction } from "./model";
import { type TechId, techIds, ALL_TECHS, type Tech } from "./tech-list";

export const getKnownTechIds = (faction: Faction): TechId[] => Object.entries(faction.tech).flatMap(([techId, has]) => {
    if (!has) {
        return []
    }
    return techId as TechId
})

export const getCurrentGoalTech = (faction: Faction): Tech | undefined => faction.reasearchGoal && ALL_TECHS[faction.reasearchGoal];

export const getAvailableResearchGoals = (faction: Faction): TechId[] => {
    const techsIdsKnown = getKnownTechIds(faction);
    return techIds.filter(techId => {
        if (techsIdsKnown.includes(techId)) {
            return false
        }
        const tech = ALL_TECHS[techId];
        return tech.prerequisites.every(prereqId => techsIdsKnown.includes(prereqId as TechId))
    })
}
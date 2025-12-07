import type { GameState } from "../lib/model";
import type { TechId } from "../lib/tech-list";
import { findById } from "../lib/util";

export type FactionAction = {
    type: 'faction:pick-tech-goal',
    techId: TechId,
    factionId: number,
} | {
    type: 'faction:clear-breakthrough-announcement',
    techId: TechId,
    factionId: number,
};

export const reduceFactionAction = (state: GameState, action: FactionAction): GameState => {
    const factions = structuredClone(state.factions)
    const faction = findById(action.factionId, factions)
    if (!faction) {
        return state
    }

    switch (action.type) {
        case 'faction:pick-tech-goal': {

            faction.reasearchGoal = action.techId

            return {
                ...state,
                factions
            }
        }
        case "faction:clear-breakthrough-announcement": {
            return {
                ...state,
                factions,
                techToAnnounce: state.techToAnnounce.filter(item => item.factionId !== action.factionId || item.techId !== action.techId)
            }
        }
    }
}
import { setBudgetAmount } from "../lib/budget";
import { createBalancedColonyBudget, type ColonyBudgetItem } from "../lib/colony-budget";
import type { GameState } from "../lib/model";
import { findById } from "../lib/util";

export type ColonyControlAction = {
    type: 'set-star-construction-design',
    starId: number,
    designId?: number
} | {
    type: 'star-budget-lock',
    starId: number,
    itemName: ColonyBudgetItem,
    locked: boolean
} | {
    type: 'set-star-budget',
    starId: number,
    itemName: ColonyBudgetItem,
    targetPercentage: number
};

export const reduceColonyAction = (state: GameState, action: ColonyControlAction): GameState => {
    const stars = structuredClone(state.galaxy.stars)
    const star = findById(action.starId, stars)
    if (!star) {
        return state
    }

    switch (action.type) {
        case 'set-star-construction-design': {
            star.shipDesignToConstruct = action.designId
            return {
                ...state,
                galaxy: {
                    ...state.galaxy, stars
                }
            }
        }
        case 'set-star-budget': {
            const oldBudget = structuredClone(star.budget) || createBalancedColonyBudget();
            star.budget = setBudgetAmount(action.itemName, action.targetPercentage, oldBudget)
            return {
                ...state,
                galaxy: {
                    ...state.galaxy, stars
                }
            }
        }
        case 'star-budget-lock': {
            const oldBudget = structuredClone(star.budget) || createBalancedColonyBudget();
            oldBudget.items[action.itemName].locked = action.locked
            star.budget = oldBudget
            return {
                ...state,
                galaxy: {
                    ...state.galaxy, stars
                }
            }
        }
    }
}
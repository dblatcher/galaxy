import { TOTAL, type Budget } from "./budget";


export type ColonyBudgetItem = 'ships' | 'research' | 'industry'
export type ColonyBudget = Budget<ColonyBudgetItem>

export function createBalancedColonyBudget(): ColonyBudget {

    const budget: ColonyBudget = {
        items: {
            ships: { percentage: 0, locked: false },
            research: { percentage: 0, locked: false },
            industry: { percentage: 0, locked: false },
        }
    }
    const keys = Object.keys(budget.items) as ColonyBudgetItem[];

    const initialShare = Math.floor(TOTAL / keys.length)
    let remainder = TOTAL - initialShare * keys.length

    keys.forEach(key => {
        budget.items[key].percentage = initialShare
    })


    while (remainder > 0) {
        keys.forEach(key => {
            if (remainder > 0) {
                budget.items[key].percentage = budget.items[key].percentage + 1
                remainder--
            }
        })
    }

    return budget
}

export function createBudgetWithAllIn(itemName: ColonyBudgetItem): ColonyBudget {
    const budget: ColonyBudget = {
        items: {
            ships: { percentage: 0, locked: false },
            research: { percentage: 0, locked: false },
            industry: { percentage: 0, locked: false },
        }
    }
    budget.items[itemName].percentage = 100
    return budget
}
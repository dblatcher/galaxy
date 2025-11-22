import { filterInPlace } from "./util";

export type BudgetItem = {
    label?: string;
    locked: boolean;
    percentage: number
}

export type Budget<ItemName extends string> = {
    items: Record<ItemName, BudgetItem>
}


export const TOTAL = 100;


function getAdjustableItems<ItemName extends string>(itemName: ItemName, budget: Budget<ItemName>): ItemName[] {
    const items: ItemName[] = []
    for (const name in budget.items) {
        if (name === itemName || budget.items[name].locked) {
            continue
        }
        items.push(name)
    }
    return items
}

function reduceBudgetAmount<ItemName extends string>(itemName: ItemName, reduction: number, budget: Budget<ItemName>): Budget<ItemName> {
    const itemsToReceiveExcess = getAdjustableItems(itemName, budget);
    if (itemsToReceiveExcess.length === 0) {
        console.warn('no unlocked items')
        return budget
    }
    let excess = reduction;

    while (excess > 0) {
        const remainder = excess % itemsToReceiveExcess.length;
        const share = Math.floor((excess - remainder) / itemsToReceiveExcess.length);
        itemsToReceiveExcess.forEach(name => {
            budget.items[name].percentage += share;
            excess -= share
        })
        itemsToReceiveExcess.pop() // to do - remove the item with highest percentage
    }

    budget.items[itemName].percentage -= reduction; 
    return budget
}

function increaseBudgetAmount<ItemName extends string>(itemName: ItemName, increase: number, budget: Budget<ItemName>): Budget<ItemName> {
    const itemsToProvideExtra = getAdjustableItems(itemName, budget);
    if (itemsToProvideExtra.length === 0) {
        console.warn('no unlocked items')
        return budget
    }

    let extra = 0
    while (extra < increase) {
        filterInPlace(itemsToProvideExtra, name => budget.items[name].percentage > 0)
        if (itemsToProvideExtra.length === 0) {
            break
        }

        const mostNeededFromEach = Math.floor((increase - extra) / itemsToProvideExtra.length);
        if (mostNeededFromEach <= 0) {
            itemsToProvideExtra.pop() // to do - remove the item with lowest percentage
            continue
        }

        itemsToProvideExtra.forEach(name => {
            const take = Math.min(mostNeededFromEach, budget.items[name].percentage);
            extra += take
            budget.items[name].percentage -= take
        })
    }

    budget.items[itemName].percentage += extra
    return budget
}

export function setBudgetAmount<ItemName extends string>(itemName: ItemName, target: number, budget: Budget<ItemName>) {
    const normalisedTarget = Math.round(Math.min(Math.max(0, target), TOTAL))
    const difference = normalisedTarget - budget.items[itemName].percentage;
    return difference > 0
        ? increaseBudgetAmount(itemName, difference, budget)
        : reduceBudgetAmount(itemName, -difference, budget)
}
import { useGameStateContext } from "../../hooks/useGameStateContext"
import type { BudgetItem } from "../../lib/budget"
import type { ColonyBudgetItem } from "../../lib/colony-budget"
import type { Star } from "../../lib/model"

interface Props {
    star: Star
}

export const BudgetControl = ({ star }: Props) => {

    const { dispatch } = useGameStateContext()

    if (!star.budget) {
        return <div>no budget</div>
    }

    const budgetItems = Object.entries(star.budget.items) as [ColonyBudgetItem, BudgetItem][]

    const handleSet = (itemName: ColonyBudgetItem, targetPercentage: number) => {
        dispatch({ type: 'set-star-budget', starId: star.id, itemName, targetPercentage })
    }
    const handleChange = (itemName: ColonyBudgetItem, locked: boolean) => {
        dispatch({ type: 'star-budget-lock', starId: star.id, itemName, locked })
    }

    return <div className="panel-content">
        {budgetItems.map(([itemName, item]) => (
            <div key={itemName}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{itemName}</span>
                    <span>{item.percentage.toFixed(0)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <input type="range"
                        value={item.percentage}
                        min={0} max={100} step={1}
                        onChange={(e => handleSet(itemName, e.target.valueAsNumber))} />
                    <input type="checkbox" checked={item.locked} onChange={e => handleChange(itemName, e.target.checked)} />
                </div>
            </div>
        ))}
    </div>

}
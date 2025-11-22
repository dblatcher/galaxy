import { useGameStateContext } from "../../hooks/useGameStateContext"
import { calculateConstructionPoints } from "../../lib/colony-operations"
import type { Faction, Star } from "../../lib/model"
import { SubHeading } from "../SubHeading"
import { BudgetControl } from "./BudgetControl"
import { ShipConstruction } from "./ShipConstruction"

interface Props {
    star: Star
    colonyFaction: Faction
    isPendingBattleHere: boolean
}

export const ColonyOverview = ({ star, colonyFaction, isPendingBattleHere }: Props) => {

    const { activeFaction, dispatch } = useGameStateContext()

    const battleButton = isPendingBattleHere ? (
        <button
            title="fight battle"
            className="small"
            onClick={() => {
                dispatch({
                    type: 'battles:launch', starId: star.id
                })
            }}>B</button>)
        : undefined

    return <section>
        <SubHeading buttons={battleButton}>{star.name}</SubHeading>
        <div className="panel-content" style={{ color: colonyFaction.color }}>
            {colonyFaction.name}
        </div>
        <table className="panel-content">
            <tbody>
                <tr>
                    <th>pop</th><td>{star.population?.toFixed(2)}m</td>
                </tr>
                <tr>
                    <th>production</th><td>{calculateConstructionPoints(star)}/turn</td>
                </tr>
            </tbody>
        </table>
        {activeFaction.id === colonyFaction.id && (
            <>
                <BudgetControl star={star} />
                <ShipConstruction star={star} />
            </>
        )}
    </section>

}
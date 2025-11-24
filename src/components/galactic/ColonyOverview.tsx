import { useGameStateContext } from "../../hooks/useGameStateContext"
import { calculateConstructionPoints, calculateMaxFactoryUsage } from "../../lib/colony-operations"
import { Population } from "../display-values"
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
                    <th>population</th><td><Population value={star.population} /></td>
                </tr>
                <tr>
                    <th>factories</th><td>{star.factories}/{calculateMaxFactoryUsage(star)}</td>
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
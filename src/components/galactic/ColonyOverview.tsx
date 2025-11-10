import { useGameStateContext } from "../../hooks/useGameStateContext"
import type { Faction, Star } from "../../lib/model"
import { ShipConstruction } from "./ShipConstruction"

interface Props {
    star: Star
    colonyFaction: Faction
    isPendingBattleHere: boolean
}

export const ColonyOverview = ({ star, colonyFaction, isPendingBattleHere }: Props) => {

    const { activeFaction, dispatch } = useGameStateContext()

    return <section>
        <h3>{star.name}</h3>
        <div style={{ color: colonyFaction.color }}>
            {colonyFaction.name}
        </div>
        <div>
            pop: {star.population?.toFixed(2)}m
        </div>
        {activeFaction.id === colonyFaction.id && (
            <ShipConstruction star={star} />
        )}
        {isPendingBattleHere && <div>
            <button onClick={() => {
                dispatch({
                    type: 'battles:launch', starId: star.id
                })
            }}>FIGHT BATTLE</button>
        </div>}
    </section>

}
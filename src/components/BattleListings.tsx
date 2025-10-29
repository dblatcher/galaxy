import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Battle } from "../lib/model"
import { lookUpName } from "../lib/util"
import { ReportsPanel } from "./ReportsPanel"

const BattleList = ({ title, battles, forActivePlayer }: { title: string, battles: Battle[], forActivePlayer?: boolean }) => {

    const { gameState: { galaxy, factions, }, dispatch } = useGameStateContext()

    if (battles.length === 0) {
        return null
    }

    return <>
        <h3>{title}</h3>
        {battles.map((battle, index) =>
            <div key={index}>
                <span>
                    {lookUpName(battle.star, galaxy.stars)}
                </span>
                {forActivePlayer &&
                    <button onClick={() => dispatch({ type: 'resolve-battle', starId: battle.star })}>resolve</button>
                }
                <ul>
                    {battle.sides.map((side, sideIndex) => (
                        <li key={sideIndex}>
                            {lookUpName(side.faction, factions)}: {side.fleets.length} fleets
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </>
}

export const BattleListings = () => {
    const { activeFactionBattles, battlesWithoutActiveFaction } = useGameStateContext()

    return <div>
        <BattleList title="Your Battles" battles={activeFactionBattles} forActivePlayer />
        <BattleList title="Other Battles" battles={battlesWithoutActiveFaction} />
        <ReportsPanel />
    </div>

}
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Battle } from "../lib/model"
import { lookUpName } from "../lib/util"

export const BattleList = ({ title, battles, forActivePlayer }: { title: string, battles: Battle[], forActivePlayer?: boolean }) => {

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
                <>
                    <button 
                        onClick={() => dispatch({ type: 'battles:auto-resolve', starId: battle.star })}
                        >automate</button>
                    <button 
                        onClick={() => dispatch({ type: 'battles:launch', starId: battle.star })}
                        >fight</button>
                        </>
                }
                <div>
                    {battle.sides.map((side) => lookUpName(side.faction, factions)).join(' vs ')}
                </div>
            </div>
        )}
    </>
}

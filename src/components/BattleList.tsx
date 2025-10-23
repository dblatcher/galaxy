import { useGameStateContext } from "../hooks/useGameStateContext"
import { lookUpName, splitArray } from "../lib/util"


export const BattleList = () => {
    const { gameState: { battles, galaxy, factions, activeFactionId } } = useGameStateContext()
    const [activeFactionBattles, otherBattles] = splitArray(battles, b=> b.sides.some(side => side.faction===activeFactionId))

    return <div>
        <h3>your battles</h3>
        {activeFactionBattles.map((battle, index) =>
            <div key={index}>
                {lookUpName(battle.star, galaxy.stars)}
                <ul>
                    {battle.sides.map((side, sideIndex) => (
                        <li key={sideIndex}>{lookUpName(side.faction, factions)}: {side.fleets.length} fleets</li>
                    ))}
                </ul>
            </div>
        )}
        <h3>other battles</h3>
        {otherBattles.map((battle, index) =>
            <div key={index}>
                {lookUpName(battle.star, galaxy.stars)}
                <ul>
                    {battle.sides.map((side, sideIndex) => (
                        <li key={sideIndex}>{lookUpName(side.faction, factions)}: {side.fleets.length} fleets</li>
                    ))}
                </ul>
            </div>
        )}
    </div>

}
import { useState } from "react"
import { useGameStateContext } from "../../hooks/useGameStateContext"
import { getBattleAt } from "../../lib/derived-state"
import type { BattleParameters } from "../../lib/model"
import { findById } from "../../lib/util"
import { FleetIcon } from "../FleetSymbol"

interface Props {
    params: BattleParameters
}

export const BattleApp = ({ params }: Props) => {
    const { gameState, dispatch } = useGameStateContext()
    const [initialBattle] = useState(() => {
        return getBattleAt(params.starId, gameState)
    })
    const [sides] = useState(() => {
        return initialBattle?.sides.flatMap(side => {
            const faction = findById(side.faction, gameState.factions);
            return faction ? {
                faction,
                fleets: side.fleets.flatMap(fleetId => findById(fleetId, gameState.fleets) ?? [])
            } : []
        }) ?? []
    })

    const conclude = () => {
        dispatch({
            type: 'battles:result', report: {
                star: params.starId,
                reportType: 'battle',
                turnNumber: gameState.turnNumber,
                sides: sides,
            }
        })
    }

    return (
        <main>
            <p>Battle</p>

            {sides.map(side => (
                <div key={side.faction.id}>
                    <h3>{side.faction.name}</h3>
                    {side.fleets.flatMap(f => f.ships).map((ship, index) => <div key={index}>
                        <FleetIcon color={side.faction.color} />
                        {ship.designId}
                    </div>)}

                </div>
            ))}

            <button onClick={conclude}>conclude</button>
        </main>
    )

}
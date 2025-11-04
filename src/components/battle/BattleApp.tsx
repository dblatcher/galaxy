import { Fragment, useState } from "react"
import { useGameStateContext } from "../../hooks/useGameStateContext"
import { populateBattleSides } from "../../lib/battle-operations"
import { getBattleAt } from "../../lib/derived-state"
import type { BattleParameters } from "../../lib/model"
import { ShipProfile } from "./ShipInfo"


interface Props {
    params: BattleParameters
}

export const BattleApp = ({ params }: Props) => {
    const { gameState, dispatch } = useGameStateContext()

    const [sides, setSides] = useState(() => {
        const initialBattle = getBattleAt(params.starId, gameState)
        return initialBattle ? populateBattleSides(initialBattle, gameState) : []
    })

    const applyDamage = (factionId: number, fleetId: number, shipIndex: number) => {
        setSides(oldSides => {
            const sides = structuredClone(oldSides)
            const ship = sides.find(side => side.faction.id === factionId)
                ?.fleets.find(fleet => fleet.id === fleetId)
                ?.ships[shipIndex]
            if (ship) {
                ship.damage = ship.damage + 1
            }
            return sides
        })
    }

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

            <div style={{ display: 'flex', gap: 20 }}>
                {sides.map(side => (
                    <div key={side.faction.id}>
                        <h3>{side.faction.name}</h3>

                        {side.fleets.map(fleet =>
                            <Fragment key={fleet.id}>
                                {fleet.ships.map((ship, index) => (
                                    <div key={index} style={{ display: 'flex', gap: 5 }}>
                                        <ShipProfile faction={side.faction} ship={ship} />
                                        <button onClick={() => applyDamage(side.faction.id, fleet.id, index)}>damage</button>
                                    </div>

                                ))}
                            </Fragment>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={conclude}>conclude</button>
        </main>
    )

}
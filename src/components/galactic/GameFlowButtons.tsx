import { useGameStateContext } from "../../hooks/useGameStateContext"
import { findFleetsReadyToBomb } from "../../lib/fleet-operations";

export const GameFlowButtons = () => {

    const { dispatch, activeFactionBattles, battles, gameState, activeFaction } = useGameStateContext();
    const fleetsReadyToBomb = findFleetsReadyToBomb(gameState, activeFaction)

    return (
        <div>
            <button disabled={gameState.reports.length === 0}
                onClick={() => dispatch({ type: 'open-dialog', dialog: { role: 'reports' } })}
            >Reports</button>
            <button disabled={battles.length === 0 && fleetsReadyToBomb.length == 0}
                onClick={() => dispatch({ type: 'open-dialog', dialog: { role: 'battles' } })}
            >Battles and bombings</button>
            <button
                onClick={() => dispatch({ type: 'open-dialog', dialog: { role: 'tech' } })}
            >Research</button>
            <button disabled={activeFactionBattles.length > 0}
                onClick={() => dispatch({ type: 'next-turn' })}
            >next turn</button>
        </div>
    )
}
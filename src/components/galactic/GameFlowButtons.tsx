import { useGameStateContext } from "../../hooks/useGameStateContext"
import { findFleetsReadyToBomb } from "../../lib/fleet-operations";
import { getCurrentGoalTech } from "../../lib/tech-checks";
import { ProgressBar } from "../ProgressBar";

export const GameFlowButtons = () => {

    const { dispatch, activeFactionBattles, battles, gameState, activeFaction } = useGameStateContext();
    const fleetsReadyToBomb = findFleetsReadyToBomb(gameState, activeFaction)
    const researchGoal = getCurrentGoalTech(activeFaction)

    return (
        <>
            <button
                onClick={() => dispatch({ type: 'open-dialog', dialog: { role: 'tech' } })}
            >
                Researching: {researchGoal?.name ?? '[none]'}
                <ProgressBar precision={2}
                    showValues
                    title="research"
                    value={activeFaction.researchPoints}
                    max={researchGoal?.cost ?? 0} />
            </button>
            <button onClick={() => dispatch({ type: 'designer:start' })}>
                Design Ships
            </button>
            <button disabled={gameState.reports.length === 0}
                onClick={() => dispatch({ type: 'open-dialog', dialog: { role: 'reports' } })}
            >Reports</button>
            <button disabled={battles.length === 0 && fleetsReadyToBomb.length == 0}
                onClick={() => dispatch({ type: 'open-dialog', dialog: { role: 'battles' } })}
            >Battles and bombings</button>
            <button disabled={activeFactionBattles.length > 0}
                onClick={() => dispatch({ type: 'next-turn' })}
            >next turn</button>
        </>
    )
}
import { useGameStateContext } from "../hooks/useGameStateContext"

export const GameFlowButtons = () => {

    const { dispatch, activeFactionBattles, battles, gameState: { reports } } = useGameStateContext();

    return (
        <div>
            <button disabled={battles.length === 0 && reports.length === 0}
                onClick={() => dispatch({ type: 'open-dialog', dialog: { role: 'battles' } })}
            >Battles</button>
            <button disabled={activeFactionBattles.length > 0}
                onClick={() => dispatch({ type: 'next-turn' })}
            >next turn</button>
        </div>
    )
}
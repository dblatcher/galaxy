import { useGameStateContext } from "../hooks/useGameStateContext"

export const TurnEndControls = () => {

    const { dispatch, activeFactionBattles } = useGameStateContext();

    return (
        <div>
            <button disabled={activeFactionBattles.length > 0} 
                onClick={() => dispatch({ type: 'next-turn' })}
                >next turn</button>
        </div>
    )
}
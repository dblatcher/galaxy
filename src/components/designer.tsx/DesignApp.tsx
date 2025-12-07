import { useGameStateContext } from "../../hooks/useGameStateContext"



export const DesignApp = () => {
    const { dispatch, activeFaction } = useGameStateContext()

    const conclude = () => {
        dispatch({
            type: 'designer:result',
            factionId: activeFaction.id
        })
    }

    return (
        <main>
            <p>Designer</p>


            <button onClick={conclude}>conclude</button>
        </main>
    )
}
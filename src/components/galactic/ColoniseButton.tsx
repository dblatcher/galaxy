import { useGameStateContext } from "../../hooks/useGameStateContext"
import type { Fleet, Star } from "../../lib/model"

interface Props {
    star: Star
    fleet: Fleet
}

export const ColoniseButton = ({ star, fleet }: Props) => {
    const { dispatch, } = useGameStateContext()
    const startColony = () => {
        dispatch({
            type: 'start-colony',
            fleetId: fleet?.id,
            starId: star.id
        })
    }
    return <button
        className="small"
        onClick={startColony}
    >colonise!</button>
}
import { useGameStateContext } from "../../hooks/useGameStateContext"
import { findColonisingFleets } from "../../lib/colony-operations"
import type { Star } from "../../lib/model"

interface Props {
    star: Star
}

export const ColoniseButton = ({ star }: Props) => {

    const { activeFaction, gameState: { fleets, selectedFleetId }, dispatch, } = useGameStateContext()

    const fleetsThatCouldColonise = findColonisingFleets(star, fleets, activeFaction)


    const startColony = () => {

        const [firstFleet] = fleetsThatCouldColonise;
        if (!firstFleet) {
            return
        }
        const idOfFleetToUse = fleetsThatCouldColonise.find(fleet => fleet.id === selectedFleetId)?.id ?? firstFleet.id;

        dispatch({
            type: 'start-colony',
            fleetId: idOfFleetToUse,
            starId: star.id
        })
    }

    return <div>
        <button
            onClick={startColony}
            disabled={fleetsThatCouldColonise.length === 0}
        >start colony on {star.name}</button>
    </div>
}
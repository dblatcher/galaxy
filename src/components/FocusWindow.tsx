import { useGameStateContext } from "../hooks/useGameStateContext"
import { isSet, lookUpName } from "../lib/util"
import { FleetCheckButton } from "./FleetCheckButton"


export const FocusWindow = () => {

    const { gameState, startStar } = useGameStateContext()
    const { fleets, factions } = gameState
    const fleetsHere = startStar && fleets.filter(fleet => fleet.orbitingStarId === startStar?.id)

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        flexBasis: 150,
        flexShrink: 0,
        border: '1px solid red',
    }}>
        {startStar && (
            <div>{startStar.name}</div>
        )}
        {isSet(startStar?.factionId) && (
            <div>{lookUpName(startStar.factionId, factions)}</div>
        )}
        <ul style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            textAlign: 'left'
        }}>
            {fleetsHere?.map((fleet, index) => (
                <li key={index} style={{ paddingBottom: 2, paddingLeft: 3, paddingRight: 3 }}>
                    <FleetCheckButton fleet={fleet} />
                </li>
            ))}
        </ul>
    </div>
}
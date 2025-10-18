import { useGameStateContext } from "../hooks/useGameStateContext"
import { lookUpName } from "../lib/util"


export const FocusWindow = () => {

    const { gameState, startStar, dispatch } = useGameStateContext()
    const { fleets, factions, galaxy, selectedFleetId } = gameState
    const fleetsHere = startStar && fleets.filter(fleet => fleet.orbitingStarId === startStar?.id)

    return <div style={{
        flexBasis: 150,
        flexShrink: 0,
        border: '1px solid red',
    }}>
        {startStar && (
            <p>{startStar.name}</p>
        )}
        <ul style={{
            listStyle: "none",
            padding: 5,
            margin: 0,
            textAlign: 'left'
        }}>
            {fleetsHere?.map((fleet, index) => (
                <li key={index}>
                    <label style={{ display: 'flex' }}>
                        <input type="checkbox"
                            checked={selectedFleetId === fleet.id}
                            onChange={({ target: { checked } }) => {
                                dispatch({ type: 'select-fleet', target: !checked ? undefined : fleet })
                            }}
                        />
                        <div>
                            <span>{lookUpName(fleet.factionId, factions)} fleet </span>

                            {fleet.destinationStarId
                                ? <span>Destination: {lookUpName(fleet.destinationStarId, galaxy.stars)} </span>
                                : <span>In orbit</span>
                            }
                        </div>
                    </label>
                </li>
            ))}
        </ul>
    </div>
}
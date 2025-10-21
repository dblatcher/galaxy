import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Fleet } from "../lib/model"
import { findById, lookUpName } from "../lib/util"
import { FleetSymbol } from "./FleetSymbol"


export const FleetCheckButton = ({ fleet }: { fleet: Fleet }) => {

    const { gameState, dispatch } = useGameStateContext()
    const { factions, galaxy, selectedFleetId, activeFactionId } = gameState;
    const checked = selectedFleetId === fleet.id;
    const faction = findById(fleet.factionId, factions)

    const isActiveFactionFleet = activeFactionId === fleet.factionId;

    if (!isActiveFactionFleet) {
        return <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 4,
            padding: 1,
            borderWidth: 1,
            borderColor: 'white',
            background: 'gray'
        }}>
            <svg viewBox="0 0 6 6" style={{ width: 20, height: 20 }}><FleetSymbol color={faction?.color} /></svg>
            <div>
                {fleet.destinationStarId &&
                    <span>{lookUpName(fleet.destinationStarId, galaxy.stars)} </span>
                }
            </div>
        </div>
    }

    return <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderRadius: 4,
        padding: 1,
        borderWidth: 1,
        borderColor: 'white',
        background: checked ? 'black' : undefined,
        borderStyle: checked ? 'solid' : 'dashed',
        boxSizing: 'border-box',
        cursor: 'pointer',
    }}>
        <input type="checkbox"
            style={{ visibility: 'hidden', position: 'absolute' }}
            checked={checked}
            onChange={isActiveFactionFleet
                ? ({ target: { checked } }) => {
                    dispatch({ type: 'select-fleet', target: !checked ? undefined : fleet })
                }
                : undefined
            }
        />
        <svg viewBox="0 0 6 6" style={{ width: 20, height: 20 }}><FleetSymbol color={faction?.color} /></svg>
        <div>

            {fleet.destinationStarId &&
                <span>{lookUpName(fleet.destinationStarId, galaxy.stars)} </span>
            }
        </div>
    </label>
}
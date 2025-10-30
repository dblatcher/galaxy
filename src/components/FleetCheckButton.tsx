import type { CSSProperties } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Faction, Fleet } from "../lib/model"
import { findById, lookUpName } from "../lib/util"
import { FleetSymbol } from "./FleetSymbol"

const containerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    borderRadius: 4,
    padding: 1,
    borderWidth: 1,
    borderColor: 'white',
    boxSizing: 'border-box',
}

const countFleetShips = ({ ships }: Fleet, faction?: Faction) => {
    if (!faction) return {}
    const shipCount: Record<string, number> = {}
    ships.forEach(ship => {
        const design = faction.shipDesigns.find(design => design.id === ship.designId);
        if (!design) { return }
        shipCount[design.name] = (shipCount[design.name] ?? 0) + 1
    })
    return shipCount
}

export const FleetCheckButton = ({ fleet }: { fleet: Fleet }) => {

    const { gameState, dispatch } = useGameStateContext()
    const { factions, galaxy, selectedFleetId, activeFactionId } = gameState;
    const checked = selectedFleetId === fleet.id;
    const faction = findById(fleet.factionId, factions)
    const isActiveFactionFleet = activeFactionId === fleet.factionId;

    const contents = <>
        <svg viewBox="0 0 6 6" style={{ width: 20, height: 20 }}>
            <FleetSymbol color={faction?.color} />
        </svg>
        <div>
            <div>
                {Object.entries(countFleetShips(fleet, faction)).map(
                    ([shipDesignName, count]) => (
                        <span key={shipDesignName} >{shipDesignName} x{count}{' '}</span>
                    )
                )}
            </div>
            {fleet.destinationStarId && <>
                <span>{lookUpName(fleet.destinationStarId, galaxy.stars)} </span>
            </>
            }
        </div>
    </>

    if (!isActiveFactionFleet) {
        return <div style={{ ...containerStyle, background: 'gray' }}>
            {contents}
        </div>
    }

    return <label style={{
        ...containerStyle,
        background: checked ? 'black' : undefined,
        borderStyle: checked ? 'solid' : 'dashed',
        cursor: 'pointer',
    }}>
        <input type="checkbox"
            style={{ visibility: 'hidden', position: 'absolute' }}
            checked={checked}
            onChange={
                ({ target: { checked } }) =>
                    dispatch({ type: 'select-fleet', target: !checked ? undefined : fleet })
            }
        />
        {contents}
    </label>
}
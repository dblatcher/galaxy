import type { CSSProperties } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Faction, Fleet } from "../lib/model"
import { findById, lookUpName } from "../lib/util"
import { FleetIcon } from "./FleetSymbol"
import { ToggleableBox } from "./ToggleableBox"

const contentStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
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

    const contents = <div style={contentStyle}>
        <FleetIcon color={faction?.color} />
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
    </div>

    if (!isActiveFactionFleet) {
        return <div style={{ ...contentStyle, background: 'gray' }}>
            {contents}
        </div>
    }

    return <ToggleableBox
        checked={checked}
        setChecked={checked =>
            dispatch({ type: 'select-fleet', target: !checked ? undefined : fleet })}
    >
        {contents}
    </ToggleableBox>
}
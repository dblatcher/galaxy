import type { CSSProperties } from "react";
import { useGameStateContext } from "../hooks/useGameStateContext";
import { findById, isSet, splitArray } from "../lib/util";
import { FleetList } from "./FleetList";


const headerStyle: CSSProperties = {
    borderBottom: '1px solid red',
}

export const FocusWindow = () => {
    const { gameState, focusedStar, dispatch } = useGameStateContext()
    const { fleets, factions, activeFactionId, selectedFleetId } = gameState
    const fleetsHere = focusedStar ? fleets.filter(fleet => fleet.orbitingStarId === focusedStar?.id) : []
    const [playersFleets, othersFleets] = splitArray(fleetsHere, (fleet) => fleet.factionId === activeFactionId)
    const faction = findById(focusedStar?.factionId, factions)

    const selectedTravelingFleet = focusedStar ? undefined : findById(selectedFleetId, fleets)

    return <div>
        {focusedStar && (
            <>
                <header style={headerStyle}>
                    {focusedStar && (
                        <div>{focusedStar.name}</div>
                    )}
                    <div style={{ color: faction?.color }}>
                        {faction?.name ?? 'unpopulated'}
                    </div>
                </header>

                <FleetList title="Your fleets" list={playersFleets} />
                {playersFleets.length > 0 && (
                    <button onClick={() => dispatch({ type: 'open-dialog', dialog: { 'role': 'fleets' } })}>arrange fleets</button>
                )}
                <FleetList title="Other fleets" list={othersFleets} />
            </>)}

        {selectedTravelingFleet && (
            <FleetList title="Fleet" list={[selectedTravelingFleet]} />
        )}
    </div>
}
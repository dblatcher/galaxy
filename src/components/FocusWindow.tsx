import type { CSSProperties } from "react";
import { useGameStateContext } from "../hooks/useGameStateContext";
import { findById, splitArray } from "../lib/util";
import { FleetList } from "./FleetList";


const headerStyle: CSSProperties = {
    borderBottom: '1px solid red',
}

export const FocusWindow = () => {
    const { gameState, startStar } = useGameStateContext()
    const { fleets, factions, activeFactionId } = gameState
    const fleetsHere = startStar ? fleets.filter(fleet => fleet.orbitingStarId === startStar?.id) : []
    const [playersFleets, othersFleets] = splitArray(fleetsHere, (fleet) => fleet.factionId === activeFactionId)
    const faction = findById(startStar?.factionId, factions)

    return <div>
        {startStar && (
            <>
                <header style={headerStyle}>
                    {startStar && (
                        <div>{startStar.name}</div>
                    )}
                    <div style={{ color: faction?.color }}>
                        {faction?.name ?? 'unpopulated'}
                    </div>
                </header>

                <FleetList title="Your fleets" list={playersFleets} />
                <FleetList title="Other fleets" list={othersFleets} />
            </>)}
    </div>
}
import type { CSSProperties } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Faction, Fleet } from "../lib/model"
import { findById, lookUpName } from "../lib/util"
import { FleetIcon } from "./FleetSymbol"
import { ToggleableBox } from "./ToggleableBox"
import { getShipsThatCouldBomb } from "../lib/colony-operations"


interface Props {
    fleet: Fleet;
    canOrder?: boolean;
    isPendingBattle?: boolean;
}

const rowStyle: CSSProperties = {
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

export const FleetBox = ({ fleet, canOrder, isPendingBattle }: Props) => {

    const { gameState, dispatch } = useGameStateContext()
    const { factions, galaxy, selectedFleetId, activeFactionId } = gameState;
    const checked = selectedFleetId === fleet.id;
    const faction = findById(fleet.factionId, factions)
    const isActiveFactionFleet = activeFactionId === fleet.factionId;


    const fleetDescription = <div>
        <div style={rowStyle}>
            <FleetIcon color={faction?.color} />
            <div style={{ color: faction?.color }}>{faction?.name} fleet</div>
        </div>
        <div>
            <div>
                {Object.entries(countFleetShips(fleet, faction)).map(
                    ([shipDesignName, count]) => (
                        <div key={shipDesignName} >{shipDesignName} x{count}{' '}</div>
                    )
                )}
            </div>
        </div>
        {fleet.destinationStarId && <div> &rarr; {lookUpName(fleet.destinationStarId, galaxy.stars)} </div>}

    </div>

    if (!canOrder || !isActiveFactionFleet) {
        return fleetDescription
    }

    const star = findById(fleet.orbitingStarId, galaxy.stars)
    const couldBomb = !isPendingBattle && !!(faction && star) && getShipsThatCouldBomb(fleet, faction, star).length > 0

    return <>
        <ToggleableBox
            checked={checked}
            setChecked={checked =>
                dispatch({ type: 'select-fleet', target: !checked ? undefined : fleet })}
        >
            {fleetDescription}
        </ToggleableBox>
        <div>
            <button className="small"
            onClick={() => {
                if (star) {
                    dispatch({ type: 'order-bombing', starId: star.id, fleetId: fleet.id })
                }
            }} disabled={!couldBomb}>bomb!</button>
        </div>
    </>
}
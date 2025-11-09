import { useGameStateContext } from "../../hooks/useGameStateContext";
import { findById, splitArray } from "../../lib/util";
import { ColoniseButton } from "./ColoniseButton";
import { ColonyMenu } from "./ColonyMenu";
import { FleetList } from "./FleetList";



export const SideMenu = () => {
    const { gameState, focusedStar, dispatch } = useGameStateContext()
    const { fleets, factions, activeFactionId, selectedFleetId } = gameState
    const fleetsHere = focusedStar ? fleets.filter(fleet => fleet.orbitingStarId === focusedStar?.id) : []
    const [playersFleets, othersFleets] = splitArray(fleetsHere, (fleet) => fleet.factionId === activeFactionId)
    const faction = findById(focusedStar?.factionId, factions)
    const selectedTravelingFleet = focusedStar ? undefined : findById(selectedFleetId, fleets)

    return <>
        {focusedStar && (
            <section>
                <h3>{focusedStar.name}</h3>
                <div style={{ color: faction?.color }}>
                    {faction?.name ?? 'unpopulated'}
                </div>
                {activeFactionId === focusedStar.factionId && (
                    <ColonyMenu star={focusedStar} />
                )}

                {(!faction && playersFleets.length) && <ColoniseButton star={focusedStar} />}
            </section>
        )}

        {focusedStar && (<>
            <FleetList title="Your fleets" list={playersFleets} canOrder  arrangeButton/>
            <FleetList title="Other fleets" list={othersFleets} />
        </>)}

        {selectedTravelingFleet && (
            <FleetList title="Fleet" list={[selectedTravelingFleet]} />
        )}
    </>
}
import { useGameStateContext } from "../../hooks/useGameStateContext";
import { findById, splitArray } from "../../lib/util";
import { ColoniseButton } from "./ColoniseButton";
import { ShipConstruction } from "./ShipConstruction";
import { FleetList } from "./FleetList";



export const SideMenu = () => {
    const { gameState, focusedStar, activeFactionBattles, dispatch } = useGameStateContext()
    const { fleets, factions, activeFactionId, selectedFleetId } = gameState
    const fleetsHere = focusedStar ? fleets.filter(fleet => fleet.orbitingStarId === focusedStar?.id) : []
    const [playersFleets, othersFleets] = splitArray(fleetsHere, (fleet) => fleet.factionId === activeFactionId)
    const colonyFaction = findById(focusedStar?.factionId, factions)
    const selectedTravelingFleet = focusedStar ? undefined : findById(selectedFleetId, fleets)

    const pendingBattleHere = focusedStar && activeFactionBattles.find(battle => battle.star === focusedStar.id)
    const playerCanColonise = !!(!colonyFaction && playersFleets.length);

    return <>
        {focusedStar && (
            <>
                <section>
                    <h3>{focusedStar.name}</h3>
                    {colonyFaction ? (<>
                        <div style={{ color: colonyFaction.color }}>
                            {colonyFaction.name}
                        </div>
                        <div>
                            pop: {focusedStar.population?.toFixed(2)}m
                        </div>
                        {activeFactionId === colonyFaction.id && (
                            <ShipConstruction star={focusedStar} />
                        )}
                    </>) : (
                        <>
                            <div>unpopulated</div>
                            {playerCanColonise && <ColoniseButton star={focusedStar} />}
                        </>
                    )}
                    {pendingBattleHere && <div>
                        <button onClick={() => {
                            dispatch({
                                type: 'battles:launch', starId: focusedStar.id
                            })
                        }}>FIGHT BATTLE</button>
                    </div>}
                </section>

                <FleetList title="Your fleets" list={playersFleets} canOrder arrangeButton pendingBattle={pendingBattleHere} />
                <FleetList title="Other fleets" list={othersFleets} />
            </>)}

        {selectedTravelingFleet && (
            <FleetList title="Fleet" list={[selectedTravelingFleet]} />
        )}
    </>
}
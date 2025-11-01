import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Faction, ShipDesign } from "../lib/model"
import { splitArray, findById } from "../lib/util"
import { ModalLayout } from "./ModalLayout"


const getDesignMap = (faction?: Faction) => {
    const designMap: Record<string, ShipDesign> = {}
    faction?.shipDesigns.forEach(design => {
        designMap[design.id] = design
    })

    return designMap
}

export const FleetsControl = () => {

    const { gameState, focusedStar, } = useGameStateContext()
    const { fleets, factions, activeFactionId, } = gameState
    const fleetsHere = focusedStar ? fleets.filter(fleet => fleet.orbitingStarId === focusedStar?.id) : []
    const [playersFleets] = splitArray(fleetsHere, (fleet) => fleet.factionId === activeFactionId)
    const faction = findById(activeFactionId, factions)

    const designMap = getDesignMap(faction)

    return (
        <ModalLayout
            title={<div>{faction?.name} fleets at {focusedStar?.name}</div>}

        >
            {playersFleets.map((fleet, fleetIndex) => (
                <div style={{ padding: 5, border: '1px dotted white' }}>
                    <span>#{fleet.id}</span>
                    <div key={fleetIndex} style={{ display: 'flex', gap: 5 }}>
                        {fleet.ships.map((ship, shipIndex) => {
                            const design = designMap[ship.designId];
                            if (!design) { return <div key={shipIndex}>!missing design {ship.designId}</div> }
                            return <button key={shipIndex}>
                                {design.name}
                                <span>{design.hp - ship.damage}/{design.hp}</span>
                            </button>
                        })}

                    </div>
                    <div>
                        <button>move here</button>
                    </div>
                </div>
            ))}

            <div style={{ padding: 5, border: '1px dotted white' }}>
                <div>
                    <button>make new fleet</button>
                </div>
            </div>
        </ModalLayout>

    )
}
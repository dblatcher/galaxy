import { useMemo, useState } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Faction, ShipDesign } from "../lib/model"
import { splitArray, findById, removeDuplicates } from "../lib/util"
import { FleetIcon } from "./FleetSymbol"
import { ModalLayout } from "./ModalLayout"
import { ToggleableBox } from "./ToggleableBox"


const getDesignMap = (faction?: Faction) => {
    const designMap: Record<string, ShipDesign> = {}
    faction?.shipDesigns.forEach(design => {
        designMap[design.id] = design
    })

    return designMap
}

type SelectedShips = Record<number, number[]>;

export const FleetsControl = () => {
    const { gameState, focusedStar, } = useGameStateContext()

    const [selectedShips, setSelectedShips] = useState<SelectedShips>({})
    const isSelected = (shipIndex: number, fleetIndex: number) => {
        return selectedShips[fleetIndex]?.includes(shipIndex)
    }
    const selectShip = (shipIndex: number, fleetIndex: number) => setSelectedShips(selectedShips => {
        const newList = removeDuplicates([...(selectedShips[fleetIndex] ?? []), shipIndex])
        return { ...selectedShips, [fleetIndex]: newList }
    })
    const deselectShip = (shipIndex: number, fleetIndex: number) => setSelectedShips(selectedShips => {
        const newList = (selectedShips[fleetIndex] ?? []).filter(ship => ship !== shipIndex)
        return { ...selectedShips, [fleetIndex]: newList }
    })


    const { fleets, factions, activeFactionId, } = gameState
    const fleetsHere = focusedStar ? fleets.filter(fleet => fleet.orbitingStarId === focusedStar?.id) : []
    const [playersFleets] = splitArray(fleetsHere, (fleet) => fleet.factionId === activeFactionId)
    const faction = findById(activeFactionId, factions)
    const designMap = useMemo(() => getDesignMap(faction), [faction])

    return (
        <ModalLayout
            title={<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <FleetIcon color={faction?.color} size={25} />
                {faction?.name} fleets at {focusedStar?.name}
            </div>}
        >
            {playersFleets.map((fleet, fleetIndex) => (
                <div style={{ padding: 5, borderBottom: '1px dotted white' }}>
                    <div>#{fleet.id} </div>
                    <div key={fleetIndex} style={{ display: 'flex', gap: 5 }}>
                        {fleet.ships.map((ship, shipIndex) => {
                            const design = designMap[ship.designId];
                            if (!design) { return <div key={shipIndex}>!missing design {ship.designId}</div> }

                            return <ToggleableBox key={shipIndex} checked={isSelected(shipIndex, fleetIndex)}
                                setChecked={checked => checked ? selectShip(shipIndex, fleetIndex) : deselectShip(shipIndex, fleetIndex)}
                            >
                                <FleetIcon color={faction?.color} size={15} />
                                {design.name}
                                <span>{design.hp - ship.damage}/{design.hp}</span>
                            </ToggleableBox>
                        })}

                    </div>
                    <div>
                        <button>move here</button>
                    </div>
                </div>
            ))}

            <div style={{ padding: 5 }}>
                <div>
                    <button>make new fleet</button>
                </div>
            </div>
        </ModalLayout>

    )
}
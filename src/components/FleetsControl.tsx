import { useMemo, useState } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Faction, ShipDesign } from "../lib/model"
import { removeDuplicates, splitArray } from "../lib/util"
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
    const { gameState, focusedStar, activeFaction, dispatch } = useGameStateContext()

    const [selectedShips, setSelectedShips] = useState<SelectedShips>({})
    const isSelected = (shipIndex: number, fleetId: number) => {
        return selectedShips[fleetId]?.includes(shipIndex)
    }
    const selectShip = (shipIndex: number, fleetId: number) => setSelectedShips(selectedShips => {
        const newList = removeDuplicates([...(selectedShips[fleetId] ?? []), shipIndex])
        return { ...selectedShips, [fleetId]: newList }
    })
    const deselectShip = (shipIndex: number, fleetId: number) => setSelectedShips(selectedShips => {
        const newList = (selectedShips[fleetId] ?? []).filter(ship => ship !== shipIndex)
        return { ...selectedShips, [fleetId]: newList }
    })


    const { fleets, activeFactionId, } = gameState
    const fleetsHere = focusedStar ? fleets.filter(fleet => fleet.orbitingStarId === focusedStar?.id) : []
    const [playersFleets] = splitArray(fleetsHere, (fleet) => fleet.factionId === activeFactionId)

    const designMap = useMemo(() => getDesignMap(activeFaction), [activeFaction])

    return (
        <ModalLayout
            title={<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <FleetIcon color={activeFaction.color} size={25} />
                {activeFaction.name} fleets at {focusedStar?.name}
            </div>}
        >
            {playersFleets.map((fleet, fleetIndex) => (
                <div style={{ padding: 5, borderBottom: '1px dotted white' }} key={fleetIndex}>
                    <div>#{fleet.id} </div>
                    <div style={{ display: 'flex', gap: 5 }}>
                        {fleet.ships.map((ship, shipIndex) => {
                            const design = designMap[ship.designId];
                            if (!design) { return <div key={shipIndex}>!missing design {ship.designId}</div> }

                            return <ToggleableBox key={shipIndex} checked={isSelected(shipIndex, fleet.id)}
                                setChecked={checked => checked ? selectShip(shipIndex, fleet.id) : deselectShip(shipIndex, fleet.id)}
                            >
                                <FleetIcon color={activeFaction.color} size={15} />
                                {design.name}
                                <span>{design.hp - ship.damage}/{design.hp}</span>
                            </ToggleableBox>
                        })}

                    </div>
                    <div>
                        <button onClick={() => {
                            dispatch({ type: 'fleets:transfer-ships', fleetId: fleet.id, shipIdMap: selectedShips })
                        }}>move here</button>
                    </div>
                </div>
            ))}

            <div style={{ padding: 5 }}>
                <div>
                    <button onClick={() => {
                        dispatch({ type: 'fleets:add-fleet', shipIdMap: selectedShips })
                    }}>make new fleet</button>
                </div>
            </div>
        </ModalLayout>

    )
}
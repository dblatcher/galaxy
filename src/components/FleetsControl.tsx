import { useMemo, useState, type CSSProperties } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import { getDesignMap } from "../lib/fleet-operations"
import type { Fleet } from "../lib/model"
import { findById, isSet, lookUpName, removeDuplicates, splitArray } from "../lib/util"
import { FleetIcon } from "./FleetSymbol"
import { ModalLayout } from "./ModalLayout"
import { ToggleableBox } from "./ToggleableBox"


type SelectedShips = Record<number, number[]>;

const shipListStyle: CSSProperties = {
    display: 'flex',
    gap: 5,
    flexDirection: 'column',
}

export const FleetsControl = () => {
    const { gameState, focusedStar, activeFaction, dispatch } = useGameStateContext()
    const { fleets, activeFactionId, } = gameState
    const fleetsHere = focusedStar ? fleets.filter(fleet => fleet.orbitingStarId === focusedStar?.id) : []
    const [playersFleets] = splitArray(fleetsHere, (fleet) => fleet.factionId === activeFactionId)

    const [selectedShips, setSelectedShips] = useState<SelectedShips>({})
    const isSelected = (shipIndex: number, fleetId: number) => {
        return selectedShips[fleetId]?.includes(shipIndex)
    }
    const selectShip = (shipIndex: number, fleetId: number) => setSelectedShips(selectedShips => {
        const newList = removeDuplicates([...(selectedShips[fleetId] ?? []), shipIndex])
        return { ...selectedShips, [fleetId]: newList }
    })
    const selectAll = (fleetId: number) => setSelectedShips(selectedShips => {
        const fleet = findById(fleetId, playersFleets);
        if (!fleet) { return selectedShips }
        const newList = fleet.ships.map((_ship, index) => index)
        return { ...selectedShips, [fleetId]: newList }
    })
    const deselectShip = (shipIndex: number, fleetId: number) => setSelectedShips(selectedShips => {
        const newList = (selectedShips[fleetId] ?? []).filter(ship => ship !== shipIndex)
        return { ...selectedShips, [fleetId]: newList }
    })

    const designMap = useMemo(() => getDesignMap(activeFaction), [activeFaction])
    const destinationDisplay = (fleet: Fleet) => {
        if (!isSet(fleet.destinationStarId)) {
            return `in orbit`
        }
        const name = lookUpName(fleet.destinationStarId, gameState.galaxy.stars)
        return `heading to ${name}`
    }

    return (
        <ModalLayout
            title={<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <FleetIcon color={activeFaction.color} size={25} />
                {activeFaction.name} fleets at {focusedStar?.name}
            </div>}
        >
            {playersFleets.map((fleet, fleetIndex) => (
                <div style={{ padding: 5, borderBottom: '1px dotted white' }} key={fleetIndex}>
                    <div>
                        {destinationDisplay(fleet)}
                    </div>
                    <div style={shipListStyle}>
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
                        <button onClick={() => selectAll(fleet.id)}>all</button>
                        <button onClick={() => {
                            dispatch({ type: 'fleets:transfer-ships', fleetId: fleet.id, sourceFleetMap: selectedShips })
                            setSelectedShips({})
                        }}>move here</button>
                    </div>
                </div>
            ))}

            <div style={{ padding: 5 }}>
                <div>
                    <button onClick={() => {
                        dispatch({ type: 'fleets:transfer-to-new-fleet', sourceFleetMap: selectedShips })
                        setSelectedShips({})
                    }}>make new fleet</button>
                </div>
            </div>
        </ModalLayout>

    )
}
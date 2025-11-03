import { getAllBattles } from "./derived-state"
import type { Star, Ship, Fleet, GameState, Faction, ShipDesign } from "./model"
import { filterInPlace, findById, nextId, splitArray } from "./util"


export const appendFleet = (factionId: number, star: Star, newShips: Ship[], fleets: Fleet[]) => {
    const fleet: Fleet = {
        id: nextId(fleets),
        factionId,
        orbitingStarId: star.id,
        location: {
            x: star.x,
            y: star.y
        },
        ships: newShips,
    }
    fleets.push(fleet)
    return fleet
}

export const transferShips = (
    sourceFleetMap: Record<number, number[]>,
    destinationFleet: Fleet,
    fleets: Fleet[]
) => {
    Object.entries(sourceFleetMap).forEach(([key, shipIndexList]) => {
        const sourceFleetId = Number(key);
        if (destinationFleet.id === sourceFleetId) {
            return;
        }
        const sourceFleet = findById(sourceFleetId, fleets)
        if (!sourceFleet) {
            console.warn('no source fleet', sourceFleetId)
            return;
        }
        const [shipsToMove, shipsToStay] = splitArray(sourceFleet.ships, (_, index) => shipIndexList.includes(index))
        sourceFleet.ships = shipsToStay
        destinationFleet.ships.push(...shipsToMove)
    })
    filterInPlace(fleets, fleet => fleet.ships.length > 0)

    return fleets
}

export const factionHasBattles = (factionId: number, gameState: GameState) => {
    return getAllBattles(gameState)
        .some(battle => battle.sides
            .some(side => side.faction === factionId)
        )
}

export const getDesignMap = (faction?: Faction) => {
    const designMap: Record<string, ShipDesign> = {}
    faction?.shipDesigns.forEach(design => {
        designMap[design.id] = design
    })
    return designMap
}

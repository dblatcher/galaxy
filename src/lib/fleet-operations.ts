import { getAllBattles } from "./derived-state"
import type { Star, Ship, Fleet, GameState, Faction } from "./model"
import { enhanceShipDesign, type EnhancedShipDesign } from "./ship-design-helpers"
import { filterInPlace, findById, isSet, nextId, splitArray } from "./util"


export const addNewFleet = (factionId: number, star: Star, newShips: Ship[], fleets: Fleet[]) => {
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

export const findFleetsReadyToBomb = (state: GameState, faction: Faction): Fleet[] => {
    const battles = getAllBattles(state)
    const { fleets, galaxy: { stars } } = state
    const designs = getDesignMap(faction)
    return fleets
        .filter(fleet => fleet.factionId == faction.id)
        .filter(fleet => {
            const star = findById(fleet.orbitingStarId, stars)
            return !!star &&
                isSet(star.factionId) &&
                star.factionId !== faction.id &&
                !battles.some(battle => battle.star === star?.id) &&
                fleet.ships.some(ship => designs[ship.designId]?.hasBombs && !ship.hasBombed)
        })
}

export const factionHasBattlesOrCanBomb = (factionId: number, gameState: GameState): boolean => {
    const hasBattles = getAllBattles(gameState)
        .some(battle => battle.sides
            .some(side => side.faction === factionId)
        );

    if (hasBattles) {
        return true
    }

    const faction = findById(factionId, gameState.factions)
    if (!faction) {
        return false
    }
    return findFleetsReadyToBomb(gameState, faction).length > 0

}

export const getDesignMap = (faction?: Faction) => {
    const designMap: Record<string, EnhancedShipDesign> = {}
    faction?.shipDesigns.forEach(design => {
        designMap[design.id] = enhanceShipDesign(design)
    })
    return designMap
}

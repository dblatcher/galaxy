import type { Battle, Fleet, GameState } from "./model";
import { findById, isSet, removeDuplicates, splitArray } from "./util";


export const getBattleAt = (starId: number, gameState: GameState, fleetsHereAlreadyFound?: Fleet[]) => {
    const fleetsHere = fleetsHereAlreadyFound ?? gameState.fleets.filter(f => f.orbitingStarId === starId);
    const factionsHere = removeDuplicates(fleetsHere.map(f => f.factionId)).flatMap(id => findById(id, gameState.factions) ?? []);

    if (factionsHere.length < 2) { return undefined }
    const sides = factionsHere.map(faction => (
        {
            faction: faction.id,
            fleets: fleetsHere.filter(f => f.factionId == faction.id).map(f => f.id)
        }
    ));
    return { star: starId, sides }
}

export const getAllBattles = (gameState: GameState): Battle[] => {
    const { fleets, galaxy } = gameState;
    const battles: Battle[] = [];
    let unassignedFleets = [...fleets].filter(f => isSet(f.orbitingStarId));

    galaxy.stars.forEach(star => {
        const [fleetsHere, fleetsElsewhere] = splitArray(unassignedFleets, f => f.orbitingStarId === star.id)
        unassignedFleets = fleetsElsewhere;

        const battleHere = getBattleAt(star.id, gameState, fleetsHere);
        if (battleHere) {
            battles.push(battleHere)
        }
    })
    return battles
}


export const getDerivedState = (gameState: GameState) => {
    const { galaxy, focusedStarId, activeFactionId } = gameState;
    const startStar = galaxy.stars.find(star => star.id === focusedStarId);
    const activeStarId = focusedStarId;

    const battles = getAllBattles(gameState);
    const [activeFactionBattles, battlesWithoutActiveFaction] = splitArray(battles, b => b.sides.some(side => side.faction === activeFactionId))

    return { activeStarId, startStar, battles, activeFactionBattles, battlesWithoutActiveFaction }
}

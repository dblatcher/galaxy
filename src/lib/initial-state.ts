import type { Galaxy, Fleet, Faction, GameState, ShipDesign, Ship } from "./model"

const initialGalaxy: Galaxy = {
    stars: [
        { x: 100, y: 75, id: 1, name: 'Arcturus', factionId: 1 },
        { x: 30, y: 45, id: 2, name: 'Kunitio' },
        { x: 130, y: 35, id: 3, name: 'Junke', factionId: 2 },
        { x: 120, y: 45, id: 4, name: 'Maddow' },
        { x: 60, y: 25, id: 5, name: 'Zorblax', factionId: 0 },
    ],
    width: 150,
    height: 100,
}

const baseShips = (): Ship[] => [{
    designId: 0,
    damage: 0
}];

const baseDesigns = (): ShipDesign[] => {
    return [{
        id: 0,
        name: 'scout',
        hp: 3,
        atk: 1,
    }]
};

const initialFleets: Fleet[] = [
    {
        id: 0,
        location: {
            x: 50,
            y: 50
        },
        destinationStarId: 1,
        factionId: 2,
        ships: baseShips(),
    },
    {
        id: 1,
        orbitingStarId: 1,
        destinationStarId: undefined,
        location: {
            x: 10,
            y: 15
        },
        factionId: 3,
        ships: baseShips(),
    },
    {
        id: 2,
        location: {
            x: 120,
            y: 30
        },
        destinationStarId: 3,
        factionId: 0,
        ships: baseShips(),
    },
    {
        id: 3,
        orbitingStarId: 1,
        destinationStarId: undefined,
        location: {
            x: 10,
            y: 15
        },
        factionId: 2,
        ships: baseShips(),
    },
]




const initialFactions: [Faction, ...Faction[]] = [
    { id: 0, name: 'Zorblaxian', color: 'lime', playerType: 'LOCAL', shipDesigns: baseDesigns() },
    { id: 1, name: 'Magrathian', color: 'crimson', playerType: 'CPU', shipDesigns: baseDesigns() },
    { id: 2, name: 'Martian', color: 'pink', playerType: 'CPU', shipDesigns: baseDesigns() },
    { id: 3, name: 'Uraninian', color: 'skyblue', playerType: 'CPU', shipDesigns: baseDesigns() },
]

export const initalState: GameState = {
    turnNumber: 1,
    activeFactionId: initialFactions[0].id,
    galaxy: initialGalaxy,
    fleets: initialFleets,
    factions: initialFactions,
    reports: [],
}
import type { Galaxy, Fleet, Faction, GameState, ShipDesign, Ship } from "./model"


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

const idMap: Record<string, number> = {}

const nextIdFor = (list: string): number => {
    if (typeof idMap[list] === 'undefined') {
        idMap[list] = 1
        return 1
    }
    idMap[list] = idMap[list] + 1
    return idMap[list]
}

const FACTION_ID = {
    Zorblaxian: 0,
    Magrathian: 1,
    Martian: 2,
    Uraninian: 3,
}

const initialFactions: [Faction, ...Faction[]] = [
    { id: FACTION_ID.Zorblaxian, name: 'Zorblaxian', color: 'lime', playerType: 'LOCAL', shipDesigns: baseDesigns() },
    { id: FACTION_ID.Magrathian, name: 'Magrathian', color: 'crimson', playerType: 'CPU', shipDesigns: baseDesigns() },
    { id: FACTION_ID.Martian, name: 'Martian', color: 'pink', playerType: 'CPU', shipDesigns: baseDesigns() },
    { id: FACTION_ID.Uraninian, name: 'Uraninian', color: 'skyblue', playerType: 'CPU', shipDesigns: baseDesigns() },
]

const initialGalaxy: Galaxy = {
    stars: [
        { x: 100, y: 75, id: 1, name: 'Arcturus', factionId: FACTION_ID.Magrathian },
        { x: 30, y: 45, id: 2, name: 'Kunitio' },
        { x: 130, y: 35, id: 3, name: 'Junke', factionId: FACTION_ID.Martian },
        { x: 120, y: 45, id: 4, name: 'Maddow' },
        { x: 60, y: 25, id: 5, name: 'Zorblax', factionId: FACTION_ID.Zorblaxian },
        { x: 20, y: 20, id: 6, name: 'Sol', factionId: FACTION_ID.Zorblaxian },
    ],
    width: 150,
    height: 100,
}


const initialFleets: Fleet[] = [
    {
        id: nextIdFor('fleet'),
        location: {
            x: 50,
            y: 50
        },
        destinationStarId: 1,
        factionId: FACTION_ID.Martian,
        ships: baseShips(),
    },
    {
        id: nextIdFor('fleet'),
        orbitingStarId: 1,
        destinationStarId: undefined,
        location: {
            x: 10,
            y: 15
        },
        factionId: FACTION_ID.Uraninian,
        ships: baseShips(),
    },
    {
        id: nextIdFor('fleet'),
        location: {
            x: 120,
            y: 30
        },
        destinationStarId: 3,
        factionId: FACTION_ID.Zorblaxian,
        ships: baseShips(),
    },
    {
        id: nextIdFor('fleet'),
        orbitingStarId: 1,
        destinationStarId: undefined,
        location: {
            x: 10,
            y: 15
        },
        factionId: FACTION_ID.Martian,
        ships: baseShips(),
    },
    {
        id: nextIdFor('fleet'),
        orbitingStarId: 6,
        destinationStarId: undefined,
        location: {
            x: 0,
            y: 0,
        },
        factionId: FACTION_ID.Zorblaxian,
        ships: [...baseShips(),...baseShips(),...baseShips()],
    },
]

export const initalState: GameState = {
    turnNumber: 1,
    activeFactionId: initialFactions[0].id,
    galaxy: initialGalaxy,
    fleets: initialFleets,
    factions: initialFactions,
    reports: [],
}
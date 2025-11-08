import type { Galaxy, Fleet, Faction, GameState, ShipDesign, Ship } from "./model"


const baseShips = (): Ship[] => [{
    designId: 0,
    damage: 0
}];

const baseDesigns = (): ShipDesign[] => {
    return [
        {
            id: 0,
            name: 'scout',
            hp: 3,
            atk: 1,
            constructionCost: 3,
            specials: {},
        },
        {
            id: 1,
            name: 'colony ship',
            hp: 10,
            atk: 0,
            constructionCost: 10,
            specials: {
                colonise: true
            }
        },
    ]
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
} as const

const initialFactions: [Faction, ...Faction[]] = [
    { id: FACTION_ID.Zorblaxian, name: 'Zorblaxian', color: 'lime', playerType: 'LOCAL', shipDesigns: [...baseDesigns()] },
    { id: FACTION_ID.Magrathian, name: 'Magrathian', color: 'crimson', playerType: 'CPU', shipDesigns: baseDesigns() },
    { id: FACTION_ID.Martian, name: 'Martian', color: 'pink', playerType: 'CPU', shipDesigns: baseDesigns() },
    { id: FACTION_ID.Uraninian, name: 'Uraninian', color: 'skyblue', playerType: 'CPU', shipDesigns: baseDesigns() },
]

const STAR_ID = {
    Arcturus: 1,
    Kunitio: 2,
    Junke: 3,
    Maddow: 4,
    Zorblax: 5,
    Sol: 6
} as const;

const initialGalaxy: Galaxy = {
    stars: [
        { x: 100, y: 75, id: STAR_ID.Arcturus, name: 'Arcturus', factionId: FACTION_ID.Magrathian },
        { x: 30, y: 45, id: STAR_ID.Kunitio, name: 'Kunitio' },
        { x: 130, y: 35, id: STAR_ID.Junke, name: 'Junke', factionId: FACTION_ID.Martian, shipDesignToConstruct: 0 },
        { x: 120, y: 45, id: STAR_ID.Maddow, name: 'Maddow' },
        { x: 60, y: 25, id: STAR_ID.Zorblax, name: 'Zorblax', factionId: FACTION_ID.Zorblaxian, shipDesignToConstruct: 1, shipConstructionProgress: 8 },
        { x: 20, y: 20, id: STAR_ID.Sol, name: 'Sol', factionId: FACTION_ID.Zorblaxian },
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
        destinationStarId: STAR_ID.Arcturus,
        factionId: FACTION_ID.Martian,
        ships: baseShips(),
    },
    {
        id: nextIdFor('fleet'),
        orbitingStarId: STAR_ID.Arcturus,
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
        destinationStarId: STAR_ID.Junke,
        factionId: FACTION_ID.Zorblaxian,
        ships: baseShips(),
    },
    {
        id: nextIdFor('fleet'),
        orbitingStarId: STAR_ID.Arcturus,
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
        orbitingStarId: STAR_ID.Sol,
        destinationStarId: undefined,
        location: {
            x: 0,
            y: 0,
        },
        factionId: FACTION_ID.Zorblaxian,
        ships: [...baseShips(), { designId: 1, damage: 1 }, ...baseShips()],
    },
    {
        id: nextIdFor('fleet'),
        orbitingStarId: STAR_ID.Sol,
        destinationStarId: undefined,
        location: {
            x: 0,
            y: 0,
        },
        factionId: FACTION_ID.Zorblaxian,
        ships: [...baseShips(), ...baseShips()],
    },
    {
        id: nextIdFor('fleet'),
        orbitingStarId: STAR_ID.Kunitio,
        location: {
            x: 0, y: 0
        },
        factionId: FACTION_ID.Zorblaxian,
        ships: [{
            designId: 1, damage: 0
        }]
    },
]

export const initalState: GameState = {
    turnNumber: 1,
    activeFactionId: initialFactions[0].id,
    galaxy: initialGalaxy,
    fleets: initialFleets,
    factions: initialFactions,
    starsWhereBattlesFoughtAlready: [],
    reports: [
        { reportType: 'message', turnNumber: 1, message: 'Game started' }
    ],
}
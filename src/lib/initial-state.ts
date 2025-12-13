import { createBalancedColonyBudget, createBudgetWithAllIn } from "./colony-budget";
import type { Faction, Fleet, Galaxy, GameState, Ship, ShipDesign } from "./model";


const baseShips = (): Ship[] => [{
    designId: 0,
    damage: 0
}];

const baseDesigns = (): ShipDesign[] => {
    return [
        {
            id: 0,
            name: 'scout',
            atk: 1,
            specials: {},
            pattern: 'small',
        },
        {
            id: 1,
            name: 'colony ship',
            atk: 0,
            specials: {
                colonise: true
            },
            pattern: 'big',
        },
        {
            id: 2,
            name: 'bomber',
            atk: 1,
            specials: {
                bomb: true
            },
            pattern: 'medium'
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


const factionDefaults: Omit<Faction, 'name' | 'id' | 'color'> = {
    shipDesigns: [...baseDesigns()],
    tech: {},
    playerType: 'CPU',
    researchPoints: 0,
}

const initialFactions: [Faction, ...Faction[]] = [
    {
        ...factionDefaults,
        playerType: 'LOCAL',
        id: FACTION_ID.Zorblaxian, name: 'Zorblaxian', color: 'lime',
        reasearchGoal: 'solarSails',
        tech: {}
    },
    { ...factionDefaults, id: FACTION_ID.Magrathian, name: 'Magrathian', color: 'crimson' },
    { ...factionDefaults, id: FACTION_ID.Martian, name: 'Martian', color: 'pink', },
    { ...factionDefaults, id: FACTION_ID.Uraninian, name: 'Uraninian', color: 'skyblue' },
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
        { x: 100, y: 75, id: STAR_ID.Arcturus, name: 'Arcturus', factionId: FACTION_ID.Magrathian, population: 2, factories: 0 },
        { x: 30, y: 45, id: STAR_ID.Kunitio, name: 'Kunitio', population: 0, factories: 0 },
        {
            x: 130, y: 35, id: STAR_ID.Junke, name: 'Junke', factionId: FACTION_ID.Martian, shipDesignToConstruct: 0, population: 3.2, factories: 5,
            budget: createBudgetWithAllIn('research')
        },
        { x: 120, y: 45, id: STAR_ID.Maddow, name: 'Maddow', population: 0, factories: 0 },
        {
            x: 60, y: 25, id: STAR_ID.Zorblax, name: 'Zorblax',
            factionId: FACTION_ID.Zorblaxian, population: 3.7,
            shipDesignToConstruct: 1, shipConstructionProgress: 8, factories: 0,
            budget: createBalancedColonyBudget()
        },
        {
            x: 20, y: 20, id: STAR_ID.Sol, name: 'Sol',
            factionId: FACTION_ID.Zorblaxian, population: 1.1,
            shipDesignToConstruct: 0, shipConstructionProgress: 0, factories: 0,
            budget: createBudgetWithAllIn('industry')
        },
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
    // {
    //     id: nextIdFor('fleet'),
    //     orbitingStarId: STAR_ID.Arcturus,
    //     destinationStarId: undefined,
    //     location: {
    //         x: 10,
    //         y: 15
    //     },
    //     factionId: FACTION_ID.Zorblaxian,
    //     ships: [
    //         { designId: 2, damage: 0 },
    //         { designId: 2, damage: 1 },
    //     ],
    // },
    {
        id: nextIdFor('fleet'),
        orbitingStarId: STAR_ID.Arcturus,
        destinationStarId: undefined,
        location: {
            x: 10,
            y: 15
        },
        factionId: FACTION_ID.Magrathian,
        ships: [
            { designId: 0, damage: 0 },
        ],
    },
    // {
    //     id: nextIdFor('fleet'),
    //     location: {
    //         x: 120,
    //         y: 30
    //     },
    //     destinationStarId: STAR_ID.Junke,
    //     factionId: FACTION_ID.Zorblaxian,
    //     ships: baseShips(),
    // },
    {
        id: nextIdFor('fleet'),
        orbitingStarId: STAR_ID.Zorblax,
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
        ships: [
            { designId: 1, damage: 0 },
            { designId: 1, damage: 0 },
        ]
    },
    // {
    //     id: nextIdFor('fleet'),
    //     orbitingStarId: STAR_ID.Junke,
    //     factionId: FACTION_ID.Zorblaxian,
    //     location: { x: 0, y: 0 },
    //     ships: [
    //         { designId: 2, damage: 0 }
    //     ]
    // }
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
    techToAnnounce: [],
    subProgram: {
        type: 'ship-designer'
    }
    // dialog: {
    //     role: 'pick-tech'
    // }
}
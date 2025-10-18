import { GameStateContext } from '../context/gameStateContext'
import { useGameStateReducer } from '../hooks/useGameStateReducer'
import type { Faction, Fleet, Galaxy } from '../lib/model'
import { FocusWindow } from './FocusWindow'
import { GalaxyMap } from './GalaxyMap'


const initialGalaxy: Galaxy = {
    stars: [
        { x: 10, y: 15, id: 1, name: 'Arcturus' },
        { x: 30, y: 45, id: 2, name: 'Kunitio' },
        { x: 130, y: 35, id: 3, name: 'Junke' },
        { x: 120, y: 45, id: 4, name: 'Maddow' },
    ],
    width: 150,
    height: 100,
}

const initialFleets: Fleet[] = [
    {
        id: 0,
        location: {
            x: 50,
            y: 50
        },
        destinationStarId: 3,
        factionId: 0
    },
    {
        id: 1,
        orbitingStarId: 1,
        destinationStarId: undefined,
        location: {
            x: 10,
            y: 15
        },
        factionId: 0
    },
]

const initialFactions: Faction[] = [
    { id: 0, name: 'Zorblaxian' },
    { id: 1, name: 'Magrathian' },
]

export const GameContainer = () => {
    const [gameState, dispatch] = useGameStateReducer({
        galaxy: initialGalaxy,
        fleets: initialFleets,
        factions: initialFactions,
    })

    return (
        <GameStateContext.Provider value={{ gameState, dispatch }}>
            <h2>game</h2>
            <div style={{
                display: 'flex'
            }}>
                <GalaxyMap scale={4} />
                <FocusWindow />
            </div>
        </GameStateContext.Provider>
    )
}


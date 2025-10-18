import { GameStateContext } from '../context/gameStateContext'
import { useGameStateReducer } from '../hooks/useGameStateReducer'
import type { Faction, Fleet, Galaxy } from '../lib/model'
import { FocusWindow } from './FocusWindow'
import { GalaxyMap } from './GalaxyMap'


const initialGalaxy: Galaxy = {
    stars: [
        { x: 100, y: 75, id: 1, name: 'Arcturus', factionId: 1 },
        { x: 30, y: 45, id: 2, name: 'Kunitio' },
        { x: 130, y: 35, id: 3, name: 'Junke' },
        { x: 120, y: 45, id: 4, name: 'Maddow' },
        { x: 60, y: 25, id: 5, name: 'Zorblax', factionId: 0 },
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
        factionId: 1
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
    {
        id: 2,
        location: {
            x: 80,
            y: 20
        },
        destinationStarId: 3,
        factionId: 0
    },
]

const initialFactions: Faction[] = [
    { id: 0, name: 'Zorblaxian', color: 'lime' },
    { id: 1, name: 'Magrathian', color: 'crimson' },
]

export const GameContainer = () => {
    const [gameState, dispatch] = useGameStateReducer({
        turnNumber: 1,
        galaxy: initialGalaxy,
        fleets: initialFleets,
        factions: initialFactions,
    })

    return (
        <GameStateContext.Provider value={{ gameState, dispatch }}>
            <h2>game: turn {gameState.turnNumber}</h2>
            <div style={{
                display: 'flex'
            }}>
                <GalaxyMap scale={4} />
                <FocusWindow />
            </div>
            <button onClick={() => dispatch({ type: 'next-turn' })}>next turn</button>
        </GameStateContext.Provider>
    )
}


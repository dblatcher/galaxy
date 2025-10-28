import { useEffect } from 'react'
import { GameStateContext } from '../context/gameStateContext'
import { useGameStateReducer } from '../hooks/useGameStateReducer'
import type { Faction, Fleet, Galaxy } from '../lib/model'
import { findById } from '../lib/util'
import { FocusWindow } from './FocusWindow'
import { GalaxyMap } from './GalaxyMap'
import { BattleListings } from './BattleListings'
import { TurnEndControls } from './TurnEndControls'


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

const initialFleets: Fleet[] = [
    {
        id: 0,
        location: {
            x: 50,
            y: 50
        },
        destinationStarId: 1,
        factionId: 2
    },
    {
        id: 1,
        orbitingStarId: 1,
        destinationStarId: undefined,
        location: {
            x: 10,
            y: 15
        },
        factionId: 3
    },
    {
        id: 2,
        location: {
            x: 120,
            y: 30
        },
        destinationStarId: 3,
        factionId: 0
    },
    {
        id: 3,
        orbitingStarId: 1,
        destinationStarId: undefined,
        location: {
            x: 10,
            y: 15
        },
        factionId: 2
    },
]

const initialFactions: [Faction, ...Faction[]] = [
    { id: 0, name: 'Zorblaxian', color: 'lime', playerType: 'LOCAL' },
    { id: 1, name: 'Magrathian', color: 'crimson', playerType: 'CPU' },
    { id: 2, name: 'Martian', color: 'pink', playerType: 'CPU' },
    { id: 3, name: 'Uraninian', color: 'skyblue', playerType: 'CPU' },
]

export const GameContainer = () => {
    const [gameState, dispatch] = useGameStateReducer({
        turnNumber: 1,
        activeFactionId: initialFactions[0].id,
        galaxy: initialGalaxy,
        fleets: initialFleets,
        factions: initialFactions,
    })
    const activeFaction = findById(gameState.activeFactionId, gameState.factions);

    useEffect(() => {
        if (activeFaction?.playerType === 'CPU') {
            dispatch({ type: 'next-turn' })
        }
        if (activeFaction?.playerType === 'REMOTE') {
            console.warn('remote player are not implemented', activeFaction)
        }
    }, [activeFaction])

    return (
        <GameStateContext.Provider value={{ gameState, dispatch }}>
            <h2>game: <span style={{ color: activeFaction?.color }}>{activeFaction?.name}</span> turn {gameState.turnNumber}</h2>
            <div style={{
                display: 'flex'
            }}>
                <BattleListings />
                <GalaxyMap scale={4} />
                <FocusWindow />
            </div>
            <TurnEndControls />
        </GameStateContext.Provider>
    )
}


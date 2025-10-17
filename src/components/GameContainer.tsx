import { GameStateContext } from '../context/gameStateContext'
import { useGameStateReducer } from '../hooks/useGameStateReducer'
import type { Galaxy } from '../lib/model'
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

export const GameContainer = () => {
    const [gameState, dispatch] = useGameStateReducer({
        galaxy: initialGalaxy
    })

    return (
        <GameStateContext.Provider value={{ gameState, dispatch }}>
            <div>
                <h2>game</h2>
                <GalaxyMap scale={4} />
            </div>
        </GameStateContext.Provider>
    )
}


import { useEffect } from 'react'
import { GameStateContext } from '../context/gameStateContext'
import { useGameStateReducer } from '../hooks/useGameStateReducer'
import { findById } from '../lib/util'
import { FocusWindow } from './FocusWindow'
import { GalaxyMap } from './GalaxyMap'
import { BattleListings } from './BattleListings'
import { TurnEndControls } from './TurnEndControls'
import { initalState } from '../lib/initial-state'


export const GameContainer = () => {
    const [gameState, dispatch] = useGameStateReducer(initalState)
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
            <main className='game-main'>
                <section className='title-section'>
                    <h2>game: <span style={{ color: activeFaction?.color }}>{activeFaction?.name}</span> turn {gameState.turnNumber}</h2>
                    <TurnEndControls />
                </section>
                <section className='center-section'>
                    <div className='side-panel'>
                        <BattleListings />
                    </div>

                    <div className='map-wrapper'>
                        <GalaxyMap scale={5} />
                    </div>

                    <div className='side-panel'>
                        <FocusWindow />
                    </div>
                </section>
            </main>
        </GameStateContext.Provider>
    )
}


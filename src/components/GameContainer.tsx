import { useEffect } from 'react'
import { GameStateContext } from '../context/gameStateContext'
import { useGameStateReducer } from '../hooks/useGameStateReducer'
import { initalState } from '../lib/initial-state'
import { findById } from '../lib/util'
import { BattleApp } from './battle/BattleApp'
import { GalaticView } from './galactic/GalaticView'


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
            {gameState.subProgram?.type === 'battle' && (
                <BattleApp params={gameState.subProgram} />
            )}
            {!gameState.subProgram && (
                <GalaticView />
            )}
        </GameStateContext.Provider>
    )
}


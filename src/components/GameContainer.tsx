import { useEffect } from 'react'
import { BattleApp } from '../battle-app/BattleApp'
import { DesignApp } from '../designer-app/DesignApp'
import { initalState } from '../main-state/initial-state'
import { findById } from '../lib/util'
import { GameStateContext } from '../main-state/gameStateContext'
import { useGameStateReducer } from '../main-state/useGameStateReducer'
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
            {gameState.subProgram?.type==='ship-designer' && (
                <DesignApp />
            )}
            {!gameState.subProgram && (
                <GalaticView />
            )}
        </GameStateContext.Provider>
    )
}


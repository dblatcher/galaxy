import { useGameStateContext } from '../../hooks/useGameStateContext'
import { FocusWindow } from './FocusWindow'
import { GalaxyMap } from './GalaxyMap'
import { GameFlowButtons } from './GameFlowButtons'
import { Modal } from '../Modal'


export const GalaticView = () => {
    const { gameState, activeFaction } = useGameStateContext()
    return (
        <main className='game-main'>
            <section className='title-section'>
                <h2>game: <span style={{ color: activeFaction?.color }}>{activeFaction?.name}</span> turn {gameState.turnNumber}</h2>
                <GameFlowButtons />
            </section>
            <section className='center-section'>

                <div className='map-wrapper'>
                    <GalaxyMap scale={5} />
                </div>

                <div className='side-panel'>
                    <FocusWindow />
                </div>
            </section>
            <Modal />
        </main>
    )
}


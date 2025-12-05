import { useGameStateContext } from '../../hooks/useGameStateContext'
import { SideMenu } from './SideMenu'
import { GalaxyMap } from './GalaxyMap'
import { GameFlowButtons } from './GameFlowButtons'
import { Modal, NondismissableModal } from '../Modal'
import { FactionName } from '../display-values'
import { PickTechPanel } from '../PickTechPanel'


export const GalaticView = () => {
    const { gameState, activeFaction, showPickTech } = useGameStateContext()
    return (
        <main className='game-main'>
            <section className='title-section'>
                <h2><FactionName faction={activeFaction} /> turn {gameState.turnNumber}</h2>
                <GameFlowButtons />
            </section>
            <section className='center-section'>

                <div className='map-wrapper'>
                    <GalaxyMap scale={5} />
                </div>

                <div className='side-panel'>
                    <SideMenu />
                </div>
            </section>
            <Modal />


            {showPickTech && (
                <NondismissableModal>
                    <PickTechPanel />
                </NondismissableModal>
            )}
        </main>
    )
}


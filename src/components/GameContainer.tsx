import { useGameState } from '../hooks/useGameState'
import type { Galaxy, Line, Star } from '../lib/model'
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

    const [gameState, dispatch] = useGameState({
        galaxy: initialGalaxy
    })
    const { galaxy, startStarId, endStarId } = gameState

    const handleStarClick = (star: Star) => {
        if (star.id === startStarId) {
            dispatch({ type: 'clear-line' })
            return
        }
        if (!startStarId) {
            dispatch({ type: 'pick-start', target: star })
            return
        }
        dispatch({ type: 'pick-destination', target: star })
    }

    const startStar = galaxy.stars.find(star => star.id === startStarId);
    const endStar = galaxy.stars.find(star => star.id === endStarId);
    const line: Line | undefined = startStar && endStar ? { points: [startStar, endStar] } : undefined;

    return (
        <div>
            <h2>game</h2>
            <GalaxyMap
                galaxy={galaxy}
                scale={4}
                handleStarClick={handleStarClick}
                activeStarId={startStarId}
                lines={line ? [line] : []}
            />
        </div>
    )
}


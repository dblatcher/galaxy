import { GalaxyMap } from './GalaxyMap'
import type { Galaxy, Line, Star } from '../lib/model'
import { useState } from 'react'


const galaxy: Galaxy = {
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
    const [startStarId, setStartStarId] = useState<number>()
    const [endStarId, setEndStarId] = useState<number>()
    const handleStarClick = (star: Star) => {
        if (star.id === startStarId) {
            setEndStarId(undefined)
            setStartStarId(undefined)
            return
        }
        if (!startStarId) {
            setStartStarId(star.id)
            return
        }
        setEndStarId(star.id)
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


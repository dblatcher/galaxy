import { getDistance } from "typed-geometry";
import { limitDistance } from "../../lib/util";
import { useAnimationState } from "../animation-context"
import type { BattleAnimation } from "../animation-reducer"


const AnimationPlot = ({ animation }: { animation: BattleAnimation }) => {

    if (animation.currentStep < 0) {
        return null
    }

    switch (animation.type) {
        case 'beam-fire': {
            const { from, to, currentStep, totalSteps } = animation;
            const currentDistance = getDistance(from, to) * (currentStep / totalSteps);
            const currrentEnd = limitDistance(currentDistance, from, to);
            return <g pointerEvents={'none'}>
                <line
                    x1={from.x} y1={from.y}
                    x2={currrentEnd.x} y2={currrentEnd.y}
                    stroke={'lime'}
                />
            </g>
        }
        // PROBLEM - the ship icon disapears from the map when the
        // ship marked as dead in the battleState.
        case "ship-explode": {
            const { at, currentStep, totalSteps } = animation
            return <g pointerEvents={'none'}>
                <circle cx={at.x} cy={at.y} stroke="lime" r={10 * (currentStep / totalSteps)} />
            </g>
        }
        case "show-damage": {
            const { at, currentStep, totalSteps, value } = animation
            const shift = Math.floor(25 * (currentStep / totalSteps));
            const opacity = (Math.min(1, 1.4 - (currentStep / totalSteps))).toFixed(2);
            return <g pointerEvents={'none'}>
                <text style={{opacity}} fontSize={8} x={at.x} y={at.y - shift} stroke="lime" >{value}</text>
            </g>
        }
        default:
            return null
    }

}

export const AnimationPlotter = () => {
    const { animationState: { animations } } = useAnimationState()

    return animations.map((animation, index) =>
        <AnimationPlot animation={animation} key={index} />
    )
}
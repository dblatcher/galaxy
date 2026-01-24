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
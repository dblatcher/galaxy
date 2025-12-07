import { useGameStateContext } from "../../hooks/useGameStateContext"
import { ALL_TECHS, type Tech, type TechId } from "../../lib/tech-list"
import { FactionName } from "../display-values"
import { ModalLayout } from "../ModalLayout"
import { ProgressBar } from "../ProgressBar"



export const TechPanel = () => {
    const { activeFaction } = useGameStateContext()

    const techsKnown: Tech[] = Object.entries(activeFaction.tech).flatMap(([techId, has]) => {
        if (!has) {
            return []
        }
        return ALL_TECHS[techId as TechId]
    })

    const researchGoal: Tech | undefined = activeFaction.reasearchGoal && ALL_TECHS[activeFaction.reasearchGoal];

    return (
        <ModalLayout title={'Technology'}>
            <FactionName faction={activeFaction} after=" Tech" />
            <p>Researching: {researchGoal?.name ?? '[NONE]'}</p>
            <ProgressBar precision={2}
                showValues
                title="research"
                value={activeFaction.researchPoints}
                max={researchGoal?.cost ?? 0} />
            <p>Known Tech</p>
            <ul>
                {techsKnown.map(tech => (
                    <li key={tech.name}>{tech.name}</li>
                ))}
            </ul>
        </ModalLayout>
    )
}
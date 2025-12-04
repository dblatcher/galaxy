import { useGameStateContext } from "../hooks/useGameStateContext"
import { ALL_TECHS, type Tech, type TechId } from "../lib/tech-list"
import { FactionName } from "./display-values"
import { ModalLayout } from "./ModalLayout"



export const TechPanel = () => {
    const { activeFaction } = useGameStateContext()

    const techsKnown: Tech[] = Object.entries(activeFaction.tech).flatMap(([techId, has]) => {
        if (!has) {
            return []
        }
        return ALL_TECHS[techId as TechId]
    })

    return (
        <ModalLayout title={'reports'}>
            <FactionName faction={activeFaction} after=" Tech" />
            <p>points {activeFaction.researchPoints}</p>
            <ul>
                {techsKnown.map(tech => (
                    <li key={tech.name}>{tech.name}</li>
                ))}
            </ul>
        </ModalLayout>
    )
}
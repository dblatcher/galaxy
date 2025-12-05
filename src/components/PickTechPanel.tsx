import { useGameStateContext } from "../hooks/useGameStateContext"
import { ALL_TECHS, techIds, type Tech, type TechId } from "../lib/tech-list"
import { FactionName } from "./display-values"
import { ModalLayout } from "./ModalLayout"



export const PickTechPanel = () => {
    const { activeFaction, dispatch } = useGameStateContext()
    const techsIdsKnown: TechId[] = Object.entries(activeFaction.tech).flatMap(([techId, has]) => {
        if (!has) {
            return []
        }
        return techId as TechId
    })
    const techsKnown: Tech[] = techsIdsKnown.map(id => ALL_TECHS[id]);


    const availableTechGoals: TechId[] = techIds.filter(techId => {
        if (techsIdsKnown.includes(techId)) {
            return false
        }
        const tech = ALL_TECHS[techId];
        return tech.prerequisites.every(prereqId => techsIdsKnown.includes(prereqId as TechId))
    })

    return (
        <ModalLayout title={'Pick research goal'} cannotClose>
            <FactionName faction={activeFaction} after=" Tech" />

            <p>Choose a technology to research</p>
            <ul>
                {availableTechGoals.map(techId => (
                    <li key={techId}>
                        <button onClick={() => dispatch({
                            type: 'faction:pick-tech-goal',
                            techId,
                            factionId: activeFaction.id,
                        })}>
                            {ALL_TECHS[techId].name} ({ALL_TECHS[techId].cost} points)
                        </button>
                    </li>
                ))}
            </ul>

            <p>Known Tech</p>
            <ul>
                {techsKnown.map(tech => (
                    <li key={tech.name}>{tech.name}</li>
                ))}
            </ul>
        </ModalLayout>
    )
}
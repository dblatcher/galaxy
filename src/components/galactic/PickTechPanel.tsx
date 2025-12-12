import { useGameStateContext } from "../../hooks/useGameStateContext"
import { getAvailableResearchGoals, getKnownTechIds } from "../../lib/tech-checks"
import { ALL_TECHS, type Tech } from "../../data/tech-list"
import { FactionName } from "../display-values"
import { ModalLayout } from "../ModalLayout"



export const PickTechPanel = () => {
    const { activeFaction, dispatch } = useGameStateContext()
    const techsIdsKnown = getKnownTechIds(activeFaction)
    const techsKnown: Tech[] = techsIdsKnown.map(id => ALL_TECHS[id]);
    const availableTechGoals = getAvailableResearchGoals(activeFaction)

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
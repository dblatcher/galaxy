import { getTech } from "../../data/tech-list"
import { useGameStateContext } from "../../hooks/useGameStateContext"
import { getAvailableResearchGoals, getKnownTechIds } from "../../lib/tech-checks"
import { FactionName } from "../display-values"
import { ModalLayout } from "../ModalLayout"



export const PickTechPanel = () => {
    const { activeFaction, dispatch } = useGameStateContext()
    const techsIdsKnown = getKnownTechIds(activeFaction)
    const techsKnown = techsIdsKnown.map(getTech);
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
                            {getTech(techId).name} ({getTech(techId).cost} points)
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
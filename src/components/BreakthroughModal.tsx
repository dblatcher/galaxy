import { useGameStateContext } from "../hooks/useGameStateContext"
import { ALL_TECHS, type TechId } from "../lib/tech-list"
import { FactionName } from "./display-values"
import { DismissableModal } from "./Modal"
import { ModalLayout } from "./ModalLayout"



export const BreakthroughModal = ({ techId }: { techId: TechId }) => {
    const { activeFaction, dispatch } = useGameStateContext()

    const tech = ALL_TECHS[techId]

    const dismiss = () => dispatch({
        type: 'faction:clear-breakthrough-announcement',
        techId,
        factionId: activeFaction.id,
    })

    return (
        <DismissableModal onClose={dismiss}>
            <ModalLayout title={'Breakthough'} customDismiss={dismiss}>
                <p>
                    <FactionName faction={activeFaction} /> discover: {tech.name}
                </p>
                <button onClick={dismiss}>ok</button>
            </ModalLayout>
        </DismissableModal>
    )
}
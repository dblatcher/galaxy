import { getTech, type TechId } from "../../data/tech-list"
import { useGameStateContext } from "../../hooks/useGameStateContext"
import { FactionName } from "../display-values"
import { DismissableModal } from "../Modal"
import { ModalLayout } from "../ModalLayout"



export const BreakthroughModal = ({ techId }: { techId: TechId }) => {
    const { activeFaction, dispatch } = useGameStateContext()

    const tech = getTech(techId)

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
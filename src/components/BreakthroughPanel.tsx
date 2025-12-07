import { useGameStateContext } from "../hooks/useGameStateContext"
import { ALL_TECHS, type TechId } from "../lib/tech-list"
import { FactionName } from "./display-values"
import { ModalLayout } from "./ModalLayout"



export const BreakthroughPanel = ({ techId }: { techId: TechId }) => {
    const { activeFaction, dispatch } = useGameStateContext()

    const tech = ALL_TECHS[techId]

    return (
        <ModalLayout title={'Breakthough'} cannotClose>

            <p>
                <FactionName faction={activeFaction} /> discover: {tech.name}
            </p>


            <button onClick={() => dispatch({
                type: 'faction:clear-breakthrough-announcement',
                techId,
                factionId: activeFaction.id,
            })}>ok</button>

        </ModalLayout>
    )
}
import type { ReactEventHandler } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import "./modal.css"
import { FleetsControl } from "./FleetsControl"
import { BattleControl } from "./BattlesControl"
import { ReportsPanel } from "./ReportsPanel"
import { TechPanel } from "./TechPanel"


export const Modal = () => {
    const { dispatch, gameState: { dialog } } = useGameStateContext()
    const handleClose: ReactEventHandler<HTMLDialogElement> = () => {
        dispatch({ type: 'close-dialog' })
    }

    return (
        <dialog className="game-modal"
            onClose={handleClose}
            open={!!dialog}
            closedby='any'>
            {dialog?.role === 'fleets' && <FleetsControl />}
            {dialog?.role === 'battles' && <BattleControl />}
            {dialog?.role=== 'reports' && <ReportsPanel />}
            {dialog?.role=== 'tech' && <TechPanel />}
        </dialog>
    )
}
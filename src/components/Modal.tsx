import type { ReactEventHandler } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"
import "./modal.css"
import { FleetsControl } from "./FleetsControl"


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
        </dialog>
    )
}
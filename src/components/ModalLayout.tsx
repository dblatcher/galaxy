import type { ReactNode } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"

interface Props {
    title: ReactNode
    children: ReactNode
    cannotClose?: boolean
    customDismiss?: { (): void }
}

export const ModalLayout = ({ title, children, cannotClose, customDismiss }: Props) => {
    const { dispatch } = useGameStateContext()
    const dismiss = customDismiss ?? (() => dispatch({ type: 'close-dialog' }));
    return (
        <aside>
            <header>
                {title}
                {!cannotClose && (
                    <button onClick={dismiss}>close</button>
                )}
            </header>
            <section>
                {children}
            </section>
        </aside>
    )
}
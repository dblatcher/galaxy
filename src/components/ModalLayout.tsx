import type { ReactNode } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"

interface Props {
    title: ReactNode
    children: ReactNode
    cannotClose?: boolean
}

export const ModalLayout = ({ title, children, cannotClose }: Props) => {
    const { dispatch } = useGameStateContext()
    return (
        <aside>
            <header>
                {title}
                {!cannotClose && (
                    <button onClick={() => dispatch({ type: 'close-dialog' })}>close</button>
                )}
            </header>
            <section>
                {children}
            </section>
        </aside>
    )
}
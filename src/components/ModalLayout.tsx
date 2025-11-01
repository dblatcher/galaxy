import type { ReactNode } from "react"
import { useGameStateContext } from "../hooks/useGameStateContext"

interface Props {
    title: ReactNode
    children: ReactNode
}

export const ModalLayout = ({ title, children }: Props) => {
    const { dispatch } = useGameStateContext()
    return (
        <aside>
            <header>
                {title}
                <button onClick={() => dispatch({ type: 'close-dialog' })}>close</button>
            </header>
            <section>
                {children}
            </section>
        </aside>
    )
}
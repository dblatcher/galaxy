import { type CSSProperties, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    buttons?: ReactNode;
}

const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 4
}

export const SubHeading = ({ children, buttons }: Props) => {

    return <header style={style}>
        <h3>{children}</h3>
        {buttons}
    </header>
}
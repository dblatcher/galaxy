import { type CSSProperties, type ReactNode } from "react";

interface Props {
    children?: ReactNode
    checked?: boolean
    setChecked?: { (checked: boolean): void }
}

const containerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    borderRadius: 4,
    padding: 1,
    borderWidth: 1,
    borderColor: 'white',
    boxSizing: 'border-box',
}


export const ToggleableBox = ({ children, checked, setChecked }: Props) => {


    return <label style={{
        ...containerStyle,
        background: checked ? 'black' : undefined,
        borderStyle: checked ? 'solid' : 'dashed',
        cursor: 'pointer',
    }}>
        <input type="checkbox"
            style={{ visibility: 'hidden', position: 'absolute' }}
            checked={!!checked}
            onChange={
                ({ target: { checked } }) => setChecked?.(checked)}
        />
        {children}
    </label>

}



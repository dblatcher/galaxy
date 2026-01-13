import { type CSSProperties, type ReactNode } from "react";

interface Props {
    children?: ReactNode
    checked?: boolean
    setChecked?: { (checked: boolean): void }
    disabled?: boolean
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


export const ToggleableBox = ({ children, checked, setChecked, disabled }: Props) => {

    return <label style={{
        ...containerStyle,
        background: checked ? 'black' : undefined,
        borderStyle: checked ? 'solid' : 'dashed',
        cursor: 'pointer',
    }}>
        <input type="checkbox"
            disabled={disabled}
            style={{ visibility: 'hidden', position: 'absolute' }}
            checked={!!checked}
            onChange={disabled
                ? undefined
                : ({ target: { checked } }) => setChecked?.(checked)
            }
        />
        {children}
    </label>

}



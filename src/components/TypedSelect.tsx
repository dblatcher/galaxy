
interface Props<Id extends string> {
    value: Id | undefined
    setValue: { (value: Id): void }
    unset?: { (): void }
    optionIds: Id[]
    getName: { (id: Id): string }
    label?: string
}

const UNDEF_TOKEN = "-_-_-"

export const TypedSelect = <Id extends string>({ value, setValue, optionIds, getName, label, unset }: Props<Id>) => {

    const selectControl = <select value={value} onChange={({ target }) => {
        const newValue = optionIds.includes(target.value as Id) ? target.value as Id : undefined;
        if (newValue) {
            setValue(newValue)
        } else {
            unset?.()
        }
    }}>
        {!!unset &&
            <option value={UNDEF_TOKEN} >[none]</option>
        }
        {optionIds.map((id) => (
            <option value={id} key={id}>{getName(id)}</option>
        ))}
    </select>

    if (label) {
        return <label>
            <span>{label}</span>
            {selectControl}
        </label>
    }

    return selectControl
}
import { ALL_EQUIPMENT, type EquipmentId } from "../../data/ship-equipment"

interface Props {
    value: EquipmentId | undefined
    setValue: { (value: EquipmentId | undefined): void }
}


export const EquipmentSelect = ({ value, setValue }: Props) => {

    const equipment = value && ALL_EQUIPMENT[value];

    return <div>
        <span>{equipment?.name ?? '[empty]'}</span>
        <select value={value} onChange={({ target }) => setValue(target.value as EquipmentId | undefined)}>
            <option value={undefined} >[none]</option>
            {Object.entries(ALL_EQUIPMENT).map(([id, equipment]) => (
                <option value={id} key={id}>{equipment.name}</option>
            ))}
        </select>
    </div>
}
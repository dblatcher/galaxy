import { ALL_EQUIPMENT, equipmentIds, type EquipmentId } from "../../data/ship-equipment"

interface Props {
    value: EquipmentId | undefined
    setValue: { (value: EquipmentId | undefined): void }
    availableEquipment: EquipmentId[]
}

const UNDEF_TOKEN = "-_-"

export const EquipmentSelect = ({ value, setValue, availableEquipment }: Props) => {

    const equipment = value && ALL_EQUIPMENT[value];

    return <div>
        <span>{equipment?.name ?? '[empty]'}</span>
        <select value={value} onChange={({ target }) => {
            const newValue = equipmentIds.includes(target.value as EquipmentId) ? target.value as EquipmentId : undefined;
            setValue(newValue)
        }}>
            <option value={UNDEF_TOKEN} >[none]</option>
            {availableEquipment.map((id) => (
                <option value={id} key={id}>{ALL_EQUIPMENT[id].name}</option>
            ))}
        </select>
    </div>
}
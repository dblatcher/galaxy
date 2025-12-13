import { ALL_EQUIPMENT, equipmentIds, type EquipmentId } from "../../data/ship-equipment"

interface Props {
    value: EquipmentId | undefined
    setValue: { (value: EquipmentId | undefined): void }
}

const UNDEF_TOKEN = "-_-"

export const EquipmentSelect = ({ value, setValue }: Props) => {

    const equipment = value && ALL_EQUIPMENT[value];

    return <div>
        <span>{equipment?.name ?? '[empty]'}</span>
        <select value={value} onChange={({ target }) => {
            const newValue = equipmentIds.includes(target.value as EquipmentId) ? target.value as EquipmentId : undefined;
            setValue(newValue)
        }}>
            <option value={UNDEF_TOKEN} >[none]</option>
            {Object.entries(ALL_EQUIPMENT).map(([id, equipment]) => (
                <option value={id} key={id}>{equipment.name}</option>
            ))}
        </select>
    </div>
}
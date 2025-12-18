import { ALL_EQUIPMENT, type EquipmentId } from "../../data/ship-equipment"
import { TypedSelect } from "../TypedSelect"

interface Props {
    value: EquipmentId | undefined
    setValue: { (value: EquipmentId | undefined): void }
    availableEquipment: EquipmentId[]
}


export const EquipmentSelect = ({ value, setValue, availableEquipment }: Props) => {

    return <TypedSelect label="equip"
        optionIds={availableEquipment}
        value={value}
        setValue={(id:EquipmentId) => setValue(id)}
        unset={() => setValue(undefined)}
        getName={id => ALL_EQUIPMENT[id].name}
    />
}
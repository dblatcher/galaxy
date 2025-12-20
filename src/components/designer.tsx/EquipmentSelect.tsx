import { getEquipment, getMaybeEquipment, type EquipmentId } from "../../data/ship-equipment"
import { TypedSelect } from "../TypedSelect"

interface Props {
    value: EquipmentId | undefined
    setValue: { (value: EquipmentId | undefined): void }
    availableEquipment: EquipmentId[]
    canUseBigEquipment: boolean
}


export const EquipmentSelect = ({ value, setValue, availableEquipment, canUseBigEquipment }: Props) => {

    const filteredEquipmentIds = canUseBigEquipment ? availableEquipment : availableEquipment.filter(id => !getMaybeEquipment(id)?.isBig)

    return <TypedSelect label="equip"
        optionIds={filteredEquipmentIds}
        value={value}
        setValue={(id:EquipmentId) => setValue(id)}
        unset={() => setValue(undefined)}
        getName={id => getEquipment(id).name}
    />
}
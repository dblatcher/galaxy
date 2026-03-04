import type { Dispatch } from "react";
import type { DesignAction, DesignState } from "./reducer";
import { TypedSelect } from "../components/TypedSelect";
import { EquipmentSelect } from "./EquipmentSelect";
import { getPattern } from "../data/ship-patterns";
import type { Faction } from "../lib/model";
import { getAvailableEquipment, getAvailablePatterns } from "../lib/tech-checks";

interface Props {
    dispatch: Dispatch<DesignAction>;
    design: DesignState['design'];
    faction: Faction;
}

export const DesignForm = ({ dispatch, design, faction }: Props) => {

    const availableEquipment = getAvailableEquipment(faction);
    const availablePatterns = getAvailablePatterns(faction);
    const canUseBigEquipment = getPattern(
        design.pattern
    ).canHaveBigEquipment;

    return <div className="semantic-box">
        <header>Design Ship</header>
        <section className="design-inputs">
            <label>
                <span>name</span>
                <input
                    type="text"
                    value={design.name}
                    placeholder="design name"
                    onChange={({ target }) =>
                        dispatch({ type: "set-name", name: target.value })
                    }
                />
            </label>
            <TypedSelect
                label="size"
                optionIds={availablePatterns}
                value={design.pattern}
                setValue={(pattern) => dispatch({ type: "set-pattern", pattern })}
                getName={(id) => getPattern(id).name}
            />

            <fieldset>
                <legend>equipment</legend>

                {design.slots.map((equipmentInSlot, slotIndex) => (
                    <EquipmentSelect
                        key={slotIndex}
                        canUseBigEquipment={!!canUseBigEquipment}
                        availableEquipment={availableEquipment}
                        value={equipmentInSlot}
                        setValue={(equipment) =>
                            dispatch({ type: "fill-slot", slotIndex, equipment })
                        }
                    />
                ))}
            </fieldset>
        </section>
    </div>
}
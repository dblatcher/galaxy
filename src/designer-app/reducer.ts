import type { Reducer } from "react";
import { getMaybeEquipment, type EquipmentId } from "../data/ship-equipment";
import { getPattern, type PatternId } from "../data/ship-patterns";
import type { ShipDesign } from "../lib/model";

export type DesignAction =
    | { type: "set-name"; name: string }
    | { type: "set-pattern"; pattern: PatternId }
    | {
        type: "fill-slot";
        slotIndex: number;
        equipment: EquipmentId | undefined;
    }
    | {
        type: "copy-design";
        design: ShipDesign;
        usedNames: string[];
    };

export type DesignState = {
    design: Omit<ShipDesign, "id">;
};

const determineCloneName = (clonedName: string, usedNames: string[]): string => {
    // to do - naming convention
    return `${clonedName}-#${usedNames.length}`
}

export const reduceDesignAction: Reducer<DesignState, DesignAction> = (prevState: DesignState, action: DesignAction) => {
    const state = structuredClone(prevState);
    switch (action.type) {
        case "set-name": {
            state.design.name = action.name;
            return state;
        }
        case "set-pattern": {
            const { slots: oldSlots } = state.design;
            state.design.pattern = action.pattern;
            const newPattern = getPattern(action.pattern);

            const newSlots: ShipDesign["slots"] = new Array(newPattern.slotCount);
            newSlots.fill(undefined);
            newSlots.splice(
                0,
                oldSlots.length,
                ...oldSlots.slice(0, newSlots.length)
            );

            if (!newPattern.canHaveBigEquipment) {
                for (let i = 0; i < newSlots.length; i++) {
                    const equip = getMaybeEquipment(newSlots[i]);
                    if (equip?.isBig) {
                        newSlots[i] = undefined;
                    }
                }
            }
            state.design.slots = newSlots;
            return state;
        }
        case "fill-slot": {
            state.design.slots[action.slotIndex] = action.equipment;
            return state;
        }
        case "copy-design": {
            const clone = structuredClone(action.design)
            clone.name = determineCloneName(action.design.name, action.usedNames)
            return {
                ...state,
                design: clone
            }
        }
    }
}
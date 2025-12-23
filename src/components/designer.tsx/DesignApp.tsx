import { useReducer } from "react";
import { getMaybeEquipment, type EquipmentId } from "../../data/ship-equipment";
import { getPattern, type PatternId } from "../../data/ship-patterns";
import { useGameStateContext } from "../../hooks/useGameStateContext";
import type { ShipDesign } from "../../lib/model";
import {
  getAvailableEquipment,
  getAvailablePatterns,
} from "../../lib/tech-checks";
import { nextId } from "../../lib/util";
import { TypedSelect } from "../TypedSelect";
import { DesignStats } from "./DesignStats";
import { EquipmentSelect } from "./EquipmentSelect";
import "./designApp.css";

type DesignAction =
  | { type: "set-name"; name: string }
  | { type: "set-pattern"; pattern: PatternId }
  | {
      type: "fill-slot";
      slotIndex: number;
      equipment: EquipmentId | undefined;
    };

type DesignState = {
  design: Omit<ShipDesign, "id">;
};

export const DesignApp = () => {
  const { dispatch: dispatchGameState, activeFaction } = useGameStateContext();

  const [state, dispatch] = useReducer(
    (prevState: DesignState, action: DesignAction) => {
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
      }
    },
    {
      design: {
        name: "",
        pattern: "small",
        slots: [undefined],
      },
    }
  );

  const getDesign = (): ShipDesign | undefined => {
    const { name } = state.design;
    if (!name || activeFaction.shipDesigns.some((ship) => ship.name === name)) {
      return undefined;
    }
    return {
      id: nextId(activeFaction.shipDesigns),
      ...state.design,
    };
  };

  const maybeDesign: ShipDesign | undefined = getDesign();

  const conclude = () => {
    dispatchGameState({
      type: "designer:result",
      factionId: activeFaction.id,
      shipDesign: maybeDesign,
    });
  };

  const cancel = () => {
    dispatchGameState({
      type: "designer:result",
      factionId: activeFaction.id,
    });
  };

  const availableEquipment = getAvailableEquipment(activeFaction);
  const availablePatterns = getAvailablePatterns(activeFaction);
  const canUseBigEquipment = getPattern(
    state.design.pattern
  ).canHaveBigEquipment;

  return (
    <main className="design-app">
      <header>
        <h2>Designer</h2>
      </header>

      <div className="row">
        <div className="design-inputs">
          <label>
            <span>name</span>
            <input
              type="text"
              value={state.design.name}
              placeholder="design name"
              onChange={({ target }) =>
                dispatch({ type: "set-name", name: target.value })
              }
            />
          </label>
          <TypedSelect
            label="size"
            optionIds={availablePatterns}
            value={state.design.pattern}
            setValue={(pattern) => dispatch({ type: "set-pattern", pattern })}
            getName={(id) => getPattern(id).name}
          />

          <fieldset>
            <legend>equipment</legend>

            {state.design.slots.map((equipmentInSlot, slotIndex) => (
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
          <div>
            <button disabled={!maybeDesign} onClick={conclude}>
              conclude
            </button>
            <button onClick={cancel}>cancel</button>
          </div>
        </div>
        <DesignStats design={state.design} faction={activeFaction} />
      </div>
    </main>
  );
};

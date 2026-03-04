import { useReducer } from "react";
import { TypedSelect } from "../components/TypedSelect";
import { getPattern } from "../data/ship-patterns";
import type { ShipDesign } from "../lib/model";
import { getAvailableEquipment, getAvailablePatterns } from "../lib/tech-checks";
import { nextId } from "../lib/util";
import { useGameStateContext } from "../main-state/useGameStateContext";
import "./designApp.css";
import { DesignStats } from "./DesignStats";
import { EquipmentSelect } from "./EquipmentSelect";
import { ExistingDesignList } from "./ExistingDesignList";
import { reduceDesignAction } from "./reducer";



export const DesignApp = () => {
  const { dispatch: dispatchGameState, activeFaction } = useGameStateContext();

  const [state, dispatch] = useReducer(
    reduceDesignAction,
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
      <div className="row">
        <ExistingDesignList
          faction={activeFaction}
          copyDesign={(design) => dispatch({
            type: 'copy-design',
            design,
            usedNames: activeFaction.shipDesigns.map(d => d.name)
          })} />
      </div>
    </main>
  );
};

import { useReducer } from "react";
import type { ShipDesign } from "../lib/model";
import { findById, nextId } from "../lib/util";
import { useGameStateContext } from "../main-state/useGameStateContext";
import "./designApp.css";
import { DesignForm } from "./DesignForm";
import { DesignStats } from "./DesignStats";
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
      viewedDesignId: activeFaction.shipDesigns[0]?.id
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



  const viewedDesign = findById(state.viewedDesignId, activeFaction.shipDesigns)
  return (
    <main className="design-app">
      <header>
        <h2>Designer</h2>

      </header>

      <div className="row">
        <DesignForm design={state.design} faction={activeFaction} dispatch={dispatch} />
        <DesignStats design={state.design} faction={activeFaction} />
      </div>
      <div className="row">
        <button disabled={!maybeDesign} onClick={conclude}>
          Add new design
        </button>
        <button onClick={cancel}>cancel</button>
      </div>
      <div className="row">
        <ExistingDesignList
          faction={activeFaction}
          copyDesign={(design) => dispatch({
            type: 'copy-design',
            design,
            usedNames: activeFaction.shipDesigns.map(d => d.name)
          })}
          viewDesign={(design) => dispatch({
            type: 'view-design',
            designId: design.id
          })}
        />
        {viewedDesign && (
          <DesignStats design={viewedDesign} faction={activeFaction} />
        )}
      </div>
    </main>
  );
};

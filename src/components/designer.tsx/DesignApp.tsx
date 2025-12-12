import { useReducer } from "react"
import { ALL_PATTERNS, type PatternId } from "../../data/ship-patterns"
import { useGameStateContext } from "../../hooks/useGameStateContext"
import type { ShipDesign } from "../../lib/model"
import { nextId } from "../../lib/util"
import { DesignStats } from "./DesignStats"


type DesignAction =
    { type: 'set-name', name: string } |
    { type: 'set-pattern', pattern: PatternId };

type DesignState = {
    design: Omit<ShipDesign, 'id'>
}

export const DesignApp = () => {
    const { dispatch: dispatchGameState, activeFaction } = useGameStateContext()

    const [state, dispatch] = useReducer((prevState: DesignState, action: DesignAction,) => {

        const state = structuredClone(prevState)

        switch (action.type) {
            case 'set-name': {
                state.design.name = action.name;
                return state
            }
            case "set-pattern": {
                state.design.pattern = action.pattern;
                return state
            }
        }

    }, {
        design: {
            name: '',
            atk: 10,
            pattern: 'small',
            specials: {

            }
        }
    })




    const getDesign = (): ShipDesign | undefined => {
        const { name } = state.design
        if (!name || activeFaction.shipDesigns.some(ship => ship.name === name)) {
            return undefined
        }
        return {
            id: nextId(activeFaction.shipDesigns),
            ...state.design
        }
    }



    const maybeDesign: ShipDesign | undefined = getDesign()

    const conclude = () => {
        dispatchGameState({
            type: 'designer:result',
            factionId: activeFaction.id,
            shipDesign: maybeDesign,
        })
    }

    const cancel = () => {
        dispatchGameState({
            type: 'designer:result',
            factionId: activeFaction.id,
        })
    }

    return (
        <main>
            <p>Designer</p>

            <fieldset>
                <label>
                    name
                    <input type="text"
                        value={state.design.name}
                        placeholder="design name"
                        onChange={({ target }) => dispatch({ type: 'set-name', name: target.value })}
                    />
                </label>
                <label>
                    size
                    <select value={state.design.pattern} onChange={({ target }) => dispatch({ type: 'set-pattern', pattern: target.value as PatternId })}>
                        {Object.entries(ALL_PATTERNS).map(([id, pattern]) => (
                            <option value={id} key={id}>{pattern.name}</option>
                        ))}
                    </select>
                </label>
            </fieldset>

            <DesignStats design={state.design} />


            <button disabled={!maybeDesign} onClick={conclude}>conclude</button>
            <button onClick={cancel}>cancel</button>
        </main>
    )
}
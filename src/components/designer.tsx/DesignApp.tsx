import { useState } from "react"
import { useGameStateContext } from "../../hooks/useGameStateContext"
import { nextId } from "../../lib/util"
import type { ShipDesign } from "../../lib/model"



export const DesignApp = () => {
    const { dispatch, activeFaction } = useGameStateContext()

    const [name, setName] = useState('')
    const [size, setSize] = useState(1)
    const constructionCost = size * 20;
    const hp = size * 3;

    const getDesign = () => {
        if (!name || activeFaction.shipDesigns.some(ship => ship.name===name)) {
            return undefined
        }
        return {
            id: nextId(activeFaction.shipDesigns),
            name,
            constructionCost,
            hp,
            atk: 10,
            specials: {
                colonise: undefined,
                bomb: undefined
            }
        }
    }

    const maybeDesign: ShipDesign | undefined = getDesign()

    const conclude = () => {
        dispatch({
            type: 'designer:result',
            factionId: activeFaction.id,
            shipDesign: maybeDesign,
        })
    }

    const cancel = () => {
        dispatch({
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
                    <input type="text" value={name} placeholder="design name" onChange={({ target }) => setName(target.value)} />
                </label>
                <label>
                    size
                    <select value={size} onChange={({ target }) => setSize(Number(target.value))}>
                        <option value={1}>small</option>
                        <option value={2}>medium</option>
                        <option value={3}>large</option>
                        <option value={4}>huge</option>
                    </select>
                </label>
            </fieldset>

            <article>
                <p>Name: {name}</p>
                <p>hp: {hp}</p>
                <p>constructionCost: {constructionCost}</p>
            </article>



            <button disabled={!maybeDesign} onClick={conclude}>conclude</button>
            <button onClick={cancel}>cancel</button>
        </main>
    )
}
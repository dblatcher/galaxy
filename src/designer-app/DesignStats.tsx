import type { ShipDesign } from "../lib/model"
import { enhanceShipDesign } from "../lib/ship-design-helpers"

interface Props {
    design: Omit<ShipDesign, 'id'>
}

export const DesignStats = ({ design }: Props) => {
    const { name, hp, pattern, constructionCost } = enhanceShipDesign( { ...design, id: -1 })

    return <article style={{
        border: '1px solid white'
    }}>
        <p>Name: {name}</p>
        <p>pattern: {pattern}</p>
        <p>hp: {hp}</p>
        <p>constructionCost: {constructionCost}</p>
    </article>
}
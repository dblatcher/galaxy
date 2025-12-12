import type { ShipDesign } from "../../lib/model"

interface Props {
    design: Omit<ShipDesign, 'id'>
}

export const DesignStats = ({ design }: Props) => {

    const { name, hp, constructionCost,pattern } = design

    return <article style={{
        border: '1px solid white'
    }}>
        <p>Name: {name}</p>
        <p>pattern: {pattern}</p>
        <p>hp: {hp}</p>
        <p>constructionCost: {constructionCost}</p>
    </article>
}
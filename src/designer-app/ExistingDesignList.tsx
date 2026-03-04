import type { Faction, ShipDesign } from "../lib/model"
import { enhanceShipDesign } from "../lib/ship-design-helpers"

interface Props {
    faction: Faction;
    copyDesign: { (design: ShipDesign): void }
}

export const ExistingDesignList = ({ faction, copyDesign }: Props) => {

    const designs = faction.shipDesigns.map(enhanceShipDesign)

    return <div className="semantic-box" style={{ flex: 1 }}>
        <header>{faction.name} designs</header>
        <section>

            <ul>
                {designs.map((design) => (
                    <li key={design.id}>
                        <span>
                            {design.name}
                        </span>
                        <button onClick={() => copyDesign(design)}>copy</button>
                    </li>
                ))}
            </ul>
        </section>
    </div>
}
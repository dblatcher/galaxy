import { useGameStateContext } from "../../hooks/useGameStateContext";
import type { Star } from "../../lib/model";
import { findById } from "../../lib/util";

interface Props {
    star: Star
}

const undefinedToken = "_-_-_"

export const ColonyMenu = ({ star }: Props) => {

    const { gameState: { factions }, dispatch } = useGameStateContext();

    const faction = findById(star.factionId, factions)

    const designs = faction?.shipDesigns ?? [];
    const currentDesign = findById(star.shipDesignToConstruct, designs)

    const handleDesignSelect = (value: string) => {
        const newDesign = findById(Number(value), designs)
        dispatch({ type: 'set-star-construction-design', designId: newDesign?.id, starId: star.id })
    }

    return (
        <section>
            <label>
                Constructing
                <select value={currentDesign?.id ?? undefinedToken} onChange={({ target: { value } }) => handleDesignSelect(value)}>
                    <option value={undefinedToken} >none</option>
                    {designs.map(design => (
                        <option key={design.id} value={design.id}>{design.name}</option>
                    ))}
                </select>
            </label>

            <div>
                Progress {star.shipConstructionProgress ?? 0} / {currentDesign?.constructionCost}
            </div>
        </section>
    )
}
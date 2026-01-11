import { FleetSymbol } from "../components/FleetSymbol"
import { enhanceShipDesign } from "../lib/ship-design-helpers"
import type { BattleState, ShipState } from "./battle-state-reducer"

interface Props {
    scale: number
    battleState: BattleState
}

const mapMargin = 25
const width = 400;
const height = 300


export const BattleMap = ({ scale, battleState }: Props) => {
    const { sides, locations, activeFaction, activeShip } = battleState
    const lookUpShipState = (factionId: number, fleetId: number, shipIndex: number): ShipState | undefined => {
        return locations[factionId]?.[fleetId]?.[shipIndex]
    }


    return (
        <svg viewBox={`${-mapMargin} ${-mapMargin} ${width + 2 * mapMargin} ${height + 2 * mapMargin}`} style={{
            width: width * scale,
            height: height * scale,
            borderColor: 'red',
            borderStyle: 'dotted',
            borderWidth: 1,
            backgroundColor: 'black',
        }}>
            {sides.map(side =>
                side.fleets.map(fleet =>
                    fleet.ships.map((ship, shipIndex) => {
                        const shipState = lookUpShipState(side.faction.id, fleet.id, shipIndex)
                        if (!shipState) {
                            console.error('MISSING location', [side.faction.id, fleet.id, shipIndex], battleState)
                            return null
                        }

                        const design = side.faction.shipDesigns.find(design => design.id == ship.designId);
                        if (!design) {
                            console.error('MISSING DESIGN', ship, side.faction)
                            return null
                        }
                        const { name, hp } = enhanceShipDesign(design)

                        if (ship.damage >= hp) {
                            return null
                        }
                        const isSelected = activeFaction === side.faction.id && activeShip?.fleetId == fleet.id && activeShip.shipIndex === shipIndex
                        const { position } = shipState
                        return <g
                            key={`${side.faction.id}-${fleet.id}-${shipIndex}`}
                            data-side={side.faction.name}
                            data-ship-type={name}>
                            <FleetSymbol color={side.faction.color} location={position} />
                            <text {...position} fontSize={5} fill="white">{name} {isSelected && "*"}</text>
                        </g>
                    })
                )
            )}

        </svg>
    )

}
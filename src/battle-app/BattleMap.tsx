import { FleetSymbol } from "../components/FleetSymbol"
import { enhanceShipDesign } from "../lib/ship-design-helpers"
import type { BattleState, ShipPosition } from "./battle-state-reducer"

interface Props {
    scale: number
    battleState: BattleState
}

const mapMargin = 25

const width = 400;
const height = 300


export const BattleMap = ({ scale, battleState }: Props) => {
    const { sides, locations } = battleState

    const lookUpLocation = (factionId: number, fleetId: number, shipIndex: number): ShipPosition | undefined => {
        return locations[factionId]?.[fleetId]?.[shipIndex]
    }


    return (
        <svg viewBox={`${-mapMargin} ${-mapMargin} ${width + 2 * mapMargin} ${height + 2 * mapMargin}`} style={{
            width: width * scale,
            height: height * scale,
            borderColor: 'red',
            borderStyle: 'dotted',
            borderWidth: 1,
            backgroundColor:'black',
        }}>
            {sides.map(side =>
                side.fleets.map(fleet =>
                    fleet.ships.map((ship, index) => {
                        const shipLocation = lookUpLocation(side.faction.id, fleet.id, index)
                        if (!shipLocation) {
                            console.error('MISSING location', [side.faction.id, fleet.id, index], battleState)
                            return null
                        }

                        const design = side.faction.shipDesigns.find(design => design.id == ship.designId);
                        if (!design) {
                            console.error('MISSING DESIGN', ship, side.faction)
                            return null
                        }
                        const { name } = enhanceShipDesign(design)

                        return <g data-side={side.faction.name} data-ship-type={name}>
                            <FleetSymbol color={side.faction.color} location={shipLocation} />
                            <text x={shipLocation.x} y={shipLocation.y} fontSize={5} fill="white">{name}</text>
                        </g>
                    })
                )
            )}

        </svg>
    )

}
import { getInstance } from "./helpers"
import type { BattleState } from "./model"
import { ShipOnMap } from "./ShipOnMap"

interface Props {
    scale: number
    battleState: BattleState
}

const mapMargin = 25
const width = 400;
const height = 300


export const BattleMap = ({ scale, battleState }: Props) => {
    const { sides, shipStates, activeFaction, activeShip } = battleState

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
                        const shipInstance = getInstance(ship, side.faction, fleet.id, shipIndex, shipStates)
                        if (!shipInstance) {
                            return null
                        }
                        return <ShipOnMap
                            shipInstance={shipInstance}
                            isSelected={activeFaction === side.faction.id && activeShip?.fleetId == fleet.id && activeShip.shipIndex === shipIndex}
                        />
                    })
                )
            )}
        </svg>
    )
}
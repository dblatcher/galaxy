import { useGameStateContext } from "../hooks/useGameStateContext"
import { getDesignMap } from "../lib/fleet-operations"
import type { Report } from "../lib/model"
import { lookUpName, mapOnId, splitArray } from "../lib/util"
import { ModalLayout } from "./ModalLayout"


const ReportDisplay = ({ report }: { report: Report }) => {
    const { gameState: { galaxy, factions } } = useGameStateContext()

    const factionMap = mapOnId(factions);
    const starMap = mapOnId(galaxy.stars);

    switch (report.reportType) {
        case 'battle': {
            return <div>
                <h4>Battle at {lookUpName(report.star, galaxy.stars)}</h4>
                <ul>
                    {report.sides.map((side, index) => {

                        const allShips = side.fleets.flatMap(fleet => fleet.ships);
                        const designMap = getDesignMap(side.faction);
                        const [survivors, losses] = splitArray(allShips, ship => ship.damage < designMap[ship.designId].hp)
                        return <li key={index}>
                            {side.faction.name}
                            <ul>
                                <li>lost {losses.length} ships. </li>
                                <li>{survivors.length} surviving ships</li>
                            </ul>
                        </li>
                    })}
                </ul>
            </div>
        }
        case "message": {
            return <div>
                <h4>Message</h4>
                <div>{report.message}</div>
            </div>
        }
        case "colonyStart":{
            return <div>
                <h4>New colony</h4>
                <div>
                    {factionMap[report.faction]?.name} colony established on {starMap[report.star]?.name}. 
                    They now control {galaxy.stars.filter(s=>s.factionId===report.faction).length} systems.
                </div>
                
            </div>
        }
    }


}


export const ReportsPanel = () => {
    const { gameState: { reports } } = useGameStateContext()
    if (reports.length === 0) {
        return null
    }

    return (
        <ModalLayout title={'reports'}>
            {reports.map((report, index) => (
                <div key={index}>
                    <ReportDisplay report={report} />
                </div>
            ))}
        </ModalLayout>
    )
}
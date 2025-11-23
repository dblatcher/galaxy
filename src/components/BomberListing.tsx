import { useGameStateContext } from "../hooks/useGameStateContext"
import { FactionName } from "./display-values"
import { findFleetsReadyToBomb } from "../lib/fleet-operations"
import { findById } from "../lib/util"
import { FleetBox } from "./FleetBox"
import { ReportDisplay } from "./ReportsPanel"



export const BomberListing = () => {

    const { gameState, activeFaction, } = useGameStateContext()
    const { galaxy, reports, factions } = gameState
    const fleetsReadyToBomb = findFleetsReadyToBomb(gameState, activeFaction)

    const bombingReports = reports.filter(report => report.reportType === 'bombing' && report.bombingFactionId === activeFaction.id)

    return <>
        {(fleetsReadyToBomb.length > 0 || bombingReports.length > 0) && (<>
            <h3>Bombings</h3>
            {fleetsReadyToBomb.map((fleet, index) => {

                const star = findById(fleet.orbitingStarId, galaxy.stars);
                const faction = findById(star?.factionId, factions);

                return <div key={index}>
                    <span>
                        Bomb <FactionName faction={faction} /> colony at {star?.name}
                    </span>

                    <FleetBox fleet={fleet} canOrder />
                </div>
            })}

            {bombingReports.map((report, index) => (
                <ReportDisplay report={report} key={index} />
            ))}
        </>)}
    </>
}

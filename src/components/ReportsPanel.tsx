import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Report } from "../lib/model"
import { lookUpName } from "../lib/util"
import { ModalLayout } from "./ModalLayout"


const ReportDisplay = ({ report }: { report: Report }) => {
    const { gameState: { galaxy, factions } } = useGameStateContext()

    switch (report.reportType) {
        case 'battle': {
            return <div>
                <h4>Battle at {lookUpName(report.star, galaxy.stars)}</h4>
                <ul>
                    {report.sides.map((side, index) => (
                        <li key={index}>
                            {lookUpName(side.faction, factions)}
                        </li>
                    ))}
                </ul>
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
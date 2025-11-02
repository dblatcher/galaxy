import { useGameStateContext } from "../hooks/useGameStateContext"
import type { Report } from "../lib/model"
import { lookUpName } from "../lib/util"


const ReportDisplay = ({ report }: { report: Report }) => {
    const { gameState: { galaxy } } = useGameStateContext()

    return <div>
        <span>Battle at {lookUpName(report.star, galaxy.stars)}</span>
    </div>
}


export const ReportsPanel = () => {

    const { gameState: { reports } } = useGameStateContext()

    if (reports.length === 0) {
        return null
    }

    return (
        <div>
            <h3>Reports</h3>
            {reports.map((report, index) => (
                <div key={index}>
                    <ReportDisplay report={report} />
                </div>
            ))}
        </div>
    )
}
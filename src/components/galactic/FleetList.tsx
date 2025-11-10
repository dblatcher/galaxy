import type { CSSProperties } from "react";
import type { Battle, Fleet } from "../../lib/model";
import { FleetBox } from "../FleetBox";
import { useGameStateContext } from "../../hooks/useGameStateContext";
import { SubHeading } from "../SubHeading";

interface Props {
    title: string;
    list: Fleet[];
    arrangeButton?: boolean;
    canOrder?: boolean;
    pendingBattle?: Battle;
}

const listStyle: CSSProperties = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    textAlign: 'left'
};

const itemStyle: CSSProperties = {
    paddingBottom: 10,
}

export const FleetList = ({ list, title, arrangeButton, canOrder, pendingBattle }: Props) => {

    const { dispatch } = useGameStateContext()

    if (list.length === 0) {
        return null
    }

    const headerButton = arrangeButton
        ? <button
            className="small"
            onClick={() => dispatch({ type: 'open-dialog', dialog: { 'role': 'fleets' } })}
            title="arrange fleets"
        >A</button>
        : undefined

    return <section>
        <SubHeading buttons={headerButton}>{title}</SubHeading>
        <div className="panel-content">
            <ul style={listStyle}>
                {list.map((fleet, index) => (
                    <li key={index} style={itemStyle}>
                        <FleetBox fleet={fleet} canOrder={canOrder} isPendingBattle={!!pendingBattle} />
                    </li>
                ))}
            </ul>
        </div>
    </section>
}
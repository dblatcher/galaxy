import type { CSSProperties } from "react";
import type { Fleet } from "../../lib/model";
import { FleetBox } from "../FleetBox";
import { useGameStateContext } from "../../hooks/useGameStateContext";

interface Props {
    title: string;
    list: Fleet[];
    arrangeButton?: boolean;
    canOrder?: boolean;
}

const listStyle: CSSProperties = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    textAlign: 'left'
};

const itemStyle: CSSProperties = {
    paddingBottom: 10,
    paddingLeft: 3,
    paddingRight: 3
}

export const FleetList = ({ list, title, arrangeButton, canOrder }: Props) => {

    const { dispatch } = useGameStateContext()

    if (list.length === 0) {
        return null
    }

    return <section>
        <h3>{title}</h3>
        <ul style={listStyle}>
            {list.map((fleet, index) => (
                <li key={index} style={itemStyle}>
                    <FleetBox fleet={fleet} canOrder={canOrder} />
                </li>
            ))}
        </ul>
        {arrangeButton && (
            <button onClick={() => dispatch({ type: 'open-dialog', dialog: { 'role': 'fleets' } })}>arrange fleets</button>
        )}
    </section>
}
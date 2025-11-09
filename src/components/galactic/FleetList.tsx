import type { CSSProperties } from "react";
import type { Fleet } from "../../lib/model";
import { FleetCheckButton } from "../FleetCheckButton";
import { useGameStateContext } from "../../hooks/useGameStateContext";

interface Props {
    title: string;
    list: Fleet[];
    arrangeButton?: boolean;
}

const listStyle: CSSProperties = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    textAlign: 'left'
};

const itemStyle: CSSProperties = {
    paddingBottom: 2,
    paddingLeft: 3,
    paddingRight: 3
}

export const FleetList = ({ list, title, arrangeButton }: Props) => {

    const { dispatch } = useGameStateContext()

    if (list.length === 0) {
        return null
    }

    return <section>
        <h3>{title}</h3>
        <ul style={listStyle}>
            {list.map((fleet, index) => (
                <li key={index} style={itemStyle}>
                    <FleetCheckButton fleet={fleet} />
                </li>
            ))}
        </ul>
        {arrangeButton && (
            <button onClick={() => dispatch({ type: 'open-dialog', dialog: { 'role': 'fleets' } })}>arrange fleets</button>
        )}
    </section>
}
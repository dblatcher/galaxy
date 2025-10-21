import type { CSSProperties } from "react";
import type { Fleet } from "../lib/model";
import { FleetCheckButton } from "./FleetCheckButton";

interface Props {
    title: string;
    list: Fleet[];
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

export const FleetList = ({ list, title }: Props) => {

    if (list.length === 0) {
        return null
    }

    return <div>
        <span>{title}</span>
        <ul style={listStyle}>
            {list.map((fleet, index) => (
                <li key={index} style={itemStyle}>
                    <FleetCheckButton fleet={fleet} />
                </li>
            ))}
        </ul>
    </div>
}
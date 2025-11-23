import type { Faction } from "../lib/model"

const formatPopulation = (value = 0) => `${value?.toFixed(2)}m`

export const Population = ({ value }: { value: number }) => <>{formatPopulation(value ?? 0)}</>

export const FactionName = ({ faction, after = '' }: { faction?: Faction, after?: string }) =>
    <span style={{ color: faction?.color }} >{faction?.name ?? "??"}{after}</span>

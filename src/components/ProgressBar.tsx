import "./progress.css"

interface Props {
    title: string;
    value: number;
    max: number;
    showValues?: boolean
    precision?: number
}

export const ProgressBar = ({ title, value, max, showValues, precision = 1 }: Props) => {

    const label = `${title}: ${value}/${max}`

    return <div title={title} className="progress-bar-holder">
        {showValues && (
            <div className="progress-bar-values">{value.toFixed(precision)}/{max}</div>
        )}
        <progress className="progress-bar" aria-label={label} value={value} max={max} />
    </div>
}
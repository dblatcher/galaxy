import "./progress.css"

interface Props {
    title: string;
    value: number;
    max: number;
    showValues?: boolean
}

export const ProgressBar = ({ title, value, max, showValues }: Props) => {

    const label = `${title}: ${value}/${max}`

    return <div title={title} className="progress-bar-holder">
        {showValues && (
            <div className="progress-bar-values">{value}/{max}</div>
        )}
        <progress className="progress-bar" aria-label={label} value={value} max={max} />
    </div>
}
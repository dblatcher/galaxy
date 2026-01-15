import { useBattleState } from "./battle-state-context"

const MODES = ['move', 'fire'] as const;

export const TargetModeControl = () => {
    const { battleState, dispatch } = useBattleState()
    const { targetAction } = battleState

    return <div>
        {MODES.map((mode) => (
            <label key={mode}>
                {mode}
                <input type="radio"
                    checked={targetAction === mode}
                    name="targetAction"
                    value={mode}
                    onChange={() => dispatch({ type: 'set-target-mode', mode })}
                />
            </label>
        ))}
    </div>

}
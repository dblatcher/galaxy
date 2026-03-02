import { useCallback, useState, type MouseEvent } from "react"
import type { XY } from "../../lib/model"
import { limitDistance } from "../../lib/util"
import { useAnimationState } from "../animation-context"
import { useBattleState } from "../battle-state-context"
import { DEFAULT_WEAPON_RANGE, MAP_HEIGHT, MAP_WIDTH } from "../constants"
import { handleFiring, handleMove } from "../game-logic"
import { checkCanFire, getActiveShipInstance, getInstancesForSide, stringifyIdent } from "../helpers"
import type { ShipIdent, ShipInstanceInfo } from "../model"
import { AnimationPlotter } from "./AnimationPlotter"
import { RangeCircle } from "./RangeCircle"
import { ShipOnMap } from "./ShipOnMap"
import { TargetLine } from "./TargetLine"


interface Props {
    scale: number
    isNotLocalPlayerTurn: boolean
    setHoveredIdent: { (ident?: ShipIdent): void }
}

const mapMargin = 25

export const BattleMap = ({ scale, isNotLocalPlayerTurn, setHoveredIdent }: Props) => {
    const [targetPoint, setTargetPoint] = useState<XY>()
    const { battleState, dispatch } = useBattleState()
    const { dispatchAnimationAction } = useAnimationState()
    const { sides, activeFaction, targetAction } = battleState
    const activeShip = getActiveShipInstance(battleState)
    const canFire = checkCanFire(activeShip);

    const findPointOnMap = useCallback((event: MouseEvent<SVGElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const raw = { x: event.clientX - rect.x, y: event.clientY - rect.y }
        const adjust = (v: number) => Math.round((v / scale) - mapMargin)
        return {
            x: adjust(raw.x),
            y: adjust(raw.y)
        }
    }, [scale]);

    const handleClickOnMap = (event: MouseEvent<SVGElement>) => {
        if (!activeShip?.state || isNotLocalPlayerTurn || targetAction !== 'move') {
            return
        }
        const instance = getActiveShipInstance(battleState)
        if (!instance) { return }
        const moveOutcome = handleMove(instance, findPointOnMap(event), battleState);
        moveOutcome.animationActions.forEach(dispatchAnimationAction)
        moveOutcome.battleActions.forEach(dispatch)
    }

    const handleMoveOnMap = (event: MouseEvent<SVGElement>) => {
        setTargetPoint(findPointOnMap(event))
    }

    const handleClickOnShip = (shipInstance: ShipInstanceInfo, event: MouseEvent) => {
        const clickedShipCanFire = checkCanFire(shipInstance)
        if (isNotLocalPlayerTurn) {
            return
        }
        if (shipInstance.faction.id === activeFaction) {
            dispatch({
                type: 'select-ship',
                ident: shipInstance.ident,
            })
            if (event.ctrlKey) {
                dispatch({
                    type: 'set-target-mode',
                    mode: targetAction === 'move' && clickedShipCanFire ? 'fire' : 'move'
                })
            }
            return
        }

        if (targetAction === 'fire' && canFire) {
            if (!activeShip) {
                return
            }

            const firingOutcome = handleFiring(activeShip, shipInstance);
            const { animations, battleActions } = firingOutcome
            dispatchAnimationAction({
                type: 'add',
                effects: animations
            })

            battleActions.forEach(dispatch)
            dispatch({ type: 'set-target-mode', mode: 'move' })
        }
    }

    return (
        <svg
            onClick={handleClickOnMap}
            onMouseMove={handleMoveOnMap}
            viewBox={`${-mapMargin} ${-mapMargin} ${MAP_WIDTH + 2 * mapMargin} ${MAP_HEIGHT + 2 * mapMargin}`}
            style={{
                width: (MAP_WIDTH + (mapMargin * 2)) * scale,
                height: (MAP_HEIGHT + (mapMargin * 2)) * scale,
                borderColor: 'red',
                borderStyle: 'dotted',
                borderWidth: 1,
                backgroundColor: 'black',
            }}>
            <rect x={0} y={0} width={MAP_WIDTH} height={MAP_HEIGHT} stroke="yellow" />
            <AnimationPlotter />
            {sides.map(side =>
                getInstancesForSide(side, battleState, true).map(shipInstance =>
                    <ShipOnMap
                        key={stringifyIdent(shipInstance.ident)}
                        handleClickOnShip={handleClickOnShip}
                        shipInstance={shipInstance}
                        setHoveredIdent={setHoveredIdent}
                    />
                )
            )}
            {(battleState.targetAction === 'move' && activeShip?.state) && <>
                <RangeCircle
                    type="move"
                    r={activeShip?.state.remainingMovement}
                    position={activeShip?.state.position}
                />
                {targetPoint && activeShip.design.hasWeapons &&
                    <RangeCircle
                        type="fire"
                        r={DEFAULT_WEAPON_RANGE}
                        position={limitDistance(activeShip?.state.remainingMovement, activeShip?.state.position, targetPoint)} />
                }
            </>}
            {(battleState.targetAction === 'fire' && activeShip && canFire) && <>
                <RangeCircle
                    type="fire"
                    r={DEFAULT_WEAPON_RANGE}
                    position={activeShip?.state.position} />
                {targetPoint &&
                    <TargetLine
                        origin={activeShip?.state.position}
                        targetPoint={targetPoint}
                        range={DEFAULT_WEAPON_RANGE} />}
            </>}
        </svg>
    )
}
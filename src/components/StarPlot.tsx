import { useGameStateContext } from "../hooks/useGameStateContext";
import type { Star } from "../lib/model";
import { FleetPlot } from "./FleetPlot";

interface Props {
   star: Star;
   onClick?: { (star: Star): void };
   isActive?: boolean;
}

const color = 'red'

export const StarPlot = ({ star, onClick, isActive }: Props) => {
   const { gameState: { fleets } } = useGameStateContext()
   const fleetsHere = fleets.filter(fleet => fleet.orbitingStarId === star.id)
   return (
      <g
         onClick={(event) => {
            event.stopPropagation()
            onClick?.(star)
         }}
      >
         <text className="star-label"
            pointerEvents={'none'}
            x={star.x} y={star.y}
            fill={'yellow'}>{star.name}</text>
         <circle className="star" cx={star.x} cy={star.y} r={4} fill={color} />
         {isActive && (
            <circle  cx={star.x} cy={star.y} r={6} stroke={color} fill="none" />
         )}
         {fleetsHere.length > 0 && (
            <text x={star.x + 3} y={star.y - 4} fill="white" fontSize={5}>{fleetsHere.length}</text>
         )}
      </g>
   )
}
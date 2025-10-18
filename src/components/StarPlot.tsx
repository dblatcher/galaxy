import { useGameStateContext } from "../hooks/useGameStateContext";
import type { Star } from "../lib/model";
import { findById } from "../lib/util";
import { FleetPlot } from "./FleetPlot";

interface Props {
   star: Star;
   onClick?: { (star: Star): void };
   isActive?: boolean;
}


export const StarPlot = ({ star, onClick, isActive }: Props) => {
   const { gameState: { fleets, factions } } = useGameStateContext()
   const faction = findById(star.factionId, factions)
   const fleetsHere = fleets.filter(fleet => fleet.orbitingStarId === star.id)
   const color = faction?.color ?? 'grey'
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
            <circle cx={star.x} cy={star.y} r={6} stroke={'white'} fill="none" strokeWidth={.5} />
         )}
         {fleetsHere.length > 0 && (
            <text x={star.x + 3} y={star.y - 4} fill="white" fontSize={5}>{fleetsHere.length}</text>
         )}
      </g>
   )
}
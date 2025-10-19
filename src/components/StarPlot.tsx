import { useGameStateContext } from "../hooks/useGameStateContext";
import type { Fleet, Star } from "../lib/model";
import { findById } from "../lib/util";

interface Props {
   star: Star;
   onClick?: { (star: Star): void };
   isActive?: boolean;
}

const getFleetBreakdown = (fleets: Fleet[]) => {
   const map: Record<number, number> = {}
   fleets.forEach(fleet => {
      if (!map[fleet.factionId]) {
         map[fleet.factionId] = 1
      } else {
         map[fleet.factionId]++
      }
   })
   return map
}

const FleetCounts = ({ star }: { star: Star }) => {
   const { gameState: { fleets, factions } } = useGameStateContext()
   const fleetsHere = fleets.filter(fleet => fleet.orbitingStarId === star.id)
   const fleetsBreakdown = getFleetBreakdown(fleetsHere)

   return <>
      {Object.entries(fleetsBreakdown).map(([factionId, count], index) => (
         <text pointerEvents={'none'}
            key={index} dx={6 * index}
            x={star.x - 4} y={star.y - 4}
            fill={findById(Number(factionId), factions)?.color} fontSize={5}>{count}</text>
      )
      )}
   </>
}

export const StarPlot = ({ star, onClick, isActive }: Props) => {
   const { gameState: { factions } } = useGameStateContext()
   const faction = findById(star.factionId, factions)
   const color = faction?.color ?? 'grey'
   return (
      <>
         <g
            onClick={(event) => {
               event.stopPropagation()
               onClick?.(star)
            }}
         >
            <circle className="star" cx={star.x} cy={star.y} r={4} fill={color} />
            {isActive && (
               <circle cx={star.x} cy={star.y} r={6} stroke={'white'} fill="none" strokeWidth={.5} />
            )}
         </g>
         <text className="star-label" pointerEvents={'none'}
            x={star.x} y={star.y}
            fill={'white'}>{star.name}</text>
         <FleetCounts star={star} />
      </>
   )
}
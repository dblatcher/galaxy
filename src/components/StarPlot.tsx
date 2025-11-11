import { useGameStateContext } from "../hooks/useGameStateContext";
import type { Fleet, Star } from "../lib/model";
import { findById } from "../lib/util";
import { FleetSymbol } from "./FleetSymbol";

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
      {Object.entries(fleetsBreakdown).map(([factionId, count], index) => {
         const faction = findById(Number(factionId), factions);
         const oX = star.x - 12;
         const oY = star.y - 4;
         const dY = 5 * index;

         return <g data-is="fleet-count" key={index}>
            <text pointerEvents={'none'}
               x={oX} y={oY + dY}
               fill={faction?.color} fontSize={4}>{count}</text>
            <FleetSymbol color={faction?.color} location={{ x: oX + 6, y: oY + dY - 1 }} scale={1 / 2} />
         </g>
      }
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
            style={{
               cursor: onClick ? 'pointer' : undefined,
            }}
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
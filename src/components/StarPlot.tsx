import type { Star } from "../lib/model";

interface Props {
   star: Star;
   onClick?: { (star: Star): void };
   isActive?: boolean;
}

export const StarPlot = ({ star, onClick, isActive }: Props) => {

   const fill = isActive ? 'white' : 'red'

   return (
      <g
         onClick={() => onClick?.(star)}
      >
         <text className="star-label"
            pointerEvents={'none'}
            x={star.x} y={star.y}
            fill={'yellow'}>{star.name}</text>
         <circle className="star" cx={star.x} cy={star.y} r={4} fill={fill} />
      </g>
   )
}
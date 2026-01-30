import { FleetIcon } from "../components/FleetSymbol";
import { getMaybeEquipment } from "../data/ship-equipment";
import type { ShipDesign, Faction } from "../lib/model";
import { enhanceShipDesign } from "../lib/ship-design-helpers";
import { sum } from "../lib/util";

interface Props {
  design: Omit<ShipDesign, "id">;
  faction?: Faction;
}


const DamageOutput = ({ dice }: { dice: number[] }) => {
  return dice.length > 0 ? (
    <span>
      {dice.length} - {sum(dice)}
    </span>
  ) : (
    <span>N/A</span>
  );
};

export const DesignStats = ({ design, faction }: Props) => {
  const { name, hp, pattern, constructionCost, slots } = enhanceShipDesign({
    ...design,
    id: -1,
  });

  const bombDamageDice = slots
    .map(getMaybeEquipment)
    .flatMap((equipment) =>
      equipment?.info.type === "bomb" ? equipment.info.damage : []
    );
  const beamDamageDice = slots
    .map(getMaybeEquipment)
    .flatMap((equipment) =>
      equipment?.info.type === "beam" ? equipment.info.damage : []
    );

  return (
    <article className="ship-profile">
      <header>
        <FleetIcon color={faction?.color} />
        <div style={{ color: faction?.color }}>{name || "[no name]"}</div>
      </header>
      <section>
        <div>pattern: {pattern}</div>
        <div>hp: {hp}</div>
        <div>constructionCost: {constructionCost}</div>
      </section>
      <section>
        <div>
          Bomb Damage: <DamageOutput dice={bombDamageDice} />
        </div>

        <div>
          Beam Damage: <DamageOutput dice={beamDamageDice} />
        </div>
      </section>
    </article>
  );
};

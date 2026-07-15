import type { Pet } from "../data/types";
import {
  defenceLabel,
  hungerLabel,
  intelligenceLabel,
  moodLabel,
  movementLabel,
  strengthLabel,
} from "../data/stats";

// The classic quick-ref stat readout: identity line up top, then health as
// "current / max" and every other stat as its tier word. Shared by Quick Ref
// and the single-pet page.

export default function PetStats({ pet }: { pet: Pet }) {
  const healthLow = pet.health / pet.maxHealth < 0.34;

  return (
    <dl className="pet-stats">
      <Row label="species" value={pet.species} />
      <Row label="colour" value={pet.colour} />
      <Row label="gender" value={pet.gender} />
      <Row label="age" value={`${pet.ageDays} day${pet.ageDays === 1 ? "" : "s"}`} />
      <Row label="level" value={String(pet.level)} />

      <div className="pet-stats-gap" aria-hidden="true" />

      <Row
        label="health"
        value={`${pet.health} / ${pet.maxHealth}`}
        valueClass={healthLow ? "stat-bad" : "stat-good"}
      />
      <Row label="mood" value={moodLabel(pet)} />
      <Row label="hunger" value={hungerLabel(pet)} />
      <Row label="strength" value={strengthLabel(pet)} />
      <Row label="defence" value={defenceLabel(pet)} />
      <Row label="movement" value={movementLabel(pet)} />
      <Row label="intelligence" value={intelligenceLabel(pet)} />
      <Row label="fishing" value={String(pet.fishingLevel)} />
    </dl>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="pet-stats-row">
      <dt>{label}</dt>
      <dd className={valueClass}>{value}</dd>
    </div>
  );
}

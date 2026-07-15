// The lilguys domain model.
//
// These are the core concepts from docs/site-map.md, expressed as types. The
// mock data layer (mock.ts) fills them with stub values so the shell has
// something real to render before there's any backend. When persistence
// arrives (Phase 3), the shapes stay; only the source changes.

// The option lists double as the source of truth for their union types, so a
// picker can iterate them and the types can never drift from what's offered.

/** Species of lil guy. Original to lilguys — purely cosmetic for now. */
export const SPECIES = ["blorb", "sprig", "tuffet", "nib", "wisp"] as const;
export type Species = (typeof SPECIES)[number];

/** A lil guy's colour — our own palette of coat names. */
export const COLOURS = ["sunny", "mossy", "berry", "cloudy", "dusk", "coral"] as const;
export type Colour = (typeof COLOURS)[number];

export const GENDERS = ["male", "female"] as const;
export type Gender = (typeof GENDERS)[number];

/** A smaller companion that belongs to a Pet. */
export interface Petpet {
  id: string;
  name: string;
  kind: string;
}

/**
 * A "lil guy" — the pet an Owner cares for.
 *
 * All stats are stored as numbers (0–100, except the level-scaled health pair
 * and the counters). The UI never shows the raw numbers: it renders them as
 * classic tier words via data/stats.ts (e.g. hunger 92 → "bloated"). Keeping
 * them numeric means feeding, training, and battle can move them for real.
 */
export interface Pet {
  id: string;
  name: string;
  species: Species;
  colour: Colour;
  gender: Gender;
  /** Days since this lil guy was created. */
  ageDays: number;
  level: number;

  /** Current / maximum hit points. Shown as "current / max". */
  health: number;
  maxHealth: number;

  /** 0 = dying/empty, 100 = bloated/full. */
  hunger: number;
  /** 0 = miserable, 100 = delighted. Drives the displayed mood. */
  happiness: number;

  strength: number;
  defence: number;
  movement: number;
  intelligence: number;
  fishingLevel: number;

  description: string;
  petpet: Petpet | null;
}

/** An account. Owns pets, holds currency. */
export interface Owner {
  id: string;
  username: string;
  /** Neopoints — the soft currency. */
  np: number;
  pets: Pet[];
  /** Which of `pets` is currently active in the shell status box. */
  activePetId: string;
}

// The lilguys domain model.
//
// These are the core concepts from docs/site-map.md, expressed as types. The
// mock data layer (mock.ts) fills them with stub values so the shell has
// something real to render before there's any backend. When persistence
// arrives (Phase 3), the shapes stay; only the source changes.

/** A species of lil guy. Purely cosmetic for now. */
export type Species =
  | "blorb"
  | "sprig"
  | "tuffet"
  | "nib"
  | "wisp";

/** A mood, derived from care stats, shown on the pet's card. */
export type Mood = "happy" | "content" | "grumpy" | "hungry" | "sick";

/** A smaller companion that belongs to a Pet. */
export interface Petpet {
  id: string;
  name: string;
  kind: string;
}

/** A "lil guy" — the pet an Owner cares for. */
export interface Pet {
  id: string;
  name: string;
  species: Species;
  /** 0–100 care stats. Mood is derived from these. */
  hunger: number;
  health: number;
  happiness: number;
  level: number;
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

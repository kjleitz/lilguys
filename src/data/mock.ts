import type { Owner, Pet } from "./types";

// The initial stubbed owner so the shell can render a real user, active pet,
// and NP balance. This is the only place the starting numbers live; the store
// (store.ts) takes it from here and makes it mutable/reactive. Swap this for a
// real data source later without touching components.

export const initialOwner: Owner = {
  id: "owner-1",
  username: "hesitantacrobat",
  np: 1050,
  activePetId: "pet-1",
  pets: [
    {
      id: "pet-1",
      name: "Kaumandoop",
      species: "blorb",
      colour: "sunny",
      gender: "male",
      ageDays: 14,
      level: 3,
      health: 12,
      maxHealth: 15,
      hunger: 72,
      happiness: 64,
      strength: 22,
      defence: 30,
      movement: 18,
      intelligence: 55,
      fishingLevel: 2,
      description: "A blorb of few words and many snacks.",
      petpet: { id: "petpet-1", name: "Squib", kind: "nibbler" },
    },
    {
      id: "pet-2",
      name: "Pindle",
      species: "sprig",
      colour: "mossy",
      gender: "female",
      ageDays: 3,
      level: 1,
      health: 10,
      maxHealth: 10,
      hunger: 40,
      happiness: 88,
      strength: 8,
      defence: 18,
      movement: 8,
      intelligence: 40,
      fishingLevel: 1,
      description: "Sprightly, leafy, and perpetually curious.",
      petpet: null,
    },
  ],
};

/** The active pet within an owner. Throws if the id doesn't resolve. */
export function getActivePet(owner: Owner): Pet {
  const pet = owner.pets.find((p) => p.id === owner.activePetId);
  if (!pet) throw new Error(`Active pet ${owner.activePetId} not found`);
  return pet;
}

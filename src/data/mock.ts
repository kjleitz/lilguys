import type { Mood, Owner, Pet } from "./types";

// A single stubbed owner so the shell can render a real user, active pet, and
// NP balance. This is deliberately the only place the numbers live — swap it
// for a real data source later without touching the components.

export const currentOwner: Owner = {
  id: "owner-1",
  username: "hesitantacrobat",
  np: 1050,
  activePetId: "pet-1",
  pets: [
    {
      id: "pet-1",
      name: "Kaumandoop",
      species: "blorb",
      hunger: 72,
      health: 90,
      happiness: 64,
      level: 3,
      description: "A blorb of few words and many snacks.",
      petpet: { id: "petpet-1", name: "Squib", kind: "nibbler" },
    },
    {
      id: "pet-2",
      name: "Pindle",
      species: "sprig",
      hunger: 40,
      health: 100,
      happiness: 88,
      level: 1,
      description: "Sprightly, leafy, and perpetually curious.",
      petpet: null,
    },
  ],
};

/** The pet currently shown in the status box. */
export function getActivePet(owner: Owner): Pet {
  const pet = owner.pets.find((p) => p.id === owner.activePetId);
  if (!pet) throw new Error(`Active pet ${owner.activePetId} not found`);
  return pet;
}

/** Derive a mood from a pet's care stats, worst-first. */
export function moodOf(pet: Pet): Mood {
  if (pet.health < 40) return "sick";
  if (pet.hunger < 35) return "hungry";
  if (pet.happiness < 40) return "grumpy";
  if (pet.happiness >= 75) return "happy";
  return "content";
}

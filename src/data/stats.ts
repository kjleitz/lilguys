import type { Pet } from "./types";

// The display layer for pet stats. Pets store plain numbers (see types.ts);
// the UI shows classic qualitative tiers instead. One ladder per stat, ordered
// worst → best; tierLabel maps a 0–100 value onto it.

/** Pick a label from a worst→best ladder for a 0–100 value. */
function tierLabel(value: number, ladder: readonly string[]): string {
  const clamped = Math.max(0, Math.min(100, value));
  const index = Math.min(ladder.length - 1, Math.floor((clamped / 100) * ladder.length));
  return ladder[index];
}

const HUNGER = [
  "dying", "starving", "famished", "ravenous", "hungry",
  "peckish", "satisfied", "full", "stuffed", "bloated",
] as const;

const MOOD = [
  "miserable", "glum", "gloomy", "okay",
  "content", "cheerful", "happy", "delighted",
] as const;

const STRENGTH = [
  "frail", "feeble", "slight", "able",
  "sturdy", "strong", "mighty", "titanic",
] as const;

const DEFENCE = [
  "exposed", "poor", "guarded", "steady",
  "tough", "hardy", "shielded", "impregnable",
] as const;

const MOVEMENT = [
  "slow", "plodding", "steady", "spry",
  "nimble", "quick", "fleet", "blinding",
] as const;

const INTELLIGENCE = [
  "simple", "dim", "plain", "average",
  "sharp", "clever", "brilliant", "genius",
] as const;

export const hungerLabel = (pet: Pet): string => tierLabel(pet.hunger, HUNGER);
export const moodLabel = (pet: Pet): string => tierLabel(pet.happiness, MOOD);
export const strengthLabel = (pet: Pet): string => tierLabel(pet.strength, STRENGTH);
export const defenceLabel = (pet: Pet): string => tierLabel(pet.defence, DEFENCE);
export const movementLabel = (pet: Pet): string => tierLabel(pet.movement, MOVEMENT);
export const intelligenceLabel = (pet: Pet): string =>
  tierLabel(pet.intelligence, INTELLIGENCE);

/** Health as a fraction 0–1, for meters. */
export const healthFraction = (pet: Pet): number =>
  pet.maxHealth > 0 ? Math.max(0, Math.min(1, pet.health / pet.maxHealth)) : 0;

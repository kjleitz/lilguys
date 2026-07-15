import { useSyncExternalStore } from "react";
import type { Owner, Pet } from "./types";
import { initialOwner } from "./mock";

// A tiny reactive store for the current owner. Components read it with
// useOwner(); mutations (activate a pet, add a pet) replace the owner
// immutably and notify subscribers, so the sidebar status box and every open
// page stay in sync. This is the seam a real backend slots into later —
// swap the in-memory value for fetched/persisted state, keep the API.

let owner: Owner = initialOwner;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Owner {
  return owner;
}

/** Subscribe a component to the current owner. */
export function useOwner(): Owner {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/** How many lil guys one owner can keep at once (as on the reference site). */
export const MAX_PETS = 4;
/** NP awarded for creating a new lil guy (matches the reference). */
export const CREATE_BONUS_NP = 50;

/** Make a pet the active one (the pet you play/browse as). */
export function setActivePet(petId: string): void {
  if (owner.activePetId === petId) return;
  if (!owner.pets.some((pet) => pet.id === petId)) return;
  owner = { ...owner, activePetId: petId };
  emit();
}

/**
 * Hatch a freshly created lil guy: add it, make it active, and award the
 * creation NP bonus — all in one update. No-op if already at the pet cap.
 */
export function createPet(pet: Pet): void {
  if (owner.pets.length >= MAX_PETS) return;
  owner = {
    ...owner,
    pets: [...owner.pets, pet],
    activePetId: pet.id,
    np: owner.np + CREATE_BONUS_NP,
  };
  emit();
}

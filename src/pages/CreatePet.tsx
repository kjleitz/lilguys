import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { COLOURS, GENDERS, SPECIES, SPECIES_DEFAULT_COLOUR } from "../data/types";
import type { Colour, Gender, Pet, Species } from "../data/types";
import { CREATE_BONUS_NP, MAX_PETS, createPet, useOwner } from "../data/store";
import PetAvatar from "../components/PetAvatar";

// Create-a-Pet — a two-step wizard mirroring the reference flow: (1) choose a
// species from a grid, (2) customise its colour, gender, and name. Hatches a
// level-1 lil guy into the store, awards the creation NP bonus, and makes it
// active. Species/art/copy are our own.

/** Stats a lil guy hatches with. Mirrors a brand-new classic pet. */
function newHatchling(name: string, species: Species, colour: Colour, gender: Gender): Pet {
  return {
    id: `pet-${crypto.randomUUID()}`,
    name,
    species,
    colour,
    gender,
    ageDays: 0,
    level: 1,
    health: 10,
    maxHealth: 10,
    hunger: 92, // bloated
    happiness: 60, // content
    strength: 8, // frail
    defence: 18, // poor
    movement: 8, // slow
    intelligence: 40, // average
    fishingLevel: 1,
    description: "",
    petpet: null,
  };
}

export default function CreatePet() {
  const navigate = useNavigate();
  const owner = useOwner();

  const [step, setStep] = useState<"species" | "customise">("species");
  const [species, setSpecies] = useState<Species | null>(null);
  const [colour, setColour] = useState<Colour>(COLOURS[0]);
  const [gender, setGender] = useState<Gender>(GENDERS[0]);
  const [name, setName] = useState("");

  const remaining = MAX_PETS - owner.pets.length;
  const atCap = remaining <= 0;
  const trimmed = name.trim();
  const canHatch = species !== null && trimmed.length >= 2 && trimmed.length <= 20;

  function chooseSpecies() {
    if (species === null) return;
    setColour(SPECIES_DEFAULT_COLOUR[species]); // default to its signature coat
    setStep("customise");
  }

  function handleHatch(event: FormEvent) {
    event.preventDefault();
    if (species === null || !canHatch) return;
    createPet(newHatchling(trimmed, species, colour, gender));
    navigate("/quickref");
  }

  return (
    <div className="page create-pet">
      <div className="banner">
        <h1 className="banner-title">create.a.pet</h1>
      </div>

      {step === "species" || species === null ? (
        <>
          <p className="lead">
            <strong>step 1 — pick a species.</strong> hatching a lil guy earns you{" "}
            {CREATE_BONUS_NP} NP! you can keep up to {MAX_PETS} at once
            {atCap ? " — and you're full up right now." : ` — room for ${remaining} more.`}
          </p>

          <div className="species-grid">
            {SPECIES.map((s) => (
              <label
                key={s}
                className={species === s ? "species-card is-picked" : "species-card"}
              >
                <PetAvatar species={s} colour={SPECIES_DEFAULT_COLOUR[s]} name="" size={96} />
                <span className="species-name">{s}</span>
                <input
                  type="radio"
                  name="species"
                  value={s}
                  checked={species === s}
                  onChange={() => setSpecies(s)}
                  disabled={atCap}
                />
              </label>
            ))}
          </div>

          <div className="wizard-buttons">
            <button
              type="button"
              className="btn btn-primary"
              onClick={chooseSpecies}
              disabled={species === null || atCap}
            >
              i have chosen →
            </button>
          </div>
        </>
      ) : (
        <form className="create-form" onSubmit={handleHatch}>
          <div className="create-preview">
            <PetAvatar species={species} colour={colour} name={trimmed} size={120} />
            <span className="create-preview-caption">
              {colour} {species}
            </span>
            <button
              type="button"
              className="link-button"
              onClick={() => setStep("species")}
            >
              ← change species
            </button>
          </div>

          <div className="create-fields">
            <p className="lead">
              <strong>step 2 — customise your {species}.</strong>
            </p>

            <fieldset className="field">
              <legend className="field-label">colour</legend>
              <div className="swatch-row">
                {COLOURS.map((c) => (
                  <label key={c} className={colour === c ? "swatch is-picked" : "swatch"}>
                    <input
                      type="radio"
                      name="colour"
                      value={c}
                      checked={colour === c}
                      onChange={() => setColour(c)}
                    />
                    <PetAvatar species={species} colour={c} name="" size={44} />
                    <span className="swatch-name">{c}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="field field-genders">
              <legend className="field-label">gender</legend>
              {GENDERS.map((g) => (
                <label key={g} className="radio">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={() => setGender(g)}
                  />
                  {g}
                </label>
              ))}
            </fieldset>

            <label className="field">
              <span className="field-label">name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                placeholder="2–20 characters"
                autoFocus
              />
            </label>

            <button type="submit" className="btn btn-primary" disabled={!canHatch}>
              hatch my lil guy
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

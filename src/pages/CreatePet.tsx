import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { COLOURS, GENDERS, SPECIES } from "../data/types";
import type { Colour, Gender, Pet, Species } from "../data/types";
import { addPet } from "../data/store";
import PetAvatar from "../components/PetAvatar";

/** Narrow a raw <select> value back to a known option, without casting. */
function pick<T extends string>(options: readonly T[], value: string): T | undefined {
  return options.find((option) => option === value);
}

// Create-a-Pet: name your lil guy and pick a species/colour/gender. A new pet
// hatches at level 1 with fresh-out-of-the-egg stats (bloated, frail, etc.),
// becomes your active pet, and you land on Quick Ref.

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
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<Species>(SPECIES[0]);
  const [colour, setColour] = useState<Colour>(COLOURS[0]);
  const [gender, setGender] = useState<Gender>(GENDERS[0]);

  const trimmed = name.trim();
  const canCreate = trimmed.length >= 2 && trimmed.length <= 20;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canCreate) return;
    addPet(newHatchling(trimmed, species, colour, gender));
    navigate("/quickref");
  }

  return (
    <div className="page create-pet">
      <div className="banner">
        <h1 className="banner-title">create a pet</h1>
      </div>

      <p className="lead">hatch a brand-new lil guy. pick a look and give them a name.</p>

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="create-preview">
          <PetAvatar
            species={species}
            colour={colour}
            name={trimmed || "?"}
            size={120}
          />
          <span className="create-preview-caption">
            {colour} {species}
          </span>
        </div>

        <div className="create-fields">
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

          <label className="field">
            <span className="field-label">species</span>
            <select
              value={species}
              onChange={(e) => {
                const next = pick(SPECIES, e.target.value);
                if (next) setSpecies(next);
              }}
            >
              {SPECIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">colour</span>
            <select
              value={colour}
              onChange={(e) => {
                const next = pick(COLOURS, e.target.value);
                if (next) setColour(next);
              }}
            >
              {COLOURS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

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

          <button type="submit" className="btn btn-primary" disabled={!canCreate}>
            hatch my lil guy
          </button>
        </div>
      </form>
    </div>
  );
}

import type { Colour, Species } from "../data/types";

// A placeholder lil-guy avatar until we have real art. A rounded tile tinted
// by the pet's colour, with a species glyph and the pet's initial. Deterministic
// so a given pet always looks the same.

const COLOUR_HEX: Record<Colour, string> = {
  sunny: "#f2b705",
  mossy: "#5a8f3c",
  berry: "#b0355f",
  cloudy: "#8aa6c4",
  dusk: "#6b3fa0",
  coral: "#e0663f",
};

const SPECIES_GLYPH: Record<Species, string> = {
  blorb: "●",
  sprig: "❦",
  tuffet: "▲",
  nib: "◆",
  wisp: "✦",
};

interface Props {
  species: Species;
  colour: Colour;
  name: string;
  /** Avatar edge length in px. */
  size?: number;
  faded?: boolean;
}

export default function PetAvatar({ species, colour, name, size = 72, faded = false }: Props) {
  return (
    <span
      className={faded ? "pet-avatar is-faded" : "pet-avatar"}
      style={{ width: size, height: size, background: COLOUR_HEX[colour] }}
      title={`${name} — ${colour} ${species}`}
    >
      <span className="pet-avatar-glyph" aria-hidden="true">
        {SPECIES_GLYPH[species]}
      </span>
      <span className="pet-avatar-initial" aria-hidden="true">
        {name.charAt(0)}
      </span>
    </span>
  );
}

// A stand-in for real artwork: a tinted, bordered tile with a placeholder
// glyph. Used for shop items and shopkeepers until we have graphics. Same idea
// as PetAvatar — a deterministic placeholder with a clean seam to swap in a
// real <img> later (see docs/site-map.md, the shops area note).

interface Props {
  /** Placeholder glyph (an emoji stands in for the eventual art). */
  glyph: string;
  /** Edge length in px. */
  size?: number;
  /** Background tint behind the glyph. */
  tint?: string;
  /** Accessible label / hover title for what this art represents. */
  label: string;
  /** Circle (shopkeepers) vs. rounded square (items). */
  round?: boolean;
}

export default function PlaceholderArt({
  glyph,
  size = 80,
  tint = "#e7e2d4",
  label,
  round = false,
}: Props) {
  return (
    <span
      className={round ? "placeholder-art is-round" : "placeholder-art"}
      style={{ width: size, height: size, background: tint, fontSize: size * 0.5 }}
      role="img"
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{glyph}</span>
    </span>
  );
}

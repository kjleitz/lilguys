// The primary navigation, in sidebar order. Both the Sidebar and the Pet
// Central hub grid read from this list so they never drift apart.

export interface NavItem {
  /** Route path (also used as a React key). */
  to: string;
  /** On-screen label. Always lowercase — the lilguys house style. */
  label: string;
  /** A single glyph standing in for the eventual icon art. */
  glyph: string;
  /** One-line description, shown on the hub grid tiles. */
  blurb: string;
}

export const navItems: NavItem[] = [
  { to: "/", label: "pet central", glyph: "★", blurb: "your home base" },
  { to: "/create", label: "create a pet", glyph: "◕", blurb: "hatch a new lil guy" },
  { to: "/neomail", label: "mail", glyph: "✉", blurb: "read your messages" },
  { to: "/world", label: "world", glyph: "◍", blurb: "explore the lands" },
  { to: "/explore", label: "explore", glyph: "✧", blurb: "quests & events" },
  { to: "/boards", label: "boards", glyph: "❒", blurb: "talk with others" },
  { to: "/games", label: "games", glyph: "◆", blurb: "play & earn NP" },
  { to: "/shops", label: "shops", glyph: "▤", blurb: "buy & sell" },
  { to: "/news", label: "news", glyph: "❏", blurb: "what's new" },
  { to: "/help", label: "help", glyph: "?", blurb: "how things work" },
];

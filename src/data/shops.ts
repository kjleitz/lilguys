// The lilguys shops catalog.
//
// Phase 3 is the storefront UI on the mock: you can browse hubs and shop
// fronts, but nothing is bought and no NP moves — that's Phase 4 (spending &
// persistence). So this is static reference data, not a reactive store.
//
// Structure mirrors the reference site's shops area (see docs/site-map.md):
//   Neopia Central (top hub) -> Bazaar / Plaza (sub-hubs) -> shop fronts.
// The hubs are big map graphics with clickable regions. We don't have that art
// yet, so a hub renders as a placeholder map with hotspot tiles; when the art
// lands, set `mapImage` and give each destination a `hotspot` (see ShopMap).
// All names, art (emoji placeholders), and copy here are our own.

/** The three shopping hubs. `central` is the top level; the others sit under it. */
export type HubId = "central" | "bazaar" | "plaza";

/** A clickable destination on a hub map — a shop front or a sub-hub. */
export interface HubDestination {
  label: string;
  /** Route this region navigates to. */
  to: string;
  /** Placeholder glyph until we have the real map art. */
  glyph: string;
  blurb: string;
  /**
   * Where this region sits on the (future) map image, as percentages of the
   * image box: { x, y } is the top-left, { w, h } the size. Only used once
   * `mapImage` is set — until then destinations render as a tile grid.
   */
  hotspot?: { x: number; y: number; w: number; h: number };
}

/** A single item on a shop's shelf. Browsing-only: no purchase behaviour. */
export interface ShopItem {
  id: string;
  name: string;
  /** Placeholder art until we have item graphics. */
  glyph: string;
  /** Price in NP. */
  price: number;
  /** How many are on the shelf right now. */
  stock: number;
  blurb: string;
}

/** An NPC shop front: a themed shelf of items with a shopkeeper. */
export interface Shop {
  /** Route segment (/shops/shop/:id) — our analog of the reference `shop_id`. */
  id: string;
  name: string;
  /** Which hub this shop sits in. */
  hub: HubId;
  /** Placeholder shopkeeper art + the tint behind it. */
  keeperGlyph: string;
  tint: string;
  greeting: string;
  items: ShopItem[];
}

/** A hub view: its identity plus the destinations drawn on its map. */
export interface ShopHub {
  id: HubId;
  name: string;
  blurb: string;
  /** The big map graphic, once we have it. null -> placeholder-with-hotspots. */
  mapImage: string | null;
  destinations: HubDestination[];
}

// Category tints reused across a shop's keeper and its route tile, so a shop
// reads as one colour throughout. Drawn from the App.css palette family.
const TINT = {
  food: "#e0663f",
  book: "#2f2fb8",
  magic: "#6b3fa0",
  petpet: "#5a8f3c",
  toy: "#b0355f",
  sweet: "#e0663f",
  garden: "#5a8f3c",
  general: "#f2b705",
} as const;

// item id helper: keeps ids stable and unique per shop without hand-numbering.
function items(shopId: string, rows: Omit<ShopItem, "id">[]): ShopItem[] {
  return rows.map((row, index) => ({ id: `${shopId}-${index + 1}`, ...row }));
}

export const SHOPS: Shop[] = [
  {
    id: "snackery",
    name: "the snackery",
    hub: "bazaar",
    keeperGlyph: "🍜",
    tint: TINT.food,
    greeting: "welcome to the snackery — please click a snack you fancy.",
    items: items("snackery", [
      { name: "jelly cube", glyph: "🟦", price: 40, stock: 6, blurb: "wobbles when you poke it." },
      { name: "crispy leaf", glyph: "🍂", price: 25, stock: 9, blurb: "autumn in one crunch." },
      { name: "bubble berry", glyph: "🫧", price: 120, stock: 3, blurb: "fizzes on the tongue." },
      { name: "warm bun", glyph: "🥐", price: 60, stock: 5, blurb: "still steaming, somehow." },
      { name: "fizzy root", glyph: "🥤", price: 15, stock: 12, blurb: "an acquired taste." },
      { name: "moss loaf", glyph: "🍞", price: 90, stock: 4, blurb: "heartier than it looks." },
    ]),
  },
  {
    id: "book-nook",
    name: "the book nook",
    hub: "bazaar",
    keeperGlyph: "📚",
    tint: TINT.book,
    greeting: "welcome to the book nook — mind the paper cuts.",
    items: items("book-nook", [
      { name: "pocket almanac", glyph: "📖", price: 210, stock: 4, blurb: "facts for every day." },
      { name: "ghost story", glyph: "👻", price: 340, stock: 2, blurb: "read it with the lights on." },
      { name: "doodle primer", glyph: "✏️", price: 150, stock: 6, blurb: "learn to draw a lil guy." },
      { name: "star atlas", glyph: "🌟", price: 480, stock: 1, blurb: "every constellation, mapped." },
      { name: "riddle reader", glyph: "🔖", price: 275, stock: 3, blurb: "answers in the back." },
    ]),
  },
  {
    id: "oddments",
    name: "oddments",
    hub: "bazaar",
    keeperGlyph: "🔮",
    tint: TINT.magic,
    greeting: "welcome to oddments — everything here is a little strange.",
    items: items("oddments", [
      { name: "glow pebble", glyph: "🔆", price: 320, stock: 4, blurb: "faintly warm in the dark." },
      { name: "humming coin", glyph: "🪙", price: 900, stock: 1, blurb: "you can feel the note." },
      { name: "knotted string", glyph: "🧵", price: 45, stock: 8, blurb: "nobody can undo it." },
      { name: "tiny lantern", glyph: "🏮", price: 610, stock: 2, blurb: "lights on its own." },
      { name: "odd key", glyph: "🗝️", price: 1500, stock: 1, blurb: "fits a lock somewhere." },
    ]),
  },
  {
    id: "petpet-parlour",
    name: "the petpet parlour",
    hub: "bazaar",
    keeperGlyph: "🐾",
    tint: TINT.petpet,
    greeting: "welcome to the parlour — a companion for your lil guy awaits.",
    items: items("petpet-parlour", [
      { name: "squib", glyph: "🐛", price: 800, stock: 3, blurb: "nibbles, mostly harmless." },
      { name: "puddle newt", glyph: "🦎", price: 1200, stock: 2, blurb: "prefers the damp." },
      { name: "tuft moth", glyph: "🦋", price: 640, stock: 4, blurb: "drawn to lantern light." },
      { name: "pebble crab", glyph: "🦀", price: 980, stock: 2, blurb: "wears its home." },
    ]),
  },
  {
    id: "sweet-tooth",
    name: "sweet tooth",
    hub: "plaza",
    keeperGlyph: "🍬",
    tint: TINT.sweet,
    greeting: "welcome to sweet tooth — don't tell your dentist.",
    items: items("sweet-tooth", [
      { name: "sour ring", glyph: "🍭", price: 30, stock: 10, blurb: "puckers on contact." },
      { name: "choco nib", glyph: "🍫", price: 75, stock: 6, blurb: "melts in a warm paw." },
      { name: "gummy blorb", glyph: "🐻", price: 60, stock: 7, blurb: "shaped like you-know-who." },
      { name: "frost cube", glyph: "🧊", price: 120, stock: 3, blurb: "colder than it should be." },
    ]),
  },
  {
    id: "garden-shed",
    name: "the garden shed",
    hub: "plaza",
    keeperGlyph: "🌱",
    tint: TINT.garden,
    greeting: "welcome to the garden shed — everything grows here.",
    items: items("garden-shed", [
      { name: "seed packet", glyph: "🌾", price: 20, stock: 15, blurb: "a fistful of maybe." },
      { name: "clay pot", glyph: "🪴", price: 95, stock: 5, blurb: "sturdy, honest, plain." },
      { name: "watering can", glyph: "🚿", price: 180, stock: 3, blurb: "never quite empties." },
      { name: "sun bulb", glyph: "💡", price: 240, stock: 2, blurb: "glows a little at dusk." },
    ]),
  },
  {
    id: "corner-store",
    name: "the corner store",
    hub: "central",
    keeperGlyph: "🏪",
    tint: TINT.general,
    greeting: "welcome to the corner store — a bit of everything.",
    items: items("corner-store", [
      { name: "spare button", glyph: "🔘", price: 10, stock: 20, blurb: "you'll want it eventually." },
      { name: "paper bag", glyph: "🛍️", price: 12, stock: 18, blurb: "for carrying the rest." },
      { name: "wind-up beetle", glyph: "🐞", price: 260, stock: 3, blurb: "walks in circles." },
      { name: "spin top", glyph: "🎯", price: 55, stock: 8, blurb: "spins longer than expected." },
    ]),
  },
];

/** Everything is browsable, but buying stays off until Phase 4. */
export const PURCHASING_ENABLED = false;

/** Sub-hub metadata, plus the greeting shown on each hub's map placeholder. */
const HUB_META: Record<HubId, { name: string; blurb: string; glyph: string }> = {
  central: {
    name: "neopia central",
    blurb: "the shopping heart of lilguys — pick a district or a shop.",
    glyph: "🏙️",
  },
  bazaar: {
    name: "the bazaar",
    blurb: "a busy row of specialty shops.",
    glyph: "🎪",
  },
  plaza: {
    name: "the plaza",
    blurb: "the newer district, a little fancier.",
    glyph: "⛲",
  },
};

export function getShop(id: string): Shop | undefined {
  return SHOPS.find((shop) => shop.id === id);
}

export function shopsInHub(hub: HubId): Shop[] {
  return SHOPS.filter((shop) => shop.hub === hub);
}

/** A shop's total items on the shelf — shown on hub tiles as a sense of size. */
export function shopItemCount(shop: Shop): number {
  return shop.items.reduce((sum, item) => sum + item.stock, 0);
}

/**
 * Build a hub's view: its identity plus the destinations drawn on its map.
 * Neopia Central shows the two sub-hubs first, then any shops that live at the
 * top level; the sub-hubs show their own shops. Returns null for an unknown id.
 */
export function getHub(id: string): ShopHub | null {
  if (id !== "central" && id !== "bazaar" && id !== "plaza") return null;
  const meta = HUB_META[id];

  const destinations: HubDestination[] = [];
  if (id === "central") {
    destinations.push(
      { label: HUB_META.bazaar.name, to: "/shops/bazaar", glyph: HUB_META.bazaar.glyph, blurb: HUB_META.bazaar.blurb },
      { label: HUB_META.plaza.name, to: "/shops/plaza", glyph: HUB_META.plaza.glyph, blurb: HUB_META.plaza.blurb },
    );
  }
  for (const shop of shopsInHub(id)) {
    destinations.push({
      label: shop.name,
      to: `/shops/shop/${shop.id}`,
      glyph: shop.keeperGlyph,
      blurb: shop.greeting,
    });
  }

  return {
    id,
    name: meta.name,
    blurb: meta.blurb,
    mapImage: null, // placeholder-with-hotspots until we have the map art
    destinations,
  };
}

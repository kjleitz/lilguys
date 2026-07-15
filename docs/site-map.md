# Site map — the structure we're modeling

This captures the **information architecture and feature concepts** of classic
Neopets, gathered from a discovery pass over the reference revival site
(neopetsclassic.com). It's a functional reference for what areas Lilguys will
have — **not** a copy of anyone's content. Lilguys names/art/copy are our own.

Source of this map: `capture/output/map/` (the `capture:map` discovery pass over
`/petcentral/`, plus the annotated homepage screenshot). Re-run `npm run
capture:map` to refresh it.

---

## The global shell (persistent chrome on every page)

Every page shares a fixed frame. This is the first thing to build.

- **Left sidebar — primary navigation** (top to bottom in the reference):
  Pet Central · Create a Pet · Neomail · World · Explore · Boards · Games ·
  Shops · News · Help · Login / Logout
- **Status box** (below the nav): a live clock, the logged-in **user**, their
  **active pet**, and their **currency (NP)** balance.
- **Utility:** a site search field and a language selector.
- **Content pane:** everything to the right of the sidebar; swaps per page.

> Lilguys shell = `Sidebar` (nav + status widget) + routed `<Outlet/>` content.

## Core concepts (the domain model)

| Concept | Notes |
|---|---|
| **Owner / User** | An account. Has a public profile ("user lookup"), settings, and a message inbox. |
| **Pet ("lil guy")** | An owner has several. Each has: quick-reference card, stats/abilities, a description, a customizable "pet's page," trophies, and hunger/health. |
| **Petpet** | A smaller companion that belongs to a *pet*. |
| **Currency (NP)** | Soft currency. Earned via games/shops, stored in a Bank. |
| **Items** | Held in an inventory; overflow in a safety-deposit box. Bought/sold in shops, auctions, and player trades. |

## The major areas

1. **Pets & You** — the hub (Pet Central), Quick Ref, Create-a-Pet, adopt from
   the Pound, feed/care actions.
2. **World / Explore** — themed "lands" (island, space, medieval, …), a world
   map, timed world events, a calendar, and quests.
3. **Games** — an arcade room + individual games; high-score tables. Games are
   the main **NP faucet** (play → earn currency).
4. **Shops & Economy** — NPC shops, a player's *own* shop, auctions, a trading
   post, a bank, and a price-search ("shop wizard"). The main **NP sink**.
5. **Community** — message boards, mail, guilds, and viewing other users' pages.
6. **Contests & Spotlights** — periodic community competitions (caption contest,
   art/writing spotlights, "mystery pic," etc.).
7. **News** — site updates / patch notes.
8. **Help** — help pages, support tickets, rules, safety.
9. **Creative** — "how to draw" style guides (nice-to-have, low priority).
10. **Rankings** — top-pets style leaderboards.

## Priority read (for Lilguys)

The emotional core is areas **1, 3, 4** (own/care for a pet, earn, spend). The
social layer (**5, 6**) is what makes it fun *with friends* but can come later.
Areas 7–10 are polish.

## Real navigation (decoded from the captured HTML)

The sidebar and Pet Central icon rows are **2004-style image maps**
(`<map>`/`<area>` coords over one sidebar graphic), not text links — which is
why early discovery logged them as "(no text)". Decoded from the grabbed
`petcentral` HTML, the real destinations are:

**Sidebar:** Pet Central `/petcentral/` · Create a Pet `/addpet/` · Neomail
`/neomessages/` · World / Explore `/explore/` · Chat (boards) `/neoboards/` ·
Games `/gameroom/` · Shops `/objects/` · News `/nf/` · Help `/help/` ·
Login `/loginpage/` · Logout (form POST `/logout/`).

**Pet Central icon rows:** quick ref `/quickref/` · abilities `/abilities/` ·
description `/neopet_desc/` · trophies `/prizes/` · pet's page `/edithomepage/` ·
feed `/howtofeed/` · items `/inventory/` · neohome `/neohome/` · then a second
row of world/community shortcuts (world events, calendar `/calendar/`, all pets
`/allpets/`, quests `/quests/`, high scores `/topneopets/`, greeting
`/sendgreeting/`, all petpets `/allpetpets/`).

## The shops area (decoded from the captured HTML)

Captured for Phase 3 (`objects`, `market_bazaar`, `market_plaza`,
`viewshop?shop_id=2`/`=3`). Like the sidebar, the hubs are **2004-style image
maps** over one big map graphic — clickable regions, not text links. We don't
have those map graphics, so clone them as **placeholder-with-hotspots**: keep
the link regions/routes, swap the real art in later.

**Hub hierarchy:**
- **Neopia Central** `/objects/` — top shops hub. Big map (`#map`) links to the
  two sub-hubs plus standalone shops (Magic `shop_id=1`, Fresh Foods `=2`, Book
  `=3`, Petpet `=4`, Post Office `=29`, Pharmacy `=42`), the Craft Stall
  `/objects/craft_stall/`, and non-shop stops (bank, rainbow pool, etc.).
- **Neopian Bazaar** `/market_bazaar/` — 16 NPC shop fronts (all `/viewshop/?shop_id=N`).
- **Neopian Plaza** `/market_plaza/` — a mix of shops (`shop_id=15/68/69/70`) and
  services (pound, hospital, wishing well, vending, welcome centre).

**Shop toolbar** (`#top_bar_Map`, on every shops page): Your Items `/inventory/`
· Your Shop `/market/` · Shop Wizard `/market/wizard/` · The Marketplace
`/market_map/` · Auctions `/auctions/` · Bank `/bank/` · Trading Post
`/island/tradingpost/` · Safety Deposit `/safetydeposit/` · Money Tree
`/donations/` · Main Shops Map `/objects/`.

**Shop front** (`/viewshop/?shop_id=N`) — the item grid:
- Header: shopkeeper image (`/static/images/shopkeepers/N.gif`, 150×150),
  "Welcome to <Shop Name>", "Please click on an item you wish to buy", and a
  live "Neopian Inflation is currently at X%" line.
- Grid: ~40 item cells, each = item image (`/images/items/<slug>.gif`, 80×80),
  name (`<b>`), "N in stock", "Cost : N NP".
- **No item-detail page.** Clicking an item goes straight to a haggle/purchase
  page `/haggle/<uuid>/?r=N` (ephemeral per-transaction URL) gated by a JS
  `confirm()`. That's the *buying* flow → **Phase 4**. For Phase 3 the item grid
  is the whole shop front; the inventory item view (`/inventory/`, captured) is
  the "item detail" counterpart. Purchases stay stubbed/disabled until Phase 4.

## Known gaps in this map

- We've deep-captured the pet system + core shell pages + the shops area (see
  `capture/output/pages/`). Other areas (a game, a world, boards) get captured
  just before we build them — capture-first.
- Not yet captured for shops (Phase 4 territory): the haggle/purchase page,
  Your Shop `/market/`, Shop Wizard `/market/wizard/`, the Marketplace map.

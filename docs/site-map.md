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

## Known gaps in this map

- The sidebar's nav links are **icon images** (no text), so the automated
  extractor logged them as "(no text)"; we read the real nav off the screenshot
  instead. If we want a complete machine-readable link inventory later, improve
  the extractor to read `alt`/`title`/image filenames.
- We've only mapped Pet Central so far. Deep-capturing a few more hubs (a pet
  page, a shop, a game) will fill in the per-area layouts when we build them.

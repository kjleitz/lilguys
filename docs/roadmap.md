# Roadmap

How we're building Lilguys, what's done, and the decisions still open. Pair this
with [`site-map.md`](site-map.md) (what the areas *are*) and the root
[`README.md`](../README.md) (vision + ground rules).

## Approach: capture-first cloning

We build **near-exact visual replicas** of the reference pages, and we **capture
each page before building it** (`capture:grab` → screenshot + full HTML), then
reproduce its layout, styling, and behavior. No guessing at a page's design.
Assets stay original (our art/logos/names/copy); we don't ship their files or
paste prose verbatim.

See [`reference-captures.md`](reference-captures.md) for what's already captured
and [`architecture.md`](architecture.md) for how the code is laid out.

## Status at a glance

| Phase | State |
|---|---|
| 0. Foundations & reference tooling | ✅ done |
| 1. App shell + Pet Central hub | ✅ done |
| 2. Pets: create, quick ref, pet page | 🔄 core done; detail pages next |
| 3. Shops & items — storefront UI (on the mock) | ✅ storefronts done; inventory page optional |
| 4. Real economy — spending & persistence | ⬜ needs backend decision |
| 5. Games (one game, wired to NP) | ⬜ planned |
| 6. Social: boards / mail | ⬜ later |
| 7+. World, contests, news, polish | ⬜ later |

## ▶ Next up — start here

**Track A (shops storefront) is done** — see Phase 3 below. The remaining work is
**Track B** (finish the Phase 2 pet detail pages), then Phase 4 (real economy),
which is gated on the backend + auth decisions.

### Track B — Finish Phase 2 pet detail pages (the priority now)

Already captured (see [`reference-captures.md`](reference-captures.md)) — pure
capture → clone. Good targets, each linked from Quick Ref / the Pet Central icon
row: **public pet lookup** `/petlookup/`, **description** `/neopet_desc/`,
**abilities** `/abilities/`, **trophies** `/prizes/`.

### Either way

- Reuse `PetStats` / `PetAvatar` where they fit; wire routes in `src/main.tsx`.
- **Verify in the browser** (Playwright: drive it, screenshot, check console).
- Optional polish: tighten **shell styling** against the captured
  `petcentral`/`quickref` screenshots.
- Before create-a-pet **step 2**, grab `/customizepet/` (see the capture
  inventory) — step 2 is inferred until then.

Ground rules never change: **capture first, original assets, strict TS, verify in
the browser.** See [`architecture.md`](architecture.md) to get oriented in the
code.

## Phase 0 — Foundations & reference tooling ✅

- Vite + React + TypeScript scaffold (strict), builds clean.
- Playwright capture tool (`capture/`) working against neopetsclassic.com —
  login, discovery map, deep-grab. See `capture/README.md`.
- Discovery pass complete; structure documented in `site-map.md`.

## Phase 1 — App shell + Pet Central ✅

**Goal:** the persistent frame + the hub page render, with placeholder data.

- [x] **App shell** — `Sidebar` (nav + status box: clock, user, active pet, NP,
      search, language) + routed content pane, via `react-router`.
- [x] **Pet Central page** — welcome, active-pet card, hub tile grid, site stats.
- [x] **Placeholder data layer** — typed mock owner/pet/NP; now a reactive
      in-memory store (`src/data/store.ts`) so mutations update the whole shell.
- [x] Nav links route to walkable "coming soon" stubs.

Built with our own identity (lowercase `lilguys` wordmark, sun-yellow/black/white
palette).

## Phase 2 — Pets (in progress)

**Reference:** captured `neopetsclassic.com/quickref/` — the pet data model is
species/colour/gender/age/level + health (x/max) + qualitative tiers for
hunger/strength/defence/movement/intelligence/mood. We store numbers and render
tier words (`src/data/stats.ts`), so feeding/training can move them for real.

- [x] **Expanded `Pet` model** + stat display layer (numbers → classic tiers).
- [x] **Quick Ref** (`/quickref`) — all pets, active is bold, click a picture to
      make it active (reactive), inactive pets faded.
- [x] **Single pet's page** (`/pet/:id`) — portrait, full stat readout, make-active.
- [x] **Create-a-Pet** (`/addpet`) — rebuilt from the captured `/addpet/`: a
      two-step wizard (choose species → customise colour/gender/name), awards the
      50 NP creation bonus, enforces the 4-pet cap. Step 1 matches the capture;
      **step 2 (customise) is inferred** — the real colour/name page is
      `/customizepet/`, reachable only after POSTing a species, so we couldn't
      GET it. Capture it later (walk the real flow) to refine step 2.
- [ ] **Pet detail pages** — description (`/neopet_desc/`), abilities
      (`/abilities/`), trophies (`/prizes/`), pet's page (`/edithomepage/`). All
      captured; see "Next up" above.
- [ ] **Public pet lookup** (`/petlookup/`) — the public-facing view, distinct
      from the owner view at `/pet/:id`. Captured.
- [ ] **Care actions** — feed (needs items/economy, Phase 3), edit description.
- [ ] **Refine create-a-pet step 2** — after capturing `/customizepet/`.

## Phase 3 — Shops & items (storefront UI, on the mock) ✅

Pulled forward and built visually against a mock catalog. Captured the shop area
first (`objects`, `market_bazaar`, `market_plaza`, two `viewshop` fronts) and
decoded it in [`site-map.md`](site-map.md).

- [x] **Shops catalog** (`src/data/shops.ts`) — original lilguys shops/items and
      the hub model (Neopia Central → Bazaar/Plaza → shop fronts). Static
      reference data (browsing only), not the reactive store.
- [x] **Hubs** (`ShopsHub` + `ShopMap`) — the reference hubs are big map images
      with clickable regions; we don't have that art, so hubs render as
      **placeholder-with-hotspots** (caption + tile grid). `ShopMap` already has
      the live image+`hotspot` branch, so real map art drops in as pure data.
- [x] **Shop front** (`ShopFront`) — shopkeeper, greeting, live inflation line,
      item grid (price/stock). Buying is disabled behind `PURCHASING_ENABLED`
      with a browsing-only note; **no NP moves** until Phase 4.
- [x] **Placeholder art** (`PlaceholderArt`) — swappable stand-in for item/keeper
      graphics, same seam idea as `PetAvatar`.
- [x] Routes wired in `main.tsx`; the `shops` nav is a real page, not a stub.

**Key finding:** there's no separate item-detail page — clicking an item goes to
an ephemeral `/haggle/` purchase page (that's Phase 4). So the item grid *is* the
shop front, and the captured inventory view is the "item detail" counterpart.

Optional leftover: a proper **inventory** page (we have `inventory.html`
captured); the shop-toolbar links (Your Shop, Shop Wizard, Marketplace) are
Phase 4 territory.

## Phase 4 — Real economy (spending & persistence)

Make it *stick*: buying/selling actually moves NP and inventory, and the changes
persist and are shared between friends. **This is the phase that forces the
backend + auth decision** (see open decisions). Turns the Phase 3 storefronts
from a display into a working economy.

## Phase 5 — Games

One simple arcade game that pays out NP on a score. Establishes the earn→spend
loop end to end (and gives the economy something to feed it).

## Phase 6+ — Social & world

Boards, mail, guilds; then world/lands, contests, news, and polish. These are
what make it fun *with friends* and lean hardest on a real backend.

## Open decisions (resolve before/at Phase 4)

1. **Backend & persistence.** Frontend-only mock carries us through **Phase 3**
   (shop *browsing* on the mock). **Phase 4** — when buying/selling must actually
   move NP/items, persist, and be shared between friends — needs a backend
   (options to weigh: a lightweight Node/API + Postgres; or a BaaS like Supabase).
   *Undecided.*
2. **Auth.** How friends log in (email/password, magic link, an existing
   identity provider). *Undecided.*
3. **Art pipeline.** Who/what makes the original pet + item art, and the format
   (hand-drawn PNG, SVG, generated). Needed before pets look like anything.
   *Undecided.*
4. **Multiplayer scope.** Real-time (live boards/trades) vs. simple
   request/refresh. Affects backend choice. *Undecided.*

## Working agreements

- **Capture first.** Never build a page from assumptions — grab the real one and
  clone it. (This is why create-a-pet was rebuilt.)
- Strict TypeScript; no `any` / `@ts-ignore` / casual casts (fix the types).
- Original assets only; reference captures stay local (gitignored).
- Verify non-trivial changes in the browser, not just via typecheck.
- Track pre-existing bugs / flaky things in project memory so they aren't lost.
- Keep the docs current as we learn: this file, `site-map.md`, `architecture.md`,
  and `reference-captures.md`.

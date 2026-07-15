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
| 2. Pets: create, quick ref, pet page | 🔄 **core done; detail pages next** |
| 3. Economy: NP, inventory, a shop | ⬜ planned |
| 4. Games (one game, wired to NP) | ⬜ planned |
| 5. Social: boards / mail | ⬜ later |
| 6+. World, contests, news, polish | ⬜ later |

## ▶ Next up — start here

Finish Phase 2's pet **detail pages**. These are already captured (see
[`reference-captures.md`](reference-captures.md)), so it's pure capture → clone:

1. **Pick a page** and read its capture (`capture/output/screenshots/*.png` +
   `pages/*.html`). Good first targets, each linked from Quick Ref / the Pet
   Central icon row:
   - **Public pet lookup** — `/petlookup/?pet_name=…` (the public view of a pet;
     currently our `/pet/:id` is the owner view).
   - **Description (edit)** — `/neopet_desc/` (edit a pet's description; pairs with
     the empty-description placeholder we already show).
   - **Abilities** — `/abilities/`, **Trophies** — `/prizes/`.
2. **Clone it** into a new page component (`src/pages/…`), wire the route in
   `src/main.tsx`, and link it from where the real site links it. Reuse
   `PetStats` / `PetAvatar` where they fit.
3. **Verify in the browser** (Playwright: drive it, screenshot, check console).

Parallel option if you'd rather polish: tighten the **shell styling** (sidebar,
banners, spacing/type) against the captured `petcentral`/`quickref` screenshots
to get closer to the real look.

Before touching create-a-pet **step 2**, grab `/customizepet/` first (see the
capture inventory) — it's the one pet page we couldn't capture, so step 2 is
currently inferred.

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

## Phase 3 — Economy

Make NP real: inventory, a basic NPC shop (buy/sell), and NP balance changes.
This is the first thing that needs **persistence** — forces the backend decision.

## Phase 4 — Games

One simple arcade game that pays out NP on a score. Establishes the earn→spend
loop end to end.

## Phase 5+ — Social & world

Boards, mail, guilds; then world/lands, contests, news, and polish. These are
what make it fun *with friends* and are the reason for a real backend.

## Open decisions (resolve before/at Phase 3)

1. **Backend & persistence.** Frontend-only mock is fine through Phase 2. Once
   pets/NP/items must persist and be shared between friends, we need a backend
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

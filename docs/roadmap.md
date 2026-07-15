# Roadmap

How we're building Lilguys, what's done, and the decisions still open. Pair this
with [`site-map.md`](site-map.md) (what the areas *are*) and the root
[`README.md`](../README.md) (vision + ground rules).

## Status at a glance

| Phase | State |
|---|---|
| 0. Foundations & reference tooling | ✅ done |
| 1. App shell + Pet Central hub | ⏭️ **up next** |
| 2. Pets: create, quick ref, pet page | ⬜ planned |
| 3. Economy: NP, inventory, a shop | ⬜ planned |
| 4. Games (one game, wired to NP) | ⬜ planned |
| 5. Social: boards / mail | ⬜ later |
| 6+. World, contests, news, polish | ⬜ later |

## Phase 0 — Foundations & reference tooling ✅

- Vite + React + TypeScript scaffold (strict), builds clean.
- Playwright capture tool (`capture/`) working against neopetsclassic.com —
  login, discovery map, deep-grab. See `capture/README.md`.
- Discovery pass complete; structure documented in `site-map.md`.

## Phase 1 — App shell + Pet Central (current)

**Goal:** the persistent frame + the hub page render, with placeholder data.

- [ ] **App shell**
  - [ ] `Sidebar` — primary nav (Pet Central, Create a Pet, Neomail, World,
        Explore, Boards, Games, Shops, News, Help, Login/Logout).
  - [ ] `StatusBox` — clock, current user, active pet, NP balance.
  - [ ] Layout: fixed sidebar + routed content pane. Add a router
        (`react-router`).
- [ ] **Pet Central page** — the hub: a grid of links to the main areas, a
      welcome blurb, and simple site stats (total owners / total pets).
- [ ] **Placeholder data layer** — a typed mock "current user + pet + NP" so the
      shell has something to show. No backend yet (see open decisions).
- [ ] Nav links route to stub pages ("coming soon") so the skeleton is walkable.

**Design note:** build our *own* visual identity from the start — original
palette, logo wordmark ("Lilguys"), and pet mascots. Match the *layout energy*
of the classic hub (dense, friendly, link-forward), not its exact styles.

## Phase 2 — Pets

Create-a-lil-guy flow → a new pet with species/color/name. Quick-ref card listing
your pets. A single pet's page (stats, description, feed/health action).

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

- Strict TypeScript; no `any` / `@ts-ignore` / casual casts (fix the types).
- Original assets only; reference captures stay local (gitignored).
- Track pre-existing bugs / flaky things in project memory so they aren't lost.
- Keep this doc + `site-map.md` current as we learn more.

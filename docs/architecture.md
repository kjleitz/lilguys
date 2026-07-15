# Architecture — how the code is laid out

Orientation for anyone picking up the app. Pair with [`roadmap.md`](roadmap.md)
(what to build next) and [`reference-captures.md`](reference-captures.md) (the
captured pages to clone from).

## Stack

- **Vite + React 19 + TypeScript** (strict; see house rules in the root README).
- **react-router-dom** for routing.
- **No backend yet.** All state is an in-memory mock (see the store below). This
  is deliberate through Phase 2; persistence is the Phase 3 decision.

## The data layer (`src/data/`)

This is the heart of the app. Four small files, each with one job:

| File | Responsibility |
|---|---|
| `types.ts` | The domain model: `Owner`, `Pet`, `Petpet`. Also the option lists `SPECIES`, `COLOURS`, `GENDERS` — declared `as const` so their **union types derive from the arrays** (a picker can iterate them and the type can never drift). `SPECIES_DEFAULT_COLOUR` gives each species a signature coat for pickers. |
| `mock.ts` | `initialOwner` — the seed data (one owner, two starter pets). `getActivePet(owner)` resolves the active pet. **The only place starting numbers live.** |
| `store.ts` | A tiny **reactive store** over the owner, built on `useSyncExternalStore`. Components read via `useOwner()`; mutations replace the owner immutably and notify subscribers, so the sidebar and every page update together. This is the **seam a real backend slots into** — swap the in-memory value for fetched/persisted state, keep the API. Exposes: `useOwner()`, `setActivePet(id)`, `createPet(pet)`, and the rules `MAX_PETS`, `CREATE_BONUS_NP`. |
| `stats.ts` | The **display layer** for pet stats. Pets store plain numbers; the UI never shows them. `hungerLabel`, `moodLabel`, `strengthLabel`, `defenceLabel`, `movementLabel`, `intelligenceLabel` map a 0–100 value onto a worst→best tier ladder (e.g. hunger 92 → `bloated`). `healthFraction` is for meters. Keeping stats numeric means feeding/training/battle can move them for real. |
| `nav.ts` | The primary navigation list. **Single source of truth** for both the sidebar nav and the Pet Central hub tiles, so they can't drift. |

## Components (`src/components/`)

- `Sidebar.tsx` — the persistent left rail: wordmark, nav (from `nav.ts`), and the
  status box (clock, user, active pet + mood, NP, search, language). Reads
  `useOwner()`.
- `Clock.tsx` — the live ticking clock.
- `PetAvatar.tsx` — **placeholder pet art**: a colour-tinted circle with a species
  glyph + name initial. Deterministic. Swap this for real art later without
  touching callers.
- `PetStats.tsx` — the classic quick-ref stat readout (identity block + health +
  tier words). Shared by Quick Ref and the pet page.

## Pages (`src/pages/`) and routing

Routes are declared in `src/main.tsx`. `App.tsx` is the shell (sidebar + routed
`<Outlet/>` + footer).

| Route | Page | Notes |
|---|---|---|
| `/` | `PetCentral.tsx` | The hub: welcome, active-pet card, tile grid, totals. |
| `/quickref` | `QuickRef.tsx` | All pets; active is bold; click a picture to activate; inactive faded. |
| `/pet/:petId` | `PetPage.tsx` | One pet: portrait, full stat readout, make-active. |
| `/addpet` | `CreatePet.tsx` | Two-step create wizard (species → customise). |
| everything else in `nav.ts` | `ComingSoon.tsx` | Walkable stub so the skeleton is fully navigable. |

`main.tsx` builds the stub routes automatically from `nav.ts`, minus the paths in
its `REAL_PAGES` set. **To promote a stub to a real page:** add its path to
`REAL_PAGES`, add a `{ path, element }` route, and build the page component.

## Styling

All styles live in `src/App.css`, organised by section with a comment banner per
area. Palette + geometry are CSS custom properties on `:root` (`--ink`, `--sun`,
`--sun-deep`, `--grape`, `--link`, `--border`, `--radius`). The app commits to a
light look (`index.css` sets `color-scheme: light`).

## Conventions

- **Strict TypeScript.** No `any`, no `@ts-ignore`, avoid casts — fix the types.
  (E.g. narrow a raw `<select>` value with a lookup helper, not `as`.)
- **Lowercase `lilguys`** everywhere on screen; capitalised only where code must
  start with a capital.
- **Verify in the browser.** Non-trivial changes get driven end-to-end with
  Playwright (screenshot + console-error check), not just a typecheck.

## The capture-first workflow (how a page gets built)

1. Make sure the real page is captured (`capture/output/pages/…`); if not, grab
   it (see `capture/README.md`).
2. Read its screenshot + HTML. Reproduce the layout/styling/behavior.
3. Use **our** assets (art via `PetAvatar`, our species/colours/copy). Never ship
   their images or paste their prose.
4. Typecheck, then drive it in the browser.

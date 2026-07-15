# Lilguys

A cozy virtual-pet website — an original **homage to the classic (early-2000s)
Neopets** era, built for the author and their friends to play together.

> **Not affiliated with Neopets.** Lilguys is inspired by the *structure and feel*
> of classic Neopets, but ships **entirely original names, art, copy, and code**.
> We never copy anyone's assets. See [Ground rules](#ground-rules).

---

## What this is

Remember logging into a bright, slightly-messy pet site as a kid — adopting a
little guy, feeding it, playing goofy arcade games for coins, poking around
shops and message boards? That's the feeling we're rebuilding, as our own thing.

The gameplay loop at the heart of it: **adopt a lil guy → care for it → earn
currency by playing → spend it on items/shops → show off & socialize.**

## Ground rules

1. **Original assets only.** No pet art, item images, logos, or copy from Neopets
   (classic or modern) ships in Lilguys. We use the real site purely as a
   *structural/layout reference*, then build our own look and content.
2. **Reference material stays local.** The capture tool (below) saves
   screenshots/HTML for study; those live under `capture/output/` and are
   gitignored. Never commit or redistribute them.
3. **Be a good guest.** When capturing from the live reference site
   (a community-run revival), we browse gently — one page at a time, paced.

## Tech stack

- **Vite + React + TypeScript** (strict). See `/Users/keegan/.claude/CLAUDE.md`
  house rules: no `any`, no `@ts-ignore`, avoid casts — fix the types.
- **Playwright** (dev-only) powers the reference-capture tool in `capture/`.

## Repo layout

```
lilguys/
├── src/                 # the Lilguys app (React)
├── capture/             # dev-only reference-capture tool (Playwright)
│   ├── browser.ts       #   shared hardened-Chrome launcher
│   ├── config.ts        #   which site to capture (env-overridable)
│   ├── login.ts         #   npm run capture:login
│   ├── map.ts           #   npm run capture:map   (site discovery)
│   ├── grab.ts          #   npm run capture:grab  (deep page capture)
│   ├── output/          #   captured reference material (gitignored)
│   └── README.md        #   how the capture tool works + lessons learned
├── docs/
│   ├── site-map.md      # the classic-Neopets structure we're modeling
│   └── roadmap.md       # build plan, phases, current status, open questions
└── README.md            # you are here
```

## Getting started

```bash
npm install
npm run dev          # start the app (Vite)
npm run typecheck    # tsc -b --noEmit
npm run build        # production build
```

## The reference-capture tool

We study the classic layout using **[neopetsclassic.com](https://neopetsclassic.com)**
— a logged-in, community-run revival of old Neopets — as the reference. The tool
drives real Chrome so bot checks don't block it, and saves screenshots + HTML +
a link map for us to design from. Full details and the gotchas we hit:
**[`capture/README.md`](capture/README.md)**.

Retarget it at any site via env vars (`CAPTURE_BASE_URL`, etc.) — see
`capture/config.ts`.

## Where we are right now

- ✅ Project scaffolded (Vite + React + TS, strict, builds clean)
- ✅ Reference-capture tool working against neopetsclassic.com
- ✅ Discovery pass done — see [`docs/site-map.md`](docs/site-map.md)
- ⏭️ **Next:** build the app shell (sidebar + status box) and the **Pet Central**
  hub page. See [`docs/roadmap.md`](docs/roadmap.md).

## Docs

- **[docs/site-map.md](docs/site-map.md)** — the areas/features/concepts of the
  classic site we're modeling Lilguys on.
- **[docs/roadmap.md](docs/roadmap.md)** — the phased build plan, what's done,
  what's next, and the open decisions still to make.

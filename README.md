# Lilguys

A cozy virtual-pet website — a personal **homage to the classic (early-2000s)
Neopets** era, built for the author and their friends to play together.

> **Not affiliated with Neopets.** Lilguys closely reproduces the *layout, styling,
> and behavior* of the classic look (via the community revival at neopetsclassic.com)
> as our reference — but ships **our own art, logos, pet names, and copy**. We never
> ship anyone's asset files or paste their prose verbatim. See [Ground rules](#ground-rules).

---

## What this is

Remember logging into a bright, slightly-messy pet site as a kid — adopting a
little guy, feeding it, playing goofy arcade games for coins, poking around
shops and message boards? That's the feeling we're rebuilding, as our own thing.

The gameplay loop at the heart of it: **adopt a lil guy → care for it → earn
currency by playing → spend it on items/shops → show off & socialize.**

## Ground rules

1. **Clone the look, not the assets.** We reproduce the reference site's layout,
   styling, and behavior closely — but ship **our own** pet art, item images,
   logos, pet/species names, and copy. No asset files from Neopets (classic or
   modern), and no prose pasted verbatim (write our own equivalents). Short
   functional labels ("Quick Reference", "Species") are fine to match.
   **Capture-first:** grab the real page before building it — never guess at a
   page's layout.
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
- ✅ App shell (sidebar + status box) and Pet Central / Quick Ref pages
- 🔄 **Shifting to capture-first cloning:** grab each real page before building
  it, and rebuild the pages built from assumptions (e.g. create-a-pet) to match.
- ⏭️ **Next:** crawl the main areas, then clone them page-by-page. See
  [`docs/roadmap.md`](docs/roadmap.md).

## Docs

- **[docs/site-map.md](docs/site-map.md)** — the areas/features/concepts of the
  classic site we're modeling Lilguys on.
- **[docs/roadmap.md](docs/roadmap.md)** — the phased build plan, what's done,
  what's next, and the open decisions still to make.

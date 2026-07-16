---
name: verify
description: Build, launch, and browser-drive the lilguys app to verify a change works end-to-end.
---

# Verifying lilguys changes

Runtime observation for this app (Vite + React + react-router, in-memory mock —
no backend). Prove a change by driving the running app in a real browser, not by
running tests.

## Build / typecheck

```
npm run typecheck   # tsc -b --noEmit
npm run build       # tsc -b && vite build — catches route/import breakage too
```

## Launch

```
npm run dev         # Vite dev server on http://localhost:5173
```

Vite serves the SPA with history fallback, so you can **deep-link any client
route directly** (e.g. `http://localhost:5173/shops/shop/snackery`) — no need to
load `/` and click through. Run it backgrounded and tail the log.

## Drive it (Playwright)

`playwright` is a devDependency (chromium works headless — the app has no bot
manager; that's only the `capture/` tool hitting the real site). Write a short
`.mjs` script and drive routes, screenshot, assert on the DOM.

**Gotcha that cost time:** run the drive script **from the project root**, not
the scratchpad. Node resolves `import { chromium } from "playwright"` against
`./node_modules`, so a script under `/private/tmp/.../scratchpad` fails with
`ERR_MODULE_NOT_FOUND`. Write the temp script into the repo root, `node` it, then
delete it (it's untracked; don't commit it). Screenshots can still be written to
the scratchpad and viewed with the Read tool.

Useful assertions for this app: `.banner-title` (page heading), element counts
(e.g. `.shop-dest`, `.item-cell`), disabled state on buttons, and a body-text
check for the `ComingSoon` stub (but beware false positives — e.g. a hub's
"art coming soon" placeholder caption also contains "coming soon").

Probe bad routes too — unknown `:hubId` / `:shopId` should render a graceful
"not found" page, not crash.

## Report

Verdict + steps that each did one thing to the running app and what it showed,
with a screenshot for the visual. See the base verify skill for the format.

# Capture tool

A small Playwright helper for grabbing **reference** screenshots + HTML of pages
from a site you have a login for, so we can study layout and structure while
building Lilguys' own original components.

## Ground rules

- **Reference only.** Captured screenshots/HTML stay local (they're gitignored).
  We rebuild with original assets — we don't ship anyone else's art, images, or
  copy.
- **Your login stays yours.** `login.ts` opens the real Google Chrome and *you*
  type your credentials into the real site. Your session lives in the Chrome
  profile at `capture/.profile` (gitignored). Treat that folder like a password.
- **Looks like a normal browser.** The scripts drive real Chrome with the
  automation flags removed (see `browser.ts`) so bot checks like Cloudflare's
  "are you human" don't reject the login. All three scripts share one profile and
  user-agent so a passed check stays valid across them.
- **Gentle pace.** `grab.ts` visits one page at a time with a delay between them.

## Usage

The target site defaults to neopetsclassic.com (see `config.ts`); override with
`CAPTURE_BASE_URL` / `CAPTURE_LOGIN_URL` / `CAPTURE_START_URL`.

```bash
# Uses your installed Google Chrome (channel "chrome"); no extra browser
# download needed.

# 1. Log in. Opens a real Chrome window at the login page. Log in (solve any
#    "are you human" check there), then just CLOSE THE WINDOW — that's the
#    finish signal. No terminal interaction (it often runs backgrounded).
npm run capture:login

# 2. Discovery pass: map a page's links so we can sketch the site's areas.
#    Defaults to the homepage; pass a URL to map a richer hub page instead:
npm run capture:map -- https://neopetsclassic.com/petcentral/
#    ...or crawl one hop into a few hub pages too:
npm run capture:map -- --deep 8

# 3. Deep-capture the pages you're about to build (capture-first: always grab a
#    page before cloning it). urls.txt is a working QUEUE — put the URLs you
#    still need in it (one per line), then:
npm run capture:grab
#    ...or pass URLs directly:
npm run capture:grab -- https://neopetsclassic.com/petcentral/
```

**Where discovery URLs come from:** the icon nav is a 2004 image map, not text
links, so `capture:map`'s link list misses most of it. The real nav URLs are
decoded in [`../docs/site-map.md`](../docs/site-map.md); the inventory of what's
already captured is in [`../docs/reference-captures.md`](../docs/reference-captures.md).

Map/grab run **headed by default** (a Chrome window appears and drives itself),
because bot managers block headless. To try headless anyway: `CAPTURE_HEADLESS=1
npm run capture:map`.

Map output lands in `capture/output/map/` (`sitemap.md`, `sitemap.json`, `nav.html`,
`homepage.png`). Deep-capture output lands in `capture/output/screenshots/*.png`
and `capture/output/pages/*.html`. Point me at those and I'll use them to build.

## Hard-won lessons (why the code looks the way it does)

- **Headless gets blocked.** Modern neopets.com sits behind **Akamai**, which
  hard-blocks headless Chrome ("Access Denied"); neopetsclassic.com is behind
  Cloudflare. Driving **real headed Chrome** (`channel: "chrome"`, automation
  flags stripped — see `browser.ts`) passes both. Hence headed-by-default.
- **Never use `waitUntil: "networkidle"`.** Busy game pages never go
  network-quiet, so it hangs until timeout. We use `"domcontentloaded"` + a short
  fixed settle delay instead.
- **`page.evaluate` + tsx needs a `__name` shim.** tsx/esbuild compiles the
  in-page function with a `__name` helper that doesn't exist in the browser,
  throwing "`__name is not defined`". `browser.ts` injects a no-op shim via
  `addInitScript`.
- **Persistent profile, not `storageState.json`.** The session lives in the
  gitignored Chrome profile `capture/.profile`; all scripts share it so the
  user-agent (and any bot-clearance cookie) stays consistent. Treat it like a
  password.
- **The nav is a 2004 image map, not links.** The sidebar (and Pet Central's
  icon rows) are one graphic plus `<map>`/`<area>` coordinate regions — no `<a>`
  tags and no HTML5 landmarks — so both `map.ts`'s `navEl` selector and its
  anchor-walking extractor miss the whole nav (`nav.html` comes back empty). To
  read the nav, parse the `<area href/alt>` regions out of a grabbed page's HTML.
  The decoded destinations are recorded in `../docs/site-map.md`.

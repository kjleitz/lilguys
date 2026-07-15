/**
 * capture/browser.ts
 *
 * Shared launch settings that make Playwright look like an ordinary Chrome
 * session, so bot checks (e.g. Cloudflare Turnstile) don't reject the login.
 *
 * The important pieces:
 *   - channel "chrome": drive the real installed Google Chrome, not the
 *     bundled Chromium (real user-agent, real build).
 *   - --disable-blink-features=AutomationControlled: stops Chrome from
 *     advertising itself as automated.
 *   - stealth init script: clears navigator.webdriver before page scripts run.
 *   - a persistent profile dir: keeps cookies/history so the profile isn't a
 *     suspiciously brand-new one, and keeps the same identity across runs.
 *
 * All three scripts share these so the user-agent stays identical run-to-run,
 * which is what keeps a Cloudflare clearance cookie valid across them.
 */
import { chromium, type BrowserContext } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));

/** Persistent Chrome profile for the capture tool (gitignored). */
export const PROFILE_DIR = join(HERE, ".profile");

/** Real installed Chrome, not bundled Chromium. */
export const CHANNEL = "chrome";

export const LAUNCH_ARGS = ["--disable-blink-features=AutomationControlled"];

/** Runs before any page script; removes the most obvious automation tell. */
export const STEALTH_INIT_SCRIPT =
  "Object.defineProperty(navigator, 'webdriver', { get: () => undefined });";

/**
 * tsx/esbuild compiles functions passed to page.evaluate() with a `__name`
 * helper (to preserve function names) that doesn't exist in the browser page,
 * causing "__name is not defined". Define a no-op shim so those functions run.
 */
export const ESBUILD_NAME_SHIM =
  "globalThis.__name = globalThis.__name || ((target) => target);";

/**
 * Launch a persistent, hardened Chrome context. Reused by every capture
 * script so the browser identity is stable.
 */
export async function launchContext(options: {
  headless: boolean;
}): Promise<BrowserContext> {
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: options.headless,
    channel: CHANNEL,
    args: LAUNCH_ARGS,
    viewport: options.headless ? { width: 1440, height: 900 } : null,
  });
  await context.addInitScript(STEALTH_INIT_SCRIPT);
  await context.addInitScript(ESBUILD_NAME_SHIM);
  return context;
}

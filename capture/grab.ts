/**
 * capture/grab.ts
 *
 * Reuses the logged-in browser profile from capture/login.ts to visit each URL
 * listed in capture/urls.txt and save, per page:
 *   - capture/output/screenshots/<slug>.png  (full-page screenshot)
 *   - capture/output/pages/<slug>.html       (rendered HTML)
 *
 * Goes one page at a time at a human pace. This material is REFERENCE ONLY —
 * for understanding layout/structure while building original components. Don't
 * redistribute the captured assets.
 *
 * Run: npm run capture:grab
 *   Pass URLs directly:  npm run capture:grab -- https://... https://...
 *   Watch it work (if a bot check appears):  CAPTURE_HEADED=1 npm run capture:grab
 */
import { launchContext, PROFILE_DIR } from "./browser.ts";
import { readFile, mkdir, writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { argv, env } from "node:process";

const HERE = dirname(fileURLToPath(import.meta.url));
const URLS_FILE = join(HERE, "urls.txt");
const OUT_DIR = join(HERE, "output");
const SHOTS_DIR = join(OUT_DIR, "screenshots");
const PAGES_DIR = join(OUT_DIR, "pages");

/** Delay between pages, so we browse at a gentle, human pace. */
const PAGE_DELAY_MS = 3000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/** Turn a URL into a filesystem-safe slug for output filenames. */
function slugify(rawUrl: string): string {
  const url = new URL(rawUrl);
  const path = `${url.pathname}${url.search}`.replace(/^\/+|\/+$/g, "");
  const base = path.length > 0 ? `${url.hostname}-${path}` : url.hostname;
  const slug = base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
  return slug.replace(/^-|-$/g, "").slice(0, 120) || "page";
}

async function readUrls(): Promise<string[]> {
  const fromArgs = argv.slice(2).filter((arg) => arg.startsWith("http"));
  if (fromArgs.length > 0) return fromArgs;

  if (!(await exists(URLS_FILE))) return [];
  const contents = await readFile(URLS_FILE, "utf8");
  return contents
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

async function main(): Promise<void> {
  if (!(await exists(PROFILE_DIR))) {
    console.error("\n  No logged-in profile found. Run `npm run capture:login` first.\n");
    process.exitCode = 1;
    return;
  }

  const urls = await readUrls();
  if (urls.length === 0) {
    console.error(
      "\n  No URLs to capture. Add some to capture/urls.txt (one per line),\n" +
        "  or pass them on the command line:\n" +
        "    npm run capture:grab -- https://www.neopets.com/\n",
    );
    process.exitCode = 1;
    return;
  }

  await mkdir(SHOTS_DIR, { recursive: true });
  await mkdir(PAGES_DIR, { recursive: true });

  // Headed by default: Akamai's bot manager blocks headless Chrome outright.
  // Opt into headless (may be denied) with CAPTURE_HEADLESS=1.
  const context = await launchContext({ headless: env.CAPTURE_HEADLESS === "1" });
  const page = context.pages()[0] ?? (await context.newPage());

  console.log(`\n  Capturing ${urls.length} page(s)...\n`);

  for (const [index, url] of urls.entries()) {
    const slug = slugify(url);
    const position = `[${index + 1}/${urls.length}]`;
    try {
      // "domcontentloaded" (not "networkidle") — busy game pages never go
      // network quiet. Then a short settle so late content/images render.
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
      await page.waitForTimeout(3000);
      const shotPath = join(SHOTS_DIR, `${slug}.png`);
      const htmlPath = join(PAGES_DIR, `${slug}.html`);
      await page.screenshot({ path: shotPath, fullPage: true });
      await writeFile(htmlPath, await page.content(), "utf8");
      console.log(`  ${position} ${url}\n           -> ${slug}.png + ${slug}.html`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`  ${position} ${url}\n           !! skipped: ${message}`);
    }

    if (index < urls.length - 1) await delay(PAGE_DELAY_MS);
  }

  await context.close();
  console.log(`\n  Done. Output in ${OUT_DIR}\n`);
}

main().catch((error: unknown) => {
  console.error("Capture failed:", error);
  process.exitCode = 1;
});

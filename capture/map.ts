/**
 * capture/map.ts
 *
 * A discovery pass. Reuses the session from capture/login.ts to load the
 * homepage (and, with --deep, a few top-level hub pages), then extracts the
 * navigation/link structure so we can sketch a rough map of the site's areas,
 * features, and concepts BEFORE deciding which pages to capture in detail.
 *
 * Writes to capture/output/:
 *   - map/homepage.png     full-page screenshot of the landing page
 *   - map/sitemap.json     grouped links (menu label -> links)
 *   - map/nav.html         raw HTML of the nav/header (structural ground truth)
 *   - map/sitemap.md       a readable outline of the grouped links
 *
 * This is REFERENCE ONLY (structure, not assets). Output is gitignored.
 *
 * Run: npm run capture:map
 *   Optionally crawl one hop into hub pages (gentle, capped):
 *     npm run capture:map -- --deep 8
 */
import { type Page } from "playwright";
import { launchContext, PROFILE_DIR } from "./browser.ts";
import { DEFAULT_START_URL } from "./config.ts";
import { mkdir, writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { argv, env } from "node:process";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "output", "map");

function parseStartUrl(): string {
  const fromArgs = argv.slice(2).find((arg) => arg.startsWith("http"));
  return fromArgs ?? DEFAULT_START_URL;
}

/** Delay between hub pages during a --deep crawl. */
const PAGE_DELAY_MS = 3000;

interface LinkGroup {
  label: string;
  links: { text: string; href: string }[];
}

interface PageMap {
  url: string;
  title: string;
  description: string;
  groups: LinkGroup[];
}

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

function parseDeepFlag(): number {
  const index = argv.indexOf("--deep");
  if (index === -1) return 0;
  const value = Number(argv[index + 1]);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 8;
}

/**
 * Runs in the browser. Walks every anchor, groups each under the nearest
 * enclosing menu item / labelled region, and returns structured link data
 * plus the raw HTML of the primary nav so we have ground truth to read.
 */
function extractInPage(): { map: Omit<PageMap, "url">; navHtml: string } {
  const origin = window.location.origin;

  const clean = (text: string | null): string =>
    (text ?? "").replace(/\s+/g, " ").trim();

  // Best-effort label for the menu section an anchor lives in: the nearest
  // ancestor <li> that itself contains a nested list (i.e. a parent menu item),
  // or a labelled navigation container, else a heading above it.
  const groupLabelFor = (anchor: HTMLAnchorElement): string => {
    let node: HTMLElement | null = anchor.parentElement;
    while (node && node !== document.body) {
      if (node.tagName === "LI" && node.querySelector("ul, ol")) {
        const own = node.querySelector(":scope > a, :scope > span, :scope > button");
        const label = clean(own?.textContent ?? null);
        if (label && label !== clean(anchor.textContent)) return label;
      }
      const aria = clean(node.getAttribute("aria-label"));
      if (aria) return aria;
      node = node.parentElement;
    }
    return "(ungrouped)";
  };

  const seen = new Set<string>();
  const byGroup = new Map<string, { text: string; href: string }[]>();

  for (const anchor of Array.from(document.querySelectorAll("a"))) {
    const text = clean(anchor.textContent);
    const rawHref = anchor.getAttribute("href");
    if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("javascript:")) continue;

    let href: string;
    try {
      href = new URL(rawHref, origin).toString();
    } catch {
      continue;
    }
    if (!text && !href) continue;

    const key = `${text}||${href}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const label = groupLabelFor(anchor);
    const list = byGroup.get(label) ?? [];
    list.push({ text: text || "(no text)", href });
    byGroup.set(label, list);
  }

  const groups: LinkGroup[] = Array.from(byGroup.entries())
    .map(([label, links]) => ({ label, links }))
    .sort((a, b) => b.links.length - a.links.length);

  const navEl =
    document.querySelector("header") ??
    document.querySelector('[role="navigation"]') ??
    document.querySelector("nav");

  const metaDesc = document
    .querySelector('meta[name="description"]')
    ?.getAttribute("content");

  return {
    map: {
      title: clean(document.title),
      description: clean(metaDesc ?? null),
      groups,
    },
    navHtml: navEl?.outerHTML ?? "",
  };
}

async function mapPage(page: Page, url: string): Promise<{ map: PageMap; navHtml: string }> {
  // "domcontentloaded" (not "networkidle") — busy game pages never go network
  // quiet. Then a short settle so JS-rendered nav has time to appear.
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.waitForTimeout(3000);
  const { map, navHtml } = await page.evaluate(extractInPage);
  return { map: { url, ...map }, navHtml };
}

function toMarkdown(maps: PageMap[]): string {
  const lines: string[] = ["# Site map (discovery pass)", ""];
  for (const pageMap of maps) {
    lines.push(`## ${pageMap.title || pageMap.url}`);
    lines.push(`<${pageMap.url}>`);
    if (pageMap.description) lines.push(`\n> ${pageMap.description}`);
    lines.push("");
    for (const group of pageMap.groups) {
      lines.push(`### ${group.label}  _(${group.links.length})_`);
      for (const link of group.links) {
        lines.push(`- [${link.text}](${link.href})`);
      }
      lines.push("");
    }
  }
  return lines.join("\n");
}

async function main(): Promise<void> {
  if (!(await exists(PROFILE_DIR))) {
    console.error("\n  No logged-in profile found. Run `npm run capture:login` first.\n");
    process.exitCode = 1;
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });
  const deepCount = parseDeepFlag();
  const startUrl = parseStartUrl();

  // Headed by default: Akamai's bot manager blocks headless Chrome outright.
  // Opt into headless (may be denied) with CAPTURE_HEADLESS=1.
  const context = await launchContext({ headless: env.CAPTURE_HEADLESS === "1" });
  const page = context.pages()[0] ?? (await context.newPage());

  console.log(`\n  Mapping ${startUrl} ...`);
  const home = await mapPage(page, startUrl);
  await page.screenshot({ path: join(OUT_DIR, "homepage.png"), fullPage: true });
  await writeFile(join(OUT_DIR, "nav.html"), home.navHtml, "utf8");

  const maps: PageMap[] = [home.map];

  if (deepCount > 0) {
    // Pick a few in-site hub pages to expand: the first link from each of the
    // largest groups, staying on the same host, deduped, capped at deepCount.
    const host = new URL(startUrl).host;
    const hubs: string[] = [];
    const seen = new Set<string>([startUrl]);
    for (const group of home.map.groups) {
      const candidate = group.links.find((link) => {
        try {
          return new URL(link.href).host === host && !seen.has(link.href);
        } catch {
          return false;
        }
      });
      if (candidate) {
        hubs.push(candidate.href);
        seen.add(candidate.href);
      }
      if (hubs.length >= deepCount) break;
    }

    for (const [index, url] of hubs.entries()) {
      console.log(`  Mapping hub [${index + 1}/${hubs.length}] ${url}`);
      try {
        const result = await mapPage(page, url);
        maps.push(result.map);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`    !! skipped: ${message}`);
      }
      if (index < hubs.length - 1) await delay(PAGE_DELAY_MS);
    }
  }

  await writeFile(join(OUT_DIR, "sitemap.json"), JSON.stringify(maps, null, 2), "utf8");
  await writeFile(join(OUT_DIR, "sitemap.md"), toMarkdown(maps), "utf8");

  await context.close();
  console.log(`\n  Done. Map written to ${OUT_DIR}`);
  console.log("  Tell me it's ready and I'll read it and sketch the site outline.\n");
}

main().catch((error: unknown) => {
  console.error("Mapping failed:", error);
  process.exitCode = 1;
});

/**
 * capture/login.ts
 *
 * Opens the real Google Chrome (hardened so bot checks don't reject it) pointed
 * at the Neopets login page. YOU type your username/password into the real site
 * — this script never sees or stores your credentials. Your session is written
 * to the browser profile at capture/.profile (gitignored) automatically as you
 * browse, and is reused by the map/grab scripts.
 *
 * When you're done, just CLOSE the Chrome window — that's the finish signal. No
 * terminal interaction needed (which matters, since this often runs backgrounded).
 *
 * Treat capture/.profile like a password — it holds your logged-in cookies.
 *
 * Run: npm run capture:login
 */
import { launchContext, PROFILE_DIR } from "./browser.ts";
import { LOGIN_URL } from "./config.ts";

async function main(): Promise<void> {
  const context = await launchContext({ headless: false });
  const page = context.pages()[0] ?? (await context.newPage());

  await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded" });

  console.log("\n  A real Chrome window is open.");
  console.log("  1. Log into your Neopets account in that window.");
  console.log("     (Solve the 'are you human' check there if it appears.)");
  console.log("  2. When you're fully logged in, just CLOSE the Chrome window.");
  console.log("     Your session saves automatically — no need to touch this terminal.\n");
  console.log("  Waiting for you to log in and close the window...");

  // The user closing the browser window is our finish signal. The persistent
  // profile has already saved the session cookies by then.
  await new Promise<void>((resolve) => {
    context.on("close", () => resolve());
  });

  console.log(`\n  Session stored in the browser profile: ${PROFILE_DIR}`);
  console.log("  You can now run: npm run capture:map\n");
}

main().catch((error: unknown) => {
  console.error("Login capture failed:", error);
  process.exitCode = 1;
});

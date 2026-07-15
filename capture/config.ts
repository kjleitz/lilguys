/**
 * capture/config.ts
 *
 * Which site the capture tool points at. Defaults to the classic Neopets
 * revival; override any value with the matching environment variable, e.g.:
 *   CAPTURE_BASE_URL=https://example.com npm run capture:map
 */
import { env } from "node:process";

/** Root of the site we're capturing (no trailing slash). */
export const BASE_URL = (env.CAPTURE_BASE_URL ?? "https://neopetsclassic.com").replace(
  /\/+$/,
  "",
);

/** Page login.ts opens for you to sign in on. */
export const LOGIN_URL = env.CAPTURE_LOGIN_URL ?? `${BASE_URL}/loginpage/`;

/** Default starting page for the discovery map (a URL arg overrides it). */
export const DEFAULT_START_URL = env.CAPTURE_START_URL ?? `${BASE_URL}/`;

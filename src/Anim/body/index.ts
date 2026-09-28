import { BodyIcon, bodyBase } from "./base";
import { BODY_CATALOG } from "./catalog";

/** Body bases keyed "c:<slug>", so they never clash with library slugs. */
export const BODY_ICONS: Record<string, BodyIcon> = Object.fromEntries(
  BODY_CATALOG.map((e) => [`c:${e.id}`, bodyBase(e.def, e.mirror)]),
);

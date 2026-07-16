# Reference captures — what we've grabbed

An inventory of the neopetsclassic.com pages we've deep-captured, so you know
what reference already exists before re-grabbing anything.

- Files live under **`capture/output/` and are gitignored** (local reference
  only — never committed or redistributed). If they're missing on a fresh
  clone, re-capture them (see [`capture/README.md`](../capture/README.md)).
- Each grab produces `screenshots/<slug>.png` (full-page) + `pages/<slug>.html`
  (rendered HTML). Slugs are `neopetsclassic.com-<path>`.
- "Cloned?" tracks whether we've built our own version yet.

## Pet system

| Page | URL | Cloned? |
|---|---|---|
| Pet Central (hub) | `/petcentral/` | ✅ `PetCentral.tsx` (layout approximated) |
| Quick Ref | `/quickref/` | ✅ `QuickRef.tsx` (faithful) |
| Quick Ref — reorder/options | `/quickref/adjust_position/` | ⬜ not yet |
| Create-a-Pet, step 1 | `/addpet/` | ✅ `CreatePet.tsx` step 1 (faithful) |
| Description (edit) | `/neopet_desc/` | ⬜ captured, not built |
| Abilities | `/abilities/` | ⬜ captured, not built |
| Trophies / prizes | `/prizes/` | ⬜ captured, not built |
| Pet's page (customise homepage) | `/edithomepage/` | ⬜ captured, not built |
| How to feed | `/howtofeed/` | ⬜ captured, not built (feeding waits on economy) |
| Public pet lookup | `/petlookup/?pet_name=…` | ⬜ captured, not built (public view) |
| Pet's belongings | `/neopet_items/?pet_name=…` | ⬜ captured, not built |

## Core shell / economy

| Page | URL | Cloned? |
|---|---|---|
| Inventory | `/inventory/` | ⬜ captured, not built (Phase 3 leftover) |
| Shops — Neopia Central (hub) | `/objects/` | ✅ `ShopsHub.tsx` (placeholder map + hotspot tiles) |
| Shops — Bazaar (sub-hub) | `/market_bazaar/` | ✅ `ShopsHub.tsx` |
| Shops — Plaza (sub-hub) | `/market_plaza/` | ✅ `ShopsHub.tsx` |
| Shops — shop front | `/viewshop/?shop_id=2`, `=3` | ✅ `ShopFront.tsx` (item grid; buying off until Phase 4) |
| The Pound | `/pound/` | ⬜ captured, not built |
| Neomail | `/neomessages/` | ⬜ captured, not built (Phase 6) |
| User lookup | `/userlookup/?user=…` | ⬜ captured, not built |

## Not yet captured (need a grab before building)

- **`/customizepet/`** — create-a-pet **step 2** (colour/name). Only loads after
  POSTing a species choice, so a plain GET can't reach it. Walk the real create
  flow, then grab it. Our step 2 is inferred until then.
- Anything under **World / Explore / Games / Boards / News** — capture per-area,
  just before building that area (capture-first).

## The sidebar is a bitmap, not markup

The reference sidebar (and Pet Central's icon rows) are **2004-style image maps**
— one graphic plus `<map>`/`<area>` coordinate regions. We can't reuse the image,
so our sidebar is an *original recreation* of that look (styled HTML nav), not a
pixel copy. The real nav destinations are decoded in
[`site-map.md`](site-map.md#real-navigation-decoded-from-the-captured-html).

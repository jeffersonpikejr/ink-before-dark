# Working rules for Claude — Ink Before Dark

One verb: draw. Read `README.md` for the six rules the pilot sails by and `ROADMAP.md` for scope before changing anything.

## Direction (set by Jefferson 2026-11-22)
The target is an Apple App Store game with ads, and play that gets more interesting the longer you play. `ROADMAP.md` is the plan. The earlier "anything added deletes something" rule and closed cut list are retired; what replaces them are the three tests at the top of the roadmap (drawable, visible, benched).

## Feature freeze (2026-11-25)
Features are frozen at v0.14 until the playtest gate in `ROADMAP.md` passes (4 of 10 outside testers back within 48 hours). Bug fixes and fixes for drop-off points the play logs show are allowed; new mechanics, coasts and store features are not, unless Jefferson says otherwise. (He did on 2026-11-25 for v0.15: cloud, ice, lanes and the log, from his own play notes. That was one exception, not the end of the freeze.)

## Feature design rule (Jefferson, 2026-11-25)
Every feature asks for its own pen gesture and must be beatable by skill alone; nothing may hide information the player has no way to get. New coasts come from new combinations of the deck in `ROADMAP.md` on new terrain. Weather and traffic are generated from their own random stream (`R2` in `tryBay`) so adding one never moves a rock.

## Tutorial cards (v0.16)
The cards are `CARDS` in `index.html`: a picture function, a title, one sentence (16 words at most), and for a mechanic the dusk caption (`h`). Rules:
- **A new mechanic needs a card.** Add it to `CARDS` and to `feats()`, which reads the bay, not the coast number. `node test/cards.mjs` fails if a shipped chart asks for something with no card.
- Pictures are drawn with the `v*` helpers on a 400×250 space, in the game's own colours. No screenshots, no text blocks. Each needs a still moment (`s`) for reduce-motion.
- Seen cards live in `META.cards` (additive; the save schema stays 1). A card is shown once. The guided first night is `S.guide`, spent when that night ends.
- To look at pictures: `IBD.sheet([['ice',2.9],['ice',7.2]],2,.98)` in a browser, then `IBD.unsheet()`. To see one card in its frame: `IBD.cardAt('lanes',6.9)`.
- After any change to cards or the first-night flow, run the walk: clear `ibd_save`, reload, then `await import('./test/walk.js'); WALK.run()` at 375×812, 812×375, 768×1024 and 1024×768. It must report no problems and no card never shown.

## Ship
Public repo `jeffersonpikejr/ink-before-dark`, GitHub Pages from `main` root: https://jeffersonpikejr.github.io/ink-before-dark/ . Ship with the `ship-verify` skill and prove the live URL serves the new `VERSION`. `notes/` is git-ignored and stays off GitHub.

## App Store wrapper
`index.html` at the repo root is the game and what GitHub Pages serves. `npm run build` copies it to `www/` (git-ignored); `npm run ios` syncs it into `ios/` and opens Xcode. Read `store/APP_STORE.md` first: it is the true handoff and says what has never been compiled. The game-side native code is `Native` and `Ads` in `index.html`; this project's own Swift is the local package `native/ibd-native/` (one `@objc` plugin class per file, or `cap sync` misses it). Every native call must be safe to fail: the game plays without any plugin. `node test/native.mjs` runs that code against stand-in plugins and must pass. Ad unit ids in the repo are Google's public test ids; real ids go in only at submission. When `sw.js` exists, bump its `CACHE` string with every version.

## Testing
- `npm test` runs everything below plus the card, native and offline checks, and rebuilds `www/` first.
- `node test/charts.mjs` must report 0 failing charts after any change to the generator, pilot or `CFG`; if it does not, re-pick that coast's seeds.
- `node test/bench.mjs` (400 bays, ~40 s) after any change to the pilot, the generator or `CFG`. It prints FAIL when the middle bot is outside 40–70%; at v0.5 it read 71%. Do not edit the thresholds to turn it green.
- When the Browser pane is hidden, animation frames do not fire. Use `IBD.pause(); IBD.still(); IBD.start(seed)` and drive time with `IBD.step(seconds)`; draw through the real handlers with `IBD.pen([[x,y],…])` or the drag tool. A screenshot can lag one paint behind a script: wait two seconds first.
- Save hygiene: tests write `ibd_save` in that browser's localStorage. Remove it when done so the title does not show a test result as tonight's.

## Commits
Author `Jefferson Pike`. One coherent version per commit on `main`; the README changelog and the `VERSION` const move together.

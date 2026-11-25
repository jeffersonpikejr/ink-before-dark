# Working rules for Claude — Ink Before Dark

One verb: draw. Read `README.md` for the six rules the pilot sails by and `ROADMAP.md` for scope before changing anything.

## Direction (set by Jefferson 2026-11-22)
The target is an Apple App Store game with ads, and play that gets more interesting the longer you play. `ROADMAP.md` is the plan. The earlier "anything added deletes something" rule and closed cut list are retired; what replaces them are the three tests at the top of the roadmap (drawable, visible, benched).

## Feature freeze (2026-11-25)
Features are frozen at v0.14 until the playtest gate in `ROADMAP.md` passes (4 of 10 outside testers back within 48 hours). Bug fixes and fixes for drop-off points the play logs show are allowed; new mechanics, coasts and store features are not, unless Jefferson says otherwise.

## Ship
Public repo `jeffersonpikejr/ink-before-dark`, GitHub Pages from `main` root: https://jeffersonpikejr.github.io/ink-before-dark/ . Ship with the `ship-verify` skill and prove the live URL serves the new `VERSION`. `notes/` is git-ignored and stays off GitHub.

## App Store wrapper
`index.html` at the repo root is the game and what GitHub Pages serves. `npm run build` copies it to `www/` (git-ignored); `npm run ios` syncs it into `ios/` and opens Xcode. Read `store/APP_STORE.md` first. Ad unit ids in the repo are Google's public test ids; real ids go in only at submission. When `sw.js` exists, bump its `CACHE` string with every version.

## Testing
- `node test/charts.mjs` must report 0 failing charts after any change to the generator, pilot or `CFG`; if it does not, re-pick that coast's seeds.
- `node test/bench.mjs` (400 bays, ~40 s) after any change to the pilot, the generator or `CFG`. It prints FAIL when the middle bot is outside 40–70%; at v0.5 it read 71%. Do not edit the thresholds to turn it green.
- When the Browser pane is hidden, animation frames do not fire. Use `IBD.pause(); IBD.still(); IBD.start(seed)` and drive time with `IBD.step(seconds)`; draw through the real handlers with `IBD.pen([[x,y],…])` or the drag tool. A screenshot can lag one paint behind a script: wait two seconds first.
- Save hygiene: tests write `ibd_save` in that browser's localStorage. Remove it when done so the title does not show a test result as tonight's.

## Commits
Author `Jefferson Pike`. One coherent version per commit on `main`; the README changelog and the `VERSION` const move together.

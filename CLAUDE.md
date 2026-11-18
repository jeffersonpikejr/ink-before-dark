# Working rules for Claude — Ink Before Dark

One verb: draw. Read `README.md` for the six rules the pilot sails by and `ROADMAP.md` for scope before changing anything.

## Scope
- **Finished when:** a stranger can play three nights on tonight's bay on a phone, wince at dawn, and paste the result.
- **Anything added deletes something of equal size in the same commit.**
- The cut list in `ROADMAP.md` (P4) is closed: no player steering, currents, tide-as-hazard, wind, erasing, upgrades, roster of pilots, or third meter. Each was proposed and cut in review; `notes/critics.md` has the reasons.
- P1 is five strangers, not code. Do not tune ink, tide or rock counts from the bots alone.

## Local only
No remote is configured. Do not create one, push, or publish until Jefferson decides public or private.

## Testing
- `node test/bench.mjs` (400 bays, ~40 s) after any change to the pilot, the generator or `CFG`. It prints FAIL when the middle bot is outside 40–70%; at v0.4 it reads 71%. Do not edit the thresholds to turn it green.
- When the Browser pane is hidden, animation frames do not fire. Use `IBD.pause(); IBD.still(); IBD.start(seed)` and drive time with `IBD.step(seconds)`; draw through the real handlers with `IBD.pen([[x,y],…])` or the drag tool. A screenshot can lag one paint behind a script: wait two seconds first.
- Save hygiene: tests write `ibd_save` in that browser's localStorage. Remove it when done so the title does not show a test result as tonight's.

## Commits
Author `Jefferson Pike`. One coherent version per commit on `main`; the README changelog and the `VERSION` const move together.

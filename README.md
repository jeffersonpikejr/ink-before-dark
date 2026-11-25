# INK BEFORE DARK

*Whatever you leave off the chart, she finds in the dark.*

A single-file browser game with one verb: **draw**. You get twenty seconds of failing light and one bottle of ink to chart a small bay. Then Odile takes the mail boat round three harbour lamps by your chart alone. She keeps clear of your ink and trusts blank paper completely. Every rock you left off costs her time, and the bay inks it onto your chart in red. If the tide goes out before the third lamp, she waits the night on the bar.

Your chart doesn't have to be true. It has to bring her home.

**Status:** v0.15 (2026-11-25): cloud, ice and shipping lanes rebuilt from play notes; a daily log. Otherwise frozen for a playtest. Ten coasts, 100 charts; App Store wrapper prepared, not yet built.

**▶ Play in your browser: https://jeffersonpikejr.github.io/ink-before-dark/** — on an iPad or iPhone, Share → Add to Home Screen runs it full-screen.

## Run it locally

```bash
python3 -m http.server 8471 --directory ~/code/ink-before-dark
```

Then open http://localhost:8471. Or double-click `index.html`: it is one self-contained file with no dependencies and no build step.

- **Dusk.** Draw with a finger or the mouse. Three of the six harbour lamps are numbered tonight: she visits them in that order. The light fails over twenty seconds, and the ink bar is all you get. `Space` casts off early.
- **Night.** Watch. Her dotted course is pencilled on your chart. Hold the pointer (or `Space`) to hurry.
- **Dawn.** Her night is retraced along her wake, and the truth appears beneath it.
- Three nights on one bay. The chart persists; each dusk brings a fresh, smaller bottle and three other lamps. `M` mutes.

## The rules she sails by (all of them)

1. She plans the shortest way to the lit lamp that stays 14 units clear of your ink. The faint margin round every stroke is exactly that water.
2. She knows the plain shoreline. She does not know rocks, or the land that juts out from the shore: headlands, spits and islands. Touch one of those with ink and she knows all of it; a rock needs a stroke across her course.
3. When she strikes a rock it costs her about two seconds, the bay draws that rock on your chart in red, and she re-plans around it.
4. If your ink leaves her no way through, she crosses your thinnest line.
5. The tide allows her about one strike. Two and she is late. Walling off half the bay makes her late too.
6. A stroke *across* her course turns her. A stroke *along* it does nothing. A stroke can also send her into a rock you did not mark.

## The bench

`node test/bench.mjs` runs three bots across 400 seeded bays and prints how often each brings her home. It exists because the design had a written kill criterion: a blank chart must nearly always lose, a chart drawn with perfect knowledge must nearly always win, and a sensible chart drawn without knowing the lamp order must land in between.

| Bot | What it does | Home, nights 1 / 2 / 3 | All nights | Bar set beforehand |
|---|---|---|---|---|
| blank | draws nothing | 6% / 13% / 24% | **14%** | ≤ 15% |
| slash ("six-line ruler") | one stroke across every rock on the six lines joining start and lamps | 53% / 70% / 90% | **71%** | 40–70% |
| omni | knows tonight's lamp order, same ink | 93% / 91% / 95% | **93%** | ≥ 90% |

The band is open, and the middle bot sits one point above its ceiling, so the script exits non-zero and says so. The bots draw instant, clean strokes; they cannot tell you how much of twenty seconds a person wastes. That is what the next phase is for (see `ROADMAP.md`).

Tuning knobs live in one `CFG` object at the top of the script; the bench accepts overrides, e.g. `node test/bench.mjs 200 1 RATION=0.5,0.4,0.36`.

## Under the hood

One `index.html` (about 600 lines): canvas rendering, a Dijkstra pilot on an 8-unit grid with string-pulled paths, seeded bay generation (mulberry32, value noise), Web Audio synth, a versioned `localStorage` save (`ibd_save`, schema 1), fixed-timestep loop. Portrait phones rotate the chart to fill the screen. Timed captions ride the game clock, not `setTimeout`, so a backgrounded tab cannot desynchronise them.

Debug API in the console: `IBD.start(seed)` · `IBD.step(seconds)` (drives time by hand when animation frames are asleep) · `IBD.pause()` · `IBD.still()` (no CSS transitions) · `IBD.pen([[x,y],…])` (draws through the real pointer handlers) · `IBD.castOff()` · `IBD.info()` · `IBD.bench(n)`.

## Changelog

### v0.15 — One gesture each (2026-11-25)
- **Cloud replaces fog.** Banks of cloud cross the bay on the wind while you draw. Nothing under them stays hidden; waiting shows it, and waiting costs light. Your ink and the lamps always show through.
- **Ice is no longer an island that moves.** A berg drifts one way down the wind all night and then grounds. Dusk shows where it lies, the track it will take with a tick for each quarter of the tide, and where it ends. You ink where it will be.
- **Ships run lanes from harbour to harbour**, in convoy, round whatever lies between. Trace a ship's length of a lane and she gives way to its ships; an uncharted lane she crosses blind, and the ship that finds her puts the lane on the chart in red. Two to four lanes a bay, each timed to cross that night's best course.
- **The log.** Nights in a row on tonight's bay, shown on the title as a seven-day strip. Finishing keeps it, win or lose; a lay day covers a missed night; each night kept puts a supply in the locker.
- Seven charts re-picked so that all 100 still obey the rule (a blank chart loses the first night, a perfect chart wins all three).

### v0.14 — Do they come back? (2026-11-25)
- A play log kept on the device: sessions, charts started and finished, nights home, start-overs, mid-chart quits, wheel spins. "Send play log" on the title hands the player a text to pass on; nothing is sent anywhere by the game.
- Ad rules tightened after a business review: five rewarded ads a day at most; no interstitial in a player's first session, then at most one for every three finished charts and only after a chart she got home from; tracking consent asked once after the first finished chart, never at launch.
- Features are frozen here until ten outside testers have played.

### v0.13 — Ready to wrap (2026-11-25)
- App icon, web manifest and an offline service worker (network first, so a new version always wins).
- One ad interface for the whole game: a placeholder on the web; AdMob rewarded and interstitial calls inside the app, on Google's test ids. Interstitials only between charts, never on the first coast, never two charts running.
- `privacy.html`.
- `ios/`: a Capacitor 8 project (Swift Package Manager) with the icon, AdMob test app id and tracking-permission text set. **Not built or run: the machine it was made on has no Xcode.** `store/APP_STORE.md` is the step-by-step from here to TestFlight.

### v0.12 — Ten coasts (2026-11-25)
- Seven new coasts, 70 new charts, each built round one new feature and combining earlier ones:
  - **4 The Drying Shore**: dashed rocks are under water tonight and bare on a later night.
  - **5 The Fog Banks**: fog hides part of the chart at dusk, off her course the first night, then moving and growing.
  - **6 The Delta**: dotted sand closes once she has made the lamp numbered on it.
  - **7 The Ice**: floes drift to and fro along lanes shown at dusk.
  - **8 The Wreckers' Coast**: a light with no harbour is false; touch it with ink or she steers for it first.
  - **9 The Roads**: ships keep to their lanes all night, without lights.
  - **10 The Long Passage**: six lamps a night, one bottle, every feature.
- Nights escalate on every new coast (more bare rocks, more fog, more false lights, more traffic).
- Coast screen has previous and next buttons and numbers the coasts.
- `node test/charts.mjs` checks all 100 charts: a blank chart loses the first night and a perfect chart wins all three. All 100 pass.

### v0.11 — Forks and barges (2026-11-25)
- The River reworked to be harder: tighter meanders, islets mid-channel that fork it, rocky spurs off the banks, rougher shores, more rocks, a tighter tide.
- Its nights now escalate. Night one is still water. Night two the river runs against her and sets her west, onto what she cleared before. Night three, barges lie at anchor on the inside of the bends, exactly where she likes to cut.
- Roadmap rewritten for 100 charts on ten coasts, each coast one new feature combined with earlier ones.

### v0.10 — The River (2026-11-23)
- A third coast, opened by twelve lamps on the second: ten reaches of a winding river, sailed west to east. Three ports a night, each farther upriver than the last, always ending at the far port.
- The river winds harder with every reach, from a lazy S on the first to tight meanders on the tenth. No current on this coast.
- She knows the outer line of the valley; each point of land the river bends round is hers to be told about, with a touch of ink. Rocks sit in the channel, where a stroke that is too wide closes it.
- Coast screen cycles through all three coasts.

### v0.9.1 — Developer mode (2026-11-22)
- Developer mode opens every coast and every bay for testing. Turn it on by adding `?dev` to the address, or with five quick taps on the small print under the title; five more turn it off. The title's small print and the coast heading say when it is on.

### v0.9 — The River Mouths (2026-11-22)
- A second coast of ten bays, opened by twelve lamps on the first. A river cuts through the north shore of each bay and its current carries her down-stream of her pencilled course, so rocks beside the line matter and strokes have to be drawn with the drift in mind.
- The current is drawn as moving arrows at dusk and faintly at night; it grows from gentle on bay 1 to strong on bay 10.
- Coast screen switches between The Strait and The River Mouths; Reset coast clears the one on screen.
- Bench takes `COAST=1`.

### v0.8 — What juts out (2026-11-22)
- Terrain: ragged, lobed islands; angular rocks; shores with fine noise that bites deeper on headlands; bays now vary in shape, with one to three headlands (sometimes a long peninsula), coves, and spits off either side.
- The land is a hazard: she knows the plain shore but not headlands, spits or islands. Any ink that touches one flags the whole piece for her; one she strikes unflagged costs time and is revealed whole.
- Two more mastery marks, SPARE (a third of every bottle unused) and FIRST (three lamps on the first try), beside DRY.
- The coast screen is a drawn strait: bays 1–5 in coves along the north shore, 6–10 back along the south.
- Bots follow the numbered order. Bench, 80 bays: blank 8%, ruler 64%, perfect knowledge 93–95%.

### v0.7 — Harbours (2026-11-22)
- Pencil and touch precision: strokes are mapped through the canvas's real on-screen box, and every coalesced Pencil sample is used.
- More ink: every coast bay gets at least the bottle bay ten gets.
- Tonight's lamps are numbered 1, 2, 3 in the order she visits them.
- Harbours: planked piers on a quay, a few roofs and a spire or lighthouse behind each. Later bays put harbours on islands.
- Supplies: a wheel (behind an ad placeholder) wins one-night extras — ink, dusk light, tide — spent with buttons at dusk.

### v0.6 — The Coast (2026-11-22)
- A coast of ten bays, each harder than the last (ten rocks and a generous bottle on bay 1; twenty-two and a lean one on bay 10). Every night she gets home lights one of a bay's three lamps; two lamps open the next bay. Progress is saved.
- The ten bays are fixed seeds picked by the bench: on each, a blank chart loses and a perfect chart brings her home all three nights.
- **Start over** (bottom right, two taps): the same bay from its first dusk with a blank chart. **Reset coast** on the coast screen erases all lamps.
- A Leave button; bench accepts `LEVEL=0..9` to test a coast bay's difficulty.

### v0.5 — Out of the drawer (2026-11-22)
- Public repo and GitHub Pages hosting; home-screen meta tags so it runs full-screen on iPad and iPhone.
- Roadmap rewritten: from a three-night prototype to a coast of bays, new waters, pilots, daily habits, and an App Store build.

### v0.4 — Dawn reads it back (2026-11-18)
- Dawn retraces her night in order: the truth appears along her wake as the sweep passes, each strike landing as it is reached. On the last dawn the rest of the bay follows.
- Title shows the first result on tonight's bay.
- Played at human pace on an unseen bay: seven strokes used the whole bottle in 16.6 seconds.

### v0.3 — A chart has an edge (2026-11-18)
- Portrait phones rotate the chart; thumb strokes map correctly through the rotation.
- The night runs 16% faster with strike cost and tide rescaled together.
- The final dawn ends on Odile's verdict of the chart.
- A neatline frames the chart; captions get their own band.

### v0.2 — The margin she keeps (2026-11-18)
- Six lamp sites, a new trio each night on the same bay and chart.
- The dusk clock starts when the bay appears. She can see the land. A fresh bottle each dusk.
- A faint margin round every stroke shows the water she will keep out of.
- Captions moved to the game clock; the first missed tide teaches that a stroke across her course is enough.

### v0.1 — Dusk, night, dawn (2026-11-18)
- First playable: draw, watch, read back. Bots and the bench.

# INK BEFORE DARK

*Whatever you leave off the chart, she finds in the dark.*

A single-file browser game with one verb: **draw**. You get twenty seconds of failing light and one bottle of ink to chart a small bay. Then Odile takes the mail boat round three harbour lamps by your chart alone. She keeps clear of your ink and trusts blank paper completely. Every rock you left off costs her time, and the bay inks it onto your chart in red. If the tide goes out before the third lamp, she waits the night on the bar.

Your chart doesn't have to be true. It has to bring her home.

**Status:** prototype v0.4 (2026-11-18). Local only; nothing is published.

## Play

```bash
python3 -m http.server 8471 --directory ~/code/ink-before-dark
```

Then open http://localhost:8471. Or double-click `index.html`: it is one self-contained file with no dependencies and no build step.

- **Dusk.** Draw with a finger or the mouse. Three of the six harbour lamps are marked tonight; she will visit them in an order you are not told. The light fails over twenty seconds, and the ink bar is all you get. `Space` casts off early.
- **Night.** Watch. Her dotted course is pencilled on your chart. Hold the pointer (or `Space`) to hurry.
- **Dawn.** Her night is retraced along her wake, and the truth appears beneath it.
- Three nights on one bay. The chart persists; each dusk brings a fresh, smaller bottle and three other lamps. `M` mutes.

## The rules she sails by (all of them)

1. She plans the shortest way to the lit lamp that stays 14 units clear of your ink. The faint margin round every stroke is exactly that water.
2. She can see the loom of the land. She cannot see rocks. Blank paper is open water to her.
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

`notes/` holds how the concept was chosen: the creator brief, 33 seeds, the three finalists, the five-seat critic bench with its tally, and the chair's ruling.

## Changelog

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

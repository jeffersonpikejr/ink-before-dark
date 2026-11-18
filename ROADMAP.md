# INK BEFORE DARK — Roadmap

**Finished when:** a stranger can play three nights on tonight's bay on a phone, wince at dawn, and paste the result.

**The scope rule:** anything added deletes something of equal size in the same commit.

Phases ship one at a time and each ends playable. Dates are ship dates.

---

## ✅ P0 — The prototype (2026-11-18)

1. ✅ One verb: draw. Freehand ink with a ration and a minimum blot per pen-down.
2. ✅ The pilot: shortest course clear of the ink, trusts blank paper, shows her course, re-plans after a strike, crosses the thinnest line if walled in.
3. ✅ One clock, one loss: the tide. A strike costs time; nothing has hit points.
4. ✅ Three nights on one seeded bay; the chart persists; three other lamps each night.
5. ✅ Dawn retraces her night along her wake; the whole bay on the third dawn; Odile's verdict.
6. ✅ Tonight's bay (one seed per date) and a share line.
7. ✅ Bench with three bots; phone portrait layout; versioned save.

## 🔜 P1 — Five strangers (no new features)

The bots draw perfect strokes in zero seconds. Everything that matters next is what a person does with twenty.

1. Put v0.4 in front of five people who have not seen it, on their own phone or laptop. Say nothing for two minutes. One of them should be Katherine.
2. Write down, per person: did they circle or strike through; the second they understood she follows the chart; home or late on night one; whether they started a second bay unasked.
3. Listen to it. No human has heard the audio; it was written and never played aloud.
4. Tune from those five sessions only: ink ration, tide slack, dusk length, rock count. Re-run `node test/bench.mjs` after each change.
5. **Kill criterion:** if fewer than three of the five start a second bay unprompted, stop here and write down why.

## P2 — The whole game (v1.0)

1. The keepsake: export the finished chart as an image, and attach it to the share line.
2. Bay variety inside the one bay type: reefs (long rocks), islets, a narrows. No new kind of hazard.
3. Phone polish: an installable page (manifest and icons), a thumb-offset option so the finger does not hide the stroke, a buzz on a strike.
4. Settings: volume, no screen shake. Red already never carries meaning alone (hatch and a cross go with it).
5. Tonight's bay records the first attempt and says so; later tries are practice.
6. Decide public or private, then ship with `ship-verify`. **v1.0 is declared finished here.**

## P3 — Only if people keep coming back

1. A drawer of your finished charts, by date.
2. A seven-night passage: same rules, one bay, one chart.
3. A link that hands a friend the same bay.

## P4 — Out, on purpose

Player steering · currents · the tide as a hazard · wind · erasing · chart symbols with meanings · upgrades · a roster of pilots · other boats · a story beyond Odile's lines · any third meter.

Each of these was proposed and cut during the design review. Steering was the game's second verb and two critics voted to kill the concept over it; the hull was cut so that nothing in the game has hit points. They stay out unless something of equal size leaves.

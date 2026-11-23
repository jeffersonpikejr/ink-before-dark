# INK BEFORE DARK — Roadmap

**Where it is going:** an App Store game for iPhone and iPad, free with ads, that is still one verb — draw — and gets more interesting the longer you play.

**Play the current build:** https://jeffersonpikejr.github.io/ink-before-dark/

Phases ship one at a time and each ends playable. Dates are ship dates.

## Three tests every new feature must pass

1. **Drawable.** It changes what is worth drawing. If the player's ink cannot answer it, it does not go in.
2. **Visible.** Its rule can be seen on the chart or in her course. Nothing she does is unexplained.
3. **Benched.** `test/bench.mjs` gets a bot for it, and a blank chart must still lose while a perfect one still wins.

Still out for good: steering the boat yourself, anything with hit points, and upgrades that buy power. Progress is new water and new marks, never a stronger boat.

## The loops, smallest to largest

| Loop | Length | What pulls you into the next one |
|---|---|---|
| A night | 45 seconds | Dawn shows exactly which rock cost you the tide. |
| A bay | 3 nights, about 3 minutes | The chart you built is tested on new lamps; Odile's verdict. |
| A coast | 8–10 bays | Each coast adds one new kind of water. Lamps earned open the next coast. |
| The almanac | weeks | Finished charts are kept. Pilots, marks and papers are collected. |
| The day | once a day | Tonight's bay, the same for everyone, with a streak and a result to paste. |

---

## ✅ P0 — The prototype (2026-11-18)
One verb, one pilot, one clock, three nights on a seeded bay, dawn readback, tonight's bay, a share line, a three-bot bench, portrait phone layout.

## ✅ P0.5 — Out of the drawer (2026-11-22)
Public repo, GitHub Pages, home-screen meta tags for iPad.

## 🔜 P1 — Hands on glass
The build has never been played in real time by a person. Fix what the iPad shows before adding anything.

1. Play ten bays on the iPad. Note every moment the finger hides the stroke, a tap misfires, or the night drags.
2. Listen to it; the audio has never been heard.
3. Tune from that: ink ration, tide slack, dusk length, rock count, boat speed.
4. Touch polish: a stroke offset above the fingertip (optional), palm rejection for Pencil, a haptic tick on a strike once wrapped natively.
5. A home-screen icon and splash, and a service worker so it opens offline.

## P2 — The Coast (the first real reason to come back)
1. ✅ **A coast of ten bays** (2026-11-22). Each bay is three nights; each night home lights one of its three lamps; two lamps open the next bay.
2. ✅ **A difficulty curve** (2026-11-22): bay 1 has ten rocks and a generous bottle; bay 10 has twenty-two and a lean one. Seeds are bench-picked so a blank chart loses everywhere.
3. ✅ **Progress saved** per bay: best lamps, tries, and a DRY mark for three nights without a strike (2026-11-22).
4. ✅ **Start over** in a bay, and **Reset coast** (2026-11-22).
5. ✅ Numbered lamp order, island harbours, town art, a larger bottle, and a supply wheel with an ad placeholder (2026-11-22, from iPad play).
6. ✅ A drawn shoreline for the coast screen (2026-11-22).
7. ✅ Two more mastery marks: *ink to spare* and *first light* (2026-11-22).
8. ✅ Ragged terrain, varied bay shapes, and headlands and islands as hazards you flag (2026-11-22).
9. The chart drawer: skipped for now at Jefferson's call.

## P3 — New waters (one new idea per coast)
Each coast is ten bays and introduces exactly one thing, alone at first and then mixed with what came before.

1. ✅ **The Set — The River Mouths** (2026-11-22, ten bays). A current runs across the bay, shown at dusk as a drift arrow. She is carried sideways as she sails, so a stroke that would have turned her safely now has to be drawn up-current.
2. ✅ **The River** (2026-11-23, ten reaches; Jefferson's idea, taking the place of the next planned mechanic). The whole chart is one winding river sailed west to east, port by port; the terrain itself is the puzzle and it twists harder each reach. No current.
3. **Drying rocks.** Some rocks are drawn dashed: they are covered on some nights and bare on others, and the almanac line at dusk says which. A mark that saves her tonight sends her the long way round tomorrow.
4. **Fog.** Part of the bay is hidden at dusk and the hidden part moves each night, so the chart must be built from three partial looks.
5. **The Drifter.** A wreck moves along a path shown at dusk. Ink cannot mark where it will be; it can only keep her out of the lane it crosses.
6. **The Bar.** A sandbar closes the direct way to one lamp as the tide falls, so the order she visits lamps starts to matter and the chart has to leave her the long way open.

## P4 — Pilots and marks (the collection)
1. **Pilots.** Each reads the same chart differently, which makes old bays new.
   - *Odile*: the baseline.
   - *Bram*, cautious: keeps twice the margin from ink, so strokes can be shorter and walls close more water than you meant.
   - *Wren*, bold: cuts close and sails faster, so the tide is kinder and near-misses are not.
   - *Old Solveig*: slow, but she remembers one rock per bay without being told.
   Pilots are earned with lamps. Each has her own dawn lines and verdicts.
2. **Marks.** New things the pen can do, each costing ink differently.
   - *A buoy*: a tap-and-hold mark that she passes on a chosen side.
   - *A lead line*: a dotted stroke she prefers to follow when it is safe, for threading a channel.
   - *The scraper*: remove one stroke per dusk.
3. **Papers and inks**: cosmetic only, earned with lamps or by streaks.

## P5 — The day and the week
1. **Tonight's bay** locks its first attempt, keeps a streak, and shares a result with the chart image.
2. **The long passage**: once a week, seven nights on one large bay with one chart.
3. **A friend's bay**: a link that hands someone the same water and shows both charts side by side at the end.
4. **The almanac**: a page per coast recording charts kept, marks earned, and Odile's worst remarks.

## P6 — The App Store
1. **Wrap** the web build with Capacitor (the game stays one HTML file; the wrapper adds what Safari cannot): haptics, Game Center, in-app purchase, ads.
2. **Ads, placed where they cost the game nothing:**
   - *Rewarded*: "a second bottle" (one refill, once per bay) or "sail it again" (replay a lost night). Always the player's choice.
   - *Interstitial*: only between bays, never between nights, never before the first three bays.
   - *Sponsored*: tonight's bay can carry a "presented by" line.
   - *Remove ads*: one purchase, which also unlocks the paper-and-ink set.
3. **Game Center**: a leaderboard for tonight's bay and achievements that mirror the mastery marks.
4. **Store work**: icon, screenshots that are finished charts, a fifteen-second preview that is one dusk and one strike, privacy labels, the tracking prompt that ad networks require.
5. **TestFlight** with ten outside testers before submission.

Needs from Jefferson before P6 starts: an Apple Developer account, an ad network account, and a check that a paid side product sits inside his employer's outside-activity policy.

## Order and why
P1 is hands-on tuning and cannot be skipped. P2 is the smallest thing that makes a second session different from the first. P3 is where "more interesting the more you play" is actually delivered, and it is the bulk of the work. P4 multiplies P2 and P3 without new bays. P5 needs enough game underneath it to be worth a daily visit. P6 can start any time after P2, in parallel, because the wrapper does not depend on content.

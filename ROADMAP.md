# INK BEFORE DARK — Roadmap

**Where it is going:** an App Store game for iPhone and iPad, free with ads, that is still one verb — draw — across **100 charts on ten coasts**.

**Play the current build:** https://jeffersonpikejr.github.io/ink-before-dark/

## Three tests every new feature must pass

1. **Drawable.** It changes what is worth drawing. If the player's ink cannot answer it, it does not go in.
2. **Visible.** Its rule can be seen on the chart or in her course. Nothing she does is unexplained.
3. **Benched.** `test/bench.mjs` gets a bot for it; on every shipped chart a blank chart must lose the first night and a perfect one must win all three.

Still out for good: steering the boat yourself, anything with hit points, and upgrades that buy power.

## How a coast is built

Every coast is ten charts and follows the same shape, so a player always knows where they are in it.

| Charts | Job | What is on them |
|---|---|---|
| 1–3 | **Teach** | The coast's new feature alone, gentle, on simple water. |
| 4–7 | **Combine** | The new feature with one earlier feature, a different one each chart. |
| 8–10 | **Test** | The new feature with two earlier ones, at full strength. Chart 10 is the coast's set piece. |

**Nights escalate.** From coast three on, the three nights of a chart are not three tries at the same problem. Night one is the plain chart. Night two adds a condition that makes a careless night-one chart fail. Night three adds another. The chart persists, so each dusk is about what the new condition has broken.

**Opening a coast** takes twelve lamps (of thirty) on the one before. Developer mode opens everything.

## The ten coasts

| # | Coast | New feature | What it does to the drawing | Combines with (4–7 / 8–10) | Nights two and three add | State |
|---|---|---|---|---|---|---|
| 1 | **The Strait** | Rocks, headlands, islands | Strike through rocks on her course; touch land that juts out to flag it. | — | new lamps | ✅ live |
| 2 | **The River Mouths** | **The set**: a current | She is carried off her line, so what lies beside the course matters and strokes go up-current. | headlands · islands | new lamps | ✅ live |
| 3 | **The River** | **The channel**: one winding river with islets and forks, sailed end to end | The straight course cuts every bend; a stroke too wide closes the channel; islets make her choose a side. | spurs · islets | the river against her · barges at anchor | ✅ live |
| 4 | **The Drying Shore** | **The tide's height**: rocks drawn dashed are covered on some nights and bare on others | A mark that saves her tonight sends her the long way round tomorrow; a second ink (a dashed stroke she ignores at high water) is earned here. | current · headlands / river channel | half tide · low water | ✅ live (first build) |
| 5 | **The Fog Banks** | **Fog** over part of the chart at dusk | You draw part of the chart blind, from what earlier dawns showed you; the wake at dawn becomes the thing you study. | drying rocks · current / islets | fog moves · fog thickens | ✅ live (first build) |
| 6 | **The Delta** | **Bars**: sand that closes a channel as the tide falls | The order she visits lamps decides which channels are still open; ink can hold her back from a channel that will shut behind her. | river forks · current / drying rocks | an earlier ebb · two bars | ✅ live (first build) |
| 7 | **The Ice** | **Floes** that drift along a path shown at dusk | Ink cannot mark where a floe will be, only keep her out of the lane it crosses, and when. | current (floes ride it) · fog / bars | faster floes · a second lane | ✅ live (first build) |
| 8 | **The Wreckers' Coast** | **False lights**: a lamp ashore that she will steer for unless you strike it out | Ink gains a second meaning: a stroke through a light tells her it lies. Leave one unmarked and she sails for the rocks under it. | headlands · fog / drying rocks | a second false light · the true lamp dimmed | ✅ live (first build) |
| 9 | **The Roads** | **Traffic**: ships under way on fixed lanes and timetables | Her timing matters: a detour you draw can put her in a lane as a ship passes; the lane and its clock are on the chart. | current · bars / floes | more ships · fog over the lane | ✅ live (first build) |
| 10 | **The Long Passage** | **Six lamps a night** on one bottle | The ink has to last twice the passage; every feature met so far is on the chart. Chart 100 is all of them at once. | all | more of each | ✅ live (first build) |

**Why this order.** Each new feature needs the one before it to be interesting: the set makes position matter, the channel makes width matter, the tide's height makes *time* matter, fog makes *memory* matter, bars make *order* matter, floes and traffic make *timing* matter, and false lights turn the ink itself into a statement that can be true or false. The last coast is the exam.

**What grows besides the charts.**
- **Marks of the pen**, each earned on the coast that needs it: the stroke (1), the flag (1), the dashed stroke for drying rocks (4), the strike-through for a false light (8).
- **Mastery marks** on every chart: DRY, SPARE, FIRST. A fourth, *QUIET* (home without using a supply), arrives with the App Store build.
- **Pilots** (coast 5 onward): Bram keeps twice the margin; Wren cuts close and sails fast; Old Solveig remembers one rock a chart. Replaying an earlier coast with another pilot is a new problem on the same water.

## Shipped

- ✅ **P0 — The prototype** (2026-11-18). One verb, one pilot, one clock, three nights, dawn readback.
- ✅ **Hosting** (2026-11-22). Public repo, GitHub Pages, home-screen meta tags.
- ✅ **Coast 1 — The Strait** (2026-11-22). Ten charts, lamps, saved progress, Start over, Reset coast, mastery marks, drawn coast screen, ragged terrain, flags.
- ✅ **From iPad play** (2026-11-22). Pencil precision (confirmed fixed on the iPad 2026-11-25), larger bottle, numbered lamps, harbours and towns, island harbours, supply wheel with an ad placeholder, developer mode.
- ✅ **Coast 2 — The River Mouths** (2026-11-22). The current.
- ✅ **Coast 3 — The River** (2026-11-23, reworked 2026-11-25). Winding channel, islets and forks, spurs; nights escalate to a contrary current and then barges at anchor.

## Shipped 2026-11-25: coasts 4–10, first build

All seven are playable and every chart passes `node test/charts.mjs`. They are first builds: the rules work and are fair by simulation, but none has been played by a person. Where the build is simpler than the plan above, it says so here.

- **4 The Drying Shore.** Built as planned, except the tide only falls (more rocks bare each night) and there is no dashed pen stroke yet.
- **5 The Fog Banks.** Built as planned.
- **6 The Delta.** Bars close by *order* (after a numbered lamp), not by the clock. No true branching channels yet; it uses river-mouth bays.
- **7 The Ice** and **9 The Roads.** Floes go to and fro; ships keep one heading. A strike costs time and teaches her nothing, so the player's tools are keeping her off the lane or changing her timing with a detour.
- **8 The Wreckers' Coast.** A false light is an extra stop she makes unless ink touches it. The planned "strike-through" is the same touch as a flag.
- **10 The Long Passage.** Six lamps a night on a normal-sized chart, not a chart two sheets wide.
- **Not built:** pilots, the QUIET mark, and escalating nights on coasts 1 and 2.

## Now: the playtest gate (set by the Business Council review, 2026-11-25)

**Features are frozen at v0.14.** The Council scored the plan 4/10 as an ad business and 6/10 as a capped test, and named one thing: prove strangers come back before any more monetisation or store work beyond TestFlight. Nothing below the gate is built until the gate passes.

| Week | Work | Gate |
|---|---|---|
| 1 | Send the web link to ten outside testers (not friends or family). Each presses "Send play log" after two days. | **4 of 10 start a second session within 48 hours.** If not: redesign once, then stop. |
| 2 | Fix the top three drop-off points the logs show. Finish the TestFlight build (needs Xcode, the developer account). | Installs and keeps progress on iPad and iPhone. |
| 3–4 | 20+ testers on TestFlight, wheel on test ads. | 8 of 20 back within 48 hours. |
| 5 | Test price screens for Remove Ads and a supply pack that record taps and charge nothing; interstitials at the agreed cadence. | Signals only. |
| 6 | Read results. | Go needs 10+ minutes a day and 5% of active testers tapping an offer. |

**Soft launch (weeks 7–12, only after a go):** Canada, Australia or New Zealand. Stop if day-one retention is under 30% or day-seven under 7% after two updates; go on at 40% and 12%.

**Budget and stops:** $2,000 and 60 hours to the gate; $1,500 and 100 hours more only if it passes. Pause if it takes more than 10 hours a week for three weeks. No paid installs unless projected 180-day revenue per install exceeds the cost of one. If the audience turns out to be children, drop ads and sell a one-time unlock.

## After the gate, in order

1. **Hybrid monetisation**: Remove Ads ($3.99; the wheel stays), supply packs ($0.99–$2.99), coast packs later.
2. **Hands on glass for coasts 4–10**, tuned from play logs.
3. **Escalating nights on coasts 1 and 2**; then the gaps listed above.

## The App Store build (can start any time)

1. Wrap the web build with Capacitor: haptics, Game Center, in-app purchase, ads.
2. **Ads where they cost the game nothing.** Rewarded: the supply wheel (already built, with a placeholder where the ad goes). Interstitial: only between charts, never between nights, never on coast 1. Sponsored: tonight's bay can carry a "presented by" line. One purchase removes ads.
3. Game Center: a leaderboard for tonight's bay; achievements that mirror the mastery marks.
4. Store work: icon, screenshots that are finished charts, a fifteen-second preview that is one dusk and one strike, privacy labels, the tracking prompt ad networks require.
5. TestFlight with ten outside testers.

Needs from Jefferson before this starts: an Apple Developer account, an ad network account, and a check that a paid side product sits inside his employer's outside-activity policy.

## Skipped for now

The chart drawer (finished charts kept as images), at Jefferson's call.

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
| 5 | **The Low Cloud** | **Cloud** banks that cross the bay on the wind while you draw | Nothing stays hidden: wait and the cloud passes, but the light is going. The choice is when to look and when to draw. | drying rocks · current / islets | a fourth bank · a fifth | ✅ rebuilt v0.15 |
| 6 | **The Delta** | **Bars**: sand that closes a channel as the tide falls | The order she visits lamps decides which channels are still open; ink can hold her back from a channel that will shut behind her. | river forks · current / drying rocks | an earlier ebb · two bars | ✅ live (first build) |
| 7 | **The Ice** | **Bergs** that drift down the wind all night, one way, then ground | You ink where the ice is going, not where it lies: the dotted track has a tick for each quarter of the tide, and you judge when she gets there. | current · cloud | each berg is set adrift to lie across a different night's best course | ✅ rebuilt v0.15 |
| 8 | **The Wreckers' Coast** | **False lights**: a lamp ashore that she will steer for unless you strike it out | Ink gains a second meaning: a stroke through a light tells her it lies. Leave one unmarked and she sails for the rocks under it. | headlands · fog / drying rocks | a second false light · the true lamp dimmed | ✅ live (first build) |
| 9 | **The Roads** | **Shipping lanes**: convoys that run harbour to harbour, round whatever lies between | Trace a ship's length of a lane and she gives way to its ships (a short wait); leave it off and she crosses blind and is usually run down once, after which the lane is on the chart in red. A lane costs about what a rock costs. | current · bars | two to four lanes; a new one opens each night, timed to cross that night's best course | ✅ rebuilt v0.15 |
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

## The deck (set by Jefferson 2026-11-25): one pen gesture per feature

Jefferson's play notes: ice read as a reskinned island, fog hid things no skill could find, and ships and floes were the same idea twice. The rule that came out of it: **every feature must ask for its own gesture, and every feature must be beatable by skill alone.** New coasts after the tenth come from new combinations of cards in this deck on new terrain, not from a new feature each time.

| Card | What the pen does | What makes it its own | Stacks with |
|---|---|---|---|
| Rock | a stroke across her course | fixed, hidden from her | everything |
| Headland, island | a touch | she then knows the whole piece | everything |
| Current | the stroke goes up-current, and longer | changes where every other mark belongs | everything |
| Drying rock | a stroke tonight for a rock that shows tomorrow | the chart is drawn ahead of the bay | everything |
| Bar | a stroke placed by the lamp order | the bay closes behind her | current, cloud |
| False light | a dot | ink that means "not this" | everything |
| Cloud | wait, then draw | costs light, not ink | everything (it hides the other cards) |
| Ice | a stroke where it will be | time is on the chart as ticks | current, cloud, lanes |
| Shipping lane | a traced length along it | she waits instead of striking; a choice of what to spend | everything |
| Six lamps | fewer, better strokes | one bottle for twice the passage | everything |

**Terrain is a card too:** open bay, river mouth, winding river so far. Candidates: an archipelago (many islands, no open water), a single narrow strait sailed both ways, a lagoon behind a reef with two or three gaps.

**Candidate cards, not built.** Each has a gesture none of the above uses.
1. **Lighthouse beam.** A lit sector sweeps the bay; she sees for herself whatever lies in it. Ink is only needed in the dark sectors, so you draw the shape of the light.
2. **Soundings.** Shoal water she can cross on some nights' tide and not on others, drawn with depth figures; you ink only what tonight's tide makes dangerous.
3. **Whirlpool.** It turns her course by a fixed angle; you mark the far side of it.
4. **Kelp.** It costs her time, not a strike; marking it is only worth the ink when the tide is tight.
5. **The other boat.** A second pilot shares your chart on the last night, sailing different lamps.
6. **Wreck.** Mark a wreck and it pays a little ink toward tomorrow's bottle.

## Keeping players (research 2026-11-25; full note in the vault)

What has experimental evidence behind it, in order: a streak that forgives, easing difficulty rather than spiking it, and leagues. The rest of what top games do (calendars, albums, events) is common but unproven in public.

| Loop | State |
|---|---|
| **The log**: nights in a row on tonight's bay; kept by finishing, not by winning; a lay day covers a missed night; a supply for each night kept | ✅ v0.15 |
| **Tonight's bay with a result to share** | ✅ since v0.1; a picture of the finished chart would share better (the chart drawer, skipped) |
| **Relief after a hard chart**: after two failed tries, offer a supply or a look at the perfect chart | not built |
| **Win-run bonus**: lamps lit in a row across charts carry a small bonus into the next | not built |
| **Game Center leaderboard for tonight's bay** (the on-device stand-in for a league) | needs the wrapper |
| **Home-screen widget** showing the log and tonight's bay | needs the wrapper |
| **Archive of past nightly bays** as a paid extra | after the gate |

Avoided on purpose: lives or energy timers, countdown pressure, streak-loss warnings, and any reward for turning on notifications (Apple forbids it).

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

**The deliberate exception, v0.16 (2026-11-27): the tutorial cards.** Built during the freeze at Jefferson's direction, as the stage-2 drop-off fix done ahead of the logs: a stranger has to be able to draw a decent first chart or the 48-hour number measures confusion, not the game. It adds no mechanic, coast or rule. What it adds:

- **Cards.** One small animated chart and one sentence each, drawn in the game's own hand. Two before the first dusk (Dusk, Draw), one at the first cast-off (Night), one at the first strike (What you leave off, she finds), two at the second dusk (Three nights, one chart; One bottle a night). After that, one card the first time each new thing is met: the current, the river, barges, the drying shore, cloud, bars, ice, false lights, shipping lanes, six lamps, supplies, lamps, marks, the log, the tide.
- **A guided first night.** For the first night only, her course as the chart stands is pencilled in up to the first thing she would strike, the stroke to make is shown being made, and the light waits for the first stroke. The second night it is gone.
- **A newcomer's first tap opens the first bay**, not the map.
- **Off, and back.** "Tutorial cards: on/off" and "Replay the tutorial" on the title. Seen cards live in the save; a save from before v0.16 is credited with what its player has already met.
- **Measured.** The play log counts cards shown and cards skipped, so the testers' logs show whether the tutorial is read.

A new feature now needs a card: `test/cards.mjs` fails if any shipped chart asks for something that has none.

**Soft launch (weeks 7–12, only after a go):** Canada, Australia or New Zealand. Stop if day-one retention is under 30% or day-seven under 7% after two updates; go on at 40% and 12%.

**Budget and stops:** $2,000 and 60 hours to the gate; $1,500 and 100 hours more only if it passes. Pause if it takes more than 10 hours a week for three weeks. No paid installs unless projected 180-day revenue per install exceeds the cost of one. If the audience turns out to be children, drop ads and sell a one-time unlock.

## After the gate, in order

1. **Hybrid monetisation**: Remove Ads ($3.99; the wheel stays), supply packs ($0.99–$2.99), coast packs later.
2. **Hands on glass for coasts 4–10**, tuned from play logs.
3. **Escalating nights on coasts 1 and 2**; then the gaps listed above.

## The App Store build (can start any time)

**State at v0.17 (2026-11-27):** the app builds and runs in the iOS Simulator on an iPhone 18 Pro and an iPad Pro 11-inch, with haptics, a Game Center leaderboard for tonight's bay, the Remove Ads purchase with restore, Google's consent form before the first ad, safe areas, a native copy of the save, an offline audit and Pencil palm rules. All five plugins answer and the tutorial walk passes inside the real web view. Not yet done: a real device, a purchase, a signed-in Game Center player, an ad shown, landscape, signing. `store/APP_STORE.md` is the handoff.

**State at v0.18 (2026-11-28):** driven by hand in the Simulator on the iPhone 18 Pro and the iPad Pro 11-inch, in both orientations. A test rewarded ad runs from tap to payout on both. That found two ad-timing faults and three sideways-phone layout faults, all fixed (bug fixes, inside the freeze). Still not done: a real device, a purchase (it needs Xcode's Run button or the App Store Connect product), a signed-in Game Center player, an interstitial on screen, signing.

1. Wrap the web build with Capacitor: haptics, Game Center, in-app purchase, ads. ✅ builds and runs in the Simulator (2026-11-27).
2. **Ads where they cost the game nothing.** Rewarded: the supply wheel (already built, with a placeholder where the ad goes). Interstitial: only between charts, never between nights, never on coast 1. Sponsored: tonight's bay can carry a "presented by" line. One purchase removes ads.
3. Game Center: a leaderboard for tonight's bay ✅ built, untested with a signed-in player; achievements that mirror the mastery marks (not built).
4. Store work: icon, screenshots that are finished charts, a fifteen-second preview that is one dusk and one strike, privacy labels, the tracking prompt ad networks require.
5. TestFlight with ten outside testers.

Needs from Jefferson before this starts: an Apple Developer account, an ad network account, and a check that a paid side product sits inside his employer's outside-activity policy.

## Skipped for now

Note: v0.15 was built during the feature freeze at Jefferson's direction, from his own play notes. The freeze otherwise stands.


The chart drawer (finished charts kept as images), at Jefferson's call.

# App Store build — the handoff

_Last updated 2026-11-28, at v0.18._

The game is `index.html`. Everything under `ios/` and `native/` only wraps it. **The iOS app now builds and runs in the iOS Simulator** (Xcode 27.2, iOS 27.2 SDK) on an iPhone 18 Pro and an iPad Pro 11-inch. On 2026-11-28 it was driven by hand there for the first time: taps, drawing, rotation, a test ad from start to payout. It has not been on a real device, signed, or submitted. This file says what was proved, what was not, and what is left.

## Where it stands

**Proved in the Simulator, on both devices, 2026-11-27:**

- The project resolves its packages and compiles first time: Capacitor 8.6.2, Google Mobile Ads 13.11.0, Google's consent SDK 3.1.0, and this project's own Swift package.
- The app launches, loads the bundled game from `capacitor://localhost`, and all five plugins answer: Haptics, NativePurchases, GameCenter, Vault, AdMob.
- The save copy round-trips through the native file, rejects a bad key, and holds the real save after play.
- A **test** rewarded ad loads from Google. The tracking prompt appears once, after the first finished chart, with the right sentence.
- The game keeps inside the notch and home bar (iPhone: 62 pt top, 34 pt bottom; iPad: 20 pt bottom). The status bar is hidden.
- The whole tutorial walk (26 cards, all 21 kinds, a guided first night) passes inside the real web view at 402×874 and 834×1210, with nothing off-screen or clipped.

**Proved by hand in the Simulator, iPhone 18 Pro, 2026-11-28 (v0.18):**

- **Landscape on a phone.** The title fits one screen. The coast opens at its top and keeps clear of the Dynamic Island. In play the chart, meters and buttons are all clear of it, and a stroke lands where the finger was. Cards and the supply wheel fit.
- **A test rewarded ad from tap to payout.** It loads, plays, shows "Reward granted", closes, and only then does the wheel spin and the supply land in the locker.
- **Remove Ads with no product behind it.** The link reads "Not bought · Remove ads between charts" and the game carries on.
- **iPad:** v0.18 launches to the title (portrait). It was not driven by hand: the Simulator panel asks Jefferson for access to each simulator the first time, and the iPad's request went unanswered.

**Found and fixed by running it:**

| Found | Fix |
|---|---|
| The silent Game Center check never answered when nobody is signed in | The plugin now gives up after 4 s (30 s when its sign-in sheet may be up), and the game has its own timeout |
| At night on a phone the tide meter was pushed off the right edge (the hidden ink meter still took room). This was in the web game too. | A hidden meter takes no room. Shipped to the web in v0.17. |
| The status bar showed over the game | Hidden at launch through Capacitor's own `SystemBars` |
| The first-night hint was hard to read over the chart | It now has the same halo as the caption |
| The supply wheel spun and named its prize **underneath the ad's last card**. The AdMob plugin answers when the reward is earned, not when the ad closes. (v0.18) | The game waits for the ad to close: the plugin's dismissed event, or the first touch on the page (only possible once the ad is gone), or 90 s. |
| The between-charts ad had the same flaw, worse: the plugin answers the moment the ad goes **up**, so the next bay's dusk would have run underneath it. Found by reading the plugin; never seen, because an interstitial needs a second session. (v0.18) | `Ads.between()` resolves only when the ad has closed. "Next bay" ignores a second tap meanwhile. `test/native.mjs` holds both ads open and checks nothing moves. |
| An ad slow to load (no signal) could leave the wheel on "Loading…" with Close switched off, or "Next bay" doing nothing. (v0.18) | A load is given up after 9 s for the wheel and 4 s between charts. |
| A rewarded ad closed early said "No ad to show just now." (v0.18) | It says "Watch the whole ad to spin." |
| On a phone on its side the supply wheel was cut off top and bottom: heading and both buttons half off the screen. Web too. (v0.18) | The wheel sits beside its words; it fits a screen 375 pt high. |
| On a phone on its side the title and the coast opened scrolled to their middle, heading cut off, and the coast map ran under the Dynamic Island. Web too. (v0.18) | Both open at their top (`justify-content: safe center`), the coast and the wheel keep inside the safe area, and the title is tightened to fit one screen. |

**Not proved:**

- Anything on a real device: haptics (the Simulator has none), a real Pencil, a real notch, airplane mode.
- A purchase. The store answered "Product not found", as it must until the product exists in App Store Connect or `Products.storekit` is attached to the scheme in Xcode. The game handled that quietly. **There is no command-line way to use `Products.storekit`** (checked 2026-11-28): the file is only read when the app is started with Xcode's Run button and the scheme option set, so `simctl` launches never see it.
- A signed-in Game Center player, a posted score, the leaderboard screen.
- An interstitial on screen (its timing is now tested against a stand-in, but none has been seen: it needs a second session and three finished charts). Google's consent form. A rewarded ad on the iPad.
- Landscape on the iPad, and anything else there by hand (see the access note above).
- Signing, archiving, TestFlight.

**How it was tested.** Since 2026-11-28 `xcode-select` points at Xcode, so the live Simulator panel in the Claude app works and can tap, draw and rotate. Before that the build ran through `xcodebuild` and `simctl` directly, and the app tested itself: `node scripts/selftest.mjs` puts a script into the synced bundle that calls every plugin, plays the whole tutorial walk, and prints results to the app's console; `scripts/sim-selftest.sh` installs, launches, reads that console and photographs each scene. `npx cap copy ios` (or `npm run sync`) takes the script out again. It is never in the shipped game.

## Three things about this Mac

1. **`xcode-select` points at Xcode since 2026-11-28.** (Done through a macOS password dialog.) If it is ever reset, the live Simulator panel stops opening; the command is:

   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   ```

   The `DEVELOPER_DIR=…` prefix in the commands below is now harmless and no longer needed.
2. **From the command line, add `-packageAuthorizationProvider netrc`.** Without it `xcodebuild` asks the macOS keychain for the saved GitHub password before downloading public packages, a prompt appears on the Mac's screen, and the build hangs silently until someone answers. If that prompt is still showing from the first attempt, deny it. Building from the Xcode window does not have this problem in the same way: it asks once and you can deny.
3. **Disk.** The iOS Simulator and build files took about 20 GB. There were 21 GB free on 2026-11-28.

A command-line build looks like this:

```bash
cd ios/App && DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcodebuild build -project App.xcodeproj -scheme App -destination 'platform=iOS Simulator,name=iPhone 18 Pro' -packageAuthorizationProvider netrc
```

## What is built, and how far each piece was checked

| Piece | Where | Checked how | Not checked |
|---|---|---|---|
| Capacitor 8.6 iOS project, Swift Package Manager, iPhone + iPad, all orientations on iPad | `ios/` | **Builds and runs** on iPhone 18 Pro and iPad Pro 11-inch simulators; driven by hand on the iPhone in both orientations | A device; the iPad by hand |
| **Haptics**: a heavy tap on a strike, a light one on a lamp, a notification at dawn, an error tap on a dry bottle | `Native.buzz` in `index.html`; `@capacitor/haptics` 8.0.2 | The real plugin answers in the Simulator; `test/native.mjs` counts the calls | Felt on a device |
| **Game Center**: one leaderboard, tonight's bay, first try only | `native/ibd-native/…/GameCenterPlugin.swift`; `Native.gc*` | **Compiles and answers** in the Simulator ("not signed in"); the JavaScript side is tested with a stand-in | A real sign-in; a posted score; the leaderboard screen |
| **Remove Ads** purchase (StoreKit 2), with Restore Purchases, the price read from the store, sets `META.noAds` | `Native.storeCheck/buy/restore`; `@capgo/native-purchases` 8.11.0 | The real plugin answers in the Simulator (no purchases; "Product not found"); `test/native.mjs` covers cancel, buy, restore | A real or sandbox purchase |
| **Ads** (AdMob 8.4.2): rewarded on the supply wheel, interstitials between charts; Google's consent form before the first ad request; an "Ad privacy choices" link where required | `Ads` in `index.html` | In the Simulator a **test** rewarded ad loads, plays, closes and pays out, twice; `test/native.mjs` covers consent order, cadence, and both kinds of ad holding the game until they close | An interstitial on screen; the consent form |
| **Save kept outside the web view**: a file in Application Support, restored at launch if the web view's storage is gone or older | `VaultPlugin.swift`; `Native.vault*`, `loadMeta` | **Round-trips in the Simulator** and holds the real save; the JavaScript is tested for newer-wins, restore and a damaged copy | Web storage actually being cleared |
| **Safe areas**: the chart, meters, captions, buttons and cards keep inside the notch, home bar and corners | CSS `env(safe-area-inset-*)`; `safeArea()` and `resize()` | **Measured in the Simulator** with real insets, portrait, on both devices; seen in landscape on the iPhone 18 Pro (Dynamic Island on the left); browser walk at four sizes | iPad landscape |
| **Fully offline**: nothing is loaded from another host; the service worker is skipped inside the app | `test/offline.mjs` (part of `npm test`) | Passes on the game file and the bundle; the app loads from `capacitor://localhost` | Airplane mode on a device |
| **Pencil**: strokes mapped through the canvas's real box; every coalesced sample used; a stroke belongs to the pointer that began it; a touch within 0.9 s of the Pencil is taken for the resting hand; no pinch-zoom or callout | `penDown/penMove/penUp` | The stroke path is exercised by the browser walk | A real Pencil with a hand resting on the glass |
| Game Center entitlement | `ios/App/App/App.entitlements`, `CODE_SIGN_ENTITLEMENTS` in the project | Lint only | Signing |
| StoreKit test product, so the purchase can be tried in the Simulator before the App Store Connect record exists | `ios/App/App/Products.storekit` | Valid JSON, written by hand from memory of Xcode's format | Whether Xcode accepts it. If it does not, make a new one in Xcode: File › New › StoreKit Configuration File. |
| Privacy policy page, with a way back to the game | `privacy.html` | Read | — |

`npm test` runs all of the automated checks: 100 charts, the cards, the native code against stand-ins, the offline audit, and the bench.

## What only Jefferson can do

1. ~~Point `xcode-select` at Xcode.~~ Done 2026-11-28. Still his: **allow the Simulator panel to use the iPad simulator** when it asks, so the iPad can be driven by hand.
2. **Enrol in the Apple Developer Program** (individual, $99 a year) and the **Small Business Program**. Create the app record with bundle id `com.jeffersonpike.inkbeforedark`.
3. **In App Store Connect, create two things with exactly these ids** (the code looks for them by name):

   | What | Id | Settings |
   |---|---|---|
   | In-app purchase, non-consumable | `com.jeffersonpike.inkbeforedark.removeads` | Display name "Remove Ads". Description: "No adverts between charts. The supply wheel stays." Price: your call; the plan says $3.99. |
   | Game Center leaderboard, classic | `com.jeffersonpike.inkbeforedark.tonight` | Name "Tonight's Bay". Integer, high to low. The game shows it scoped to today. Score: 1000 for each night home, plus 10 for each second of tide in hand, less 50 for each strike. |

   Attach the leaderboard to the app version, or Game Center is not enabled for it.
4. **Create an AdMob account**, register the iOS app, create one rewarded and one interstitial unit, and set up a consent message for Europe in AdMob's Privacy & messaging. AdMob wants an `app-ads.txt` at the root of the developer website named in the store listing; for github.io that means a `jeffersonpikejr.github.io` user-site repository holding that one file.
5. **Confirm the side product is inside his employer's outside-activity policy** before anything is submitted under his name.

## First build, in order

```bash
npm install
```

```bash
npm run ios
```

1. **Package resolution and compile.** Done; they work. Expected warnings are in the plugins, not in this project's code. If a later Capacitor or AdMob update breaks resolution, read the error before changing versions, and do not add a second Google Mobile Ads dependency.
2. **Signing.** Pick the team under Signing & Capabilities. Xcode should add the Game Center capability from the entitlements file.
3. **Try the purchase in the Simulator.** This one needs Xcode's own Run button; nothing started from the command line reads the file. To do it without App Store Connect: add `App/Products.storekit` to the project (File › Add Files, no target), then Product › Scheme › Edit Scheme › Run › Options › StoreKit Configuration.
4. **Check on the real iPad and an iPhone** (the first three are already proved in the Simulator):
   - The first launch goes title, The Coast, two cards, a guided first night. Tutorial cards can be turned off and replayed from the title.
   - Nothing sits under the notch or the home bar, in portrait and landscape.
   - The title shows "Tonight's leaderboard", "Remove ads between charts · price" and "Restore purchases".
   - Buying removes the ads between charts; deleting the app, reinstalling and pressing Restore brings that back.
   - The supply wheel shows a **test** rewarded ad and pays out only after the ad is closed (proved in the Simulator). No interstitial in the first session, then at most one per three finished charts.
   - Airplane mode: the game plays; the wheel says there is no ad.
   - Progress survives force-quitting. (The vault copy is harder to prove: Settings › Safari data does not apply to an app. Trust the test, or delete the app's web data from Xcode's device container.)
   - Pencil: draw with the hand resting on the glass. No stray blots.
   - Haptics fire on a real iPhone (the Simulator and iPads have none).

## Before submission

1. Replace the three test ids: `GADApplicationIdentifier` in `ios/App/App/Info.plist`, and `Ads.ids.rewarded` and `Ads.ids.interstitial` in `index.html`. Set `initializeForTesting:false`. Add the rest of Google's current SKAdNetwork list to `Info.plist` (https://developers.google.com/admob/ios/quick-start).
2. Set the version and build number (Xcode, General).
3. Screenshots for iPhone and iPad that show the game in use; a fifteen-second preview that is one dusk and one strike.
4. Archive, upload, TestFlight internal, then a public TestFlight link for outside testers.
5. Submit. Category: Games › Puzzle. **Not** the Kids category.

**Requirements with dates.** Apps must be built with Xcode 26 and the iOS 26 SDK since 2026-04-28; Apple has said the iOS 27 SDK will be required from April 2027. Xcode 27.2 satisfies both.

## Notes for App Review (draft)

> Ink Before Dark is a drawing puzzle. Everything is bundled in the app and it plays with no network connection. The player draws with a finger or Apple Pencil. The app uses haptics, a Game Center leaderboard ("Tonight's Bay", under Tonight's bay on the title screen), and one in-app purchase, "Remove Ads", with Restore Purchases on the title screen. Rewarded ads are shown only when the player opens the supply wheel and chooses to watch; nothing in the game is withheld from a player who declines tracking or never watches an ad. To see an interstitial: finish three charts in a second session.

## Review risks to prepare for

- **"It is a website in a wrapper" (guideline 4.2).** Apple lists no native features that settle this. The case rests on: fully offline and bundled, Pencil input, haptics, Game Center, an in-app purchase, a save kept natively, no browser chrome, no links out except the privacy page's contact link.
- **Privacy labels.** With the Google Mobile Ads SDK, declare: Device ID, Advertising Data, Coarse Location, Performance Data, Crash Data, Product Interaction (https://developers.google.com/admob/ios/privacy/data-disclosure). Game Center and purchases are Apple's own.
- **Privacy manifest.** The app's own code uses no "required reason" API (the save is a plain file, not UserDefaults), so the app has no manifest of its own. The AdMob plugin and Google's SDK ship theirs. If a later plugin adds UserDefaults, the app needs a `PrivacyInfo.xcprivacy` with reason CA92.1.
- **Ads rules.** Interstitials must be clearly ads with a visible close (2.5.18). Nothing may be withheld from a player who declines tracking (5.1.2); the game never checks the answer. Remove Ads must be an Apple in-app purchase, and it is. Show the store's own price string, never a typed one; the code does.
- **Restore.** A restore mechanism is required for a non-consumable (3.1.1). It is on the title screen.
- **Age rating.** Answer the questionnaire (ratings are now 4+, 9+, 13+, 16+, 18+); declare advertising. Do not describe the game as for children anywhere in the listing.
- **Icon** has no transparency (done). Screenshots must show the app in use.

## Map of the files

| Path | What it is |
|---|---|
| `index.html` | The game, the cards, and all game-side native code (`Native`, `Ads`) |
| `native/ibd-native/` | This project's own Swift: `GameCenterPlugin`, `VaultPlugin`. A local package; `npx cap sync ios` wires it in. |
| `ios/App/CapApp-SPM/Package.swift` | Written by `cap sync`. Do not edit by hand. |
| `ios/App/App/Info.plist` | AdMob app id (test), tracking sentence, SKAdNetwork id, orientations |
| `ios/App/App/App.entitlements` | Game Center |
| `ios/App/App/Products.storekit` | A local test product for the Simulator |
| `scripts/build.mjs` | Copies the game into `www/` for Capacitor |
| `test/native.mjs`, `test/offline.mjs` | Checks that run without Xcode |
| `scripts/selftest.mjs`, `scripts/sim-selftest.sh`, `test/selftest.js` | The app testing itself in the Simulator, with screenshots, when nothing can tap it |
| `ios/App/App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved` | The package versions Xcode resolved. Committed, so every build uses the same ones. |

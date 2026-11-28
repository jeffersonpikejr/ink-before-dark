# App Store build — the handoff

_Last updated 2026-11-27, at v0.16._

The game is `index.html`. Everything under `ios/` and `native/` only wraps it. **The iOS app has never been compiled or run.** This file says what is built, how far each piece was checked, and the exact point where the work stopped.

## Where it stopped

Xcode 27.2 was installed on this Mac at 18:59 on 2026-11-27, part-way through this work. Two things then blocked the build, and both need Jefferson's Mac password:

1. **Xcode's licence has not been accepted.** Every `xcodebuild` and `simctl` call answers "You have not agreed to the Xcode license agreements".
2. **No iOS Simulator runtime is downloaded.** The iOS 27.2 SDK is inside Xcode, but there is nothing to run an app on.

To clear both, in Terminal:

```bash
sudo xcodebuild -license accept
```

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

```bash
xcodebuild -runFirstLaunch && xcodebuild -downloadPlatform iOS
```

The last one downloads several gigabytes. After that the first build is `npm run ios`, or ask Claude to build and run it in the Simulator on an iPhone and an iPad.

## What is built, and how far each piece was checked

| Piece | Where | Checked how | Not checked |
|---|---|---|---|
| Capacitor 8.6 iOS project, Swift Package Manager, iPhone + iPad, all orientations on iPad | `ios/` | `npx cap sync ios` runs clean and lists four plugins; the project file passes `plutil -lint` | Never opened in Xcode |
| **Haptics**: a heavy tap on a strike, a light one on a lamp, a notification at dawn, an error tap on a dry bottle | `Native.buzz` in `index.html`; `@capacitor/haptics` 8.0.2 | `test/native.mjs` counts the calls against a stand-in plugin | On a device |
| **Game Center**: one leaderboard, tonight's bay, first try only | `native/ibd-native/…/GameCenterPlugin.swift`; `Native.gc*` | Swift type-checks against the Mac's GameKit headers and a stand-in Capacitor module; the JavaScript side is tested with a stand-in | Compiled for iOS; a real sign-in; a real leaderboard |
| **Remove Ads** purchase (StoreKit 2), with Restore Purchases, the price read from the store, sets `META.noAds` | `Native.storeCheck/buy/restore`; `@capgo/native-purchases` 8.11.0 | `test/native.mjs`: cancelled purchase, purchase, restore, and that an empty answer never takes ownership away | A real or sandbox purchase |
| **Ads** (AdMob 8.4.2): rewarded on the supply wheel, interstitials between charts; Google's consent form before the first ad request; an "Ad privacy choices" link where required | `Ads` in `index.html` | `test/native.mjs`: consent, then initialise, then the first request; no interstitial in a first session; one per three charts; none after Remove Ads; five rewarded a day | A real ad |
| **Save kept outside the web view**: a file in Application Support, restored at launch if the web view's storage is gone or older | `VaultPlugin.swift`; `Native.vault*`, `loadMeta` | Swift type-checks; the JavaScript is tested for newer-wins, restore and a damaged copy | On a device |
| **Safe areas**: the chart, meters, captions, buttons and cards keep inside the notch, home bar and corners | CSS `env(safe-area-inset-*)`; `safeArea()` and `resize()` | Layout walked in a browser at 375×812, 812×375, 768×1024 and 1024×768 | A real notch (a browser reports no insets) |
| **Fully offline**: nothing is loaded from another host; the service worker is skipped inside the app | `test/offline.mjs` (part of `npm test`) | Passes on the game file and on the `www/` bundle | Airplane mode on a device |
| **Pencil**: strokes mapped through the canvas's real box; every coalesced sample used; a stroke belongs to the pointer that began it; a touch within 0.9 s of the Pencil is taken for the resting hand; no pinch-zoom or callout | `penDown/penMove/penUp` | The stroke path is exercised by the browser walk | A real Pencil with a hand resting on the glass |
| Game Center entitlement | `ios/App/App/App.entitlements`, `CODE_SIGN_ENTITLEMENTS` in the project | Lint only | Signing |
| StoreKit test product, so the purchase can be tried in the Simulator before the App Store Connect record exists | `ios/App/App/Products.storekit` | Valid JSON, written by hand from memory of Xcode's format | Whether Xcode accepts it. If it does not, make a new one in Xcode: File › New › StoreKit Configuration File. |
| Privacy policy page, with a way back to the game | `privacy.html` | Read | — |

`npm test` runs all of the automated checks: 100 charts, the cards, the native code against stand-ins, the offline audit, and the bench.

## What only Jefferson can do

1. **Accept the Xcode licence and download the iOS platform** (above).
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

1. **Package resolution.** Xcode fetches Capacitor, Google Mobile Ads (pinned to 13.11.0 by the AdMob plugin) and Google's consent SDK. This is the first place it can fail. If it does, read the error before changing versions: do not add a second Google Mobile Ads dependency.
2. **Compile.** Expected warnings: `GKGameCenterViewController` is deprecated in iOS 26 (it is only used on iOS 15 to 17; iOS 18 and later use `GKAccessPoint`), and `@UIApplicationMain` in the template's `AppDelegate.swift`. Capacitor 8.6.2 has not been confirmed on Xcode 27; if the Capacitor package itself fails, run `npm update @capacitor/core @capacitor/ios @capacitor/cli` and `npx cap sync ios`.
3. **Signing.** Pick the team under Signing & Capabilities. Xcode should add the Game Center capability from the entitlements file.
4. **Run on an iPhone simulator and an iPad simulator.** To try the purchase without App Store Connect: add `App/Products.storekit` to the project (File › Add Files, no target), then Product › Scheme › Edit Scheme › Run › Options › StoreKit Configuration.
5. **Check, on a simulator and then on the real iPad:**
   - The first launch goes title, The Coast, two cards, a guided first night. Tutorial cards can be turned off and replayed from the title.
   - Nothing sits under the notch or the home bar, in portrait and landscape.
   - The title shows "Tonight's leaderboard", "Remove ads between charts · price" and "Restore purchases".
   - Buying removes the ads between charts; deleting the app, reinstalling and pressing Restore brings that back.
   - The supply wheel shows a **test** rewarded ad and pays out. No interstitial in the first session, then at most one per three finished charts.
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
| `test/native.mjs`, `test/offline.mjs` | The checks that stand in for a device until there is one |

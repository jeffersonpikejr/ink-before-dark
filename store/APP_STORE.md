# App Store build — how to get from here to TestFlight

The game is `index.html`. This folder and `ios/` only wrap it. Nothing here has been built or run yet: the Mac it was prepared on has no Xcode.

## What is already done
- `ios/` — a Capacitor 8 iOS project (Swift Package Manager, no CocoaPods), bundle id `com.jeffersonpike.inkbeforedark`, display name "Ink Before Dark", app icon installed (1024, no alpha), iPhone and iPad, portrait and landscape.
- `Info.plist` — AdMob application id (**Google's public test id**), the tracking-permission sentence, Google's SKAdNetwork id, status bar hidden, export-compliance flag set to "no non-exempt encryption".
- The ad layer in `index.html` (`Ads`): rewarded ads for the supply wheel, interstitials only between charts after the first coast and never two charts running. It uses **Google's public test ad units**.
- `privacy.html` — served at https://jeffersonpikejr.github.io/ink-before-dark/privacy.html (the privacy-policy URL the store asks for).

## What only Jefferson can do
1. **Free about 45 GB and install Xcode 26** from the Mac App Store (this Mac had under 1 GB free). Apple has required Xcode 26 and the iOS 26 SDK for submissions since 2026-04-28.
2. **Enrol in the Apple Developer Program** (individual, $99 a year). Then in App Store Connect: enrol in the **Small Business Program**, and create the app record with the bundle id above.
3. **Create an AdMob account**, register the iOS app, create one rewarded and one interstitial unit. AdMob wants an `app-ads.txt` at the root of the developer website named in the store listing; for a github.io address that means a `jeffersonpikejr.github.io` user-site repo holding that one file.
4. **Confirm the side product is inside his employer's outside-activity policy** before anything is submitted under his name.

## Then, in order
```bash
npm install          # once
npm run ios          # builds www/, syncs, opens Xcode
```
1. In Xcode: pick the team under Signing & Capabilities; run on an iPad simulator and on the real iPad.
2. Check on device: Pencil precision, the supply wheel showing a **test** rewarded ad and paying out, no interstitial in the first session, then at most one per three finished charts, the tracking prompt wording.
3. Replace the three test ids with real ones: `GADApplicationIdentifier` in `ios/App/App/Info.plist`, and `Ads.ids.rewarded` / `Ads.ids.interstitial` in `index.html`. Set `initializeForTesting:false`. Add the rest of Google's current SKAdNetwork list to `Info.plist`.
4. **Remove Ads** purchase: not built. Needs a non-consumable product in App Store Connect and a StoreKit plugin; on success set `META.noAds=true` (the ad layer already honours it).
5. Game Center leaderboard for tonight's bay: not built.
6. Archive, upload, TestFlight internal, then a public TestFlight link for outside testers.
7. Submit. Category: Games › Puzzle. **Not** the Kids category (it restricts third-party ads).

## Review risks to prepare for
- **"It is a website in a wrapper" (guideline 4.2).** The answer is in the build: it runs fully offline from bundled files, uses Pencil, haptics (to add), Game Center (to add), in-app purchase, and has no browser chrome or links out.
- **Privacy labels.** With the Google Mobile Ads SDK, declare: Device ID, Advertising Data, Coarse Location, Performance Data, Crash Data, Product Interaction (Google's list: https://developers.google.com/admob/ios/privacy/data-disclosure).
- **Ads rules.** Interstitials must be clearly ads with a visible close (guideline 2.5.18). Nothing may be withheld from a player who declines tracking (5.1.2); the game never checks the answer. Remove Ads must be an Apple in-app purchase.
- **Age rating.** Answer the 2026 questionnaire; expect 4+. Do not describe the game as for children anywhere in the listing.
- **Icon** must have no transparency (done) and screenshots must show the app in use.

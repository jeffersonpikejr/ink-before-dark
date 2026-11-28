import Foundation
import Capacitor
import GameKit

/// Game Center for Ink Before Dark: sign the player in, post a score, show a leaderboard.
/// JavaScript reaches it as `Capacitor.Plugins.GameCenter`.
///
/// Sign-in is never forced. `signIn` resolves `{ signedIn: false }` when the player declines or
/// Game Center is switched off, and the game carries on without it. With `silent: true` it never
/// shows Game Center's sign-in sheet: it only reports whether the player is already signed in.
@objc(GameCenterPlugin)
public class GameCenterPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "GameCenterPlugin"
    public let jsName = "GameCenter"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "signIn", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "submitScore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showLeaderboard", returnType: CAPPluginReturnPromise)
    ]

    /// The `signIn` call waiting for Game Center's answer. The handler can fire more than once, or not at all.
    private var pendingSignIn: CAPPluginCall?
    private var pendingSilent = false
    private var signInAttempt = 0

    @objc func signIn(_ call: CAPPluginCall) {
        let silent = call.getBool("silent") ?? false
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            let player = GKLocalPlayer.local
            if player.isAuthenticated {
                call.resolve(["signedIn": true, "alias": player.alias])
                return
            }
            // An earlier call still waiting is answered first, so no call is ever left hanging.
            self.finishSignIn(signedIn: false, reason: "superseded")
            self.pendingSignIn = call
            self.pendingSilent = silent
            self.signInAttempt += 1
            let attempt = self.signInAttempt
            // Game Center does not always answer (a simulator; a device with Game Center switched off).
            // Give up quietly: soon for a silent check, later when its sign-in sheet may be on screen.
            DispatchQueue.main.asyncAfter(deadline: .now() + (silent ? 4 : 30)) { [weak self] in
                guard let self = self, self.signInAttempt == attempt else { return }
                self.finishSignIn(signedIn: false, reason: "no answer from Game Center")
            }
            player.authenticateHandler = { [weak self] viewController, error in
                DispatchQueue.main.async {
                    guard let self = self else { return }
                    if let viewController = viewController {
                        // Game Center wants to show its own sign-in sheet. A silent check does not let it,
                        // and neither does a call that has already been answered.
                        if self.pendingSilent || self.pendingSignIn == nil {
                            self.finishSignIn(signedIn: false, reason: "not signed in")
                        } else {
                            self.bridge?.viewController?.present(viewController, animated: true)
                        }
                        return
                    }
                    if GKLocalPlayer.local.isAuthenticated {
                        self.finishSignIn(signedIn: true, reason: nil)
                    } else {
                        self.finishSignIn(signedIn: false, reason: error?.localizedDescription ?? "not signed in")
                    }
                }
            }
        }
    }

    private func finishSignIn(signedIn: Bool, reason: String?) {
        guard let call = pendingSignIn else { return }
        pendingSignIn = nil
        if signedIn {
            call.resolve(["signedIn": true, "alias": GKLocalPlayer.local.alias])
        } else {
            call.resolve(["signedIn": false, "reason": reason ?? "not signed in"])
        }
    }

    @objc func submitScore(_ call: CAPPluginCall) {
        guard let leaderboardID = call.getString("leaderboardID"), let score = call.getInt("score") else {
            call.reject("leaderboardID and score are required")
            return
        }
        guard GKLocalPlayer.local.isAuthenticated else {
            call.resolve(["submitted": false, "reason": "not signed in"])
            return
        }
        GKLeaderboard.submitScore(score, context: 0, player: GKLocalPlayer.local, leaderboardIDs: [leaderboardID]) { error in
            if let error = error {
                call.resolve(["submitted": false, "reason": error.localizedDescription])
            } else {
                call.resolve(["submitted": true])
            }
        }
    }

    @objc func showLeaderboard(_ call: CAPPluginCall) {
        guard let leaderboardID = call.getString("leaderboardID") else {
            call.reject("leaderboardID is required")
            return
        }
        DispatchQueue.main.async {
            guard GKLocalPlayer.local.isAuthenticated else {
                call.resolve(["shown": false, "reason": "not signed in"])
                return
            }
            if #available(iOS 18.0, macOS 15.0, *) {
                // The access point is how Game Center is opened from iOS 18 on; the view controller below is deprecated in iOS 26.
                GKAccessPoint.shared.trigger(leaderboardID: leaderboardID, playerScope: .global, timeScope: .today, handler: nil)
            } else {
                let controller = GKGameCenterViewController(leaderboardID: leaderboardID, playerScope: .global, timeScope: .today)
                controller.gameCenterDelegate = self.legacyDismisser
                self.bridge?.viewController?.present(controller, animated: true)
            }
            call.resolve(["shown": true])
        }
    }

    private let legacyDismisser = LegacyBoardDismisser()
}

/// Closes the older Game Center screen used on iOS 15 to 17.
private final class LegacyBoardDismisser: NSObject, GKGameCenterControllerDelegate {
    func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
        gameCenterViewController.dismiss(animated: true)
    }
}

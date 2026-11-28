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

    /// The first `signIn` call waiting for Game Center's answer. The handler can fire more than once.
    private var pendingSignIn: CAPPluginCall?
    private var pendingSilent = false

    @objc func signIn(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let player = GKLocalPlayer.local
            if player.isAuthenticated {
                call.resolve(["signedIn": true, "alias": player.alias])
                return
            }
            self.pendingSignIn = call
            self.pendingSilent = call.getBool("silent") ?? false
            player.authenticateHandler = { [weak self] viewController, error in
                guard let self = self else { return }
                if let viewController = viewController {
                    // Game Center wants to show its own sign-in sheet. A silent check does not let it.
                    if self.pendingSilent {
                        let waiting = self.pendingSignIn
                        self.pendingSignIn = nil
                        waiting?.resolve(["signedIn": false, "reason": "not signed in"])
                    } else {
                        self.bridge?.viewController?.present(viewController, animated: true)
                    }
                    return
                }
                let waiting = self.pendingSignIn
                self.pendingSignIn = nil
                if GKLocalPlayer.local.isAuthenticated {
                    waiting?.resolve(["signedIn": true, "alias": GKLocalPlayer.local.alias])
                } else {
                    waiting?.resolve(["signedIn": false, "reason": error?.localizedDescription ?? "not signed in"])
                }
            }
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

import Foundation
import Capacitor

/// A second copy of the save, kept as a file in Application Support.
/// JavaScript reaches it as `Capacitor.Plugins.Vault`.
///
/// The game's save lives in the web view's localStorage, which iOS may clear when the device is
/// short of space. This copy is outside the web view, is included in the device backup, and is read
/// back at launch if localStorage comes up empty. It uses plain file reads and writes only (no
/// UserDefaults), so it adds no "required reason" API to the app's privacy manifest.
@objc(VaultPlugin)
public class VaultPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "VaultPlugin"
    public let jsName = "Vault"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "get", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "set", returnType: CAPPluginReturnPromise)
    ]

    private let queue = DispatchQueue(label: "inkbeforedark.vault")

    /// Keys become file names, so only letters, digits, underscore and hyphen are allowed.
    private func fileURL(for key: String) -> URL? {
        let allowed = CharacterSet(charactersIn: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-")
        guard !key.isEmpty, key.count <= 64, key.unicodeScalars.allSatisfy({ allowed.contains($0) }) else { return nil }
        guard let support = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first else { return nil }
        let folder = support.appendingPathComponent("InkBeforeDark", isDirectory: true)
        try? FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
        return folder.appendingPathComponent(key + ".json")
    }

    @objc func get(_ call: CAPPluginCall) {
        guard let key = call.getString("key"), let url = fileURL(for: key) else {
            call.reject("a plain key is required")
            return
        }
        queue.async {
            if let data = try? Data(contentsOf: url), let text = String(data: data, encoding: .utf8) {
                call.resolve(["value": text])
            } else {
                call.resolve(["value": NSNull()])
            }
        }
    }

    @objc func set(_ call: CAPPluginCall) {
        guard let key = call.getString("key"), let value = call.getString("value"), let url = fileURL(for: key) else {
            call.reject("a plain key and a string value are required")
            return
        }
        queue.async {
            do {
                try Data(value.utf8).write(to: url, options: .atomic)
                call.resolve()
            } catch {
                call.reject("could not write the save", nil, error)
            }
        }
    }
}

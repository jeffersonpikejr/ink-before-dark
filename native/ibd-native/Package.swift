// swift-tools-version: 5.9
import PackageDescription

// Ink Before Dark's own native code. A local package: `npx cap sync ios` adds it to CapApp-SPM.
let package = Package(
    name: "IbdNative",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "IbdNative",
            targets: ["IbdNativePlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0")
    ],
    targets: [
        .target(
            name: "IbdNativePlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/IbdNativePlugin")
    ]
)

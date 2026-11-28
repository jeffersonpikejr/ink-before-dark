#!/bin/zsh
# Runs the built app on one simulator with the in-app self-test, and photographs it at each SHOT marker.
#   node scripts/selftest.mjs && <build> && scripts/sim-selftest.sh "iPhone 18 Pro" /path/to/out /path/to/App.app
# Needs no tapping and no Simulator window. Leaves console.log and one PNG per scene in the out folder.
export DEVELOPER_DIR=${DEVELOPER_DIR:-/Applications/Xcode.app/Contents/Developer}
DEV="$1"; OUT="$2"; APP="$3"; BID=com.jeffersonpike.inkbeforedark
nap() { python3 -c "import time;time.sleep($1)"; }
mkdir -p "$OUT"; : > "$OUT/console.log"
xcrun simctl boot "$DEV" 2>/dev/null; xcrun simctl bootstatus "$DEV" -b >/dev/null 2>&1
xcrun simctl uninstall "$DEV" $BID >/dev/null 2>&1     # a fresh install, so a fresh save
xcrun simctl install "$DEV" "$APP" || { echo "install failed"; exit 1; }
( xcrun simctl launch --console-pty --terminate-running-process "$DEV" $BID >> "$OUT/console.log" 2>&1 ) &
seen=0; t=0
while [ $t -lt 900 ]; do
  n=$(grep -c "SELFTEST SHOT" "$OUT/console.log" 2>/dev/null); n=${n:-0}
  while [ $seen -lt $n ]; do seen=$((seen+1))
    name=$(grep "SELFTEST SHOT" "$OUT/console.log" | sed -n "${seen}p" | sed 's/.*SELFTEST SHOT //' | tr -cd 'a-zA-Z0-9-')
    nap 0.6; xcrun simctl io "$DEV" screenshot "$OUT/$name.png" >/dev/null 2>&1; echo "shot $name"; done
  grep -q "SELFTEST DONE\|SELFTEST crash" "$OUT/console.log" && break
  nap 0.3; t=$((t+1))
done
nap 1; xcrun simctl io "$DEV" screenshot "$OUT/final.png" >/dev/null 2>&1
grep -a "SELFTEST" "$OUT/console.log" | sed 's/.*SELFTEST /SELFTEST /' | grep -v "SELFTEST SHOT" | cut -c1-1500
xcrun simctl terminate "$DEV" $BID >/dev/null 2>&1

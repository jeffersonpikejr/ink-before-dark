// Puts the in-app self-test into the synced iOS bundle (ios/App/App/public), so a built app tests itself at launch.
//   node scripts/selftest.mjs        inject          then build and launch with: xcrun simctl launch --console-pty <device> com.jeffersonpike.inkbeforedark
//   npx cap copy ios                 take it out again (always do this before a build that is going anywhere)
import fs from 'node:fs'; import path from 'node:path';
const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..'), target = path.join(root, 'ios', 'App', 'App', 'public', 'index.html');
let html = fs.readFileSync(target, 'utf8');
if (html.includes('SELFTEST')) { console.log('already injected'); process.exit(0); }
const walk = fs.readFileSync(path.join(root, 'test', 'walk.js'), 'utf8'), self = fs.readFileSync(path.join(root, 'test', 'selftest.js'), 'utf8');
html = html.replace('</body>', '<script>\n' + walk + '\n</script>\n<script>\n' + self + '\n</script>\n</body>');
fs.writeFileSync(target, html); console.log('self-test injected into', path.relative(root, target));

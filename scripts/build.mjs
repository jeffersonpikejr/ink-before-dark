// Copies the web game into www/ for Capacitor. The game stays one file; nothing is transformed.
import fs from 'node:fs'; import path from 'node:path';
const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..'), out = path.join(root, 'www');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
for (const f of ['index.html', 'manifest.webmanifest', 'privacy.html']) fs.copyFileSync(path.join(root, f), path.join(out, f));
for (const f of fs.readdirSync(path.join(root, 'assets'))) if (f.endsWith('.png')) fs.copyFileSync(path.join(root, 'assets', f), path.join(out, 'assets', f));
console.log('www/ built from index.html, version', (fs.readFileSync(path.join(root, 'index.html'), 'utf8').match(/const VERSION='([^']+)'/) || [])[1]);

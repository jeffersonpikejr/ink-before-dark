// Headless bench for the kill criterion. Loads index.html's script with DOM stubs and
// runs three bots across N seeded bays:   node test/bench.mjs [N] [seed0] [KEY=value ...]
//   blank  draws nothing            -> must almost always lose  (home <= 15% of nights)
//   slash  marks rocks on likely courses, not knowing the lamp order -> the middle band (40-70%)
//   omni   knows tonight's order, same ink                        -> must almost always win (>= 90%)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const here = path.dirname(new URL(import.meta.url).pathname);
const html = fs.readFileSync(path.join(here, '..', 'index.html'), 'utf8');
const src = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const noop = () => {};
const ctx2d = new Proxy({}, { get: (t, k) => (k === 'canvas' ? {} : (k in t ? t[k] : (k === 'createRadialGradient' ? () => ({ addColorStop: noop }) : noop))), set: (t, k, v) => { t[k] = v; return true; } });
const elem = () => ({ style: {}, classList: { add: noop, remove: noop, toggle: noop }, firstElementChild: { style: {}, textContent: '' }, lastElementChild: { innerHTML: '' },
  getContext: () => ctx2d, addEventListener: noop, appendChild: noop, querySelector: () => null, setPointerCapture: noop, width: 0, height: 0, textContent: '', innerHTML: '', click: noop });
const sandbox = { console, performance: { now: () => 0 }, requestAnimationFrame: noop, setTimeout: noop, clearTimeout: noop, innerWidth: 1000, innerHeight: 640,
  addEventListener: noop, navigator: {}, localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
  document: { getElementById: elem, createElement: elem, body: { classList: { toggle: noop } } } };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const IBD = sandbox.IBD;
const args = process.argv.slice(2), nums = args.filter(a => !a.includes('='));
let LEVEL;
for (const kv of args.filter(a => a.includes('='))) { const [k, v] = kv.split('='); if (k === 'LEVEL') { LEVEL = Number(v); continue; } IBD.CFG[k] = v.includes(',') ? v.split(',').map(Number) : Number(v); }
const N = Number(nums[0] || 400), seed0 = Number(nums[1] || 1);
const t0 = Date.now();
const r = IBD.bench(N, seed0, LEVEL);
const row = (n, o) => `${n.padEnd(6)} home by night ${o.homePct.map(v => String(v).padStart(3) + '%').join(' ')}   all nights ${String(o.homeAll).padStart(3)}%   all-three ${String(o.all3Pct).padStart(3)}%   strikes ${o.strikes.join(' / ')}`;
console.log(`bays ${r.n}  (avg rocks ${r.rocksAvg})   ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log(row('blank', r.blank)); console.log(row('slash', r.slash)); console.log(row('omni', r.omni));
const pass = r.blank.homeAll <= 15 && r.slash.homeAll >= 40 && r.slash.homeAll <= 70 && r.omni.homeAll >= 90;
console.log(pass ? 'KILL CRITERION: PASS' : 'KILL CRITERION: FAIL  (need blank <= 15, slash 40-70, omni >= 90)');
process.exit(pass ? 0 : 1);

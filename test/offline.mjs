import fs from 'node:fs';import path from 'node:path';
// The game must play with no network at all: nothing it loads may come from another host.
//   node test/offline.mjs
// Checks the game file itself, and the bundle `npm run build` makes for the App Store wrapper if one is there.
const root=path.join(path.dirname(new URL(import.meta.url).pathname),'..'),fail=[];
function audit(file){const t=fs.readFileSync(file,'utf8'),name=path.relative(root,file);
  // anything that fetches: tags with a remote source, CSS url(), script calls that reach the network
  const remote=[...t.matchAll(/<(?:script|link|img|iframe|audio|video|source)\b[^>]*?(?:src|href)\s*=\s*["'](https?:)?\/\/[^"']+/gi)].map(m=>m[0].slice(0,90));
  const cssUrl=[...t.matchAll(/url\(\s*["']?(?:https?:)?\/\/[^)]+\)/gi)].map(m=>m[0].slice(0,90));
  const calls=[...t.matchAll(/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|importScripts)\s*\(/g)].map(m=>m[0]);
  if(remote.length)fail.push(name+' loads from another host: '+remote.join(' | '));if(cssUrl.length)fail.push(name+' has a remote CSS url: '+cssUrl.join(' | '));
  if(calls.length)fail.push(name+' calls the network: '+[...new Set(calls)].join(' '));
  for(const m of t.matchAll(/(?:src|href)\s*=\s*["']([^"'#:]+\.(?:png|svg|webmanifest|html|js|css))["']/gi)){const f=path.join(path.dirname(file),m[1]);if(!fs.existsSync(f))fail.push(name+' refers to a file that is not there: '+m[1]);}}
audit(path.join(root,'index.html'));
const www=path.join(root,'www');let bundled='no www/ bundle to check (run `npm run build`)';
if(fs.existsSync(path.join(www,'index.html'))){audit(path.join(www,'index.html'));
  if(fs.readFileSync(path.join(www,'index.html'),'utf8')!==fs.readFileSync(path.join(root,'index.html'),'utf8'))fail.push('www/index.html is stale: run `npm run build`');
  bundled='bundle '+fs.readdirSync(www).length+' entries, '+Math.round(fs.statSync(path.join(www,'index.html')).size/1024)+' KB of game';}
// inside the app the service worker is never registered: the files are already on the device
if(!/'serviceWorker' in navigator&&!Ads\.native/.test(fs.readFileSync(path.join(root,'index.html'),'utf8')))fail.push('the service worker is no longer skipped inside the app');
console.log(fail.length?'OFFLINE: FAIL\n  '+fail.join('\n  '):'OFFLINE: PASS  nothing is loaded from another host; '+bundled);process.exit(fail.length?1:0);

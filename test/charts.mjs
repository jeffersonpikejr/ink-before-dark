import fs from 'node:fs';import vm from 'node:vm';
// Every shipped chart must obey the rule: a blank chart loses the first night, a perfect chart wins all three.
//   node test/charts.mjs
import path from 'node:path';const here=path.dirname(new URL(import.meta.url).pathname);
const html=fs.readFileSync(path.join(here,'..','index.html'),'utf8');const src=html.slice(html.indexOf("<script>\n'use strict'")+8,html.lastIndexOf('</script>'));
const noop=()=>{};const ctx2d=new Proxy({},{get:(t,k)=>(k in t?t[k]:(k==='createRadialGradient'?()=>({addColorStop:noop}):noop)),set:(t,k,v)=>{t[k]=v;return true;}});
const elem=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},firstElementChild:{style:{},textContent:''},lastElementChild:{innerHTML:''},getContext:()=>ctx2d,getBoundingClientRect:()=>({left:0,top:0,width:1000,height:640}),addEventListener:noop,appendChild:noop,querySelector:()=>null,querySelectorAll:()=>[],width:0,height:0,textContent:''});
const sb={console,performance:{now:()=>0},requestAnimationFrame:noop,setTimeout:noop,clearTimeout:noop,innerWidth:1000,innerHeight:640,addEventListener:noop,navigator:{},location:{search:''},localStorage:{getItem:()=>null,setItem:noop,removeItem:noop},document:{addEventListener:noop,hidden:false,getElementById:elem,createElement:elem,body:{classList:{toggle:noop}}}};sb.window=sb;vm.createContext(sb);
vm.runInContext(src+`;globalThis.__v=function(){const bad=[];COASTS.forEach((C,co)=>C.seeds.forEach((sd,L)=>{const r=bench(1,sd,L,co);const f=o=>o.homePct.filter(v=>v===100).length;if(!(r.blank.homePct[0]===0&&f(r.omni)===3))bad.push([co+1,L+1,r.blank.homePct,r.omni.homePct]);}));return bad;};`,sb);
const bad=sb.__v();console.log('charts failing the rule (blank loses night 1, perfect wins all 3):',bad.length,JSON.stringify(bad));process.exit(bad.length?1:0);

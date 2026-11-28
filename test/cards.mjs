import fs from 'node:fs';import vm from 'node:vm';import path from 'node:path';
// The tutorial cards, checked without a browser.
//   node test/cards.mjs
// 1. every thing a shipped chart can ask of the player has a card, and every card's picture draws without error
// 2. a fresh save is walked through the first bay in the right order, and never shown a card twice
// 3. a save from before the cards existed is not walked through what its player already knows
// 4. with cards turned off nothing is shown and the first night is not guided
const here=path.dirname(new URL(import.meta.url).pathname);
const html=fs.readFileSync(path.join(here,'..','index.html'),'utf8');const src=html.slice(html.indexOf("<script>\n'use strict'")+8,html.lastIndexOf('</script>'));
const noop=()=>{};const ctx2d=new Proxy({},{get:(t,k)=>(k in t?t[k]:(k==='createRadialGradient'?()=>({addColorStop:noop}):noop)),set:(t,k,v)=>{t[k]=v;return true;}});
const made={};const elem=id=>{if(id&&made[id])return made[id];const e={id,style:{},classList:{add:noop,remove:noop,toggle:noop},firstElementChild:{style:{},textContent:''},lastElementChild:{innerHTML:''},getContext:()=>ctx2d,getBoundingClientRect:()=>({left:0,top:0,width:1000,height:640}),addEventListener:noop,appendChild:noop,querySelector:()=>null,querySelectorAll:()=>[],setPointerCapture:noop,width:0,height:0,textContent:'',innerHTML:'',click(){if(this.onclick)this.onclick({preventDefault:noop,stopPropagation:noop});}};if(id)made[id]=e;return e;};
const store={};
const sb={console,performance:{now:()=>0},requestAnimationFrame:noop,setTimeout:noop,clearTimeout:noop,innerWidth:1000,innerHeight:640,addEventListener:noop,navigator:{},location:{search:''},
  localStorage:{getItem:k=>(k in store?store[k]:null),setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}},
  document:{addEventListener:noop,hidden:false,getElementById:elem,createElement:()=>elem(),body:{classList:{toggle:noop,add:noop},appendChild:noop}}};sb.window=sb;vm.createContext(sb);
vm.runInContext(src+`;globalThis.__t={
  coverage(){const used=new Set(),missing=[];COASTS.forEach((C,co)=>C.seeds.forEach((sd,L)=>{DIFF=coastDiff(L,co);const b=genBay(sd);for(let ni=0;ni<3;ni++)for(const f of feats(b,ni)){used.add(f);if(!CARDS[f]||!CARDS[f].h)missing.push(f);}}));
    const mech=CARD_IDS.filter(id=>CARDS[id].h),unused=mech.filter(id=>!used.has(id));return{missing:[...new Set(missing)],unused,used:[...used]};},
  draws(){const bad=[];for(const id of CARD_IDS){const d=CARDS[id];if(!d.k||!d.t||!d.l||!(d.len>0))bad.push(id+': incomplete');const words=d.l.split(/\\s+/).length;if(words>16)bad.push(id+': '+words+' words');
      for(let k=0;k<=24;k++){try{d.draw(document.getElementById('cardC').getContext('2d'),d.len*k/24);}catch(e){bad.push(id+' @'+k+': '+e.message);break;}}}return bad;},
  // a whole first bay on a fresh save, pressing Next on every card, drawing nothing
  firstBay(){const seq=[];const take=()=>{let g=0;while(Cards.open&&g++<9){seq.push(Cards.deck[Cards.i]);nextCard();}};
    S.co=0;startBay(false,null,0);const guided=!!S.guide,track=S.guideTrack?S.guideTrack.length:0;take();
    for(let ni=0;ni<3;ni++){startNight();take();let g=0;while(S.phase==='night'&&g++<60000)update(1/60);g=0;while(g++<900){update(1/60);take();}
      if(ni<2){S.ni++;startDusk();take();}}
    return{seq,guided,track,guideAfter:!!S.guide,seen:Object.keys(META.cards.seen).sort(),phase:S.phase};},
  secondBay(){const seq=[];S.co=0;startBay(false,null,1);let g=0;while(Cards.open&&g++<9){seq.push(Cards.deck[Cards.i]);nextCard();}return{seq,guide:!!S.guide};},
  encounter(co,L,ni){S.co=co;S.ci=L;DIFF=coastDiff(L,co);S.bay=genBay(COASTS[co].seeds[L]);S.ni=ni;return duskCards().ids.filter(id=>!cardSeen(id));},
  async reload(){META={schema:SCHEMA,muted:false,bays:0,nightsHome:0,nights:0,daily:{},coast:{bays:[]},coast2:{bays:[]},coast3:{bays:[]},inv:{ink:0,light:0,tide:0},cards:{off:false,seen:{}}};await loadMeta();return JSON.parse(JSON.stringify(META.cards));},
  off(){META.cards={off:true,seen:{}};S.co=0;startBay(false,null,0);return{open:Cards.open,guide:!!S.guide};},
  meta(){return META;},reset(){META.cards={off:false,seen:{}};META.nights=0;META.bays=0;}
};`,sb);
const T=sb.__t,fail=[];const ok=(c,m)=>{if(!c)fail.push(m);};
const cov=T.coverage();ok(!cov.missing.length,'features with no card: '+cov.missing);ok(!cov.unused.length,'cards no shipped chart ever shows: '+cov.unused);
const bad=T.draws();ok(!bad.length,'card problems: '+bad.join('; '));
T.reset();const fb=T.firstBay();
ok(fb.guided&&fb.track>1,'the first night is not guided');ok(!fb.guideAfter,'the guide outlived the first night');
ok(fb.seq.slice(0,3).join()==='dusk,draw,night','first cards are '+fb.seq.slice(0,3));
ok(fb.seq.includes('wreck'),'no card at the first strike');ok(fb.seq.includes('again')&&fb.seq.includes('ink'),'no cards at the second dusk');ok(fb.seq.includes('lamps'),'no card when the first bay is finished');
ok(new Set(fb.seq).size===fb.seq.length,'a card was shown twice: '+fb.seq);
const sbay=T.secondBay();ok(!sbay.guide,'the second bay is guided');ok(!sbay.seq.some(id=>['dusk','draw','night','again','ink'].includes(id)),'second bay repeated '+sbay.seq);
// what each coast's first chart introduces, to a player who has seen everything before it
T.reset();for(const id of['dusk','draw','ink','night','wreck','tide','again','guided','lamps','marks'])T.meta().cards.seen[id]=1;
const want=[[1,0,0,'current'],[2,0,0,'river'],[2,0,2,'barges'],[3,0,0,'drying'],[4,0,0,'cloud'],[5,0,0,'bars'],[6,0,0,'ice'],[7,0,0,'decoy'],[8,0,0,'lanes'],[9,0,0,'six']];
for(const [co,L,ni,id] of want){const got=T.encounter(co,L,ni);ok(got[0]===id||(ni>0&&got.includes(id)),'coast '+(co+1)+' night '+(ni+1)+' offers '+got+' not '+id);}
// an old save: played before the cards existed
store.ibd_save=JSON.stringify({schema:1,muted:false,bays:14,nightsHome:22,nights:40,daily:{'2026-11-18':{home:2,strikes:3}},coast:{bays:[{lamps:3,dry:false,tries:2}]},coast2:{bays:[{lamps:2,dry:false,tries:1}]},inv:{ink:1,light:0,tide:0}});
const old=await T.reload();
for(const id of['dusk','draw','ink','night','wreck','again','guided','lamps','current','log','supplies'])ok(old.seen[id]===1,'old save was not credited with '+id);
ok(!old.seen.river&&!old.seen.ice,'old save was credited with coasts it never played');ok(old.off===false,'old save came back with cards off');
store.ibd_save=JSON.stringify({schema:1,bays:3,nights:9,cards:{off:true,seen:{dusk:1}}});const kept=await T.reload();ok(kept.off===true&&kept.seen.dusk===1&&!kept.seen.night,'a save with its own card state was not respected');
delete store.ibd_save;const fresh=await T.reload();ok(fresh.off===false&&!Object.keys(fresh.seen).length,'a fresh save does not start clean');
const off=T.off();ok(!off.open&&!off.guide,'cards showed, or the night was guided, with cards off');
console.log('cards: '+Object.keys(sb.__t.meta().cards).length+' fields; first bay showed '+fb.seq.join(' > '));
console.log(fail.length?'CARDS: FAIL\n  '+fail.join('\n  '):'CARDS: PASS ('+cov.used.length+' features on the shipped charts, all carded)');process.exit(fail.length?1:0);

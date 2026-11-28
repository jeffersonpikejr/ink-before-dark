import fs from 'node:fs';import vm from 'node:vm';import path from 'node:path';
// The App Store build's game-side code, run against stand-in plugins (no Xcode, no device).
//   node test/native.mjs
// It proves what the JavaScript asks of each plugin, and in what order. It cannot prove the Swift side answers.
const here=path.dirname(new URL(import.meta.url).pathname);
const html=fs.readFileSync(path.join(here,'..','index.html'),'utf8');const src=html.slice(html.indexOf("<script>\n'use strict'")+8,html.lastIndexOf('</script>'));
const noop=()=>{};const ctx2d=new Proxy({},{get:(t,k)=>(k in t?t[k]:(k==='createRadialGradient'?()=>({addColorStop:noop}):noop)),set:(t,k,v)=>{t[k]=v;return true;}});
const made={};const elem=id=>{if(id&&made[id])return made[id];const e={id,style:{},classList:{add:noop,remove:noop,toggle:noop},firstElementChild:{style:{},textContent:''},lastElementChild:{innerHTML:''},getContext:()=>ctx2d,getBoundingClientRect:()=>({left:0,top:0,width:1000,height:640}),addEventListener:noop,appendChild:noop,querySelector:()=>null,querySelectorAll:()=>[],setPointerCapture:noop,width:0,height:0,textContent:'',innerHTML:''};if(id)made[id]=e;return e;};
const store={},timers=[],calls=[];
const world={owned:false,buyFails:false,gcSignedIn:true,vault:null,consent:'REQUIRED'};
const rec=(p,m,a)=>{calls.push([p,m,a]);};
const Plugins={
  Haptics:{impact:async a=>rec('Haptics','impact',a),notification:async a=>rec('Haptics','notification',a)},
  NativePurchases:{
    getPurchases:async a=>{rec('Store','getPurchases',a);return{purchases:world.owned?[{productIdentifier:'com.jeffersonpike.inkbeforedark.removeads'}]:[]};},
    getProduct:async a=>{rec('Store','getProduct',a);return{product:{identifier:a.productIdentifier,title:'Remove Ads',priceString:'$3.99',price:3.99}};},
    purchaseProduct:async a=>{rec('Store','purchaseProduct',a);if(world.buyFails)throw new Error('cancelled');world.owned=true;return{transactionId:'1'};},
    restorePurchases:async()=>{rec('Store','restorePurchases');}},
  GameCenter:{signIn:async a=>{rec('GC','signIn',a);return{signedIn:world.gcSignedIn};},submitScore:async a=>{rec('GC','submitScore',a);return{submitted:true};},showLeaderboard:async a=>{rec('GC','showLeaderboard',a);return{shown:true};}},
  Vault:{get:async a=>{rec('Vault','get',a);return{value:world.vault};},set:async a=>{rec('Vault','set',a);world.vault=a.value;}},
  AdMob:{requestConsentInfo:async()=>{rec('AdMob','requestConsentInfo');return{status:world.consent,isConsentFormAvailable:true,canRequestAds:true,privacyOptionsRequirementStatus:'REQUIRED'};},showConsentForm:async()=>{rec('AdMob','showConsentForm');},
    initialize:async a=>{rec('AdMob','initialize',a);},requestTrackingAuthorization:async()=>{rec('AdMob','requestTrackingAuthorization');},
    prepareInterstitial:async a=>{rec('AdMob','prepareInterstitial',a);},showInterstitial:async()=>{rec('AdMob','showInterstitial');},
    prepareRewardVideoAd:async a=>{rec('AdMob','prepareRewardVideoAd',a);},showRewardVideoAd:async()=>{rec('AdMob','showRewardVideoAd');return{type:'supply',amount:1};},showPrivacyOptionsForm:async()=>{rec('AdMob','showPrivacyOptionsForm');}}};
const sb={console,performance:{now:()=>0},requestAnimationFrame:noop,setTimeout:(fn)=>{timers.push(fn);return timers.length;},clearTimeout:noop,innerWidth:1000,innerHeight:640,addEventListener:noop,navigator:{},location:{search:'',protocol:'capacitor:'},
  Capacitor:{isNativePlatform:()=>true,Plugins},
  localStorage:{getItem:k=>(k in store?store[k]:null),setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}},
  document:{addEventListener:noop,hidden:false,getElementById:elem,createElement:()=>elem(),body:{classList:{toggle:noop,add:c=>rec('body','class',c)},appendChild:noop}}};sb.window=sb;vm.createContext(sb);
vm.runInContext(src+`;globalThis.__n={Native,Ads,loadMeta,saveMeta,meta:()=>META,setMeta:m=>{META=m;},S,
  blank(){return{schema:SCHEMA,muted:false,bays:0,nightsHome:0,nights:0,daily:{},coast:{bays:[]},coast2:{bays:[]},coast3:{bays:[]},inv:{ink:0,light:0,tide:0},cards:{off:true,seen:{}}};},
  playBay(daily){if(daily)startBay(true);else{S.co=0;startBay(false,null,0);}for(let ni=0;ni<3;ni++){startNight();let g=0;while(S.phase==='night'&&g++<60000)update(1/60);g=0;while(g++<900)update(1/60);if(ni<2){S.ni++;startDusk();}}return S.results.map(r=>({made:r.made,strikes:r.strikes,margin:r.margin}));}
};`,sb);
const N=sb.__n,fail=[];const ok=(c,m)=>{if(!c)fail.push(m);};const tick=async()=>{for(let i=0;i<12;i++)await Promise.resolve();await new Promise(r=>setImmediate(r));};
const of=(p,m)=>calls.filter(c=>c[0]===p&&c[1]===m);const flush=()=>{while(timers.length)timers.shift()();};
await tick();
// 1. boot: the store is asked what is owned, then for the price; the row of native links is shown
ok(of('Store','getPurchases').length===1&&of('Store','getPurchases')[0][2].onlyCurrentEntitlements===true,'boot did not ask the store for current entitlements');
ok(N.Native.price==='$3.99','the price did not come from the store');ok(made.storeRow.style.display==='flex','the store row is not shown in the app');
ok(/\$3\.99/.test(made.bNoAds.textContent),'the purchase link does not show the store price: '+made.bNoAds.textContent);
ok(of('GC','signIn').length===0,'Game Center asked for sign-in at first launch');ok(of('AdMob','initialize').length===0,'the ad SDK was started at launch');
// 2. buying: cancelled, then bought
world.buyFails=true;ok(await N.Native.buy()===false&&!N.meta().noAds,'a cancelled purchase removed ads');
world.buyFails=false;ok(await N.Native.buy()===true&&N.meta().noAds===true,'a purchase did not remove ads');ok(made.bNoAds.textContent==='Ads between charts removed'&&made.bRestore.style.display==='none','the title does not show the purchase as owned');
const bought=of('Store','purchaseProduct').pop()[2];ok(bought.productIdentifier==='com.jeffersonpike.inkbeforedark.removeads'&&bought.productType==='inapp','wrong product asked for');
// 3. restore on a fresh install, and a store that answers "nothing" never takes ownership away
N.setMeta(N.blank());world.owned=true;ok(await N.Native.restore()===true&&of('Store','restorePurchases').length===1,'restore did not bring the purchase back');
world.owned=false;await N.Native.storeCheck();ok(N.meta().noAds===true,'an empty answer from the store took the purchase away');
// 4. ads: consent before the first request; no interstitial in a first session; one per three charts; none once bought; five rewarded a day
N.setMeta(N.blank());N.Ads.ready=false;calls.length=0;N.meta().sessions=1;for(let i=0;i<5;i++)await N.Ads.between();ok(of('AdMob','showInterstitial').length===0,'an interstitial showed in the first session');
N.meta().sessions=2;N.Ads.chartsSince=0;for(let i=0;i<7;i++)await N.Ads.between();ok(of('AdMob','showInterstitial').length===2,'interstitials in seven charts: '+of('AdMob','showInterstitial').length+' (want 2)');
const order=calls.filter(c=>c[0]==='AdMob').map(c=>c[1]);ok(order.indexOf('requestConsentInfo')<order.indexOf('showConsentForm')&&order.indexOf('showConsentForm')<order.indexOf('initialize')&&order.indexOf('initialize')<order.indexOf('prepareInterstitial'),'consent did not come before the first ad request: '+order.slice(0,5));
ok(of('AdMob','initialize').length===1,'the ad SDK was started more than once');
N.meta().noAds=true;calls.length=0;N.Ads.chartsSince=0;for(let i=0;i<6;i++)await N.Ads.between();ok(of('AdMob','showInterstitial').length===0,'an interstitial showed after Remove Ads');
N.meta().noAds=false;let won=0;for(let i=0;i<7;i++)if(await N.Ads.rewarded(noop))won++;ok(won===5,'rewarded ads in a day: '+won+' (want 5)');
// 5. a night: strikes and lamps are felt, and so is the dawn
N.setMeta(N.blank());calls.length=0;const res=N.playBay(false);await tick();const strikes=res.reduce((a,r)=>a+r.strikes,0),heavy=of('Haptics','impact').filter(c=>c[2].style==='HEAVY').length,note=of('Haptics','notification').length;
ok(strikes>0&&heavy===strikes,'strikes '+strikes+' but heavy taps '+heavy);ok(note===3,'dawn was felt '+note+' times in three nights');ok(of('GC','submitScore').length===0,'a coast bay was posted to the leaderboard');
// 6. tonight's bay: posted once, first try only, and only if Game Center is signed in
N.setMeta(N.blank());calls.length=0;const day=N.playBay(true);await tick();const posts=of('GC','submitScore');
ok(posts.length===1&&posts[0][2].leaderboardID==='com.jeffersonpike.inkbeforedark.tonight'&&posts[0][2].score===N.Native.score(day),'tonight\'s bay was not posted correctly: '+JSON.stringify(posts.map(p=>p[2])));
ok(of('GC','signIn').every(c=>c[2]&&c[2].silent===true),'posting a score could put the Game Center sign-in sheet up unasked');
N.playBay(true);await tick();ok(of('GC','submitScore').length===1,'a second try at tonight\'s bay was posted');
calls.length=0;await N.Native.gcShow();ok(of('GC','signIn')[0][2].silent===false&&of('GC','showLeaderboard').length===1,'the leaderboard link did not sign in and show the board');
ok(N.Native.score([{made:true,margin:4,strikes:0},{made:true,margin:2.5,strikes:1},{made:false,margin:-1,strikes:3}])===1040+975-150,'score arithmetic');
N.setMeta(N.blank());world.gcSignedIn=false;calls.length=0;N.playBay(true);await tick();ok(of('GC','submitScore').length===0,'a score was posted without Game Center');
// 7. the save is copied out, and the newer copy wins at launch
flush();await tick();N.setMeta(N.blank());N.meta().nights=4;calls.length=0;N.saveMeta();N.saveMeta();flush();await tick();const sets=of('Vault','set');ok(sets.length===1&&JSON.parse(sets[0][2].value).nights===4&&sets[0][2].key==='ibd_save','the save was not copied to the vault once: '+sets.length);
store.ibd_save=JSON.stringify({schema:1,nights:1,bays:1,stamp:100});world.vault=JSON.stringify({schema:1,nights:9,bays:3,stamp:200});N.setMeta(N.blank());await N.loadMeta();ok(N.meta().nights===9,'a newer vault copy did not win');
store.ibd_save=JSON.stringify({schema:1,nights:7,bays:2,stamp:300});N.setMeta(N.blank());await N.loadMeta();ok(N.meta().nights===7,'an older vault copy overwrote the web save');
delete store.ibd_save;N.setMeta(N.blank());await N.loadMeta();ok(N.meta().nights===9,'a lost web save was not restored from the vault');
world.vault='not json';N.setMeta(N.blank());await N.loadMeta();ok(N.meta().nights===0,'a damaged vault copy broke loading');
console.log(fail.length?'NATIVE (mock plugins): FAIL\n  '+fail.join('\n  '):'NATIVE (mock plugins): PASS  store, ads cadence and consent order, haptics, Game Center, vault');process.exit(fail.length?1:0);

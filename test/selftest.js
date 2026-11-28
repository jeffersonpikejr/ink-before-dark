// The app testing itself from inside the iOS shell, for when nothing can tap the Simulator.
// `node scripts/selftest.mjs` injects this (and test/walk.js) into the synced bundle; the built app then runs it at launch
// and prints lines starting SELFTEST to the app's console, which `xcrun simctl launch --console-pty` shows.
// It is never part of the shipped game: `npx cap copy ios` puts the clean bundle back.
(function(){
const say=(k,v)=>console.log('SELFTEST '+k+' '+(typeof v==='string'?v:JSON.stringify(v)));
const wait=ms=>new Promise(r=>setTimeout(r,ms)),$=id=>document.getElementById(id);
const P=n=>window.Capacitor&&window.Capacitor.Plugins?window.Capacitor.Plugins[n]:null;
const tryCall=async(name,fn)=>{try{const r=await Promise.race([fn(),new Promise((_,j)=>setTimeout(()=>j(new Error('no answer in 12 s')),12000))]);say(name,{ok:true,r:r===undefined?null:r});return r;}catch(e){say(name,{ok:false,error:String(e&&e.message||e)});return null;}};
const shot=async name=>{await wait(900);say('SHOT',name);await wait(5200);}; // held long enough for the photograph to be of this scene
const clear=()=>{let g=0;while(IBD.Cards.open&&g++<6)$('cardN').click();};
async function run(){
  await wait(2500);
  const sa=IBD.safeArea(),V=IBD.VIEW,box=$('cv').getBoundingClientRect();
  say('env',{version:IBD.VERSION,native:IBD.Native.on,platform:window.Capacitor&&Capacitor.getPlatform&&Capacitor.getPlatform(),w:innerWidth,h:innerHeight,dpr:devicePixelRatio,safe:sa,rot:V.rot,scale:+V.s.toFixed(3),
    chart:{left:Math.round(V.ox),top:Math.round(V.oy),right:Math.round(V.ox+(V.rot?640:1000)*V.s),bottom:Math.round(V.oy+(V.rot?1000:640)*V.s)},canvas:[Math.round(box.width),Math.round(box.height)],
    storeRow:getComputedStyle($('storeRow')).display,noAdsLabel:$('bNoAds').textContent,fresh:!IBD.META.nights&&!Object.keys(IBD.META.cards.seen).length,ua:navigator.userAgent.slice(0,90)});
  say('plugins',['Haptics','NativePurchases','GameCenter','Vault','AdMob'].map(n=>n+':'+(window.Capacitor.isPluginAvailable?Capacitor.isPluginAvailable(n):'?')));
  // the native calls, one by one
  await tryCall('haptics.impact',()=>P('Haptics').impact({style:'HEAVY'}));
  await tryCall('haptics.notification',()=>P('Haptics').notification({type:'SUCCESS'}));
  const stamp='{"selftest":'+Date.now()+'}';
  await tryCall('vault.set',()=>P('Vault').set({key:'ibd_selftest',value:stamp}));
  const back=await tryCall('vault.get',()=>P('Vault').get({key:'ibd_selftest'}));say('vault.roundtrip',!!(back&&back.value===stamp));
  await tryCall('vault.badkey',()=>P('Vault').get({key:'../etc'}));
  await tryCall('vault.saveCopy',()=>P('Vault').get({key:'ibd_save'}).then(r=>({has:!!(r&&r.value),bytes:r&&r.value?r.value.length:0})));
  const t0=Date.now();await tryCall('gamecenter.signIn(silent)',()=>P('GameCenter').signIn({silent:true}));say('gamecenter.answeredIn',(Date.now()-t0)+' ms');
  await tryCall('gamecenter.submitScore',()=>P('GameCenter').submitScore({leaderboardID:'com.jeffersonpike.inkbeforedark.tonight',score:1}));
  await tryCall('store.getPurchases',()=>P('NativePurchases').getPurchases({productType:'inapp',onlyCurrentEntitlements:true}).then(r=>({count:(r.purchases||[]).length})));
  await tryCall('store.getProduct',()=>P('NativePurchases').getProduct({productIdentifier:'com.jeffersonpike.inkbeforedark.removeads',productType:'inapp'}).then(r=>({title:r.product&&r.product.title,price:r.product&&r.product.priceString})));
  await tryCall('admob.requestConsentInfo',()=>P('AdMob').requestConsentInfo());
  await tryCall('admob.initialize',()=>P('AdMob').initialize({initializeForTesting:true}));
  await tryCall('admob.prepareRewarded(test unit)',()=>P('AdMob').prepareRewardVideoAd({adId:IBD.Ads.ids.rewarded}));
  // scenes to photograph before anything is finished (the first finished chart puts up the tracking prompt)
  await shot('title');
  IBD.pause();IBD.still();
  $('bCoast').click();IBD.step(.5);await shot('first-card');
  $('cardN').click();IBD.step(3.4);await shot('second-card');
  $('cardN').click();IBD.step(1.5);await shot('guided-dusk');
  IBD.castOff();IBD.step(.3);await shot('night-card');
  $('cardN').click();IBD.step(6);await shot('night');
  IBD.step(120);IBD.step(8);await shot('dawn-card');clear();IBD.step(.3);await shot('dawn');
  $('bLeave').click();IBD.step(.2);await shot('coast');
  IBD.openWheel();IBD.step(.2);if(IBD.Cards.open){await shot('supplies-card');clear();}await shot('wheel');$('wClose').click();
  // now the whole walk, on a save made fresh again
  localStorage.removeItem('ibd_save');const M=IBD.META;M.nights=0;M.bays=0;M.nightsHome=0;M.daily={};M.cards={off:false,seen:{}};M.inv={ink:0,light:0,tide:0};for(const k of Object.keys(M))if(/^coast/.test(k))M[k]={bays:[]};
  $('bBack').click();IBD.step(.2);
  let res;try{res=WALK.run();}catch(e){res={error:String(e&&e.stack||e).slice(0,400)};}
  say('walk',res&&res.error?res:{viewport:res.viewport,cardsShown:res.cardsShown,distinct:res.distinct,neverShown:res.neverShown,problems:res.problems,smallestButton:res.smallestButton,pictures:res.pictures,panels:[...new Set(WALK.out.map(o=>o.panel))],notes:res.notes});
  await shot('after-walk');
  await wait(2500);const copy=await tryCall('vault.saveCopy.after',()=>P('Vault').get({key:'ibd_save'}).then(r=>({has:!!(r&&r.value),bytes:r&&r.value?r.value.length:0,nights:r&&r.value?JSON.parse(r.value).nights:null})));
  say('DONE',{vaultHasSave:!!(copy&&copy.has)});
}
window.addEventListener('error',e=>say('jserror',String(e.message)+' @'+e.lineno));
run().catch(e=>say('crash',String(e&&e.stack||e).slice(0,500)));
})();

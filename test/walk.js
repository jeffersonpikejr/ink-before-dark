// Plays a FRESH save from the first night through every first encounter and reports how each card sat on the screen.
// Browser only (it drives the real page through the IBD debug API). Clear the save and reload first, then in the console:
//   await import('./test/walk.js'); WALK.run()
// It leaves developer mode on and a test save behind: clear `ibd_save` and `ibd_dev` afterwards.
(function(){
const $=id=>document.getElementById(id),out=[],notes={};
function rec(where){if(!IBD.Cards.open)return;const P=$('cardP').getBoundingClientRect(),L=$('cardL'),T=$('cardT'),C=$('cardC').getBoundingClientRect(),N=$('cardN').getBoundingClientRect(),F=$('cardF').getBoundingClientRect();
  out.push({where,id:IBD.card(),of:IBD.Cards.deck.length,fits:P.top>=-.5&&P.left>=-.5&&P.bottom<=innerHeight+.5&&P.right<=innerWidth+.5&&F.bottom<=P.bottom+.5,
    clipped:L.scrollHeight>L.clientHeight+1||T.scrollWidth>T.clientWidth+1,picture:Math.round(C.width)+'x'+Math.round(C.height),button:Math.round(N.width)+'x'+Math.round(N.height),panel:Math.round(P.width)+'x'+Math.round(P.height)});}
function through(where){let g=0;while(IBD.Cards.open&&g++<9){IBD.step(1.5);rec(where);$('cardN').click();}}
function night(where){IBD.castOff();IBD.step(.2);through(where+', cast-off');IBD.step(120);IBD.step(8);through(where+', dawn');const r=IBD.S.results[IBD.S.results.length-1];return r?(r.made?'home':'late')+' '+r.strikes+' strikes':'?';}
const nextDusk=()=>{const b=document.querySelector('#btns button');if(b)b.click();IBD.step(.5);};
const toTitle=()=>{if(!$('bLeave').classList.contains('hide'))$('bLeave').click();if($('coast').style.display!=='none')$('bBack').click();IBD.step(.1);};
function run(){out.length=0;
  if(IBD.META.nights||Object.keys(IBD.META.cards.seen).length)return{error:'not a fresh save: clear ibd_save and reload first'};
  IBD.pause();IBD.still();
  // 1. the first bay, reached the way a newcomer reaches it
  $('bCoast').click();notes.straightIn=IBD.S.phase==='dusk';if(!notes.straightIn)document.querySelector('#bays .node').dispatchEvent(new MouseEvent('click',{bubbles:true}));IBD.step(.5);through('first dusk');
  notes.guided=!!IBD.S.guide;notes.hint=$('hint').textContent;let followed=0;
  while(IBD.S.guideHit&&followed<14){const h=IBD.S.guideHit;if(h.rock){const q=h.rock,px=-Math.sin(h.hdg),py=Math.cos(h.hdg),l=q.rmax+8;IBD.pen([[q.x-px*l,q.y-py*l],[q.x,q.y],[q.x+px*l,q.y+py*l]]);}else IBD.pen([[h.x,h.y],[h.x+3,h.y+3]]);followed++;IBD.step(.2);}
  notes.hintsFollowed=followed;notes.courseClean=!IBD.S.guideHit;notes.cleanCaption=$('cap').innerText.replace(/\n/g,' / ');notes.night1=night('first night');
  nextDusk();through('second dusk');notes.guideGone=!IBD.S.guide;notes.night2=night('second night, nothing drawn');
  nextDusk();through('third dusk');notes.night3=night('third night, nothing drawn');through('first bay finished');
  // 2. the first chart of every other coast (developer mode opens them), and the river's later nights
  IBD.setDev(true);
  for(let co=1;co<10;co++){IBD.bay(co,0);IBD.step(.5);through('coast '+(co+1)+', first dusk');
    if(co===2)for(let ni=1;ni<3;ni++){night('coast 3 night '+ni);nextDusk();through('coast 3, dusk '+(ni+1));}}
  // 3. supplies in the locker at dusk
  IBD.META.inv.ink=1;IBD.bay(0,1);IBD.step(.5);through('a supply in the locker');
  // 4. a perfect chart, for the marks
  IBD.bay(0,2);IBD.step(.5);through('perfect bay, first dusk');
  for(let ni=0;ni<3;ni++){IBD.botOmni(IBD.S.bay,IBD.S.chart,IBD.S.ni);night('perfect night '+(ni+1));if(ni<2)nextDusk();}
  through('perfect bay finished');notes.marks=(IBD.S.marks||[]).join(', ');
  // 5. tonight's bay, for the log
  toTitle();$('bDaily').click();IBD.step(.5);through("tonight's bay, first dusk");for(let ni=0;ni<3;ni++){night("tonight's bay night "+(ni+1));if(ni<2)nextDusk();}through("tonight's bay finished");
  // 6. the wheel, then cards off, then the replay
  toTitle();IBD.openWheel();IBD.step(.2);through('the wheel');$('wClose').click();
  $('bCards').click();notes.offLabel=$('bCards').textContent;$('bCoast').click();document.querySelectorAll('#bays .node')[3].dispatchEvent(new MouseEvent('click',{bubbles:true}));IBD.step(.5);notes.cardWhileOff=IBD.card();notes.guideWhileOff=!!IBD.S.guide;
  toTitle();$('bReplay').click();IBD.step(.2);notes.replayDeck=IBD.Cards.deck.join(',');notes.onLabel=$('bCards').textContent;through('replay');
  const seen=[...new Set(out.map(r=>r.id))],all=IBD.CARD_IDS;
  return{viewport:innerWidth+'x'+innerHeight,cardsShown:out.length,distinct:seen.length,neverShown:all.filter(id=>!seen.includes(id)),problems:out.filter(r=>!r.fits||r.clipped),smallestButton:out.reduce((m,r)=>Math.min(m,+r.button.split('x')[1]),99),
    pictures:[...new Set(out.map(r=>r.picture))],notes,order:out.map(r=>r.id).join(' ')};}
window.WALK={run,out,notes};
})();

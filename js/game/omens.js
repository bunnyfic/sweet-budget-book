'use strict';
/* game/omens.js — omens, ranks, sanity, toasts */
/* ---------- creepy gamification ---------- */
var OMENS=[
 {id:'first',n:'first offering',d:'write down your first expense.',xp:20,f:function(c){return c.ex>=1}},
 {id:'fed',n:'it is fed',d:'log five expenses.',xp:30,f:function(c){return c.ex>=5}},
 {id:'warm',n:'the ledger is warm',d:'log your first income.',xp:20,f:function(c){return c.incN>=1}},
 {id:'want',n:'something wants',d:'add two things to your wishlist.',xp:20,f:function(c){return c.wish>=2}},
 {id:'promise',n:'a promise in blood',d:'set a savings goal.',xp:25,f:function(c){return c.goals>=1}},
 {id:'name',n:'it knows your name',d:'write your name on the profile.',xp:15,f:function(c){return c.named}},
 {id:'own',n:'your own corner',d:'make a category of your own.',xp:20,f:function(c){return c.cats>=1}},
 {id:'quiet',n:'the quiet month',d:'spend under half of what came in.',xp:40,f:function(c){return c.inc>0&&c.spent<c.inc/2&&c.ex>=1}},
 {id:'over',n:'it overflowed',d:'go past a category limit. it will not mind.',xp:10,f:function(c){return c.over}}
];
var RANKS=['the unwatched','the noticed','the marked','the followed','the hollow','the haunted','the vessel','the cursed','the ancient one'];
function gameCtx(){
  var c={ex:0,incN:0,inc:0,wish:0,goals:0,cats:0,named:!!(S.profile&&S.profile.name),spent:0,over:false};
  Object.keys(S.months).forEach(function(k){var m=S.months[k];
    (m.expenses||[]).forEach(function(e){if(!e.ex)c.ex++});(m.income||[]).forEach(function(e){if(!e.ex)c.incN++})});
  c.wish=S.wish.filter(function(w){return !w.ex}).length;
  c.goals=S.goals.filter(function(g){return !g.ex}).length;
  c.cats=S.cats.filter(function(x){return /^c/.test(x.k)&&x.k.length>3}).length;
  var t=tot();c.inc=t.inc;c.spent=t.spent;
  S.cats.forEach(function(x){if(x.limit>0&&t.by[x.k]>x.limit)c.over=true});
  return c;
}
function gameState(){
  var c=gameCtx(),ach=S.game.ach,xp=c.ex*10+c.incN*15+c.wish*5+c.goals*10;
  OMENS.forEach(function(o){if(ach[o.id])xp+=o.xp});
  var lvl=0;while(lvl<RANKS.length-1&&xp>=(lvl+1)*(lvl+1)*25)lvl++;
  var lo=lvl*lvl*25,hi=(lvl+1)*(lvl+1)*25;
  var t=tot(),san=t.inc>0?Math.max(0,Math.min(100,Math.round(100*t.left/t.inc))):100;
  return {xp:xp,lvl:lvl,pct:lvl>=RANKS.length-1?100:Math.round(100*(xp-lo)/(hi-lo)),san:san,ctx:c};
}
var gameReady=false,toastT=0;
function omenToast(a,b){
  var el=document.getElementById('omenToast');if(!el)return;
  el.replaceChildren(h('small',null,a),h('b',null,b));el.classList.add('on');
  clearTimeout(toastT);toastT=setTimeout(function(){el.classList.remove('on')},5200);
}
function checkOmens(){
  var g=gameState(),fresh=[];
  OMENS.forEach(function(o){if(!S.game.ach[o.id]&&o.f(g.ctx)){S.game.ach[o.id]=Date.now();fresh.push(o)}});
  if(fresh.length){g=gameState();save()}
  if(gameReady){
    if(fresh.length)omenToast('an omen has appeared',fresh[fresh.length-1].n);
    if(g.lvl>S.game.lvl)omenToast('you are '+RANKS[g.lvl],'it has noticed you.');
  }
  if(g.lvl!==S.game.lvl){S.game.lvl=g.lvl;save()}
  checkAmulets(gameReady,fresh.length>0);
  gameReady=true;
  document.body.setAttribute('data-sanity',g.san<35?'low':g.san<70?'mid':'high');
  return g;
}
function gameFoot(){
  var g=gameState(),word=g.san>=70?'lucid':g.san>=35?'uneasy':g.san>0?'unraveling':'gone';
  var bar=function(p,cls){var i=h('i');i.style.width=p+'%';return h('span',{class:'gbar '+cls},i)};
  return h('div',{class:'gfoot'},
    h('small',null,'sanity · '+word+' '+g.san+'%'),bar(g.san,'san'),
    h('small',null,'rank '+(g.lvl+1)+' · '+RANKS[g.lvl]),bar(g.pct,'xp'),
    h('small',{class:'xpn'},g.xp+' xp'));
}
function renderOmens(){
  var box=document.getElementById('omens');if(!box)return;
  var got=OMENS.filter(function(o){return S.game.ach[o.id]}).length;
  box.replaceChildren(h('span',{class:'bar'},'omens · '+got+' of '+OMENS.length),
    h('div',{class:'omgrid'},OMENS.map(function(o){
      var on=!!S.game.ach[o.id];
      return h('div',{class:'om'+(on?' on':'')},h('b',null,on?o.n:'? ? ?'),h('small',null,on?'+'+o.xp+' xp':o.d))})));
}

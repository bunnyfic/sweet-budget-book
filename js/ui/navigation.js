'use strict';
/* ui/navigation.js — sidebar nav, routing (go / hashchange) */
function buildNav(){
  var box=$('#snav');box.replaceChildren();
  NAVLIST.forEach(function(d){
    var info=PAGES[d.k],small=h('small'),pimg=null,
      ti=h('span',{class:'ti'});if(NAVSVG[d.k])ti.innerHTML=NAVSVG[d.k];
    if(d.k==='profile'){pimg=h('img',{alt:'',src:avatarSrc()});ti.classList.add('round');ti.append(pimg)}
    else if(d.k==='overview')ti.innerHTML=HOME_SVG;
    else if(d.k==='dashboard')ti.innerHTML=DASH_SVG;
    var b=h('button',{type:'button',onclick:function(){go(d.k);closeSide()}},ti,h('span',{class:'lab'},h('b',null,info.t),d.sub?small:null));
    navEls[d.k]={b:b,small:small,sub:d.sub,pimg:pimg};box.append(b);
  });
}
function renderNav(){
  NAVLIST.forEach(function(d){
    var x=navEls[d.k];x.b.setAttribute('aria-current',tab===d.k?'page':'false');
    if(x.sub)x.small.textContent=x.sub();
    if(x.pimg){var s=avatarSrc();if(x.pimg.getAttribute('src')!==s)x.pimg.src=s;x.pimg.parentNode.classList.toggle('hasimg',s!==BLANK)}
  });
  var t=tot();
  $('#sfoot').replaceChildren(h('small',null,'left in '+monthLabel()),h('b',null,fmt(t.left)),h('small',null,daysLeft()+' days to go'),gameFoot());
}
function openSide(){$('#sidebar').classList.add('open');$('#scrim').hidden=false;$('#menuBtn').setAttribute('aria-expanded','true')}
function closeSide(){$('#sidebar').classList.remove('open');$('#scrim').hidden=true;$('#menuBtn').setAttribute('aria-expanded','false')}
$('#menuBtn').onclick=openSide;$('#scrim').onclick=closeSide;$('#closeSide').onclick=closeSide;
document.addEventListener('keydown',function(ev){if(ev.key==='Escape')closeSide()});

function tabFromHash(){var hv=(location.hash||'').replace(/^#/,'');for(var k in HASH)if(HASH[k]===hv)return k;return null}
function go(k){
  if(k===tab)return;
  if(k!=='expenses')selDay=null;
  tab=k;try{location.hash='#'+HASH[k]}catch(e){}
  renderAll();try{window.scrollTo(0,0)}catch(e){}
}
window.addEventListener('hashchange',function(){var k=tabFromHash();if(k&&k!==tab){tab=k;selDay=null;renderAll()}});

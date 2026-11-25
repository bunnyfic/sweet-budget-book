'use strict';
/* ui/render.js — title screen, renderPage, refresh, renderAll */
function titleScreen(){
  var items=[['dashboard','dashboard'],['expenses','expenses'],['income','income'],['wishlist','wishlist'],['checkup','check-up'],['calculator','calculator'],['profile','profile']],sel=0,btns=[];
  function mark(i,focus){sel=i;btns.forEach(function(b,j){b.classList.toggle('sel',j===i);b.tabIndex=j===i?0:-1});if(focus)btns[i].focus()}
  var menu=h('div',{class:'tmenu',role:'menu','aria-label':'menu'},items.map(function(it,i){
    var b=h('button',{type:'button',role:'menuitem',onclick:function(){go(it[0])},onmouseenter:function(){mark(i)},onfocus:function(){mark(i)},
      onkeydown:function(e){
        if(e.key==='ArrowDown'){e.preventDefault();mark((i+1)%items.length,true)}
        else if(e.key==='ArrowUp'){e.preventDefault();mark((i+items.length-1)%items.length,true)}
      }},it[1]);
    btns.push(b);return b}));
  mark(0);
  return h('section',{class:'title','aria-label':'menu'},
    h('img',{class:'tgirl',alt:'',src:IMG.girl2}),
    h('div',{class:'tright'},
      h('div',{class:'ttl'},(S.profile&&S.profile.name?S.profile.name+"'s ":'')+'budget book'),
      menu,
      h('img',{class:'tkid',alt:'',src:IMG.kid})));
}
function renderPage(){
  var pg=$('#page'),info=PAGES[tab]||PAGES.overview;
  P=null;
  var btxt=info.d;
  if(tab==='overview'&&S.profile.name)btxt='i see you, '+S.profile.name+'. '+info.d;
  pg.style.animation='none';void pg.offsetWidth;pg.style.animation='';
  pg.replaceChildren(h('div',{class:'banner'},h('p',null,btxt),h('div',{class:'whisper','aria-hidden':'true'},whisperLine())));
  if(tab!=='wishlist'){calcOpen=false;$('#calc').hidden=true}
  if(tab==='overview'){
    pg.append(titleScreen(),h('section',{class:'card omens',id:'omens','aria-label':'omens'}),
      h('div',{class:'ov'},h('aside',{class:'rail',id:'rail'}),
        h('div',{class:'side'},h('div',{class:'card cal',id:'cal'}),h('div',{class:'card',id:'todos'}))));
    renderTodos();syncFab();
  }else{
    var cols=[h('section',{class:'card panel',id:'panel','aria-live':'polite'})];
    if(tab==='expenses')cols.push(h('div',{class:'side'},h('div',{class:'card cal',id:'cal'})));
    pg.append(h('div',{class:'grid2'+(tab==='expenses'?' withcal':'')},cols));
    renderPanel();
  }
  refresh();
}
function refresh(){
  checkOmens();renderOmens();
  updateCards();
  if($('#rail'))renderRail();
  if($('#cal'))renderCal();
  renderCalc();renderNav();
  if(P&&P.update)P.update();
}
function renderAll(){
  $('#monthLabel').textContent=monthLabel();
  $('#cur').value=S.cur;
  $('#sampleBar').hidden=!S.ex;
  $('#pageTitle').textContent=(PAGES[tab]||PAGES.overview).t;$('#pageTitle').setAttribute('data-text',(PAGES[tab]||PAGES.overview).t);
  renderPage();
}

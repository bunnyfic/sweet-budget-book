'use strict';
/* ui/rail.js — overview rail: pace + where it went */
/* ---------- rail ---------- */
function daysLeft(){
  var p=view.split('-'),dim=new Date(+p[0],+p[1],0).getDate();
  if(view===CUR_YM)return dim-TODAY;
  return view<CUR_YM?0:dim;
}
function renderRail(){
  var t=tot(),pct=t.inc>0?Math.round(t.spent/t.inc*100):0,m=M();
  var p=view.split('-'),dim=new Date(+p[0],+p[1],0).getDate(),dl=daysLeft();
  var elapsed=view===CUR_YM?TODAY:(view<CUR_YM?dim:0);
  var avg=elapsed>0?t.spent/elapsed:0;
  var big=null;m.expenses.forEach(function(e){if(!big||e.amt>big.amt)big=e});
  var cats=S.cats.filter(function(c){return t.by[c.k]>0}).sort(function(a,b){return t.by[b.k]-t.by[a.k]});
  var mix=h('div');
  if(!cats.length)mix.append(h('p',{class:'mixnone'},'nothing spent yet this month.'));
  cats.forEach(function(c){
    var share=t.spent>0?t.by[c.k]/t.spent:0,r=h('div',{class:'mixrow'},
      h('div',{class:'l'},h('span',null,c.n),h('span',null,fmt(t.by[c.k])+' · '+Math.round(share*100)+'%')),
      h('div',{class:'b'},h('i',{style:'width:'+Math.round(share*100)+'%;--c:'+c.c})));
    mix.append(r);
  });
  function fact(a,b,s){return h('div',{class:'fact'+(s?' stack':'')},h('span',null,a),h('b',null,b))}
  function whole(n){return fmt(Math.round(n))}
  var facts=h('div',null,
    fact('daily average',elapsed>0?whole(avg):'-'),
    fact('safe to spend a day',dl>0&&t.left>0?whole(t.left/dl):'-'),
    fact('on pace to spend',view===CUR_YM&&elapsed>0?whole(avg*dim):(t.spent>0?fmt(t.spent):'-')),
    fact('biggest buy',big?big.name+' · '+fmt(big.amt):'-',true),
    fact('saving rate',t.inc>0?Math.round(Math.max(0,t.left)/t.inc*100)+'%':'-'));
  $('#rail').replaceChildren(
    h('div',{class:'tiles'},
      h('div',{class:'tile'},h('b',null,pad2(dl)),h('small',null,'days left')),
      h('div',{class:'tile'},h('b',null,pad2(pct)),h('small',null,'% spent'))),
    h('div',{class:'sumlist'},
      sumRow('income',fmt(t.inc)),sumRow('spent',fmt(t.spent)),
      sumRow('left',fmt(t.left),true),sumRow('savings jar',fmt(sum(S.goals,function(g){return num(g.saved)})))),
    h('div',{class:'card'},h('span',{class:'bar'},'where it went'),mix),
    h('div',{class:'card'},h('span',{class:'bar'},'pace'),facts));
}
function sumRow(a,b,big){return h('div',{class:'sumrow'+(big?' big':'')},h('span',null,a),h('b',null,b))}

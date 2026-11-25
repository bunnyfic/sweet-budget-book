'use strict';
/* ui/cards.js — database cards (tab tiles) */
/* ---------- database cards ---------- */
var DBS=[
  {k:'income',t:'income',img:'heart',sub:function(){return fmt(tot().inc)+' in'}},
  {k:'expenses',t:'expenses',img:'meat',sub:function(){return fmt(tot().spent)+' spent'}},
  {k:'wishlist',t:'wishlist',img:'bunny',sub:function(){return wishSel().length+' picked · '+fmt(wishTotal())}},
  {k:'checkup',t:'check-up',img:'bleed',sub:function(){return fmt(tot().left)+' left'}}
];
var cardEls={};
function buildCards(){
  var box=$('#dbs');box.replaceChildren();
  DBS.forEach(function(d){
    var sub=h('small',{class:'num'});
    var b=h('button',{type:'button',class:'dbcard',onclick:function(){go(d.k)}},
      h('span',{class:'art'},h('img',{alt:'',src:IMG[d.img]})),
      h('span',{class:'lbl'},h('b',null,d.t),sub));
    cardEls[d.k]={b:b,sub:sub};box.append(b);
  });
}
function updateCards(){
  if(!$('#dbs'))return;
  DBS.forEach(function(d){cardEls[d.k].sub.textContent=d.sub();cardEls[d.k].b.setAttribute('aria-pressed',tab===d.k?'true':'false')});
}

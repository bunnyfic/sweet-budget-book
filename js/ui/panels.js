'use strict';
/* ui/panels.js — shared row helpers + panel host (renderPanel) */
/* ---------- shared row helpers ---------- */
function bindText(input,obj,key,cb){input.oninput=function(){obj[key]=input.value;save();refresh();if(cb)cb()}}
function bindNum(input,obj,key){input.oninput=function(){obj[key]=num(input.value);save();refresh()}}
function numVal(n){return n?String(n):''}
function emptyState(msg){return h('div',{class:'empty'},h('span',null,msg))}
function delBtn(fn,label){return h('button',{type:'button',class:'del','aria-label':label,onclick:fn},'×')}
function clampDay(v){var p=view.split('-'),dim=new Date(+p[0],+p[1],0).getDate();var n=Math.round(num(v))||1;return Math.max(1,Math.min(dim,n))}
function defaultDay(){return view===CUR_YM?TODAY:1}

/* ---------- panels ---------- */
function renderPanel(){
  var box=$('#panel');box.replaceChildren();
  if(tab==='calculator'){calcOpen=false;$('#calc').hidden=true}
  P=({income:incomePanel,expenses:expensesPanel,wishlist:wishPanel,checkup:checkPanel,calculator:calcPanel,profile:profilePanel,dashboard:dashPanel})[tab]();
  box.append(P.el);
  if(P.update)P.update();
  syncFab();
}

'use strict';
/* core/state.js — app state, defaults, normalize/load, totals */
/* ---------- state ---------- */
var NOW=new Date(), TODAY=NOW.getDate(), CUR_YM=ymOf(NOW);
var view=CUR_YM, tab='overview', selDay=null, S=load()||defaults(), P=null;

function defaults(){
  var d=function(x){return Math.min(x,TODAY)};
  var st={v:1,cur:'₹',ex:true,months:{},game:{ach:{},lvl:0,amu:{}},
    profile:{name:'',age:'',bday:'',pron:'',city:'',bio:'',pic:'',preset:''},
    cats:DEFAULT_CATS.map(function(c,i){return {k:c.k,n:c.n,c:c.c,limit:[1500,800,1000,800,600,500][i]}}),
    goals:[{id:uid8(),name:'new laptop fund',target:40000,saved:6500,ex:true}],
    wish:[
      {id:uid8(),name:'pastel mechanical keyboard',price:3499,on:true,ex:true},
      {id:uid8(),name:'bunny plushie',price:899,on:true,ex:true},
      {id:uid8(),name:'sticker book',price:249,on:false,ex:true}],
    todos:[
      {id:uid8(),text:'top up phone recharge',done:false,ex:true},
      {id:uid8(),text:'move money to savings jar',done:false,ex:true},
      {id:uid8(),text:'check stationery sale',done:true,ex:true}]};
  st.months[CUR_YM]={
    income:[{id:uid8(),name:'monthly allowance',amt:6000,ex:true},{id:uid8(),name:'tutoring',amt:3500,ex:true}],
    expenses:[
      {id:uid8(),name:'metro card top-up',amt:400,cat:'transport',day:d(1),ex:true},
      {id:uid8(),name:'iced matcha with friends',amt:280,cat:'food',day:d(3),ex:true},
      {id:uid8(),name:'notebooks and pens',amt:650,cat:'study',day:d(6),ex:true},
      {id:uid8(),name:'music subscription',amt:119,cat:'bills',day:d(9),ex:true},
      {id:uid8(),name:'bubble tea',amt:220,cat:'food',day:d(12),ex:true}]};
  return st;
}
function normalize(s){
  var base=defaults();
  s=s&&typeof s==='object'?s:{};
  s.months=s.months||{};
  if(!Array.isArray(s.cats)||!s.cats.length){var lm=s.limits||{};s.cats=DEFAULT_CATS.map(function(c,i){return {k:c.k,n:c.n,c:c.c,limit:lm[c.k]!=null?lm[c.k]:base.cats[i].limit}})}
  if(!s.cats.some(function(c){return c.k==='other'}))s.cats.push({k:'other',n:'everything else',c:'#3d5a50',limit:0});
  delete s.limits;
  var OLDC={"#ffd9c7": "#7a1f27", "#d6e6ff": "#4a4a4a", "#e3dcff": "#5c2230", "#ffc9de": "#9b3b3b", "#fff0b8": "#8c8c8c", "#d9efe2": "#3d5a50", "#ffe0f0": "#a65a4a", "#d4f1f4": "#2f4a45", "#f6e2c8": "#6a5a3a", "#e8d5f5": "#4b3a5a", "#e8e0e4": "#555555"};
  s.cats.forEach(function(c){if(OLDC[c.c])c.c=OLDC[c.c]});
  if(!Array.isArray(s.goals)){s.goals=[];if(s.goal&&(s.goal.name||s.goal.target||s.goal.saved))s.goals.push({id:uid8(),name:s.goal.name||'',target:num(s.goal.target),saved:num(s.goal.saved),ex:!!s.goal.ex})}
  delete s.goal;
  s.wish=s.wish||[];
  s.profile=Object.assign({name:'',age:'',bday:'',pron:'',city:'',bio:'',pic:'',preset:''},s.profile&&typeof s.profile==='object'?s.profile:{});s.todos=s.todos||[];
  s.cur=s.cur||'₹';s.ex=!!s.ex;
  s.game=s.game&&typeof s.game==='object'?s.game:{};s.game.ach=s.game.ach&&typeof s.game.ach==='object'?s.game.ach:{};s.game.lvl=s.game.lvl||0;s.game.amu=s.game.amu&&typeof s.game.amu==='object'?s.game.amu:{};
  return s;
}
function load(){try{var r=localStorage.getItem(LS);return r?normalize(JSON.parse(r)):null}catch(e){return null}}
function M(){if(!S.months[view])S.months[view]={income:[],expenses:[]};return S.months[view]}
function tot(){
  var m=M(),inc=sum(m.income,function(x){return x.amt}),spent=sum(m.expenses,function(x){return x.amt});
  var by={};S.cats.forEach(function(c){by[c.k]=0});
  m.expenses.forEach(function(e){var ck=(e.cat in by)?e.cat:'other';by[ck]=(by[ck]||0)+e.amt});
  return {inc:inc,spent:spent,left:inc-spent,by:by};
}
function wishSel(){return S.wish.filter(function(w){return w.on})}
function wishTotal(){return sum(wishSel(),function(w){return w.price})}

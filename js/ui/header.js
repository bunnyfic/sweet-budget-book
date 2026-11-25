'use strict';
/* ui/header.js — month navigation, currency, sample rows */
/* ---------- header / month ---------- */
function monthLabel(){var p=view.split('-');return MONTHS[+p[1]-1]+' '+p[0]}
function shiftMonth(n){
  var p=view.split('-'),d=new Date(+p[0],+p[1]-1+n,1);
  view=ymOf(d);selDay=null;renderAll();
}
$('#prev').onclick=function(){shiftMonth(-1)};
$('#next').onclick=function(){shiftMonth(1)};
$('#cur').onchange=function(){S.cur=this.value;save();renderAll()};
$('#clearSamples').onclick=function(){
  Object.keys(S.months).forEach(function(k){
    var m=S.months[k];m.income=m.income.filter(function(x){return !x.ex});m.expenses=m.expenses.filter(function(x){return !x.ex});});
  S.wish=S.wish.filter(function(x){return !x.ex});S.todos=S.todos.filter(function(x){return !x.ex});
  S.goals=S.goals.filter(function(g){return !g.ex});
  S.ex=false;save();renderAll();
};

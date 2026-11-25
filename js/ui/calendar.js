'use strict';
/* ui/calendar.js — month calendar */
/* ---------- calendar ---------- */
function renderCal(){
  var p=view.split('-'),y=+p[0],m=+p[1];
  var first=new Date(y,m-1,1).getDay(),dim=new Date(y,m,0).getDate(),by={};
  M().expenses.forEach(function(e){by[e.day]=(by[e.day]||0)+e.amt});
  var days=h('div',{class:'days'});
  for(var i=0;i<first;i++)days.append(h('span',{class:'day blank'}));
  for(let d=1;d<=dim;d++){
    var cls='day'+(by[d]?' has':'')+(view===CUR_YM&&d===TODAY?' today':'')+(selDay===d?' pick':'');
    days.append(h('button',{type:'button',class:cls,title:by[d]?fmt(by[d])+' spent':'nothing spent','aria-label':'day '+d+(by[d]?', '+fmt(by[d])+' spent':''),
      onclick:function(){selDay=selDay===d?null:d;if(tab!=='expenses')go('expenses');else{renderPanel();refresh()}}},String(d)));
  }
  $('#cal').replaceChildren(
    h('span',{class:'bar'},'calendar'),
    h('div',{class:'head'},h('span',null,MONTHS[m-1]+' '+y)),
    h('div',{class:'dow'},DOW.map(function(x){return h('span',null,x)})),days,
    h('p',{class:'note'},'dots mark days you spent money. tap a day to see it.'));
}

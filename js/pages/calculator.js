'use strict';
/* pages/calculator.js — calculator page, recents + clear recents, keyboard */
var cexpr='',chist=[];
function calcPanel(){
  var ex=h('div',{class:'cp-ex'}),re=h('div',{class:'cp-re'}),msg=h('p',{class:'cp-msg','aria-live':'polite'});
  var histBox=h('div',{class:'cp-hist'});
  var name=h('input',{id:'cp-name',class:'in grow',placeholder:'what was it for? (optional)',autocomplete:'off','aria-label':'expense name'});
  var cat=h('select',{id:'cp-cat',class:'in','aria-label':'category'},S.cats.map(function(c){return h('option',{value:c.k},c.n)}));
  var addBtn=h('button',{type:'button',class:'btn'},'add to expenses');
  function value(){try{return evalExpr(cexpr)}catch(e){return null}}
  function show(){
    ex.textContent=cexpr||'0';
    var v=value(),isPlain=/^-?\d*\.?\d+$/.test(cexpr);
    re.textContent=v==null?(cexpr?'…':'0'):(isPlain?fmt(v):'= '+fmt(Math.round(v*100)/100));
  }
  function hist(){
    histBox.replaceChildren(h('div',{class:'cp-hh'},h('h3',null,'recent'),chist.length?h('button',{type:'button',class:'cp-clr',onclick:function(){chist=[];hist()}},'clear recents'):null));
    if(!chist.length)histBox.append(h('p',{class:'mixnone'},'results you calculate show up here. tap one to reuse it.'));
    chist.forEach(function(x){histBox.append(h('button',{type:'button',onclick:function(){cexpr=String(x.r);show()}},h('span',null,x.e),h('span',null,'= '+fmt(x.r))))});
  }
  function cp(k){
    if(hauntCalc(k,'.cp'))return;
    maybeScare();
    var ops='+−×÷',last=cexpr.slice(-1);
    if(k==='C')cexpr='';
    else if(k==='⌫')cexpr=cexpr.slice(0,-1);
    else if(k==='use total')cexpr=String(Math.round(wishTotal()*100)/100);
    else if(k==='='){var v=value();if(v!=null&&/[+−×÷]/.test(cexpr.replace(/^−/,''))){v=Math.round(v*100)/100;chist.unshift({e:cexpr,r:v});chist=chist.slice(0,8);cexpr=String(v);hist()}}
    else if(ops.indexOf(k)>-1){if(!cexpr&&k!=='−')return;if(ops.indexOf(last)>-1)cexpr=cexpr.slice(0,-1);cexpr+=k}
    else cexpr+=k;
    if(cexpr.length>28)cexpr=cexpr.slice(0,28);
    msg.textContent='';show();
  }
  cpress=cp;
  var keys=h('div',{class:'cp-keys'},KEYS.map(function(k){
    return h('button',{type:'button',class:k[1]||'','aria-label':k[0]==='⌫'?'backspace':k[0],onclick:function(){cp(k[0])}},k[0]);
  }));
  addBtn.onclick=function(){
    var v=value();v=v==null?0:Math.round(v*100)/100;
    if(!(v>0)){msg.style.color='var(--warn)';msg.textContent='work out an amount above zero first.';return}
    M().expenses.push({id:uid8(),name:name.value.trim()||'from calculator',amt:v,cat:cat.value,day:defaultDay()});
    save();refresh();name.value='';msg.style.color='var(--good)';msg.textContent='added '+fmt(v)+' to '+monthLabel()+' expenses.';
  };
  show();hist();
  return {el:h('div',null,h('span',{class:'bar'},'calculator'),
    h('div',{class:'cp'},h('div',{class:'cp-lcd',role:'status'},ex,re),keys,
      h('div',{class:'cp-save'},name,cat,addBtn),msg,histBox))};
}
var cpress=function(){};
document.addEventListener('keydown',function(ev){
  if(tab!=='calculator'||ev.ctrlKey||ev.metaKey||ev.altKey)return;
  var tg=ev.target&&ev.target.tagName;if(tg==='INPUT'||tg==='SELECT'||tg==='TEXTAREA')return;
  var k=ev.key,map={'+':'+','-':'−','*':'×','/':'÷','x':'×','Enter':'=','=':'=','Backspace':'⌫','Escape':'C','c':'C','C':'C'};
  if(/^[0-9.]$/.test(k))cpress(k);
  else if(map[k]){if(k==='Enter'&&tg==='BUTTON')return;ev.preventDefault();cpress(map[k])}
});

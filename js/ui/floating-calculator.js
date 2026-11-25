'use strict';
/* ui/floating-calculator.js — wishlist floating calculator */
/* ---------- calculator ---------- */
var expr='',calcOpen=false;
var KEYS=[['C','op'],['⌫','op'],['÷','op'],['×','op'],['7'],['8'],['9'],['−','op'],['4'],['5'],['6'],['+','op'],['1'],['2'],['3'],['=','eq'],['0'],['.'],['use total','wide']];
function buildKeys(){
  var box=$('#calcKeys');box.replaceChildren();
  KEYS.forEach(function(k){
    box.append(h('button',{type:'button',class:k[1]||'','aria-label':k[0]==='⌫'?'backspace':k[0],onclick:function(){press(k[0])}},k[0]));
  });
}
function evalExpr(s){
  var t=s.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').match(/\d*\.?\d+|[+\-*\/]/g)||[],i=0;
  function f(){if(t[i]==='-'){i++;return -f()}var v=parseFloat(t[i++]);if(!isFinite(v))throw 0;return v}
  function term(){var v=f();while(t[i]==='*'||t[i]==='/'){var o=t[i++],r=f();v=o==='*'?v*r:v/r}return v}
  function ex(){var v=term();while(t[i]==='+'||t[i]==='-'){var o=t[i++],r=term();v=o==='+'?v+r:v-r}return v}
  var r=ex();if(i<t.length||!isFinite(r))throw 0;return r;
}
function press(k){
  if(hauntCalc(k,'#calc'))return;
  var ops='+−×÷',last=expr.slice(-1);
  if(k==='C')expr='';
  else if(k==='⌫')expr=expr.slice(0,-1);
  else if(k==='use total')expr=String(Math.round(wishTotal()*100)/100);
  else if(k==='='){try{expr=String(Math.round(evalExpr(expr)*100)/100)}catch(e){expr='';$('#calcLcd').textContent='oops';return}}
  else if(ops.indexOf(k)>-1){if(!expr&&k!=='−')return;if(ops.indexOf(last)>-1)expr=expr.slice(0,-1);expr+=k}
  else expr+=k;
  if(expr.length>24)expr=expr.slice(0,24);
  $('#calcLcd').textContent=expr||'0';
}
function renderCalc(){
  var sel=wishSel(),tape=$('#calcTape'),total=wishTotal();
  tape.replaceChildren();
  if(!sel.length)tape.append(h('div',{class:'none'},'tick things on your wishlist to add them up.'));
  sel.forEach(function(w){tape.append(h('div',null,h('span',null,w.name),h('span',{class:'num'},fmt(w.price))))});
  $('#calcTotal').textContent=fmt(total);
  var left=tot().left-total,a=$('#calcAfford');
  a.className='afford';
  if(!sel.length||total<=0){a.textContent=''}
  else if(left>=0){a.textContent='fits this month: '+fmt(left)+' would be left.';a.classList.add('good')}
  else{a.textContent='short by '+fmt(-left)+' this month.';a.classList.add('warn')}
}
function openCalc(){
  calcOpen=true;$('#calc').hidden=false;syncFab();renderCalc();
}
function syncFab(){$('#calcFab').hidden=!(tab==='wishlist'&&!calcOpen)}
$('#calcClose').onclick=function(){calcOpen=false;$('#calc').hidden=true;syncFab()};
$('#calcMin').onclick=function(){var c=$('#calc');c.classList.toggle('min');this.textContent=c.classList.contains('min')?'+':'−';this.setAttribute('aria-label',c.classList.contains('min')?'expand calculator':'shrink calculator')};
$('#calcFab').onclick=function(){openCalc()};

'use strict';
/* pages/expenses.js — expenses page */
function expensesPanel(){
  var sumEl=h('p',{class:'sum num'}),filter=h('div',{class:'filter',hidden:true}),list=h('div',{class:'rows'});
  var fName=h('input',{id:'ex-name',class:'in grow',placeholder:'what did you buy?',autocomplete:'off','aria-label':'expense name'});
  var fCat=h('select',{id:'ex-cat',class:'in','aria-label':'category'},S.cats.map(function(c){return h('option',{value:c.k},c.n)}));
  var fDay=h('input',{id:'ex-day',class:'in dayin',inputmode:'numeric','aria-label':'day of month',value:String(defaultDay())});
  var fAmt=h('input',{id:'ex-amt',class:'in amt',inputmode:'decimal',placeholder:'0','aria-label':'amount'});
  var form=h('form',{class:'addrow'},fName,fCat,fDay,fAmt,h('button',{class:'btn',type:'submit'},'add'));
  var nc=h('input',{class:'in grow',maxlength:'30',placeholder:'name your own category',autocomplete:'off','aria-label':'new category name'});
  var ncGo=h('button',{type:'button',class:'btn'},'create');
  var ncBox=h('div',{class:'newcat',hidden:true},nc,ncGo);
  var ncOpen=h('button',{type:'button',class:'linkbtn',onclick:function(){ncBox.hidden=!ncBox.hidden;if(!ncBox.hidden)nc.focus()}},'+ add your own category');
  function makeCat(){
    var n=nc.value.trim();if(!n){nc.focus();return}
    var k='c'+uid8();
    S.cats.splice(Math.max(0,S.cats.length-1),0,{k:k,n:n,c:PALETTE[S.cats.length%PALETTE.length],limit:0});
    fCat.replaceChildren.apply(fCat,S.cats.map(function(c){return h('option',{value:c.k},c.n)}));
    fCat.value=k;nc.value='';ncBox.hidden=true;save();renderList();refresh();fName.focus();
  }
  ncGo.onclick=makeCat;nc.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();makeCat()}};
  form.onsubmit=function(ev){
    ev.preventDefault();var name=fName.value.trim(),amt=num(fAmt.value);
    if(!name&&!amt){fName.focus();return}
    M().expenses.push({id:uid8(),name:name||'untitled',amt:amt,cat:fCat.value,day:clampDay(fDay.value)});
    fName.value='';fAmt.value='';save();renderList();refresh();fName.focus();
  };
  function renderList(){
    var rows=M().expenses.slice().sort(function(a,b){return a.day-b.day});
    if(selDay)rows=rows.filter(function(e){return e.day===selDay});
    list.replaceChildren();
    if(!rows.length)list.append(emptyState(selDay?'nothing spent on day '+selDay+'.':'nothing yet. the page is hungry. add your first expense above.'));
    rows.forEach(function(e){
      var c=catBy(e.cat);
      var row=h('div',{class:'row rowx'});row.style.setProperty('--c',c.c);
      var nm=h('input',{class:'in grow',value:e.name,'aria-label':'name'});bindText(nm,e,'name');
      var ct=h('select',{class:'in','aria-label':'category'},S.cats.map(function(x){return h('option',{value:x.k},x.n)}));ct.value=e.cat;
      ct.onchange=function(){e.cat=ct.value;row.style.setProperty('--c',catBy(e.cat).c);save();refresh()};
      var dy=h('input',{class:'in dayin',inputmode:'numeric',value:String(e.day),'aria-label':'day'});
      dy.oninput=function(){var n=Math.round(num(dy.value));if(n>=1&&n<=31){e.day=n;save();refresh()}};
      var am=h('input',{class:'in amt',inputmode:'decimal',value:numVal(e.amt),placeholder:'0','aria-label':'amount'});bindNum(am,e,'amt');
      row.append(nm,ct,dy,am,delBtn(function(){var a=M().expenses;a.splice(a.indexOf(e),1);save();renderList();refresh()},'delete '+e.name));
      list.append(row);
    });
  }
  function update(){
    var t=tot();
    sumEl.textContent=fmt(t.spent)+' spent of '+fmt(t.inc)+' · '+fmt(t.left)+' left';
    filter.hidden=!selDay;filter.replaceChildren();
    if(selDay)filter.append('showing day '+selDay,h('button',{type:'button','aria-label':'show all days',onclick:function(){selDay=null;renderList();update();renderCal()}},'×'));
  }
  renderList();
  return {el:h('div',null,h('span',{class:'bar'},'expenses'),form,ncOpen,ncBox,sumEl,filter,list),update:update};
}

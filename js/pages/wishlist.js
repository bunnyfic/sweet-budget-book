'use strict';
/* pages/wishlist.js — wishlist page */
function wishPanel(){
  var sumEl=h('p',{class:'sum num'}),list=h('div',{class:'rows'});
  var fName=h('input',{id:'w-name',class:'in grow',placeholder:'something you want…',autocomplete:'off','aria-label':'wishlist item'});
  var fAmt=h('input',{id:'w-amt',class:'in amt',inputmode:'decimal',placeholder:'price','aria-label':'price'});
  var form=h('form',{class:'addrow'},fName,fAmt,h('button',{class:'btn',type:'submit'},'add'));
  form.onsubmit=function(ev){
    ev.preventDefault();var name=fName.value.trim(),price=num(fAmt.value);
    if(!name&&!price){fName.focus();return}
    S.wish.push({id:uid8(),name:name||'untitled',price:price,on:true});
    fName.value='';fAmt.value='';save();renderList();refresh();openCalc();fName.focus();
  };
  var pickAll=h('button',{type:'button',class:'btn soft'},'pick all');
  pickAll.onclick=function(){var all=S.wish.length&&S.wish.every(function(w){return w.on});S.wish.forEach(function(w){w.on=!all});save();renderList();refresh();openCalc()};
  var openBtn=h('button',{type:'button',class:'btn',onclick:function(){openCalc(true)}},'open calculator');
  function renderList(){
    list.replaceChildren();
    if(!S.wish.length)list.append(emptyState('your wishlist is empty. type something you want above and the calculator will rise.'));
    S.wish.forEach(function(w){
      var row=h('div',{class:'row'});
      var ck=h('input',{type:'checkbox',class:'chk',id:'wk-'+w.id,'aria-label':'add '+w.name+' to total'});ck.checked=!!w.on;
      ck.onchange=function(){w.on=ck.checked;save();refresh();openCalc()};
      var nm=h('input',{class:'in grow',value:w.name,'aria-label':'name'});bindText(nm,w,'name');
      var pr=h('input',{class:'in amt',inputmode:'decimal',value:numVal(w.price),placeholder:'price','aria-label':'price'});bindNum(pr,w,'price');
      row.append(ck,nm,pr,delBtn(function(){S.wish.splice(S.wish.indexOf(w),1);save();renderList();refresh()},'delete '+w.name));
      list.append(row);
    });
  }
  function update(){pickAll.textContent=S.wish.length&&S.wish.every(function(w){return w.on})?'clear picks':'pick all';
    sumEl.textContent=wishSel().length+' of '+S.wish.length+' picked · '+fmt(wishTotal())}
  renderList();
  return {el:h('div',null,h('span',{class:'bar'},'wishlist'),form,sumEl,list,h('div',{class:'foot'},pickAll,openBtn)),update:update};
}

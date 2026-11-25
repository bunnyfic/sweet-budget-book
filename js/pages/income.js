'use strict';
/* pages/income.js — income page */
function incomePanel(){
  var sumEl=h('p',{class:'sum num'}),list=h('div',{class:'rows'});
  var fName=h('input',{id:'in-name',class:'in grow',placeholder:'where did money come from?',autocomplete:'off','aria-label':'income name'});
  var fAmt=h('input',{id:'in-amt',class:'in amt',inputmode:'decimal',placeholder:'0','aria-label':'amount'});
  var form=h('form',{class:'addrow'},fName,fAmt,h('button',{class:'btn',type:'submit'},'add'));
  form.onsubmit=function(ev){
    ev.preventDefault();var name=fName.value.trim(),amt=num(fAmt.value);
    if(!name&&!amt){fName.focus();return}
    M().income.push({id:uid8(),name:name||'untitled',amt:amt});
    fName.value='';fAmt.value='';save();renderList();refresh();fName.focus();
  };
  function renderList(){
    list.replaceChildren();
    if(!M().income.length)list.append(emptyState('nothing came in yet. add allowance, pay, gifts…'));
    M().income.forEach(function(e){
      var row=h('div',{class:'row'});
      var nm=h('input',{class:'in grow',value:e.name,'aria-label':'name'});bindText(nm,e,'name');
      var am=h('input',{class:'in amt',inputmode:'decimal',value:numVal(e.amt),placeholder:'0','aria-label':'amount'});bindNum(am,e,'amt');
      row.append(nm,am,delBtn(function(){var a=M().income;a.splice(a.indexOf(e),1);save();renderList();refresh()},'delete '+e.name));
      list.append(row);
    });
  }
  function update(){sumEl.textContent=M().income.length+' sources · '+fmt(tot().inc)+' this month'}
  renderList();
  return {el:h('div',null,h('span',{class:'bar'},'income'),form,sumEl,list),update:update};
}

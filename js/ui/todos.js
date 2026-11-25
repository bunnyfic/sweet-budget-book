'use strict';
/* ui/todos.js — money to-dos */
/* ---------- to-dos ---------- */
function renderTodos(){
  var box=$('#todos');
  var inp=h('input',{id:'todo-new',class:'in',placeholder:'add a money to-do…',autocomplete:'off','aria-label':'new to-do'});
  var form=h('form',{class:'todoadd'},inp,h('button',{class:'btn soft',type:'submit'},'add'));
  form.onsubmit=function(ev){ev.preventDefault();var t=inp.value.trim();if(!t)return;S.todos.push({id:uid8(),text:t,done:false});save();renderTodos();$('#todo-new').focus()};
  var list=h('div');
  S.todos.forEach(function(t){
    var row=h('div',{class:'todo'+(t.done?' done':'')});
    var ck=h('input',{type:'checkbox',class:'chk',id:'td-'+t.id,'aria-label':'done'});ck.checked=t.done;
    ck.onchange=function(){t.done=ck.checked;row.classList.toggle('done',t.done);save()};
    var tx=h('input',{class:'t',value:t.text,'aria-label':'to-do text'});tx.oninput=function(){t.text=tx.value;save()};
    row.append(ck,tx,delBtn(function(){S.todos.splice(S.todos.indexOf(t),1);save();renderTodos()},'delete to-do'));
    list.append(row);
  });
  box.replaceChildren(h('span',{class:'bar'},'money to-dos'),form,list);
}

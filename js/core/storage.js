'use strict';
/* core/storage.js — saving to localStorage / sync */
/* ---------- saving ---------- */
var ref=null,timer=null,writing=false,again=false;
function setStatus(t){$('#status').textContent=t}
function save(){
  try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}
  setStatus('it is writing this down…');clearTimeout(timer);timer=setTimeout(flush,700);
}
function flush(){
  timer=null;
  if(!ref){setStatus('it remembers, on this device only.');return}
  if(writing){again=true;return}
  writing=true;
  ref.set({v:1,s:JSON.stringify(S)}).then(function(){setStatus('it has memorized this. only you can read it.')},
    function(){setStatus('it remembers, here. the private copy could not be reached.')}).then(function(){
    writing=false;if(again){again=false;flush()}});
}
function initStore(){
  if(!window.claude||!window.claude.use){setStatus('it remembers, on this device only.');return}
  Promise.all([window.claude.use('user'),window.claude.use('db')]).then(function(r){
    var user=r[0],db=r[1];
    if(!user||!db||!user.id){setStatus('it remembers, on this device only.');return}
    return user.id().then(function(id){
      if(!id){setStatus('it remembers, on this device only.');return}
      ref=db.doc('data/users/'+id+'/state');
      setStatus('it has memorized this. only you can read it.');
      ref.onSnapshot(function(snap){
        if(!snap.exists||snap.metadata.hasPendingWrites||timer||writing)return;
        try{
          var d=snap.data();var incoming=normalize(JSON.parse(d.s));
          if(JSON.stringify(incoming)===JSON.stringify(S))return;
          var a=document.activeElement;
          if(a&&a.tagName==='INPUT'&&$('#panel').contains(a))return;
          S=incoming;try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}
          renderAll();
        }catch(e){}
      },function(){setStatus('it remembers, on this device only.')});
    });
  }).catch(function(){setStatus('it remembers, on this device only.')});
}

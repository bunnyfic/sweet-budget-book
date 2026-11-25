'use strict';
/* effects/whispers-eyes.js — whispers + watching eyes */
/* ---------- haunting ---------- */
var WHISPERS=['you are not the first to open this.','it counted you twice.','the numbers moved while you were away.','someone is standing behind your balance.','every coin you spend is remembered by something.','do not look at the total for too long.','it knows what you wanted.','the ledger is warm.','it is learning your handwriting.','the month is shorter than it was.','you left a light on.','it saved your place.','something here is breathing.','the page was already open.'];
var wi=0;
function whisperLine(){
  var t=tot(),k=wi++%7;
  if(k===1&&S.profile&&S.profile.name)return S.profile.name+', it knows your name.';
  if(k===3)return 'you have spent '+fmt(t.spent)+'. it is not full yet.';
  if(k===5)return daysLeft()+' days remain. it is not counting down.';
  return WHISPERS[Math.floor(Math.random()*WHISPERS.length)];
}
function setWhisper(){
  var el=document.querySelector('.whisper');if(!el)return;
  el.style.opacity=0;setTimeout(function(){el.textContent=whisperLine();el.style.opacity=1},550);
}
setInterval(setWhisper,9000);

(function(){
  var box=document.getElementById('eyes');if(!box)return;
  var small=window.innerWidth<700,n=small?3:5,eyes=[];
  var EYE='<svg viewBox="0 0 80 40" aria-hidden="true"><path d="M2 20C16 3 64 3 78 20 64 37 16 37 2 20Z" fill="#0b0506" stroke="#7a1f27" stroke-width="1.6"/><g class="iris"><circle cx="40" cy="20" r="11.5" fill="#6b1a23"/><circle cx="40" cy="20" r="5.2" fill="#000"/><circle cx="36.5" cy="16.5" r="1.6" fill="#acacac" opacity=".7"/></g></svg>';
  var px=null,py=null;
  function place(e){
    var w=(small?58:70)+Math.random()*(small?34:70);
    e.el.style.width=w+'px';
    e.el.style.left=(Math.random()*90)+'%';e.el.style.top=(Math.random()*90)+'%';
    e.el.style.transform='rotate('+((Math.random()-.5)*60)+'deg)';
  }
  function cycle(e){
    place(e);
    setTimeout(function(){e.el.classList.add('on')},60);
    setTimeout(function(){e.el.classList.remove('on');setTimeout(function(){cycle(e)},2800)},6500+Math.random()*7500);
  }
  function look(){
    eyes.forEach(function(e){
      var r=e.el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
      var tx=px==null?cx+Math.cos(Date.now()/2600+cx)*240:px,ty=py==null?cy+Math.sin(Date.now()/3100+cy)*60:py;
      var a=Math.atan2(ty-cy,tx-cx),d=Math.min(11,Math.hypot(tx-cx,ty-cy)/18);
      e.iris.style.transform='translate('+(Math.cos(a)*d).toFixed(1)+'px,'+(Math.sin(a)*d*.55).toFixed(1)+'px)';
    });
  }
  for(var i=0;i<n;i++){
    var el=document.createElement('div');el.className='eye';el.innerHTML=EYE;box.appendChild(el);
    var e={el:el,iris:el.querySelector('.iris')};eyes.push(e);
    (function(e,i){setTimeout(function(){cycle(e)},700+i*1700)})(e,i);
  }
  var raf=0,root=document.documentElement;
  window.addEventListener('pointermove',function(ev){
    px=ev.clientX;py=ev.clientY;
    if(!raf)raf=requestAnimationFrame(function(){raf=0;root.style.setProperty('--mx',px+'px');root.style.setProperty('--my',py+'px');look()});
  },{passive:true});
  setInterval(look,1400);
})();

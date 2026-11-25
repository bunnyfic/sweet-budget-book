'use strict';
/* effects/haunted-calculator.js — claw gashes + shattering calculator keys */
/* ---------- haunted calculator ---------- */
var haunt={n:0,plan:[],broken:[],uid:0};
(function(){var n=2+Math.floor(Math.random()*3);haunt.plan.push(n);for(var i=0;i<3;i++){n+=3+Math.floor(Math.random()*4);haunt.plan.push(n)}})();
var HAUNT_LINES=['something scratched at the keys.','it did not want you to type that.','the keys broke under its claws.','it is in the calculator.','four long scratches. still wet.'];
var rnd=function(a,b){return a+Math.random()*(b-a)};
function hauntKey(root,k){
  var want=k==='⌫'?'backspace':k,bs=root.querySelectorAll('button');
  for(var i=0;i<bs.length;i++)if(bs[i].getAttribute('aria-label')===want)return bs[i];
  return null;
}
function hauntEl(html){var w=document.createElement('div');w.innerHTML=html;return w.firstChild}
/* tapered, ragged gash polygons along a curve, with a bright scuffed rim and blood in the groove */
function hauntClaws(root){
  var W=root.offsetWidth||320,H=root.offsetHeight||300,id=++haunt.uid,n=3+Math.floor(Math.random()*2);
  var sp=Math.max(13,Math.min(30,W*.075)),flip=Math.random()<.5,x0=W*rnd(.14,.34),bow=rnd(-.09,.09)*W;
  var defs='<defs><filter id="rg'+id+'" x="-15%" y="-5%" width="130%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".11" numOctaves="2" seed="'+Math.floor(rnd(1,90))+'" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="3.2"/></filter>';
  var body='',claws='';
  for(var i=0;i<n;i++){
    var sx=x0+i*sp+rnd(-2,2),sy=-H*.06+rnd(0,H*.14),ex=sx+W*rnd(.22,.32),ey=H*(1.02-rnd(0,.12));
    var cx=(sx+ex)/2+bow+rnd(-4,4),cy=(sy+ey)/2,wm=rnd(3.4,5.6),pts=[],K=30;
    for(var k=0;k<=K;k++){var t=k/K,u=1-t;
      pts.push({x:u*u*sx+2*u*t*cx+t*t*ex+rnd(-.7,.7),y:u*u*sy+2*u*t*cy+t*t*ey+rnd(-.7,.7),t:t})}
    var poly=function(f){var L=[],R=[];
      for(var k=0;k<=K;k++){var p=pts[k],q=pts[Math.min(K,k+1)],o=pts[Math.max(0,k-1)],dx=q.x-o.x,dy=q.y-o.y,m=Math.hypot(dx,dy)||1,nx=-dy/m,ny=dx/m;
        var w=wm*f*Math.pow(Math.sin(Math.PI*Math.pow(p.t,.62)),.9)*(.78+.44*Math.random())/2;
        L.push((p.x+nx*w).toFixed(1)+' '+(p.y+ny*w).toFixed(1));R.push((p.x-nx*w).toFixed(1)+' '+(p.y-ny*w).toFixed(1))}
      return 'M'+L.join('L')+'L'+R.reverse().join('L')+'Z'};
    var center='M'+pts.map(function(p){return p.x.toFixed(1)+' '+p.y.toFixed(1)}).join('L');
    defs+='<mask id="cm'+id+'_'+i+'" maskUnits="userSpaceOnUse" x="-20" y="-20" width="'+(W+40)+'" height="'+(H+40)+'"><path class="rv" pathLength="1" d="'+center+'" style="animation-delay:'+(i*.07).toFixed(2)+'s"/></mask>';
    var chips='';
    for(var c=0;c<6;c++){var p=pts[3+Math.floor(Math.random()*(K-8))],q=pts[Math.min(K,pts.indexOf(p)+1)],dx=q.x-p.x,dy=q.y-p.y,m=Math.hypot(dx,dy)||1,s2=Math.random()<.5?1:-1,off=wm*.55+rnd(1,4),len=rnd(3,8);
      chips+='<path d="M'+(p.x-dy/m*s2*off).toFixed(1)+' '+(p.y+dx/m*s2*off).toFixed(1)+'l'+(dx/m*len).toFixed(1)+' '+(dy/m*len).toFixed(1)+'" stroke="rgba(205,195,195,.55)" stroke-width=".8" fill="none"/>'}
    var seep='',drips=0;
    claws+='<g mask="url(#cm'+id+'_'+i+')"><path d="'+poly(2.2)+'" fill="rgba(210,200,200,.16)"/><path d="'+poly(1.15)+'" fill="#d6cccc" fill-opacity=".9"/><path d="'+poly(.62)+'" fill="#6f0912"/><path d="'+poly(.3)+'" fill="#2d0206"/>'+chips+'</g>';
    if(Math.random()<.75){var dp=pts[8+Math.floor(Math.random()*(K-16))],ln=rnd(12,34);
      seep+='<path class="dr" pathLength="1" d="M'+dp.x.toFixed(1)+' '+dp.y.toFixed(1)+'q'+rnd(-2,2).toFixed(1)+' '+(ln*.5).toFixed(1)+' '+rnd(-1.5,1.5).toFixed(1)+' '+ln.toFixed(1)+'"/><circle class="db" cx="'+(dp.x).toFixed(1)+'" cy="'+(dp.y+ln).toFixed(1)+'" r="'+rnd(1.3,2.1).toFixed(1)+'"/>'}
    body+=claws+seep;claws=''}
  var el=hauntEl('<svg class="claws" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" aria-hidden="true"'+(flip?' style="transform:scaleX(-1)"':'')+'>'+defs+'</defs><g filter="url(#rg'+id+')">'+body+'</g></svg>');
  root.appendChild(el);
  setTimeout(function(){el.classList.add('out')},2800);
  setTimeout(function(){el.remove()},3900);
}
/* spider-web crack radiating from an impact point */
function hauntCrack(){
  var cx=rnd(35,65),cy=rnd(30,70),rays=6+Math.floor(Math.random()*3),d='',ends=[];
  for(var i=0;i<rays;i++){
    var a=i*(Math.PI*2/rays)+rnd(-.3,.3),len=rnd(34,78),st=4+Math.floor(Math.random()*3),x=cx,y=cy,seg='M'+cx.toFixed(1)+' '+cy.toFixed(1);
    for(var k=1;k<=st;k++){a+=rnd(-.3,.3);var l=len/st*rnd(.7,1.2);x+=Math.cos(a)*l;y+=Math.sin(a)*l;seg+='L'+x.toFixed(1)+' '+y.toFixed(1);
      if(k===2&&Math.random()<.7){var b=a+rnd(.5,.9)*(Math.random()<.5?1:-1);seg+='M'+x.toFixed(1)+' '+y.toFixed(1)+'l'+(Math.cos(b)*len*.25).toFixed(1)+' '+(Math.sin(b)*len*.25).toFixed(1)+'M'+x.toFixed(1)+' '+y.toFixed(1)}
      if(k===2)ends.push([x,y])}
    d+=seg}
  var ring='';if(ends.length>3){ring='M'+ends.map(function(e){return (e[0]+rnd(-2,2)).toFixed(1)+' '+(e[1]+rnd(-2,2)).toFixed(1)}).slice(0,ends.length-1).join('L')}
  var path=d+ring;
  return '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="'+path+'" transform="translate(.8 .8)" fill="none" stroke="#000" stroke-opacity=".85" stroke-width="1.8" vector-effect="non-scaling-stroke" stroke-linejoin="round"/><path d="'+path+'" fill="none" stroke="#e2d8d8" stroke-opacity=".9" stroke-width=".8" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>';
}
/* jagged outline; bite>0 tears a chunk out of one corner */
function hauntOutline(bite){
  var P=[],i,v,cs=[[100,0],[100,100],[0,100],[0,0]],cor=cs[Math.floor(Math.random()*4)];
  for(i=0;i<10;i++)P.push([i*10,0]);for(i=0;i<10;i++)P.push([100,i*10]);for(i=0;i<10;i++)P.push([100-i*10,100]);for(i=0;i<10;i++)P.push([0,100-i*10]);
  return 'polygon('+P.map(function(p){
    var x=p[0],y=p[1];
    x+=(50-x)*rnd(0,.07);y+=(50-y)*rnd(0,.1);
    if(bite){var dx=x-cor[0],dy=y-cor[1],d=Math.hypot(dx,dy*.9),R=bite;
      if(d<R){var f=(R-d)/R;x+=(50-x)*(.55+rnd(-.1,.1))*Math.min(1,f*2.2);y+=(50-y)*(.55+rnd(-.1,.1))*Math.min(1,f*2.2)}}
    return x.toFixed(1)+'% '+y.toFixed(1)+'%'}).join(',')+')';
}
function hauntShards(btn,count){
  if(!btn.animate||(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches))return;
  var r=btn.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  for(var i=0;i<count;i++){
    var sz=rnd(7,17),el=document.createElement('div'),ang=rnd(-Math.PI*.9,-Math.PI*.1)+(Math.random()<.4?Math.PI:0);
    el.className='kshard';
    el.style.cssText='left:'+(cx+rnd(-r.width/3,r.width/3)-sz/2)+'px;top:'+(cy+rnd(-r.height/3,r.height/3)-sz/2)+'px;width:'+sz+'px;height:'+sz*rnd(.6,1)+'px;'+
      'background:linear-gradient(135deg,#7d6264 0,#3a1b1e 28%,#150809 100%);clip-path:polygon('+[0,1,2].map(function(){return rnd(0,100).toFixed(0)+'% '+rnd(0,100).toFixed(0)+'%'}).join(',')+','+(Math.random()<.5?'100% 100%':'0 100%')+')';
    document.body.appendChild(el);
    var dx=Math.cos(ang)*rnd(24,90),up=rnd(18,50),fall=rnd(110,230),rot=rnd(-420,420);
    el.animate([{transform:'translate(0,0) rotate(0)',opacity:1},
      {transform:'translate('+dx*.55+'px,'+(-up)+'px) rotate('+rot*.4+'deg)',opacity:1,offset:.28},
      {transform:'translate('+dx+'px,'+fall+'px) rotate('+rot+'deg)',opacity:0}],
      {duration:rnd(850,1400),easing:'cubic-bezier(.35,0,.75,1)',fill:'forwards'}).onfinish=(function(e){return function(){e.remove()}})(el);
  }
  for(i=0;i<6;i++){
    var d=document.createElement('div'),s3=rnd(1.5,3);d.className='kshard';
    d.style.cssText='left:'+(cx+rnd(-12,12))+'px;top:'+(cy+rnd(-8,8))+'px;width:'+s3+'px;height:'+s3+'px;border-radius:50%;background:#8a7a7a';
    document.body.appendChild(d);
    d.animate([{transform:'translate(0,0)',opacity:.9},{transform:'translate('+rnd(-40,40)+'px,'+rnd(20,90)+'px)',opacity:0}],{duration:rnd(500,900),easing:'ease-out',fill:'forwards'}).onfinish=(function(e){return function(){e.remove()}})(d);
  }
}
function hauntBreak(root,btn){
  var all=[].slice.call(root.querySelectorAll('.keys button,.cp-keys button')).filter(function(b){return b!==btn&&haunt.broken.indexOf(b)<0});
  var hit=[btn];
  for(var i=0;i<2&&all.length;i++)hit.push(all.splice(Math.floor(Math.random()*all.length),1)[0]);
  hit.forEach(function(b,idx){
    if(!b||haunt.broken.indexOf(b)>-1)return;
    var main=idx===0,cr=hauntEl('<span class="kcr">'+hauntCrack()+'</span>');
    b.classList.add('brk');
    b.style.clipPath=hauntOutline(main?rnd(48,62):(Math.random()<.5?rnd(24,34):0));
    b.style.setProperty('--r',(main?rnd(-9,9):rnd(-5,5)).toFixed(1)+'deg');
    b.style.setProperty('--dy',(main?rnd(4,7):rnd(2,4)).toFixed(1)+'px');
    b.appendChild(cr);
    hauntShards(b,main?rnd(5,7)|0:rnd(1,3)|0);
    haunt.broken.push(b);
    setTimeout(function(){
      b.classList.remove('brk','rattle');b.style.clipPath='';b.style.removeProperty('--r');b.style.removeProperty('--dy');cr.remove();
      var j=haunt.broken.indexOf(b);if(j>-1)haunt.broken.splice(j,1);
    },main?4200:3400);
  });
  var lcd=root.querySelector('.lcd,.cp-lcd');
  if(lcd){var lc=hauntEl('<span class="kcr lcdcr">'+hauntCrack()+'</span>');lcd.appendChild(lc);setTimeout(function(){lc.remove()},4600)}
}
function hauntCalc(k,sel){
  var root=document.querySelector(sel);
  if(!root||root.hidden||!root.offsetParent&&getComputedStyle(root).position!=='fixed')return false;
  var btn=hauntKey(root,k);
  if(btn&&btn.classList.contains('brk')){btn.classList.remove('rattle');void btn.offsetWidth;btn.classList.add('rattle');return true}
  haunt.n++;
  var last=haunt.plan[haunt.plan.length-1];
  if(!(haunt.plan.indexOf(haunt.n)>-1||(haunt.n>last&&Math.random()<.1)))return false;
  hauntClaws(root);
  if(btn)hauntBreak(root,btn);
  root.classList.remove('haunted','hflash');void root.offsetWidth;root.classList.add('haunted','hflash');
  setTimeout(function(){root.classList.remove('haunted','hflash')},950);
  try{navigator.vibrate&&navigator.vibrate([70,40,140])}catch(e){}
  try{omenToast('the calculator',HAUNT_LINES[Math.floor(Math.random()*HAUNT_LINES.length)])}catch(e){}
  return true;
}

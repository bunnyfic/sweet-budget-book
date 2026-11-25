'use strict';
/* pages/dashboard.js — dashboard charts + amulets */
/* ---------- dashboard + amulets ---------- */
var AMU_GLYPH={
 thread:'M4 19C9 19 7 8 12 8s3 11 8 11M12 3v3',
 ward:'M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6z',
 quiet:'M8 4h8M9 4c0 3-4 4-4 9a7 7 0 0 0 14 0c0-5-4-6-4-9',
 half:'M8 3h8M7 6h10v14H7zM7 13h10',
 vow:'M5 9a4 4 0 1 0 8 0a4 4 0 1 0-8 0M11.5 12l8 8M16 16.5l2.5-2.5M13.5 14.5l2-2',
 vigil:'M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9zM12 14v3',
 nights:'M19 14A8 8 0 1 1 10 5a6.5 6.5 0 0 0 9 9z',
 scale:'M12 4v16M6 20h12M3 7h18M3 7l-2 6a3 3 0 0 0 6 0zM21 7l-2 6a3 3 0 0 0 6 0z',
 coin:'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M8 12c2-3 6-3 8 0-2 3-6 3-8 0',
 tally:'M6 5v14M10 5v14M14 5v14M18 5v14M4 16L20 8'
};
var AMULETS=[
 {id:'thread',n:'the first thread',d:'log 10 expenses of your own.',f:function(c){return c.exN>=10}},
 {id:'tally',n:'the tally keeper',d:'log 30 expenses of your own.',f:function(c){return c.exN>=30}},
 {id:'nights',n:'seven nights awake',d:'log spending on 7 different days.',f:function(c){return c.dayN>=7}},
 {id:'vigil',n:'the long vigil',d:'log expenses in 3 different months.',f:function(c){return c.monN>=3}},
 {id:'quiet',n:'the quiet vessel',d:'keep 30% of a month\u2019s income.',f:function(c){return c.bestRate>=.3}},
 {id:'ward',n:'ward of bounds',d:'stay inside every category limit in a month with 5+ expenses.',f:function(c){return c.wardOk}},
 {id:'scale',n:'the steady scale',d:'two months in a row where income covered spending.',f:function(c){return c.balStreak>=2}},
 {id:'half',n:'the half-filled jar',d:'bring a savings goal to 50%.',f:function(c){return c.goalBest>=.5}},
 {id:'vow',n:'the sealed vow',d:'finish a savings goal.',f:function(c){return c.goalBest>=1}},
 {id:'coin',n:'the black coin',d:'hold 10,000 in your savings jar.',f:function(c){return c.jar>=10000}}
];
function monthStat(ym,real){
  var m=S.months[ym]||{income:[],expenses:[]},inc=0,sp=0,n=0,by={},days={};
  S.cats.forEach(function(c){by[c.k]=0});
  (m.income||[]).forEach(function(e){if(real&&e.ex)return;inc+=num(e.amt)});
  (m.expenses||[]).forEach(function(e){if(real&&e.ex)return;var a=num(e.amt);sp+=a;n++;var k=(e.cat in by)?e.cat:'other';by[k]=(by[k]||0)+a;days[e.day]=1});
  return {inc:inc,sp:sp,n:n,by:by,days:days};
}
function monthsBack(n,from){
  var p=(from||view).split('-'),out=[];
  for(var i=n-1;i>=0;i--)out.push(ymOf(new Date(+p[0],+p[1]-1-i,1)));
  return out;
}
function amuCtx(){
  var keys=Object.keys(S.months).sort(),c={exN:0,dayN:0,monN:0,bestRate:0,wardOk:false,balStreak:0,goalBest:0,jar:0},prev=null,run=0;
  keys.forEach(function(k){
    var m=monthStat(k,true);
    c.exN+=m.n;c.dayN+=Object.keys(m.days).length;if(m.n>0)c.monN++;
    if(m.inc>0&&m.n>0)c.bestRate=Math.max(c.bestRate,(m.inc-m.sp)/m.inc);
    if(m.n>=5&&S.cats.every(function(x){return !(x.limit>0)||m.by[x.k]<=x.limit}))c.wardOk=true;
    if(m.inc>0&&m.n>0&&m.inc>=m.sp){
      var pp=prev?prev.split('-'):null,adj=pp&&ymOf(new Date(+pp[0],+pp[1],1))===k;
      run=adj?run+1:1;prev=k;c.balStreak=Math.max(c.balStreak,run);
    }else{run=0;prev=null}
  });
  S.goals.forEach(function(g){if(g.ex)return;var t=num(g.target),sv=num(g.saved);c.jar+=sv;if(t>0)c.goalBest=Math.max(c.goalBest,sv/t)});
  return c;
}
function checkAmulets(announce,omenShown){
  var c=amuCtx(),fresh=[];
  AMULETS.forEach(function(a){if(!S.game.amu[a.id]&&a.f(c)){S.game.amu[a.id]=Date.now();fresh.push(a)}});
  if(!fresh.length)return;
  save();
  if(announce){var a=fresh[fresh.length-1],go=function(){omenToast('an amulet is gifted to you',a.n)};omenShown?setTimeout(go,5400):go()}
}
function amuSvg(a,on){
  var st=on?'#c8404c':'#4a4a4a',fl=on?'#2a0d12':'#111';
  return '<svg viewBox="0 0 48 56" aria-hidden="true"><path d="M10 0c2 14 8 18 14 18s12-4 14-18" fill="none" stroke="'+(on?'#7a1f27':'#333')+'" stroke-width="1.4"/>'
   +'<circle cx="24" cy="36" r="17" fill="'+fl+'" stroke="'+st+'" stroke-width="1.8"/><circle cx="24" cy="36" r="13.5" fill="none" stroke="'+st+'" stroke-width=".7" stroke-dasharray="2 2.4"/>'
   +(on?'<g transform="translate(12 24) scale(1)" fill="none" stroke="#e8c3c6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="'+AMU_GLYPH[a.id]+'"/></g>'
        :'<text x="24" y="42" text-anchor="middle" style="font-size:18px;fill:#555;font-family:var(--font-util)">?</text>')+'</svg>';
}
function svgBox(str){var d=document.createElement('div');d.innerHTML=str;return d.firstChild}
function shortFmt(n){n=Math.round(n);var a=Math.abs(n);return a>=100000?Math.round(n/1000)+'k':a>=10000?(n/1000).toFixed(0)+'k':a>=1000?(n/1000).toFixed(1).replace(/\.0$/,'')+'k':String(n)}
function chartBars(ms){
  var W=340,H=170,L=30,B=22,T=8,ch=H-B-T,mx=1;
  ms.forEach(function(m){mx=Math.max(mx,m.s.inc,m.s.sp)});
  var step=Math.pow(10,Math.floor(Math.log10(mx))),top=Math.ceil(mx/step)*step;if(top/step<2)top=step*2;
  var gw=(W-L)/ms.length,bw=Math.min(18,gw/2-4),o='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="income and spending by month">';
  [0,.5,1].forEach(function(f){var y=T+ch*(1-f);o+='<line x1="'+L+'" x2="'+W+'" y1="'+y+'" y2="'+y+'" stroke="#2d1519" stroke-width="1"/><text x="'+(L-4)+'" y="'+(y+3)+'" text-anchor="end">'+shortFmt(top*f)+'</text>'});
  ms.forEach(function(m,i){
    var cx=L+gw*i+gw/2,hi=ch*m.s.inc/top,hs=ch*m.s.sp/top;
    o+='<rect x="'+(cx-bw-1)+'" y="'+(T+ch-hi)+'" width="'+bw+'" height="'+Math.max(hi,0)+'" rx="2" fill="#6a6a6a"><title>'+m.label+' income '+fmt(m.s.inc)+'</title></rect>';
    o+='<rect x="'+(cx+1)+'" y="'+(T+ch-hs)+'" width="'+bw+'" height="'+Math.max(hs,0)+'" rx="2" fill="#b3232f"><title>'+m.label+' spent '+fmt(m.s.sp)+'</title></rect>';
    o+='<text x="'+cx+'" y="'+(H-6)+'" text-anchor="middle">'+m.label+'</text>';
  });
  return svgBox(o+'</svg>');
}
function chartRate(ms){
  var W=340,H=150,L=30,B=22,T=8,ch=H-B-T,gw=(W-L)/ms.length,pts=[],o='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="saving rate by month">';
  [0,50,100].forEach(function(v){var y=T+ch*(1-v/100);o+='<line x1="'+L+'" x2="'+W+'" y1="'+y+'" y2="'+y+'" stroke="#2d1519"/><text x="'+(L-4)+'" y="'+(y+3)+'" text-anchor="end">'+v+'%</text>'});
  ms.forEach(function(m,i){
    var cx=L+gw*i+gw/2;o+='<text x="'+cx+'" y="'+(H-6)+'" text-anchor="middle">'+m.label+'</text>';
    if(m.s.inc>0&&m.s.sp>0){var r=Math.max(0,Math.min(100,100*(m.s.inc-m.s.sp)/m.s.inc));pts.push([cx,T+ch*(1-r/100),Math.round((m.s.inc-m.s.sp)/m.s.inc*100),m.label])}
  });
  if(pts.length>1)o+='<polyline points="'+pts.map(function(p){return p[0]+','+p[1]}).join(' ')+'" fill="none" stroke="#c8404c" stroke-width="2" stroke-linejoin="round"/>';
  pts.forEach(function(p){o+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3.5" fill="#0e0708" stroke="#e04450" stroke-width="2"><title>'+p[3]+': '+p[2]+'%</title></circle>'});
  if(!pts.length)o+='<text x="'+(W/2)+'" y="'+(T+ch/2)+'" text-anchor="middle">add income and expenses to draw this</text>';
  return svgBox(o+'</svg>');
}
function chartDonut(cats,total){
  var R=44,C=2*Math.PI*R,off=0,o='<svg viewBox="0 0 120 120" role="img" aria-label="spending by category"><circle cx="60" cy="60" r="'+R+'" fill="none" stroke="#1a0b0e" stroke-width="16"/>';
  cats.forEach(function(c){var len=C*c.v/total;o+='<circle cx="60" cy="60" r="'+R+'" fill="none" stroke="'+c.c+'" stroke-width="16" stroke-dasharray="'+len.toFixed(2)+' '+(C-len).toFixed(2)+'" stroke-dashoffset="'+(-off).toFixed(2)+'" transform="rotate(-90 60 60)"><title>'+c.n+' '+fmt(c.v)+'</title></circle>';off+=len});
  o+='<text x="60" y="58" text-anchor="middle" style="font-size:9px">spent</text><text x="60" y="71" text-anchor="middle" style="font-size:11px;fill:#e8e8e8">'+shortFmt(total)+'</text>';
  return svgBox(o+'</svg>');
}
function dashPanel(){
  var el=h('div',{class:'dash'});
  function build(){
    var ms=monthsBack(6).map(function(k){var p=k.split('-');return {k:k,label:MONTHS[+p[1]-1].slice(0,3),s:monthStat(k,false)}});
    var cur=monthStat(view,false),t=cur.inc-cur.sp,rate=cur.inc>0?Math.round(100*t/cur.inc):null;
    var jar=sum(S.goals,function(g){return num(g.saved)}),got=Object.keys(S.game.amu).length,entries=0;
    Object.keys(S.months).forEach(function(k){var m=S.months[k];entries+=(m.expenses||[]).length+(m.income||[]).length});
    var tiles=h('div',{class:'dtiles'},
      h('div',{class:'dtile'},h('b',null,fmt(t)),h('small',null,'left in '+monthLabel())),
      h('div',{class:'dtile'},h('b',null,rate==null?'-':rate+'%'),h('small',null,'saving rate')),
      h('div',{class:'dtile'},h('b',null,fmt(jar)),h('small',null,'savings jar')),
      h('div',{class:'dtile'},h('b',null,got+' / '+AMULETS.length),h('small',null,'amulets gifted')));
    var cats=S.cats.map(function(c){return {n:c.n,c:c.c,v:cur.by[c.k]||0,limit:num(c.limit)}}).filter(function(c){return c.v>0}).sort(function(a,b){return b.v-a.v});
    var donut=h('div',{class:'donut'});
    if(cats.length){
      donut.append(chartDonut(cats,cur.sp),h('div',{class:'dl'},cats.map(function(c){
        var i=h('i');i.style.background=c.c;return h('div',null,h('span',null,i,c.n),h('span',null,Math.round(100*c.v/cur.sp)+'%'))})));
    }else donut.append(h('p',{class:'mixnone'},'nothing spent in '+monthLabel()+' yet.'));
    var lim=h('div'),withLim=S.cats.filter(function(c){return num(c.limit)>0});
    if(!withLim.length)lim.append(h('p',{class:'mixnone'},'set monthly limits in check-up to see them here.'));
    withLim.forEach(function(c){
      var v=cur.by[c.k]||0,L=num(c.limit),pct=Math.min(100,Math.round(100*v/L)),bar=h('i');bar.style.width=pct+'%';bar.style.setProperty('--c',c.c);
      lim.append(h('div',{class:'dbar'+(v>L?' over':'')},h('div',{class:'l'},h('span',null,c.n),h('span',null,fmt(v)+' / '+fmt(L))),h('div',{class:'b'},bar)));
    });
    var gl=h('div');
    if(!S.goals.length)gl.append(h('p',{class:'mixnone'},'no savings goals yet. add one in check-up.'));
    S.goals.forEach(function(g){
      var T=num(g.target),sv=num(g.saved),pct=T>0?Math.min(100,Math.round(100*sv/T)):0,bar=h('i');bar.style.width=pct+'%';bar.style.setProperty('--c','#c8404c');
      gl.append(h('div',{class:'dbar'},h('div',{class:'l'},h('span',null,g.name||'untitled goal'),h('span',null,pct+'% · '+fmt(sv)+' / '+fmt(T))),h('div',{class:'b'},bar)));
    });
    var leg=h('div',{class:'dleg'},h('span',null,h('i',{style:'background:#6a6a6a'}),'income'),h('span',null,h('i',{style:'background:#b3232f'}),'spent'));
    var amus=h('div',{class:'amus'},AMULETS.map(function(a){
      var on=!!S.game.amu[a.id],box=h('div',{class:'amu'+(on?' on':'')},h('b',null,on?a.n:'? ? ?'),h('small',null,on?'gifted '+new Date(S.game.amu[a.id]).toLocaleDateString():a.d));
      box.insertBefore(svgBox(amuSvg(a,on)),box.firstChild);return box}));
    el.replaceChildren(
      h('span',{class:'bar'},'dashboard · '+monthLabel()),
      tiles,
      h('div',{class:'dgrid'},
        h('div',{class:'dcard'},h('h3',null,'income vs spent'),h('p',{class:'dsub'},'the last six months.'),chartBars(ms),leg),
        h('div',{class:'dcard'},h('h3',null,'saving rate'),h('p',{class:'dsub'},'share of income you kept. dips below zero show as 0.'),chartRate(ms)),
        h('div',{class:'dcard'},h('h3',null,'where it went'),h('p',{class:'dsub'},monthLabel()+'.'),donut),
        h('div',{class:'dcard'},h('h3',null,'category limits'),h('p',{class:'dsub'},'spent against what you allowed.'),lim),
        h('div',{class:'dcard'},h('h3',null,'savings goals'),h('p',{class:'dsub'},'how full each jar is.'),gl)),
      h('div',{class:'dcard'},h('h3',null,'amulets · '+got+' of '+AMULETS.length),
        h('p',{class:'dsub'},'gifted for real progress. sample rows do not count. they stay once earned.'),amus));
  }
  build();
  return {el:el,update:build};
}

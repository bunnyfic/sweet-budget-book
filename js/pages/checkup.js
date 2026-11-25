'use strict';
/* pages/checkup.js — check-up page: limits + savings goals */
var PALETTE=['#7a1f27','#4a4a4a','#5c2230','#9b3b3b','#8c8c8c','#3d5a50','#a65a4a','#2f4a45','#6a5a3a','#4b3a5a'];
function checkPanel(){
  var msgT=h('b'),msgP=h('span');
  var nurse=h('div',{class:'nurse'},h('span',{class:'art'},h('img',{alt:'',src:IMG.nurse})),h('div',{class:'bubble'},msgT,msgP));
  var cbs={},gv={};

  /* categories */
  var catBox=h('div');
  S.cats.forEach(function(c){
    var name=h('input',{class:'in',value:c.n,'aria-label':'category name'});
    name.oninput=function(){c.n=name.value;save();refresh()};
    var sw=h('button',{type:'button',class:'swatch','aria-label':'change colour for '+c.n,title:'tap to change colour',style:'--c:'+c.c});
    sw.onclick=function(){var i=PALETTE.indexOf(c.c);c.c=PALETTE[(i+1)%PALETTE.length];sw.style.setProperty('--c',c.c);save();refresh()};
    var lim=h('input',{class:'in amt',inputmode:'decimal',value:numVal(c.limit),'aria-label':'limit for '+c.n,placeholder:'limit'});
    lim.oninput=function(){c.limit=num(lim.value);save();refresh()};
    var del=c.k==='other'?h('span'):delBtn(function(){
      Object.keys(S.months).forEach(function(k){S.months[k].expenses.forEach(function(e){if(e.cat===c.k)e.cat='other'})});
      S.cats.splice(S.cats.indexOf(c),1);save();renderPanel();refresh();
    },'delete '+c.n);
    var small=h('small',{class:'num'}),fill=h('i'),meter=h('div',{class:'meter'},fill);
    cbs[c.k]={small:small,fill:fill,meter:meter};
    catBox.append(h('div',{class:'cb2'},sw,name,lim,del,small,meter));
  });
  var cName=h('input',{id:'cat-new',class:'in grow',placeholder:'new category, like skincare…',autocomplete:'off','aria-label':'new category name'});
  var cLim=h('input',{id:'cat-limit',class:'in amt',inputmode:'decimal',placeholder:'limit','aria-label':'limit for new category'});
  var cForm=h('form',{class:'addrow'},cName,cLim,h('button',{class:'btn',type:'submit'},'add category'));
  cForm.onsubmit=function(ev){
    ev.preventDefault();var n=cName.value.trim();if(!n){cName.focus();return}
    S.cats.splice(Math.max(0,S.cats.length-1),0,{k:'c'+uid8(),n:n,c:PALETTE[S.cats.length%PALETTE.length],limit:num(cLim.value)});
    save();renderPanel();refresh();
  };

  /* savings goals */
  var goalsBox=h('div',{class:'goals'});
  if(!S.goals.length)goalsBox.append(h('p',{class:'mixnone'},'no savings goals yet. add one below.'));
  S.goals.forEach(function(g){
    function edited(){g.ex=false}
    var gName=h('input',{class:'in grow',value:g.name||'',placeholder:'what are you saving for?','aria-label':'savings goal name'});
    gName.oninput=function(){edited();g.name=gName.value;save();refresh()};
    var gT=h('input',{class:'in',inputmode:'decimal',value:numVal(g.target),placeholder:'0','aria-label':'goal amount'});
    gT.oninput=function(){edited();g.target=num(gT.value);save();refresh()};
    var gS=h('input',{class:'in',inputmode:'decimal',value:numVal(g.saved),placeholder:'0','aria-label':'saved so far'});
    gS.oninput=function(){edited();g.saved=num(gS.value);save();refresh()};
    var gAdd=h('input',{class:'in',inputmode:'decimal',placeholder:'amount','aria-label':'add to this goal'});
    var gBtn=h('button',{type:'button',class:'btn',onclick:function(){var n=num(gAdd.value);if(!n){gAdd.focus();return}edited();g.saved=num(g.saved)+n;gS.value=numVal(g.saved);gAdd.value='';save();refresh()}},'add');
    var gFill=h('i'),gInfo=h('small',{class:'num'});
    gv[g.id]={fill:gFill,info:gInfo};
    goalsBox.append(h('div',{class:'goal'},
      h('div',{class:'two'},gName,delBtn(function(){S.goals.splice(S.goals.indexOf(g),1);save();renderPanel();refresh()},'delete goal')),
      h('div',{class:'two'},h('label',null,'goal',gT),h('label',null,'saved so far',gS)),
      h('div',{class:'meter'},gFill),gInfo,
      h('div',{class:'two'},h('label',null,'drop some in',gAdd),h('span',{style:'align-self:flex-end'},gBtn))));
  });
  var addGoal=h('button',{type:'button',class:'btn soft',style:'margin-top:12px',onclick:function(){S.goals.push({id:uid8(),name:'',target:0,saved:0});save();renderPanel();refresh()}},'add a savings goal');

  function update(){
    var t=tot(),r=t.inc>0?t.spent/t.inc:0;
    if(t.inc<=0){msgT.textContent='the ledger is empty';msgP.textContent='tell it what you earn this month and it will begin to watch.'}
    else if(r<.6){msgT.textContent='still breathing';msgP.textContent='you have spent '+Math.round(r*100)+'% so far. it is quiet. for now.'}
    else if(r<.85){msgT.textContent='something is wrong';msgP.textContent=Math.round(r*100)+'% spent. the little treats are adding up.'}
    else if(r<=1){msgT.textContent='it is closer';msgP.textContent=Math.round(r*100)+'% spent. only '+fmt(t.left)+' left before the month ends.'}
    else{msgT.textContent='you overspent';msgP.textContent='you are '+fmt(-t.left)+' over this month. it is pleased.'}
    S.cats.forEach(function(c){
      var x=cbs[c.k];if(!x)return;
      var lim=num(c.limit),sp=t.by[c.k]||0,o=lim>0&&sp>lim;
      x.small.textContent=fmt(sp)+' spent'+(lim>0?' of '+fmt(lim):'')+(o?' · over':'');
      x.fill.style.width=(lim>0?Math.min(100,sp/lim*100):(sp>0?100:0))+'%';
      x.meter.classList.toggle('over',o);
    });
    S.goals.forEach(function(g){
      var x=gv[g.id];if(!x)return;
      var tg=num(g.target),sv=num(g.saved);
      x.fill.style.width=(tg>0?Math.min(100,sv/tg*100):0)+'%';
      x.info.textContent=tg>0?(sv>=tg?'goal reached!':fmt(tg-sv)+' to go ('+Math.round(sv/tg*100)+'%)'):'set a goal amount to see your progress.';
    });
  }
  return {el:h('div',null,h('span',{class:'bar'},'check-up'),nurse,
    h('h3',{style:'font-size:15px;margin-bottom:2px'},'monthly limits'),
    h('p',{class:'sum'},'rename, recolour, set a limit or delete any category. deleted ones move their spending to "everything else".'),
    catBox,cForm,
    h('h3',{style:'font-size:15px;margin:16px 0 8px'},'savings goals'),goalsBox,addGoal),update:update};
}

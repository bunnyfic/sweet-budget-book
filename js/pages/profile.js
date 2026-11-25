'use strict';
/* pages/profile.js — profile page + avatar */
var BLANK='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
function avatarSrc(){var p=S.profile;return p.pic||BLANK}
function profilePanel(){
  var p=S.profile;
  var big=h('img',{class:'pfbig',alt:'your profile photo',src:avatarSrc()});
  var msg=h('p',{class:'cp-msg','aria-live':'polite'});
  var file=h('input',{type:'file',accept:'image/*',id:'pf-file',hidden:true,'aria-label':'choose a profile photo'});
  function setMsg(m,bad){msg.style.color=bad?'var(--warn)':'var(--good)';msg.textContent=m}
  function shown(){big.src=avatarSrc();var bi=document.querySelector('.banner .tilei.round img');if(bi)bi.src=avatarSrc();refresh()}
  function toAvatar(f,cb){
    var r=new FileReader();
    r.onload=function(){var im=new Image();
      im.onload=function(){try{var s=Math.min(im.width,im.height),c=document.createElement('canvas');c.width=c.height=256;
        c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,256,256);cb(c.toDataURL('image/jpeg',.86))}catch(e){cb(null)}};
      im.onerror=function(){cb(null)};im.src=r.result};
    r.onerror=function(){cb(null)};r.readAsDataURL(f);
  }
  file.onchange=function(){
    var f=file.files&&file.files[0];if(!f)return;
    if(!/^image\//.test(f.type)){setMsg('please choose an image file.',true);return}
    if(f.size>15*1024*1024){setMsg('that photo is too big. try one under 15 MB.',true);return}
    toAvatar(f,function(d){if(!d){setMsg('could not read that photo. try another one.',true);return}
      p.pic=d;p.preset='';save();shown();setMsg('photo updated.')});
    file.value='';
  };
  var upBtn=h('button',{type:'button',class:'btn',onclick:function(){file.click()}},'upload photo');
  var rmBtn=h('button',{type:'button',class:'btn soft',onclick:function(){p.pic='';save();shown();setMsg('photo removed.')}},'remove photo');
  var hint=h('small',{class:'num'});
  function field(label,input,full){return h('label',{class:full?'full':''},label,input)}
  function bind(input,key,tweak){input.oninput=function(){var v=tweak?tweak(input.value):input.value;if(v!==input.value)input.value=v;p[key]=v;save();refresh();if(key==='bday')ageHint()}}
  function ageHint(){
    var d=p.bday?new Date(p.bday+'T00:00:00'):null;
    if(!d||isNaN(d)||d>new Date()){hint.textContent='';return}
    var a=NOW.getFullYear()-d.getFullYear();
    if(NOW.getMonth()<d.getMonth()||(NOW.getMonth()===d.getMonth()&&NOW.getDate()<d.getDate()))a--;
    hint.textContent=a>=0?'that makes you '+a+'.':'';
  }
  var name=h('input',{id:'pf-name',class:'in',maxlength:'40',autocomplete:'off',placeholder:'your name',value:p.name});bind(name,'name');
  var age=h('input',{id:'pf-age',class:'in',inputmode:'numeric',maxlength:'3',placeholder:'e.g. 17',value:p.age});
  bind(age,'age',function(v){return v.replace(/[^0-9]/g,'').slice(0,3)});
  var bday=h('input',{id:'pf-bday',class:'in',type:'date',value:p.bday});bind(bday,'bday');
  var pron=h('input',{id:'pf-pron',class:'in',maxlength:'24',placeholder:'she/her',value:p.pron});bind(pron,'pron');
  var city=h('input',{id:'pf-city',class:'in',maxlength:'40',placeholder:'where you live',value:p.city});bind(city,'city');
  var bio=h('textarea',{id:'pf-bio',class:'in',maxlength:'240',rows:'3',placeholder:'a few words about you, or what you are saving for'});bio.value=p.bio;bind(bio,'bio');
  ageHint();
  shown();
  return {el:h('div',null,h('span',{class:'bar'},'my profile'),
    h('div',{class:'pf'},
      h('div',{class:'pfpic'},big,h('div',{class:'two'},upBtn,rmBtn),file,
        msg),
      h('div',{class:'pffields'},
        field('name',name),field('age',age),field('birthday',bday),field('pronouns',pron),
        field('city',city),h('div',null,hint),field('about me',bio,true))))};
}

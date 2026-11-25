'use strict';
/* core/helpers.js — DOM + number helpers: $, h, num, sum, fmt … */
function $(s){return document.querySelector(s)}
function h(tag,props){
  var e=document.createElement(tag),k,v;
  for(k in (props||{})){v=props[k];
    if(k==='class')e.className=v;
    else if(k.indexOf('on')===0)e[k]=v;
    else if(v===true)e.setAttribute(k,'');
    else if(v!==false&&v!=null)e.setAttribute(k,v);}
  for(var i=2;i<arguments.length;i++){var c=arguments[i];
    if(Array.isArray(c)){c.forEach(function(x){if(x!=null&&x!==false)e.append(x.nodeType?x:document.createTextNode(x))});}
    else if(c!=null&&c!==false)e.append(c.nodeType?c:document.createTextNode(c));}
  return e;
}
function uid8(){return Math.random().toString(36).slice(2,9)}
function num(v){var n=parseFloat(String(v).replace(/[^0-9.]/g,''));return isFinite(n)?n:0}
function sum(a,f){return a.reduce(function(t,x){return t+f(x)},0)}
function pad2(n){return String(n).length<2?'0'+n:String(n)}
function ymOf(d){return d.getFullYear()+'-'+pad2(d.getMonth()+1)}
function fmt(n){
  var neg=n<0,a=Math.abs(n);
  var s=a.toLocaleString(S.cur==='₹'?'en-IN':'en-US',{maximumFractionDigits:2});
  return (neg?'-':'')+S.cur+s;
}

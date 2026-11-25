'use strict';
/* ui/nav-config.js — PAGES, HASH, NAVLIST, nav icons */
/* ---------- render ---------- */
var PAGES={
  overview:{t:'overview',img:null,d:'it is still counting. every coin is remembered.'},
  dashboard:{t:'dashboard',img:null,d:'your progress, drawn out. it keeps the good ones as amulets.'},
  expenses:{t:'expenses',img:'meat',d:'write down what you spent. it already knows. tap a day to see only that night.'},
  income:{t:'income',img:'heart',d:'what came in this month. feed the ledger.'},
  wishlist:{t:'wishlist',img:'bunny',d:'name what you want. it will tell you the price.'},
  checkup:{t:'check-up',img:'bleed',d:'the ledger examines you. set limits before it does.'},
  calculator:{t:'calculator',img:'scissors',d:'add it up. the numbers do not sleep. send the result to your expenses.'},
  profile:{t:'profile',img:null,d:'tell it who you are. it will remember.'}
};
var HASH={overview:'overview',dashboard:'dashboard',expenses:'expenses',income:'income',wishlist:'wishlist',checkup:'check-up',calculator:'calculator',profile:'profile'};
var NAVLIST=[
  {k:'overview',sub:function(){return fmt(tot().left)+' left'}},
  {k:'dashboard',sub:function(){var n=Object.keys(S.game.amu).length;return n+' of '+AMULETS.length+' amulets'}},
  {k:'expenses',sub:function(){return fmt(tot().spent)+' spent'}},
  {k:'income',sub:function(){return fmt(tot().inc)+' in'}},
  {k:'wishlist',sub:function(){return wishSel().length+' picked · '+fmt(wishTotal())}},
  {k:'checkup',sub:function(){return S.cats.length+(S.cats.length===1?' category':' categories')+' · '+S.goals.length+(S.goals.length===1?' goal':' goals')}},
  {k:'calculator',sub:null},
  {k:'profile',sub:function(){var p=S.profile;return p.name?(p.name+(num(p.age)?' · '+num(p.age):'')):'set up your profile'}}
];
var navEls={};
var DASH_SVG='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 20V11M10 20V5M16 20v-7M22 20H2"/></svg>';
var HOME_SVG='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/></svg>';
var NAVSVG={'expenses': '<svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#c8404c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3C16 3 6 14 6 20a10 10 0 0020 0C26 14 16 3 16 3z" fill="#5a141c"/><path d="M11 21a5 5 0 004 4" stroke="#acacac"/></svg>', 'income': '<svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#c8404c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="16" cy="16" r="12" fill="#1a0b0e"/><path d="M10 12l4 3M14 12l-4 3M18 12l4 3M22 12l-4 3" stroke="#acacac"/><path d="M9 22q7-5 14 0M11 21v3M14 22v3M17 22v3M20 21v3" stroke="#c8404c"/></svg>', 'wishlist': '<svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#c8404c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 8l9 22 9-22" stroke="none"/><path d="M8 5h16l-2 9-6 14-6-14z" fill="#1a0b0e"/><path d="M12 9v4M16 9v6M20 9v4" stroke="#acacac"/></svg>', 'checkup': '<svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#c8404c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 17h8l3-9 5 18 3-9h9" stroke="#c8404c"/><circle cx="16" cy="16" r="14" stroke="#5a141c" stroke-dasharray="2 3"/></svg>', 'calculator': '<svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#c8404c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4h14M9 28h14M10 4c0 8 12 8 12 12S10 20 10 28M22 4c0 8-12 8-12 12s12 4 12 12" fill="#1a0b0e"/><path d="M13 25h6" stroke="#acacac"/></svg>', 'profile': '<svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#c8404c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3c-6 0-9 4-9 9v6c0 3 2 5 4 6v3h10v-3c2-1 4-3 4-6v-6c0-5-3-9-9-9z" fill="#1a0b0e"/><circle cx="12" cy="14" r="2.6" fill="#c8404c" stroke="none"/><circle cx="20" cy="14" r="2.6" fill="#c8404c" stroke="none"/><path d="M13 24v2M16 24v2M19 24v2M15 19l1 1.5 1-1.5"/></svg>'};

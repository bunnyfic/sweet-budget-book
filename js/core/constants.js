'use strict';
/* core/constants.js — storage key, default categories, month/day names */
var LS='sweet-budget-book-v1';
var DEFAULT_CATS=[
  {k:'food',n:'food & treats',c:'#7a1f27'},{k:'transport',n:'getting around',c:'#4a4a4a'},
  {k:'study',n:'study stuff',c:'#5c2230'},{k:'fun',n:'fun & hobbies',c:'#9b3b3b'},
  {k:'bills',n:'bills & subs',c:'#8c8c8c'},{k:'other',n:'everything else',c:'#3d5a50'}
];
function catBy(k){for(var i=0;i<S.cats.length;i++)if(S.cats[i].k===k)return S.cats[i];return {k:'other',n:'everything else',c:'#555555'}}
var MONTHS=['january','february','march','april','may','june','july','august','september','october','november','december'];
var DOW=['s','m','t','w','t','f','s'];

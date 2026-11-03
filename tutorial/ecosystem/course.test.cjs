const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
test('course source matches each complete project and only size exercise changes Stage1',()=>{
 const R=require('./course-runtime.js'),C=require('../project-core.cjs');
 for(let stage=0;stage<7;stage++){
  const actual=R.lessonProject(stage,{tile:24,mode:'invert',strength:.6});
  assert.equal(actual.code,C.buildProject(stage,{tile:24,mode:'invert',strength:.6}).code);
  assert.equal(actual.code,actual.lines.map(l=>l[0]).join('\n'));new Function(actual.code);
 }
 const small=R.lessonProject(0,{},320);assert.match(small.code,/createCanvas\(320, 240\)/);assert.match(small.lines[3][1],/320/);
});
test('preview keeps normal relative exports and uses pinned local p5 with isolated teaching controls',()=>{
 const R=require('./course-runtime.js'),code=R.lessonProject(4).code;
 const html=R.frameHTML({code,stage:4,token:'safe-token'});
 assert.match(code,/60000/);assert.match(code,/loadImage\("sample.png"\)/);
 assert.match(html,/\/vendor\/p5.min.js/);assert.match(html,/loadImage\("\.\.\/assets\/sample.png"\)/);
 assert.match(html,/course-ready/);assert.match(html,/event.source !== parent/);assert.match(html,/safe-token/);
 assert.match(html,/course-seek/);assert.match(html,/course-play/);
});
test('new course assets have explicit routes; source and private helpers remain unavailable',()=>{
 const {allowed}=require('./server.cjs');assert.equal(typeof allowed,'function');
 for(const name of ['learn.html','learn.css','learn.js','course-core.js','course-runtime.js','course-data.json'])assert(allowed('/ecosystem/'+name),name);
 assert.equal(allowed('/ecosystem/course.test.cjs'),false);assert.equal(allowed('/project-core.cjs'),false);
});

test('preview assets stay within any Pages project prefix',()=>{ const R=require('./course-runtime.js'),html=R.frameHTML({code:R.lessonProject(0).code,stage:0,token:'prefix'});const image=html.match(/loadImage\("([^"]+)"\)/)[1],script=html.match(/<script src="([^"]+)"/)[1];for(const base of ['https://example.test/course/ecosystem/learn.html','https://example.test/a/b/ecosystem/learn.html']){const url=new URL(base),root=new URL('../',url);assert.equal(new URL(image,url).href,new URL('assets/sample.png',root).href);assert.equal(new URL(script,url).href,new URL('vendor/p5.min.js',root).href);}});

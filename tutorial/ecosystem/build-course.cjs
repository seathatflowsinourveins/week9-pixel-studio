const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const clean=require('../data/clean-lessons.cjs'),stages=require('../data/studio-stages.cjs'),guides=require('../data/guided-walkthroughs.cjs');
const lessons=['foundations','media','extensions'].flatMap(name=>require('../data/lessons-'+name+'.cjs'));
const focus=require('./pixel-flow-core.js').ACTION_TARGETS;
const roadmap=require('../data/learning-roadmap.cjs');
if(roadmap.length!==7||roadmap.some((entry,i)=>entry.number!==i+1||entry.learnFirst.some(id=>!lessons.some(lesson=>lesson.id===id))))throw Error('Every stage needs an ordered roadmap using known foundations.');
if(clean.length!==7||clean.some((s,i)=>s.actions.length!==guides[i].actions.length))throw Error('Course must preserve the seven stages and 47 existing action positions.');
const data={version:1,p5:'2.3.4',editor:'https://editor.p5js.org/',stageOne:'https://editor.p5js.org/739955940fc/sketches/HMn4vZWL4',html:fs.readFileSync(path.join(root,'editor-starter/index.html'),'utf8'),stages:clean.map((s,i)=>({...s,id:stages[i].id,foundations:stages[i].foundations.map(id=>({id,title:lessons.find(l=>l.id===id).title})),refs:stages[i].refs,practice:stages[i].practice,idea:stages[i].idea}))};
data.lineMeanings=require('../data/short-line-meanings.cjs');
if(clean.some((s,i)=>s.actions.length!==focus[i].length))throw Error('Action focus must preserve all 47 action positions.');
data.stages.forEach((s,i)=>s.actions.forEach((a,j)=>a.focusTarget=focus[i][j]));
data.stages.forEach((s,i)=>{s.roadmap={...roadmap[i],learnFirst:roadmap[i].learnFirst.map(id=>({id,title:lessons.find(lesson=>lesson.id===id).title}))};});
fs.writeFileSync(path.join(__dirname,'course-data.json'),JSON.stringify(data,null,2));
fs.copyFileSync(path.join(root,'project-core.cjs'),path.join(__dirname,'course-core.js'));
console.log('Built clean course: '+clean.length+' stages, '+clean.reduce((n,s)=>n+s.actions.length,0)+' small actions; source generator copied unchanged.');

require('./build-dashboard.cjs');

'use strict';
const fs=require('node:fs'),path=require('node:path');
const stages=require('../data/clean-lessons.cjs');
const lessons=['foundations','media','extensions'].flatMap(name=>require('../data/lessons-'+name+'.cjs'));
const descriptions=['Load a file. Draw it on a canvas.','Repeat squares. Read a color for each tile.','Find one pixel. Read red, green, blue and alpha.','Keep a focus area colorful. Change the rest.','Let the colors change over 60 seconds.','Restart the same work. Fit the screen.','Compare versions. Record what you see.'];
const checkpoints=['Image → canvas','Square → row → grid','Position → RGBA','Position test → color','Seconds → progress','Replay → resize','Test → observe → share'];
const data={version:1,
 stages:stages.map((stage,i)=>({number:i+1,id:'studio-'+i,title:stage.title,short:['One image','A mosaic','Four numbers','Color focus','One minute','Present','Refine'][i],description:descriptions[i],href:'./learn.html?view=editor#stage-'+(i+1),checkpoint:checkpoints[i]})),
 foundations:lessons.map((lesson,i)=>({id:lesson.id,title:lesson.title,group:i<10?'01 · Drawing and code':i<16?'02 · Pixels and this project':'03 · Optional media and debugging',href:'../Week-9-Project-Studio.html#'+lesson.id})),
 repos:[
 {name:'Code Hike / focus',role:'Design reference · no installed dependency',url:'https://codehike.org/docs/code/focus',detail:'Reference for connecting a learning step to the relevant code. This studio implements semantic line focus with native JavaScript.'},
 {name:'p5.Image pixels',role:'Primary pixel reference',url:'https://p5js.org/reference/p5.Image/pixels/',detail:'The source buffer stores four RGBA entries per pixel. Follow one pixel connects its location, addresses, values and drawn tile.'},
 {name:'processing / p5.js',role:'Used · local drawing library',url:'https://github.com/processing/p5.js',detail:'The lesson previews run p5.js 2.3.4, pinned in this kit. Learn image, get, pixels, loops and time.'},
 {name:'processing / p5.js-web-editor',role:'Used · official embedded editor',url:'https://github.com/processing/p5.js-web-editor',detail:'Practice beside the guide. Use Open p5 & save for account saving in a full browser tab. Keep your saved sketch link in Finish.'},
 {name:'radix-ui / primitives',role:'Design reference · no installed dependency',url:'https://github.com/radix-ui/primitives',detail:'Reference for clear component states and accessible dialog behavior. This dashboard uses the browser’s native dialog.'},
 {name:'p5 reference',role:'Primary learning reference',url:'https://p5js.org/reference/',detail:'Look up the exact drawing command when a word is new.'},
 {name:'HTML dialog standard',role:'Primary interface reference',url:'https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element',detail:'The dashboard opens above your lesson. Close or Escape returns to the same editor.'}],
 assignment:{url:'https://github.com/ITPNYU/ICM-2026-Media/wiki/Homework-Mimi-07#week-9',items:[
 'Work with your partner on a pixel-level image or video alternative reality.',
 'Make a silent piece that changes over one minute. Use color to guide attention.',
 'Make the result repeatable for two demonstrations. Seed randomness if you use it.',
 'Use windowWidth, windowHeight and relative sizing. Test the fullscreen p5 link.',
 'Together, record 2–3 observations from the color theory examples.',
 'Keep at least three algorithm iterations: what changed and what happened.',
 'Watch the complete minute at least three times. Write timestamped observations.',
 'Record iterations and observations in the class spreadsheet. Explain partner roles in your blog; include references and tested code / fullscreen / blog links.',
 'Complete the separate sound reading / viewing task. Keep this visual piece silent.']}};
fs.writeFileSync(path.join(__dirname,'dashboard-data.json'),JSON.stringify(data,null,2)+'\n');
console.log('Dashboard: '+data.stages.length+' stages, '+data.foundations.length+' foundations, '+data.repos.length+' reference sources.');

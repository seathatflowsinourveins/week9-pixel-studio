const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const modulePath = path.join(__dirname, 'loops-core.js');
const lesson = fs.existsSync(modulePath) ? require(modulePath) : {};
const row = [[40,40,80,80],[140,40,80,80],[240,40,80,80],[340,40,80,80],[440,40,80,80]];
const grid = [
  [40,40,80,80],[140,40,80,80],[240,40,80,80],[340,40,80,80],[440,40,80,80],
  [40,140,80,80],[140,140,80,80],[240,140,80,80],[340,140,80,80],[440,140,80,80],
  [40,240,80,80],[140,240,80,80],[240,240,80,80],[340,240,80,80],[440,240,80,80],
  [40,340,80,80],[140,340,80,80],[240,340,80,80],[340,340,80,80],[440,340,80,80]
];
async function execute(code) {
  const rects = [], calls = [];
  const context = vm.createContext({
    width:640, height:480,
    loadImage: async name => { calls.push(['loadImage',name]); return { get:(...args) => {calls.push(['get',...args]);return '#abc';} }; },
    createCanvas:(...a)=>calls.push(['createCanvas',...a]), pixelDensity:(...a)=>calls.push(['pixelDensity',...a]),
    background:(...a)=>calls.push(['background',...a]), image:(_picture,...a)=>calls.push(['image',...a]),
    noStroke:()=>{}, fill:(...a)=>calls.push(['fill',...a]), describe:()=>{},
    rect:(...a)=>rects.push(a)
  });
  await vm.runInContext(code+'\nsetup();', context, {timeout:1000});
  return {rects,calls};
}
test('exports complete, explained row and grid programs with the preserved image setup', async () => {
  assert.equal(typeof lesson.build, 'function');
  for (const [mode, expected] of [['row',row],['grid',grid]]) {
    const built = lesson.build(mode);
    assert.equal(built.code, built.lines.map(([source])=>source).join('\n'));
    assert.ok(built.lines.every(([source,meaning])=>typeof source==='string' && meaning.length>0));
    const actual = await execute(built.code);
    assert.deepEqual(actual.rects, expected);
    assert.deepEqual(actual.calls, [
      ['loadImage','sample.png'],['createCanvas',640,480],['pixelDensity',1],['background',18,24,32],
      ['image',50,30,640,480],['get',160,120],['fill','#abc']
    ]);
  }
  assert.equal(lesson.build().code, lesson.build('row').code);
});
test('awaits the image before creating or painting the canvas', async () => {
  const calls=[];
  let resolveImage;
  const imageReady=new Promise(resolve=>{resolveImage=resolve;});
  const context=vm.createContext({
    width:640, height:480, loadImage:()=>imageReady,
    createCanvas:()=>calls.push('canvas'), pixelDensity:()=>{}, background:()=>calls.push('background'),
    image:()=>calls.push('image'), noStroke:()=>{}, fill:()=>{}, rect:()=>{}, describe:()=>{}
  });
  const setup=vm.runInContext(lesson.build().code+'\nsetup();',context,{timeout:1000});
  assert.deepEqual(calls,[]);
  resolveImage({get:()=> '#abc'});
  await setup;
  assert.deepEqual(calls,['canvas','background','image']);
});
test('preview executes only the clamped prefix, including zero and invalid counts', async () => {
  assert.equal(typeof lesson.preview, 'function');
  for (const [mode,expected] of [['row',row],['grid',grid]]) {
    for (const [count,length] of [[0,0],[-10,0],[1,1],[3,3],[6,Math.min(6,expected.length)],[999,expected.length],[2.9,2],[undefined,0],[NaN,0],[Infinity,0],['3',0],[null,0]]) {
      assert.deepEqual((await execute(lesson.preview(mode,count))).rects, expected.slice(0,length), `${mode} count ${count}`);
    }
  }
});
test('row trace orders initialization, checks, draws, updates and its failed boundary', () => {
  assert.equal(typeof lesson.trace, 'function');
  const frames = lesson.trace('row');
  assert.equal(frames[0].phase,'start');
  assert.equal(frames[0].drawn,0);
  const flow = frames.filter(f=>['start','check','draw','update'].includes(f.phase));
  assert.deepEqual(flow.map(f=>[f.phase,f.x,f.drawn]), [
    ['start',40,0],['check',40,0],['draw',40,1],['update',140,1],
    ['check',140,1],['draw',140,2],['update',240,2],
    ['check',240,2],['draw',240,3],['update',340,3],
    ['check',340,3],['draw',340,4],['update',440,4],
    ['check',440,4],['draw',440,5],['update',540,5],['check',540,5]
  ]);
  assert.match(flow.at(-1).meaning,/false/i);
  assert.equal(frames.at(-1).drawn,5);
});
test('grid trace resets x on each row and fails y at 440 after twenty draws', () => {
  assert.equal(typeof lesson.trace, 'function');
  const frames = lesson.trace('grid');
  assert.deepEqual(frames.filter(f=>f.phase==='draw').map(f=>[f.x,f.y,80,80]), grid);
  assert.deepEqual(frames.filter(f=>f.phase==='start' && f.focus==='let x = 40').map(f=>[f.x,f.y,f.drawn]), [[40,40,0],[40,140,5],[40,240,10],[40,340,15]]);
  assert.deepEqual(frames.filter(f=>f.phase==='check' && f.focus==='y < 400').map(f=>[f.y,f.drawn]), [[40,0],[140,5],[240,10],[340,15],[440,20]]);
  assert.match(frames.filter(f=>f.phase==='check').at(-1).meaning,/false/i);
  assert.equal(frames.at(-1).drawn,20);
});
test('every frame points to the displayed source and has consistent progress', () => {
  assert.equal(typeof lesson.trace, 'function');
  for (const [mode,total] of [['row',5],['grid',20]]) {
    const built = lesson.build(mode), frames = lesson.trace(mode);
    let previous=0;
    for (const frame of frames) {
      assert.equal(frame.code,built.lines[frame.line][0]);
      assert.ok(frame.meaning.length>0);
      assert.equal(frame.total,total);
      assert.ok(frame.drawn>=previous && frame.drawn<=total);
      assert.ok(frame.x===null || Number.isFinite(frame.x));
      assert.ok(frame.y===null || Number.isFinite(frame.y));
      if(frame.focus) assert.ok(frame.code.includes(frame.focus));
      previous=frame.drawn;
    }
  }
});
test('browser UMD exposes the same lesson API', () => {
  assert.ok(fs.existsSync(modulePath));
  const browser={window:{}};
  vm.runInNewContext(fs.readFileSync(modulePath,'utf8'),browser);
  assert.equal(typeof browser.window.loopLesson.build,'function');
  assert.equal(browser.window.loopLesson.build().code,lesson.build().code);
});

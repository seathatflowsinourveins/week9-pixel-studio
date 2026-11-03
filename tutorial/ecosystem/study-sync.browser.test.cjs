const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('hosted sessions persist valid guide positions without using a local API',()=>{
 const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};let requests=0;
 const window={projectCore:require('../project-core.cjs')};
 const context={window,localStorage:storage,location:{protocol:'https:',hostname:'example.github.io'},document:{addEventListener(){},querySelectorAll(){return [];}},fetch(){requests++;throw Error('No local API on Pages');}};
 vm.runInNewContext(fs.readFileSync(__dirname+'/study-sync.js','utf8'),context);
 assert(window.studySync,'Hosted page needs the session API');
 window.studySync.setSession({stage:4,line:12});assert.equal(values.get('icm-study-session-v1'),JSON.stringify({stage:4,line:12}));
 assert.equal(JSON.stringify(window.studySync.getSession()),JSON.stringify({stage:4,line:12}));
 for(const invalid of [{stage:0,line:0},{stage:8,line:0},{stage:2,line:-1},{stage:2,line:101},{stage:'2',line:0}])window.studySync.setSession(invalid);
 assert.equal(values.get('icm-study-session-v1'),JSON.stringify({stage:4,line:12}));
 values.set('icm-study-session-v1','broken');assert.equal(JSON.stringify(window.studySync.getSession()),JSON.stringify({stage:1,line:0}));
 assert.equal(requests,0);
});

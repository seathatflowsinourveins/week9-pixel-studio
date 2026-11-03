const {chromium}=require('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1026-487-0_26.1026.487.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
async function main(){
 const root=path.resolve(__dirname,'..'),runtime=JSON.parse(fs.readFileSync(path.join(__dirname,'.runtime/latest.json'),'utf8'));
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({viewport:{width:1280,height:950},permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(runtime.url+'#stage-one');
  await page.locator('#stage-one-code').waitFor();
  assert.equal(await page.locator('#simple-manifest tbody tr').count(),7);
  assert.equal(await page.locator('.line-guide details').count(),8);
  for(const [id,file] of [['stage-one-code','sketch.js'],['stage-one-html','index.web-editor.html']]){
   const actual=await page.locator('#'+id).textContent(),expected=fs.readFileSync(path.join(root,'workspace/stage-01',file),'utf8').trimEnd().replace(/\r\n/g,'\n');
   assert.equal(actual,expected,'copyable '+file+' exactly matches the runnable reference');
   if(id==='stage-one-html')await page.getByText('Show the complete page setup to copy',{exact:true}).click();
   await page.locator('[data-copy-source="'+id+'"]').click();
   await page.getByRole('status').filter({hasText:'Copied.'}).waitFor();
   assert.equal((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n'),expected,'clipboard preserves the code, allowing Windows line endings');
  }
  assert.equal(await page.locator('.sample-example').evaluate(e=>e.complete&&e.naturalWidth===320&&e.naturalHeight===240),true);
  await page.locator('#simple-manifest').screenshot({path:path.join(root,'evidence/seven-stage-manifest.png')});
  await page.locator('.line-guide').screenshot({path:path.join(root,'evidence/stage-one-line-guide.png')});
  await page.locator('#stage-one-code').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(root,'evidence/stage-one-walkthrough-desktop.png')});
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'mobile page must not overflow');
  await page.locator('#stage-one').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(root,'evidence/stage-one-walkthrough-mobile.png')});
  assert.deepEqual(errors,[]);
  console.log('PASS seven stages, eight line explanations, both copy buttons match runnable source, image and mobile fit.');
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});

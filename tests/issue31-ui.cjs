const {chromium} = require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'docs/evidencias/issue-31');
fs.mkdirSync(out,{recursive:true});
const results=[];
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
 for(const [width,height] of [[320,568],[360,740],[412,915],[700,800],[701,800],[1440,900],[915,412]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:width<=700,hasTouch:width<=700});
  await context.route('http://promptops.test/**', async route=>{
   const pathname=new URL(route.request().url()).pathname;
   await route.fulfill({path:path.join(root,pathname==='/'?'index.html':pathname)});
  });
  const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://promptops.test/');await page.locator('.prompt-card').first().waitFor();
  assert.equal(await page.locator('.prompt-card').count(),24);
  await page.locator('#new-prompt').click();
  const dialog=page.locator('.modal-dialog');
  await dialog.evaluate(e=>e.scrollTop=0);
  await page.screenshot({path:path.join(out,`depois-formulario-topo-${width}.png`)});
  assert.ok(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth+1),'modal width');
  const columns=await page.locator('.form-row').first().evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);
  assert.equal(columns,width<=700?1:2);
  for(const element of await page.locator('#prompt-form input,#prompt-form select,#prompt-form textarea,.modal-footer button').all()){
   await element.scrollIntoViewIfNeeded();
   const r=await element.boundingBox(),d=await dialog.boundingBox();
   assert.ok(r.x>=d.x&&r.x+r.width<=d.x+d.width+1,'control inside dialog');
   assert.ok(r.y>=0&&r.y+r.height<=height+1,'control reachable vertically');
  }
  await page.screenshot({path:path.join(out,`depois-formulario-final-${width}.png`)});
  await page.locator('#title').fill('QA');
  await page.locator('#categoryId').selectOption({index:1});
  await page.locator('#subcategoryId').selectOption({index:1});
  for(const id of ['problem','objective','responsible'])await page.locator('#'+id).fill('Teste fictício de interface');
  await page.locator('#text').fill('Descreva uma rotina fictícia para organizar tarefas, explicando o objetivo, as etapas e o resultado esperado com clareza.');
  await page.locator('button[type=submit]').click();
  assert.equal(await page.locator('#title').evaluate(e=>e.validity.tooShort),true);
  assert.equal(await page.evaluate(()=>PromptOpsStorage.loadPersistedPrompts().length),0);
  await page.locator('#title').fill(`QA interface ${width}`);
  await page.screenshot({path:path.join(out,`depois-formulario-inicio-${width}.png`)});
  await page.locator('button[type=submit]').click();
  await page.locator('#modal').waitFor({state:'hidden'});
  assert.equal(await page.evaluate(()=>PromptOpsStorage.loadPersistedPrompts().length),1);
  await page.reload();await page.locator('.prompt-card').first().waitFor();
  assert.ok(await page.locator('.prompt-card').filter({hasText:`QA interface ${width}`}).count());
  if(width<=700){
   await page.locator('#menu-toggle').tap();
   await page.locator('.brand').tap();
   assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
   await page.locator('#menu-toggle').tap();
   await page.touchscreen.tap(width-12,300);
   assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
   await page.locator('#menu-toggle').tap();await page.keyboard.press('Escape');
   assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
   await page.locator('#menu-toggle').tap();await page.setViewportSize({width:1000,height});await page.setViewportSize({width,height});
   assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
  }
  await page.evaluate(()=>window.scrollTo(0,600));await page.waitForTimeout(400);
  assert.ok(Math.abs(await page.locator('.topbar').evaluate(e=>e.getBoundingClientRect().top))<1);
  await page.screenshot({path:path.join(out,`depois-rolagem-${width}.png`)});
  await page.goto('http://promptops.test/prompt.html?id=NAO-EXISTE');
  if(width<=700){
   await page.locator('#menu-toggle').tap();await page.touchscreen.tap(width-12,300);
   assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
  }
  assert.deepEqual(errors,[]);
  results.push({viewport:`${width}x${height}`,modal:'PASS',menu:width<=700?'PASS (touch/link/Escape/resize/detail)':'desktop',sticky:'PASS',validation:'PASS',persistence:'PASS',pageErrors:errors});
  await context.close();
 }
 fs.writeFileSync(path.join(out,'resultados.json'),JSON.stringify({browser:browser.version(),method:'Playwright Chrome headless; local project files served by route.fulfill on http://promptops.test (loopback network blocked)',results},null,2));
 console.log(JSON.stringify(results,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});


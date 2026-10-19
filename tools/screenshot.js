const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async () => {
  const b = await chromium.launch();
  for (const [w,h,name,scheme] of [[1280,1000,'desk','light'],[400,860,'phone','dark']]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    const errs=[]; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
    const html = require('fs').readFileSync(process.argv[2],'utf8');
    await p.setContent('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'+html+'</body></html>');
    await p.waitForFunction(() => !document.querySelector('#panel-plan').classList.contains('busy') && document.querySelector('.kpis'), null, {timeout: 30000}).catch(e=>errs.push('timeout'));
    await p.screenshot({ path: `ss-${name}.png`, fullPage: name==='desk' });
    console.log(name, 'errors:', errs, 'scrollW', await p.evaluate(()=>document.documentElement.scrollWidth));
    console.log(await p.evaluate(()=>document.querySelector('#panel-plan').innerText.slice(0,1500)));
  }
  await b.close();
})();

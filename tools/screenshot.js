// Headless check:  node tools/screenshot.js dist/index.html  -> ss-desk.png, ss-phone.png, ss-round.png
// Reports page errors and scrollWidth (must equal the viewport width) and prints the plan text.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async () => {
  const b = await chromium.launch();
  const html = require('fs').readFileSync(process.argv[2],'utf8');
  for (const [w,h,name,scheme] of [[1280,1000,'desk','light'],[400,860,'phone','dark']]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    const errs=[]; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
    await p.setContent('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'+html+'</body></html>');
    if (await p.isVisible('#guide')) await p.click('#guideGo'); // first-visit guide
    await p.waitForFunction(() => !document.querySelector('#panel-plan').classList.contains('busy') && document.querySelector('.kpis'), null, {timeout: 30000}).catch(e=>errs.push('timeout'));
    await p.screenshot({ path: `ss-${name}.png`, fullPage: name==='desk' });
    console.log(name, 'errors:', errs, 'scrollW', await p.evaluate(()=>document.documentElement.scrollWidth));
    console.log(await p.evaluate(()=>document.querySelector('#panel-plan').innerText.slice(0,1500)));
    if (name === 'desk') {
      await p.click('#tab-round');
      await p.waitForFunction(() => !document.querySelector('#panel-round .prog'), null, {timeout: 60000}).catch(e=>errs.push('round timeout'));
      await p.screenshot({ path: 'ss-round.png', fullPage: true });
      console.log(await p.evaluate(()=>document.querySelector('#panel-round').innerText.slice(0,900)));
      await p.click('#holeNext');
      console.log('next hole:', await p.evaluate(()=>document.querySelector('#panel-plan').innerText.slice(0,300)), 'errors:', errs);
    }
  }
  await b.close();
})();

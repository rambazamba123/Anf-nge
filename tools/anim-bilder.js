/* Bilder aller Phasen von Animationen als Kontaktabzug (Arbeitshilfe, docs/animationen-umbau.md §2).
   Aufruf: python3 -m http.server 8765 (im Repo, eigenes Fenster), dann node tools/anim-bilder.js bild.png <von> <bis> [id-Anfang]
   Ohne id-Anfang: nur Animationen mit Feld neu; mit id-Anfang: alle, deren id so beginnt. Braucht Playwright (vorinstalliert). */
const {chromium} = require('playwright');
(async () => {
  const datei = process.argv[2], von = +(process.argv[3] || 0), bis = +(process.argv[4] || 999);
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 1000, height: 800}});
  const errs = []; p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push(String(e)));
  await p.addInitScript(() => { try { localStorage.setItem('skipper-sbfsee-v1', JSON.stringify({introV5: true, profile: {name: 'T', exam: '2026-12-01', minutes: 30, exp: 'none', goal: 'sbf', facts: []}})); } catch (e) {} });
  await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(2500);
  const info = await p.evaluate(async ([von, bis, nur]) => { const process_filter = id => nur ? id.startsWith(nur) : ANIM.defs[id].neu;
    await nachladen('anim.js'); await ANIM.bereit; await nachladen('szene.js'); await nachladen('reise.js'); ANIM.css();
    const ids = ANIM.order.filter(id => process_filter(id)).slice(von, bis);
    document.body.innerHTML = '<div id="g" style="display:flex;flex-wrap:wrap;gap:4px;background:#333;padding:4px"></div>';
    const G = document.getElementById('g'); const out = [];
    for (const id of ids) { const d = ANIM.defs[id]; d.phasen.forEach((ph, i) => { const c = document.createElement('div'); const vb = d.vb || [400, 300]; c.style.cssText = 'width:240px;height:' + Math.round(240 * vb[1] / vb[0]) + 'px;background:#fff;position:relative';
      c.innerHTML = ANIM.html(id) + `<div style="position:absolute;left:2px;top:2px;font:10px sans-serif;background:#ffffffcc">${id} ${i}</div>`; G.appendChild(c); const s = ANIM.start(c); ANIM.phase(s, i); }); out.push(id + ':' + d.phasen.length); }
    return out; }, [von, bis, process.argv[5] || '']);
  await p.waitForTimeout(5000);
  const h = await p.evaluate(() => document.getElementById('g').scrollHeight); await p.setViewportSize({width: 1000, height: Math.min(h + 10, 6000)});
  await p.waitForTimeout(300);
  await p.screenshot({path: datei, fullPage: true});
  console.log(info.join(' ')); console.log('Fehler:', errs.slice(0, 10));
  await b.close();
})();

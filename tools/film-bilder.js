#!/usr/bin/env node
/* Standbilder einer Filmfolge (v5.84, Lektorat schneller, plan-lauf8 P3):
   Spielt die Marken [[ORT]], [[KAMERA]] und [[TU]] einer Folge ohne Ton im Browser nach und macht vor jeder Sprechzeile,
   bei der sich das Bild geändert hat, ein Standbild der Filmbühne. Darunter steht die Zeile, die man dazu hört.
   Ergebnis: ein Kontaktbogen je Folge (PNG) und eine Liste (MD) im Ordner podcast/lektorat/pakete/ (nicht im Repo).
   Aufruf:  python3 -m http.server 8765   (im Projektordner, eigenes Fenster)
            node tools/film-bilder.js <folgen-id> [<folgen-id> …] [--port 8765]
   Der Lektor bekommt Bogen und Liste statt Code: so prüft er Bild gegen Text, ohne film.js zu lesen. */
const fs = require('fs'), path = require('path');
const R = p => path.join(__dirname, '..', p);
const args = process.argv.slice(2), port = (args.includes('--port') ? args[args.indexOf('--port') + 1] : '8765');
const ids = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--port');
if (!ids.length) { console.log('Aufruf: node tools/film-bilder.js <folgen-id> […]'); process.exit(1); }
const aus = R('podcast/lektorat/pakete'); fs.mkdirSync(aus, {recursive: true});

(async () => {
  const {chromium} = require('playwright');
  const b = await chromium.launch(), p = await b.newPage({viewport: {width: 400, height: 860}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(`http://127.0.0.1:${port}/index.html`); await p.waitForTimeout(2000);
  await p.evaluate(async () => { for (const f of ['boot.js', 'figuren.js', 'film.js', 'kurs.js']) await nachladen(f); });
  for (const id of ids) {
    const punkte = await p.evaluate(async id => {
      const datei = KURS._datei(id); if (!datei) return {fehler: 'Folge unbekannt: ' + id};
      const cfg = await (await fetch('podcast/audio_config.json')).json(), txt = await (await fetch(datei)).text();
      const st = KURS.zerlege(txt, cfg, {});
      document.body.innerHTML = '<div id="fbtest" style="width:360px;height:450px;position:relative;overflow:hidden"></div>';
      const g = document.getElementById('fbtest'); FILMB.mount(g); FILMB.reset();
      /* Licht wie im Player: aus der ersten Szene */
      const sz = st.items.find(x => x.t === 'szene'), t = String(sz ? sz.text : '').toLowerCase();
      FILMB.licht(/nebel|diesig/.test(t) ? 'nebel' : /regen|schauer/.test(t) ? 'regen' : /nacht|dunkel/.test(t) ? 'nacht' : /abend|dämmer/.test(t) ? 'abend' : /früh|morgen/.test(t) ? 'morgen' : 'mittag');
      window.__fb = {st, k: 0, kap: ''};
      return {n: st.items.length};
    }, id);
    if (punkte.fehler) { console.log(punkte.fehler); continue; }
    const bilder = [];
    let geaendert = true, kap = '', notiz = [];
    for (let k = 0; k < punkte.n; k++) {
      const it = await p.evaluate(async k => {
        const x = __fb.st.items[k];
        if (x.t === 'ort') { FILMB.ort(x.name, 'sofort', x.blick); await FILMB.warte(); }
        else if (x.t === 'kamera') { FILMB.kamera(x.blick, x.einst, 'sofort'); await FILMB.warte(); }
        else if (x.t === 'tu') FILMB.sofort(x.werte);
        return {t: x.t, titel: x.titel || x.text || '', name: x.name || x.id || '', blick: x.blick, einst: x.einst, werte: x.werte ? Object.keys(x.werte).map(w => w + '=' + x.werte[w][0]).join(' ') : '',
          zeile: x.t === 'rede' ? x.zeilen.map(z => z.wer + ': ' + z.text).join(' / ') : '', frage: x.t === 'wahl' ? (x.frage || x.text || x.id || '') : ''};
      }, k);
      if (it.t === 'abschnitt') { kap = it.titel; geaendert = true; }
      else if (it.t === 'ort') { notiz.push(`ORT ${it.name} ${it.blick || ''}`.trim()); geaendert = true; }
      else if (it.t === 'kamera') { notiz.push(`KAMERA ${it.blick} ${it.einst}`); geaendert = true; }
      else if (it.t === 'tu') { notiz.push('TU ' + it.werte); geaendert = true; }
      else if (it.t === 'anim') notiz.push('ANIM ' + it.name + ' (läuft im Filmrahmen)');
      else if (it.t === 'wahl') notiz.push('FRAGE ' + it.name + ' (Bildschirm zeigt nur die Frage)');
      else if (it.t === 'rede' && geaendert) {
        await p.waitForTimeout(450);
        const png = await (await p.$('#fbtest')).screenshot();
        bilder.push({b64: png.toString('base64'), kap, notiz: notiz.join(' · '), zeile: it.zeile.slice(0, 220)});
        geaendert = false; notiz = [];
      }
    }
    const g = await b.newPage({viewport: {width: 1260, height: 800}});
    await g.setContent(`<body style="margin:0;background:#222;color:#eee;font:12px sans-serif;display:flex;flex-wrap:wrap;gap:6px;width:1260px">${bilder.map((x, i) => `<div style="width:246px;background:#333"><img src="data:image/png;base64,${x.b64}" width="246"><div style="padding:3px 4px"><b>${i + 1}</b> · ${x.kap.replace(/</g, '&lt;')}<br><span style="color:#9cf">${x.notiz.replace(/</g, '&lt;')}</span><br>${x.zeile.replace(/</g, '&lt;')}</div></div>`).join('')}</body>`);
    const bogen = path.join(aus, `film-bilder-${id}.png`); await g.screenshot({path: bogen, fullPage: true}); await g.close();
    const md = `# Standbilder ${id}\nBogen: \`${path.relative(R('.'), bogen)}\`\n\n` + bilder.map((x, i) => `${i + 1}. **${x.kap}** · ${x.notiz || 'Bild wie vorher'}\n   ${x.zeile}`).join('\n') + '\n';
    fs.writeFileSync(path.join(aus, `film-bilder-${id}.md`), md);
    console.log(`${id}: ${bilder.length} Standbilder → ${path.relative(R('.'), bogen)}`);
  }
  if (errs.length) console.log('Fehler in der Seite:\n' + errs.join('\n'));
  await b.close();
})();

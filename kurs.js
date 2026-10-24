/* Kajütenfunk-Player (V41, Konzept Anhang H): spielt eine Folge des Hörkurses in der App, erreichbar über den Hocker.
   Erzeugt wird die Folge auf dem Handy mit dem ElevenLabs-Schlüssel des Geräts (Text to Dialogue, Eleven v4).
   Fertige Teile liegen in CLIPS (IndexedDB, Schlüssel „kurs:…“) oder, für alle, in audio/kurs/<folge>/ mit ablauf.json
   (ZIP aus „📦 ZIP speichern“, eingebaut mit tools/kurs-import.js). Nach einer Skriptänderung wird nur Neues erzeugt.
   Auto-Modus: läuft durch, Denkpausen mit leisem Ticken, danach die Lösung.
   Interaktiv: hält an [[WAHL]] an, die Antwort zählt in der Statistik (record), nach falscher Antwort die Vertiefung,
   Katalogbilder bei [[BILD]]. Das Revier hört man: leise Geräusche aus audio/ je [[REVIER]]. */
(function () {
  const CODE = /\[\[\s*([A-ZÄÖÜ]+)\s*(?::\s*([^\]]*?))?\s*\]\]/g;
  const FOLGEN = {probe: {datei: 'podcast/folgen/probe-G6-3.md', titel: 'Brücken und Schleusen', unter: 'Probefolge aus G6.3, mit Quirin'}};
  const FORMAT = 'mp3_44100_64';   /* 64 kbit/s (Konzept §17.3) */
  /* [[AUDIO: …]] im Skript → Geräusch der App; was fehlt, fehlt */
  const TOENE = {Schiffsglocke: 'glocke', 'Möwen': 'moewe', Katze: 'katze', Papagei: 'papagei', Motor: 'motorStart', Uhr: 'uhr'};
  /* Revier → leise Dauer-Geräusche */
  const ATMO = {schleuse: {motorLauf: .22, wellen: .15}, nok: {motorLauf: .2, wellen: .15}, hafen: {wellen: .15}, frei: {wellen: .3, windLeise: .2},
    fahrwasser: {wellen: .3}, vtg: {wellen: .3}, fluss: {wellen: .25}, watt: {windLeise: .2}, binnensee: {windLeise: .15}, 'an Land': {}};
  const ATMO_ALLE = ['motorLauf', 'wellen', 'windLeise'];
  const NAMEN = {HINNERK: 'Hinnerk', SMILLA: 'Smilla', KLABAUTER: 'Klabauter', HARMS: 'Harms', QUIRIN: 'Quirin'};
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const ohneCodes = s => s.replace(CODE, ' ').replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();

  /* Skript → Ablauf: [{t: 'abschnitt'|'revier'|'rede'|'pause'|'wahl'|'bild'|'signal'|'ton', …, bereich?}]
     Sprecherzeilen hintereinander werden zu einer Anfrage (höchstens max_zeichen), Regiecodes trennen. */
  function zerlege(txt, cfg) {
    const fig = cfg.figuren || {}, max = (cfg.chunking && cfg.chunking.max_zeichen) || 2000;
    const TAGS = {INTENTION: cfg.intentionen, PAUSE: cfg.pause_tags, TEMPO: cfg.tempo_tags};
    const tagVon = (kat, wert) => { const e = (TAGS[kat] || {})[(wert || '').trim()]; return e ? e.tag : ''; };
    const zeilen = txt.split('\n'), items = [], fehlt = new Set();
    let i = 0, rede = null, bereich = null, vorab = null;
    if (zeilen[0] && zeilen[0].trim() === '---') { i = 1; while (i < zeilen.length && zeilen[i].trim() !== '---') i++; i++; }
    const schluss = () => { if (rede) { items.push(rede); rede = null; } };
    const dazu = it => { schluss(); items.push(bereich ? {...it, bereich} : it); };
    const sprich = (wer, roh) => {
      const text = roh.replace(CODE, (_, kat, wert) => ' ' + tagVon(kat, wert) + ' ').replace(/\s+/g, ' ').trim();
      if (!text) return;
      const f = fig[wer]; if (!f || !f.voice_id) fehlt.add(wer);
      if (rede && rede.zeichen + text.length > max) schluss();
      if (!rede) rede = {t: 'rede', inputs: [], wer: [], zeilen: [], zeichen: 0, ...(bereich ? {bereich} : {})};
      rede.inputs.push({text, voice_id: (f && f.voice_id) || null}); rede.zeilen.push({wer, text: ohneCodes(roh)});
      if (!rede.wer.includes(wer)) rede.wer.push(wer); rede.zeichen += text.length;
    };
    const steuer = (kat, wert) => {
      if (kat === 'ABSCHNITT') { bereich = null; dazu({t: 'abschnitt', titel: wert}); }
      else if (kat === 'SZENE') schluss();
      else if (kat === 'REVIER') dazu({t: 'revier', wert});
      else if (kat === 'DENKPAUSE') dazu({t: 'pause', s: +wert || 3});
      else if (kat === 'PAUSE') dazu({t: 'pause', s: wert === 'dramatisch' ? 1.5 : .7, still: true});
      else if (kat === 'VORAB') vorab = wert;
      else if (kat === 'WAHL') {
        const teile = wert.split('|').map(x => x.trim()).filter(Boolean), id = /^(sbf|bin):\d+$/.test(teile[0] || '') ? teile.shift() : null;
        dazu({t: 'wahl', id: vorab ? null : id, vorab: vorab || null, opts: teile.map(o => ({text: o.replace(/^\*/, '').trim(), ok: o.startsWith('*')}))}); vorab = null;
      }
      else if (kat === 'VERTIEFUNG') { schluss(); bereich = wert === 'ende' ? null : {art: 'vert', id: wert}; }
      else if (kat === 'HOERKARTE') { schluss(); bereich = {art: 'karte', id: wert}; items.push({t: 'abschnitt', titel: 'Hörkarte', bereich}); }
      else if (kat === 'BILD') dazu({t: 'bild', id: wert});
      else if (kat === 'SIGNAL') dazu({t: 'signal', muster: wert});
      else if (kat === 'AUDIO' && TOENE[wert]) dazu({t: 'ton', name: TOENE[wert]});
    };
    for (; i < zeilen.length; i++) {
      const z = zeilen[i].trim();
      if (!z || z.startsWith('#') || /^<!--.*-->$/.test(z)) continue;
      const m = z.match(/^([A-ZÄÖÜ][A-ZÄÖÜ0-9_]*):\s*(.*)$/);
      if (!m) { for (const c of z.matchAll(CODE)) steuer(c[1], (c[2] || '').trim()); continue; }
      /* Geräusche mitten in der Zeile trennen die Anfrage: erst der Ton, dann der Rest */
      for (const stueck of m[2].split(/(\[\[\s*AUDIO\s*:[^\]]*\]\])/)) {
        const a = stueck.match(/^\[\[\s*AUDIO\s*:\s*([^\]]*?)\s*\]\]$/);
        if (a) steuer('AUDIO', a[1]); else sprich(m[1], stueck);
      }
    }
    schluss();
    return {items, fehlt: [...fehlt]};
  }
  const schluessel = (modell, it) => 'kurs:' + hash(modell + '|' + FORMAT + '|' + JSON.stringify(it.inputs));

  /* ---------- Laden ---------- */
  async function laden(id) {
    const f = FOLGEN[id];
    const [cfg, txt, pub] = await Promise.all([
      fetch('podcast/audio_config.json?v=' + Date.now()).then(r => { if (!r.ok) throw new Error(`Konfiguration fehlt (HTTP ${r.status})`); return r.json(); }),
      fetch(f.datei + '?v=' + Date.now()).then(r => { if (!r.ok) throw new Error(`Skript fehlt (HTTP ${r.status})`); return r.text(); }),
      /* Bereitgestellte Folgen stehen in audio/kurs/index.json; nur dann gibt es ablauf.json (spart eine 404 in der Konsole) */
      fetch('audio/kurs/index.json?v=' + Date.now()).then(r => r.ok ? r.json() : {}).then(x => x.folgen && x.folgen[id] ? fetch(`audio/kurs/${id}/ablauf.json?v=` + Date.now()).then(r => r.ok ? r.json() : null) : null).catch(() => null)]);
    /* Stimmen: Was für alle bereitliegt, legt sie fest. Sonst die Konfiguration, darüber das Casting auf diesem Gerät. */
    const stimmen = {};
    for (const [k, v] of Object.entries(cfg.figuren || {})) stimmen[k] = v.voice_id;
    if (pub && pub.stimmen) Object.assign(stimmen, pub.stimmen);
    else for (const [k, v] of Object.entries((window.S && S.cfg && S.cfg.casting) || {})) if (v && v.id) stimmen[k] = v.id;
    for (const [k, v] of Object.entries(stimmen)) cfg.figuren[k] = {...(cfg.figuren[k] || {}), voice_id: v};
    const modell = (pub && pub.modell) || (cfg.modell && cfg.modell.id) || 'eleven_v4';
    const {items, fehlt} = zerlege(txt, cfg);
    items.forEach(it => { if (it.t === 'rede') it.key = schluessel(modell, it); });
    return {id, f, cfg, items, fehlt, pub, modell, stimmen};
  }
  async function blobVon(st, it) {
    if (st.pub && st.pub.dateien && st.pub.dateien[it.key]) {
      try { const r = await fetch(`audio/kurs/${st.id}/${st.pub.dateien[it.key]}`); if (r.ok) return await r.blob(); } catch (e) {}
    }
    return (await CLIPS.get(it.key)) || null;
  }
  async function bestand(st) {
    const reden = st.items.filter(it => it.t === 'rede'); let da = 0; const offen = [];
    for (const it of reden) { if ((st.pub && st.pub.dateien && st.pub.dateien[it.key]) || await CLIPS.get(it.key)) da++; else offen.push(it); }
    return {gesamt: reden.length, da, offen, zeichen: offen.reduce((s, it) => s + it.zeichen, 0)};
  }

  /* ---------- Erzeugen (kostet Credits) ---------- */
  async function erzeugen(st, info) {
    if (!elKey()) return info('Dafür brauchst du deinen ElevenLabs-Schlüssel (Einstellungen → Schlüssel).');
    if (st.fehlt.length) return info(`Noch keine Stimme für: ${st.fehlt.map(w => NAMEN[w] || w).join(', ')}. Bitte erst im Stimmen-Casting zuordnen.`);
    if (!(await kiEinwilligung())) return info('Ohne Einwilligung wird nichts erzeugt.');
    const b = await bestand(st);
    if (!b.offen.length) return info('Alles schon erzeugt.');
    if (!confirm(`Kajütenfunk erzeugen mit ${st.modell}: ${b.offen.length} Teile, etwa ${b.zeichen} Zeichen, also ungefähr so viele Credits. Weiter?`)) return info('Abgebrochen.');
    if (b.zeichen > 6000 && !confirm(`Das sind mehr als 6.000 Credits. Wirklich?`)) return info('Abgebrochen.');
    for (const [k, it] of b.offen.entries()) {
      info(`Erzeuge Teil ${k + 1} von ${b.offen.length} …`);
      const body = {inputs: it.inputs, model_id: st.modell, language_code: 'de'};
      const url = `${EL_BASE}/v1/text-to-dialogue?output_format=${FORMAT}`, opt = () => ({method: 'POST', headers: {'xi-api-key': elKey(), 'content-type': 'application/json', accept: 'audio/mpeg'}, body: JSON.stringify(body)});
      let r = await fetchT(url, opt(), 120000);
      if (r.status === 400 || r.status === 422) { delete body.language_code; r = await fetchT(url, opt(), 120000); }   /* falls das Modell language_code nicht kennt */
      if (!r.ok) { const d = await errDetail(r); LOG.add('kurs', `HTTP ${r.status} ${d.status || ''} ${d.msg || ''}`); return info(`Fehler bei Teil ${k + 1}: HTTP ${r.status} ${d.msg || d.status || ''}. Fertige Teile bleiben gespeichert.`); }
      await CLIPS.put(it.key, await r.blob(), {kind: 'kurs', t: it.zeilen.map(z => z.text).join(' ').slice(0, 80), at: Date.now()});
    }
    info('Fertig erzeugt. Viel Spaß beim Hören!');
  }

  /* Für alle bereitstellen: ZIP mit ablauf.json und den MP3s, hochladen in den Ordner import (tools/kurs-import.js) */
  async function zipSpeichern(st, info) {
    info('Lade das ZIP-Werkzeug …');
    if (!await loadZipLib()) return info('Das ZIP-Werkzeug ließ sich nicht laden. Bitte mit Internet erneut versuchen.');
    const zip = new JSZip(), dateien = {};
    for (const it of st.items) {
      if (it.t !== 'rede' || dateien[it.key]) continue;
      const b = await blobVon(st, it); if (!b) return info('Es fehlen noch Teile. Erst alles erzeugen.');
      dateien[it.key] = it.key.replace(':', '-') + '.mp3'; zip.file(dateien[it.key], b);
    }
    zip.file('ablauf.json', JSON.stringify({folge: st.id, skript: st.f.datei, modell: st.modell, format: FORMAT, stimmen: st.stimmen, dateien, erzeugt: new Date().toISOString()}, null, 1));
    const blob = await zip.generateAsync({type: 'blob'}), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `kurs-${st.id}.zip`; document.body.appendChild(a); a.click(); a.remove();
    info('ZIP gespeichert. Lade es auf GitHub in den Ordner import hoch und sag Claude Bescheid. Danach hört jeder die Folge ohne eigenen Schlüssel.');
  }

  /* ---------- Abspielen ---------- */
  let lauf = null;
  const cfgK = () => (S.cfg.kurs = S.cfg.kurs || {modus: 'interaktiv', tempo: 1, mitlesen: false, ticken: true});
  function atmo(wert) { const v = ATMO[wert] || {}; ATMO_ALLE.forEach(n => AUD.loop(n, v[n] || 0)); }
  function atmoAus() { ATMO_ALLE.forEach(n => AUD.loop(n, 0)); }
  function stop() { if (!lauf) return; lauf.aus = true; if (lauf.audio) { lauf.audio.pause(); lauf.audio = null; } if (lauf.weiter) lauf.weiter(); atmoAus(); lauf = null; }
  const ui = sel => document.querySelector('#kursplayer ' + sel);
  async function warten(me, ms) { const ende = Date.now() + ms; while (!me.aus && Date.now() < ende) { await sleep(Math.min(200, ende - Date.now())); while (me.pause && !me.aus) await sleep(200); } }
  async function rede(st, it, me) {
    const b = await blobVon(st, it); if (!b) return;
    const box = ui('#kspr');
    if (box) box.innerHTML = `<b>🎙️ ${it.wer.map(w => esc(NAMEN[w] || w)).join(', ')}</b>` + (cfgK().mitlesen ? it.zeilen.map(z => `<div class="small" style="margin-top:4px"><b>${esc(NAMEN[z.wer] || z.wer)}:</b> ${esc(z.text)}</div>`).join('') : '');
    const a = me.audio = new Audio(URL.createObjectURL(b));
    a.playbackRate = cfgK().tempo || 1; a.volume = Math.max(0, Math.min(1, S.cfg.voice == null ? 1 : S.cfg.voice));
    await new Promise(res => { a.onended = res; a.onerror = res; me.weiter = res; a.play().catch(res); });
    me.weiter = null; if (me.audio === a) me.audio = null; URL.revokeObjectURL(a.src);
    await warten(me, 250);
  }
  async function denkpause(s, me, still) {
    const box = ui('#kdenk');
    if (box && !still) box.innerHTML = `<div class="kdenk">🤔 Denkpause … ${s} s</div>`;
    if (!still && cfgK().ticken) AUD.ticks(s, .35);
    await warten(me, s * 1000);
    if (box) box.innerHTML = '';
  }
  function bild(id) {
    const [k, n] = id.split(':'), liste = k === 'bin' ? (typeof BIN_DATA !== 'undefined' ? BIN_DATA : []) : (typeof DATA !== 'undefined' ? DATA : []);
    const q = liste.find(x => x.n === +n), box = ui('#kbild');
    if (box && q && q.img && q.img.length) box.innerHTML = q.img.map(s => `<img src="${esc(s)}" alt="Katalogbild zu Frage ${+n}" style="max-width:100%;max-height:200px;border-radius:10px;background:#fff">`).join('');
  }
  /* Antwort zählt wie eine Quizantwort (Bible X8, P79), Basisfragen 1–72 auch im Binnen-Kurs */
  function zaehle(id, ok) {
    const [k, n] = String(id).split(':'), c = COURSE && COURSE.id;
    if (k === 'sbf' && (c === 'sbf' || (c === 'binnen' && +n <= 72))) { record(+n, ok); return true; }
    return false;
  }
  function wahl(st, it, me) {
    const box = ui('#kwahl'); if (!box) return Promise.resolve();
    const opts = it.opts.slice().sort(() => Math.random() - .5);
    box.innerHTML = `<p class="small" style="margin:0 0 6px"><b>${it.vorab ? 'Tipp mal (zählt nicht):' : 'Deine Antwort:'}</b></p>` + opts.map((o, i) => `<button class="btn ghost kopt" data-o="${i}" style="display:block;width:100%;margin:4px 0;text-align:left">${esc(o.text)}</button>`).join('') + `<button class="btn small ghost" data-o="-1" style="margin-top:4px">Weiter ohne Antwort</button>`;
    box.scrollIntoView({behavior: 'smooth', block: 'center'});
    return new Promise(res => {
      me.weiter = res;
      box.querySelectorAll('[data-o]').forEach(b => b.onclick = async () => {
        const o = opts[+b.dataset.o]; me.weiter = null;
        box.querySelectorAll('button').forEach(x => x.disabled = true);
        if (!o) { box.innerHTML = ''; return res(); }
        if (it.vorab) { box.innerHTML = `<p class="small" style="margin:0">Dein Tipp: <b>${esc(o.text)}</b>. Die Auflösung kommt.</p>`; await warten(me, 1200); box.innerHTML = ''; return res(); }
        AUD.sfx(o.ok ? 'richtig' : 'falsch', {vol: .8});
        if (!o.ok) me.falsch.add(it.id);
        const gezaehlt = it.id && zaehle(it.id, o.ok);
        b.style.background = o.ok ? 'var(--stb-soft)' : 'var(--bb-soft)';
        box.insertAdjacentHTML('beforeend', `<p class="small" style="margin:6px 0 0">${o.ok ? '✅ Richtig!' : '❌ Nicht ganz. Gleich kommt eine Erklärung.'}${gezaehlt ? ' <span class="muted">Zählt in deiner Statistik.</span>' : ''}</p>`);
        await warten(me, 1400); box.innerHTML = ''; res();
      });
    });
  }
  async function kennung(me) { AUD.sfx('glocke', {vol: .8}); await warten(me, 650); AUD.sfx('glocke', {vol: .8}); await warten(me, 1500); }
  async function spiele(st, ab = 0) {
    stop();
    const me = lauf = {aus: false, pause: false, audio: null, weiter: null, falsch: new Set()};
    AUD.unlock(); AUD.playMusic(null); zeigeSteuerung(st, true); { const i = ui('#kinfo'); if (i) i.textContent = ''; }
    if (ab === 0) await kennung(me);
    /* Revier der Stelle, an der es losgeht */
    for (let k = ab; k >= 0; k--) if (st.items[k] && st.items[k].t === 'revier') { atmo(st.items[k].wert); break; }
    const interaktiv = cfgK().modus === 'interaktiv';
    for (let k = ab; k < st.items.length && !me.aus; k++) {
      const it = st.items[k];
      if (it.bereich && it.bereich.art === 'vert' && !(interaktiv && me.falsch.has(it.bereich.id))) continue;
      while (me.pause && !me.aus) await sleep(200);
      if (me.aus) break;
      markiere(st, k);
      if (it.t === 'abschnitt') { const b = ui('#kbild'); if (b) b.innerHTML = ''; if (it.bereich && it.bereich.art === 'karte') atmoAus(); }
      else if (it.t === 'revier') atmo(it.wert);
      else if (it.t === 'rede') await rede(st, it, me);
      else if (it.t === 'pause') await denkpause(it.s, me, it.still);
      else if (it.t === 'bild') bild(it.id);
      else if (it.t === 'ton') { await AUD.sfx(it.name, {vol: .8, dur: it.name === 'glocke' ? 1.2 : 3}); }
      else if (it.t === 'signal') { const b = ui('#kdenk'); if (b) b.innerHTML = `<div class="kdenk">📯 ${esc(it.muster)}</div>`; await AUD.horn(it.muster).done; if (b) b.innerHTML = ''; }
      else if (it.t === 'wahl' && interaktiv) { await wahl(st, it, me); if (st.items[k + 1] && st.items[k + 1].t === 'pause') k++; }
    }
    if (lauf === me) { atmoAus(); lauf = null; zeigeSteuerung(st, false); const s = ui('#kspr'); if (s) s.innerHTML = me.aus ? '' : '<b>⚓ Ende der Probefolge.</b> Wie war’s? Sag Claude, was klingt und was nicht.'; }
  }
  function markiere(st, k) {
    let nr = -1; st.items.forEach((it, i) => { if (it.t === 'abschnitt' && i <= k) nr = i; });
    document.querySelectorAll('#kursplayer [data-ab]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.ab === nr)));
  }
  function zeigeSteuerung(st, laeuft) {
    const p = ui('#kplay'); if (!p) return;
    p.innerHTML = laeuft ? `<button class="btn" id="kpause">⏸ Pause</button> <button class="btn ghost" id="kstop">⏹ Stopp</button>` : `<button class="btn lamp" id="kstart">▶ Abspielen</button>`;
    const s = ui('#kstart'); if (s) s.onclick = () => spiele(st, 0);
    const pa = ui('#kpause'); if (pa) pa.onclick = () => { if (!lauf) return; lauf.pause = !lauf.pause; if (lauf.audio) lauf.pause ? lauf.audio.pause() : lauf.audio.play().catch(() => {}); pa.textContent = lauf.pause ? '▶ Weiter' : '⏸ Pause'; };
    const so = ui('#kstop'); if (so) so.onclick = () => { stop(); zeigeSteuerung(st, false); };
  }

  /* ---------- Bildschirm ---------- */
  async function oeffnen(id = 'probe') {
    subScreen(); stop();
    const f = FOLGEN[id];
    app.innerHTML = `<div id="kursplayer"><div class="qhead" style="margin-top:18px"><h1 style="margin:0">🎧 Kajütenfunk</h1><button class="btn small ghost" id="back">Zurück</button></div>
      <div class="card" id="kbuehne"><p style="margin:0"><b>${esc(f.titel)}</b></p><p class="small muted" style="margin:2px 0 8px">${esc(f.unter)} · etwa 5 Minuten</p>
        <div id="kplay"></div><p class="status small" id="kinfo">Lade …</p>
        <div id="kspr" class="small"></div><div id="kdenk"></div><div id="kbild" style="text-align:center;margin-top:6px"></div><div id="kwahl" style="margin-top:6px"></div></div>
      <div class="card"><div class="kreihe"><button class="chip" data-mod="auto">🚗 Auto</button><button class="chip" data-mod="interaktiv">👆 Interaktiv</button></div>
        <p class="small muted" id="kmodtxt" style="margin:6px 0"></p>
        <div class="kreihe"><label class="small">Tempo <select id="ktem"><option value="0.9">langsam</option><option value="1">normal</option><option value="1.1">zügig</option></select></label>
          <label class="small"><input type="checkbox" id="kmit"> Mitlesen</label><label class="small"><input type="checkbox" id="ktick"> Ticken</label></div></div>
      <div class="card"><h3 style="margin-top:0">Abschnitte</h3><div id="kab"></div></div>
      <div class="card" id="ktech"><h3 style="margin-top:0">Erzeugen</h3><p class="small muted" id="kbest">…</p><div class="kreihe"><button class="btn ki" id="kgen">🎙️ Probefolge erzeugen</button><button class="btn ghost small" id="kcast">🎭 Stimmen-Casting</button><button class="btn ghost small" id="kzip">📦 ZIP speichern</button></div><p class="status small" id="kginfo"></p></div></div>
      <style>.kdenk{font-size:1.1em;font-weight:700;margin-top:6px}#kursplayer [data-ab]{display:block;width:100%;text-align:left;margin:3px 0}#kursplayer .kreihe{display:flex;flex-wrap:wrap;gap:8px;align-items:center}#kursplayer .kreihe .chip{flex:0 0 auto}</style>`;
    $('#back').onclick = () => { stop(); setTab('cabin'); };
    const info = t => { const e = $('#kinfo'); if (e) e.textContent = t; }, ginfo = t => { const e = $('#kginfo'); if (e) e.textContent = t; };
    const k = cfgK();
    const chips = () => {
      document.querySelectorAll('#kursplayer [data-mod]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mod === k.modus)));
      $('#ktem').value = String(k.tempo || 1);
      $('#kmodtxt').textContent = k.modus === 'auto' ? 'Läuft durch, auch mit ausgeschaltetem Bildschirm. Nach jeder Denkpause kommt die Lösung.' : 'Hält an den Fragen an: Antwort tippen, sie zählt in deiner Statistik. Bei falscher Antwort erklärt die Crew es nochmal anders.';
    };
    document.querySelectorAll('#kursplayer [data-mod]').forEach(b => b.onclick = () => { k.modus = b.dataset.mod; save(); chips(); });
    $('#ktem').onchange = e => { k.tempo = +e.target.value; save(); if (lauf && lauf.audio) lauf.audio.playbackRate = k.tempo; };
    $('#kmit').checked = !!k.mitlesen; $('#kmit').onchange = e => { k.mitlesen = e.target.checked; save(); };
    $('#ktick').checked = k.ticken !== false; $('#ktick').onchange = e => { k.ticken = e.target.checked; save(); };
    chips();
    let st;
    try { st = await laden(id); } catch (e) { return info('Ging nicht: ' + (e.message || e)); }
    const neu = async () => {
      const b = await bestand(st);
      $('#kab').innerHTML = st.items.map((it, i) => it.t === 'abschnitt' ? `<button class="chip" data-ab="${i}">${esc(it.titel)}</button>` : '').join('');
      document.querySelectorAll('#kursplayer [data-ab]').forEach(x => x.onclick = () => { if (b.offen.length) return info('Erst erzeugen.'); spiele(st, +x.dataset.ab); });
      $('#kbest').textContent = b.offen.length ? `${b.da} von ${b.gesamt} Teilen sind fertig. Es fehlen etwa ${b.zeichen} Zeichen (ungefähr so viele Credits).${st.fehlt.length ? ` Noch ohne Stimme: ${st.fehlt.map(w => NAMEN[w] || w).join(', ')}.` : ''}` : `Alle ${b.gesamt} Teile sind da${st.pub ? ' (für alle bereitgestellt)' : ' (auf diesem Handy)'}.`;
      $('#kgen').style.display = b.offen.length ? '' : 'none';
      $('#kzip').style.display = !b.offen.length && !st.pub ? '' : 'none';
      if (b.offen.length) { info(st.pub ? 'Für diese Fassung fehlen Teile.' : 'Die Folge ist noch nicht erzeugt. Unten auf „Probefolge erzeugen“ tippen.'); $('#kplay').innerHTML = ''; }
      else { info('Bereit.'); zeigeSteuerung(st, false); }
    };
    await neu();
    $('#kgen').onclick = async () => { $('#kgen').disabled = true; try { await erzeugen(st, ginfo); } catch (e) { ginfo('Ging nicht: ' + (e.message || e.code || e)); } $('#kgen').disabled = false; await neu(); };
    $('#kzip').onclick = () => zipSpeichern(st, ginfo).catch(e => ginfo('Ging nicht: ' + (e.message || e)));
    $('#kcast').onclick = () => { stop(); if (typeof castingOeffnen === 'function') castingOeffnen(); else renderSettings(); };
    /* Wächter: Wer den Bildschirm verlässt (Zurück-Taste, anderer Reiter), beendet die Wiedergabe */
    const root = $('#kursplayer'), w = setInterval(() => { if (!document.body.contains(root)) { clearInterval(w); stop(); } }, 400);
  }

  if (typeof window !== 'undefined') window.KURS = {oeffnen, zerlege, stop};
  if (typeof module !== 'undefined') module.exports = {zerlege};
})();

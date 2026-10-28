/* Kajütenfunk-Player (V41, Konzept Anhang H): spielt eine Folge des Hörkurses in der App, erreichbar über den Hocker.
   Erzeugt wird die Folge auf dem Handy mit dem ElevenLabs-Schlüssel des Geräts (Text to Dialogue, Eleven v4).
   Fertige Teile liegen in CLIPS (IndexedDB, Schlüssel „kurs:…“) oder, für alle, in audio/kurs/<folge>/ mit ablauf.json
   (ZIP aus „📦 ZIP speichern“, eingebaut mit tools/kurs-import.js). Nach einer Skriptänderung wird nur Neues erzeugt.
   Auto-Modus: läuft durch, Denkpausen mit leisem Ticken, danach die Lösung.
   Interaktiv: hält an [[WAHL]] an, die Antwort zählt in der Statistik (record), nach falscher Antwort die Vertiefung,
   Katalogbilder bei [[BILD]]. Das Revier hört man: leise Geräusche aus audio/ je [[REVIER]].
   Geräusche aus podcast/geraeusche.json erzeugt die App mit ElevenLabs Sound Effects (Schlüssel „sfx:…“) und spielt sie bei
   [[AUDIO: <name>]] oder als Atmo des Reviers. Kein Erkennungston am Anfang (Nutzer, 24.10.2026, O15).
   Reihenfolge beim Erzeugen (Nutzer, 24.10.2026): erst die Geräusche (einzeln anhören und herunterladen, liegt ein Geräusch im Repo
   („datei“), nimmt die App das), dann die Sprache Abschnitt für Abschnitt. Vorher prüft die App kostenlos, ob ElevenLabs alle
   Stimmen kennt. Fehlt ein Abschnitt, endet das Abspielen davor (Ausschnitt statt gekürzter Text). */
(function () {
  const CODE = /\[\[\s*([A-ZÄÖÜ]+)\s*(?::\s*([^\]]*?))?\s*\]\]/g;
  const FOLGEN = {probe: {datei: 'podcast/folgen/probe-G6-3.md', titel: 'Brücken und Schleusen', unter: 'Probefolge aus G6.3, mit Quirin'}};
  const FORMAT = 'mp3_44100_64';   /* 64 kbit/s (Konzept §17.3) */
  /* [[AUDIO: …]] im Skript → Geräusch der App; was fehlt, fehlt */
  const TOENE = {Schiffsglocke: 'glocke', 'Möwen': 'moewe', Katze: 'katze', Papagei: 'papagei', Motor: 'motorStart', Uhr: 'uhr', Schritte: 'schritte'};
  const TON_DAUER = {glocke: 1.2, schritte: 2};
  const DENK_MIN = 6;   /* B152 (Nutzer, 27.10.2026): im Auto-Modus immer sechs Sekunden */
  /* Revier → leise Dauer-Geräusche */
  const ATMO = {schleuse: {motorLauf: .22, wellen: .15}, nok: {motorLauf: .2, wellen: .15}, hafen: {wellen: .15}, frei: {wellen: .3, windLeise: .2},
    fahrwasser: {wellen: .3}, vtg: {wellen: .3}, fluss: {wellen: .25}, watt: {windLeise: .2}, binnensee: {windLeise: .15}, 'an Land': {}};
  const ATMO_ALLE = ['motorLauf', 'wellen', 'windLeise'];
  const NAMEN = {HINNERK: 'Hinnerk', SMILLA: 'Smilla', KLABAUTER: 'Klabauter', HARMS: 'Harms', QUIRIN: 'Quirin'};
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const ohneCodes = s => s.replace(CODE, ' ').replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();

  /* Skript → Ablauf: [{t: 'abschnitt'|'revier'|'rede'|'pause'|'wahl'|'bild'|'signal'|'ton', …, bereich?}]
     Sprecherzeilen hintereinander werden zu einer Anfrage (höchstens max_zeichen), Regiecodes trennen. */
  function zerlege(txt, cfg, ger = {}) {
    const fig = cfg.figuren || {}, max = (cfg.chunking && cfg.chunking.max_zeichen) || 2000;
    const TAGS = {INTENTION: cfg.intentionen, PAUSE: cfg.pause_tags, TEMPO: cfg.tempo_tags};
    const tagVon = (kat, wert) => { const e = (TAGS[kat] || {})[(wert || '').trim()]; return e ? e.tag : ''; };
    const zeilen = txt.split('\n'), items = [], fehlt = new Set(), vorabOffen = new Set();
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
      else if (kat === 'VORAB') { vorab = wert; vorabOffen.add(wert); }
      /* Auflösung der Vorab-Frage: beim ersten Katalogsatz dazu zeigt die App den Tipp von vorhin */
      else if (kat === 'KATALOG' && !bereich) wert.split(',').map(x => x.trim()).filter(x => vorabOffen.delete(x)).forEach(id => dazu({t: 'tipp', id}));
      else if (kat === 'WAHL') {
        const teile = wert.split('|').map(x => x.trim()).filter(Boolean), id = /^(sbf|bin):\d+$/.test(teile[0] || '') ? teile.shift() : null;
        dazu({t: 'wahl', id: vorab ? null : id, vorab: vorab || null, opts: teile.map(o => ({text: o.replace(/^\*/, '').trim(), ok: o.startsWith('*')}))}); vorab = null;
      }
      else if (kat === 'VERTIEFUNG') { schluss(); bereich = wert === 'ende' ? null : {art: 'vert', id: wert}; }
      else if (kat === 'HOERKARTE') { schluss(); bereich = {art: 'karte', id: wert}; items.push({t: 'abschnitt', titel: 'Hörkarte', bereich}); }
      else if (kat === 'BILD') dazu({t: 'bild', id: wert});
      else if (kat === 'SIGNAL') dazu({t: 'signal', muster: wert});
      else if (kat === 'AUDIO' && ger[wert]) dazu({t: 'ton', gen: ger[wert].id, parallel: !!ger[wert].parallel});
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
    /* Abschnittsnummer an jedem Teil: Erzeugt und abgespielt wird Abschnitt für Abschnitt (Bible A13) */
    let nr = -1; items.forEach(it => { if (it.t === 'abschnitt') nr++; it.ab = nr; });
    return {items, fehlt: [...fehlt]};
  }
  const schluessel = (modell, it) => 'kurs:' + hash(modell + '|' + FORMAT + '|' + JSON.stringify(it.inputs));
  const sfxSchluessel = (modell, g) => 'sfx:' + hash([modell, FORMAT, g.prompt, g.sekunden, !!g.loop, g.einfluss].join('|'));

  /* ---------- Laden ---------- */
  async function laden(id) {
    const f = FOLGEN[id];
    const [cfg, txt, pub, gd] = await Promise.all([
      fetch('podcast/audio_config.json?v=' + Date.now()).then(r => { if (!r.ok) throw new Error(`Konfiguration fehlt (HTTP ${r.status})`); return r.json(); }),
      fetch(f.datei + '?v=' + Date.now()).then(r => { if (!r.ok) throw new Error(`Skript fehlt (HTTP ${r.status})`); return r.text(); }),
      /* Bereitgestellte Folgen stehen in audio/kurs/index.json; nur dann gibt es ablauf.json (spart eine 404 in der Konsole) */
      fetch('audio/kurs/index.json?v=' + Date.now()).then(r => r.ok ? r.json() : {}).then(x => x.folgen && x.folgen[id] ? fetch(`audio/kurs/${id}/ablauf.json?v=` + Date.now()).then(r => r.ok ? r.json() : null) : null).catch(() => null),
      fetch('podcast/geraeusche.json?v=' + Date.now()).then(r => r.ok ? r.json() : {}).catch(() => ({}))]);
    /* Stimmen: Was für alle bereitliegt, legt sie fest. Sonst die Konfiguration, darüber das Casting auf diesem Gerät. */
    const stimmen = {};
    for (const [k, v] of Object.entries(cfg.figuren || {})) stimmen[k] = v.voice_id;
    if (pub && pub.stimmen) Object.assign(stimmen, pub.stimmen);
    /* Wahl auf dem Gerät nur, solange die Konfiguration seitdem gleich ist (wie casting.js); sonst gilt die neuere Konfiguration */
    else for (const [k, v] of Object.entries((window.S && S.cfg && S.cfg.casting) || {})) if (v && v.id && (!stimmen[k] || v.cfg === stimmen[k])) stimmen[k] = v.id;
    for (const [k, v] of Object.entries(stimmen)) cfg.figuren[k] = {...(cfg.figuren[k] || {}), voice_id: v};
    const modell = (pub && pub.modell) || (cfg.modell && cfg.modell.id) || 'eleven_v4';
    /* Geräusche: nur die, die das Skript nennt, und die Atmo der Reviere darin */
    const sfxModell = gd.modell || 'eleven_text_to_sound_v2', alle = Object.entries(gd.geraeusche || {}).map(([gid, g]) => ({...g, id: gid, key: sfxSchluessel(sfxModell, g)}));
    const ger = {}; alle.forEach(g => { if (g.name) ger[g.name] = g; });
    const {items, fehlt} = zerlege(txt, cfg, ger);
    items.forEach(it => {
      if (it.t === 'rede') it.key = schluessel(modell, it);
      if (it.t === 'ton' && it.gen) { const g = alle.find(x => x.id === it.gen); it.key = g.key; it.datei = g.datei; }
    });
    const reviere = new Set(items.filter(it => it.t === 'revier').map(it => it.wert));
    const sfx = alle.filter(g => items.some(it => it.gen === g.id) || (g.revier && reviere.has(g.revier)));
    /* Abschnitte mit geschätzter Dauer im Auto-Modus (Sprechtempo aus der Konfiguration, Signale wie AUD.horn) */
    const tempo = cfg.sprechtempo_zeichen_pro_sekunde || 13.9;
    const signalSek = m => { const t = [...m].filter(c => c === '●' || c === '▬'); return t.reduce((s, c) => s + (c === '●' ? 1 : 4.5), 0) + Math.max(0, t.length - 1); };
    const sek = it => it.bereich && it.bereich.art === 'vert' ? 0 : it.t === 'rede' ? it.zeichen / tempo + .25 : it.t === 'pause' ? (it.still ? it.s : Math.max(DENK_MIN, it.s)) : it.t === 'signal' ? signalSek(it.muster) : 0;
    const abschnitte = items.filter(it => it.t === 'abschnitt').map(a => {
      const teile = items.filter(it => it.ab === a.ab);
      return {nr: a.ab, titel: a.titel, karte: !!(a.bereich && a.bereich.art === 'karte'), sek: teile.reduce((s, it) => s + sek(it), 0), zeichen: teile.filter(it => it.t === 'rede').reduce((s, it) => s + it.zeichen, 0)};
    });
    return {id, f, cfg, items, fehlt, pub, modell, stimmen, sfx, sfxModell, abschnitte};
  }
  /* Woher ein Teil kommt: Geräusch im Repo („datei“), für alle bereitgestellt (audio/kurs/<folge>/) oder auf diesem Gerät erzeugt */
  async function blobVon(st, it) {
    if (it.datei) { try { const r = await fetch(it.datei); if (r.ok) return await r.blob(); } catch (e) {} }
    if (st.pub && st.pub.dateien && st.pub.dateien[it.key]) {
      try { const r = await fetch(`audio/kurs/${st.id}/${st.pub.dateien[it.key]}`); if (r.ok) return await r.blob(); } catch (e) {}
    }
    return (await CLIPS.get(it.key)) || null;
  }
  const istDa = async (st, it) => !!(it.datei || (st.pub && st.pub.dateien && st.pub.dateien[it.key]) || await CLIPS.get(it.key));
  /* Geräusche: etwa 20 Credits je Sekunde bei fester Dauer (ElevenLabs-Doku, podcast/geraeusche.json) */
  const sfxKosten = g => Math.round((g.sekunden || 5) * 20);
  async function bestand(st) {
    const reden = st.items.filter(it => it.t === 'rede'); let da = 0; const offen = [], offenSfx = [], abOffen = new Map();
    for (const it of reden) { if (await istDa(st, it)) da++; else { offen.push(it); abOffen.set(it.ab, (abOffen.get(it.ab) || 0) + it.zeichen); } }
    for (const g of st.sfx) { if (await istDa(st, g)) da++; else offenSfx.push(g); }
    const sfxCredits = offenSfx.reduce((s, g) => s + sfxKosten(g), 0);
    return {gesamt: reden.length + st.sfx.length, da, offen, offenSfx, abOffen, zeichen: offen.reduce((s, it) => s + it.zeichen, 0), sfxCredits};
  }

  /* ---------- Stimmen prüfen (kostenlos) ---------- */
  /* Kennt ElevenLabs die Stimmen? GET /v1/voices/{id} kostet keine Credits. Läuft auch vor jedem Erzeugen der Sprache. */
  async function stimmenPruefen(st, wer) {
    const out = [];
    for (const w of wer) {
      const id = st.cfg.figuren[w] && st.cfg.figuren[w].voice_id;
      if (!id) { out.push({w, ok: false, txt: 'keine Stimme zugeordnet'}); continue; }
      try {
        const r = await fetchT(`${EL_BASE}/v1/voices/${encodeURIComponent(id)}`, {headers: {'xi-api-key': elKey()}}, 15000);
        if (r.ok) { const j = await r.json().catch(() => ({})); out.push({w, ok: true, txt: j.name || id}); continue; }
        const d = await errDetail(r);
        if (d.perm) out.push({w, ok: null, txt: 'nicht prüfbar, dem Schlüssel fehlt das Recht „Stimmen lesen“'});
        else if (r.status === 401) { out.push({w, ok: null, txt: 'Schlüssel abgelehnt (HTTP 401)'}); break; }
        else out.push({w, ok: false, txt: `nicht gefunden (HTTP ${r.status}${d.msg ? ': ' + d.msg : ''})`});
      } catch (e) { out.push({w, ok: null, txt: 'keine Verbindung'}); break; }
    }
    return out;
  }
  const stimmenHtml = l => l.map(x => `${x.ok ? '✅' : x.ok === false ? '❌' : '❔'} <b>${esc(NAMEN[x.w] || x.w)}:</b> ${esc(x.txt)}${x.ok === false && /nicht gefunden/.test(x.txt) ? ` <button class="btn small ghost" data-hol="${esc(x.w)}">➕ aus der Bibliothek ins Konto holen</button>` : ''}`).join('<br>');
  /* Stimme aus der ElevenLabs-Bibliothek ins eigene Konto holen (kostenlos): suchen nach Name, die mit der ID der Konfiguration
     nehmen (sonst den gleichen Namen), dann /v1/voices/add. Bekommt sie im Konto eine neue ID, merkt sich das Gerät diese (S.cfg.casting). */
  async function holen(st, w) {
    const f = st.cfg.figuren[w] || {}, id = f.voice_id, name = (f.stimme || f.wunsch || '').trim();
    if (!name) return `Für ${NAMEN[w] || w} steht kein Stimmenname in der Konfiguration.`;
    let treffer = null;
    for (const such of [name, name.split(' - ')[0]]) {
      const r = await fetchT(`${EL_BASE}/v1/shared-voices?page_size=100&search=${encodeURIComponent(such)}`, {headers: {'xi-api-key': elKey()}}, 20000);
      if (!r.ok) { const d = await errDetail(r); return `Bibliothek ging nicht: HTTP ${r.status} ${d.msg || ''}`; }
      const l = (await r.json()).voices || [];
      treffer = l.find(v => v.voice_id === id) || l.find(v => (v.name || '').trim().toLowerCase() === name.toLowerCase());
      if (treffer) break;
    }
    if (!treffer) return `„${name}“ ist in der ElevenLabs-Bibliothek nicht (mehr) zu finden. Bitte im Stimmen-Casting eine andere Stimme wählen.`;
    const q = await fetchT(`${EL_BASE}/v1/voices/add/${treffer.public_owner_id}/${treffer.voice_id}`, {method: 'POST', headers: {'xi-api-key': elKey(), 'content-type': 'application/json'}, body: JSON.stringify({new_name: treffer.name})}, 20000);
    if (!q.ok) { const d = await errDetail(q); return d.perm ? 'Deinem ElevenLabs-Schlüssel fehlt das Recht „Voices: Schreiben“. Auf elevenlabs.io → API Keys → Schlüssel bearbeiten → bei Voices „Write“ erlauben. Oder die Stimme auf der Website in der Voice Library mit „Add to my voices“ holen.' : `Holen ging nicht: HTTP ${q.status} ${d.msg || d.status || ''}`; }
    const neu = ((await q.json().catch(() => ({}))).voice_id) || treffer.voice_id;
    if (neu !== id) { (S.cfg.casting = S.cfg.casting || {})[w] = {id: neu, name: treffer.name, cfg: id || null}; save(); st.cfg.figuren[w] = {...f, voice_id: neu}; st.stimmen[w] = neu; }
    return '';
  }
  const sprecher = st => [...new Set(st.items.filter(it => it.t === 'rede').flatMap(it => it.wer))];

  /* ---------- Erzeugen (kostet Credits) ---------- */
  /* was: {sfx: true} nur die Geräusche; sonst die Sprache, mit ab: Set der Abschnitte (ohne ab: alles, was fehlt) */
  async function erzeugen(st, info, was = {}) {
    if (!elKey()) return info('Dafür brauchst du deinen ElevenLabs-Schlüssel (Einstellungen → Schlüssel).');
    if (!(await kiEinwilligung())) return info('Ohne Einwilligung wird nichts erzeugt.');
    const b = await bestand(st);
    const reden = was.sfx ? [] : b.offen.filter(it => !was.ab || was.ab.has(it.ab)), sfx = was.sfx ? b.offenSfx : [];
    if (!reden.length && !sfx.length) return info(was.sfx ? 'Alle Geräusche sind schon da.' : 'Diese Teile sind schon erzeugt.');
    if (reden.length) {
      const wer = [...new Set(reden.flatMap(it => it.wer))], ohne = wer.filter(w => !(st.cfg.figuren[w] && st.cfg.figuren[w].voice_id));
      if (ohne.length) return info(`Noch keine Stimme für: ${ohne.map(w => NAMEN[w] || w).join(', ')}. Bitte erst im Stimmen-Casting zuordnen.`);
      /* Vor dem Start: Kennt ElevenLabs alle Stimmen? Kostet nichts (Nutzer, 24.10.2026: „Teste vor dem Start, ob du die Stimme hast“). */
      info('Prüfe die Stimmen …');
      const pr = await stimmenPruefen(st, wer), box = $('#kvoiceinfo'); if (box) box.innerHTML = '<span class="muted">Geprüft für diesen Teil:</span><br>' + stimmenHtml(pr);
      const nein = pr.filter(x => x.ok === false);
      if (nein.length) return info(`Stimme nicht gefunden: ${nein.map(x => NAMEN[x.w] || x.w).join(', ')}. Im Stimmen-Casting die Stimme „holen“ und dann noch einmal. Es wurde nichts erzeugt.`);
      if (pr.some(x => x.ok === null) && !confirm('Die Stimmen ließen sich nicht prüfen. Trotzdem erzeugen?')) return info('Abgebrochen.');
    }
    const zeichen = reden.reduce((s, it) => s + it.zeichen, 0), sfxCr = sfx.reduce((s, g) => s + sfxKosten(g), 0), summe = zeichen + sfxCr;
    const text = reden.length ? `${reden.length} Sprachteile mit ${st.modell}, etwa ${zeichen.toLocaleString('de-DE')} Zeichen (= Credits)` : `${sfx.length} Geräusche, etwa ${sfxCr.toLocaleString('de-DE')} Credits`;
    if (!confirm(`Kajütenfunk erzeugen: ${text}. Weiter?`)) return info('Abgebrochen.');
    if (summe > 6000 && !confirm(`Das sind mehr als 6.000 Credits. Wirklich?`)) return info('Abgebrochen.');
    for (const [k, it] of reden.entries()) {
      info(`Erzeuge Teil ${k + 1} von ${reden.length} …`);
      const body = {inputs: it.inputs, model_id: st.modell, language_code: 'de'};
      const url = `${EL_BASE}/v1/text-to-dialogue?output_format=${FORMAT}`, opt = () => ({method: 'POST', headers: {'xi-api-key': elKey(), 'content-type': 'application/json', accept: 'audio/mpeg'}, body: JSON.stringify(body)});
      let r = await fetchT(url, opt(), 120000);
      if (r.status === 400 || r.status === 422) { delete body.language_code; r = await fetchT(url, opt(), 120000); }   /* falls das Modell language_code nicht kennt */
      if (!r.ok) { const d = await errDetail(r); LOG.add('kurs', `HTTP ${r.status} ${d.status || ''} ${d.msg || ''}`); return info(`Fehler bei Teil ${k + 1}: HTTP ${r.status} ${d.msg || d.status || ''}. Fertige Teile bleiben gespeichert.`); }
      await CLIPS.put(it.key, await r.blob(), {kind: 'kurs', t: it.zeilen.map(z => z.text).join(' ').slice(0, 80), at: Date.now()});
    }
    for (const [k, g] of sfx.entries()) {
      info(`Erzeuge Geräusch ${k + 1} von ${sfx.length}: ${g.name || g.id} …`);
      const body = {text: g.prompt, duration_seconds: g.sekunden, prompt_influence: g.einfluss == null ? .3 : g.einfluss, model_id: st.sfxModell, ...(g.loop ? {loop: true} : {})};
      const url = `${EL_BASE}/v1/sound-generation?output_format=${FORMAT}`, opt = () => ({method: 'POST', headers: {'xi-api-key': elKey(), 'content-type': 'application/json', accept: 'audio/mpeg'}, body: JSON.stringify(body)});
      let r = await fetchT(url, opt(), 120000);
      if (r.status === 400 || r.status === 422) { delete body.model_id; delete body.loop; r = await fetchT(url, opt(), 120000); }   /* älteres Modell ohne loop */
      if (!r.ok) { const d = await errDetail(r); LOG.add('kurs', `Geräusch HTTP ${r.status} ${d.status || ''} ${d.msg || ''}`); return info(`Fehler beim Geräusch ${g.name || g.id}: HTTP ${r.status} ${d.msg || d.status || ''}. Fertige Teile bleiben gespeichert.`); }
      await CLIPS.put(g.key, await r.blob(), {kind: 'kurs', t: 'Geräusch ' + (g.name || g.id), at: Date.now()});
    }
    info(reden.length ? 'Fertig erzeugt. Viel Spaß beim Hören!' : 'Geräusche fertig. Unten kannst du jedes anhören und herunterladen.');
  }

  /* Datei aufs Gerät speichern (Android: Downloads) */
  function runter(blob, name) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }
  /* Für alle bereitstellen: ZIP mit ablauf.json und den MP3s, hochladen in den Ordner import (tools/kurs-import.js).
     Geht auch mit einem Teil der Abschnitte; das Abspielen endet dann vor dem ersten fehlenden. Geräusche aus dem Repo bleiben draußen. */
  async function zipSpeichern(st, info) {
    info('Lade das ZIP-Werkzeug …');
    if (!await loadZipLib()) return info('Das ZIP-Werkzeug ließ sich nicht laden. Bitte mit Internet erneut versuchen.');
    const zip = new JSZip(), dateien = {}; let fehlt = 0;
    for (const it of st.items.filter(x => x.t === 'rede').concat(st.sfx.filter(g => !g.datei))) {
      if (dateien[it.key]) continue;
      const b = await blobVon(st, it); if (!b) { fehlt++; continue; }
      dateien[it.key] = it.key.replace(':', '-') + '.mp3'; zip.file(dateien[it.key], b);
    }
    if (!Object.keys(dateien).length) return info('Noch nichts erzeugt.');
    if (fehlt && !confirm(`Es fehlen noch ${fehlt} Teile. Nur das Fertige speichern? Das Abspielen endet dann vor dem ersten fehlenden Abschnitt.`)) return info('Abgebrochen.');
    zip.file('ablauf.json', JSON.stringify({folge: st.id, skript: st.f.datei, modell: st.modell, format: FORMAT, stimmen: st.stimmen, dateien, erzeugt: new Date().toISOString()}, null, 1));
    runter(await zip.generateAsync({type: 'blob'}), `kurs-${st.id}.zip`);
    info('ZIP gespeichert. Lade es auf GitHub in den Ordner import hoch und sag Claude Bescheid. Danach hört jeder die Folge ohne eigenen Schlüssel.');
  }
  /* Nur die Geräusche als ZIP (Nutzer, 24.10.2026: „Die lade ich dann herunter“). Hochgeladen in import/, legt tools/kurs-import.js
     sie nach podcast/geraeusche/ und trägt „datei“ in podcast/geraeusche.json ein; dann braucht niemand sie neu zu erzeugen. */
  async function sfxZip(st, info) {
    info('Lade das ZIP-Werkzeug …');
    if (!await loadZipLib()) return info('Das ZIP-Werkzeug ließ sich nicht laden. Bitte mit Internet erneut versuchen.');
    const zip = new JSZip(), liste = {};
    for (const g of st.sfx) { const b = await blobVon(st, g); if (b) { zip.file(g.id + '.mp3', b); liste[g.id] = {name: g.name, sekunden: g.sekunden, prompt: g.prompt}; } }
    if (!Object.keys(liste).length) return info('Noch keine Geräusche erzeugt.');
    zip.file('geraeusche.json', JSON.stringify({folge: st.id, modell: st.sfxModell, format: FORMAT, geraeusche: liste, erzeugt: new Date().toISOString()}, null, 1));
    runter(await zip.generateAsync({type: 'blob'}), `geraeusche-${st.id}.zip`);
    info(`${Object.keys(liste).length} Geräusche gespeichert. Sollen sie allen gehören: auf GitHub in den Ordner import hochladen und Claude Bescheid sagen.`);
  }

  /* ---------- Abspielen ---------- */
  let lauf = null;
  const cfgK = () => (S.cfg.kurs = S.cfg.kurs || {modus: 'interaktiv', tempo: 1, mitlesen: false, ticken: true});
  const sfxLaut = f => Math.max(0, Math.min(1, f * (S.cfg.sfx == null ? .7 : S.cfg.sfx)));
  /* Atmo des Reviers: erzeugtes Geräusch in Schleife, sonst die Geräusche der App. Gibt true zurück, wenn sie neu einsetzt. */
  let atmoA = null, atmoWert = null, atmoPegel = {};
  const ATMO_LAUT = .35, ATMO_LEISE = .14;
  async function atmo(st, wert) {
    if (atmoWert === wert) return false;
    const g = st && st.sfx.find(x => x.revier === wert), b = g && await blobVon(st, g);
    atmoAus(); atmoWert = wert;
    if (b) { const a = atmoA = new Audio(URL.createObjectURL(b)); a.loop = true; a.volume = sfxLaut(ATMO_LAUT); a.play().catch(() => {}); return true; }
    atmoPegel = ATMO[wert] || {}; ATMO_ALLE.forEach(n => AUD.loop(n, atmoPegel[n] || 0));
    return Object.values(atmoPegel).some(v => v > 0);
  }
  function atmoAus() { ATMO_ALLE.forEach(n => AUD.loop(n, 0)); atmoPegel = {}; atmoWert = null; if (atmoA) { atmoA.pause(); URL.revokeObjectURL(atmoA.src); atmoA = null; } }
  /* Unter der Sprache wird die Atmo leiser, in Pausen wieder lauter (Konzept §10.6: nie laut unter Erklärungen) */
  let blende = null;
  function duckAtmo(leise) {
    if (atmoA) {
      const a = atmoA, ziel = sfxLaut(leise ? ATMO_LEISE : ATMO_LAUT); clearInterval(blende);
      blende = setInterval(() => { const d = ziel - a.volume; if (Math.abs(d) < .02 || a !== atmoA) { a.volume = ziel; clearInterval(blende); } else a.volume += d / 3; }, 60);
    } else ATMO_ALLE.forEach(n => { if (atmoPegel[n]) AUD.loop(n, atmoPegel[n] * (leise ? .45 : 1)); });
  }
  async function geraeusch(st, it, me) {
    const b = await blobVon(st, it); if (!b) return;
    const a = new Audio(URL.createObjectURL(b)); a.volume = sfxLaut(.9); me.neben.push(a);
    const fertig = new Promise(res => { a.onended = res; a.onerror = res; a.play().catch(res); });
    if (!it.parallel) await fertig; else await warten(me, 1200);   /* parallel: das Gespräch setzt nach einem Moment ein */
  }
  function stop() { if (!lauf) return; lauf.aus = true; if (lauf.audio) { lauf.audio.pause(); lauf.audio = null; } lauf.neben.forEach(a => a.pause()); if (lauf.weiter) lauf.weiter(); atmoAus(); lauf = null; }
  const ui = sel => document.querySelector('#kursplayer ' + sel);
  async function warten(me, ms) { const ende = Date.now() + ms; while (!me.aus && Date.now() < ende) { await sleep(Math.min(200, ende - Date.now())); while (me.pause && !me.aus) await sleep(200); } }
  async function rede(st, it, me, vorBild) {
    const b = await blobVon(st, it); if (!b) return;
    const box = ui('#kspr');
    if (box) box.innerHTML = `<b>🎙️ ${it.wer.map(w => esc(NAMEN[w] || w)).join(', ')}</b>` + (cfgK().mitlesen ? it.zeilen.map(z => `<div class="small" style="margin-top:4px"><b>${esc(NAMEN[z.wer] || z.wer)}:</b> ${esc(z.text)}</div>`).join('') : '');
    const a = me.audio = new Audio(URL.createObjectURL(b));
    a.playbackRate = cfgK().tempo || 1; a.volume = Math.max(0, Math.min(1, S.cfg.voice == null ? 1 : S.cfg.voice));
    duckAtmo(true);
    /* B158: das Bild kommt etwa zwei Sekunden vor dem Ende des Satzes davor */
    if (vorBild) a.ontimeupdate = () => { if (a.duration && a.duration - a.currentTime <= 2 * (a.playbackRate || 1)) { a.ontimeupdate = null; bild(vorBild); me.bildDa = vorBild; } };
    await new Promise(res => { a.onended = res; a.onerror = res; me.weiter = res; a.play().catch(res); });
    me.weiter = null; if (me.audio === a) me.audio = null; URL.revokeObjectURL(a.src);
    if (!me.gleichWeiter) duckAtmo(false);   /* folgt direkt die nächste Sprache, bleibt die Atmo leise */
    await warten(me, 250);
  }
  async function denkpause(s, me, still) {
    if (!still) s = Math.max(DENK_MIN, s);   /* B152: Denkpausen immer mindestens sechs Sekunden */
    const box = ui('#kdenk');
    if (box && !still) box.innerHTML = `<div class="kdenk">🤔 Denkpause … ${s} s</div>`;
    if (!still && cfgK().ticken) AUD.ticks(s, .35);
    await warten(me, s * 1000);
    if (box) box.innerHTML = '';
  }
  /* Katalogfrage zu „sbf:21“ oder „bin:95“ */
  function frage(id) {
    const [k, n] = String(id).split(':'), liste = k === 'bin' ? (typeof BIN_DATA !== 'undefined' ? BIN_DATA : []) : (typeof DATA !== 'undefined' ? DATA : []);
    return liste.find(x => x.n === +n) || null;
  }
  function bild(id) {
    const q = frage(id), box = ui('#kbild');
    if (box && q && q.img && q.img.length) box.innerHTML = q.img.map(s => `<img src="${esc(s)}" alt="Katalogbild zu Frage ${q.n}" style="max-width:100%;max-height:200px;border-radius:10px;background:#fff">`).join('');
  }
  /* Auflösung der Vorab-Frage: den Tipp von vorhin unter dem Bild zeigen (Konzept §7.2, zählt nicht) */
  function tipp(it, me) {
    const t = me.tipps[it.id], box = ui('#kbild'); if (!t || !box) return;
    box.insertAdjacentHTML('beforeend', `<p class="small" style="margin:6px 0 0">Dein Tipp vorhin: <b>${esc(t.text)}</b> ${t.ok ? '✅ richtig getippt' : `· richtig ist: <b>${esc(t.richtig)}</b>`}</p>`);
  }
  /* Antwort zählt wie eine Quizantwort (Bible X8, P79), Basisfragen 1–72 auch im Binnen-Kurs */
  function zaehle(id, ok) {
    const [k, n] = String(id).split(':'), c = COURSE && COURSE.id;
    if (k === 'sbf' && (c === 'sbf' || (c === 'binnen' && +n <= 72))) { record(+n, ok); return true; }
    return false;
  }
  function wahl(st, it, me) {
    const box = ui('#kwahl'); if (!box) return Promise.resolve();
    /* [[WAHL: sbf:30]] ohne eigene Antworten: die vier amtlichen Antworten wie in der Prüfung, die erste ist richtig */
    const q = !it.opts.length && it.id ? frage(it.id) : null;
    const opts = (q ? q.a.map((text, i) => ({text, ok: !i})) : it.opts).slice().sort(() => Math.random() - .5);
    box.innerHTML = `<p class="small" style="margin:0 0 6px"><b>${it.vorab ? 'Tipp mal (zählt nicht):' : 'Deine Antwort:'}</b></p>` + opts.map((o, i) => `<button class="btn ghost kopt" data-o="${i}" style="display:block;width:100%;margin:4px 0;text-align:left">${esc(o.text)}</button>`).join('') + `<button class="btn small ghost" data-o="-1" style="margin-top:4px">Weiter ohne Antwort</button>`;
    box.scrollIntoView({behavior: 'smooth', block: 'center'});
    return new Promise(res => {
      me.weiter = res;
      box.querySelectorAll('[data-o]').forEach(b => b.onclick = async () => {
        const o = opts[+b.dataset.o]; me.weiter = null;
        box.querySelectorAll('button').forEach(x => x.disabled = true);
        if (!o) { box.innerHTML = ''; return res(); }
        if (it.vorab) {
          me.tipps[it.vorab] = {text: o.text, ok: o.ok, richtig: (it.opts.find(x => x.ok) || {}).text || ''};
          box.innerHTML = `<p class="small" style="margin:0">Dein Tipp: <b>${esc(o.text)}</b>. Die Auflösung kommt.</p>`; await warten(me, 1200); box.innerHTML = ''; return res();
        }
        AUD.sfx(o.ok ? 'richtig' : 'falsch', {vol: .8});
        if (!o.ok) me.falsch.add(it.id);
        const gezaehlt = it.id && zaehle(it.id, o.ok);
        b.style.background = o.ok ? 'var(--stb-soft)' : 'var(--bb-soft)';
        box.insertAdjacentHTML('beforeend', `<p class="small" style="margin:6px 0 0">${o.ok ? '✅ Richtig!' : '❌ Nicht ganz. Gleich kommt eine Erklärung.'}${gezaehlt ? ' <span class="muted">Zählt in deiner Statistik.</span>' : ''}</p>`);
        await warten(me, 1400); box.innerHTML = ''; res();
      });
    });
  }
  async function spiele(st, ab = 0) {
    stop();
    const me = lauf = {aus: false, pause: false, audio: null, weiter: null, falsch: new Set(), neben: [], tipps: {}, gleichWeiter: false, ende: null};
    AUD.unlock(); AUD.playMusic(null); zeigeSteuerung(st, true); { const i = ui('#kinfo'); if (i) i.textContent = ''; }
    /* Abschnitte, deren Sprache noch fehlt: Dort endet der Ausschnitt (Nutzer, 24.10.2026: lieber den Schluss weglassen als kürzen) */
    const fehltAb = new Set((await bestand(st)).offen.map(it => it.ab));
    /* Revier der Stelle, an der es losgeht */
    for (let k = ab; k >= 0; k--) if (st.items[k] && st.items[k].t === 'revier') { await atmo(st, st.items[k].wert); break; }
    const interaktiv = cfgK().modus === 'interaktiv';
    for (let k = ab; k < st.items.length && !me.aus; k++) {
      const it = st.items[k];
      if (it.bereich && it.bereich.art === 'vert' && !(interaktiv && me.falsch.has(it.bereich.id))) continue;
      while (me.pause && !me.aus) await sleep(200);
      if (me.aus) break;
      markiere(st, k);
      if (it.t === 'abschnitt') {
        if (fehltAb.has(it.ab)) { me.ende = it.titel; break; }
        const b = ui('#kbild'); if (b) b.innerHTML = ''; if (it.bereich && it.bereich.art === 'karte') atmoAus();
      }
      /* Neues Revier: erst einen Moment nur das Geräusch, dann der erste Satz (Konzept §7.2, §10.3) */
      else if (it.t === 'revier') { if (await atmo(st, it.wert)) await warten(me, 1500); }
      else if (it.t === 'rede') { const n = st.items[k + 1]; me.gleichWeiter = !!(n && n.t === 'rede'); await rede(st, it, me, n && n.t === 'bild' ? n.id : null); }
      else if (it.t === 'pause') await denkpause(it.s, me, it.still);
      else if (it.t === 'bild') { if (me.bildDa !== it.id) bild(it.id); me.bildDa = null; }
      else if (it.t === 'tipp') { if (interaktiv) tipp(it, me); }
      else if (it.t === 'ton' && it.gen) await geraeusch(st, it, me);
      else if (it.t === 'ton') { await AUD.sfx(it.name, {vol: .8, dur: TON_DAUER[it.name] || 3}); }
      else if (it.t === 'signal') { const b = ui('#kdenk'); if (b) b.innerHTML = `<div class="kdenk">📯 ${esc(it.muster)}</div>`; await AUD.horn(it.muster).done; if (b) b.innerHTML = ''; }
      else if (it.t === 'wahl' && interaktiv) { await wahl(st, it, me); if (st.items[k + 1] && st.items[k + 1].t === 'pause') k++; }
    }
    if (lauf === me) {
      atmoAus(); lauf = null; zeigeSteuerung(st, false); const s = ui('#kspr');
      if (s) s.innerHTML = me.aus ? '' : me.ende ? `<b>⚓ Hier endet der Ausschnitt.</b> Der Abschnitt „${esc(me.ende)}“ ist noch nicht erzeugt. Du kannst ihn unten bei „Erzeugen“ dazuholen.` : '<b>⚓ Ende der Probefolge.</b> Wie war’s? Sag Claude, was klingt und was nicht.';
      if (s && !me.aus && !me.ende) fragerundeKnopf(st, s);
    }
  }
  /* B157: am Ende alle Fragen der Folge als Multiple Choice, ohne Geschichte (vorgelesen, Zuruf wie im Quiz) */
  function folgenFragen(st) {
    const ns = [];
    st.items.forEach(it => [it.id, it.bereich && it.bereich.id].forEach(id => { const m = /^(?:sbf|bin):(\d+)$/.exec(id || ''); if (m && !ns.includes(+m[1])) ns.push(+m[1]); }));
    return ns.map(n => typeof QN !== 'undefined' && QN[n]).filter(q => q && q.kind !== 'open');
  }
  function fragerundeKnopf(st, s) {
    const qs = folgenFragen(st); if (!qs.length) return;
    s.insertAdjacentHTML('beforeend', `<p style="margin:10px 0 0"><button class="btn lamp wide" id="kfrr">📝 Fragerunde: ${qs.length} Frage${qs.length > 1 ? 'n' : ''} der Folge</button></p>`);
    const b = ui('#kfrr'); if (b) b.onclick = () => { stop(); runQuiz(qs, 'Fragerunde zur Folge', 'learn', {noRequeue: true}); };
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
      <div class="card" id="kbuehne"><p style="margin:0"><b>${esc(f.titel)}</b></p><p class="small muted" style="margin:2px 0 8px">${esc(f.unter)}<span id="kdauer"></span></p>
        <div id="kplay"></div><p class="status small" id="kinfo">Lade …</p>
        <div id="kspr" class="small"></div><div id="kdenk"></div><div id="kbild" style="text-align:center;margin-top:6px"></div><div id="kwahl" style="margin-top:6px"></div></div>
      <div class="card"><div class="kreihe"><button class="chip" data-mod="auto">🚗 Auto</button><button class="chip" data-mod="interaktiv">👆 Interaktiv</button></div>
        <p class="small muted" id="kmodtxt" style="margin:6px 0"></p>
        <div class="kreihe"><label class="small">Tempo <select id="ktem"><option value="0.9">langsam</option><option value="1">normal</option><option value="1.1">zügig</option></select></label>
          <label class="small"><input type="checkbox" id="kmit"> Mitlesen</label><label class="small"><input type="checkbox" id="ktick"> Ticken</label></div></div>
      <div class="card"><h3 style="margin-top:0">Abschnitte</h3><div id="kab"></div></div>
      <div class="card" id="ktech"><h3 style="margin-top:0">Erzeugen</h3><p class="small muted" id="kbest">…</p>
        <p class="small" style="margin:8px 0 4px"><b>Vor dem Start:</b> Kennt ElevenLabs alle Stimmen? Die Prüfung kostet nichts und läuft vor dem Erzeugen der Sprache auch von selbst.</p>
        <div class="kreihe"><button class="btn ghost small" id="kvoice">🔎 Stimmen prüfen</button><button class="btn ghost small" id="kcast">🎭 Stimmen-Casting</button></div>
        <div class="small" id="kvoiceinfo" style="margin-top:4px"></div>
        <h4 class="kh">1. Geräusche</h4><div id="ksfx"></div>
        <div class="kreihe"><button class="btn ki" id="kgensfx">🔊 Geräusche erzeugen</button><button class="btn ghost small" id="ksfxzip">⬇ Alle als ZIP</button></div>
        <h4 class="kh">2. Sprache, Abschnitt für Abschnitt</h4><p class="small muted" style="margin:0 0 4px">Du musst nicht alles auf einmal erzeugen. Das Abspielen endet vor dem ersten Abschnitt, der noch fehlt.</p><div id="kabgen"></div>
        <div class="kreihe"><button class="btn ki" id="kgen">🎙️ Alles Fehlende erzeugen</button></div>
        <h4 class="kh">3. Für alle bereitstellen</h4><p class="small muted" style="margin:0 0 4px">ZIP speichern und auf GitHub in den Ordner import hochladen. Danach hört jeder die Folge ohne eigenen Schlüssel.</p>
        <div class="kreihe"><button class="btn ghost small" id="kzip">📦 ZIP speichern</button></div><p class="status small" id="kginfo"></p></div></div>
      <style>.kdenk{font-size:1.1em;font-weight:700;margin-top:6px}#kursplayer [data-ab]{display:block;width:100%;text-align:left;margin:3px 0}#kursplayer .kreihe{display:flex;flex-wrap:wrap;gap:8px;align-items:center}#kursplayer .kreihe .chip{flex:0 0 auto}
        #kursplayer [data-ab][aria-pressed="true"] .muted{color:inherit;opacity:.85}#kursplayer .kh{margin:14px 0 4px}#kursplayer .krow{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid var(--line, rgba(0,0,0,.08))}#kursplayer .krow .btn{margin-left:4px}</style>`;
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
    const zahl = n => Math.round(n).toLocaleString('de-DE'), uhr = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
    const haupt = st.abschnitte.filter(a => !a.karte), gesamtSek = haupt.reduce((s, a) => s + a.sek, 0);
    $('#kdauer').textContent = ` · etwa ${Math.round(gesamtSek / 60)} Minuten`;
    let probeA = null;
    const probeAus = () => { if (probeA) { probeA.pause(); URL.revokeObjectURL(probeA.src); probeA = null; } };
    const neu = async () => {
      const b = await bestand(st), fehltAb = new Set(b.offen.map(it => it.ab));
      const sfxDa = await Promise.all(st.sfx.map(g => istDa(st, g)));
      /* Abschnitte zum Springen: nur die fertigen */
      $('#kab').innerHTML = st.items.map((it, i) => it.t !== 'abschnitt' ? '' : `<button class="chip" data-ab="${i}"${fehltAb.has(it.ab) ? ' disabled' : ''}>${esc(it.titel)} <span class="muted">· ${fehltAb.has(it.ab) ? 'noch nicht erzeugt' : uhr((st.abschnitte.find(a => a.nr === it.ab) || {}).sek || 0)}</span></button>`).join('');
      document.querySelectorAll('#kursplayer [data-ab]').forEach(x => x.onclick = () => { probeAus(); spiele(st, +x.dataset.ab); });
      /* 1. Geräusche: einzeln anhören und herunterladen */
      $('#ksfx').innerHTML = st.sfx.length ? st.sfx.map((g, i) => `<div class="krow"><span>${esc(g.name || g.id)} <span class="muted">· ${g.sekunden || 5} s${g.loop ? ', Schleife' : ''}${g.datei ? ', für alle' : ''}</span></span>
        <span>${sfxDa[i] ? `<button class="btn small ghost" data-sfxplay="${i}" aria-label="Anhören">▶</button><button class="btn small ghost" data-sfxdl="${i}" aria-label="Herunterladen">⬇</button>` : `<span class="small muted">fehlt · etwa ${zahl(sfxKosten(g))} Credits</span>`}</span></div>`).join('') : '<p class="small muted">Diese Folge braucht keine eigenen Geräusche.</p>';
      /* 2. Sprache je Abschnitt */
      let nr = 0;
      $('#kabgen').innerHTML = st.abschnitte.map(a => { const off = b.abOffen.get(a.nr);
        return `<div class="krow"><span>${a.karte ? '' : ++nr + '. '}${esc(a.titel)} <span class="muted">· ${uhr(a.sek)}</span></span>${off ? `<button class="btn small ki" data-gen="${a.nr}">🎙️ etwa ${zahl(off)} Credits</button>` : '<span>✅</span>'}</div>`; }).join('');
      const fehltWas = b.offen.length + b.offenSfx.length;
      const teile = [b.zeichen && `Sprache etwa ${zahl(b.zeichen)} Credits`, b.sfxCredits && `Geräusche etwa ${zahl(b.sfxCredits)} Credits`].filter(Boolean);
      $('#kbest').textContent = fehltWas
        ? `${b.da} von ${b.gesamt} Teilen sind fertig. Es fehlen: ${teile.join(', ')}${teile.length > 1 ? `, zusammen etwa ${zahl(b.zeichen + b.sfxCredits)}` : ''}.${st.fehlt.length ? ` Noch ohne Stimme: ${st.fehlt.map(w => NAMEN[w] || w).join(', ')}.` : ''}`
        : `Alle ${b.gesamt} Teile sind da${st.pub ? ' (für alle bereitgestellt)' : ' (auf diesem Handy)'}.`;
      $('#kgensfx').style.display = b.offenSfx.length ? '' : 'none'; $('#kgensfx').textContent = `🔊 Geräusche erzeugen (etwa ${zahl(b.sfxCredits)} Credits)`;
      $('#ksfxzip').style.display = sfxDa.some(Boolean) ? '' : 'none';
      $('#kgen').style.display = b.offen.length ? '' : 'none'; $('#kgen').textContent = `🎙️ Alles Fehlende erzeugen (etwa ${zahl(b.zeichen)} Credits)`;
      $('#kzip').style.display = !st.pub && b.offen.length < st.items.filter(it => it.t === 'rede').length ? '' : 'none';
      /* Abspielen geht, sobald der erste Abschnitt da ist */
      const erster = haupt[0];
      if (erster && !fehltAb.has(erster.nr)) { info(fehltAb.size ? 'Bereit. Das Abspielen endet vor dem ersten Abschnitt, der noch fehlt.' : 'Bereit.'); if (!lauf) zeigeSteuerung(st, false); }
      else { info(st.pub ? 'Für diese Fassung fehlen Teile.' : 'Noch nicht erzeugt. Unten bei „Erzeugen“: erst die Geräusche, dann die Sprache.'); $('#kplay').innerHTML = ''; }
    };
    await neu();
    const knoepfe = () => document.querySelectorAll('#ktech .ki');
    const los = async was => {
      probeAus(); knoepfe().forEach(x => x.disabled = true);
      try { await erzeugen(st, ginfo, was); } catch (e) { ginfo('Ging nicht: ' + (e.message || e.code || e)); }
      knoepfe().forEach(x => x.disabled = false); await neu();
    };
    $('#kgensfx').onclick = () => los({sfx: true});
    $('#kgen').onclick = () => los({});
    $('#kabgen').onclick = e => { const x = e.target.closest('[data-gen]'); if (x) los({ab: new Set([+x.dataset.gen])}); };
    $('#ksfx').onclick = async e => {
      const p = e.target.closest('[data-sfxplay]'), d = e.target.closest('[data-sfxdl]'); if (!p && !d) return;
      const g = st.sfx[+(p || d).dataset[p ? 'sfxplay' : 'sfxdl']], blob = await blobVon(st, g); if (!blob) return ginfo('Dieses Geräusch fehlt noch.');
      if (d) return runter(blob, g.id + '.mp3');
      const war = probeA && probeA.g === g; probeAus(); if (war) return;
      AUD.unlock(); probeA = new Audio(URL.createObjectURL(blob)); probeA.g = g; probeA.volume = sfxLaut(.9);
      probeA.onended = probeAus; probeA.play().catch(() => {});
    };
    $('#ksfxzip').onclick = () => sfxZip(st, ginfo).catch(e => ginfo('Ging nicht: ' + (e.message || e)));
    $('#kvoice').onclick = async () => {
      if (!elKey()) return ginfo('Dafür brauchst du deinen ElevenLabs-Schlüssel (Einstellungen → Schlüssel).');
      if (!(await kiEinwilligung())) return ginfo('Ohne Einwilligung geht das nicht.');
      ginfo('Prüfe die Stimmen …'); const pr = await stimmenPruefen(st, sprecher(st));
      $('#kvoiceinfo').innerHTML = stimmenHtml(pr);
      ginfo(pr.every(x => x.ok) ? 'Alle Stimmen gefunden. Es kann losgehen.' : 'Nicht alle Stimmen gefunden, siehe oben.');
    };
    $('#kvoiceinfo').onclick = async e => {
      const b = e.target.closest('[data-hol]'); if (!b) return; b.disabled = true; ginfo('Hole die Stimme ins Konto …');
      let fehler; try { fehler = await holen(st, b.dataset.hol); } catch (x) { fehler = 'Ging nicht: ' + (x.message || x.code || x); }
      if (fehler) { b.disabled = false; return ginfo(fehler); }
      /* Neue ID? Dann den Ablauf neu laden, damit die Sprachteile die richtige Stimme bekommen */
      try { st = await laden(id); await neu(); } catch (x) {}
      $('#kvoice').click();
    };
    $('#kzip').onclick = () => zipSpeichern(st, ginfo).catch(e => ginfo('Ging nicht: ' + (e.message || e)));
    $('#kcast').onclick = () => { stop(); probeAus(); if (typeof castingOeffnen === 'function') castingOeffnen(); else renderSettings(); };
    /* Wächter: Wer den Bildschirm verlässt (Zurück-Taste, anderer Reiter), beendet die Wiedergabe */
    const root = $('#kursplayer'), w = setInterval(() => { if (!document.body.contains(root)) { clearInterval(w); stop(); probeAus(); } }, 400);
  }

  if (typeof window !== 'undefined') window.KURS = {oeffnen, zerlege, stop};
  if (typeof module !== 'undefined') module.exports = {zerlege};
})();

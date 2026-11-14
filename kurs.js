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
  const FOLGEN = {probe: {datei: 'podcast/archiv/folgen/probe-G6-3.md', titel: 'Brücken und Schleusen', unter: 'Alte Probefolge des Kajütenfunks (G6.3), mit Quirin'},
    /* Hörreise (docs/reise.md §7): erste Folge, Entwurf (Nutzer, 07.11.2026); die Probefolge oben bleibt */
    'reise-1-1': {datei: 'podcast/folgen/reise-1-1.md', titel: 'Erster Morgen', unter: 'Hörreise, Tag 1, Folge 1 (Entwurf), mit Hinnerk, Smilla und Harms'},
    'reise-1-2': {datei: 'podcast/folgen/reise-1-2.md', titel: 'Gas, Sprit und Streichholz', unter: 'Hörreise, Tag 1, Folge 2 (Entwurf), mit der Hafenmeisterin', design: 'b'},
    /* Test vom 08.11.2026: die neun Formen fürs Wiedersehen (HR29), Nutzer will sie erst hören */
    'test-wiedersehen': {datei: 'podcast/skripte/test-wiedersehen.md', titel: 'Test: Wiedersehen in neun Formen', unter: 'W1 bis W9, je eine kurze Szene, am besten interaktiv'},
    'reise-1-3': {datei: 'podcast/folgen/reise-1-3.md', titel: 'Das Heck zieht weg', unter: 'Hörreise, Tag 1, Folge 3 (Entwurf), Radeffekt, Ruder, Sog'}};
  /* Design-Test (Nutzer, 08.11.2026): 1-2 im Entwurf B „Nachtbühne“, die Folge danach (1-3) im Entwurf A „Kajüte“; beide mit einem Knopf vertonen.
     1-1 hat keine Animation, darum 1-2 und 1-3 (dort sind Animationen und Fragen mit allen drei Lagen). */
  const TESTPAAR = ['reise-1-2', 'reise-1-3'];
  const AUSSEHEN = {a: '🪵 Kajüte', b: '🌙 Nacht', s: '▫️ Schlicht'};
  let aussehenAkt = 's', buehnenCrew = [];
  const FORMAT = 'mp3_44100_64';   /* 64 kbit/s (Konzept §17.3) */
  /* [[AUDIO: …]] im Skript → Geräusch der App; was fehlt, fehlt */
  const TOENE = {Schiffsglocke: 'glocke', 'Möwen': 'moewe', Katze: 'katze', Papagei: 'papagei', Motor: 'motorStart', Uhr: 'uhr', Schritte: 'schritte', Streichholz: 'streichholz', Klopfen: 'klopfen'};
  const TON_DAUER = {glocke: 1.2, schritte: 2};
  const DENK_MIN = 6;   /* B152 (Nutzer, 27.10.2026): im Auto-Modus immer sechs Sekunden */
  /* Revier → leise Dauer-Geräusche */
  const ATMO = {schleuse: {motorLauf: .22, wellen: .15}, nok: {motorLauf: .2, wellen: .15}, hafen: {wellen: .15}, frei: {wellen: .3, windLeise: .2},
    fahrwasser: {wellen: .3}, vtg: {wellen: .3}, fluss: {wellen: .25}, watt: {windLeise: .2}, binnensee: {windLeise: .15}, 'an Land': {}};
  const ATMO_ALLE = ['motorLauf', 'wellen', 'windLeise'];
  const NAMEN = {HINNERK: 'Hinnerk', SMILLA: 'Smilla', KLABAUTER: 'Klabauter', HARMS: 'Harms', QUIRIN: 'Quirin', HAFENMEISTER: 'Hafenmeisterin', POLIZEI: 'Polizei', FISCHER: 'Fischer', FUNK: 'Funk', ERZAEHLER: 'Erzähler', RANGERIN: 'Rangerin', JASPER: 'Jasper'};
  /* Gratis-Stimme zum Testen (Nutzer, 07.11.2026): Sprecher der Folge → Figur für die Handystimme (VOX.phoneVoiceOf, je Figur eine eigene) */
  const HANDY = {HINNERK: 'hinnerk', SMILLA: 'smilla', KLABAUTER: 'klabauter', HARMS: 'kroeger'};
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  /* Mimik (v5.50): [[GESICHT: laune]] (nur App) oder die Regie-Marke [[INTENTION: …]] bestimmt das Gesicht; sonst ein paar Wörter */
  /* v5.52: „erschrocken“ (große Augen) nur noch mit [[GESICHT: erschrocken]]; Alltägliches bekommt harmlosere Gesichter */
  const LAUNE_INT = {lachend: 'lacht', losprustend: 'lacht', humorvoll: 'grinst', verschmitzt: 'zwinkert', erleichtert: 'zufrieden', beruhigend: 'zufrieden', ausatmend: 'zufrieden',
    genervt: 'genervt', schnaubend: 'genervt', sarkastisch: 'skeptisch', trocken: 'skeptisch', seufzend: 'traurig', gähnend: 'nachdenklich',
    neugierig: 'nachdenklich', nachdenklich: 'nachdenklich', aufgeregt: 'staunt', 'überrascht': 'staunt', rufend: 'staunt', flüsternd: 'besorgt'};
  function launeAus(roh) {
    const g = roh.match(/\[\[\s*GESICHT\s*:\s*([^\]]*?)\s*\]\]/i); if (g) return g[1].trim().toLowerCase();
    const i = roh.match(/\[\[\s*INTENTION\s*:\s*([^\]]*?)\s*\]\]/i); if (i && LAUNE_INT[i[1].trim()]) return LAUNE_INT[i[1].trim()];
    return '';
  }
  function launeRaten(z) {
    if (z.laune) return z.laune;
    const t = z.text || '';
    if (/\b(Nicht!|Stopp|Oh nein|Hoppla)/i.test(t)) return 'staunt';
    if (/\b(Achtung|Vorsicht|Halt dich fest|Au\.|Eng hier|Langsam)/i.test(t)) return 'besorgt';
    if (/\b(Schiet|Pütz|Mist|hackt|Verdammt|Sakra)\b/i.test(t)) return 'genervt';
    if (/\b(Richtig|Genau|Gut gemacht|Siehste|Punkt für dich|Na also|Sehr gut|Kann's)\b/i.test(t)) return 'froh';
    if (/^(Hm|Hmm)\b/.test(t)) return 'nachdenklich';
    if (z.wer === 'HARMS') return 'skeptisch';
    return '';
  }
  const ohneCodes = s => s.replace(CODE, ' ').replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();

  /* Skript → Ablauf: [{t: 'abschnitt'|'revier'|'rede'|'pause'|'wahl'|'bild'|'signal'|'ton', …, bereich?}]
     Sprecherzeilen hintereinander werden zu einer Anfrage (höchstens max_zeichen), Regiecodes trennen. */
  /* Anrede nach Wahl (docs/reise.md HR24): {{anrede:w=…|m=…|n=…}} → die Variante aus S.profile.anrede (Standard neutral) */
  const anredeAuf = (txt, a) => String(txt).replace(/\{\{\s*anrede\s*:([^}]*)\}\}/g, (_, wert) => {
    const v = {}; wert.split('|').forEach(t => { const m = t.match(/^\s*([wmn])\s*=(.*)$/); if (m) v[m[1]] = m[2].trim(); });
    return v[a] || v.n || '';
  });
  function zerlege(txt, cfg, ger = {}) {
    txt = anredeAuf(txt, typeof anrede === 'function' ? anrede() : 'n');
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
      rede.inputs.push({text, voice_id: (f && f.voice_id) || null}); rede.zeilen.push({wer, text: ohneCodes(roh), laune: launeAus(roh), ...(/\[\[\s*SPRUCH\s*:\s*[a-z]+-harms-/.test(roh) ? {abgang: true} : {})});
      if (!rede.wer.includes(wer)) rede.wer.push(wer); rede.zeichen += text.length;
    };
    const steuer = (kat, wert) => {
      if (kat === 'ABSCHNITT') { bereich = null; dazu({t: 'abschnitt', titel: wert}); }
      else if (kat === 'SZENE') dazu({t: 'szene', text: wert});   /* v5.52: Ort der Szene für die Bühne (Kajüte, Deck, Fahrt) */
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
      /* Mini-Animation (HR19, v5.27): [[ANIM: gas]] zeigt sie, [[ANIM: gas, 2]] schaltet auf Phase 2 */
      else if (kat === 'ANIM') { const [aid, ph] = wert.split(',').map(x => x.trim()); dazu({t: 'anim', id: aid, p: +ph || 0}); }
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
    const [cfg, txt, pub, gd, plan, kiste] = await Promise.all([
      fetch('podcast/audio_config.json?v=' + Date.now()).then(r => { if (!r.ok) throw new Error(`Konfiguration fehlt (HTTP ${r.status})`); return r.json(); }),
      fetch(f.datei + '?v=' + Date.now()).then(r => { if (!r.ok) throw new Error(`Skript fehlt (HTTP ${r.status})`); return r.text(); }),
      /* Bereitgestellte Folgen stehen in audio/kurs/index.json; nur dann gibt es ablauf.json (spart eine 404 in der Konsole) */
      fetch('audio/kurs/index.json?v=' + Date.now()).then(r => r.ok ? r.json() : {}).then(x => x.folgen && x.folgen[id] ? fetch(`audio/kurs/${id}/ablauf.json?v=` + Date.now()).then(r => r.ok ? r.json() : null) : null).catch(() => null),
      fetch('podcast/geraeusche.json?v=' + Date.now()).then(r => r.ok ? r.json() : {}).catch(() => ({})),
      fetch('data/reiseplan.json').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('podcast/sprueche.json').then(r => r.ok ? r.json() : null).catch(() => null)]);
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
    const sprecherSet = new Set(items.filter(it => it.t === 'rede').flatMap(it => it.wer));
    const rueck = rueckBauen(kiste, cfg, modell, sprecherSet);
    return {id, f, cfg, items, fehlt, pub, modell, stimmen, sfx, sfxModell, abschnitte, anBord: anBordListe(id, plan, sprecherSet), rueck};
  }
  /* Wer ist an Bord? Laut Reiseplan (crew: ab, bis, zurueck), dazu immer Bordkatze Backbord (stumm). Ohne Plan: wer in der Folge spricht. */
  function anBordListe(id, plan, sprecherSet) {
    const fid = String(id).replace(/^reise-/, ''), n = x => { const [t, k] = String(x).split('-').map(Number); return t * 100 + k; };
    let crew;
    if (plan && plan.crew && /^\d+-\d+$/.test(fid)) crew = plan.crew.filter(c => (n(fid) >= n(c.ab) && (!c.bis || n(fid) <= n(c.bis))) || (c.zurueck && n(fid) >= n(c.zurueck))).map(c => c.wer.toUpperCase()).filter(w => w !== 'JASPER');
    else crew = ['HINNERK', 'SMILLA', 'KLABAUTER', 'QUIRIN'].filter(w => sprecherSet.has(w));
    if (!crew.length) crew = ['HINNERK', 'SMILLA'];
    return crew.concat('BACKBORD');
  }
  /* Kurze Rückmeldung nach deiner Antwort (Nutzer, 08.11.2026): Sätze aus der Sprüchekiste, mit derselben Stimme wie die Folge vertont */
  const RUECK_IDS = {HINNERK: {ok: ['hi-lob-02', 'hi-lob-05', 'hi-lob-06', 'hi-ja-05'], no: ['hi-nein-01', 'hi-nein-04', 'hi-tadel-02']},
    SMILLA: {ok: ['sm-anerkennen-01', 'sm-anerkennen-02', 'sm-anerkennen-03'], no: ['sm-trost-01', 'sm-trost-03', 'sm-trost-04', 'sm-trost-05']},
    KLABAUTER: {ok: ['kl-feiern-05', 'kl-feiern-06'], no: ['kl-petzen-05', 'kl-petzen-03']}, HARMS: {lage: ['richtig', 'falsch']}};
  function rueckBauen(kiste, cfg, modell, sprecherSet) {
    if (!kiste || !kiste.lagen) return [];
    const alle = {}; kiste.lagen.forEach(l => l.s.forEach(s => { alle[s.id] = s.t; }));
    const aus = [];
    for (const [w, spec] of Object.entries(RUECK_IDS)) {
      if (!sprecherSet.has(w)) continue;
      const f = cfg.figuren[w]; if (!f || !f.voice_id) continue;
      const pools = spec.lage ? spec.lage.map(name => (kiste.lagen.find(l => l.wer === 'kroeger' && l.lage === name) || {s: []}).s.filter(s => s.t.length > 4 && s.t.length < 40).map(s => s.t)) : [spec.ok.map(i => alle[i]), spec.no.map(i => alle[i])];
      pools.forEach((liste, j) => liste.filter(Boolean).forEach(roh => {
        const text = anredeAuf(roh, typeof anrede === 'function' ? anrede() : 'n');
        const it = {t: 'rede', rueck: true, ok: j === 0, inputs: [{text, voice_id: f.voice_id}], wer: [w], zeilen: [{wer: w, text, laune: j === 0 ? 'froh' : 'besorgt'}], zeichen: text.length};
        it.key = schluessel(modell, it); aus.push(it);
      }));
    }
    return aus;
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
    const reden = st.items.filter(it => it.t === 'rede').concat(st.rueck || []); let da = 0; const offen = [], offenSfx = [], abOffen = new Map();
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
  /* Ein Sprachteil über Text to Dialogue; Rückgabe '' oder der Fehler */
  async function teilErzeugen(st, it) {
    const body = {inputs: it.inputs, model_id: st.modell, language_code: 'de'};
    const url = `${EL_BASE}/v1/text-to-dialogue?output_format=${FORMAT}`, opt = () => ({method: 'POST', headers: {'xi-api-key': elKey(), 'content-type': 'application/json', accept: 'audio/mpeg'}, body: JSON.stringify(body)});
    let r = await fetchT(url, opt(), 120000);
    if (r.status === 400 || r.status === 422) { delete body.language_code; r = await fetchT(url, opt(), 120000); }   /* falls das Modell language_code nicht kennt */
    if (!r.ok) { const d = await errDetail(r); LOG.add('kurs', `HTTP ${r.status} ${d.status || ''} ${d.msg || ''}`); return `HTTP ${r.status} ${d.msg || d.status || ''}`; }
    await CLIPS.put(it.key, await r.blob(), {kind: 'kurs', t: it.zeilen.map(z => z.text).join(' ').slice(0, 80), at: Date.now()});
    return '';
  }
  async function geraeuschErzeugen(st, g) {
    const body = {text: g.prompt, duration_seconds: g.sekunden, prompt_influence: g.einfluss == null ? .3 : g.einfluss, model_id: st.sfxModell, ...(g.loop ? {loop: true} : {})};
    const url = `${EL_BASE}/v1/sound-generation?output_format=${FORMAT}`, opt = () => ({method: 'POST', headers: {'xi-api-key': elKey(), 'content-type': 'application/json', accept: 'audio/mpeg'}, body: JSON.stringify(body)});
    let r = await fetchT(url, opt(), 120000);
    if (r.status === 400 || r.status === 422) { delete body.model_id; delete body.loop; r = await fetchT(url, opt(), 120000); }   /* älteres Modell ohne loop */
    if (!r.ok) { const d = await errDetail(r); LOG.add('kurs', `Geräusch HTTP ${r.status} ${d.status || ''} ${d.msg || ''}`); return `HTTP ${r.status} ${d.msg || d.status || ''}`; }
    await CLIPS.put(g.key, await r.blob(), {kind: 'kurs', t: 'Geräusch ' + (g.name || g.id), at: Date.now()});
    return '';
  }
  /* Mehrere Folgen auf einmal vertonen (Nutzer, 08.11.2026: „beide mit einem Knopfdruck“): Geräusche und Sprache, was fehlt,
     Stimmen vorher kostenlos prüfen, die Kosten einmal bestätigen. Gleiche Teile (z. B. Atmo) nur einmal. */
  async function offenMehrere(ids) {
    const sts = []; for (const id of ids) { const st = await laden(id); st.id = id; sts.push(st); }
    const auftrag = [], gesehen = new Set(); let zeichen = 0, sfxCr = 0, teile = 0, ger = 0;
    for (const st of sts) {
      const b = await bestand(st);
      b.offenSfx.forEach(g => { if (gesehen.has(g.key)) return; gesehen.add(g.key); auftrag.push({st, g}); sfxCr += sfxKosten(g); ger++; });
      b.offen.forEach(it => { if (gesehen.has(it.key)) return; gesehen.add(it.key); auftrag.push({st, it}); zeichen += it.zeichen; teile++; });
    }
    return {sts, auftrag, zeichen, sfxCr, teile, ger};
  }
  async function vertoneMehrere(ids, info) {
    if (!elKey()) return info('Dafür brauchst du deinen ElevenLabs-Schlüssel (Einstellungen → Schlüssel).');
    if (!(await kiEinwilligung())) return info('Ohne Einwilligung wird nichts erzeugt.');
    info('Lade die Folgen …');
    const o = await offenMehrere(ids);
    if (!o.auftrag.length) return info('Beide Folgen sind schon vertont.');
    const wer = [...new Set(o.auftrag.filter(x => x.it).flatMap(x => x.it.wer))], cfgF = o.sts[0].cfg.figuren;
    const ohne = wer.filter(w => !(cfgF[w] && cfgF[w].voice_id));
    if (ohne.length) return info(`Noch keine Stimme für: ${ohne.map(w => NAMEN[w] || w).join(', ')}. Bitte erst im Stimmen-Casting zuordnen.`);
    if (wer.length) {
      info('Prüfe die Stimmen (kostet nichts) …');
      const pr = await stimmenPruefen(o.sts[0], wer), box = $('#kvoiceinfo'); if (box) box.innerHTML = stimmenHtml(pr);
      const nein = pr.filter(x => x.ok === false);
      if (nein.length) return info(`Stimme nicht gefunden: ${nein.map(x => NAMEN[x.w] || x.w).join(', ')}. Unten bei „Erzeugen“ die Stimme „holen“ und dann noch einmal. Es wurde nichts erzeugt.`);
      if (pr.some(x => x.ok === null) && !confirm('Die Stimmen ließen sich nicht prüfen. Trotzdem erzeugen?')) return info('Abgebrochen.');
    }
    const z = n => Math.round(n).toLocaleString('de-DE'), namen = o.sts.map(st => `„${st.f.titel}“`).join(' und ');
    if (!confirm(`${namen} vertonen:\n· Sprache: ${o.teile} Teile, etwa ${z(o.zeichen)} Credits\n· Geräusche: ${o.ger}, etwa ${z(o.sfxCr)} Credits\nZusammen etwa ${z(o.zeichen + o.sfxCr)} Credits. Das dauert einige Minuten, lass die App so lange offen. Weiter?`)) return info('Abgebrochen.');
    let wach = null; try { wach = await navigator.wakeLock.request('screen'); } catch (e) {}   /* Bildschirm bleibt an, wenn das Handy es erlaubt */
    try {
      for (const [k, x] of o.auftrag.entries()) {
        info(`Vertone ${k + 1} von ${o.auftrag.length} · ${x.st.f.titel}: ${x.g ? 'Geräusch ' + (x.g.name || x.g.id) : 'Sprache'} …`);
        const f = x.g ? await geraeuschErzeugen(x.st, x.g) : await teilErzeugen(x.st, x.it);
        if (f) return info(`Fehler bei ${k + 1} von ${o.auftrag.length}: ${f}. Alles Fertige bleibt gespeichert; noch einmal tippen macht beim Rest weiter.`);
      }
    } finally { try { wach && wach.release(); } catch (e) {} }
    info(`Fertig: ${namen} sind vertont. Viel Spaß beim Hören!`);
  }
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
      const f = await teilErzeugen(st, it); if (f) return info(`Fehler bei Teil ${k + 1}: ${f}. Fertige Teile bleiben gespeichert.`);
    }
    for (const [k, g] of sfx.entries()) {
      info(`Erzeuge Geräusch ${k + 1} von ${sfx.length}: ${g.name || g.id} …`);
      const f = await geraeuschErzeugen(st, g); if (f) return info(`Fehler beim Geräusch ${g.name || g.id}: ${f}. Fertige Teile bleiben gespeichert.`);
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
    for (const it of st.items.filter(x => x.t === 'rede').concat(st.rueck || [], st.sfx.filter(g => !g.datei))) {
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
  /* Telefon ohne erzeugtes Geräusch (Gratis-Stimme): zweimal klingeln mit dem Tongenerator des Handys */
  async function klingeln(me) {
    try {
      const C = window.AudioContext || window.webkitAudioContext, ac = new C(), g = ac.createGain(); g.connect(ac.destination); g.gain.value = 0;
      [440, 480].forEach(f => { const o = ac.createOscillator(); o.frequency.value = f; o.connect(g); o.start(); o.stop(ac.currentTime + 3.2); });
      const t = ac.currentTime; [[0, .9], [1.4, 2.3]].forEach(([a, b]) => { g.gain.setValueAtTime(.12 * sfxLaut(1), t + a); g.gain.setValueAtTime(0, t + b); });
      await warten(me, 3200); ac.close();
    } catch (e) {}
  }
  async function geraeusch(st, it, me) {
    const b = await blobVon(st, it); if (!b) { if (it.gen === 'telefon') await klingeln(me); return; }
    const a = new Audio(URL.createObjectURL(b)); a.volume = sfxLaut(.9); me.neben.push(a);
    const fertig = new Promise(res => { a.onended = res; a.onerror = res; a.play().catch(res); });
    if (!it.parallel) await fertig; else await warten(me, 1200);   /* parallel: das Gespräch setzt nach einem Moment ein */
  }
  function stop() { if (!lauf) return; lauf.aus = true; if (lauf.gratis && typeof VOX !== 'undefined') VOX.stop('Kajütenfunk'); if (lauf.audio) { lauf.audio.pause(); lauf.audio = null; } lauf.neben.forEach(a => a.pause()); if (lauf.weiter) lauf.weiter(); if (lauf.wahlRes) lauf.wahlRes(); zurufStop(); atmoAus(); lauf = null; wachHalten(false); try { navigator.mediaSession.playbackState = 'none'; } catch (e) {} }
  const ui = sel => document.querySelector('#kursplayer ' + sel);
  async function warten(me, ms, abbr) { const ende = Date.now() + ms; while (!me.aus && !(abbr && abbr()) && Date.now() < ende) { await sleep(Math.min(200, ende - Date.now())); while (me.pause && !me.aus) await sleep(200); } }
  /* Fehlt die echte Sprache, liest im Gratis-Modus die Handystimme Zeile für Zeile (nie ElevenLabs, kostet nichts) */
  async function redeGratis(it, me, vorBild) {
    const box = ui('#kspr'); duckAtmo(true);
    const ab = () => me.redeAbbruch;
    for (let i = 0; i < it.zeilen.length && !me.aus && !me.redeAbbruch; i++) {
      const z = it.zeilen[i]; if (!z.text) continue;
      while (me.pause && !me.aus) await sleep(200);
      if (me.aus) break;
      /* im Gratis-Modus immer mitlesen: so geht es auch, wenn die Handystimme stumm bleibt */
      if (box) zeigeZeile(z, true);
      if (vorBild && i === it.zeilen.length - 1) { bild(vorBild); me.bildDa = vorBild; }
      me.handy = true; const t0 = Date.now(); let ok = false;
      try { ok = await VOX.phoneTest(HANDY[z.wer] || String(z.wer).toLowerCase(), z.text); } catch (e) {} finally { me.handy = false; }
      /* stumm oder viel zu schnell fertig: Lesezeit abwarten statt durchzurasen, einmal Bescheid sagen */
      const lese = 1200 + z.text.length * 55, weg = Date.now() - t0;
      if ((!ok || weg < lese * .35) && !me.aus) await warten(me, Math.max(0, lese - weg), ab);
      await warten(me, 220, ab);
    }
    if (!me.gleichWeiter) duckAtmo(false);
    await warten(me, 250, ab);
  }
  /* Antwort getippt, während noch gesprochen wird: Stimme sofort aus (Nutzer, 08.11.2026: wer es weiß, soll nicht warten) */
  function unterbrich(me) {
    me.redeAbbruch = true;
    if (me.audio) { try { me.audio.pause(); } catch (e) {} }
    if (me.weiter) { const w = me.weiter; me.weiter = null; w(); }
    if (me.handy || me.gratis) { try { VOX.stop('Antwort getippt'); } catch (e) {} }
  }
  /* ---------- Bühne je Design (A Kajüte, B Nachtbühne, Schlicht) ---------- */
  const GES = {HINNERK: 'hinnerk', SMILLA: 'smilla', KLABAUTER: 'klabauter', HARMS: 'kroeger', HAFENMEISTER: 'hafen', JASPER: 'jasper', POLIZEI: 'polizei', BACKBORD: 'backbord'};
  NAMEN.BACKBORD = NAMEN.BACKBORD || 'Backbord'; NAMEN.SCHLEUSE = NAMEN.SCHLEUSE || 'Schleuse'; NAMEN.POLIZEI = NAMEN.POLIZEI || 'Polizei';
  /* ---------- Nachtbühne (Entwurf B, Nutzer 08.11.2026): alle an Bord als runde Gesichter auf dem Hintergrund, Gäste daneben ---------- */
  let letzteAbK = 0;
  let szeneArt = 'deck', szeneZeit = null, szeneWetter = null, folgeWetter = null;
  /* Ort aus [[SZENE]] (Nutzer 08.11.2026 gewählt: Kajüte C, Steg B, Fahrt C, Telefon C, Abend B, Besuch A, Schleuse A) */
  function szeneTyp(text) {
    const t = String(text || '').toLowerCase();
    const z = /früh|morgen/.test(t) ? 'morgen' : /vormittag|mittag/.test(t) ? 'tag' : /abend/.test(t) ? 'abend' : /nacht/.test(t) ? 'nacht' : null; if (z) szeneZeit = z;
    const wx = /sturm|böen|orkan/.test(t) ? 'sturm' : /regen|schauer|niesel/.test(t) ? 'regen' : /nebel|diesig/.test(t) ? 'nebel' : /frischer wind|kräftiger wind|windig/.test(t) ? 'windig' : /sonne|klar|wolkenlos/.test(t) ? 'schoen' : null; if (wx) szeneWetter = wx;
    if (/schleuse/.test(t)) return 'schleuse';
    if (/wasserschutz|polizei|längsseits kommt|kommt längsseits/.test(t)) return 'besuch';
    if (/telefon|sprachnachricht|ruft an/.test(t)) return 'telefon';
    if (/kajütdach|vor anker|ankerplatz|sterne|mond/.test(t)) return 'abend';
    if (/kartentisch|logbuch|in der kajüte|kajüte am|kajütentisch|koje/.test(t)) return 'tisch';
    if (/fährt|ausfahrt|fluss|fahrwasser|fähre|rückwärts|setzt aus|dreht sie|unterwegs|überholt|auf see|offenes wasser/.test(t)) return 'fahrt';
    if (/steg|tankstelle|zapf|liegeplatz|box|cockpit|hafen|deck|gaskasten|anker/.test(t)) return 'deck';
    return null;
  }
  const WELLE = (y0, n, c = '#7fb7cf', o = .35) => Array.from({length: n}, (_, i) => { const x = (i * 37) % 86 + 4, y = y0 + ((i * 23) % (100 - y0 - 4)); return `<path d="M${x} ${y} q3 -2 6 0 t6 0" stroke="${c}" stroke-width=".8" fill="none" opacity="${o}"/>`; }).join('');
  const STERNE = [[8, 8], [22, 14], [35, 5], [60, 9], [70, 22], [92, 6], [14, 26], [90, 34], [6, 44], [48, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="#f3e7c9" opacity=".7"/>`).join('');
  const BOOT_OBEN = (dx = 0) => `<g transform="translate(${dx} 0)"><path d="M50 9 C63 18 67 38 66 60 L65 88 Q50 92 35 88 L34 60 C33 38 37 18 50 9Z" fill="#e9dcc3" stroke="#6e4529" stroke-width="1.4"/><path d="M41 36 h18 v20 q0 3 -3 3 h-12 q-3 0 -3 -3z" fill="#f6eedd" stroke="#b9a37f" stroke-width=".8"/></g>`;
  /* Bullauge wie in der Kajüte der App: Himmel und See nach Tageszeit (aus der Szene, sonst echte Uhrzeit) und Wetter */
  function bullauge(cx, cy, r) {
    let p = {skyT: '#8fc3e3', skyB: '#d3e8f1', sea: '#3f86a6', seaD: '#2f6f8f', cloud: '#fff'}, wx = 'klar', day = szeneZeit;
    /* Wetter der Geschichte (Szene, sonst Folge), nicht das Wetter des Tages in der App */
    try { day = day || dayPart(); wx = szeneWetter || folgeWetter || weatherToday(); p = palette(day, wx); } catch (e) {}
    const regen = /regen|sturm/.test(wx) ? Array.from({length: 7}, (_, i) => `<path d="M${cx - r + 2 + i * r / 3.4} ${cy - r} l-2 ${r * 2}" stroke="#cfe2ea" stroke-width=".5" opacity=".7"/>`).join('') : '';
    const nebel = /nebel/.test(wx) ? `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="#dfe6ea" opacity=".55"/>` : '';
    const sterne = day === 'nacht' ? `<circle cx="${cx - r / 3}" cy="${cy - r / 2}" r=".5" fill="#fff"/><circle cx="${cx + r / 3}" cy="${cy - r / 3}" r=".5" fill="#fff"/>` : `<ellipse cx="${cx - r / 3}" cy="${cy - r / 2.4}" rx="${r / 2.6}" ry="${r / 6}" fill="${p.cloud}" opacity=".8"/>`;
    return `<defs><clipPath id="kbull"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs><g clip-path="url(#kbull)"><rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${r * 1.1}" fill="${p.skyT}"/><rect x="${cx - r}" y="${cy - r * .1}" width="${2 * r}" height="${r * .3}" fill="${p.skyB}"/><rect x="${cx - r}" y="${cy + r * .15}" width="${2 * r}" height="${r}" fill="${p.sea}"/><path d="M${cx - r} ${cy + r * .4} q${r / 4} -1.5 ${r / 2} 0 t${r / 2} 0 t${r / 2} 0 t${r / 2} 0" stroke="${p.seaD}" stroke-width=".8" fill="none"/>${sterne}${regen}${nebel}</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#c9a46a" stroke-width="2.2"/><circle cx="${cx}" cy="${cy}" r="${r + 1.6}" fill="none" stroke="#8a6a3e" stroke-width=".8"/>`;
  }
  const BECHER = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-2" y="-3" width="4" height="4.4" rx=".8" fill="#f3e7c9"/><path d="M2 -2 q2 0 2 1.5 t-2 1.4" stroke="#f3e7c9" stroke-width=".7" fill="none"/><path d="M-.8 -4.5 q-1 -1.5 0 -3 M.9 -4.5 q1 -1.5 0 -3" stroke="#f3e7c9" stroke-width=".4" fill="none" opacity=".5"/></g>`;
  /* v5.55 (Nutzer 08.11.2026): Die Bühne ist ein festes Quadrat (0–100), der Hintergrund reicht weit darüber hinaus und wird am Rand abgeschnitten (randlos).
     Das Boot ist überall dasselbe wie in den Animationen (boot.js). Wasser wird nach dem Boot halb durchsichtig darübergelegt. */
  const W0 = -150, WB = 400;   /* Hintergrund von x −150 bis 250 */
  const SEEB = (y, c = '#1d4a63') => `<rect x="${W0}" y="${y}" width="${WB}" height="${260 - y}" fill="${c}"/>`;
  const WELLEB = (y0, c = '#7fb7cf', o = .35) => `<g class="kwel">${Array.from({length: 30}, (_, i) => { const x = W0 + (i * 53) % WB, y = y0 + 2 + ((i * 29) % 30); return `<path d="M${x} ${y} q3 -2 6 0 t6 0" stroke="${c}" stroke-width=".8" fill="none" opacity="${o}"/>`; }).join('')}</g>`;
  const UEBER = y => `<rect x="${W0}" y="${y}" width="${WB}" height="${260 - y}" fill="#1d4a63" opacity=".55"/>`;
  /* v5.56: Drehpunkt des Schaukelns je Ort (Wasserlinie in der Bootsmitte); die Crew an Bord schaukelt um denselben Punkt mit (Nutzer 09.11.2026) */
  const SCHAUKEL = {deck: [61, 66], fahrt: [50, 64], abend: [48, 74], tisch: [55, 70]};
  /* v5.59 (Nutzer 10.11.2026, Entwurf „Crew an Bord“): An Deck und in Fahrt steht die Crew mit ganzem Körper im Boot, klein und ganz innerhalb des Rumpfs
     (Beine verdeckt die Bordwand, was hinter Bug oder Heck herausragen würde, schneidet der Clip ab). Sie ist Teil der Bootszeichnung und schaukelt darum sicher mit.
     In der Kajüte sieht man das Boot von außen, die Crew schaut aus den Bullaugen; unten ein Balken mit den Gesichtern zeigt, wer spricht.
     Plätze: [x, Füße bei y, Höhe] in Bühnen-Einheiten; dach = Höhe des Kajütdachs (Klabauter und Backbord sitzen oben). */
  const ANBORD = {
    deck: {clip: 'M-150 -150 H250 V55.6 H93 V95 H30 V55.6 H-150Z', helm: [38, 60.5, 25], vorn: [81, 60, 24], dritt: [31.5, 61, 22], dach: 43.8, klab: 63.5, katze: 51},
    fahrt: {clip: 'M-150 -150 H250 V52.3 H86 V95 H14 V52.3 H-150Z', helm: [79, 57, 27], vorn: [24, 57, 26], dritt: [72, 57.5, 24], dach: 39, klab: 47.5, katze: 60}};
  let ANB = {hinten: '', oben: '', luken: ''}, kanbId = 0;
  const imSvg = (w, x, y, wd, ht, extra = '') => charSVG(GES[w]).replace(/^<svg class="ch\s*"/, `<svg class="ch" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${wd.toFixed(1)}" height="${ht.toFixed(1)}"${extra}`);
  const koerperSvg = (w, [x, fuss, h]) => GES[w] && typeof charSVG === 'function' ? `<g class="kpl kb" data-w="${w}"><g class="kk" data-w="${w}">${imSvg(w, x - h * .34, fuss - h, h * 100 / 147, h)}</g></g>` : '';
  const lukeSvg = (w, cx, cy, r) => { if (!GES[w] || typeof charSVG !== 'function') return ''; const id = 'kluk' + (kanbId++);
    return `<g class="kpl kl" data-w="${w}"><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><circle cx="${cx}" cy="${cy}" r="${r}" fill="#cfe2ea"/><g clip-path="url(#${id})"><g class="kk" data-w="${w}">${imSvg(w, cx - r, cy - r, 2 * r, 2 * r, ' preserveAspectRatio="xMidYMid slice"').replace(/viewBox="[^"]*"/, 'viewBox="24 18 52 52"')}</g></g><circle class="klr" cx="${cx}" cy="${cy}" r="${r + .3}" fill="none"/></g>`; };
  function anBordSvg(art, crew) {
    ANB = {hinten: '', oben: '', luken: ''};
    const leute = crew.filter(w => w !== 'BACKBORD' && w !== 'KLABAUTER');
    if (art === 'tisch') { const ws = leute.concat(crew.filter(w => w === 'KLABAUTER' || w === 'BACKBORD')).slice(0, 3); ANB.luken = ws.map((w, i) => lukeSvg(w, 55 + .55 * [-34, -18, -2][i], 48.55, 2.25)).join(''); return; }
    const a = ANBORD[art]; if (!a) return;
    const helm = leute.includes('HINNERK') ? 'HINNERK' : leute[0], rest = leute.filter(w => w !== helm), id = 'kanb' + (kanbId++);
    const reihe = [rest[1] && [rest[1], a.dritt], helm && [helm, a.helm], rest[0] && [rest[0], a.vorn]].filter(Boolean);
    ANB.hinten = `<clipPath id="${id}"><path d="${a.clip}"/></clipPath><g clip-path="url(#${id})">${reihe.map(([w, pl]) => koerperSvg(w, pl)).join('')}</g>`;
    ANB.oben = (crew.includes('KLABAUTER') ? koerperSvg('KLABAUTER', [a.klab, a.dach + 1.1, 11]) : '') + (crew.includes('BACKBORD') ? koerperSvg('BACKBORD', [a.katze, a.dach + .6, 10]) : '');
  }
  const SCHAUKELG = (art, inhalt) => { const d = SCHAUKEL[art]; return `<g class="kschaukel" style="transform-origin:${d[0] + 75}px ${d[1] + 75}px">${inhalt}</g>`; };
  const SEITE = (x, y, k, o = {}) => window.BOOT ? `<g transform="translate(${x} ${y}) scale(${k})">${BOOT.seite(o)}</g>` : '';
  const OBEN = (x, y, k, o = {}) => window.BOOT ? `<g transform="translate(${x} ${y}) scale(${k})">${BOOT.oben(o)}</g>` : BOOT_OBEN(x - 50);
  const ZAPFSAEULE = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-4" y="-17" width="8" height="17" rx="1.4" fill="#c0392b" stroke="#7a2318" stroke-width=".5"/><rect x="-2.8" y="-14.5" width="5.6" height="4" rx=".6" fill="#f3e7c9"/><rect x="-2.8" y="-8.5" width="5.6" height="1.6" fill="#7a2318"/><rect x="-4.6" y="-19" width="9.2" height="2.4" rx="1" fill="#e9dcc3"/><path d="M4 -10 q6 1 7 7 q1 5 7 5" stroke="#1d1d1d" stroke-width=".9" fill="none"/><text x="0" y="-11.3" font-size="2.4" text-anchor="middle" fill="#7a2318" font-weight="700">SUPER</text></g>`;
  const SZ_BG = {
    /* v5.59: Kajüte = das Boot von außen, die Crew in den Bullaugen (Nutzer 10.11.2026); vor Anker ohne Steg. Die alte Tisch-Ansicht bleibt als tischAlt */
    tisch: (pr) => SEEB(62) + WELLEB(64) + (pr.anker ? '' : `<rect x="${W0}" y="48" width="${WB}" height="7" fill="#7a4e2e"/><rect x="${W0}" y="55" width="${WB}" height="2" fill="#4a2e19"/>` + Array.from({length: 26}, (_, i) => W0 + 6 + i * 16).map(x => `<path d="M${x} 48V55" stroke="#5c3a21" stroke-width=".5"/><rect x="${x - 1.4}" y="55" width="2.8" height="10" fill="#4a2e19"/>`).join('') + `<path d="M26 64 Q22 56 20 48" stroke="#c9b48a" stroke-width=".8" fill="none"/>`)
      + SCHAUKELG('tisch', SEITE(55, 70, .55) + ANB.luken) + UEBER(70),
    tischAlt: () => `<rect x="${W0}" y="-150" width="${WB}" height="186" fill="#3b2617"/>` + [9, 18, 27, 0, -9, -18].map(y => `<path d="M${W0} ${y}H250" stroke="#2c1c11" stroke-width=".6"/>`).join('') + `<path d="M${W0} 36H250" stroke="#5a3820" stroke-width="1.4"/>`
      + bullauge(82, 17, 9) + `<defs><radialGradient id="klk"><stop offset="0" stop-color="#e8a33c" stop-opacity=".30"/><stop offset="1" stop-color="#e8a33c" stop-opacity="0"/></radialGradient></defs><circle cx="50" cy="62" r="52" fill="url(#klk)"/>`
      + `<path d="M50 -150 V10" stroke="#c9a46a" stroke-width=".7"/><rect x="47" y="10" width="6" height="7" rx="1.6" fill="#e8a33c"/><circle class="klicht" cx="50" cy="14" r="6" fill="#e8a33c" opacity=".2"/>`
      + `<ellipse cx="50" cy="64" rx="25" ry="10.5" fill="#4a2e19"/><ellipse cx="50" cy="62" rx="25" ry="10" fill="#8a5a36"/><ellipse cx="50" cy="62" rx="21" ry="7.6" fill="none" stroke="#a87249" stroke-width=".5" opacity=".7"/>`
      + BECHER(42, 61) + BECHER(57, 63) + `<g transform="translate(50 58)"><rect x="-2.6" y="-4.5" width="5.2" height="6.5" rx="1.2" fill="#2b3a4a"/><path d="M-2.6 -3 h-1.6 v2" stroke="#2b3a4a" stroke-width=".8" fill="none"/></g>`,
    telefon: () => `<defs><radialGradient id="ktl"><stop offset="0" stop-color="#e8a33c" stop-opacity=".16"/><stop offset="1" stop-color="#e8a33c" stop-opacity="0"/></radialGradient></defs><circle cx="50" cy="34" r="44" fill="url(#ktl)"/>`
      + `<path d="M22 18 q-6 14 0 28 M78 18 q6 14 0 28 M15 12 q-9 20 0 40 M85 12 q9 20 0 40" stroke="#e8a33c" stroke-width="1" fill="none" opacity=".45"/><rect x="${W0}" y="84" width="${WB}" height="8" fill="#5a3820" opacity=".8"/><rect x="47" y="85.5" width="6" height="4" rx="1" fill="#2b3a4a"/>`,
    deck: (pr) => SEEB(62) + WELLEB(64)
      + `<rect x="${W0}" y="48" width="${WB}" height="7" fill="#7a4e2e"/><rect x="${W0}" y="55" width="${WB}" height="2" fill="#4a2e19"/>` + Array.from({length: 26}, (_, i) => W0 + 6 + i * 16).map(x => `<path d="M${x} 48V55" stroke="#5c3a21" stroke-width=".5"/><rect x="${x - 1.4}" y="55" width="2.8" height="10" fill="#4a2e19"/>`).join('')
      + (pr.zapf ? ZAPFSAEULE(6, 49) : '') + `<circle cx="22" cy="48" r="1.7" fill="#2b1a0e"/><circle cx="96" cy="48" r="1.7" fill="#2b1a0e"/><path d="M28 61 Q24 56 22 48 M90 61 Q95 55 96 48" stroke="#c9b48a" stroke-width=".8" fill="none"/>`
      + SCHAUKELG('deck', ANB.hinten + SEITE(61, 66, .4) + ANB.oben) + UEBER(66),
    fahrt: () => SEEB(62) + WELLEB(64) + `<path d="M93 64 q-4 3 -8 0 t-8 0 M98 68 q-4 2 -8 0 M104 64 q-4 2 -8 0" stroke="#7fb7cf" stroke-width="1" fill="none" opacity=".7"/>`
      + SCHAUKELG('fahrt', ANB.hinten + SEITE(50, 64, .45, {bugLinks: true}) + ANB.oben) + UEBER(64),
    abend: () => `<rect x="${W0}" y="-150" width="${WB}" height="420" fill="#0c1d2a"/>` + STERNE + `<circle cx="-30" cy="10" r=".7" fill="#f3e7c9"/><circle cx="130" cy="20" r=".7" fill="#f3e7c9"/><circle cx="80" cy="18" r="7" fill="#f3e7c9" opacity=".85"/><circle cx="83" cy="16" r="6" fill="#0c1d2a"/>`
      + SEEB(72, '#132e40') + WELLEB(74, '#7fb7cf', .25) + `<path d="M76 80 h8 M74 86 h12 M77 92 h6" stroke="#f3e7c9" stroke-width="1" opacity=".35"/>`
      + SCHAUKELG('abend', SEITE(48, 74, .45, {farbe: {rumpf: '#cdbd9c', deck: '#bfae8e', dach: '#9aa3a8'}})) + `<path d="M62 74 Q82 82 96 96" stroke="#9aa7b1" stroke-width=".8" fill="none" stroke-dasharray="1.5 1"/>` + UEBER(74).replace('#1d4a63', '#132e40'),
    besuch: () => SEEB(-150) + WELLEB(-60) + WELLEB(0) + WELLEB(40) + `<g transform="rotate(0)">${OBEN(38, 52, .8)}</g>`
      + `<path d="M80 14 C90 22 92 40 91 60 L90 86 Q80 90 70 86 L69 60 C68 40 70 22 80 14Z" fill="#c9d6e0" stroke="#2b4a66" stroke-width="1.4"/><circle cx="80" cy="36" r="3" fill="#3d7bd9"/><circle class="kblau" cx="80" cy="36" r="8" fill="#3d7bd9" opacity=".25"/><path d="M56 40 L69 42 M56 70 L69 70" stroke="#c9b48a" stroke-width=".8"/>`,
    schleuse: () => `<rect x="${W0}" y="-150" width="166" height="400" fill="#8f949c"/><rect x="84" y="-150" width="166" height="400" fill="#8f949c"/><rect x="16" y="-150" width="68" height="400" fill="#1d4a63"/>` + OBEN(50, 52, .8) + `<path d="M16 30 L34 34 M84 74 L66 78" stroke="#c9b48a" stroke-width=".9"/><rect x="16" y="2" width="68" height="4" fill="#5e636b"/>`};
  /* Plätze in Prozent je Ort; gr = Größe in Prozent der Bühne. Klabauter nur wenig größer als Backbord (Nutzer 08.11.2026) */
  const GROESSE = {BACKBORD: .64, KLABAUTER: .72};
  function anordnen(art, crew) {
    const katze = crew.includes('BACKBORD'), leute = crew.filter(w => w !== 'BACKBORD'), n = leute.length, pl = [];
    const reihe = (ws, x0, x1, y, gr) => ws.forEach((w, i) => pl.push({w, x: ws.length === 1 ? (x0 + x1) / 2 : x0 + (x1 - x0) * i / (ws.length - 1), y, gr}));
    if (art === 'tisch') {
      const alle = crew.slice(), m = alle.length, start = -90 + (m % 2 ? 0 : 180 / m), gr0 = m <= 3 ? 25 : m === 4 ? 24 : 21;
      alle.forEach((w, i) => { const a = (start + i * 360 / m) * Math.PI / 180, x = 50 + Math.cos(a) * 37, y = 60 + Math.sin(a) * 23; pl.push({w, x, y, gr: gr0 * (.82 + .18 * (y - 37) / 46)}); });
    } else if (art === 'telefon') reihe(crew, crew.length > 3 ? 14 : 22, crew.length > 3 ? 86 : 78, 76, crew.length > 3 ? 18 : 22);
    else if (art === 'deck') { reihe(leute, n > 2 ? 38 : 44, n > 2 ? 76 : 70, 50, 18); if (katze) pl.push({w: 'BACKBORD', x: 88, y: 56, gr: 18}); }
    else if (art === 'fahrt') {
      const helm = leute.includes('HINNERK') ? 'HINNERK' : leute[0], rest = leute.filter(w => w !== helm);
      if (helm) pl.push({w: helm, x: 80, y: 44, gr: 21}); reihe(rest, 34, rest.length > 2 ? 64 : 58, 42, 19); if (katze) pl.push({w: 'BACKBORD', x: 18, y: 50, gr: 19});
    }
    else if (art === 'abend') { reihe(leute, 32, 66, 44, 18); if (katze) pl.push({w: 'BACKBORD', x: 80, y: 58, gr: 18}); }
    else { const x = art === 'besuch' ? 38 : 50, ws = (katze ? ['BACKBORD'] : []).concat(leute); const zz = ws.length > 3; ws.forEach((w, i) => pl.push({w, x: zz ? x + (i % 2 ? 7 : -7) : x, y: ws.length === 1 ? 52 : 22 + 56 * i / (ws.length - 1), gr: zz ? 18 : 20})); }
    pl.forEach(p => { p.gr *= GROESSE[p.w] || 1; });
    return pl.sort((a, b) => a.y - b.y);
  }
  /* Gäste stehen mit ganzem Körper da (Nutzer 08.11.2026), die Crew bleibt als Gesicht: [x, Füße bei y, Höhe] */
  const SZ_GAST = {tisch: [15, 52, 32], telefon: [50, 32, 36], deck: [17, 52, 34], fahrt: [88, 72, 26], abend: [12, 72, 26], besuch: [80, 66, 34], schleuse: [91, 40, 30]};
  let szeneProps = {};
  /* v5.56 (Nutzer 09.11.2026): Ruft Harms an, verabschiedet sich die Crew (Sprüche der Lage „harms“) und geht aus dem Bild; Harms prüft allein */
  let weg = new Set(), letzteZeile = null;
  function abgangPruefen(z) {
    const l = letzteZeile; letzteZeile = z || null; if (!l || !l.abgang || l === z || weg.has(l.wer)) return;
    const box = ui('#kges'), el = box && box.querySelector(`.kpl[data-w="${l.wer}"]`);
    const fertig = () => { weg.add(l.wer); if (buehnenCrew.filter(w => CREWW.includes(w)).every(w => weg.has(w))) weg.add('BACKBORD'); if (box && aussehenAkt === 'b') { box.dataset.art = ''; buehneB(box, z ? z.wer : null, null); } };
    if (el) { el.classList.add('geht'); setTimeout(fertig, 1100); } else fertig();
  }
  const wegReset = () => { weg = new Set(); letzteZeile = null; };
  function buehneB(box, aktiv, laune) {
    let gast = box.dataset.gast || '';
    if (aktiv && !buehnenCrew.includes(aktiv) && !OHNE_GESICHT.includes(aktiv)) gast = aktiv;
    /* Harms ist nie an Bord: spricht er, ist es das Telefon */
    const art = gast === 'HARMS' || szeneArt === 'telefon' ? 'telefon' : szeneArt;
    if (art === 'telefon' && !gast) gast = 'HARMS';
    const wx = szeneWetter || folgeWetter || 'schoen', pk = JSON.stringify(szeneProps) + wx;
    if (box.dataset.art !== art || box.dataset.gast !== gast || box.dataset.pr !== pk || !box.children.length) {
      box.dataset.art = art; box.dataset.gast = gast; box.dataset.pr = pk;
      /* Namen nur bei Gästen; die feste Crew kennt man (Nutzer 09.11.2026) */
      const name = w => FESTE_CREW.includes(w) ? '' : `<span class="kn">${esc(NAMEN[w] || w)}${w === 'HARMS' ? ' 📞' : ''}</span>`;
      const pl = (w, x, y, gr, k) => `<div class="kpl${k ? ' ' + k : ''}" data-w="${esc(w)}" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;width:${gr.toFixed(1)}%">${gesicht(w)}${name(w)}</div>`;
      const koerper = (w, x, fuss, h) => GES[w] && typeof charSVG === 'function' && w !== 'HARMS'
        ? `<div class="kpl gast koerper${w === 'POLIZEI' ? ' polizei' : ''}" data-w="${esc(w)}" style="left:${x}%;top:${fuss}%;width:${(h * 100 / 147).toFixed(1)}%"><div class="kk" data-w="${esc(w)}">${charSVG(GES[w])}</div>${name(w)}</div>`
        : pl(w, x, art === 'telefon' ? fuss : fuss - h / 3, art === 'telefon' ? h : 18, 'gast');
      const g = SZ_GAST[art] || [86, 86, 26];
      box.dataset.wx = wx;
      /* Wetter: Regen fällt über die Bühne, bei Wind und Sturm schaukelt das Boot stärker (CSS über data-wx) */
      const regen = /regen|sturm/.test(wx) && art !== 'tisch' && art !== 'telefon' ? `<g class="kregen">${Array.from({length: 60}, (_, i) => `<path d="M${-150 + (i * 37) % 400} ${-150 + (i * 53) % 400} l-2 7" stroke="#cfe2ea" stroke-width=".5" opacity=".5"/>`).join('')}</g>` : '';
      const nebel = wx === 'nebel' && art !== 'tisch' && art !== 'telefon' ? `<rect x="-150" y="-150" width="400" height="400" fill="#c9d3d9" opacity=".35"/>` : '';
      const crew = buehnenCrew.filter(w => !weg.has(w)), mitKoerper = !!ANBORD[art] || art === 'tisch';
      anBordSvg(art, crew);
      /* Mit Körpern an Bord: die Gesichter als HTML nur für die Animation (klein unten rechts, wer spricht); in der Kajüte als Balken unten */
      const html = art === 'tisch' ? '<div class="kbalken"></div>' + crew.map((w, i) => pl(w, 50 + (i - (crew.length - 1) / 2) * 17, 91.5, 14 * (GROESSE[w] || 1), 'balk' + (w === 'BACKBORD' ? ' katze' : ''))).join('')
        : mitKoerper ? crew.map(w => pl(w, 50, 50, 10, 'nurbild')).join('')
        : (SCHAUKEL[art] ? `<div class="kbord" style="transform-origin:${SCHAUKEL[art][0]}% ${SCHAUKEL[art][1]}%">` : '') + anordnen(art, crew).map(p => pl(p.w, p.x, p.y, p.gr, p.w === 'BACKBORD' ? 'katze' : '')).join('') + (SCHAUKEL[art] ? '</div>' : '');
      box.innerHTML = `<svg class="kbg" viewBox="-75 -75 250 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${(SZ_BG[art] || SZ_BG.deck)(szeneProps)}${nebel}${regen}</svg>`
        + html
        + (gast ? koerper(gast, g[0], g[1], g[2]) : '');
    }
    /* Klasse „ksp“ = spricht gerade. Nicht „an“: anim.js setzt global .an{height:100%} (v5.58: daher sprang der Sprecher nach oben, sobald in der Folge eine Animation lief) */
    box.querySelectorAll('.kpl').forEach(p => { const an = p.dataset.w === aktiv; p.classList.toggle('ksp', an); p.querySelector('svg')?.classList.toggle('talking', an && !!lauf); });
    launeSetzen(box, aktiv, laune);
  }
  function szeneSetzen(text) {
    const a = szeneTyp(text); if (!a) return;
    const t = String(text || '').toLowerCase(), neu = a === szeneArt ? {...szeneProps} : {};
    if (/tankstelle|zapf/.test(t)) neu.zapf = true;
    if (/vor anker|ankerbucht|bucht|reede|schilfwinkel/.test(t)) neu.anker = true;
    if (a === szeneArt && JSON.stringify(neu) === JSON.stringify(szeneProps)) return;
    const wechsel = a !== szeneArt; szeneArt = a; szeneProps = neu; const g = ui('#kges'); if (g && aussehenAkt === 'b') { g.dataset.art = ''; if (wechsel) g.dataset.gast = ''; buehneB(g, null, null); }
  }

  const CREWW = ['HINNERK', 'SMILLA', 'KLABAUTER'], FESTE_CREW = CREWW.concat('BACKBORD'), OHNE_GESICHT = ['ERZAEHLER', 'FUNK'];
  const gesicht = w => `<div class="kg" data-w="${esc(w)}">${GES[w] && typeof charSVG === 'function' ? charSVG(GES[w]) : `<span class="kgb">${esc(String(NAMEN[w] || w)[0])}</span>`}</div>`;
  /* Mimik der Bühne: Wer spricht, zeigt die Laune der Zeile; die anderen reagieren (lacht einer, grinsen alle) */
  function launeSetzen(box, aktiv, laune) {
    if (typeof mimik !== 'function') return;
    box.querySelectorAll('.kg,.kk').forEach(g => { const s = g.querySelector('svg'); if (!s) return;
      const l = (g.dataset.w || g.closest('[data-w]')?.dataset.w) === aktiv ? (laune || 'normal') : (laune === 'lacht' ? 'froh' : laune === 'erschrocken' ? 'besorgt' : 'normal');
      mimik(s, l); });
  }
  /* Nach deiner Antwort reagiert die Crew: richtig = alle froh, falsch = Smilla traurig, Hinnerk skeptisch, Harms genervt */
  function crewReagiert(ok) {
    const box = ui('#kges'); if (!box || aussehenAkt === 's' || typeof mimik !== 'function') return;
    box.querySelectorAll('.kg').forEach(g => { const s = g.querySelector('svg'); if (!s) return; const w = g.dataset.w;
      mimik(s, ok ? (g.dataset.w === 'HARMS' ? 'nachdenklich' : g.dataset.w === 'KLABAUTER' ? 'lacht' : 'froh') : ({SMILLA: 'besorgt', HINNERK: 'skeptisch', HARMS: 'genervt', KLABAUTER: 'staunt', BACKBORD: 'normal'}[g.dataset.w] || 'besorgt')); });
  }
  function gesichter(aktiv, laune) {
    const box = ui('#kges'); if (!box || aussehenAkt === 's') return;
    if (aussehenAkt === 'b') return buehneB(box, aktiv, laune);
    let gast = box.dataset.gast || ''; if (aktiv && !CREWW.includes(aktiv) && !OHNE_GESICHT.includes(aktiv)) gast = aktiv;
    if (box.dataset.gast !== gast || !box.children.length) { box.dataset.gast = gast; box.innerHTML = buehnenCrew.concat(gast ? [gast] : []).map(gesicht).join(''); }
    box.querySelectorAll('.kg').forEach(g => { const an = g.dataset.w === aktiv; g.classList.toggle('ksp', an); g.querySelector('svg')?.classList.toggle('talking', an && !!lauf); });
    launeSetzen(box, aktiv, laune);
  }
  function zeigeZeile(z, gratis) {
    const box = ui('#kspr'); if (!box || !z) return;
    abgangPruefen(z);
    /* Wer gegangen ist und wieder spricht, ist wieder da (nach dem Anruf) */
    if (weg.has(z.wer)) { weg.delete(z.wer); weg.delete('BACKBORD'); const g0 = ui('#kges'); if (g0) g0.dataset.art = ''; }
    if (aussehenAkt === 's') { box.innerHTML = `<b>🗣️ ${esc(NAMEN[z.wer] || z.wer)}</b>${gratis ? ' <span class="muted">· Gratis-Stimme</span>' : ''}<div class="small" style="margin-top:4px">${esc(z.text)}</div>`; return; }
    gesichter(z.wer, launeRaten(z));
    box.innerHTML = `<div class="kname">${esc(NAMEN[z.wer] || z.wer)}${gratis ? ' <span class="kgr">· Gratis-Stimme</span>' : ''}</div><div class="ktext">${esc(z.text)}</div>`;
  }
  function aussehenSetzen(d) {
    aussehenAkt = AUSSEHEN[d] ? d : 's'; const r = document.getElementById('kursplayer'); if (!r) return;
    r.classList.remove('d-a', 'd-b', 'd-s'); r.classList.add('d-' + aussehenAkt);
    const g = ui('#kges'); if (g) { g.innerHTML = ''; g.dataset.w = ''; g.dataset.gast = ''; } gesichter(null);
  }
  const mitBild = an => document.getElementById('kursplayer')?.classList.toggle('mitbild', !!an);
  async function rede(st, it, me, vorBild) {
    me.redeAbbruch = false;
    const b = await blobVon(st, it); if (me.redeAbbruch) return; if (!b) { if (me.gratis && !me.aus) await redeGratis(it, me, vorBild); return; }
    const box = ui('#kspr');
    const zl = it.zeilen.filter(z => z.text), cum = []; let sum = 0; zl.forEach(z => { sum += z.text.length; cum.push(sum); });
    if (box && aussehenAkt === 's') box.innerHTML = `<b>🎙️ ${it.wer.map(w => esc(NAMEN[w] || w)).join(', ')}</b>` + (cfgK().mitlesen ? it.zeilen.map(z => `<div class="small" style="margin-top:4px"><b>${esc(NAMEN[z.wer] || z.wer)}:</b> ${esc(z.text)}</div>`).join('') : '');
    else zeigeZeile(zl[0]);
    const a = me.audio = new Audio(URL.createObjectURL(b));
    a.playbackRate = cfgK().tempo || 1; a.volume = Math.max(0, Math.min(1, S.cfg.voice == null ? 1 : S.cfg.voice));
    duckAtmo(true);
    /* B158: das Bild kommt etwa zwei Sekunden vor dem Ende des Satzes davor */
    let bildDa = !vorBild, zi = 0;
    a.ontimeupdate = () => {
      if (!a.duration) return;
      if (!bildDa && a.duration - a.currentTime <= 2 * (a.playbackRate || 1)) { bildDa = true; bild(vorBild); me.bildDa = vorBild; }
      /* Bei den Designs A und B: die Zeile, die gerade läuft (geschätzt nach Zeichen), mit Gesicht */
      if (aussehenAkt !== 's' && zl.length > 1) { const p = a.currentTime / a.duration * sum; let i = cum.findIndex(c => p < c); if (i < 0) i = zl.length - 1; if (i !== zi) { zi = i; zeigeZeile(zl[i]); } }
    };
    await new Promise(res => { a.onended = res; a.onerror = res; me.weiter = res; a.play().catch(res); });
    me.weiter = null; if (me.audio === a) me.audio = null; URL.revokeObjectURL(a.src);
    if (!me.gleichWeiter) duckAtmo(false);   /* folgt direkt die nächste Sprache, bleibt die Atmo leise */
    await warten(me, 250, () => me.redeAbbruch);
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
    if (box && q && q.img && q.img.length) mitBild(true);
    if (box && q && q.img && q.img.length) box.innerHTML = q.img.map(s => `<img src="${esc(s)}" alt="Katalogbild zu Frage ${q.n}" style="max-width:100%;max-height:min(46vh,380px);border-radius:12px;background:#fff">`).join('');
  }
  /* Beschriftungen in Animationen im Player größer (Nutzer, 08.11.2026: „zu klein und nicht schön“); Titel, Untertitel und Crew-Satz regelt das CSS */
  function schriftGross(sv) {
    if (!sv) return;
    sv.querySelectorAll('text').forEach(t => { if (t.dataset.gr || /\b(cap|sub|wort)\b/.test(t.getAttribute('class') || '')) return; const fs = parseFloat(t.getAttribute('font-size')); if (fs) { t.setAttribute('font-size', (fs * 1.22).toFixed(1)); t.dataset.gr = '1'; } });
    /* Hochformat-Rahmen: unten stand der Satz der Crew, der jetzt gesprochen wird; Ausschnitt ohne den leeren Streifen */
    if (aussehenAkt !== 'b' && sv.getAttribute('viewBox') === '0 0 400 500' && sv.querySelector('.t.wort')) sv.setAttribute('viewBox', '0 40 400 366');
  }
  /* Mini-Animation aus anim.js im Bildfeld; läuft weiter, bis der Abschnitt wechselt. Fehlt sie, bleibt das Feld leer (gesprochen ist alles verständlich, HR19) */
  /* v5.56 (Nutzer 09.11.2026: „Anlegen hat nicht abgespielt“): Ruft das Skript nur [[ANIM: id]] ohne spätere Phasen auf, läuft die Animation von selbst durch */
  function animAllein(st, k) {
    const it = st.items[k]; if (it.p) return false;
    for (let j = k + 1; j < st.items.length && st.items[j].t !== 'abschnitt'; j++) if (st.items[j].t === 'anim' && st.items[j].id === it.id) return false;
    return true;
  }
  async function animZeigen(it, allein) {
    const box = ui('#kbild'); if (!box) return;
    try {
      await nachladen('anim.js'); if (window.ANIM && window.ANIM.bereit) await window.ANIM.bereit; const A = window.ANIM, id = (A.alias && A.alias[it.id]) || it.id, d = A.defs[id]; if (!d) return;
      if (d.raw) { await nachladen('szene.js'); await nachladen('reise.js'); }
      if (A.css) A.css();
      let sv = box.querySelector(`svg[data-anim="${id}"]`);
      if (!sv) { box.innerHTML = `<div class="anstage kanim">${A.html(id)}</div>`; sv = A.start(box); }
      mitBild(true); schriftGross(sv);
      if (sv && it.p) { A.phase(sv, it.p); schriftGross(sv); }
      if (sv && allein && d.phasen && d.phasen.length > 1) (async () => {
        for (let q = 1; q < d.phasen.length; q++) {
          let t = Math.max(3, Math.min(d.phasen[q - 1].min || 4, 6)) * 1000; while (t > 0) { await sleep(200); if (!sv.isConnected) return; if (!(lauf && lauf.pause)) t -= 200; }
          A.phase(sv, q); schriftGross(sv);
        }
      })();
      /* Einmal erklären, was das rote Ausrufezeichen heißt (Nutzer 08.11.2026; später erklärt es Folge 0) */
      const mk = sv && sv.querySelector('.marke');
      if (mk && mk.style.display !== 'none' && !cfgK().ausruf) { cfgK().ausruf = 1; save(); box.insertAdjacentHTML('afterbegin', '<div class="kausruf"><b style="color:#ff6b5e">❗</b> Rotes Ausrufezeichen: Das kommt so in der Prüfung dran.</div>'); setTimeout(() => box.querySelector('.kausruf')?.remove(), 6000); }
    } catch (e) {}
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
  /* Zuruf (Alfa bis Delta) wie im Quiz, über szene.js; startet erst, wenn die Frage zu Ende gesprochen ist,
     damit das „Alfa“ aus dem Lautsprecher nicht als Antwort zählt */
  let hoer = null;
  function zurufStop() { if (hoer) { try { window.SZENE && SZENE.zurufAus(); } catch (e) {} hoer = null; } const z = ui('#kzinfo'); if (z) z.textContent = ''; }
  const zurufMoeglich = () => !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  function zurufStart(me) {
    /* Nutzer, 08.11.2026: antworten, sobald die Frage sichtbar ist. Während die Stimme noch liest, zählen nur kurze Zurufe (szene.js), danach auch A bis D */
    const w = me.wahlOffen; if (!w || w.getippt || w.fertig || !S.cfg.zuruf || !zurufMoeglich() || !window.SZENE || !SZENE.zuruf) return;
    /* v5.56 (Nutzer 09.11.2026): Das Mikrofon hört ab der sichtbaren Frage zu, auch bei Harms. Wird der Ton auf einem Handy
       dabei schlechter (offenes Mikrofon, Bluetooth im Auto), lässt sich das unter ⚙️ ausschalten: dann erst nach dem Vorlesen. */
    if (!w.gesprochen && cfgK().zurufFrueh === false) return;
    if (hoer) { if (w.gesprochen && !hoer.laut && hoer.vorbei) hoer.vorbei(); return; }
    /* „Easy Alfa“, „Alfa tricky“: die Selbsteinschätzung kommt mit dem Zuruf (Nutzer 09.11.2026) */
    /* v5.59: das Skript geht mit (echo), damit szene.js die vorgelesene Antwort vom Zuruf unterscheiden kann */
    hoer = SZENE.zuruf((p, x) => { hoer = null; if (x && x.et && w.etSetzen) w.etSetzen(x.et); const b = ui(`#kwahl [data-o="${p}"]`); if (b && !b.disabled) b.click(); }, t => { const z = ui('#kzinfo'); if (z) z.textContent = t; }, {echo: w.echo});
    if (hoer && w.gesprochen) hoer.laut = true;
  }
  const FUNKW = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'];
  /* Harms liest den amtlichen Wortlaut mit Alfa bis Delta: Das ist immer eine echte Frage, auch im Auto-Modus (Nutzer 09.11.2026) */
  const harmsFrage = it => !!(it && it.t === 'wahl' && !it.vorab && it.opts.length > 1 && it.opts.every(o => /^\s*(Alfa|Alpha|Bravo|Charlie|Delta)\s*:/i.test(o.text)));
  const ohneBuchstabe = s => String(s).replace(/^\s*(Alfa|Alpha|Bravo|Charlie|Delta)\s*[:.]\s*/i, '');
  /* Was auf dem Bildschirm als Frage steht (Nutzer, 08.11.2026: man muss die Frage immer lesen können) */
  function frageKopf(it, rede) {
    const q = it.id ? frage(it.id) : null, harms = it.opts.length ? harmsFrage(it) : !!q;
    if (q && harms) return {text: String(q.q).replace(/\s*\(([●▬\s]+)\)/, '').trim(), img: q.img || []};
    const z = rede ? rede.zeilen.filter(x => x.text) : [];
    const sauber = s => String(s).replace(/^.*?Frage an dich[^.:?!]*[.:]\s*/i, '').replace(/\s*\{\{[^}]*\}\}/g, '').replace(/\s+Alfa:.*$/, '').trim();
    if (!z.length) return {text: q ? String(q.q) : '', img: []};
    if (z.length === 1) return {text: sauber(z[0].text), img: []};
    return {zeilen: z.slice(-3).map(x => ({wer: NAMEN[x.wer] || x.wer, text: sauber(x.text)})), img: []};
  }
  /* Antworten stehen sofort mit der Frage da (Nutzer, 08.11.2026); ein früher Tipp stoppt die Stimme.
     Reihenfolge wie im Skript, damit Alfa bis Delta zu dem passen, was Harms vorliest; nur die amtlichen Antworten ohne Skript werden gemischt. */
  function wahl(st, it, me, rede) {
    const box = ui('#kwahl'); if (!box) return Promise.resolve();
    const q = !it.opts.length && it.id ? frage(it.id) : null;
    const opts = q ? q.a.map((text, i) => ({text, ok: !i})).sort(() => Math.random() - .5) : it.opts.slice();
    const kopf = frageKopf(it, rede);
    const kopfHtml = kopf.zeilen ? kopf.zeilen.map(z => `<div><b>${esc(z.wer)}:</b> ${esc(z.text)}</div>`).join('') : esc(kopf.text);
    const bilder = (kopf.img || []).map(s => `<img src="${esc(s)}" alt="Bild zur Frage" style="max-width:100%;max-height:26vh;border-radius:10px;background:#fff;margin-top:6px">`).join('');
    /* Easy/Tricky wie im Quiz bei den amtlichen Fragen von Harms; fließt in die Statistik (selbstEinschaetzung in index.html) */
    const et = harmsFrage(it) && it.id && String(it.id).startsWith('sbf:') && typeof selbstEinschaetzung === 'function';
    const zr = zurufMoeglich() ? `<button class="chip" id="kzr" aria-pressed="${!!S.cfg.zuruf}">🎙️ Mitreden</button>` : '';
    /* Harms oben, die Frage darunter (Nutzer 09.11.2026) */
    const kh = harmsFrage(it) ? `<div class="kharms">${gesicht('HARMS')}<span><b>Kapitän Harms</b><br><span class="small">📞 prüft. Im Wortlaut.</span></span></div>` : '';
    box.innerHTML = `<div class="kfrage">${kh}<div class="kfkopf"><span>${it.vorab ? '🎲 Tipp mal (zählt nicht)' : kh ? '🔔 Prüfungsfrage' : '🔔 Frage an dich'}</span>${zr}</div>
      <div class="kftext">${kopfHtml}</div>${bilder}<div class="small muted" id="kzinfo"></div>
      ${et ? `<div class="kselbst"><button class="chip" data-et="easy" aria-pressed="false">😎 Easy</button><button class="chip" data-et="tricky" aria-pressed="false">🤔 Tricky</button><span class="small muted">sag z. B. „A easy“</span></div>` : ''}
      <div class="kopts">${opts.map((o, i) => `<button class="kopt" data-o="${i}"><b class="kabc">${'ABCDEF'[i] || i + 1}</b><span>${esc(ohneBuchstabe(o.text))}</span></button>`).join('')}</div>
      <button class="btn small ghost" data-o="-1" style="margin-top:6px">Weiter ohne Antwort</button></div>`;
    document.getElementById('kursplayer')?.classList.add('mitwahl');
    const z = ui('#kzr'); if (z) z.onclick = () => { S.cfg.zuruf = !S.cfg.zuruf; save(); z.setAttribute('aria-pressed', String(!!S.cfg.zuruf)); if (S.cfg.zuruf) { if (window.VOX && VOX.phoneUnlock) VOX.phoneUnlock(); zurufStart(me); } else zurufStop(); };
    { const sb = document.getElementById('kbuehne'); if (sb) sb.scrollTop = 0; box.scrollIntoView({block: 'start'}); }
    const w = me.wahlOffen = {it, gesprochen: !rede, fertig: false, et: null, etBasis: null, echo: opts.map(o => ohneBuchstabe(o.text))};
    const etAnwenden = () => { const e = w.etBasis; if (!e) return; selbstEinschaetzung(e.n, e.ok, e.vor, e.nach, w.et);
      const i = box.querySelector('#ketinfo'); if (i) i.textContent = !w.et ? '' : w.et === 'easy' ? (e.ok ? '😎 Easy: kommt erst später wieder.' : '😎 Vertippt: zählt nicht als Fehler, kommt zur Bestätigung wieder.') : (e.ok ? '🤔 Tricky: zählt als Glückstreffer, kommt morgen wieder.' : '🤔 Tricky: kommt öfter.'); };
    w.etSetzen = v => { if (!et) return; w.et = w.et === v ? null : v; box.querySelectorAll('[data-et]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.et === w.et))); etAnwenden(); };
    box.querySelectorAll('[data-et]').forEach(b => b.onclick = () => w.etSetzen(b.dataset.et));
    me.frager = rede && rede.zeilen.length ? rede.zeilen[rede.zeilen.length - 1].wer : null;
    const p = new Promise(res => {
      const ende = () => { me.wahlRes = null; w.fertig = true; if (me.wahlOffen === w) me.wahlOffen = null; zurufStop(); document.getElementById('kursplayer')?.classList.remove('mitwahl');
        /* Nachtbühne: nach der Frage wieder Vollbild auf die Crew */
        if (aussehenAkt === 'b') { const bb = ui('#kbild'); if (bb) bb.innerHTML = ''; mitBild(false); }
        res(); };
      me.wahlRes = () => { box.innerHTML = ''; ende(); };
      box.querySelectorAll('[data-o]').forEach(b => b.onclick = async () => {
        const o = opts[+b.dataset.o]; me.wahlRes = null; w.getippt = true; unterbrich(me);
        box.querySelectorAll('button:not([data-et])').forEach(x => x.disabled = true);
        if (!o) { box.innerHTML = ''; return ende(); }
        if (it.vorab) {
          /* Nutzer, 08.11.2026: auch beim Raten gleich sagen, ob es stimmt (zählt weiter nicht in der Statistik) */
          me.tipps[it.vorab] = {text: ohneBuchstabe(o.text), ok: o.ok, richtig: ohneBuchstabe((it.opts.find(x => x.ok) || {}).text || '')};
          AUD.sfx(o.ok ? 'richtig' : 'falsch', {vol: .8}); crewReagiert(o.ok); b.classList.add(o.ok ? 'ok' : 'no');
          if (!o.ok) { const r = opts.findIndex(x => x.ok); const rb = box.querySelector(`[data-o="${r}"]`); if (rb) rb.classList.add('ok'); }
          box.querySelector('.kopts').insertAdjacentHTML('afterend', `<p class="small" style="margin:6px 0 0">${o.ok ? '✅ Gut geraten!' : '❌ Nicht ganz. Warum, erklären wir gleich.'} <span class="muted">Zählt nicht.</span></p>`);
          await warten(me, 500); await rueckmeldung(st, me, o.ok); await warten(me, 300); box.innerHTML = ''; return ende();
        }
        AUD.sfx(o.ok ? 'richtig' : 'falsch', {vol: .8}); crewReagiert(o.ok);
        if (!o.ok) me.falsch.add(it.id);
        const nr = et ? +String(it.id).split(':')[1] : 0, vor = nr && S.qs[nr] ? {...S.qs[nr]} : null;
        const gezaehlt = it.id && zaehle(it.id, o.ok);
        if (gezaehlt && nr && S.qs[nr]) { w.etBasis = {n: nr, ok: o.ok, vor, nach: {...S.qs[nr]}}; if (w.et) etAnwenden(); }
        b.classList.add(o.ok ? 'ok' : 'no');
        if (!o.ok) { const r = opts.findIndex(x => x.ok); const rb = box.querySelector(`[data-o="${r}"]`); if (rb) rb.classList.add('ok'); }
        box.querySelector('.kopts').insertAdjacentHTML('afterend', `<p class="small" style="margin:6px 0 0">${o.ok ? '✅ Richtig!' : '❌ Nicht ganz. Gleich kommt eine Erklärung.'}${gezaehlt ? ' <span class="muted">Zählt in deiner Statistik.</span>' : ''}</p>${et ? '<p class="small" id="ketinfo" style="margin:4px 0 0"></p>' : ''}`);
        if (w.et) etAnwenden();
        /* Zeit zum Nachtippen von Easy oder Tricky */
        await warten(me, et && !w.et ? 1800 : 500); await rueckmeldung(st, me, o.ok); await warten(me, 300); box.innerHTML = ''; ende();
      });
    });
    w.p = p; return p;
  }
  /* Nutzer, 08.11.2026: Kommt nach der Frage acht Sekunden keine Antwort, tickt die Uhr; nach weiteren vier Sekunden geht es ohne Antwort weiter
     (sonst bleibt die Folge stehen, wenn der Zuruf nicht klappt oder keiner antworten kann). Pause hält die Uhr an. */
  async function wahlUhr(me) {
    const w = me.wahlOffen; if (!w || w.uhr || w.fertig || w.getippt) return; w.uhr = true;
    const offen = () => !me.aus && !w.fertig && !w.getippt && me.wahlOffen === w;
    const lauf = async ms => { let t = 0; while (t < ms && offen()) { await sleep(200); if (!me.pause) t += 200; } };
    await lauf(8000); if (!offen()) return;
    AUD.ticks(4, .6); await lauf(4000); if (!offen()) return;
    if (w.it.id && !w.it.vorab) me.falsch.add(w.it.id);   /* die genauere Erklärung hilft, wenn keiner antworten konnte */
    const b = ui('#kwahl [data-o="-1"]'); if (b && !b.disabled) b.click();
  }
  /* Nach deiner Antwort sagt einer aus der Crew kurz, ob es stimmt (wer gefragt hat, sonst Smilla); bei falsch erklärt danach die Vertiefung */
  async function rueckmeldung(st, me, ok) {
    const pool = (st.rueck || []).filter(r => r.ok === ok); if (!pool.length || me.aus) return;
    const hat = w => pool.some(r => r.wer[0] === w);
    const wer = me.frager && hat(me.frager) ? me.frager : hat('SMILLA') ? 'SMILLA' : hat('HINNERK') ? 'HINNERK' : pool[0].wer[0];
    const auswahl = pool.filter(r => r.wer[0] === wer), r = auswahl[Math.floor(Math.random() * auswahl.length)];
    gesichter(wer, ok ? (wer === 'HARMS' ? 'nachdenklich' : 'froh') : (wer === 'HARMS' ? 'genervt' : 'besorgt'));
    const b = await blobVon(st, r);
    try {
      if (b) { const a = new Audio(URL.createObjectURL(b)); a.volume = Math.max(0, Math.min(1, S.cfg.voice == null ? 1 : S.cfg.voice)); await new Promise(res => { a.onended = res; a.onerror = res; a.play().catch(res); }); URL.revokeObjectURL(a.src); }
      else { me.handy = true; await VOX.phoneTest(HANDY[wer] || String(wer).toLowerCase(), r.zeilen[0].text); me.handy = false; }
    } catch (e) { me.handy = false; }
  }
  /* Pfeife (Nutzer, 08.11.2026): mit dem Streichholz geht sie an, sobald danach jemand redet (Smilla nimmt sie ihm weg), ist sie wieder aus und bleibt aus */
  function pfeifeAn(me) {
    const els = [...document.querySelectorAll('#kursplayer .ch[data-ch="hinnerk"]')]; if (!els.length) return;
    me.pfeife = els; els.forEach(e => { e.classList.remove('raucht'); e.classList.add('zuendet'); setTimeout(() => { e.classList.remove('zuendet'); if (me.pfeife === els) e.classList.add('raucht'); }, 1300); });
  }
  function pfeifeAus(me) { const els = me.pfeife; me.pfeife = null; setTimeout(() => els.forEach(e => e.classList.remove('zuendet', 'raucht')), 700); }
  /* Glocke (Nutzer, 08.11.2026): nur einmal, wenn eine Frage kommt; keine Doppel-Glocke, keine Glocke zur Auflösung */
  function glockeFuerFrage(st, k) {
    for (let j = k + 1; j < st.items.length && j <= k + 5; j++) {
      const x = st.items[j];
      if (x.t === 'ton' && x.name === 'glocke') return false;
      if (x.t === 'wahl' || (x.t === 'pause' && !x.still)) return true;
      if (x.t === 'abschnitt') return false;
    }
    return false;
  }
  /* Folgt auf diese Rede (nach Glocke oder Bild) eine Wahl? Dann erscheint sie schon jetzt */
  function wahlNach(st, k) {
    for (let j = k + 1; j < st.items.length; j++) { const x = st.items[j]; if (x.bereich && x.bereich.art === 'vert') return null; if (x.t === 'wahl') return j; if (x.t !== 'bild' && x.t !== 'ton') return null; }
    return null;
  }
  async function spiele(st, ab = 0, gratis = false) {
    stop();
    const me = lauf = {aus: false, pause: false, audio: null, weiter: null, wahlRes: null, wahlOffen: null, vorWahl: null, redeAbbruch: false, falsch: new Set(), neben: [], tipps: {}, gleichWeiter: false, ende: null, gratis: !!gratis, handy: false};
    AUD.unlock(); AUD.playMusic(null); zeigeSteuerung(st, true); nachladen('szene.js').catch(() => {}); document.getElementById('kursplayer')?.classList.add('laeuft');
    me.root = document.getElementById('kursplayer'); wachHalten(true); medienSitzung(st); { const i = ui('#kinfo'); if (i) i.textContent = ''; }
    /* Abschnitte, deren Sprache noch fehlt: Dort endet der Ausschnitt (Nutzer, 24.10.2026: lieber den Schluss weglassen als kürzen) */
    wegReset();
    const fehltAb = me.gratis ? new Set() : new Set((await bestand(st)).offen.filter(it => !it.rueck).map(it => it.ab));
    /* Revier der Stelle, an der es losgeht */
    for (let k = ab; k >= 0; k--) if (st.items[k] && st.items[k].t === 'szene' && szeneTyp(st.items[k].text)) { szeneSetzen(st.items[k].text); break; }
    for (let k = ab; k >= 0; k--) if (st.items[k] && st.items[k].t === 'revier') { await atmo(st, st.items[k].wert); break; }
    /* v5.59: Modus lässt sich mitten in der Folge umschalten (⚓ Vor Anker / ⛵ In Fahrt). In Fahrt mit 🎙️ Mitreden ist jede Frage echt: man antwortet laut */
    const interaktiv = () => cfgK().modus === 'interaktiv', echt = x => interaktiv() || harmsFrage(x) || (!!S.cfg.zuruf && zurufMoeglich());
    for (let k = ab; k < st.items.length && !me.aus; k++) {
      const it = st.items[k];
      if (it.bereich && it.bereich.art === 'vert' && !me.falsch.has(it.bereich.id)) continue;
      while (me.pause && !me.aus) await sleep(200);
      if (me.aus) break;
      /* früh getippt: Glocke und Rest der Frage überspringen, bis zur Wahl */
      if (me.vorWahl && me.vorWahl.w.getippt && k < me.vorWahl.j) continue;
      markiere(st, k);
      if (it.t === 'abschnitt') {
        if (fehltAb.has(it.ab)) { me.ende = it.titel; break; }
        /* v5.62 (Nutzer 12.11.2026): Schalter „Harms am Ende“ aus = die Folge endet vor dem Anruf */
        if (cfgK().harms === false && /harms/i.test(it.titel || '')) { me.ohneHarms = true; break; }
        me.abK = k; letzteAbK = k; if (weg.size) { wegReset(); const g0 = ui('#kges'); if (g0) g0.dataset.art = ''; }
        const b = ui('#kbild'); if (b) b.innerHTML = ''; mitBild(false); const g = ui('#kges'); if (g && aussehenAkt === 'a' && g.dataset.gast) { g.dataset.gast = ''; gesichter(null); } if (it.bereich && it.bereich.art === 'karte') atmoAus();
      }
      /* Neues Revier: erst einen Moment nur das Geräusch, dann der erste Satz (Konzept §7.2, §10.3) */
      else if (it.t === 'revier') { if (await atmo(st, it.wert)) await warten(me, 1500); }
      else if (it.t === 'rede') {
        const n = st.items[k + 1], j0 = wahlNach(st, k), j = j0 != null && echt(st.items[j0]) ? j0 : null; me.gleichWeiter = !!(n && n.t === 'rede');
        if (j != null && !(me.vorWahl && me.vorWahl.j === j)) { wahl(st, st.items[j], me, it); me.vorWahl = me.wahlOffen ? {j, w: me.wahlOffen} : null; zurufStart(me); }
        if (me.pfeife) pfeifeAus(me);
        await rede(st, it, me, n && n.t === 'bild' ? n.id : null);
        if (letzteZeile && letzteZeile.abgang) abgangPruefen(null);
        if (me.vorWahl && me.wahlOffen === me.vorWahl.w && wahlNach(st, k) === me.vorWahl.j) { me.wahlOffen.gesprochen = true; zurufStart(me); wahlUhr(me); }
      }
      else if (it.t === 'pause') await denkpause(it.s, me, it.still);
      else if (it.t === 'bild') { if (me.bildDa !== it.id) bild(it.id); me.bildDa = null; }
      else if (it.t === 'anim') animZeigen(it, animAllein(st, k));
      else if (it.t === 'tipp') { if (interaktiv()) tipp(it, me); }
      else if (it.t === 'ton' && it.gen) await geraeusch(st, it, me);
      else if (it.t === 'ton') { if (it.name === 'glocke' && !glockeFuerFrage(st, k)) continue; if (it.name === 'streichholz') pfeifeAn(me); await AUD.sfx(it.name, {vol: .8, dur: TON_DAUER[it.name] || 3}); }
      else if (it.t === 'szene') szeneSetzen(it.text);
      else if (it.t === 'signal') { const b = ui('#kdenk'); if (b) b.innerHTML = `<div class="kdenk">📯 ${esc(it.muster)}</div>`; await AUD.horn(it.muster).done; if (b) b.innerHTML = ''; }
      else if (it.t === 'wahl' && echt(it)) {
        if (me.vorWahl && me.vorWahl.j === k) { const w = me.vorWahl.w; me.vorWahl = null; if (w.p && !w.fertig) { w.gesprochen = true; zurufStart(me); wahlUhr(me); await w.p; } }
        else { const p = wahl(st, it, me, null); zurufStart(me); wahlUhr(me); await p; }
        if (st.items[k + 1] && st.items[k + 1].t === 'pause') k++;
      }
    }
    if (lauf === me) {
      atmoAus(); lauf = null; zeigeSteuerung(st, false); document.getElementById('kursplayer')?.classList.remove('laeuft', 'mitbild'); const s = ui('#kspr');
      if (s) s.innerHTML = me.aus ? '' : me.ende ? `<b>⚓ Hier endet der Ausschnitt.</b> Der Abschnitt „${esc(me.ende)}“ ist noch nicht erzeugt. Du kannst ihn unter ⚙️ bei „Erzeugen“ dazuholen.` : `<b>⚓ Ende der Folge.</b> Wie war’s? Sag Claude, was klingt und was nicht.${me.gratis ? ' (Gehört mit der Gratis-Stimme: Betonung und Tempo sind hier noch nicht echt.)' : ''}`;
      if (s && !me.aus && !me.ende) fragerundeKnopf(st, s);
      /* Durchgehört: für den Knopf „Hörreise“ an Deck (nächste Folge); Standard leer (R7) */
      if (!me.aus && !me.ende && st.id && window.S) { S.hoerreise = S.hoerreise || {}; S.hoerreise.gehoert = S.hoerreise.gehoert || {}; S.hoerreise.gehoert[st.id] = new Date().toISOString().slice(0, 10); save(); }
      /* Im Auto-Modus geht es nach kurzer Ansage mit der nächsten Folge weiter (Auto, Gym); interaktiv bleibt die Fragerunde */
      const naechste = !me.aus && !me.ende && cfgK().modus === 'auto' ? naechsteFolge(st.id) : null;
      if (naechste && s) {
        s.insertAdjacentHTML('beforeend', `<p style="margin:10px 0 0" id="kweiterbox">⏭ Gleich geht's weiter mit „${esc(FOLGEN[naechste].titel)}“ … <button class="btn small ghost" id="kweiternein">Nicht weiter</button></p>`);
        const t = setTimeout(() => { if (!lauf && document.getElementById('kweiterbox')) oeffnen(naechste, {start: true, gratis: me.gratis}); else wachHalten(false); }, 6000);
        const nb = ui('#kweiternein'); if (nb) nb.onclick = () => { clearTimeout(t); wachHalten(false); const b = ui('#kweiterbox'); if (b) b.remove(); try { navigator.mediaSession.playbackState = 'none'; } catch (e) {} };
      } else { wachHalten(false); try { navigator.mediaSession.playbackState = 'none'; } catch (e) {} }
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
  /* ---------- Sperrbildschirm, Kopfhörer- und Lenkradtasten (v5.50, für Auto und Gym) ---------- */
  /* Eine stille Schleife hält die Wiedergabe für Android am Leben, auch zwischen zwei Sprachteilen und bei ausgeschaltetem Bildschirm */
  let stummA = null;
  const stilleWav = () => { const n = 8000, b = new Uint8Array(44 + n), v = new DataView(b.buffer), s = (o, t) => [...t].forEach((c, i) => b[o + i] = c.charCodeAt(0));
    s(0, 'RIFF'); v.setUint32(4, 36 + n, true); s(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); s(36, 'data'); v.setUint32(40, n, true); b.fill(128, 44);
    let x = ''; b.forEach(c => x += String.fromCharCode(c)); return 'data:audio/wav;base64,' + btoa(x); };
  function wachHalten(an) {
    try { if (an) { if (!stummA) { stummA = new Audio(stilleWav()); stummA.loop = true; stummA.volume = .01; } stummA.play().catch(() => {}); } else if (stummA) stummA.pause(); } catch (e) {}
  }
  function pauseSetzen(p) {
    if (!lauf) return; lauf.pause = p;
    if (lauf.audio) p ? lauf.audio.pause() : lauf.audio.play().catch(() => {});
    if (lauf.handy) { try { p ? speechSynthesis.pause() : speechSynthesis.resume(); } catch (e) {} }
    const pa = ui('#kpause'); if (pa) { pa.textContent = p ? '▶' : '⏸'; pa.setAttribute('aria-label', p ? 'Weiter' : 'Pause'); }
    try { navigator.mediaSession.playbackState = p ? 'paused' : 'playing'; } catch (e) {}
  }
  /* ⏭ = nächster Abschnitt (am Ende: nächste Folge), ⏮ = Abschnitt von vorn */
  function springe(st, richtung) {
    const me = lauf; if (!me) return; const gratis = me.gratis, ab = st.items.map((it, i) => it.t === 'abschnitt' && !(it.bereich && it.bereich.art === 'karte') ? i : -1).filter(i => i >= 0);
    const jetzt = me.abK || 0;
    if (richtung < 0) return spiele(st, jetzt, gratis);
    const nach = ab.find(i => i > jetzt);
    if (nach != null) return spiele(st, nach, gratis);
    const n = naechsteFolge(st.id); if (n) { stop(); oeffnen(n, {start: true}); }
  }
  function naechsteFolge(id) {
    const liste = typeof HOERREISE !== 'undefined' ? HOERREISE.map(x => x[0]) : [], i = liste.indexOf(id);
    return i >= 0 && liste[i + 1] && FOLGEN[liste[i + 1]] ? liste[i + 1] : null;
  }
  /* v5.59: Steht eine Frage da, heißt die Taste ⏯ (Kopfhörer, Lenkrad) „jetzt antworten“: die Stimme hört auf, das Mikrofon hört zu */
  function jetztAntworten() {
    const me = lauf, w = me && me.wahlOffen; if (!w || w.fertig || w.getippt || !zurufMoeglich()) return false;
    if (!S.cfg.zuruf) { S.cfg.zuruf = true; save(); const z = ui('#kzr'); if (z) z.setAttribute('aria-pressed', 'true'); }
    unterbrich(me); if (me.gratis && typeof VOX !== 'undefined') VOX.stop('Antworten');
    w.gesprochen = true; if (hoer && hoer.vorbei) hoer.vorbei(); else zurufStart(me); return true;
  }
  function medienSitzung(st) {
    if (!('mediaSession' in navigator)) return;
    try {
      const nr = typeof HOERREISE !== 'undefined' ? HOERREISE.findIndex(x => x[0] === st.id) : -1;
      navigator.mediaSession.metadata = new MediaMetadata({title: st.f.titel, artist: 'Skipper · Hörreise' + (nr >= 0 ? ` · Folge ${nr + 1}` : ''), album: 'Mit der Crew zum Bootsführerschein',
        artwork: [{src: 'icon-192.png', sizes: '192x192', type: 'image/png'}, {src: 'icon-512.png', sizes: '512x512', type: 'image/png'}]});
      const set = (a, f) => { try { navigator.mediaSession.setActionHandler(a, f); } catch (e) {} };
      set('play', () => { if (!jetztAntworten()) pauseSetzen(false); }); set('pause', () => { if (!jetztAntworten()) pauseSetzen(true); });
      set('nexttrack', () => springe(st, 1)); set('previoustrack', () => springe(st, -1));
      set('stop', () => { stop(); zeigeSteuerung(st, false); });
      navigator.mediaSession.playbackState = 'playing';
    } catch (e) {}
  }
  function markiere(st, k) {
    let nr = -1; st.items.forEach((it, i) => { if (it.t === 'abschnitt' && i <= k) nr = i; });
    document.querySelectorAll('#kursplayer [data-ab]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.ab === nr)));
  }
  const ZEICHEN = {play: '<svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true"><path d="M14 9 L31 20 L14 31 Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>', pause: '<svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true"><rect x="11" y="9" width="6" height="22" rx="2" fill="currentColor"/><rect x="23" y="9" width="6" height="22" rx="2" fill="currentColor"/></svg>'};
  function zeigeSteuerung(st, laeuft) {
    const p = ui('#kplay'); if (!p) return;
    /* v5.52 (Nutzer 08.11.2026): ohne Text, oben im Kopf. ▶ spielt echte Stimmen, wo es sie gibt; was fehlt, liest die Gratis-Stimme */
    /* v5.55 (Nutzer 08.11.2026): unten in der Mitte ein großer Knopf, kein Stopp; „Szene wiederholen“ liegt hinter ⚙️ */
    p.innerHTML = laeuft ? `<button class="kgross" id="kpause" aria-label="Pause">${ZEICHEN.pause}</button>` : `<button class="kgross" id="kstart" aria-label="Abspielen">${ZEICHEN.play}</button>`;
    const los = () => { AUD.unlock(); if (VOX.phoneUnlock) VOX.phoneUnlock(); vollAn(); spiele(st, 0, !!(st.luecke || st.ersterFehlt)); };
    const s = ui('#kstart'); if (s) s.onclick = los;
    const pa = ui('#kpause'); if (pa) pa.onclick = () => { if (lauf) { if (lauf.pause) vollAn(); pauseSetzen(!lauf.pause); } };
    fussZeigen();
  }
  /* v5.61: Vollbild ist Standard; der Browser erlaubt es nur nach einem Tippen, darum beim Start und beim Weiterspielen */
  function vollAn() { try { if (!document.fullscreenElement && document.documentElement.requestFullscreen && cfgK().vollbild !== false) document.documentElement.requestFullscreen().catch(() => {}); } catch (e) {} }
  let fussT = 0;
  function fussZeigen() {
    const f = ui('.kfuss'); if (!f) return; f.classList.remove('weg'); clearTimeout(fussT);
    fussT = setTimeout(() => { const g = ui('.kfuss'), pn = ui('#kpanel'); if (g && lauf && !lauf.pause && (!pn || pn.hidden)) g.classList.add('weg'); }, 15000);
  }
  /* v5.61 (Nutzer 11.11.2026): „Wenn eine Frage kommt, so groß wie möglich. Die mit dem längsten Text bestimmt die Größe.“
     Alle Fragen der Folge werden unsichtbar in voller Breite gesetzt; die Schrift wächst, bis die längste gerade noch auf den Bildschirm passt. */
  function frageGroesse(st) {
    const kp = document.getElementById('kursplayer'), wahlBox = ui('#kwahl'); if (!kp || !wahlBox || !st || !st.items) return;
    const texte = [];
    st.items.forEach((it, k) => { if (it.t !== 'wahl') return; let rede = null; for (let j = k - 1; j >= 0 && j > k - 6; j--) if (st.items[j].t === 'rede') { rede = st.items[j]; break; }
      const q = !it.opts.length && it.id ? frage(it.id) : null, kopf = frageKopf(it, rede), opts = q ? q.a : it.opts.map(o => ohneBuchstabe(o.text));
      texte.push({kopf: kopf.zeilen ? kopf.zeilen.map(z => `<div><b>${esc(z.wer)}:</b> ${esc(z.text)}</div>`).join('') : esc(kopf.text), opts, bild: (kopf.img || []).length > 0, harms: harmsFrage(it)}); });
    if (!texte.length) return;
    const breite = (ui('#kstage') || kp).clientWidth || window.innerWidth, kopfH = (ui('.kkopf') || {}).offsetHeight || 56, fussH = (ui('.kfuss') || {}).offsetHeight || 80;
    const hoehe = window.innerHeight - kopfH - fussH - 16;
    const m = document.createElement('div'); m.className = 'kmess'; m.style.cssText = `position:absolute;left:-9999px;top:0;width:${breite}px;visibility:hidden`; wahlBox.parentNode.appendChild(m);
    let klein = 3;
    for (const t of texte) {
      m.innerHTML = `<div class="kfrage">${t.harms ? '<div class="kharms" style="height:3.2em"></div>' : ''}<div class="kfkopf"><span>🔔 Frage an dich</span></div><div class="kftext">${t.kopf}</div>${t.bild ? '<div style="height:26vh"></div>' : ''}<div class="small">&nbsp;</div><div class="kopts">${t.opts.map((o, i) => `<button class="kopt"><b class="kabc">${'ABCDEF'[i]}</b><span>${esc(o)}</span></button>`).join('')}</div><button class="btn small ghost" style="margin-top:6px">Weiter ohne Antwort</button></div>`;
      const box = m.firstChild; let lo = .8, hi = Math.min(klein, 2.6);
      for (let n = 0; n < 9; n++) { const mid = (lo + hi) / 2; box.style.fontSize = mid + 'em'; if (box.offsetHeight <= hoehe) lo = mid; else hi = mid; }
      klein = Math.min(klein, lo);
    }
    m.remove(); kp.style.setProperty('--kfs', (klein * .97).toFixed(3) + 'em');
  }

  /* ---------- Bildschirm ---------- */
  async function oeffnen(id = 'probe', opt = {}) {
    subScreen(); stop();
    if (!FOLGEN[id]) id = 'probe';
    const f = FOLGEN[id];
    /* v5.51 (Nutzer 08.11.2026): Vollbild, am Bildschirm nur die Folge; alles andere hinter dem Zahnrad ⚙️ */
    app.innerHTML = `<div id="kursplayer" class="kvoll"><div class="kkopf"><button class="kknopf" id="back" aria-label="Zurück">←</button>
        <div class="ktitel"><b>${esc(f.titel)}</b><span class="small muted">${esc(f.unter)}<span id="kdauer"></span></span></div>
</div>
      <div id="kbuehne">
        <div id="kstage"><div id="kges"></div><div id="kspr" class="small"></div><div id="kdenk"></div><div id="kbild" style="text-align:center"></div><div id="kwahl"></div></div>
        <div class="kfuss"><button class="kknopf" id="kkarte" aria-label="Pause und zur Reisekarte">⟵</button><button class="kmod" id="kmod" hidden>⛵ In Fahrt</button><span id="kplay" class="kplay"></span><button class="kknopf" id="kzahn" aria-label="Einstellungen">⚙️</button></div>
        <div id="keinst" hidden><div class="kekipp"><button data-ek="reden" aria-label="hören und laut antworten"><svg viewBox="0 0 48 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 36 V30 C7 28 5 23 5 17 C5 9 11 4 18 4 C25 4 29 9 29 14 L32.5 20 L29.5 21 V25 C29.5 27 28 28 26 28 H22 V36"/><path d="M26.5 23.5 H30" stroke-width="2"/><circle cx="21" cy="13" r="1.3" fill="currentColor" stroke="none"/><path d="M35 15 Q38 20 35 25 M39.5 11 Q44.5 20 39.5 29" stroke-width="2.6"/></svg></button><button data-ek="ohr" aria-label="nur hören"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M13 16 Q13 6 22 6 Q31 6 31 16 Q31 22 25 26 Q22 28 22 32 Q22 36 17 36 Q13 36 13 32"/><path d="M18 17 Q18 12 22 12 Q26 12 26 16"/></svg></button></div><button class="keharms" id="keharms" aria-label="Harms am Ende"><svg viewBox="0 0 40 40" fill="none" stroke-width="2.4" stroke-linejoin="round"><path d="M7 13 Q7 7 13 7 H27 Q33 7 33 13 L29 16 L25 13 H15 L11 16 Z" fill="#c0392b" stroke="#7a2318"/><rect x="9" y="19" width="22" height="15" rx="3" fill="#c0392b" stroke="#7a2318"/><circle cx="20" cy="26.5" r="4" fill="#fff" stroke="#7a2318"/></svg></button><button class="kemehr" id="kemehr">Mehr …</button></div></div>
      <div id="kpanel" hidden><div class="kpkopf"><b>⚙️ Einstellungen und Erzeugen</b><button class="kknopf" id="kzu" aria-label="Schließen">✕</button></div>
      <p class="status small" id="kinfo">Lade …</p><button class="btn" id="kwdh" style="width:100%;margin:4px 0 10px">↺ Szene wiederholen</button><div id="kpaarbox"></div>
      <div class="card"><div class="kreihe"><button class="chip" data-mod="interaktiv">⚓ Vor Anker</button><button class="chip" data-mod="auto">⛵ In Fahrt</button></div>
        <p class="small muted" id="kmodtxt" style="margin:6px 0"></p>
        <div class="kreihe"><label class="small">Tempo <select id="ktem"><option value="0.9">langsam</option><option value="1">normal</option><option value="1.1">zügig</option></select></label>
          <label class="small"><input type="checkbox" id="kmit"> Mitlesen</label><label class="small"><input type="checkbox" id="ktick"> Ticken</label></div>
        <label class="small" style="display:block;margin-top:6px"><input type="checkbox" id="kzfrueh"> Zuruf schon während des Vorlesens (wird der Ton auf deinem Handy dabei schlechter, hier ausschalten)</label>
        <div class="kreihe" style="margin-top:8px"><span class="small">Aussehen:</span>${Object.entries(AUSSEHEN).map(([k, v]) => `<button class="chip" data-aus="${k}">${v}</button>`).join('')}</div></div>
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
        <div class="kreihe"><button class="btn ghost small" id="kzip">📦 ZIP speichern</button></div><p class="status small" id="kginfo"></p></div></div></div>
      <style>.kdenk{font-size:1.1em;font-weight:700;margin-top:6px}
        #kursplayer.kvoll{position:fixed;inset:0;z-index:40;display:flex;flex-direction:column;background:var(--paper,#fbf3e4);color:var(--ink,#2a2118);overflow:hidden}
        #kursplayer .kkopf{display:flex;align-items:center;gap:8px;padding:calc(env(safe-area-inset-top,0px) + 8px) max(12px,env(safe-area-inset-right,0px)) 6px max(12px,env(safe-area-inset-left,0px))}
        #kursplayer .ktitel{flex:1;min-width:0;line-height:1.25}#kursplayer .ktitel b,#kursplayer .ktitel>span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        #kursplayer .kknopf{width:42px;height:42px;border-radius:50%;border:0;background:rgba(0,0,0,.07);font-size:19px;line-height:1;color:inherit;display:grid;place-items:center;cursor:pointer;flex:0 0 auto}
        #kursplayer .kknopf:focus-visible{outline:2px solid var(--lamp,#e8a33c);outline-offset:2px}
        #kursplayer #kbuehne{flex:1;min-height:0;display:flex;flex-direction:column;overflow-y:auto;padding:2px max(14px,env(safe-area-inset-right,0px)) 0 max(14px,env(safe-area-inset-left,0px));margin:0;border:0;border-radius:0}
        #kursplayer #kstage{flex:1 0 auto;justify-content:center}#kursplayer #kinfo{margin:0;font-size:.78em}#kursplayer #kinfo:empty{display:none}
        #kursplayer #kplay{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;padding:10px 0 calc(14px + env(safe-area-inset-bottom,0px))}#kursplayer #kplay .btn{min-width:42%}
        #kursplayer #kpanel{position:fixed;inset:0;z-index:45;background:var(--paper,#fbf3e4);color:var(--ink,#2a2118);overflow-y:auto;padding:calc(env(safe-area-inset-top,0px) + 8px) max(14px,env(safe-area-inset-right,0px)) calc(20px + env(safe-area-inset-bottom,0px)) max(14px,env(safe-area-inset-left,0px))}
        #kursplayer .kpkopf{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
        #kursplayer.d-a{background:#fbf3e4;color:#2a2118}#kursplayer.d-a .kkopf .muted{color:#7a6650}
        #kursplayer .kplay{display:flex;gap:6px}#kursplayer .kplay1{background:#e8a33c;color:#2a2118}
        #kursplayer .kgross{display:block;margin:6px auto calc(18px + env(safe-area-inset-bottom,0px));width:76px;height:76px;border-radius:50%;border:0;background:#e8a33c;color:#2a2118;font-size:32px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.25)}#kursplayer .kgross[hidden]{display:none}#kursplayer .kgross{display:grid;place-items:center;padding:0;line-height:0}#kursplayer .kgross svg{display:block}#kursplayer #kstart svg{margin-left:4px}
        #kursplayer #keinst{position:absolute;left:12px;right:12px;bottom:calc(92px + env(safe-area-inset-bottom,0px));z-index:6;background:rgba(15,36,51,.96);border:1px solid rgba(243,231,201,.18);border-radius:20px;padding:14px;display:flex;align-items:center;justify-content:space-around;gap:10px;box-shadow:0 10px 30px rgba(0,0,0,.5);color:#f3e7c9}#kursplayer #keinst[hidden]{display:none}
        #kursplayer .kekipp{display:grid;grid-template-columns:1fr 1fr;border:2px solid rgba(243,231,201,.25);border-radius:999px;overflow:hidden}#kursplayer .kekipp button{width:74px;height:62px;border:0;background:transparent;color:#5b6770;display:grid;place-items:center;cursor:pointer}#kursplayer .kekipp button svg{width:42px;height:36px}#kursplayer .kekipp button[aria-pressed="true"]{background:#e8a33c;color:#1a1a1a}
        #kursplayer .keharms{width:66px;height:66px;border-radius:18px;border:3px solid #e8a33c;background:rgba(232,163,60,.12);display:grid;place-items:center;cursor:pointer}#kursplayer .keharms svg{width:42px;height:42px}#kursplayer .keharms[aria-pressed="false"]{border-color:rgba(243,231,201,.2);background:transparent}#kursplayer .keharms[aria-pressed="false"] svg{filter:grayscale(1);opacity:.45}#kursplayer .kemehr{border:0;background:none;color:#f3e7c9;opacity:.75;font:700 .8rem inherit;text-decoration:underline;cursor:pointer}
        #kursplayer .kanim .an .t{stroke:rgba(255,255,255,.9);stroke-width:2.4px;stroke-linejoin:round;font-family:'Baloo 2',Nunito,system-ui,sans-serif;font-weight:700;letter-spacing:.01em}
        #kursplayer .kanim .an .t.cap{stroke:none;font-weight:800}#kursplayer .kanim .an .t.sub,#kursplayer .kanim .an .t.wort{display:none}
        #kursplayer.d-b .kanim{max-height:none;width:100%}#kursplayer.d-b .kanim .an{max-height:calc(100dvh - 120px)}
        #kursplayer .kanim.anstage{aspect-ratio:auto;height:auto;background:#f7f5ef}#kursplayer .kanim.anstage>svg{display:block;width:100%;height:auto}
        #kursplayer.d-b .kanim.anstage{border:0;border-radius:18px;box-shadow:0 10px 40px rgba(0,0,0,.45)}#kursplayer.d-b.mitbild #kbild{flex:1;display:flex;flex-direction:column;justify-content:center}
        #kursplayer.d-b #kges{display:block;position:relative;width:min(94vw,58dvh,520px);aspect-ratio:1;margin:0 auto;padding:0}
        #kursplayer.d-b #kges .kbg{position:absolute;inset:0;width:100%;height:100%}
        #kursplayer.d-b .kpl{position:absolute;transform:translate(-50%,-50%);width:20%;display:flex;flex-direction:column;align-items:center;gap:3px;transition:left .5s,top .5s}
        #kursplayer.d-b .kpl .kg{width:100%;height:auto;aspect-ratio:1;border:3px solid rgba(243,231,201,.18);background:#f2c68f;transition:transform .25s,box-shadow .25s}
        #kursplayer.d-b .kpl.katze{width:14%}#kursplayer.d-b .kpl.katze .kg{background:#f3e7c9}#kursplayer.d-b .kpl.gast .kg{background:#cfe2ea;border-style:dashed}#kursplayer.d-b .kpl.polizei .kg{border:3px solid #3d7bd9;box-shadow:0 0 0 4px rgba(61,123,217,.3)}#kursplayer.d-b .kbg .kblau{animation:kblau 1.2s ease-in-out infinite}@keyframes kblau{50%{opacity:.05}}
        #kursplayer.d-b .kpl .kn{font-size:11px;line-height:1.2;color:rgba(243,231,201,.85);white-space:nowrap;font-weight:700;background:rgba(15,36,51,.78);padding:1px 7px;border-radius:9px}
        #kursplayer.d-b .kpl.ksp .kg{transform:scale(1.13);border-color:#e8a33c;box-shadow:0 0 0 5px rgba(232,163,60,.35),0 0 26px rgba(232,163,60,.35)}#kursplayer.d-b .kpl.ksp .kn{color:#f3e7c9}
        #kursplayer.d-b.laeuft .kpl.ksp .kg{animation:kglow 2.4s ease-in-out infinite}@keyframes kglow{50%{box-shadow:0 0 0 9px rgba(232,163,60,.18),0 0 34px rgba(232,163,60,.45)}}
        #kursplayer.d-b:not(.mitlesen) #kspr .ktext,#kursplayer.d-b #kspr .kname{display:none}
        #kursplayer.d-b.mitbild #kges{width:0;height:0;aspect-ratio:auto;position:static}#kursplayer.d-b.mitbild #kges .kbg,#kursplayer.d-b.mitbild #kges .kbalken,#kursplayer.d-b.mitbild #kges .kpl:not(.ksp){display:none}
        #kursplayer.d-b.mitbild #kges .kpl.ksp{position:fixed;left:auto!important;top:auto!important;right:max(12px,env(safe-area-inset-right,0px));bottom:calc(12px + env(safe-area-inset-bottom,0px));transform:none;width:62px;z-index:3}#kursplayer.d-b.mitbild #kges .kpl.ksp .kn{display:none}#kursplayer.d-b.mitbild #kges .kpl.ksp{height:auto!important}#kursplayer.d-b.mitbild #kges .kpl.ksp .kg{transform:none;width:62px;height:62px;flex:none}
        #kursplayer.d-b.mitwahl #kbild{display:none}#kursplayer.d-b.mitwahl #kspr{display:none}
        @media (prefers-reduced-motion: reduce){#kursplayer .kpl,#kursplayer .kpl .kg{transition:none;animation:none!important}}
        #kursplayer.d-b{background:#0f2433;color:#f3e7c9}#kursplayer.d-b .kkopf .muted{color:rgba(243,231,201,.65)}#kursplayer.d-b .kkopf .kknopf{background:rgba(255,255,255,.1)}#kursplayer .kanim{max-height:58vh;margin:0 auto}
        #kursplayer #kstage{display:flex;flex-direction:column;gap:8px;margin-top:6px}#kursplayer #kges{display:none}#kursplayer #kspr:empty,#kursplayer #kbild:empty,#kursplayer #kwahl:empty,#kursplayer #kdenk:empty{display:none}
        #kursplayer .kg{width:74px;height:74px;border-radius:50%;overflow:hidden;background:#fffaf0;border:3px solid rgba(255,255,255,.28);flex:0 0 auto;transition:transform .2s,box-shadow .2s,width .2s,height .2s;display:grid;place-items:center}
        #kursplayer .kg svg{width:139%;margin:-22% 0 0 -19.5%;display:block;align-self:start;justify-self:start}#kursplayer .kgb{font:800 1.6em/1 'Baloo 2',system-ui,sans-serif;color:#6e4529}
        #kursplayer .kname{font-weight:800;font-size:.74em;letter-spacing:.06em;text-transform:uppercase}#kursplayer .kname .kgr{font-weight:600;letter-spacing:0;text-transform:none;opacity:.7}#kursplayer .ktext{font-size:1.08em;line-height:1.42;margin-top:2px}
        #kursplayer.mitwahl #kspr .ktext{display:none}
        #kursplayer.d-a #kbuehne{background:#fbf3e4;color:#2a2118}#kursplayer.d-a #kbuehne .muted,#kursplayer.d-a #kinfo{color:#7a6650}#kursplayer.d-a #kplay .btn.ghost,#kursplayer.d-a #kbuehne .btn.small.ghost{color:#2a2118;border-color:#d9c9a3;background:transparent}
        #kursplayer.d-a #kstage{min-height:52vh}
        #kursplayer.d-a #kges{display:flex;justify-content:center;align-items:center;gap:12px;padding:20px 10px 16px;border-radius:14px;background:linear-gradient(#8a5a36,#6e4529);box-shadow:inset 0 -6px 0 rgba(0,0,0,.12)}
        #kursplayer.d-a .kg.ksp{border-color:#e8a33c;box-shadow:0 0 0 5px rgba(232,163,60,.4);transform:scale(1.1)}
        #kursplayer.d-a #kspr{background:#fffaf0;border-radius:14px;padding:10px 12px;position:relative;box-shadow:0 2px 0 rgba(0,0,0,.08);color:#2a2118;font-size:1em}
        #kursplayer.d-a #kspr::before{content:"";position:absolute;top:-9px;left:50%;transform:translateX(-50%);border:9px solid transparent;border-top:0;border-bottom-color:#fffaf0}
        #kursplayer.d-a #kspr .kname{color:#8a5a36}
        #kursplayer.d-a.mitbild #kges,#kursplayer.d-a.mitwahl #kges{justify-content:flex-start;padding:6px 10px;gap:6px}#kursplayer.d-a.mitbild .kg,#kursplayer.d-a.mitwahl .kg{width:40px;height:40px;border-width:2px}
        #kursplayer.d-a.mitbild #kspr::before,#kursplayer.d-a.mitwahl #kspr::before{display:none}#kursplayer.d-a.mitbild .kanim{max-height:60vh}
        #kursplayer.d-a .kfrage{background:#fffaf0;border:0;border-top:6px solid #e8a33c;border-radius:6px;transform:rotate(-.5deg);box-shadow:0 3px 0 rgba(0,0,0,.12);color:#2a2118}
        #kursplayer.d-a .kopts{grid-template-columns:1fr 1fr}#kursplayer.d-a .kopt{flex-direction:column;gap:2px;min-height:86px;background:#fff;border:2px solid #e6d6bb;color:#2a2118}#kursplayer.d-a .kopt .kabc{min-width:0;color:#8a5a36;opacity:1}
        #kursplayer.d-b #kbuehne{background:#0f2433;color:#f3e7c9;border-color:#16334a}#kursplayer.d-b #kbuehne .muted,#kursplayer.d-b #kinfo{color:rgba(243,231,201,.68)}
        #kursplayer.d-b #kplay .btn.ghost{color:#f3e7c9;border-color:rgba(243,231,201,.4);background:transparent}
        #kursplayer.d-b #kstage{min-height:54vh;justify-content:center;text-align:center}
        #kursplayer.d-b .kring{position:relative;width:136px;height:136px;display:grid;place-items:center}
        #kursplayer.d-b .kring .kg{width:112px;height:112px;border:0;background:#f2c68f}
        #kursplayer.d-b .kring::before,#kursplayer.d-b .kring::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid rgba(232,163,60,.55);opacity:0}
        #kursplayer.d-b.laeuft .kring::before,#kursplayer.d-b.laeuft .kring::after{animation:kpuls 2.4s ease-out infinite}#kursplayer.d-b.laeuft .kring::after{animation-delay:1.2s}
        @keyframes kpuls{from{transform:scale(.85);opacity:1}to{transform:scale(1.35);opacity:0}}
        #kursplayer.d-b #kspr{max-width:30ch;margin:0 auto;color:#f3e7c9}#kursplayer.d-b #kspr .kname{font-size:.9em;letter-spacing:.08em;opacity:.85}#kursplayer.d-b #kspr .ktext{font-size:1.32em;line-height:1.38;margin-top:6px}
        #kursplayer.d-b .kdenk{color:#e8a33c}
        #kursplayer.d-b.mitwahl #kges{display:none}#kursplayer.d-b.mitbild #kbild{order:-1}#kursplayer.d-b.mitbild #kstage{justify-content:center}#kursplayer.d-b.mitbild #kspr{max-width:none;text-align:left}#kursplayer.d-b.mitbild #kspr .ktext{font-size:1.05em}#kursplayer.d-b.mitbild .kanim{max-height:none;width:100%;margin:0 auto;background:transparent;box-shadow:none}#kursplayer.d-b.mitbild .kanim.anstage>svg{width:100%;max-height:calc(100dvh - 150px);margin:0 auto;border-radius:18px;box-shadow:0 10px 40px rgba(0,0,0,.45)}
        #kursplayer.d-b .kfrage{background:#fbf3e4;color:#2a2118;border:0;border-radius:20px 20px 10px 10px;text-align:left;padding-top:16px;position:relative}
        #kursplayer.d-b .kfrage::before{content:"";position:absolute;top:6px;left:50%;width:38px;height:4px;margin-left:-19px;border-radius:2px;background:#d9c9a3}
        #kursplayer.d-b .kopt{background:#fff;color:#2a2118;border-color:#e2d4b6}#kursplayer.d-b .kopt .kabc{color:#2f6f8a;opacity:1}#kursplayer.d-b .kfrage .muted{color:#7a6650}
        @media (prefers-reduced-motion: reduce){#kursplayer .kring::before,#kursplayer .kring::after{animation:none!important}}#kursplayer.mitwahl #kspr .small{display:none}#kursplayer.mitwahl .kanim{max-height:30vh}
        #kursplayer .kfrage{border:2px solid var(--lamp, #e8a33c);border-radius:14px;padding:10px 12px;background:var(--card2, rgba(232,163,60,.08))}
        #kursplayer .kfrage{font-size:var(--kfs,1em)}#kursplayer .kfuss{transition:transform .6s ease,opacity .6s ease}#kursplayer .kfuss.weg{transform:translateY(115%);opacity:0;pointer-events:none}
        #kursplayer .kfkopf{display:flex;justify-content:space-between;align-items:center;gap:8px;font-weight:700;font-size:.9em;margin-bottom:6px}
        #kursplayer .kftext{font-size:1.06em;line-height:1.4}#kursplayer .kftext div{margin:2px 0}
        #kursplayer .kopts{display:grid;gap:6px;margin-top:8px}#kursplayer .kopt{display:flex;gap:10px;align-items:flex-start;text-align:left;width:100%;padding:10px 12px;border-radius:12px;border:1.5px solid var(--line, rgba(0,0,0,.18));background:var(--bg, #fff);color:inherit;font:inherit;cursor:pointer}
        #kursplayer .kopt .kabc{flex:0 0 auto;min-width:1.6em;font-size:1em;letter-spacing:.02em;opacity:.8;padding-top:1px}#kursplayer .kopt.ok{background:var(--stb-soft);border-color:var(--stb, #2e8b57)}#kursplayer .kopt.no{background:var(--bb-soft);border-color:var(--bb, #c0392b)}#kursplayer .kopt.gew{border-color:var(--lamp, #e8a33c);border-width:2.5px}#kursplayer [data-ab]{display:block;width:100%;text-align:left;margin:3px 0}#kursplayer .kreihe{display:flex;flex-wrap:wrap;gap:8px;align-items:center}#kursplayer .kreihe .chip{flex:0 0 auto}
        #kursplayer [data-ab][aria-pressed="true"] .muted{color:inherit;opacity:.85}#kursplayer .kh{margin:14px 0 4px}#kursplayer .krow{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid var(--line, rgba(0,0,0,.08))}#kursplayer .krow .btn{margin-left:4px}
        /* v5.54 Nachtbühne: Kein Text schiebt die Bühne (Nutzer: die Figuren sprangen). Wer spricht, leuchtet nur, wächst kaum */
        #kursplayer.d-b.laeuft:not(.mitlesen) #kspr{display:none}#kursplayer.d-b .kpl.ksp .kg{transform:scale(1.05)}
        /* Animation randlos über die ganze Breite, so hoch wie möglich; wer spricht, sitzt unten rechts im Bild */
        #kursplayer.d-b.mitbild #kbuehne{padding-left:0;padding-right:0}#kursplayer.d-b.mitbild #kstage{margin-top:0;gap:0}
        #kursplayer.d-b.mitbild #kbild{position:relative}#kursplayer.d-b.mitbild .kanim.anstage{width:100%;border-radius:0;box-shadow:none;background:transparent}
        #kursplayer.d-b.mitbild .kanim.anstage>svg{width:100%;height:auto;max-height:calc(100dvh - 64px);border-radius:0;box-shadow:none}
        #kursplayer.d-b.mitbild #kges .kpl.ksp{width:58px!important;right:max(8px,env(safe-area-inset-right,0px));bottom:calc(8px + env(safe-area-inset-bottom,0px))}
        #kursplayer.d-b .kbg .kwel{animation:kwel 6s linear infinite}@keyframes kwel{to{transform:translateX(-12px)}}
        #kursplayer.d-b .kbg .klicht{animation:klicht 4s ease-in-out infinite}@keyframes klicht{50%{opacity:.6}}
        /* v5.55 Feste Bühne: ein Quadrat in der Mitte der freien Fläche, Hintergrund randlos; kein Mitlesetext, kein Wippen (Nutzer: es ruckelt) */
        #kursplayer.d-b #kbuehne{padding-left:0;padding-right:0}#kursplayer.d-b #kstage{position:relative;flex:1 1 0;min-height:0;margin:0;overflow:hidden;container-type:size}
        #kursplayer.d-b #kspr{display:none!important}#kursplayer.d-b #kdenk{position:absolute;left:0;right:0;bottom:8px;z-index:2;text-align:center}
        #kursplayer.d-b:not(.mitbild):not(.mitwahl) #kges{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(100cqw,100cqh);height:min(100cqw,100cqh);max-width:none;aspect-ratio:auto;overflow:visible}
        #kursplayer.d-b #kges .kbg{position:absolute;left:50%;top:50%;width:250%;height:250%;transform:translate(-50%,-50%);overflow:visible;pointer-events:none}
        #kursplayer .kpl .ch.talking .bod{animation:none}#kursplayer.d-b .kpl.ksp .kg{transform:none}#kursplayer.d-b .kpl{transition:none}
        #kursplayer.d-b .kpl.koerper{transform:translate(-50%,-100%)}#kursplayer.d-b .kpl.koerper .kk{width:100%;aspect-ratio:100/147}#kursplayer.d-b .kpl.koerper .kk svg{width:100%;height:100%;display:block}
        #kursplayer.d-b .kpl.koerper .kn{position:absolute;top:100%;margin-top:2px}#kursplayer.d-b .kpl.koerper.ksp .kk{filter:drop-shadow(0 0 5px rgba(232,163,60,.9))}
        #kursplayer.d-b .kbg .kschaukel{transform-box:view-box;animation:kschauk 5s ease-in-out infinite}@keyframes kschauk{25%{transform:rotate(.8deg) translateY(.3px)}75%{transform:rotate(-.8deg) translateY(-.2px)}}
        #kursplayer.d-b .kbord{position:absolute;inset:0;animation:kbord 5s ease-in-out infinite}@keyframes kbord{25%{transform:rotate(.8deg) translateY(.3%)}75%{transform:rotate(-.8deg) translateY(-.2%)}}
        #kursplayer.d-b #kges[data-wx="windig"] .kbord,#kursplayer.d-b #kges[data-wx="regen"] .kbord{animation-duration:3.6s}#kursplayer.d-b #kges[data-wx="sturm"] .kbord{animation:kbord2 2.4s ease-in-out infinite}@keyframes kbord2{25%{transform:rotate(2.6deg) translateY(.8%)}75%{transform:rotate(-2.6deg) translateY(-.6%)}}
        #kursplayer.d-b.mitbild .kbord{animation:none!important;transform:none!important;position:static}
        #kursplayer.d-b.laeuft .kpl.ksp .kg{animation:none}
        #kursplayer.mitwahl #kstage,#kursplayer.mitbild #kstage{justify-content:flex-start;justify-content:safe center}
        #kursplayer .kharms{display:flex;align-items:center;gap:12px;margin:0 0 10px}#kursplayer .kharms .kg{width:64px;height:64px;flex:none;border-radius:50%;overflow:hidden;display:grid;background:#cfe2ea;border:3px solid #e8a33c}#kursplayer.d-b .kharms{color:#f3e7c9}
        #kursplayer.d-b .kpl.geht{animation:kgeht 1.1s ease-in forwards}
        #kursplayer.d-b g.kpl{transition:opacity 1s;transform:none!important;animation:none!important}#kursplayer.d-b g.kpl.geht{animation:none;opacity:0}
        #kursplayer.d-b g.kpl.kb.ksp>.kk>svg{filter:drop-shadow(0 0 .8px #e8a33c) drop-shadow(0 0 2px rgba(232,163,60,.85))}
        #kursplayer.d-b g.kpl .klr{stroke:transparent;stroke-width:.7}#kursplayer.d-b g.kpl.kl.ksp .klr{stroke:#e8a33c}
        #kursplayer.d-b:not(.mitbild) #kges .kpl.nurbild{display:none}
        #kursplayer.d-b #kges .kbalken{position:absolute;left:0;right:0;bottom:0;height:17%;background:rgba(8,20,30,.88);border-top:1px solid rgba(243,231,201,.16)}@keyframes kgeht{0%{transform:translate(-50%,-50%)}20%{transform:translate(-50%,-50%) rotate(-10deg)}40%{transform:translate(-50%,-50%) rotate(10deg)}60%{transform:translate(-50%,-50%) rotate(-6deg);opacity:1}100%{transform:translate(-50%,40%) scale(.5);opacity:0}}
        #kursplayer .kselbst{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0 2px}#kursplayer .kselbst .chip[aria-pressed="true"]{background:var(--lamp,#e8a33c);color:#1a1a1a;border-color:var(--lamp,#e8a33c)}#kursplayer.d-b .kselbst .chip{background:rgba(243,231,201,.1);color:#f3e7c9;border-color:rgba(243,231,201,.3)}#kursplayer.d-b .kselbst .chip[aria-pressed="true"]{background:#e8a33c;color:#1a1a1a;border-color:#e8a33c}
        #kursplayer.d-b #kges[data-wx="windig"] .kschaukel,#kursplayer.d-b #kges[data-wx="regen"] .kschaukel{animation-duration:3.6s}#kursplayer.d-b #kges[data-wx="sturm"] .kschaukel{animation:kschauk2 2.4s ease-in-out infinite}@keyframes kschauk2{25%{transform:rotate(2.6deg) translateY(.8px)}75%{transform:rotate(-2.6deg) translateY(-.6px)}}
        #kursplayer.d-b .kbg .kregen{animation:kregen .8s linear infinite}@keyframes kregen{to{transform:translate(-4px,14px)}}
        #kursplayer .kfuss{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px max(18px,env(safe-area-inset-right,0px)) calc(12px + env(safe-area-inset-bottom,0px)) max(18px,env(safe-area-inset-left,0px))}
        #kursplayer .kfuss .kgross{margin:0;width:64px;height:64px;font-size:26px}#kursplayer .kmod{font:700 .9em var(--body,inherit);border-radius:999px;padding:8px 12px;border:1.5px solid rgba(243,231,201,.35);background:rgba(255,255,255,.08);color:inherit;white-space:nowrap;cursor:pointer}#kursplayer.d-b .kfuss .kknopf{background:rgba(255,255,255,.1);color:#f3e7c9}
        /* Frage auf dem dunklen Grund: oben groß die Frage, darunter die Antworten als Karten, ohne hellen Zettel (Nutzer 08.11.2026) */
        #kursplayer.d-b.mitwahl #kstage{overflow-y:auto;padding:4px max(16px,env(safe-area-inset-right,0px)) 8px max(16px,env(safe-area-inset-left,0px))}
        #kursplayer.d-b .kfrage{background:transparent;color:#f3e7c9;border:0;border-radius:0;padding:4px 0 0;box-shadow:none;transform:none}#kursplayer.d-b .kfrage::before{display:none}
        #kursplayer.d-b .kfkopf{color:#e8a33c;font-size:.85em;letter-spacing:.06em;text-transform:uppercase}#kursplayer.d-b .kftext{font-family:'Baloo 2',Nunito,sans-serif;font-size:1.45em;line-height:1.3;font-weight:700;margin:6px 0 14px}
        #kursplayer.d-b .kftext div{font-size:.8em;font-weight:600}#kursplayer.d-b .kopts{grid-template-columns:1fr;gap:10px}
        #kursplayer.d-b .kopt{background:rgba(255,255,255,.07);color:#f3e7c9;border:1.5px solid rgba(243,231,201,.22);border-radius:14px;min-height:62px;padding:12px 14px;font-size:1.02em;align-items:center}
        #kursplayer.d-b .kopt .kabc{color:#e8a33c;font-weight:800;opacity:1}#kursplayer.d-b .kopt.ok{background:rgba(70,160,90,.35);border-color:#6fcf8a}#kursplayer.d-b .kopt.no{background:rgba(200,70,60,.35);border-color:#e0786c}
        #kursplayer.d-b .kfrage .muted,#kursplayer.d-b .kfrage .small{color:rgba(243,231,201,.7)}#kursplayer.d-b .kfrage [data-o="-1"]{color:rgba(243,231,201,.75);border-color:rgba(243,231,201,.3);background:transparent}
        #kursplayer.d-b.mitbild .kanim.anstage>svg{max-height:100cqh}
        #kursplayer .kausruf{position:absolute;left:12px;right:12px;top:8px;z-index:3;background:rgba(15,36,51,.9);color:#f3e7c9;border-radius:12px;padding:8px 12px;font-size:.92em;text-align:left}
        #kursplayer.d-b.mitbild #kges .kpl.ksp{bottom:calc(92px + env(safe-area-inset-bottom,0px))}
        @media (prefers-reduced-motion: reduce){#kursplayer.d-b .kbg *,#kursplayer.d-b .kbord{animation:none!important}}</style>`;
    const vollAus = () => { try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {} };
    $('#back').onclick = () => { stop(); vollAus(); setTab('cabin'); };
    /* Zahnrad: Einstellungen, Abschnitte und Erzeugen; ✕ oder die Zurück-Taste schließt (BACKS in index.html) */
    const panel = $('#kpanel');
    /* v5.62 (Nutzer 12.11.2026): Das kleine Zahnrad öffnet zwei Schalter: laut antworten oder nur hören, Harms am Ende. „Mehr …“ öffnet das alte Fenster (Abschnitte, Erzeugen) */
    const einst = $('#keinst'), einstZeigen = () => { const kk = cfgK(); einst.querySelectorAll('[data-ek]').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.ek === 'reden') === !!S.cfg.zuruf))); $('#keharms').setAttribute('aria-pressed', String(kk.harms !== false)); };
    $('#kzahn').onclick = () => { einst.hidden = !einst.hidden; if (!einst.hidden) { einstZeigen(); fussZeigen(); } };
    einst.querySelectorAll('[data-ek]').forEach(b => b.onclick = () => { S.cfg.zuruf = b.dataset.ek === 'reden' && zurufMoeglich(); if (S.cfg.zuruf && window.VOX && VOX.phoneUnlock) VOX.phoneUnlock(); save(); einstZeigen(); const z = ui('#kzr'); if (z) z.setAttribute('aria-pressed', String(!!S.cfg.zuruf)); if (lauf) { if (S.cfg.zuruf) zurufStart(lauf); else if (typeof zurufStop === 'function') zurufStop(lauf); } });
    $('#keharms').onclick = () => { const kk = cfgK(); kk.harms = kk.harms === false; save(); einstZeigen(); };
    $('#kemehr').onclick = () => { einst.hidden = true; panel.hidden = false; panel.scrollTop = 0; };
    /* Szene wiederholen: den aktuellen (sonst den zuletzt gehörten) Abschnitt von vorn */
    $('#kwdh').onclick = () => { if (!st) return; const k = lauf && lauf.abK != null ? lauf.abK : letzteAbK, g = lauf ? lauf.gratis : !!(st.luecke || st.ersterFehlt); panel.hidden = true; AUD.unlock(); spiele(st, k || 0, g); };
    $('#kzu').onclick = () => { panel.hidden = true; };
    /* ⛶ blendet auch die Leisten des Browsers aus, wo das Handy es erlaubt */
    /* v5.61 (Nutzer 11.11.2026): links unten zurück: pausieren und zur Reisekarte (bis sie gebaut ist: Liste der Folgen am Kartentisch) */
    $('#kkarte').onclick = () => { stop(); vollAus(); if (typeof hoerreiseWahl === 'function') hoerreiseWahl(); else setTab('cabin'); };
    /* Leiste unten verschwindet nach 15 Sekunden ohne Berühren; ein Finger im unteren Viertel holt sie zurück. Nur Verschieben, kein neues Layout: die Bühne springt nicht */
    $('#kursplayer').addEventListener('pointerdown', e => { const f = ui('.kfuss'); if (!f) return; if (!f.classList.contains('weg') || e.clientY > window.innerHeight * .75) fussZeigen(); }, true);
    fussZeigen();
    /* Frage so groß wie möglich: die längste Frage der Folge bestimmt die Schrift für alle */
    window.addEventListener('resize', () => { if (st && document.getElementById('kursplayer')) frageGroesse(st); });
    const info = t => { const e = $('#kinfo'); if (e) e.textContent = t; }, ginfo = t => { const e = $('#kginfo'); if (e) e.textContent = t; };
    const k = cfgK();
    /* v5.62 (Nutzer 12.11.2026): Es gibt nur noch „In Fahrt“; Antworten tippen geht trotzdem */
    if (k.modus !== 'auto') { k.modus = 'auto'; save(); }
    const chips = () => {
      document.querySelectorAll('#kursplayer [data-mod]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mod === k.modus)));
      $('#ktem').value = String(k.tempo || 1);
      $('#kmodtxt').textContent = k.modus === 'auto' ? '⛵ In Fahrt: für Auto, Rad oder Gym. Läuft durch, du antwortest laut (🎙️ Mitreden, Bildschirm an). Aufgaben zum Anfassen landen in der Reisekarte für später.' : '⚓ Vor Anker: für den Tisch. Antwort tippen oder sagen, sie zählt in deiner Statistik; Aufgaben gleich mitmachen. Bei falscher Antwort erklärt die Crew es nochmal anders.';
      const m = $('#kmod'); if (m) { m.textContent = k.modus === 'auto' ? '⛵ In Fahrt' : '⚓ Vor Anker'; m.setAttribute('aria-label', 'Modus: ' + m.textContent + ' (antippen zum Umschalten)'); }
    };
    const modus = m => { k.modus = m; if (m === 'auto' && zurufMoeglich()) { S.cfg.zuruf = true; if (window.VOX && VOX.phoneUnlock) VOX.phoneUnlock(); const z = ui('#kzr'); if (z) z.setAttribute('aria-pressed', 'true'); if (lauf) zurufStart(lauf); } save(); chips(); };
    document.querySelectorAll('#kursplayer [data-mod]').forEach(b => b.onclick = () => modus(b.dataset.mod));
    $('#kmod').onclick = () => modus(k.modus === 'auto' ? 'interaktiv' : 'auto');
    $('#ktem').onchange = e => { k.tempo = +e.target.value; save(); if (lauf && lauf.audio) lauf.audio.playbackRate = k.tempo; };
    const mitKl = () => document.getElementById('kursplayer')?.classList.toggle('mitlesen', !!k.mitlesen);
    $('#kzfrueh').checked = k.zurufFrueh !== false; $('#kzfrueh').onchange = e => { k.zurufFrueh = e.target.checked; save(); };
    $('#kmit').checked = !!k.mitlesen; $('#kmit').onchange = e => { k.mitlesen = e.target.checked; save(); mitKl(); }; mitKl();
    $('#ktick').checked = k.ticken !== false; $('#ktick').onchange = e => { k.ticken = e.target.checked; save(); };
    chips();
    /* Aussehen: je Folge vorgesehen (FOLGEN[id].design), auf dem Gerät umstellbar (S.cfg.kurs.aussehen {id: a|b|s}, Standard leer, R7) */
    const ausWahl = () => ((k.aussehen || {})[id]) || f.design || (id === 'probe' ? 's' : 'b');   /* v5.52: Nachtbühne ist Standard (Nutzer 08.11.2026) */
    const ausChips = () => document.querySelectorAll('#kursplayer [data-aus]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.aus === aussehenAkt)));
    buehnenCrew = []; aussehenSetzen(ausWahl()); ausChips();
    document.querySelectorAll('#kursplayer [data-aus]').forEach(b => b.onclick = () => { k.aussehen = k.aussehen || {}; k.aussehen[id] = b.dataset.aus; save(); aussehenSetzen(b.dataset.aus); ausChips(); });
    let st;
    try { st = await laden(id); st.id = id; } catch (e) { return info('Ging nicht: ' + (e.message || e)); }
    const zahl = n => Math.round(n).toLocaleString('de-DE'), uhr = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
    const haupt = st.abschnitte.filter(a => !a.karte), gesamtSek = haupt.reduce((s, a) => s + a.sek, 0);
    $('#kdauer').textContent = ` · etwa ${Math.round(gesamtSek / 60)} Minuten`;
    setTimeout(() => frageGroesse(st), 60);
    let probeA = null;
    const probeAus = () => { if (probeA) { probeA.pause(); URL.revokeObjectURL(probeA.src); probeA = null; } };
    const neu = async () => {
      const b = await bestand(st), fehltAb = new Set(b.offen.filter(it => !it.rueck).map(it => it.ab));
      const sfxDa = await Promise.all(st.sfx.map(g => istDa(st, g)));
      /* Abschnitte zum Springen: nur die fertigen */
      /* Abschnitte zum Springen; was noch nicht erzeugt ist, spielt die Gratis-Stimme */
      $('#kab').innerHTML = st.items.map((it, i) => it.t !== 'abschnitt' ? '' : `<button class="chip" data-ab="${i}"${fehltAb.has(it.ab) ? ' data-gratis="1"' : ''}>${esc(it.titel)} <span class="muted">· ${uhr((st.abschnitte.find(a => a.nr === it.ab) || {}).sek || 0)}${fehltAb.has(it.ab) ? ', Gratis-Stimme' : ''}</span></button>`).join('');
      document.querySelectorAll('#kursplayer [data-ab]').forEach(x => x.onclick = () => { probeAus(); AUD.unlock(); if (x.dataset.gratis && VOX.phoneUnlock) VOX.phoneUnlock(); spiele(st, +x.dataset.ab, !!x.dataset.gratis); });
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
      st.ersterFehlt = !erster || fehltAb.has(erster.nr); st.luecke = fehltAb.size > 0;
      if (!st.ersterFehlt) info(fehltAb.size ? 'Bereit. „▶ Abspielen“ endet vor dem ersten Abschnitt, der noch fehlt; „🗣️ Ganz hören“ liest den Rest mit der Gratis-Stimme.' : 'Bereit.');
      else info(st.pub ? 'Für diese Fassung fehlen Teile. Zum Testen liest die Gratis-Stimme des Handys.' : 'Noch keine echten Stimmen. Zum Testen liest die Gratis-Stimme des Handys (kostet nichts). Echte Stimmen: ⚙️ oben rechts, dann „Erzeugen“.');
      if (!lauf) zeigeSteuerung(st, false);
    };
    try { await nachladen('boot.js'); } catch (e) {}
    /* Wetter der Geschichte: aus der Folge (FOLGEN.wetter, sonst HOERREISE in index.html), Szenen können es ändern */
    { let hr = null; try { hr = typeof HOERREISE !== 'undefined' ? HOERREISE.find(x => x[0] === st.id) : null; } catch (e) {} folgeWetter = (FOLGEN[st.id] && FOLGEN[st.id].wetter) || (hr && hr[3]) || null; szeneWetter = null; szeneZeit = null; szeneProps = {}; szeneArt = 'deck'; }
    buehnenCrew = (st.anBord || ['HINNERK', 'SMILLA']).slice(); if (aussehenAkt === 'a') buehnenCrew = buehnenCrew.filter(w => w !== 'BACKBORD');
    { const g = ui('#kges'); if (g) { g.innerHTML = ''; g.dataset.w = ''; g.dataset.gast = ''; } gesichter(null); }
    await neu();
    /* Design-Test: beide Folgen mit einem Knopf vertonen (oben in der Bühne, nur mit Schlüssel) */
    const paar = async () => {
      const box = $('#kpaarbox'); if (!box) return; box.innerHTML = '';
      if (!TESTPAAR.includes(id)) return;
      if (!elKey()) { box.innerHTML = '<p class="small muted" style="margin:6px 0 0">Mit deinem ElevenLabs-Schlüssel (Einstellungen → Werkstatt → Schlüssel) kannst du hier Folge 2 und 3 mit einem Knopf vertonen.</p>'; return; }
      let o; try { o = await offenMehrere(TESTPAAR); } catch (e) { return; }
      if (!o.auftrag.length) { box.innerHTML = '<p class="small muted" style="margin:6px 0 0">✅ Folge 2 und 3 sind vertont.</p>'; return; }
      box.innerHTML = `<button class="btn ki wide" id="kpaar" style="margin-top:8px">🎙️ Folge 2 und 3 vertonen (etwa ${zahl(o.zeichen + o.sfxCr)} Credits)</button><p class="status small" id="kpaarinfo" style="margin:4px 0 0"></p>`;
      $('#kpaar').onclick = async () => {
        stop(); probeAus(); const b = $('#kpaar'); b.disabled = true; const pi = x => { const e = $('#kpaarinfo'); if (e) e.textContent = x; };
        try { await vertoneMehrere(TESTPAAR, pi); } catch (e) { pi('Ging nicht: ' + (e.message || e.code || e)); }
        b.disabled = false; try { st = await laden(id); st.id = id; } catch (e) {} await neu(); const war = $('#kpaarinfo') && $('#kpaarinfo').textContent; await paar(); const e2 = $('#kpaarinfo'); if (e2 && war) e2.textContent = war; else if (war) { const p = $('#kpaarbox'); if (p) p.insertAdjacentHTML('beforeend', `<p class="small" style="margin:4px 0 0">${esc(war)}</p>`); }
      };
    };
    paar();
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
      try { st = await laden(id); st.id = id; await neu(); } catch (x) {}
      $('#kvoice').click();
    };
    $('#kzip').onclick = () => zipSpeichern(st, ginfo).catch(e => ginfo('Ging nicht: ' + (e.message || e)));
    $('#kcast').onclick = () => { stop(); probeAus(); if (typeof castingOeffnen === 'function') castingOeffnen(); else renderSettings(); };
    /* Wächter: Wer den Bildschirm verlässt (Zurück-Taste, anderer Reiter), beendet die Wiedergabe */
    const root = $('#kursplayer'), w = setInterval(() => { if (!document.body.contains(root)) { clearInterval(w); if (!lauf || lauf.root === root) stop(); probeAus(); } }, 400);
    /* Autostart (nächste Folge im Auto-Modus, ⏭ am Ende): echte Stimmen, wo es sie gibt, sonst die Gratis-Stimme */
    if (opt.start) { const gratis = opt.gratis || st.ersterFehlt; spiele(st, 0, !!gratis); }
  }

  if (typeof window !== 'undefined') window.KURS = {oeffnen, zerlege, stop, animZeigen,
    /* nur für Tests: Szene setzen und einen Sprecher zeigen */
    _test(text, wer, crew) { if (crew) buehnenCrew = crew; szeneArt = ''; szeneSetzen(text); const g = ui('#kges'); if (g) { g.dataset.gast = ''; gesichter(wer || null); } }};
  if (typeof module !== 'undefined') module.exports = {zerlege};
})();

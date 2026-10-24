/* Podcast-Hörprobe (Entwickler): spricht ein Testskript aus podcast/skripte/ mit ElevenLabs Text to Dialogue
   (PODCAST_BIBLE.md A27). Nutzt den Schlüssel auf dem Gerät, kostet Credits. Das Ergebnis lässt sich anhören und
   als MP3 speichern, damit der Nutzer es ins Repo (Ordner import/) hochladen kann.
   Regie: [[INTENTION]], [[PAUSE]], [[TEMPO]] und [[AUDIO]] werden zu Audio-Tags aus podcast/audio_config.json
   (Kandidaten, genau dafür ist der Test), alle anderen Codes fallen weg; Anfragen werden an [[PAUSE: dramatisch]]
   und spätestens bei max_zeichen geteilt, die neue Anfrage beginnt dann mit dem Pausen-Tag.
   Aussprache: Originalschreibweise (erster Schritt aus A19). */
(function () {
  const CODE = /\[\[\s*([A-ZÄÖÜ]+)\s*(?::\s*([^\]]*?))?\s*\]\]/g;
  /* Skript (Ebene A) → Anfragen (Ebene C): [[{text, voice_id}]] */
  function zerlege(txt, cfg) {
    const fig = cfg.figuren || {}, max = (cfg.chunking && cfg.chunking.max_zeichen) || 2000;
    let zeilen = txt.split('\n'), i = 0;
    if (zeilen[0] && zeilen[0].trim() === '---') { i = 1; while (i < zeilen.length && zeilen[i].trim() !== '---') i++; i++; }
    const TAGS = {INTENTION: cfg.intentionen, PAUSE: cfg.pause_tags, TEMPO: cfg.tempo_tags, AUDIO: cfg.audio_tags};
    const tagVon = (kat, wert) => { const e = (TAGS[kat] || {})[(wert || '').trim()]; return e ? e.tag : ''; };
    const teile = [[]]; let n = 0, fehler = [], vorweg = '';
    for (; i < zeilen.length; i++) {
      const z = zeilen[i].trim();
      if (!z || z.startsWith('#') || /^<!--.*-->$/.test(z)) continue;
      const m = z.match(/^([A-ZÄÖÜ][A-ZÄÖÜ0-9_]*):\s*(.*)$/);
      if (!m) { if (/\[\[\s*PAUSE\s*:\s*dramatisch\s*\]\]/.test(z) && teile[teile.length - 1].length) { teile.push([]); n = 0; vorweg = tagVon('PAUSE', 'dramatisch'); } continue; }
      const f = fig[m[1]];
      if (!f || !f.voice_id) { if (!fehler.includes(m[1])) fehler.push(m[1]); continue; }
      let text = m[2].replace(CODE, (_, kat, wert) => ' ' + tagVon(kat, wert) + ' ').replace(/\s+/g, ' ').trim();
      if (!text) continue;
      if (vorweg) { text = vorweg + ' ' + text; vorweg = ''; }
      if (n && n + text.length > max) { teile.push([]); n = 0; }
      teile[teile.length - 1].push({text, voice_id: f.voice_id}); n += text.length;
    }
    return {teile: teile.filter(t => t.length), fehler};
  }
  async function erzeuge(skript, modell, status, ziel) {
    const sag = t => { if (status) status.textContent = t; };
    if (!elKey()) return sag('Kein ElevenLabs-Schlüssel eingetragen.');
    if (!(await kiEinwilligung())) return sag('Ohne Einwilligung kein Test.');
    sag('Lade Skript …');
    const [cfg, txt] = await Promise.all([fetch('podcast/audio_config.json?v=' + Date.now()).then(r => r.json()), fetch('podcast/skripte/' + skript + '?v=' + Date.now()).then(r => { if (!r.ok) throw new Error(`Skript fehlt (HTTP ${r.status})`); return r.text(); })]);
    /* Stimmen aus dem Casting auf diesem Gerät gehen vor (S.cfg.casting, casting.js) */
    for (const [id, v] of Object.entries((S.cfg && S.cfg.casting) || {})) if (v && v.id && (!(cfg.figuren[id] || {}).voice_id || v.cfg === cfg.figuren[id].voice_id)) cfg.figuren[id] = {...(cfg.figuren[id] || {}), voice_id: v.id};
    const {teile, fehler} = zerlege(txt, cfg);
    if (fehler.length) return sag(`Noch keine Stimme für: ${fehler.join(', ')}. Bitte erst im Stimmen-Casting zuordnen.`);
    const zeichen = teile.reduce((s, t) => s + t.reduce((a, b) => a + b.text.length, 0), 0);
    if (!confirm(`Hörprobe mit ${modell}: ${teile.length} Anfragen, etwa ${zeichen} Zeichen (so viele Credits ungefähr). Erzeugen?`)) return sag('Abgebrochen.');
    const blobs = [];
    for (const [k, inputs] of teile.entries()) {
      sag(`Erzeuge Teil ${k + 1} von ${teile.length} …`);
      const body = {inputs, model_id: modell, language_code: 'de'};
      let r = await fetchT(`${EL_BASE}/v1/text-to-dialogue?output_format=mp3_44100_128`, {method: 'POST', headers: {'xi-api-key': elKey(), 'content-type': 'application/json', accept: 'audio/mpeg'}, body: JSON.stringify(body)}, 120000);
      if (r.status === 400 || r.status === 422) {   /* falls das Modell language_code nicht kennt: einmal ohne */
        delete body.language_code;
        r = await fetchT(`${EL_BASE}/v1/text-to-dialogue?output_format=mp3_44100_128`, {method: 'POST', headers: {'xi-api-key': elKey(), 'content-type': 'application/json', accept: 'audio/mpeg'}, body: JSON.stringify(body)}, 120000);
      }
      if (!r.ok) { const d = await errDetail(r); LOG.add('hoerprobe', `HTTP ${r.status} ${d.status || ''} ${d.msg || ''}`); return sag(`Fehler bei Teil ${k + 1}: HTTP ${r.status} ${d.msg || d.status || ''}`); }
      blobs.push(await r.blob());
    }
    const mp3 = new Blob(blobs, {type: 'audio/mpeg'}), url = URL.createObjectURL(mp3), name = `hoerprobe-${skript.replace(/\.md$/, '')}-${modell}.mp3`;
    ziel.insertAdjacentHTML('beforeend', `<div class="hpr" style="margin-top:8px"><p class="small" style="margin:0 0 4px"><b>${modell}</b> · ${teile.length} Teile · ${zeichen} Zeichen</p><audio controls src="${url}" style="width:100%"></audio><a class="btn ghost small" download="${name}" href="${url}">MP3 speichern</a></div>`);
    sag('Fertig. Anhören, dann gern speichern und auf GitHub in den Ordner import hochladen.');
  }
  if (typeof window !== 'undefined') window.HOERPROBE = {zerlege, erzeuge};
  if (typeof module !== 'undefined') module.exports = {zerlege};
})();

/* Stimmen-Casting (Entwickler, PODCAST_STATUS.md B76): Jede Rolle aus podcast/casting.json stellt sich mit einem kurzen
   Satz vor, gesprochen von einer Stimme aus dem ElevenLabs-Konto (Eleven v4, Text to Dialogue, Schlüssel auf dem Gerät).
   Neue Stimmen sagen vorher ihren Namen. Deutsche Stimmen aus der ElevenLabs-Bibliothek lassen sich gratis anhören
   (Hörbeispiel) und ins Konto holen. Die Zuordnung bleibt auf dem Gerät (S.cfg.casting) und wird als Text an Claude
   geschickt, der sie in podcast/audio_config.json einträgt. */
(function () {
  const cache = new Map();   /* Rolle|Stimme → Blob-URL, nochmal hören kostet nichts */
  let cfg = null, cast = null, stimmen = [], rolle = null, bib = null, laeuft = null, okKosten = false;
  const zuord = () => (S.cfg.casting = S.cfg.casting || {});
  /* Die Wahl auf dem Gerät gilt, solange die Konfiguration seitdem gleich geblieben ist (Feld cfg). Hat Claude eine neuere Stimme
     eingetragen (z. B. Quirin = Alexander), gewinnt die Konfiguration. Ältere Einträge ohne cfg gelten nur, wo die Konfiguration nichts hat. */
  const gilt = (z, k) => z && z.id && (!k || z.cfg === k);
  const ist = id => { const k = cfg.figuren[id] && cfg.figuren[id].voice_id, z = zuord()[id]; return gilt(z, k) ? z : (k ? {id: k, name: 'bisher'} : null); };

  async function laden() {
    if (!cast) [cfg, cast] = await Promise.all(['podcast/audio_config.json', 'podcast/casting.json'].map(u => fetch(u + '?v=' + Date.now()).then(r => { if (!r.ok) throw new Error(`${u} fehlt (HTTP ${r.status})`); return r.json(); })));
    stimmen = await VOX.listVoices(true);
  }
  function stop() { if (laeuft) { laeuft.pause(); laeuft = null; } }
  function spiel(url) { stop(); laeuft = new Audio(url); laeuft.play().catch(() => {}); return new Promise(res => { laeuft.onended = res; laeuft.onerror = res; }); }

  /* Satz einer Rolle mit einer Stimme erzeugen (kostet Credits) oder aus dem Speicher holen */
  async function probe(r, v, info) {
    const key = r.id + '|' + v.id;
    if (cache.has(key)) return cache.get(key);
    if (!okKosten && !confirm('Jede neue Probe kostet etwa 150 Credits (einmal pro Rolle und Stimme, danach gratis). Weiter?')) throw new Error('abgebrochen');
    okKosten = true;
    const neu = !(ist(r.id) && ist(r.id).id === v.id);
    const text = (neu ? cast.vorspann.replace('{name}', v.name) + ' ' : '') + r.satz;
    info(`${v.name} spricht …`);
    const res = await fetchT(`${EL_BASE}/v1/text-to-dialogue?output_format=mp3_44100_128`, {method: 'POST', headers: {'xi-api-key': elKey(), 'content-type': 'application/json', accept: 'audio/mpeg'}, body: JSON.stringify({inputs: [{text, voice_id: v.id}], model_id: cfg.modell.id || 'eleven_v4', language_code: 'de'})}, 60000);
    if (!res.ok) { const d = await errDetail(res); LOG.add('casting', `HTTP ${res.status} ${d.status} ${d.msg}`); throw new Error(`HTTP ${res.status} ${d.msg || d.status}`); }
    const url = URL.createObjectURL(await res.blob()); cache.set(key, url); return url;
  }

  function zeile(v, r) {
    const l = v.labels || {}, tags = [l.gender, l.age, l.accent, l.description || l.descriptive, l.use_case].filter(Boolean).join(' · ');
    const gewaehlt = ist(r.id) && ist(r.id).id === v.id, gehoert = cache.has(r.id + '|' + v.id);
    return `<div style="margin:6px 0;padding:8px;border-radius:12px;border:1px solid var(--line);${gewaehlt ? 'background:rgba(240,180,60,.25)' : ''}">
      <b>${esc(v.name)}</b>${gewaehlt ? ' ✔' : ''} <small class="muted">${esc(tags || v.cat || '')}</small>
      <div style="display:flex;gap:6px;margin-top:6px"><button class="btn ${gehoert ? 'ghost' : 'ki'} small" style="flex:1" data-pr="${v.id}">${gehoert ? '▶ nochmal' : '▶ Probe'}</button>
      <button class="btn ghost small" style="flex:1" data-nimm="${v.id}">nehmen</button></div></div>`;
  }
  function rolleSeite(w) {
    const r = cast.rollen.find(x => x.id === rolle), a = ist(r.id);
    const eigen = stimmen.slice().sort((x, y) => (a && y.id === a.id) - (a && x.id === a.id) || x.name.localeCompare(y.name));
    w.querySelector('#cst').innerHTML = `<p class="small" style="margin:6px 0"><b>${esc(r.name)}</b>: „${esc(r.satz.replace(/\[[^\]]*\]\s*/g, ''))}“</p>
      <p class="small muted" style="margin:0 0 6px">Jetzt: <b>${a ? esc(a.name === 'bisher' ? (stimmen.find(v => v.id === a.id) || {name: 'Stimme aus dem Paket'}).name : a.name) : 'noch keine'}</b>${r.wunsch ? ` · Wunsch: <b>${esc(r.wunsch)}</b>` + (stimmen.some(v => v.name.toLowerCase().startsWith(r.wunsch.toLowerCase())) ? '' : ` <button class="btn ghost small" data-such="${esc(r.wunsch)}">🔎 in der Bibliothek suchen</button>`) : ''}${(r.vorschlaege || []).length ? ` · Vorschläge: ${r.vorschlaege.map(n => `<button class="btn ghost small" data-such="${esc(n)}">🔎 ${esc(n)}</button>`).join(' ')}` : ''}</p>
      ${eigen.map(v => zeile(v, r)).join('') || '<p class="small muted">Keine Stimmen im Konto gefunden.</p>'}
      <button class="btn ghost small" data-idein="1" style="margin-top:6px">🆔 Stimme per ID eintragen</button>`;
    w.querySelectorAll('[data-pr]').forEach(b => b.onclick = async () => {
      const v = stimmen.find(x => x.id === b.dataset.pr);
      try { const url = await probe(r, v, t => info(w, t)); info(w, ''); rolleSeite(w); await spiel(url); }
      catch (e) { info(w, e.message === 'abgebrochen' ? '' : 'Ging nicht: ' + (e.message || e.code)); }
    });
    w.querySelectorAll('[data-such]').forEach(b => b.onclick = () => { w.querySelector('#cbq').value = b.dataset.such; w.querySelector('details').open = true; bibliothek(w); w.querySelector('#cbib').scrollIntoView({behavior: 'smooth'}); });
    w.querySelectorAll('[data-nimm]').forEach(b => b.onclick = () => {
      const v = stimmen.find(x => x.id === b.dataset.nimm); zuord()[r.id] = {id: v.id, name: v.name, cfg: (cfg.figuren[r.id] || {}).voice_id || null}; save(); rolleSeite(w); chips(w);
    });
    const idb = w.querySelector('[data-idein]'); if (idb) idb.onclick = () => {
      const id = (prompt('Voice-ID der Stimme (aus ElevenLabs, z. B. hJAaR77ekN23CNyp0byH):') || '').trim(); if (!/^\w{10,40}$/.test(id)) return;
      zuord()[r.id] = {id, name: (stimmen.find(x => x.id === id) || {name: 'ID ' + id.slice(0, 6)}).name, cfg: (cfg.figuren[r.id] || {}).voice_id || null}; save(); rolleSeite(w); chips(w);
    };
  }
  function chips(w) {
    w.querySelector('#crl').innerHTML = cast.rollen.map(r => `<button class="chip" aria-pressed="${r.id === rolle}" data-rl="${r.id}" style="margin:2px">${gilt(zuord()[r.id], (cfg.figuren[r.id] || {}).voice_id) ? '✔ ' : ''}${esc(r.name.replace(/ \(.*\)$/, ''))}</button>`).join('');
    w.querySelectorAll('[data-rl]').forEach(b => b.onclick = () => { rolle = b.dataset.rl; chips(w); rolleSeite(w); });
  }
  const info = (w, t) => { const e = w.querySelector('#csi'); if (e) e.textContent = t; };

  /* Vorstellungsrunde: alle zugeordneten Rollen nacheinander */
  async function runde(w) {
    for (const r of cast.rollen) {
      const a = ist(r.id); if (!a) continue;
      const v = stimmen.find(x => x.id === a.id) || {id: a.id, name: a.name};
      try { const url = await probe(r, v, t => info(w, t)); info(w, r.name); await spiel(url); } catch (e) { info(w, e.message === 'abgebrochen' ? '' : 'Ging nicht: ' + (e.message || e.code)); return; }
    }
    info(w, 'Runde fertig.');
  }

  /* Deutsche Stimmen aus der ElevenLabs-Bibliothek: Hörbeispiel gratis, auf Wunsch ins Konto holen */
  async function bibliothek(w, seite = 0) {
    const el = w.querySelector('#cbib'); el.innerHTML = '<p class="small muted">Lade …</p>';
    const g = w.querySelector('#cbg').value, q = w.querySelector('#cbq').value.trim();
    const r = await fetchT(`${EL_BASE}/v1/shared-voices?language=de&page_size=20&page=${seite}${g ? '&gender=' + g : ''}${q ? '&search=' + encodeURIComponent(q) : ''}`, {headers: {'xi-api-key': elKey()}}, 20000);
    if (!r.ok) { const d = await errDetail(r); el.innerHTML = `<p class="small">Bibliothek ging nicht: HTTP ${r.status} ${esc(d.msg || '')}</p>`; return; }
    bib = (await r.json()).voices || [];
    if (!bib.length) { el.innerHTML = `<p class="small">Nichts gefunden${q ? ` für „${esc(q)}“` : ''}.</p>`; return; }
    el.innerHTML = bib.map((v, i) => `<div style="margin:6px 0;padding:8px;border-radius:12px;border:1px solid var(--line)"><b>${esc(v.name)}</b> <small class="muted">${esc([v.gender, v.age, v.accent, v.use_case, (v.description || '').slice(0, 80)].filter(Boolean).join(' · '))}</small>
      <div style="display:flex;gap:6px;margin-top:6px">${v.preview_url ? `<button class="btn ghost small" style="flex:1" data-bh="${i}">▶ gratis</button>` : ''}<button class="btn ghost small" style="flex:1" data-bn="${i}">➕ holen</button></div></div>`).join('')
      + `<div class="row"><button class="btn ghost small" id="cbw">Weitere Stimmen</button></div>`;
    el.querySelectorAll('[data-bh]').forEach(b => b.onclick = () => spiel(bib[+b.dataset.bh].preview_url));
    el.querySelectorAll('[data-bn]').forEach(b => b.onclick = async () => {
      const v = bib[+b.dataset.bn];
      const q = await fetchT(`${EL_BASE}/v1/voices/add/${v.public_owner_id}/${v.voice_id}`, {method: 'POST', headers: {'xi-api-key': elKey(), 'content-type': 'application/json'}, body: JSON.stringify({new_name: v.name})}, 20000);
      if (!q.ok) { const d = await errDetail(q); b.textContent = 'ging nicht'; LOG.add('casting', `holen HTTP ${q.status} ${d.msg}`); info(w, d.perm ? 'Deinem ElevenLabs-Schlüssel fehlt das Recht „Voices: Schreiben“. Auf elevenlabs.io → API Keys → Schlüssel bearbeiten → bei Voices „Write“ erlauben. Oder die Stimme auf der Website in der Voice Library mit „Add to my voices“ holen.' : `Holen ging nicht: HTTP ${q.status} ${d.msg || ''}`); return; }
      b.textContent = '✔ geholt'; stimmen = await VOX.listVoices(true); if (rolle) rolleSeite(w); info(w, `${v.name} ist jetzt in deinem Konto. Oben bei der Rolle „nehmen“ tippen.`);
    });
    el.querySelector('#cbw').onclick = () => bibliothek(w, seite + 1);
  }

  function zuordnungText() {
    return 'Stimmen-Casting Kajütenfunk\n' + cast.rollen.map(r => { const a = ist(r.id); const n = a ? (a.name === 'bisher' ? (stimmen.find(v => v.id === a.id) || {name: 'bisher'}).name : a.name) : '–'; return `${r.id}: ${n}${a ? ' (' + a.id + ')' : ''}`; }).join('\n');
  }

  async function oeffnen() {
    if (!elKey()) return toast('Kein ElevenLabs-Schlüssel eingetragen.');
    if (!(await kiEinwilligung())) return;
    const w = sheet(`<h3 style="margin-top:0">🎭 Stimmen-Casting</h3>
      <p class="small muted" style="margin:0 0 6px">Rolle wählen, Stimmen vorsprechen lassen (▶ Probe, etwa 150 Credits, danach gratis), mit „nehmen“ zuordnen. Neue Stimmen sagen vorher ihren Namen.</p>
      <div id="crl"></div><p class="status" id="csi">Lade Stimmen …</p><div id="cst"></div>
      <div class="row" style="margin-top:10px"><button class="btn ki" id="crunde">▶ Vorstellungsrunde aller Zugeordneten</button></div>
      <details style="margin-top:10px"><summary><b>Mehr deutsche Stimmen aus der ElevenLabs-Bibliothek</b></summary>
        <p class="small muted">Hörbeispiele sind gratis. „Holen“ legt die Stimme in dein Konto, danach steht sie oben zur Auswahl.</p>
        <input id="cbq" placeholder="Name suchen, z. B. Wally" style="width:100%;margin-bottom:6px">
        <select id="cbg"><option value="">alle</option><option value="male">männlich</option><option value="female">weiblich</option></select>
        <button class="btn ghost small" id="cbl">Laden</button><div id="cbib"></div></details>
      <h4>Zuordnung an Claude schicken</h4><textarea id="ctx" rows="6" style="width:100%" readonly></textarea>
      <div class="row"><button class="btn lamp" id="ccp">📋 Kopieren</button></div>`);
    w.addEventListener('click', e => { if (e.target.closest('[data-close]')) stop(); });
    try { await laden(); } catch (e) { return info(w, 'Ging nicht: ' + (e.message || e.code)); }
    rolle = rolle || 'KLABAUTER'; info(w, `${stimmen.length} Stimmen im Konto.`);
    const txt = () => { w.querySelector('#ctx').value = zuordnungText(); };
    chips(w); rolleSeite(w); txt();
    w.addEventListener('click', () => setTimeout(txt, 50));
    w.querySelector('#crunde').onclick = () => runde(w);
    w.querySelector('#cbl').onclick = () => bibliothek(w);
    w.querySelector('#ccp').onclick = async () => { txt(); try { await navigator.clipboard.writeText(zuordnungText()); toast('Kopiert. Jetzt in den Chat mit Claude einfügen.'); } catch (e) { w.querySelector('#ctx').select(); } };
  }
  window.CASTING = {oeffnen};
})();

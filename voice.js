/* ==========================================================================
   Stimmen
   - ElevenLabs-Sprachausgabe; feste Sätze werden auf dem Handy gespeichert (IndexedDB)
     und kosten danach keine Credits mehr.
   - Rückfall: Handystimme, Brabbeln oder nur Text.
   - Spracherkennung: Handy (kostenlos) oder ElevenLabs Scribe, mit einstellbarer Redepause.
   ========================================================================== */
const EL_BASE = 'https://api.elevenlabs.io';
const ELKEY = 'skipper-elkey';
const elKey = () => { try { return (localStorage.getItem(ELKEY) || '').trim(); } catch (e) { return ''; } };
const setElKey = k => { try { k ? localStorage.setItem(ELKEY, k.trim()) : localStorage.removeItem(ELKEY); } catch (e) {} };

/* ---------- Kleiner Speicher für Audio (IndexedDB) ---------- */
const CLIPS = (() => {
  let dbp = null;
  const open = () => dbp || (dbp = new Promise(res => {
    try {
      const r = indexedDB.open('skipper-audio', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('clips');
      r.onsuccess = () => res(r.result); r.onerror = () => res(null);
    } catch (e) { res(null); }
  }));
  const tx = async (mode, fn) => { const db = await open(); if (!db) return null; return new Promise(res => { try { const t = db.transaction('clips', mode), st = t.objectStore('clips'); const q = fn(st); t.oncomplete = () => res(q && q.result); t.onerror = () => res(null); } catch (e) { res(null); } }); };
  return {
    get: k => tx('readonly', st => st.get(k)),
    put: (k, v) => tx('readwrite', st => st.put(v, k)),
    clear: () => tx('readwrite', st => st.clear()),
    count: () => tx('readonly', st => st.count()),
  };
})();
function hash(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); }


/* Anfrage mit Zeitlimit */
async function fetchT(url, opts = {}, ms = 15000) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), ms);
  try { return await fetch(url, {...opts, signal: ctl.signal}); }
  catch (e) { throw {code: 'el_network', timeout: e && e.name === 'AbortError'}; }
  finally { clearTimeout(t); }
}
async function errDetail(r) {
  let j = null; try { j = await r.clone().json(); } catch (e) {}
  const d = j && (j.detail || j), st = d && (d.status || d.code) || '', msg = typeof d === 'string' ? d : (d && d.message) || '';
  return {status: String(st), msg: String(msg), all: JSON.stringify(d || ''), perm: /permission/i.test(st + ' ' + msg), quota: /quota|credit|limit_exceed/i.test(st + ' ' + msg)};
}

const VOX = (() => {
  let gen = 0, current = null, exhausted = false, keyBad = false, voiceList = null, forceFb = null;
  const MODELS = {hoch: 'eleven_multilingual_v2', sparsam: 'eleven_flash_v2_5'};
  const hooks = {start: () => {}, end: () => {}, notice: () => {}};

  /* ---------- Stimmen-Liste und Zuordnung ---------- */
  async function listVoices(force) {
    if (voiceList && !force) return voiceList;
    try { const c = JSON.parse(localStorage.getItem('skipper-voices') || 'null'); if (c && !force && Date.now() - c.t < 864e5 && c.v && c.v.length) return (voiceList = c.v); } catch (e) {}
    const k = elKey(); if (!k) return [];
    let r = await fetchT(EL_BASE + '/v1/voices', {headers: {'xi-api-key': k}}, 12000);
    if (r.status === 401 || r.status === 403) { const d = await errDetail(r); if (d.perm) throw {code: 'el_perm', what: 'Stimmen (Voices)', detail: d.msg}; keyBad = true; throw {code: 'el_bad_key', detail: d.msg}; }
    if (!r.ok) { r = await fetchT(EL_BASE + '/v2/voices?page_size=100', {headers: {'xi-api-key': k}}, 12000); }
    if (!r.ok) throw {code: 'el_http', status: r.status};
    const j = await r.json();
    voiceList = (j.voices || []).map(v => ({id: v.voice_id, name: v.name, labels: v.labels || {}, preview: v.preview_url, cat: v.category}));
    try { localStorage.setItem('skipper-voices', JSON.stringify({t: Date.now(), v: voiceList})); } catch (e) {}
    keyBad = false; return voiceList;
  }
  async function ensureVoices() {
    if (S.voices && S.voices.hinnerk && S.voices.smilla) return;
    const list = await listVoices(); autoAssign(list);
  }
  function autoAssign(list) {
    if (!list || !list.length) return;
    S.voices = S.voices || {};
    const ids = new Set(list.map(v => v.id));
    const order = ['hinnerk', 'smilla', 'klabauter', 'kroeger', 'ilse', 'piet', 'backbord'];
    const used = new Set(order.map(c => S.voices[c]).filter(v => v && ids.has(v)));
    order.forEach(cid => {
      if (S.voices[cid] && ids.has(S.voices[cid])) return;
      const c = CREW[cid], base = n => n.toLowerCase().split(/[\s-]/)[0];
      let pick = c.voicePref.map(n => list.find(v => base(v.name) === n.toLowerCase())).find(v => v && !used.has(v.id));
      if (!pick) pick = list.find(v => !used.has(v.id) && (v.labels.gender || '').toLowerCase() === c.gender) || list.find(v => !used.has(v.id)) || list[0];
      S.voices[cid] = pick.id; used.add(pick.id);
    });
    save();
  }
  async function credits() {
    const k = elKey(); if (!k) return null;
    try {
      const r = await fetchT(EL_BASE + '/v1/user/subscription', {headers: {'xi-api-key': k}}, 10000);
      if (!r.ok) return {unknown: true};
      const j = await r.json();
      return {used: j.character_count, limit: j.character_limit, left: Math.max(0, j.character_limit - j.character_count), reset: j.next_character_count_reset_unix};
    } catch (e) { return {unknown: true}; }
  }

  /* ---------- Sprachausgabe ElevenLabs ---------- */
  const usage = () => { const d = today(); if (!S.elUse || S.elUse.day !== d || S.elUse.live == null) S.elUse = {day: d, live: 0, all: 0}; return S.elUse; };
  function budgetOk(n) { return usage().live + n <= ((S.cfg && S.cfg.budget) || 1500); }
  function clean(t) { return String(t).replace(/\*\*/g, '').replace(/[▬●]/g, '').replace(/^[-•]\s*/gm, '').replace(/\s+/g, ' ').trim(); }

  async function elFetch(voice, text, model) {
    const k = elKey();
    const body = {text, model_id: model, voice_settings: {stability: .45, similarity_boost: .78, style: model === MODELS.hoch ? .3 : 0, use_speaker_boost: true}};
    if (model === MODELS.sparsam) body.language_code = 'de';
    const r = await fetchT(`${EL_BASE}/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {method: 'POST', headers: {'xi-api-key': k, 'content-type': 'application/json', accept: 'audio/mpeg'}, body: JSON.stringify(body)}, 20000);
    if (!r.ok) {
      const d = await errDetail(r);
      if (d.quota || r.status === 402) { exhausted = true; throw {code: 'el_quota'}; }
      if (r.status === 401 || r.status === 403) { if (d.perm) throw {code: 'el_perm', what: 'Text zu Sprache', detail: d.msg}; keyBad = true; throw {code: 'el_bad_key', detail: d.msg}; }
      throw {code: 'el_http', status: r.status, message: d.msg || d.all};
    }
    return r.blob();
  }
  /* Holt Audio für einen Satz: erst aus dem Speicher, sonst neu erzeugen. */
  async function clip(cid, text, kind) {
    if (!elKey() || keyBad) return null;
    if (!(S.voices && S.voices[cid])) { try { await ensureVoices(); } catch (e) { throw e; } }
    const voice = S.voices && S.voices[cid]; if (!voice) return null;
    const want = kind === 'fixed' ? MODELS[(S.cfg && S.cfg.quality) || 'sparsam'] : MODELS.sparsam;
    const other = want === MODELS.hoch ? MODELS.sparsam : MODELS.hoch;
    for (const m of [want, other]) { const b = await CLIPS.get(hash(voice + '|' + m + '|' + text)); if (b) return b; }
    if (exhausted) return null;
    if (kind !== 'fixed' && !budgetOk(text.length)) { hooks.notice('budget'); return null; }
    const b = await elFetch(voice, text, want);
    usage().all += text.length; if (kind === 'live') usage().live += text.length; save();
    if (kind === 'fixed' || kind === 'story') CLIPS.put(hash(voice + '|' + want + '|' + text), b);
    return b;
  }

  function noticeFor(e) { hooks.notice(e && e.code === 'el_quota' ? 'quota' : e && e.code === 'el_bad_key' ? 'badkey' : e && e.code === 'el_perm' ? 'perm' : e && e.code === 'el_network' ? 'elnet' : 'elerr', e); return null; }
  /* ---------- Abspielen ---------- */
  function playBlob(blob, cid, g) {
    return new Promise(res => {
      const a = new Audio(URL.createObjectURL(blob)), c = CREW[cid] || {};
      a.preservesPitch = false; a.mozPreservesPitch = false; a.webkitPreservesPitch = false;
      a.playbackRate = c.fx || 1; a.volume = Math.min(1, (S.cfg && S.cfg.voice) || 1);
      current = {stop: () => { try { a.pause(); } catch (e) {} res(); }};
      const done = () => { URL.revokeObjectURL(a.src); res(); };
      a.onended = done; a.onerror = done;
      let dog = setTimeout(done, 40000);
      a.onloadedmetadata = () => { clearTimeout(dog); const d = isFinite(a.duration) ? a.duration : 20; dog = setTimeout(done, d * 1000 / (a.playbackRate || 1) + 2500); };
      a.play().catch(done);
      if (g !== gen) { a.pause(); res(); }
    });
  }
  let phoneVoices = [];
  const loadPhone = () => { try { phoneVoices = speechSynthesis.getVoices().filter(v => /^de/i.test(v.lang)); } catch (e) {} };
  if ('speechSynthesis' in window) { loadPhone(); speechSynthesis.onvoiceschanged = loadPhone; }
  function playPhone(text, cid) {
    return new Promise(res => {
      if (!('speechSynthesis' in window)) return res();
      const c = CREW[cid] || {}, u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE'; u.pitch = Math.min(2, c.pitch || 1); u.rate = c.rate || 1;
      const v = phoneVoices.find(v => /Google|Anna|Petra|Helena|Katja|Markus|Yannick/i.test(v.name)) || phoneVoices[0]; if (v) u.voice = v;
      let fin = false; const done = () => { if (fin) return; fin = true; clearTimeout(dog); res(); };
      const dog = setTimeout(done, 3500 + text.length * 95);
      u.onend = done; u.onerror = done;
      current = {stop: () => { try { speechSynthesis.cancel(); } catch (e) {} done(); }};
      try { speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { done(); }
    });
  }
  const readTime = t => new Promise(r => setTimeout(r, 900 + String(t).length * 45));

  /* say: ein Satz einer Figur. kind: fixed (fester Satz), story (Podcast), live (freies Gespräch) */
  async function say(cid, text, kind = 'live', pre = null) {
    const g = gen; text = clean(text); if (!text) return;
    let blob = null;
    try { blob = pre ? await pre : await clip(cid, text, kind); } catch (e) { noticeFor(e); }
    if (g !== gen) return;
    hooks.start(cid, text); AUD.duck(true);
    if (blob) await playBlob(blob, cid, g);
    else {
      const fb = forceFb || (S.cfg && S.cfg.fallback) || 'phone';
      if (fb === 'phone' && 'speechSynthesis' in window) await playPhone(text, cid);
      else if (fb === 'babble') await Promise.all([AUD.babble(text, (CREW[cid] || {}).pitch || 1), readTime(text)]);
      else await readTime(text);
    }
    current = null;
    if (g === gen) { hooks.end(cid); AUD.duck(false); }
  }
  /* lines: mehrere Sätze nacheinander; der nächste wird schon geladen, während der aktuelle läuft. */
  async function lines(list, kind = 'live') {
    const g = gen;
    const pre = i => { const l = list[i]; if (!l) return null; const t = clean(l.t); return clip(l.cid, t, kind).catch(noticeFor); };
    let next = pre(0);
    for (let i = 0; i < list.length; i++) {
      if (g !== gen) return false;
      const p = next; next = pre(i + 1);
      if (list[i].before) await list[i].before();
      await say(list[i].cid, list[i].t, kind, p);
      if (g !== gen) return false;
      if (list[i].after) await list[i].after();
      await new Promise(r => setTimeout(r, 220));
    }
    return true;
  }
  /* Streaming: Sätze kommen nach und nach (freies Gespräch). */
  function stream(kind = 'live') {
    const g = gen, q = []; let busy = false, closed = false, resolveDone; const done = new Promise(r => (resolveDone = r));
    const pump = async () => {
      if (busy) return; busy = true;
      while (q.length && g === gen) { const l = q.shift(); await say(l.cid, l.t, kind, l.pre); await new Promise(r => setTimeout(r, 180)); }
      busy = false; if (closed && !q.length) resolveDone();
    };
    return {
      push(cid, t) { if (g !== gen) return; t = clean(t); if (!t) return; const item = {cid, t, pre: clip(cid, t, kind).catch(noticeFor)}; q.push(item); pump(); },
      close() { closed = true; if (!busy && !q.length) resolveDone(); },
      done,
    };
  }
  function stop() { gen++; if (current) current.stop(); current = null; try { speechSynthesis.cancel(); } catch (e) {} AUD.duck(false); hooks.end(null); }
  async function preview(cid, voiceId) {
    stop(); const v = (voiceList || []).find(x => x.id === voiceId);
    if (v && v.preview) { const a = new Audio(v.preview); a.preservesPitch = false; a.playbackRate = (CREW[cid] || {}).fx || 1; current = {stop: () => a.pause()}; a.play().catch(() => {}); }
  }

  /* ---------- Spracherkennung ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  /* Fügt erkannte Stücke zusammen und entfernt Wiederholungen, die manche Android-Geräte liefern. */
  function joinParts(parts) {
    const out = [];
    parts.forEach(p => { p = p.trim(); if (!p) return; const last = out[out.length - 1]; if (last && p.toLowerCase().startsWith(last.toLowerCase())) out[out.length - 1] = p; else if (!(last && last.toLowerCase().endsWith(p.toLowerCase()))) out.push(p); });
    return out.join(' ').replace(/\s+/g, ' ').trim();
  }
  function listenPhone(o) {
    let rec = null, finished = false, timer = null, startT = Date.now(), parts = [], interim = '', heard = false, lastErr = null, resolve;
    const pauseMs = (o.pause || 2) * 1000, noSpeechMs = o.noSpeech || 9000;
    const p = new Promise(r => (resolve = r));
    const text = () => joinParts([...parts, ...((rec && rec._final) || []), interim]);
    const finish = (err) => { if (finished) return; finished = true; clearTimeout(timer); try { rec && rec.stop(); } catch (e) {} setTimeout(() => resolve({text: text(), err: err || null}), 250); };
    const arm = () => { clearTimeout(timer); timer = setTimeout(() => finish(), heard ? pauseMs : Math.max(500, noSpeechMs - (Date.now() - startT))); };
    const start = () => {
      rec = new SR(); rec.lang = 'de-DE'; rec.interimResults = true; rec.continuous = true; rec.maxAlternatives = 1;
      let sessionFinal = [];
      rec.onresult = ev => {
        heard = true; sessionFinal = []; interim = '';
        for (const r of ev.results) { if (r.isFinal) sessionFinal.push(r[0].transcript); else interim += r[0].transcript; }
        rec._final = sessionFinal;
        o.onInterim && o.onInterim(joinParts([...parts, ...sessionFinal, interim]));
        arm();
      };
      rec.onerror = ev => { lastErr = ev.error; };
      rec.onend = () => {
        parts = parts.concat(rec._final || []); rec._final = [];
        if (interim) { parts.push(interim); interim = ''; }
        if (finished) return;
        if (lastErr && lastErr !== 'no-speech' && lastErr !== 'aborted') return finish(lastErr);
        if (Date.now() - startT > 60000) return finish();
        lastErr = null; try { start(); } catch (e) { finish('start'); }
      };
      try { rec.start(); } catch (e) { finish('start'); }
    };
    if (!SR) { setTimeout(() => resolve({text: '', err: 'unsupported'}), 0); return {done: p, finish() {}, cancel() {}}; }
    start(); arm();
    return {done: p, finish: () => finish(), cancel: () => { parts = []; interim = ''; finish('aborted'); }};
  }
  function listenEleven(o) {
    let finished = false, resolve, stream = null, recd = null, chunks = [], ac = null, raf = 0, heard = false, lastLoud = 0, startT = Date.now();
    const p = new Promise(r => (resolve = r));
    const pauseMs = (o.pause || 2) * 1000, noSpeechMs = o.noSpeech || 9000;
    const cleanup = () => { cancelAnimationFrame(raf); try { stream && stream.getTracks().forEach(t => t.stop()); } catch (e) {} try { ac && ac.close(); } catch (e) {} };
    const upload = async () => {
      cleanup();
      if (!heard || !chunks.length) return resolve({text: '', err: null});
      o.onState && o.onState('think');
      const blob = new Blob(chunks, {type: recd.mimeType || 'audio/webm'});
      const fd = new FormData(); fd.append('model_id', 'scribe_v2'); fd.append('language_code', 'de'); fd.append('file', blob, 'sprache.webm');
      try {
        const r = await fetchT(EL_BASE + '/v1/speech-to-text', {method: 'POST', headers: {'xi-api-key': elKey()}, body: fd}, 25000);
        if (!r.ok) { const d = await errDetail(r); if (d.quota) exhausted = true; return resolve({text: '', err: d.perm || r.status === 401 || r.status === 403 ? 'el_stt_perm' : d.quota ? 'el_stt_quota' : 'el_stt', detail: d.msg}); }
        const j = await r.json(); resolve({text: (j.text || '').trim(), err: null});
      } catch (e) { resolve({text: '', err: 'el_stt'}); }
    };
    const finish = (cancel) => { if (finished) return; finished = true; if (cancel) { chunks = []; heard = false; } try { recd && recd.state !== 'inactive' ? recd.stop() : upload(); } catch (e) { upload(); } };
    navigator.mediaDevices.getUserMedia({audio: {echoCancellation: true, noiseSuppression: true}}).then(st => {
      stream = st; recd = new MediaRecorder(st); recd.ondataavailable = e => e.data.size && chunks.push(e.data); recd.onstop = upload; recd.start(250);
      ac = new (window.AudioContext || window.webkitAudioContext)(); const src = ac.createMediaStreamSource(st), an = ac.createAnalyser(); an.fftSize = 1024; src.connect(an);
      const buf = new Float32Array(an.fftSize); let floor = .01;
      const loop = () => {
        an.getFloatTimeDomainData(buf); let s = 0; for (const x of buf) s += x * x; const rms = Math.sqrt(s / buf.length), now = Date.now();
        if (now - startT < 400) floor = Math.max(floor, rms * 1.2);
        if (rms > Math.max(.02, floor * 2.2)) { heard = true; lastLoud = now; }
        o.onLevel && o.onLevel(Math.min(1, rms * 8));
        if (heard && now - lastLoud > pauseMs) return finish();
        if (!heard && now - startT > noSpeechMs) return finish();
        if (now - startT > 45000) return finish();
        raf = requestAnimationFrame(loop);
      };
      loop();
    }).catch(() => { finished = true; resolve({text: '', err: 'not-allowed'}); });
    return {done: p, finish: () => finish(), cancel: () => finish(true)};
  }
  function listen(o = {}) {
    const mode = (S.cfg && S.cfg.stt) || 'phone', opts = {...o};
    if (opts.pause == null) opts.pause = S.cfg.pause;
    if ((mode === 'eleven' && elKey() && !exhausted) || (!SR && elKey())) return listenEleven(opts);
    let cur = listenPhone(opts);
    const holder = {finish: () => cur.finish(), cancel: () => cur.cancel()};
    holder.done = cur.done.then(r => {
      if (r.err && ['network', 'service-not-allowed', 'unsupported'].includes(r.err) && elKey() && !exhausted) {
        hooks.notice('sttswitch'); cur = listenEleven(opts); return cur.done;
      }
      return r;
    });
    return holder;
  }
  async function askMic() {
    try { const st = await navigator.mediaDevices.getUserMedia({audio: true}); st.getTracks().forEach(t => t.stop()); return true; } catch (e) { return false; }
  }

  return {
    hooks, listVoices, autoAssign, credits, say, lines, stream, stop, preview, listen, askMic, clip,
    set forceFallback(v) { forceFb = v; },
    ensureVoices, ttsTest: (voice, text) => elFetch(voice, text, MODELS.sparsam),
    async sttTest() {
      const n = 16000, buf = new ArrayBuffer(44 + n * 2), dv = new DataView(buf), w = (o, s) => [...s].forEach((c, i) => dv.setUint8(o + i, c.charCodeAt(0)));
      w(0, 'RIFF'); dv.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true); dv.setUint32(24, 16000, true); dv.setUint32(28, 32000, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true); w(36, 'data'); dv.setUint32(40, n * 2, true);
      const fd = new FormData(); fd.append('model_id', 'scribe_v2'); fd.append('language_code', 'de'); fd.append('file', new Blob([buf], {type: 'audio/wav'}), 'stille.wav');
      const r = await fetchT(EL_BASE + '/v1/speech-to-text', {method: 'POST', headers: {'xi-api-key': elKey()}, body: fd}, 25000);
      if (r.ok) return {ok: true}; const d = await errDetail(r); return {ok: false, status: r.status, perm: d.perm || r.status === 401 || r.status === 403, msg: d.msg};
    },
    get canListen() { return !!SR || !!elKey(); }, get hasSR() { return !!SR; },
    get exhausted() { return exhausted; }, set exhausted(v) { exhausted = v; }, get keyBad() { return keyBad; },
    resetFlags() { exhausted = false; keyBad = false; voiceList = null; },
    usageToday: () => usage(),
  };
})();

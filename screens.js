/* ==========================================================================
   Bildschirme: Deck, Kajüte, Lernen, Prüfung, Logbuch, Einstellungen
   ========================================================================== */

/* Sprüche zum Lernstand: einer je 3 % Bestehenschance, bildhaft und mit einem kleinen Seitenhieb. */
const SAYINGS = [
  'Dein Wissen ist so dicht wie ein Fischernetz.',
  'So wacklig wie ein Kartenhaus bei Windstärke acht.',
  'Du schwimmst. Aber nur, weil Holz nicht untergeht.',
  'So orientiert wie eine Möwe im Nebel.',
  'Dein Kurs ist so gerade wie ein Korkenzieher.',
  'So sicher wie ein Ruderboot aus Pappe.',
  'Die Prüfer würden dir nicht mal eine Badeente anvertrauen.',
  'So standfest wie ein Leuchtturm aus Sand.',
  'Ein Viertel geschafft. Drei Viertel treiben noch im Hafenbecken.',
  'So hell wie eine Positionslampe ohne Strom.',
  'Langsam sieht das Wrack wieder aus wie ein Boot.',
  'So überzeugend wie ein Seemann, der seekrank ist.',
  'Wind in den Segeln. Nur leider von vorn.',
  'So zuverlässig wie der Wetterbericht von letzter Woche.',
  'Halb voll oder halb leer? Bei dir eher halb gekentert.',
  'So solide wie ein Steg mit drei fehlenden Planken.',
  'Die Hälfte sitzt. Den Rest entscheidet der Münzwurf.',
  'Keine Landratte mehr. Aber auch noch kein Kapitän.',
  'Dicht wie ein alter Kutter: Es tropft nur noch an ein paar Stellen.',
  'Die Crew hört auf zu tuscheln, wenn du an Bord kommst.',
  'So ordentlich wie eine Kajüte nach Windstärke sechs.',
  'Fest wie ein Poller. Nur die Leine hängt noch durch.',
  'Zwei Drittel klar Schiff. Das letzte Drittel ist Nebel.',
  'Fast. Und fast ist das Lieblingswort aller Durchgefallenen.',
  'So sicher wie ein Anker auf Sandgrund: hält meistens.',
  'Drei Viertel. Die Prüfung fängt an, dich ernst zu nehmen.',
  'Stabil wie ein Kutter. Jetzt bloß nicht übermütig werden.',
  'So fest wie ein Palstek. Ein guter Palstek.',
  'Die Möwen folgen dir schon. Das ist ein gutes Zeichen.',
  'So klar wie ein Leuchtfeuer in einer Sternennacht.',
  'Das Prüfungsboot sieht dich kommen und wird nervös.',
  'So unerschütterlich wie Helgoland.',
  'Nur noch Kleinigkeiten. Und Prüfer lieben Kleinigkeiten.',
  'Prüfungsreif. Wenn jetzt was schiefgeht, war es das Wetter.',
];
const sayingFor = ch => SAYINGS[Math.min(SAYINGS.length - 1, Math.floor(ch * 100 / 3))];
function bindSaying() {
  document.querySelectorAll('[data-saying]').forEach(p => p.onclick = () => { AUD.unlock(); VOX.stop(); VOX.say(S.crew.K, p.dataset.saying, 'fixed'); });
}

/* ---------- Deck ---------- */
function courseCard() {
  const left = daysLeft(), r = racePos(), ch = r.you;
  const boat = (sail, pct, label) => `<svg class="boatI" style="left:${(pct * 100).toFixed(1)}%" viewBox="0 0 26 26" role="img" aria-label="${label}"><path d="M13 3v15M13 4l7 11h-7z" fill="${sail}" stroke="${sail}" stroke-width="1.5" stroke-linejoin="round"/><path d="M4 18h18l-3 4H7z" fill="${sail === '#8a96a3' ? '#5c6670' : '#3d5f8f'}"/></svg>`;
  return `<section class="card" aria-label="Kurs bis zur Prüfung">
    <div class="course"><div class="big">${left === 0 ? 'Heute' : left}</div>
      <div>${left === 0 ? 'ist Prüfungstag. Mast- und Schotbruch!' : `${left === 1 ? 'Tag' : 'Tage'} bis zur Prüfung am ${fmtDate(S.profile.exam)}`}<br><span class="muted small">Bestehenschance etwa ${Math.round(ch * 100)} %</span></div></div>
    <p class="saying" data-saying="${esc(sayingFor(ch))}" role="button" tabindex="0" title="Antippen zum Vorlesen"><b style="color:${CREW[S.crew.K].color}">${esc(nameOf('K'))}:</b> „${esc(sayingFor(ch))}“</p>
    <div class="track"><div class="ln"></div><div class="done" style="width:${(ch * 100).toFixed(1)}%"></div>
      ${boat('#8a96a3', r.exam, 'Prüfungsboot')}${boat('#f0b53e', ch, 'Dein Boot')}
      <svg class="goal" viewBox="0 0 22 24" aria-hidden="true"><path d="M11 2v20" stroke="var(--muted)" stroke-width="2"/><path d="M11 3h9l-3 4 3 4h-9z" fill="#c2473b"/></svg></div>
    <div class="legend"><span><i style="background:#f0b53e"></i>Dein Lernstand</span><span><i style="background:#8a96a3"></i>Das Prüfungsboot</span></div>
  </section>`;
}
function renderDeck() {
  place = 'deck'; soundFor('deck');
  const {due, newLeft, tight} = todayNumbers(), done = newLeft === 0 && due === 0;
  const next = unseen()[0] ? topicOf(unseen()[0].n) : null;
  app.innerHTML = `${deckScene(S.crew)}
  <h1 style="margin-top:4px">${S.profile.name ? 'Moin, ' + esc(S.profile.name) + '!' : 'Moin!'}</h1>
  <div class="card today">
    ${done ? '<p style="margin:0 0 10px"><b>Klar Schiff.</b> Für heute ist alles geschafft.</p>' : `<p style="margin:0 0 10px">Heute: <b>${newLeft}</b> neue Fragen und <b>${due}</b> Wiederholungen${next && newLeft ? `<br><span class="muted small">Neues Thema: ${esc(next.name)}</span>` : ''}</p>`}
    <button class="btn wide lamp" id="learn" style="font-size:1.1rem">${done ? 'Extrarunde drehen' : 'Leinen los'}</button>
    <div class="row" style="margin-top:10px"><button class="btn ghost" id="exam">Probeprüfung</button><button class="btn ghost" id="horn">Schallsignale hören</button></div>
  </div>
  ${tight ? `<p class="small muted">Dein Plan ist knapp: Heute sind mehr Fragen dran, als in ${S.profile.minutes} Minuten gut zu schaffen sind.</p>` : ''}
  ${courseCard()}`;
  const learn = () => { if (done) { const pool = Q.filter(q => st(q.n)); runQuiz(shuffle(pool).sort((a, b) => st(b.n).w - st(a.n).w).slice(0, 10), 'Extrarunde'); } else startSession(); };
  $('#learn').onclick = learn; $('#exam').onclick = examIntro; $('#horn').onclick = hornQuiz; bindSaying();
  app.querySelectorAll('[data-go]').forEach(b => b.onclick = () => {
    AUD.click(); const g = b.dataset.go;
    if (g === 'learn') learn(); else if (g === 'exam') examIntro(); else setTab(g);
  });
}

/* ---------- Kajüte ---------- */
let TALK = {on: false, ctl: null, abort: null, misses: 0};
function renderCabin() {
  place = 'kajuete'; soundFor('kajuete');
  const stories = (S.stories || []).slice().reverse();
  app.innerHTML = `${cabinScene(S.crew)}
  <div class="talkbar">
    <button class="micbig" id="talkBtn" aria-label="Gespräch starten">${MIC_SVG}</button>
    <div class="talkstate" id="tstate">Mit der Crew reden<small>${VOX.canListen ? 'Tippe aufs Mikrofon und sprich einfach los.' : 'Dieser Browser kann keine Sprache erkennen. Schreib unten oder nutze Chrome.'}</small></div>
    <button class="btn small hidden" id="tfin">Fertig</button>
  </div>
  <div class="interim" id="tint"></div>
  ${apiKey() ? '' : `<div class="card" id="keycard"><h3>Ein Schlüssel fehlt noch</h3>
    <p class="small" style="margin:0 0 8px">Damit die Crew mit dir redet, braucht sie deinen Anthropic-Schlüssel. Er wird nur auf diesem Handy gespeichert.</p>
    <input type="password" id="ck" autocomplete="off" placeholder="sk-ant-…"><button class="btn wide" id="cks" style="margin-top:10px">Speichern und testen</button><p class="status" id="ckr"></p></div>`}
  <p class="small muted" style="margin:0 0 10px">Läuft etwas nicht? <button class="btn small ghost" id="stlink" style="min-height:34px;margin-left:4px">Selbsttest</button></p>
  <div class="log" id="tlog"></div>
  <div class="card stories" style="margin-top:16px">
    <h3>Kajütengeschichten</h3>
    <p class="small muted" style="margin:0 0 8px">Die Crew erzählt sich eine Geschichte voller Prüfungswissen. Jede Folge wird einmal erzeugt und dann gespeichert. Danach kannst du direkt mitreden.</p>
    <label for="tp" style="margin-top:6px">Worüber sollen sie reden?</label>
    <select id="tp">${TOPICS.map(t => `<option value="${t.id}" ${t.id === cabinTopic().id ? 'selected' : ''}>${t.name}</option>`).join('')}</select>
    <button class="btn wide" id="gen" style="margin-top:10px">Neue Geschichte</button>
    <div id="story"></div>
    ${stories.length ? `<div style="margin-top:12px">${stories.map((s, i) => `<div class="st"><span>${esc(s.title)}</span><button class="btn small ghost" data-st="${stories.length - 1 - i}">Anhören</button></div>`).join('')}</div>` : ''}
  </div><div style="height:70px"></div>`;
  const log = $('#tlog'); S.talk.slice(-14).forEach(l => logLine(l.s, l.t, false));
  if (!S.talk.length) log.innerHTML = `<p class="small muted">Tipp: Tippe auf eine Figur, dann sagt sie etwas.</p>`;
  $('#talkBtn').onclick = () => { AUD.unlock(); TALK.on ? stopTalk(true) : startTalk(); };
  $('#stlink').onclick = () => { renderSettings(); setTimeout(() => { const c = $('#stcard'); if (c) { c.scrollIntoView({block: 'start'}); $('#strun').click(); } }, 100); };
  const ck = $('#cks'); if (ck) ck.onclick = async () => {
    const v = $('#ck').value.trim(), o = $('#ckr'); if (!v) { o.className = 'status err'; o.textContent = 'Bitte den Schlüssel einfügen.'; return; }
    setApiKey(v); o.className = 'status'; o.textContent = 'Teste die Verbindung…';
    try { await ai('Antworte nur mit: Ahoi', {modelTier: 'quick', maxTokens: 10}); o.className = 'status ok'; o.textContent = 'Verbindung steht. Ahoi!'; setTimeout(renderCabin, 900); }
    catch (e) { o.className = 'status err'; o.textContent = aiErr(e); if (e.code === 'bad_key') setApiKey(''); }
  };
  $('#gen').onclick = () => makeStory(TOPICS.find(t => t.id === $('#tp').value));
  app.querySelectorAll('[data-st]').forEach(b => b.onclick = () => showStory(S.stories[+b.dataset.st]));
  app.querySelectorAll('.cabin .ch').forEach(g => { g.style.cursor = 'pointer'; g.addEventListener('click', () => { if (TALK.on) return; AUD.unlock(); const c = g.dataset.ch; VOX.stop(); VOX.say(c, lineOf(c, 'tap'), 'fixed'); }); });
  $('#sendBtn').onclick = () => { const v = $('#chatIn').value.trim(); if (!v) return; $('#chatIn').value = ''; AUD.unlock(); userSays(v); };
  $('#chatIn').onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#sendBtn').click(); } };
}
function cabinTopic() {
  const seen = Q.filter(q => st(q.n)); if (!seen.length) return TOPICS[0];
  return topicOf(seen.sort((a, b) => st(b.n).d - st(a.n).d)[0].n);
}
function logLine(s, t, store = true) {
  const log = $('#tlog'); if (store) { S.talk.push({s, t}); S.talk = S.talk.slice(-40); save(); }
  if (!log) return; if (log.querySelector('p.small')) log.innerHTML = '';
  const d = document.createElement('div'); d.className = 'l' + (s === 'U' ? ' u' : '');
  d.innerHTML = s === 'U' ? esc(t) : `<b style="color:${CREW[cid(s)].color}">${esc(nameOf(s))}</b>${esc(t)}`;
  log.appendChild(d); d.scrollIntoView({block: 'nearest', behavior: 'smooth'});
}
function setTalkUI(stt, sub = '') {
  const s = $('#tstate'), b = $('#talkBtn'), f = $('#tfin'); if (!s) return;
  const txt = {listen: 'Ich höre zu…', think: `${nameOf('K')} überlegt…`, speak: 'Die Crew spricht', idle: 'Mit der Crew reden'}[stt];
  const subs = {listen: 'Sprich ganz in Ruhe. Tippe auf „Fertig“, wenn du fertig bist.', speak: 'Tippe auf die Szene, um zu unterbrechen.', idle: sub || 'Tippe aufs Mikrofon und sprich einfach los.'};
  s.innerHTML = `${txt}<small>${subs[stt] || sub}</small>`;
  b.classList.toggle('on', TALK.on); b.setAttribute('aria-label', TALK.on ? 'Gespräch beenden' : 'Gespräch starten');
  f.classList.toggle('hidden', stt !== 'listen');
}
function needKey() {
  setTalkUI('idle', 'Erst den Anthropic-Schlüssel eintragen, dann geht es los.');
  const c = $('#keycard'); if (c) { c.scrollIntoView({block: 'center', behavior: 'smooth'}); const i = $('#ck'); if (i) i.focus(); } else toast(aiErr({code: 'no_key'}), 7000);
}
function sttErrText(err) {
  return {network: 'Die Spracherkennung des Handys braucht Internet und funktioniert nur in Chrome. Mit ElevenLabs-Schlüssel nutze ich automatisch dessen Erkennung.',
    'not-allowed': 'Das Mikrofon ist gesperrt. Tippe oben in der Adresszeile auf das Schloss-Symbol und erlaube das Mikrofon.',
    'service-not-allowed': 'Dieser Browser lässt keine Spracherkennung zu. Nimm Chrome oder trag einen ElevenLabs-Schlüssel ein.',
    unsupported: 'Dieser Browser kann keine Sprache erkennen. Nimm Chrome oder trag einen ElevenLabs-Schlüssel ein.',
    'audio-capture': 'Kein Mikrofon gefunden, oder eine andere App benutzt es gerade.',
    el_stt_perm: 'Dein ElevenLabs-Schlüssel darf „Sprache zu Text“ nicht nutzen. Erstelle einen Schlüssel mit diesem Recht oder stell unter Einstellungen → Zuhören auf „Handy“.',
    el_stt_quota: 'Das ElevenLabs-Guthaben reicht nicht für die Spracherkennung.',
    el_stt: 'Die ElevenLabs-Spracherkennung hat nicht geklappt. Prüf die Verbindung.'}[err] || `Die Spracherkennung hat nicht geklappt (${err}). Schreib unten oder starte den Selbsttest.`;
}
async function startTalk(fromStory) {
  if (!apiKey()) return needKey();
  if (!VOX.hasSR && !elKey()) { setTalkUI('idle', sttErrText('unsupported')); return; }
  TALK.on = true; TALK.misses = 0; setTalkUI('speak');
  const sc = $('.cabin'); if (sc) sc.onclick = () => { if (TALK.on) { VOX.stop(); } };
  if (fromStory) return userSays('(Die Geschichte ist zu Ende. Sprecht mich jetzt direkt an und knüpft daran an.)', '', true);
  S.talkCtx = ''; const t = lineOf(S.crew.K, 'talk'); logLine('K', t); await VOX.say(S.crew.K, t, 'fixed');
  if (TALK.on) listenTurn();
}
function stopTalk(ui) {
  TALK.on = false; if (TALK.ctl) TALK.ctl.cancel(); TALK.ctl = null; if (TALK.abort) TALK.abort.abort(); TALK.abort = null;
  if (ui) { VOX.stop(); setTalkUI('idle'); const i = $('#tint'); if (i) i.textContent = ''; }
}
async function listenTurn() {
  if (!TALK.on) return; setTalkUI('listen');
  const f = $('#tfin');
  TALK.ctl = VOX.listen({onInterim: t => { const i = $('#tint'); if (i) i.textContent = t; }, onState: s => s === 'think' && setTalkUI('think')});
  if (f) f.onclick = () => TALK.ctl && TALK.ctl.finish();
  const r = await TALK.ctl.done; TALK.ctl = null; const i = $('#tint'); if (i) i.textContent = '';
  if (!TALK.on) return;
  if (r.err && r.err !== 'aborted') { stopTalk(false); setTalkUI('idle', sttErrText(r.err)); return; }
  if (!r.text) { TALK.misses++; if (TALK.misses >= 2) { stopTalk(false); setTalkUI('idle', 'Ich hab nichts gehört. Tippe aufs Mikrofon, wenn du weiterreden willst.'); return; } return listenTurn(); }
  TALK.misses = 0; userSays(r.text);
}
async function userSays(text, extra = '', hidden = false) {
  if (!apiKey()) { $('#chatIn').value = text; return needKey(); }
  VOX.stop(); if (!hidden) logLine('U', text); setTalkUI('think');
  const rel = relevant(text);
  const hist = S.talk.slice(-16, hidden ? undefined : -1).map(l => l.s === 'U' ? {role: 'user', content: l.t} : {role: 'assistant', content: `${l.s}: ${l.t}`});
  const sys = crewSystem((rel.length ? `Passende Katalogfragen mit verbindlicher richtiger Antwort:\n${rel.map(catLine).join('\n')}\n` : '') + (S.talkCtx || '') + extra);
  const out = VOX.stream('live'); let done = 0, any = false;
  const take = (full, last) => {
    const lines = full.split('\n'); const upto = last ? lines.length : lines.length - 1;
    for (let k = done; k < upto; k++) {
      const raw = lines[k].trim(); if (!raw) continue;
      const m = raw.match(/^([KMT])\s*:\s*(.+)$/); const role = m ? m[1] : 'K', t = (m ? m[2] : raw).trim(); if (!t) continue;
      any = true; logLine(role, t); out.push(cid(role), t); setTalkUI('speak');
    }
    done = Math.max(done, upto);
  };
  TALK.abort = new AbortController();
  try {
    const full = await ai([...hist, {role: 'user', content: text}], {system: sys, maxTokens: 500, signal: TALK.abort.signal, onText: t => take(t, false)});
    take(full, true);
  } catch (e) { if (e.code !== 'cancelled') { logLine('K', aiErr(e), false); stopTalk(false); TALK.abort = null; out.close(); setTalkUI('idle', aiErr(e)); if (e.code === 'bad_key') { setApiKey(''); renderCabin(); } return; } }
  TALK.abort = null; out.close(); await out.done;
  if (TALK.on) listenTurn(); else setTalkUI('idle');
}
/* Podcast: Kajütengeschichte, einmal erzeugt und gespeichert */
async function makeStory(t) {
  if (!apiKey()) return needKey();
  const box = $('#story'), g = $('#gen'); g.disabled = true;
  box.innerHTML = '<p class="think" style="margin-top:12px">Die Crew setzt sich an den Tisch und schenkt Tee ein…</p>';
  const pool = Q.filter(q => q.n >= t.from && q.n <= t.to), known = shuffle(pool.filter(q => st(q.n))), fresh = shuffle(pool.filter(q => !st(q.n)));
  const pick = [...known.slice(0, 4), ...fresh].slice(0, 5).sort((a, b) => a.n - b.n);
  const K = CREW[S.crew.K], M = CREW[S.crew.M], T = CREW[S.crew.T];
  const prompt = `Katalogfragen mit verbindlicher richtiger Antwort:\n${pick.map(catLine).join('\n')}\n\nSchreibe ein unterhaltsames Hörspiel-Gespräch in der Kajüte einer Segelyacht zwischen:\nK = ${K.persona}\nM = ${M.persona}\nT = ${T.persona}\nThema: „${t.name}“. Sie erzählen sich kleine, ausgedachte Erlebnisse, in denen das Wissen aus ALLEN oben genannten Katalogfragen vorkommt und richtig erklärt wird. Fachinhalte exakt wie im Katalog, keine erfundenen Regeln. Kein Erzähler, nur wörtliche Rede, kurze Sätze, gut vorlesbar, leicht norddeutsch, keine Abkürzungen. 16 bis 22 Beiträge, T höchstens dreimal mit ganz kurzen Einwürfen. Am Ende wendet sich K an den Zuhörer und stellt ihm eine kurze Frage zum Thema.\nAntworte NUR mit JSON: {"title":"kurzer Titel","lines":[{"s":"K","t":"..."},{"s":"M","t":"..."}]}`;
  try {
    const data = await aiJson(prompt, {modelTier: 'complex', maxTokens: 4000, system: `Du schreibst Hörspiele für eine Lern-App zum Sportbootführerschein See.\n${RULES}`});
    if (!data || !Array.isArray(data.lines) || !data.lines.length) throw {code: 'invalid_json'};
    const story = {title: String(data.title || t.name), topic: t.id, qs: pick.map(q => q.n), crew: {...S.crew}, lines: data.lines.filter(l => /^[KMT]$/.test(l.s) && l.t).map(l => ({s: l.s, t: String(l.t)}))};
    S.stories = (S.stories || []).concat(story).slice(-8); save();
    showStory(story);
  } catch (e) { box.innerHTML = `<p class="muted" style="margin-top:12px">${esc(aiErr(e))}</p>`; }
  g.disabled = false;
}
async function showStory(story) {
  const box = $('#story'); if (!box) return; VOX.stop();
  const crewOf = r => (story.crew && story.crew[r]) || S.crew[r];
  const chars = story.lines.reduce((a, l) => a + l.t.length, 0);
  box.innerHTML = `<h3 style="margin-top:14px">${esc(story.title)}</h3>
    <p class="small muted" id="cost"></p>
    <div class="row" style="margin-bottom:10px"><button class="btn" id="play">Anhören</button><button class="btn ghost" id="pq">Fragen dazu üben</button></div>
    <div id="lines">${story.lines.map((l, i) => `<div class="line" data-i="${i}"><span class="who" style="color:${CREW[crewOf(l.s)].color}">${esc(CREW[crewOf(l.s)].short)}</span><span>${esc(l.t)}</span></div>`).join('')}</div>
    <div class="row hidden" id="after" style="margin-top:10px"><button class="btn lamp" id="cont">Weiterreden</button><button class="btn ghost" id="pq2">Fragen dazu üben</button></div>`;
  box.scrollIntoView({block: 'start', behavior: 'smooth'});
  if (elKey() && !story.played) $('#cost').textContent = `Beim ersten Anhören werden die Stimmen einmal erzeugt: bis zu etwa ${chars} Credits. Danach ist die Folge gespeichert.`;
  const practice = () => { VOX.stop(); runQuiz(story.qs.map(n => QN[n]).filter(q => q && !q.skip), 'Fragen aus der Kajüte'); };
  $('#pq').onclick = practice; $('#pq2').onclick = practice;
  $('#cont').onclick = () => {
    S.talkCtx = `\nIhr habt gerade gemeinsam die Kajütengeschichte „${story.title}“ erzählt. Die letzten Sätze waren:\n${story.lines.slice(-5).map(l => `${l.s}: ${l.t}`).join('\n')}\nKnüpft daran an.`;
    window.scrollTo(0, 0); startTalk(true);
  };
  let playing = false;
  $('#play').onclick = async () => {
    AUD.unlock();
    if (playing) { VOX.stop(); playing = false; $('#play').textContent = 'Anhören'; return; }
    playing = true; $('#play').textContent = 'Anhalten'; window.scrollTo({top: 0, behavior: 'smooth'});
    const list = story.lines.map((l, i) => ({cid: crewOf(l.s), t: l.t, before: () => { document.querySelectorAll('.line').forEach(x => x.classList.toggle('now', +x.dataset.i === i)); }}));
    const ok = await VOX.lines(list, 'story');
    playing = false; const p = $('#play'); if (p) p.textContent = 'Nochmal anhören';
    document.querySelectorAll('.line').forEach(x => x.classList.remove('now'));
    if (ok) { story.played = true; save(); const a = $('#after'); if (a) { a.classList.remove('hidden'); a.scrollIntoView({block: 'center', behavior: 'smooth'}); } }
  };
}

/* ---------- Lerneinheit, Lektion ---------- */
function startSession() {
  const {p, newLeft} = todayNumbers();
  const reviews = shuffle(Q.filter(q => isDue(q.n))).slice(0, Math.max(10, p.cap - newLeft));
  const news = unseen().slice(0, newLeft), queue = [...reviews, ...news];
  if (!queue.length) return renderDeck();
  const pending = [...new Set(news.map(q => topicOf(q.n).id))].find(id => !S.lessons[id]);
  AUD.sfx('glocke', {vol: .5});
  if (pending) showLesson(TOPICS.find(t => t.id === pending), () => runQuiz(queue, 'Lerneinheit'));
  else runQuiz(queue, 'Lerneinheit');
}
function showLesson(t, next) {
  subScreen(); place = 'quiz'; soundFor('quiz');
  const qs = Q.filter(q => q.n >= t.from && q.n <= t.to);
  app.innerHTML = `<div class="qhead"><div class="tag">Neue Lektion</div><button class="btn small ghost" id="back">Zurück</button></div>
    <div style="display:flex;gap:12px;align-items:flex-end;margin-bottom:8px">${charSVG(S.crew.K)}<h1 style="margin:0">${esc(t.name)}</h1></div>
    <div class="card lesson" id="les"><p class="think">${esc(nameOf('K'))} bereitet die Lektion vor…</p></div>
    <div class="row"><button class="btn ghost hidden" id="read">Vorlesen</button><button class="btn" id="nx">Zum Quiz</button></div>`;
  app.querySelector('svg.ch').style.width = '70px';
  $('#back').onclick = () => setTab('deck');
  $('#nx').onclick = () => { VOX.stop(); S.lessons[t.id] = S.lessons[t.id] || 'gesehen'; save(); next(); };
  const box = $('#les');
  if (typeof S.lessons[t.id] === 'string' && S.lessons[t.id].length > 40) { box.innerHTML = md(S.lessons[t.id]); readBtn(S.lessons[t.id]); return; }
  ai(`Hier sind die Katalogfragen zu diesem Thema mit den richtigen Antworten:\n${qs.map(catLine).join('\n')}\n\nSchreibe jetzt eine kurze Lektion (etwa 180 bis 260 Wörter) zum Thema „${t.name}“, in deiner Art erzählt. Erkläre die Zusammenhänge hinter diesen Fragen so, dass man sie versteht statt auswendig lernt. Gib 2 bis 3 Merkhilfen. Wenn es passt, ende mit einem Absatz, der mit „Übrigens:“ beginnt und eine wahre, gut belegte Kleinigkeit aus der Seefahrt erzählt; wenn dir nichts Sicheres einfällt, lass ihn weg. Markiere wichtige Begriffe mit **fett**.`, {system: leadPersona(), onText: tx => { box.innerHTML = md(tx); }})
    .then(tx => { box.innerHTML = md(tx); S.lessons[t.id] = tx; save(); readBtn(tx); })
    .catch(e => { box.innerHTML = `<p class="muted">${esc(aiErr(e) || 'Lektion abgebrochen.')}</p><h3>Die wichtigsten Katalogantworten</h3><ul>${qs.slice(0, 12).map(q => `<li><strong>${esc(q.q)}</strong><br>${esc(q.a[0])}</li>`).join('')}</ul>`; });
  function readBtn(tx) { const r = $('#read'); if (!r) return; r.classList.remove('hidden'); r.onclick = () => { AUD.unlock(); VOX.stop(); VOX.say(S.crew.K, tx, 'live'); }; }
}

/* ---------- Unterschied-Trainer ---------- */
function diffWords(a, b) {
  const ta = a.split(/\s+/), tb = b.split(/\s+/), norm = w => w.toLowerCase().replace(/[.,;:!?()„“"]/g, '');
  const A = ta.map(norm), B = tb.map(norm), m = A.length, n = B.length;
  const L = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const ka = new Set(), kb = new Set(); let i = 0, j = 0;
  while (i < m && j < n) { if (A[i] === B[j]) { ka.add(i); kb.add(j); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++; }
  const mark = (t, keep) => t.map((w, k) => keep.has(k) ? esc(w) : `<mark>${esc(w)}</mark>`).join(' ');
  return {sim: L[0][0] / Math.max(m, n), a: mark(ta, ka), b: mark(tb, kb)};
}

/* ---------- Schallsignal-Spieler ---------- */
function sigOf(q) { if (q.sig) return q.sig; const m = q.q.match(/\(([●▬\s]+)\)/); return m ? m[1].trim() : null; }
function sigBox(sig, hidden) {
  const tones = AUD.parseSig(sig);
  return `<div class="sig"><span class="tones" aria-label="Signal">${hidden ? '?' : tones.map((t, i) => `${t.gapBefore ? '&nbsp;&nbsp;' : ''}<span data-t="${i}">${t.type === 'short' ? '●' : '▬'}</span>`).join(' ')}</span>
    <button class="btn small" id="sigPlay">Signal anhören</button></div>`;
}
let hornCtl = null;
function bindSig(sig) {
  const b = $('#sigPlay'); if (!b) return;
  b.onclick = () => {
    AUD.unlock(); if (hornCtl) { hornCtl.stop(); hornCtl = null; b.textContent = 'Signal anhören'; return; }
    VOX.stop(); b.textContent = 'Stopp';
    hornCtl = AUD.horn(sig, (i, type, d) => { const e = document.querySelector(`[data-t="${i}"]`); if (e) { e.classList.add('on'); setTimeout(() => e.classList.remove('on'), d * 1000); } });
    hornCtl.done.then(() => { hornCtl = null; const x = $('#sigPlay'); if (x) x.textContent = 'Nochmal anhören'; });
  };
}
function hornQuiz() { runQuiz(shuffle(SIG_QS), 'Schallsignale hören', 'horn'); }

/* ---------- Quiz (Lernen) ---------- */
function runQuiz(queue, title, mode = 'learn') {
  subScreen(); place = 'quiz'; soundFor('quiz');
  let i = 0, right = 0; const wrong = [], requeued = new Set(); queue = queue.slice(); const total0 = queue.length;
  const M = S.crew.M, T = S.crew.T;
  function show() {
    if (i >= queue.length) return finish();
    if (hornCtl) { hornCtl.stop(); hornCtl = null; }
    const q = queue[i], order = shuffle([0, 1, 2, 3]), sig = sigOf(q), hide = mode === 'horn';
    app.innerHTML = `<div class="qhead"><div class="tag">${esc(title)} · ${esc(topicOf(q.n).name)}</div><button class="btn small ghost" id="quit">Beenden</button></div>
      <div class="prog"><i style="width:${(i / queue.length * 100).toFixed(0)}%"></i></div>
      <div class="card">
        <div class="tag">Frage ${q.n}${st(q.n) ? '' : ' · neu'}</div>
        <div class="qtext">${esc(hide ? 'Welche Bedeutung hat das Schallsignal, das du hörst?' : q.q.replace(/\s*\(([●▬\s]+)\)/, ''))}</div>
        ${sig ? sigBox(sig, hide) : ''}
        ${q.img ? `<div class="qimg">${q.img.map(s => `<img src="${s}" alt="Abbildung zu Frage ${q.n}">`).join('')}</div>` : ''}
        <div id="ans">${order.map(k => `<button class="ans" data-k="${k}">${esc(q.a[k])}</button>`).join('')}</div>
        <div id="after"></div>
      </div>
      <div class="crewrow">${charSVG(M)}<div class="say hidden" data-say="${M}"></div><div class="say hidden" data-say="${T}"></div>${charSVG(T)}</div>`;
    window.scrollTo(0, 0);
    $('#quit').onclick = () => { save(); setTab('deck'); };
    app.querySelectorAll('.ans').forEach(b => b.onclick = () => answer(q, +b.dataset.k));
    if (sig) { bindSig(sig); if (hide) setTimeout(() => { const b = $('#sigPlay'); if (b) b.click(); }, 500); }
  }
  function answer(q, k) {
    const ok = k === 0, retry = requeued.has(q.n);
    app.querySelectorAll('.ans').forEach(b => { b.disabled = true; const kk = +b.dataset.k; if (kk === 0) b.classList.add('ok'); else if (kk === k) b.classList.add('no'); });
    if (ok && !retry) right++; if (!ok) wrong.push({q, k});
    if (!retry) record(q.n, ok);
    if (!ok && !retry) { requeued.add(q.n); queue.push(q); }
    if (mode === 'horn') { const t = document.querySelector('.tones'); if (t) t.innerHTML = AUD.parseSig(sigOf(q)).map(x => x.type === 'short' ? '●' : '▬').join(' '); }
    let diff = '';
    if (!ok) { const d = diffWords(q.a[k], q.a[0]); if (d.sim >= .45) diff = `<div class="diff"><div class="tag" style="margin-bottom:4px">Der feine Unterschied</div><div class="w">Deine: ${d.a}</div><div class="r">Richtig: ${d.b}</div></div>`; }
    $('#after').innerHTML = `<div class="fb">${ok ? '<p style="margin:6px 0 0"><strong style="color:var(--stb)">Richtig.</strong></p>' : '<p style="margin:6px 0 0"><strong style="color:var(--bb)">Nicht ganz.</strong> Grün ist die Katalogantwort. Die Frage kommt am Ende noch einmal.</p>'}
      ${diff}
      <div id="expl" class="lesson" style="margin-top:8px"></div>
      <div class="row" style="margin-top:10px"><button class="btn ghost" id="why">Erklär's mir</button>${ok ? '' : `<button class="btn ghost" id="mn">Merkspruch von ${esc(CREW[T].short)}</button>`}</div>
      <button class="btn wide" id="nxt" style="margin-top:10px">Weiter</button></div>`;
    $('#nxt').onclick = () => { VOX.stop(); i++; show(); };
    $('#why').onclick = () => explain(q, k);
    const mn = $('#mn'); if (mn) mn.onclick = () => mnemonic(q);
    $('#nxt').scrollIntoView({block: 'nearest', behavior: 'smooth'});
    if (S.cfg.comments && AUD.ready) {
      if (ok && Math.random() < .3) { const w = Math.random() < .75 ? M : T; VOX.say(w, lineOf(w, 'right'), 'fixed'); }
      if (!ok && Math.random() < .35) VOX.say(T, lineOf(T, 'wrong'), 'fixed');
    }
  }
  function explain(q, k) {
    const ex = $('#expl'); $('#why').disabled = true; ex.innerHTML = `<p class="think">${esc(nameOf('K'))} überlegt…</p>`;
    ai(`Katalogfrage ${q.n}: ${q.q}${q.sig ? ' [' + q.sig + ']' : ''}${q.img ? ' (zur Frage gehört eine Abbildung, die du nicht siehst)' : ''}\nRichtige Katalogantwort: ${q.a[0]}\n${k !== 0 ? 'Gewählt wurde: ' + q.a[k] + '\n' : ''}Erkläre in 2 bis 4 Sätzen, warum die Katalogantwort stimmt${k !== 0 ? ' und was an der gewählten Antwort falsch ist' : ''}. Gib eine kurze Merkhilfe, wenn sie wirklich hilft.`, {system: leadPersona(), modelTier: 'quick', onText: tx => { ex.innerHTML = md(tx); }})
      .then(tx => { ex.innerHTML = md(tx); const b = document.createElement('button'); b.className = 'btn small ghost'; b.textContent = 'Vorlesen'; b.onclick = () => { AUD.unlock(); VOX.stop(); VOX.say(S.crew.K, tx, 'live'); }; ex.appendChild(b); })
      .catch(e => { ex.innerHTML = `<p class="muted">${esc(aiErr(e))}</p>`; $('#why').disabled = false; });
  }
  async function mnemonic(q) {
    const b = $('#mn'); b.disabled = true; const ex = $('#expl');
    let tx = S.mnemo[q.n];
    if (!tx) {
      ex.innerHTML = `<p class="think">${esc(CREW[T].short)} denkt nach…</p>`;
      try { tx = (await ai(`Katalogfrage ${q.n}: ${q.q}\nRichtige Antwort: ${q.a[0]}\nErfinde einen kurzen, lustigen Merkspruch, höchstens 20 Wörter, gern gereimt, der genau diese richtige Antwort sicher im Kopf verankert. Er muss inhaltlich exakt stimmen. Gib nur den Merkspruch aus.`, {system: `Du bist ${CREW[T].persona} Für Merksprüche darfst du ausnahmsweise bis zu 20 Wörter sagen.\n${RULES}`, modelTier: 'quick', maxTokens: 120})).trim().replace(/^["„]|["“]$/g, ''); S.mnemo[q.n] = tx; save(); }
      catch (e) { ex.innerHTML = `<p class="muted">${esc(aiErr(e))}</p>`; b.disabled = false; return; }
    }
    tx = tx.replace(/\*\*/g, ''); ex.innerHTML = `<div class="fact"><b>${esc(CREW[T].short)}:</b> ${esc(tx)}</div>`;
    AUD.unlock(); VOX.stop(); VOX.say(T, tx, 'fixed');
  }
  async function finish() {
    if (hornCtl) { hornCtl.stop(); hornCtl = null; }
    const ratio = total0 ? right / total0 : 0, idx = ratio >= .8 ? 0 : ratio >= .5 ? 1 : 2;
    app.innerHTML = `<div style="display:flex;gap:12px;align-items:flex-end;margin:18px 0 10px">${charSVG(M)}<div><h1 style="margin:0">${idx === 0 ? 'Klar Schiff!' : idx === 1 ? 'Gute Fahrt!' : 'Raue See heute.'}</h1></div></div>
      <div class="card"><div style="font:700 2.4rem/1 var(--hfont)">${Math.min(right, total0)} von ${total0}</div><p class="muted" style="margin:6px 0 0">beim ersten Versuch richtig. Falsche Fragen kommen in den nächsten Tagen öfter dran.</p></div>
      <button class="btn wide" id="home">Zurück an Deck</button>`;
    app.querySelector('svg.ch').style.width = '76px';
    $('#home').onclick = () => setTab('deck');
    if (AUD.ready) VOX.say(M, lineOf(M, 'praise', idx), 'fixed');
  }
  show();
}

/* ---------- Probeprüfung mit Dr. Kröger ---------- */
function examIntro() {
  subScreen(); place = 'exam'; soundFor('exam');
  let mode = 'real';
  app.innerHTML = `<div class="qhead"><div class="tag">Probeprüfung</div><button class="btn small ghost" id="back">Zurück</button></div>
    <div class="result">${charSVG('kroeger')}<div><h1 style="margin:0">Dr. Kröger prüft</h1><p class="muted" style="margin:4px 0 0">30 Fragen: 7 Basisfragen und 23 spezifische Fragen See. 60 Minuten.</p></div></div>
    <div class="card" style="margin-top:14px">
      <label id="mdl" style="margin-top:0">Wie willst du prüfen?</label>
      <div class="chips" role="group" aria-labelledby="mdl"><button class="chip" data-m="real" aria-pressed="true">Wie im Ernstfall</button><button class="chip" data-m="train" aria-pressed="false">Mit Rückmeldung</button></div>
      <p class="small muted" id="mdesc" style="margin:10px 0 0">Du siehst erst am Ende, was richtig war. Bestanden ab ${passMark()} richtigen Antworten.</p>
    </div>
    <button class="btn wide lamp" id="go" style="font-size:1.1rem">Prüfung beginnen</button>
    <p class="small muted" style="margin-top:10px">Die Navigationsaufgabe ist noch nicht dabei. Die Bestehensgrenze kannst du in den Einstellungen anpassen.</p>`;
  app.querySelector('svg.ch').style.width = '96px';
  $('#back').onclick = () => setTab('deck');
  app.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { mode = b.dataset.m; app.querySelectorAll('[data-m]').forEach(x => x.setAttribute('aria-pressed', x === b)); $('#mdesc').textContent = mode === 'real' ? `Du siehst erst am Ende, was richtig war. Bestanden ab ${passMark()} richtigen Antworten.` : 'Nach jeder Antwort siehst du, ob sie stimmt, und wie viele Fehler du dir noch leisten kannst.'; });
  $('#go').onclick = () => { AUD.unlock(); startExam(mode); };
}
function startExam(mode) {
  const base = shuffle(Q.filter(q => q.n <= 72)).slice(0, 7), spec = shuffle(Q.filter(q => q.n >= 73)).slice(0, 23);
  const qs = shuffle([...base, ...spec]), answers = new Array(30).fill(null);
  let i = 0, left = 3600, said10 = false, said3 = false; const pass = passMark(), maxWrong = 30 - pass;
  AUD.sfx('glocke', {vol: .7}); VOX.say('kroeger', lineOf('kroeger', 'start'), 'fixed');
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  clearInterval(examTimer);
  examTimer = setInterval(() => {
    left--; const t = $('#etime'); if (t) { t.textContent = fmt(left); t.classList.toggle('low', left <= 600); }
    if (left === 600 && !said10) { said10 = true; AUD.clock(.07); VOX.say('kroeger', lineOf('kroeger', 'time10'), 'fixed'); }
    if (left === 180 && !said3) { said3 = true; AUD.clock(.2); VOX.say('kroeger', lineOf('kroeger', 'time3'), 'fixed'); }
    if (left <= 0) { clearInterval(examTimer); examTimer = null; VOX.say('kroeger', lineOf('kroeger', 'end'), 'fixed'); finish(); }
  }, 1000);
  const wrongSoFar = () => answers.filter((a, k) => a !== null && a !== 0).length;
  function show() {
    if (i >= qs.length) return finish();
    const q = qs[i], order = shuffle([0, 1, 2, 3]), sig = sigOf(q);
    app.innerHTML = `<div class="exambar">${charSVG('kroeger')}<div><div class="tag">Frage ${i + 1} von 30</div>${mode === 'train' ? `<div class="small"><b>Noch ${Math.max(0, maxWrong - wrongSoFar())}</b> Fehler erlaubt</div>` : ''}</div><div class="time ${left <= 600 ? 'low' : ''}" id="etime">${fmt(left)}</div></div>
      <div class="prog"><i style="width:${(i / 30 * 100).toFixed(0)}%"></i></div>
      <div class="card"><div class="qtext">${esc(q.q.replace(/\s*\(([●▬\s]+)\)/, ''))}</div>${sig ? sigBox(sig, false) : ''}
        ${q.img ? `<div class="qimg">${q.img.map(s => `<img src="${s}" alt="Abbildung zu Frage ${q.n}">`).join('')}</div>` : ''}
        <div id="ans">${order.map(k => `<button class="ans" data-k="${k}">${esc(q.a[k])}</button>`).join('')}</div></div>
      <div class="row"><button class="btn ghost small" id="abort">Prüfung abbrechen</button></div>`;
    window.scrollTo(0, 0);
    app.querySelector('.exambar svg').addEventListener('click', () => VOX.say('kroeger', lineOf('kroeger', 'tap'), 'fixed'));
    if (sig) bindSig(sig);
    $('#abort').onclick = () => { if (confirm('Prüfung wirklich abbrechen? Sie wird nicht gewertet.')) { clearInterval(examTimer); examTimer = null; AUD.clock(0); setTab('deck'); } };
    app.querySelectorAll('.ans').forEach(b => b.onclick = () => {
      const k = +b.dataset.k; answers[i] = k;
      if (mode === 'train') {
        app.querySelectorAll('.ans').forEach(x => { x.disabled = true; const kk = +x.dataset.k; if (kk === 0) x.classList.add('ok'); else if (kk === k) x.classList.add('no'); });
        setTimeout(() => { i++; show(); }, k === 0 ? 700 : 1700);
      } else { b.setAttribute('aria-pressed', 'true'); app.querySelectorAll('.ans').forEach(x => x.disabled = true); setTimeout(() => { i++; show(); }, 220); }
    });
  }
  function finish() {
    clearInterval(examTimer); examTimer = null; AUD.clock(0); AUD.sfx('glocke', {vol: .7});
    const res = qs.map((q, k) => ({q, k: answers[k], ok: answers[k] === 0}));
    const score = res.filter(r => r.ok).length, basis = res.filter(r => r.ok && r.q.n <= 72).length, see = score - basis, passed = score >= pass;
    res.filter(r => !r.ok).forEach(r => { const s = st(r.q.n) || {b: 0, d: today(), w: 0, c: 0}; s.b = 1; s.w++; s.d = today(); S.qs[r.q.n] = s; });
    S.exams = (S.exams || []).concat({day: today(), score, n: 30, pass: passed, basis, see, mode}); save();
    const wrongs = res.filter(r => !r.ok);
    app.innerHTML = `<div class="result" style="margin-top:16px">${charSVG('kroeger')}<div><div class="big ${passed ? 'pass' : 'fail'}">${passed ? 'Bestanden' : 'Nicht bestanden'}</div><div style="font:700 1.4rem var(--hfont)">${score} von 30 richtig</div><div class="small muted">Basisfragen ${basis} von 7 · See-Fragen ${see} von 23 · Grenze ${pass}</div></div></div>
      ${wrongs.length ? `<h2 style="margin-top:18px">Das schauen wir uns nochmal an</h2>${wrongs.map(w => { const d = w.k !== null ? diffWords(w.q.a[w.k], w.q.a[0]) : null; return `<div class="card"><div class="tag">Frage ${w.q.n}</div><p><strong>${esc(w.q.q)}</strong></p>${w.q.img ? `<div class="qimg">${w.q.img.map(s => `<img src="${s}" alt="">`).join('')}</div>` : ''}
        ${w.k === null ? '<p class="muted">Nicht beantwortet.</p>' : d && d.sim >= .45 ? `<div class="diff"><div class="w">Deine: ${d.a}</div><div class="r">Richtig: ${d.b}</div></div>` : `<p style="color:var(--bb);margin:0 0 4px">Deine: ${esc(w.q.a[w.k])}</p><p style="color:var(--stb);margin:0">Richtig: ${esc(w.q.a[0])}</p>`}</div>`; }).join('')}` : ''}
      <button class="btn wide" id="home" style="margin-top:6px">Zurück an Deck</button>`;
    app.querySelector('svg.ch').style.width = '96px';
    $('#home').onclick = () => setTab('deck');
    setTimeout(() => VOX.say('kroeger', lineOf('kroeger', passed ? 'pass' : 'fail'), 'fixed'), 900);
  }
  show();
}

/* ---------- Logbuch ---------- */
function renderLog() {
  place = 'log';
  const all = Q.length, mastered = Q.filter(q => st(q.n) && st(q.n).b >= 3).length, ex = (S.exams || []).slice(-6).reverse();
  app.innerHTML = `<div class="qhead" style="margin-top:18px"><h1 style="margin:0">Logbuch</h1><button class="btn small ghost" id="set">Einstellungen</button></div>
    ${courseCard()}
    <div class="card"><div style="font:700 2.2rem/1 var(--hfont)">${mastered} / ${all}</div><div class="muted">Fragen sicher (mindestens dreimal in Folge richtig)</div>
      <p class="small muted" style="margin:10px 0 0">Die Bestehenschance ist eine Schätzung: Für jede Frage nehme ich je nach Lernstand eine Trefferwahrscheinlichkeit an und rechne damit eine Prüfung mit 30 Fragen durch.</p></div>
    ${ex.length ? `<div class="card"><h3>Letzte Probeprüfungen</h3>${ex.map(e => `<div class="row" style="justify-content:space-between;margin:4px 0"><span>${e.score} von ${e.n} richtig${e.mode === 'train' ? ' <span class="muted small">(mit Rückmeldung)</span>' : ''}</span><b class="${e.pass ? 'pass' : 'fail'}" style="flex:0 0 auto">${e.pass === undefined ? '' : e.pass ? 'Bestanden' : 'Nicht bestanden'}</b></div>`).join('')}</div>` : ''}
    <div class="card"><h3>Themen</h3>${TOPICS.map(t => { const s = topicStats(t); return `<div class="topic"><div class="row" style="justify-content:space-between"><span>${t.name}</span><span class="muted small" style="flex:0 0 auto">${s.m}/${s.total}</span></div><div class="bar"><span class="m" style="width:${s.m / s.total * 100}%"></span><span class="l" style="width:${s.l / s.total * 100}%"></span></div></div>`; }).join('')}
      <p class="small muted" style="margin:6px 0 0">Grün: sicher. Gelb: in Arbeit.</p></div>
    <div class="card small muted"><p style="margin:0">Noch nicht enthalten: die Bildfragen 16 bis 30 und die Navigationsaufgaben 286 bis 300.</p></div>`;
  $('#set').onclick = renderSettings; bindSaying();
}

/* ---------- Einstellungen ---------- */
function renderSettings() {
  subScreen(); $('#tabs').classList.remove('hidden');
  const c = S.cfg, sel = (id, opts, val) => `<select id="${id}">${opts.map(([v, l]) => `<option value="${v}" ${String(v) === String(val) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  const slider = (id, label, val) => `<label for="${id}">${label}</label><input type="range" id="${id}" min="0" max="1" step="0.05" value="${val}">`;
  app.innerHTML = `<div class="set"><div class="qhead" style="margin-top:18px"><h1 style="margin:0">Einstellungen</h1><button class="btn small ghost" id="back">Zurück</button></div>
  <h2>Crew</h2>
  ${Object.entries(ROLE_OPTIONS).map(([role, ids]) => `<div class="card"><h3>${ROLE_NAMES[role]}</h3><div class="crewpick">${ids.map(id => `<button data-role="${role}" data-id="${id}" aria-pressed="${S.crew[role] === id}">${charSVG(id)}<b>${CREW[id].short}</b><small>${CREW[id].blurb}</small></button>`).join('')}</div>
    <details style="margin-top:10px"><summary>Geschichte von ${CREW[S.crew[role]].short}</summary><p class="small" style="margin:8px 0 0">${CREW[S.crew[role]].story}</p></details></div>`).join('')}
  <div class="card"><h3>${ROLE_NAMES.P}</h3><div style="display:flex;gap:12px;align-items:center">${charSVG('kroeger')}<p class="small" style="margin:0">${CREW.kroeger.story}</p></div></div>

  <h2>Schlüssel</h2>
  <div class="card"><label for="ak" style="margin-top:0">Anthropic-Schlüssel (für Gespräche, Lektionen, Geschichten)</label>
    <input type="password" id="ak" autocomplete="off" placeholder="sk-ant-…" value="${apiKey() ? '••••••••' + esc(apiKey().slice(-4)) : ''}">
    <div class="row" style="margin-top:10px"><button class="btn" id="aks">Speichern und testen</button>${apiKey() ? '<button class="btn ghost" id="akd">Entfernen</button>' : ''}</div><p class="status" id="akr"></p>
    <label for="mdl">Modell</label>${sel('mdl', [['smart', 'Gründlich (Claude Sonnet 5.5)'], ['fast', 'Schnell und günstig (Claude Haiku 4.5)']], S.model || 'smart')}
  </div>
  <div class="card"><label for="ek" style="margin-top:0">ElevenLabs-Schlüssel (für die Stimmen)</label>
    <input type="password" id="ek" autocomplete="off" placeholder="sk_…" value="${elKey() ? '••••••••' + esc(elKey().slice(-4)) : ''}">
    <div class="row" style="margin-top:10px"><button class="btn" id="eks">Speichern und testen</button>${elKey() ? '<button class="btn ghost" id="ekd">Entfernen</button>' : ''}</div><p class="status" id="ekr"></p>
    <p class="small muted" style="margin:0">Beide Schlüssel bleiben nur auf diesem Handy und gehen direkt an Anthropic bzw. ElevenLabs.</p>
  </div>

  <h2>Stimmen</h2>
  <div class="card" id="voices"><p class="small muted" style="margin:0">${elKey() ? 'Lade Stimmen…' : 'Trag zuerst den ElevenLabs-Schlüssel ein.'}</p></div>
  <div class="card">
    <label for="qual" style="margin-top:0">Stimmenqualität für feste Sätze und Geschichten</label>${sel('qual', [['sparsam', 'Sparsam (Flash, etwa halbe Credits)'], ['hoch', 'Hoch (Multilingual, 1 Credit pro Zeichen)']], c.quality)}
    <label for="bud">Tageslimit für die Live-Stimme im Gespräch</label>${sel('bud', [[500, '500 Zeichen'], [1000, '1.000 Zeichen'], [1500, '1.500 Zeichen'], [3000, '3.000 Zeichen'], [6000, '6.000 Zeichen'], [100000, 'Kein Limit']], c.budget)}
    <p class="small muted" style="margin:6px 0 0">Heute im Live-Gespräch: ${VOX.usageToday().live.toLocaleString('de-DE')} Zeichen, insgesamt neu erzeugt: ${VOX.usageToday().all.toLocaleString('de-DE')}. Gespeicherte Sätze kosten nichts.</p>
    <label for="fb">Wenn keine Stimme verfügbar ist</label>${sel('fb', [['phone', 'Handystimme'], ['babble', 'Brabbeln und mitlesen'], ['text', 'Nur mitlesen']], c.fallback)}
    <div class="row" style="margin-top:12px"><button class="btn ghost" id="clr">Gespeicherte Sätze löschen</button></div><p class="status" id="clrr"></p>
  </div>

  <h2>Zuhören</h2>
  <div class="card">
    <label for="stt" style="margin-top:0">Spracherkennung</label>${sel('stt', [['phone', 'Handy (kostenlos, braucht Chrome)'], ['eleven', 'ElevenLabs (genauer, kostet Credits)']], c.stt)}
    <p class="small muted" style="margin:6px 0 0">Laut einer Preisübersicht kostet die ElevenLabs-Erkennung etwa 330 Credits pro Minute.</p>
    <label for="pz">Redepause, bevor die Crew antwortet: <b id="pzv">${c.pause} Sekunden</b></label><input type="range" id="pz" min="1" max="5" step="0.5" value="${c.pause}">
  </div>

  <h2>Ton und Wetter</h2>
  <div class="card">${slider('vm', 'Musik', c.music)}${slider('va', 'Geräusche', c.amb)}${slider('vs', 'Effekte', c.sfx)}${slider('vv', 'Stimmen', c.voice)}
    <label for="wxs">Wettergeräusche</label>${sel('wxs', [['1', 'An'], ['0', 'Aus']], c.wxSound === false ? '0' : '1')}
    <label for="wx">Wetter</label>${sel('wx', [['auto', 'Jeden Tag anders (meistens schön)'], ['schoen', 'Immer schön'], ['windig', 'Frischer Wind'], ['sturm', 'Wind und Regen'], ['regen', 'Windstill und Regen'], ['nebel', 'Nebel']], c.wx)}
    <label for="cm">Kommentare der Crew beim Lernen</label>${sel('cm', [['1', 'An'], ['0', 'Aus']], c.comments ? '1' : '0')}
    <label for="th">Helligkeit</label>${sel('th', [['auto', 'Nach Tageszeit'], ['hell', 'Immer hell'], ['dunkel', 'Immer dunkel']], c.theme)}
  </div>

  <h2>Prüfung</h2>
  <div class="card">
    <label for="ex2" style="margin-top:0">Prüfungsdatum</label><input type="date" id="ex2" value="${S.profile.exam}">
    <label for="mi2">Lernzeit pro Tag</label>${sel('mi2', [15, 30, 45, 60, 90].map(m => [m, m + ' Minuten']), S.profile.minutes)}
    <label for="ps2">Bestanden ab wie vielen richtigen von 30?</label><input type="text" inputmode="numeric" id="ps2" value="${passMark()}">
    <p class="small muted" style="margin:6px 0 0">Eingestellt sind 24. Die genaue Regel klärst du noch, dann trag sie hier ein.</p>
    <button class="btn" id="sv" style="margin-top:12px">Speichern</button>
  </div>

  <h2>Selbsttest</h2>
  <div class="card" id="stcard"><p class="small" style="margin:0 0 10px">Prüft Browser, Mikrofon, beide Schlüssel, Stimmen und Ton. Kostet etwa 20 ElevenLabs-Credits und einen Bruchteil eines Cents bei Anthropic.</p>
    <button class="btn wide" id="strun">Selbsttest starten</button><div id="stout" style="margin-top:10px"></div></div>

  <h2>Sonstiges</h2>
  <div class="card">
    <div class="row"><button class="btn ghost" id="intro">Intro nochmal ansehen</button><button class="btn ghost" id="src">Quellen</button></div>
    <div class="row" style="margin-top:10px"><button class="btn ghost" id="bk">Sicherung speichern</button><button class="btn ghost" id="rsBk">Sicherung laden</button></div>
    <input type="file" id="bkf" accept="application/json,.json" class="hidden">
    <p class="small muted" style="margin:10px 0 0">Dein Lernstand liegt nur in diesem Browser. Speichere ab und zu eine Sicherung.</p>
    <button class="btn ghost wide" id="rs" style="margin-top:10px;color:var(--bb)">Alles zurücksetzen</button>
  </div></div>`;
  app.querySelectorAll('.crewpick svg').forEach(s => s.style.width = '64px');
  app.querySelectorAll('.card > div > svg.ch').forEach(s => { s.style.width = '64px'; s.style.flex = 'none'; });
  $('#back').onclick = () => setTab('log');
  app.querySelectorAll('[data-role]').forEach(b => b.onclick = () => { S.crew[b.dataset.role] = b.dataset.id; save(); AUD.unlock(); renderSettings(); setTimeout(() => VOX.say(b.dataset.id, lineOf(b.dataset.id, 'tap', 0), 'fixed'), 200); });
  const keyBind = (inp, btn, del, out, setter, getter, test) => {
    $(inp).onfocus = () => { if ($(inp).value.startsWith('••')) $(inp).value = ''; };
    if ($(del)) $(del).onclick = () => { setter(''); renderSettings(); };
    $(btn).onclick = async () => {
      const v = $(inp).value.trim(); if (v && !v.startsWith('••')) setter(v);
      const o = $(out); if (!getter()) { o.className = 'status err'; o.textContent = 'Bitte einen Schlüssel einfügen.'; return; }
      o.className = 'status'; o.textContent = 'Teste die Verbindung…';
      try { o.textContent = await test(); o.className = 'status ok'; } catch (e) { o.className = 'status err'; o.textContent = e.msg || aiErr(e); }
    };
  };
  keyBind('#ak', '#aks', '#akd', '#akr', setApiKey, apiKey, async () => { await ai('Antworte nur mit: Ahoi', {modelTier: 'quick', maxTokens: 10}); return 'Verbindung steht. Ahoi!'; });
  keyBind('#ek', '#eks', '#ekd', '#ekr', k => { setElKey(k); VOX.resetFlags(); }, elKey, async () => {
    try { const list = await VOX.listVoices(true); VOX.autoAssign(list); } catch (e) { throw {msg: e.code === 'el_bad_key' ? 'Der Schlüssel wird nicht akzeptiert. Hat er Leserechte für Stimmen?' : 'ElevenLabs ist gerade nicht erreichbar.'}; }
    const cr = await VOX.credits(); loadVoices();
    return cr && !cr.unknown ? `Verbunden. Noch ${cr.left.toLocaleString('de-DE')} von ${cr.limit.toLocaleString('de-DE')} Credits.` : 'Verbunden. Das Guthaben kann ich mit diesem Schlüssel nicht abfragen.';
  });
  $('#mdl').onchange = () => { S.model = $('#mdl').value; save(); };
  const bindSel = (id, fn) => { $(id).onchange = () => { fn($(id).value); save(); }; };
  bindSel('#qual', v => c.quality = v); bindSel('#bud', v => c.budget = +v); bindSel('#fb', v => c.fallback = v); bindSel('#stt', v => c.stt = v);
  bindSel('#wxs', v => { c.wxSound = v === '1'; soundFor(place); }); bindSel('#wx', v => { c.wx = v; soundFor(place); });
  bindSel('#cm', v => c.comments = v === '1'); bindSel('#th', v => { c.theme = v; applyTheme(); });
  $('#pz').oninput = () => { c.pause = +$('#pz').value; $('#pzv').textContent = c.pause + ' Sekunden'; save(); };
  [['#vm', 'music'], ['#va', 'amb'], ['#vs', 'sfx'], ['#vv', 'voice']].forEach(([id, k]) => $(id).oninput = () => { c[k] = +$(id).value; AUD.applyVolumes(); save(); });
  $('#clr').onclick = async () => { await CLIPS.clear(); $('#clrr').textContent = 'Gelöscht. Sätze werden bei Bedarf neu erzeugt.'; };
  $('#sv').onclick = () => { S.profile.exam = $('#ex2').value || S.profile.exam; S.profile.minutes = +$('#mi2').value; const ps = parseInt($('#ps2').value, 10); if (ps >= 1 && ps <= 30) S.profile.pass = ps; S.plan = null; save(); toast('Gespeichert.'); };
  $('#intro').onclick = () => { stopAll(); S.introDone = false; save(); AUD.unlock(); runIntro(); };
  $('#src').onclick = renderSources;
  $('#bk').onclick = () => { const blob = new Blob([JSON.stringify(S)], {type: 'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'skipper-sicherung-' + new Date().toISOString().slice(0, 10) + '.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); };
  $('#rsBk').onclick = () => $('#bkf').click();
  $('#bkf').onchange = async () => { const f = $('#bkf').files[0]; if (!f) return; try { const v = JSON.parse(await f.text()); if (!v || !v.profile) throw 0; if (!confirm('Lernstand aus der Sicherung übernehmen? Der aktuelle wird ersetzt.')) return; localStorage.setItem(KEY, JSON.stringify(v)); S = load(); toast('Sicherung geladen.'); setTab('deck'); } catch (e) { toast('Die Datei ist keine gültige Skipper-Sicherung.'); } };
  $('#rs').onclick = () => { if (confirm('Willst du wirklich deinen gesamten Lernstand löschen?')) { try { localStorage.removeItem(KEY); } catch (e) {} S = load(); stopAll(); splash(); } };
  $('#strun').onclick = () => { AUD.unlock(); runSelfTest($('#stout'), $('#strun')); };
  if (elKey()) loadVoices();
}
async function runSelfTest(out, btn) {
  btn.disabled = true; const rows = [];
  const draw = (busy) => { out.innerHTML = rows.map(r => `<div class="trow"><b class="${r.ok === true ? 'pass' : r.ok === false ? 'fail' : 'muted'}">${r.ok === true ? '✓' : r.ok === false ? '✗' : '–'}</b><div><b>${esc(r.label)}</b><div class="small muted">${esc(r.detail || '')}</div></div></div>`).join('') + (busy ? `<p class="think" style="margin:8px 0 0">${esc(busy)}</p>` : ''); };
  const add = (ok, label, detail) => { rows.push({ok, label, detail}); draw(); };
  const ua = navigator.userAgent; let br = /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /Firefox|FxiOS/.test(ua) ? 'Firefox' : /EdgA?\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Chrome|CriOS/.test(ua) ? 'Chrome' : 'unbekannt';
  try { if (navigator.brave && await navigator.brave.isBrave()) br = 'Brave'; } catch (e) {}
  add(br === 'Chrome' ? true : null, 'Browser: ' + br, br === 'Chrome' ? 'Passt.' : br === 'Brave' ? 'Brave sperrt die Spracherkennung meist. Nimm Chrome oder einen ElevenLabs-Schlüssel mit „Sprache zu Text“.' : 'Am zuverlässigsten läuft die App in Chrome.');
  add(VOX.hasSR ? true : (elKey() ? null : false), 'Spracherkennung im Browser', VOX.hasSR ? 'Vorhanden.' : elKey() ? 'Fehlt. Ich nutze stattdessen ElevenLabs.' : 'Fehlt. Nimm Chrome oder trag einen ElevenLabs-Schlüssel ein.');
  let mic = 'unbekannt'; try { mic = (await navigator.permissions.query({name: 'microphone'})).state; } catch (e) {}
  add(mic === 'granted' ? true : mic === 'denied' ? false : null, 'Mikrofon', {granted: 'Erlaubt.', denied: 'Gesperrt. Tippe in der Adresszeile auf das Schloss-Symbol und erlaube das Mikrofon.', prompt: 'Noch nicht gefragt. Der Browser fragt beim ersten Sprechen.'}[mic] || 'Status unbekannt.');
  draw('Teste den Ton…'); try { await AUD.sfx('glocke', {vol: .8}); add(null, 'Ton', 'Eben hat eine Glocke geläutet. Hast du sie gehört? Wenn nicht: Lautstärke hoch, Stummschalter aus.'); } catch (e) { add(false, 'Ton', 'Konnte nichts abspielen.'); }
  if (!apiKey()) add(false, 'Anthropic-Schlüssel', 'Fehlt. Ohne ihn gibt es keine Gespräche, Lektionen und Geschichten.');
  else { draw('Teste Anthropic…'); try { await ai('Antworte nur mit: Ahoi', {modelTier: 'quick', maxTokens: 10}); add(true, 'Anthropic-Schlüssel', 'Verbindung steht.'); } catch (e) { add(false, 'Anthropic-Schlüssel', aiErr(e)); } }
  if (!elKey()) add(null, 'ElevenLabs-Schlüssel', 'Nicht eingetragen. Die Crew spricht mit der Ersatzstimme.');
  else {
    draw('Teste ElevenLabs…'); let list = null;
    try { list = await VOX.listVoices(true); VOX.autoAssign(list); add(true, 'ElevenLabs: Stimmen', `${list.length} Stimmen gefunden.`); }
    catch (e) { add(false, 'ElevenLabs: Stimmen', e.code === 'el_perm' ? 'Der Schlüssel darf die Stimmen nicht lesen. Setze beim Schlüssel „Stimmen“ auf „Gelesen“.' : e.code === 'el_bad_key' ? 'Der Schlüssel wird nicht akzeptiert. Prüf, ob er vollständig kopiert ist und nicht abgelaufen.' : 'ElevenLabs ist nicht erreichbar.'); }
    const cr = await VOX.credits(); add(cr && !cr.unknown ? true : null, 'ElevenLabs: Guthaben', cr && !cr.unknown ? `Noch ${cr.left.toLocaleString('de-DE')} von ${cr.limit.toLocaleString('de-DE')} Credits.` : 'Nicht abrufbar. Dafür braucht der Schlüssel „Benutzer: Gelesen“. Für die App nicht nötig.');
    if (list && list.length) {
      draw('Teste die Stimme…');
      try { const b = await VOX.ttsTest(S.voices[S.crew.K], 'Moin, hier ist die Crew.'); const a = new Audio(URL.createObjectURL(b)); a.play().catch(() => {}); add(true, 'ElevenLabs: Text zu Sprache', `${nameOf('K')} hat eben „Moin, hier ist die Crew“ gesagt.`); }
      catch (e) { add(false, 'ElevenLabs: Text zu Sprache', e.code === 'el_perm' ? 'Der Schlüssel darf „Text zu Sprache“ nicht nutzen.' : e.code === 'el_quota' ? 'Das Guthaben oder das Schlüssel-Limit ist aufgebraucht.' : 'Hat nicht geklappt' + (e.status ? ` (Fehler ${e.status})` : '') + '.'); }
    }
    draw('Teste die Spracherkennung von ElevenLabs…');
    try { const r = await VOX.sttTest(); add(r.ok ? true : r.perm ? (VOX.hasSR ? null : false) : false, 'ElevenLabs: Sprache zu Text', r.ok ? 'Erlaubt.' : r.perm ? `Nicht erlaubt.${VOX.hasSR ? ' Kein Problem, solange die Handy-Erkennung läuft.' : ' Setze beim Schlüssel „Sprache zu Text“ auf „Zugriff“.'}` : `Hat nicht geklappt (Fehler ${r.status}).`); }
    catch (e) { add(false, 'ElevenLabs: Sprache zu Text', 'Nicht erreichbar.'); }
  }
  draw(); btn.disabled = false; btn.textContent = 'Selbsttest wiederholen';
}
async function loadVoices() {
  const box = $('#voices'); if (!box) return;
  let list = [];
  try { list = await VOX.listVoices(); VOX.autoAssign(list); } catch (e) { box.innerHTML = `<p class="small status err" style="margin:0">${e.code === 'el_bad_key' ? 'Der ElevenLabs-Schlüssel wird nicht akzeptiert.' : 'Die Stimmenliste ist gerade nicht erreichbar.'}</p>`; return; }
  if (!list.length) { box.innerHTML = '<p class="small muted" style="margin:0">Keine Stimmen gefunden.</p>'; return; }
  const ids = [S.crew.K, S.crew.M, S.crew.T, 'kroeger'];
  box.innerHTML = ids.map(id => `<div class="voice-row">${charSVG(id)}<div><b style="font-family:var(--hfont)">${CREW[id].short}</b><select data-v="${id}" aria-label="Stimme für ${CREW[id].short}">${list.map(v => `<option value="${v.id}" ${S.voices[id] === v.id ? 'selected' : ''}>${esc(v.name)}${v.labels && v.labels.gender ? ' · ' + esc(v.labels.gender) : ''}${v.labels && v.labels.age ? ', ' + esc(v.labels.age) : ''}</option>`).join('')}</select></div><div style="display:flex;flex-direction:column;gap:6px"><button class="btn small ghost" data-pv="${id}">Hörprobe</button><button class="btn small ghost" data-ts="${id}">Testsatz</button></div></div>`).join('') +
    `<p class="small muted" style="margin:10px 0 0">Die Hörprobe ist kostenlos, der Testsatz kostet ein paar Credits. Tipp: In der ElevenLabs-Stimmenbibliothek kannst du deutsche Stimmen zu „Meine Stimmen“ hinzufügen, dann erscheinen sie hier.</p>`;
  box.querySelectorAll('svg.ch').forEach(s => s.style.width = '52px');
  box.querySelectorAll('[data-v]').forEach(s => s.onchange = () => { S.voices[s.dataset.v] = s.value; save(); });
  box.querySelectorAll('[data-pv]').forEach(b => b.onclick = () => { AUD.unlock(); VOX.preview(b.dataset.pv, S.voices[b.dataset.pv]); });
  box.querySelectorAll('[data-ts]').forEach(b => b.onclick = () => { AUD.unlock(); VOX.stop(); const id = b.dataset.ts; VOX.say(id, lineOf(id, 'tap', 0) || 'Moin!', 'fixed'); });
}
function renderSources() {
  subScreen();
  const files = ['leberch-ambient-517427.mp3', 'Space_Ambient__leberch.mp3', 'icecodebeats-slow-down-the-boat-3-568312.mp3', 'kaazoom-slow-turn-in-the-lamplight-smooth-jazz-song-male-vocal-480995.mp3', 'soundreality-baltic-sea-beach-waves-midnight-611953.mp3', 'soundreality-wind-blowing-457954.mp3', 'storegraphic-soft-wind-477404.mp3', 'freesound_community-gentle-rain-from-window-24548.mp3', 'audiopapkin-wall-clock-ticking-308746.mp3', 'freesound_community-canvas-dropcloth-snap-1-98862.mp3', 'u_7xr5ffk4oq-opening-bell-421471.mp3', 'freesound_community-herring-gull-1-27057.mp3', 'freesound_community-065410_great-echoing-foghornaiff-40903.mp3', 'flutie8211-foghorn-1-549807.mp3'];
  app.innerHTML = `<div class="qhead" style="margin-top:18px"><h1 style="margin:0">Quellen</h1><button class="btn small ghost" id="back">Zurück</button></div>
    <div class="card"><h3>Musik und Geräusche</h3><p class="small muted">Angegeben ist jeweils der vollständige Dateiname der Vorlage (Künstler, Titel, Nummer).</p><ul class="credits small">${files.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>
    <div class="card"><h3>Fragen</h3><p class="small" style="margin:0">Amtlicher Fragenkatalog für den Sportbootführerschein See, Stand 1. August 2023, Wasserstraßen- und Schifffahrtsverwaltung des Bundes.</p></div>
    <div class="card"><h3>Schriften und Technik</h3><p class="small" style="margin:0">Schriften Baloo 2 und Nunito über Google Fonts. Gespräche mit Claude von Anthropic, Stimmen von ElevenLabs. Schallsignale werden in der App selbst erzeugt.</p></div>`;
  $('#back').onclick = renderSettings;
}

/* ---------- Los geht's ---------- */
boot();

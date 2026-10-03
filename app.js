/* ==========================================================================
   Skipper 2.0 – Hauptlogik
   ========================================================================== */
const Q = DATA.filter(q => !q.skip);
const QN = Object.fromEntries(DATA.map(q => [q.n, q]));
const TOPICS = [
  {id: 'b1', name: 'Grundbegriffe und Grundregeln', from: 1, to: 15},
  {id: 'b3', name: 'Umwelt, Anlegen und Bootshandling', from: 31, to: 48},
  {id: 'b4', name: 'Motor, Tanken und Technik', from: 49, to: 62},
  {id: 'b5', name: 'Sicherheit an Bord und Notfall', from: 63, to: 72},
  {id: 's1', name: 'Recht und Begriffe auf See', from: 73, to: 90},
  {id: 's2', name: 'Lichter und Signalkörper', from: 91, to: 115},
  {id: 's3', name: 'Schallsignale bei verminderter Sicht', from: 116, to: 124},
  {id: 's4', name: 'Ausweichregeln und Verkehrsverhalten', from: 125, to: 152},
  {id: 's5', name: 'Fahrwasser, Sondervorschriften und Sichtzeichen', from: 153, to: 189},
  {id: 's6', name: 'Betonnung und Leuchtfeuer', from: 190, to: 216},
  {id: 's7', name: 'Naturschutz und nautische Veröffentlichungen', from: 217, to: 232},
  {id: 's8', name: 'Navigation und Gezeiten', from: 233, to: 256},
  {id: 's9', name: 'Seemannschaft und Wetter', from: 257, to: 272},
  {id: 's10', name: 'Sicherheit und Notsignale auf See', from: 273, to: 285},
];
const topicOf = n => TOPICS.find(t => n >= t.from && n <= t.to);
const INT = [0, 1, 2, 4, 7, 14]; // Lernkartei-Abstände in Tagen
const EXP = {none: 'noch nie selbst ein Boot gefahren', guest: 'schon mitgefahren, aber nie selbst gesteuert', some: 'schon selbst ein Boot gesteuert', lots: 'viel Erfahrung auf dem Wasser'};
const KEY = 'skipper-sbfsee-v1';
const DEFAULT_CFG = {music: .35, amb: .6, sfx: .7, voice: 1, pause: 2, stt: 'phone', quality: 'sparsam', fallback: 'phone', theme: 'auto', comments: true, budget: 1500, wxSound: true, wx: 'auto', read: true};
const SIG_QS = Q.filter(q => q.sig);

/* ---------- Speicher ---------- */
var S = load();
function fresh() { return {profile: null, qs: {}, lessons: {}, chat: [], plan: null}; }
function load() {
  let v = null; try { v = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (!v || typeof v !== 'object') v = fresh();
  v.cfg = Object.assign({}, DEFAULT_CFG, v.cfg || {});
  v.crew = Object.assign({K: 'hinnerk', M: 'smilla', T: 'klabauter'}, v.crew || {});
  v.voices = v.voices || {}; v.qs = v.qs || {}; v.lessons = v.lessons || {}; v.talk = v.talk || []; v.mnemo = v.mnemo || {};
  return v;
}
function save() { S.updatedAt = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

/* ---------- Datum ---------- */
const dayNum = d => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
const today = () => dayNum(new Date());
function examDay() { const [y, m, d] = S.profile.exam.split('-').map(Number); return dayNum(new Date(y, m - 1, d)); }
const daysLeft = () => Math.max(0, examDay() - today());
const fmtDate = iso => new Date(iso + 'T12:00').toLocaleDateString('de-DE', {day: 'numeric', month: 'long'});

/* ---------- Lernlogik (Lernkartei) ---------- */
const st = n => S.qs[n] || null;
const isDue = n => { const s = st(n); return s && s.b < 5 && s.d + INT[s.b] <= today(); };
const unseen = () => Q.filter(q => !st(q.n));
function computePlan() {
  const t = today();
  if (S.plan && S.plan.day === t) return S.plan;
  const left = Math.max(1, daysLeft());
  const reviewDays = left >= 8 ? Math.round(left * .2) : Math.floor(left / 4);
  const learnLeft = Math.max(1, left - reviewDays), u = unseen().length;
  const cap = Math.max(10, Math.round(S.profile.minutes * 2));
  S.plan = {day: t, newTarget: u ? Math.ceil(u / learnLeft) : 0, newDone: 0, revDone: 0, cap};
  save(); return S.plan;
}
function todayNumbers() {
  const p = computePlan(), due = Q.filter(q => isDue(q.n)).length;
  const newLeft = Math.max(0, Math.min(p.newTarget - p.newDone, unseen().length));
  return {p, due, newLeft, tight: p.newTarget + due > p.cap * 1.15};
}
function record(n, ok) {
  const s = st(n) || {b: 0, d: today(), w: 0, c: 0}, wasNew = !st(n);
  s.b = ok ? Math.min(5, s.b + 1) : 1; if (!ok) s.w++; else s.c++; s.d = today();
  S.qs[n] = s; const p = computePlan(); if (wasNew) p.newDone++; else p.revDone++; save();
}
function topicStats(t) {
  const list = Q.filter(q => q.n >= t.from && q.n <= t.to); let m = 0, l = 0;
  list.forEach(q => { const s = st(q.n); if (s) { if (s.b >= 3) m++; else l++; } });
  return {total: list.length, m, l};
}
function weakTopics() {
  return TOPICS.map(t => { const list = Q.filter(q => q.n >= t.from && q.n <= t.to && st(q.n)); const w = list.reduce((a, q) => a + st(q.n).w, 0); return {t, r: list.length ? w / list.length : 0}; })
    .filter(x => x.r > .3).sort((a, b) => b.r - a.r).slice(0, 3).map(x => x.t.name);
}
const PROB = [.25, .5, .7, .85, .92, .97];
const passMark = () => (S.profile && S.profile.pass) || 24;
function passChance() {
  const pass = passMark(), n = 30;
  const p = Q.reduce((a, q) => a + (st(q.n) ? PROB[st(q.n).b] : PROB[0]), 0) / Q.length;
  let c = 1, tail = 0;
  for (let k = 0; k <= n; k++) { if (k > 0) c = c * (n - k + 1) / k; if (k >= pass) tail += c * Math.pow(p, k) * Math.pow(1 - p, n - k); }
  return Math.min(1, tail);
}
function racePos() {
  const start = S.start || (S.start = today(), save(), S.start);
  const span = Math.max(1, examDay() - start), LEAD = .15;
  return {exam: LEAD + (1 - LEAD) * Math.min(1, Math.max(0, (today() - start) / span)), you: passChance()};
}
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- Claude ---------- */
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODELS = {smart: 'claude-sonnet-5-5', fast: 'claude-haiku-4-5-20251001'};
const KEYSTORE = 'skipper-apikey';
function apiKey() { try { return (localStorage.getItem(KEYSTORE) || '').trim(); } catch (e) { return ''; } }
function setApiKey(k) { try { k ? localStorage.setItem(KEYSTORE, k.trim()) : localStorage.removeItem(KEYSTORE); } catch (e) {} }
function pickModel(o) { if (o.modelTier === 'complex') return MODELS.smart; if (o.modelTier === 'quick') return MODELS.fast; return MODELS[S.model || 'smart'] || MODELS.smart; }
function toMessages(input) {
  const raw = typeof input === 'string' ? [{role: 'user', content: input}] : input, out = [];
  raw.forEach(m => { const c = String(m.content || ''); if (!c) return; if (out.length && out[out.length - 1].role === m.role) out[out.length - 1].content += '\n\n' + c; else out.push({role: m.role, content: c}); });
  while (out.length && out[0].role !== 'user') out.shift();
  return out;
}
async function ai(input, opts = {}) {
  const key = apiKey(); if (!key) throw {code: 'no_key'};
  const body = {model: pickModel(opts), max_tokens: opts.maxTokens || 1500, messages: toMessages(input), stream: true};
  if (opts.system) body.system = opts.system;
  let res; const ctl = new AbortController(); let timedOut = false;
  if (opts.signal) { if (opts.signal.aborted) ctl.abort(); else opts.signal.addEventListener('abort', () => ctl.abort()); }
  const to = setTimeout(() => { timedOut = true; ctl.abort(); }, 30000);
  try {
    res = await fetch(API_URL, {method: 'POST', signal: ctl.signal, headers: {'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true'}, body: JSON.stringify(body)});
  } catch (e) { clearTimeout(to); if (timedOut) throw {code: 'timeout'}; if (e && e.name === 'AbortError') throw {code: 'cancelled'}; throw {code: 'network'}; }
  clearTimeout(to);
  if (!res.ok) {
    let msg = ''; try { const j = await res.json(); msg = (j.error && j.error.message) || ''; } catch (e) {}
    throw {code: res.status === 401 ? 'bad_key' : res.status === 429 ? 'rate_limited' : (res.status === 529 || res.status === 503) ? 'overloaded' : /credit|balance|billing/i.test(msg) ? 'no_credit' : 'http', message: msg};
  }
  const reader = res.body.getReader(), dec = new TextDecoder(); let buf = '', text = '';
  try {
    for (;;) {
      const {value, done} = await reader.read(); if (done) break;
      buf += dec.decode(value, {stream: true}); let k;
      while ((k = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, k).trim(); buf = buf.slice(k + 1);
        if (!line.startsWith('data:')) continue;
        let ev; try { ev = JSON.parse(line.slice(5)); } catch (e) { continue; }
        if (ev.type === 'content_block_delta' && ev.delta && ev.delta.type === 'text_delta') { text += ev.delta.text; if (opts.onText) opts.onText(text); }
        else if (ev.type === 'error') throw {code: ev.error && ev.error.type === 'overloaded_error' ? 'overloaded' : 'http', message: ev.error && ev.error.message};
      }
    }
  } catch (e) { if (e && e.name === 'AbortError') throw {code: 'cancelled', text}; throw e.code ? e : {code: 'network', text}; }
  return text;
}
async function aiJson(input, opts = {}) {
  const text = await ai(input, opts), clean = text.replace(/```json|```/g, '').trim();
  try { return JSON.parse(clean.slice(clean.indexOf('{'), clean.lastIndexOf('}') + 1)); } catch (e) { throw {code: 'invalid_json'}; }
}
function aiErr(e) {
  switch (e && e.code) {
    case 'no_key': return 'Für Gespräche braucht die Crew deinen Anthropic-Schlüssel. Trag ihn im Logbuch unter Einstellungen ein. Lernen und Prüfung gehen auch ohne.';
    case 'bad_key': return 'Der Anthropic-Schlüssel wird nicht akzeptiert. Prüf ihn in den Einstellungen.';
    case 'no_credit': return 'Auf deinem Anthropic-Konto ist kein Guthaben mehr. Lade es in der Anthropic-Konsole auf.';
    case 'network': return 'Keine Verbindung. Bist du online?';
    case 'timeout': return 'Die Antwort hat zu lange gedauert. Prüf deine Verbindung und versuch es nochmal.';
    case 'overloaded': return 'Der Dienst ist gerade überlastet. Versuch es gleich noch einmal.';
    case 'rate_limited': return 'Gerade zu viele Anfragen. Versuch es in ein paar Minuten noch einmal.';
    case 'invalid_json': return 'Die Antwort kam unvollständig an. Versuch es noch einmal.';
    case 'cancelled': return '';
    default: return 'Die Antwort kam nicht durch' + (e && e.message ? ': ' + e.message : '. Versuch es noch einmal.');
  }
}
const catLine = q => `Frage ${q.n}: ${q.q}${q.sig ? ' [' + q.sig + ']' : ''} → Richtig: ${q.a[0]}`;
function relevant(text) {
  const words = text.toLowerCase().match(/[a-zäöüß]{4,}/g) || []; if (!words.length) return [];
  return Q.map(q => { const h = (q.q + ' ' + q.a[0]).toLowerCase(); return {q, s: words.reduce((a, w) => a + (h.includes(w) ? 1 : 0), 0)}; })
    .filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 10).map(x => x.q);
}
function learner() {
  const p = S.profile || {};
  return `Über ${p.name || 'den Lernenden'}: ${EXP[p.exp] || ''}. ${p.about ? 'Selbst erzählt: ' + p.about + '.' : ''} Prüfung in ${S.profile ? daysLeft() : '?'} Tagen. Schwächen bisher: ${weakTopics().join(', ') || 'noch keine erkennbar'}.`;
}
const RULES = `- Alles Prüfungsrelevante muss exakt mit dem amtlichen Fragenkatalog SBF See übereinstimmen. Die genannten Katalogantworten sind verbindlich. Erfinde keine Regeln. Wenn ihr etwas nicht sicher wisst, sagt es offen.
- Seemannsgarn nur als erkennbarer Spaß der Figuren. Fachwissen immer korrekt.`;
function leadPersona(extra = '') {
  const L = CREW[S.crew.K];
  return `Du bist ${L.persona}\nDu bist Ausbilder für den deutschen Sportbootführerschein See und duzt ${(S.profile && S.profile.name) || 'den Lernenden'}.\n${learner()}\nRegeln:\n${RULES}\n- Erkläre kurz, klar, praxisnah, in deiner Art. Fließtext ohne Überschriften und Tabellen, der Text wird eventuell vorgelesen.\n${extra}`;
}
function crewSystem(extra = '') {
  const K = CREW[S.crew.K], M = CREW[S.crew.M], T = CREW[S.crew.T], name = (S.profile && S.profile.name) || 'den Lernenden';
  return `Ihr seid die Crew einer gemütlichen Segelyacht und bereitet ${name} auf die Theorieprüfung zum Sportbootführerschein See vor. Ihr duzt ${name}.
Figuren:
K = ${K.persona} K führt das Gespräch und spricht am meisten.
M = ${M.persona} M wirft ab und zu etwas Kurzes ein, höchstens einmal pro Antwort und nicht in jeder Antwort.
T = ${T.persona} T kommt nur selten vor, etwa in jeder dritten Antwort, und dann nur mit einem ganz kurzen Einwurf.
${learner()}
Regeln:
${RULES}
- Gesprochene Sprache: kurze, lebendige Sätze, leicht norddeutsch, warm und humorvoll. Keine Aufzählungen, kein Markdown, keine Emojis, keine Abkürzungen (schreibe "zum Beispiel" statt "z. B.").
- Insgesamt höchstens 4 Zeilen und etwa 70 Wörter pro Antwort. Meist endet K mit einer kurzen Rückfrage oder einer kleinen Prüfungsfrage, damit das Gespräch weitergeht.
Format: Jede Zeile beginnt mit dem Buchstaben der Figur und einem Doppelpunkt, zum Beispiel
K: Moin! Na, wo drückt der Schuh?
M: Ich wette, es sind die Lichter.
Gib nichts anderes aus.
${extra}`;
}

/* ---------- Hilfen ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
function md(t) {
  return esc(String(t).trim()).split(/\n{2,}/).map(b => {
    b = b.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    if (/^Übrigens/i.test(b)) return `<div class="fact">${b.replace(/\n/g, '<br>')}</div>`;
    const lines = b.split('\n');
    if (lines.every(l => /^\s*[-•]\s+/.test(l))) return '<ul>' + lines.map(l => '<li>' + l.replace(/^\s*[-•]\s+/, '') + '</li>').join('') + '</ul>';
    return '<p>' + b.replace(/\n/g, '<br>') + '</p>';
  }).join('');
}
const app = $('#app');
const cid = role => role === 'P' ? 'kroeger' : S.crew[role];
const nameOf = role => CREW[cid(role)].short;
let toastT = null;
function toast(msg, ms = 4200) {
  let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.remove('hidden'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.add('hidden'), ms);
}
const shown = new Set();
VOX.hooks.notice = (kind, e) => {
  if (shown.has(kind)) return; shown.add(kind);
  if (kind === 'perm') return toast(`Dein ElevenLabs-Schlüssel darf „${(e && e.what) || 'diese Funktion'}“ nicht nutzen. Erstelle einen Schlüssel mit diesem Recht.`, 8000);
  if (kind === 'elnet') return toast('ElevenLabs ist gerade nicht erreichbar. Ich nehme die Ersatzstimme.');
  if (kind === 'sttswitch') return toast('Die Spracherkennung des Handys geht hier nicht. Ich nutze die von ElevenLabs (kostet Credits).', 6000);
  toast({quota: 'Das ElevenLabs-Guthaben ist aufgebraucht. Die Crew spricht jetzt mit der Ersatzstimme.', budget: 'Das Tageslimit für die Live-Stimme ist erreicht. Ändern kannst du es unter Einstellungen → Stimmen.', badkey: 'Der ElevenLabs-Schlüssel wird nicht akzeptiert. Prüf ihn in den Einstellungen.', elerr: 'Eine Stimme kam nicht durch. Ich nehme die Ersatzstimme.'}[kind] || '');
};

/* ---------- Figuren sprechen lassen: Mund, Wippen, Sprechblase ---------- */
let bubbleT = null;
VOX.hooks.start = (who, text) => {
  document.querySelectorAll('.ch.talking').forEach(e => e.classList.remove('talking'));
  document.querySelectorAll(`.ch[data-ch="${who}"]`).forEach(e => e.classList.add('talking'));
  document.querySelectorAll('[data-say]').forEach(e => e.classList.add('hidden'));
  document.querySelectorAll(`[data-say="${who}"]`).forEach(e => { e.innerHTML = `<b style="color:${CREW[who].color}">${esc(CREW[who].short)}:</b> ${esc(text)}`; e.classList.remove('hidden'); });
  const b = $('#bubble'); if (!b) return;
  clearTimeout(bubbleT);
  const c = CREW[who]; b.querySelector('b').textContent = c.short; b.style.setProperty('--who', c.color);
  b.querySelector('span').textContent = text; b.classList.remove('hidden');
  const sp = document.querySelector(`#bubble ~ svg .ch[data-ch="${who}"], .scene svg .ch[data-ch="${who}"], .stage svg .ch[data-ch="${who}"]`);
  const host = b.parentElement.getBoundingClientRect();
  if (sp) {
    const r = sp.getBoundingClientRect(), mid = r.left + r.width / 2;
    b.classList.toggle('right', mid > host.left + host.width * .55);
    requestAnimationFrame(() => { const bb = b.getBoundingClientRect(); b.style.setProperty('--tail', Math.max(14, Math.min(bb.width - 30, mid - bb.left - 9)) + 'px'); });
  }
};
VOX.hooks.end = who => {
  document.querySelectorAll(who ? `.ch[data-ch="${who}"]` : '.ch.talking').forEach(e => e.classList.remove('talking'));
  clearTimeout(bubbleT); bubbleT = setTimeout(() => { const b = $('#bubble'); if (b && !document.querySelector('.ch.talking')) b.classList.add('hidden'); }, 1400);
};

/* ---------- Tageszeit, Look, Klang ---------- */
let place = 'deck';
function applyTheme() {
  const h = document.documentElement; h.dataset.day = dayPart();
  if (S.cfg.theme === 'hell' || S.cfg.theme === 'dunkel') h.dataset.theme = S.cfg.theme; else delete h.dataset.theme;
}
setInterval(applyTheme, 5 * 60 * 1000);
function soundFor(p) {
  place = p; if (!AUD.ready) return;
  const day = dayPart(), wx = weatherToday();
  const mus = {deck: 'musik-deck', kajuete: (day === 'abend' || day === 'nacht') ? 'musik-abend' : 'musik-deck', quiz: 'musik-lernen', exam: null, intro: 'musik-intro'};
  if (p in mus) AUD.playMusic(mus[p]);
  AUD.weather(wx, day, p === 'log' ? 'deck' : p);
}

/* ---------- Navigation ---------- */
let tab = 'deck', examTimer = null;
function stopAll() { VOX.stop(); stopTalk(); clearInterval(examTimer); examTimer = null; AUD.clock(0); }
function setTab(t) {
  stopAll(); tab = t;
  document.querySelectorAll('nav.tabs button').forEach(b => b.setAttribute('aria-current', b.dataset.tab === t ? 'page' : 'false'));
  $('#composer').classList.toggle('hidden', t !== 'cabin');
  ({deck: renderDeck, cabin: renderCabin, log: renderLog})[t]();
  window.scrollTo(0, 0);
}
document.querySelectorAll('nav.tabs button').forEach(b => b.onclick = () => { AUD.click(); setTab(b.dataset.tab); });
function subScreen() { stopAll(); $('#composer').classList.add('hidden'); window.scrollTo(0, 0); }

/* ==========================================================================
   Start
   ========================================================================== */
function boot() {
  applyTheme();
  if (!S.introDone) return splash();
  if (!S.profile) return onboardingForm();
  $('#tabs').classList.remove('hidden'); setTab('deck'); tapToBoard();
}
/* Beim Öffnen: einmal tippen (Browser erlauben Ton erst nach einer Berührung), dann Moin. */
function tapToBoard() {
  const z = document.createElement('button'); z.className = 'tapzone'; z.innerHTML = '<span>Antippen zum Anlegen</span>';
  z.setAttribute('aria-label', 'Antippen zum Anlegen. Startet Ton und Begrüßung.');
  document.body.appendChild(z);
  z.onclick = async () => {
    z.remove(); AUD.unlock(); soundFor(place);
    const last = S.lastDay == null ? today() - 1 : S.lastDay, gap = today() - last;
    S.lastDay = today(); save();
    const idx = gap <= 0 ? 0 : gap === 1 ? 1 : gap <= 3 ? 2 : gap <= 7 ? 3 : gap <= 14 ? 4 : 5;
    if (tab === 'deck') await VOX.say(S.crew.K, lineOf(S.crew.K, 'moin', idx), 'fixed');
    raceTicks();
  };
}
/* Die Prüfung ist fast am Ziel, du noch nicht: Die Uhr tickt, umso öfter, je schlechter die Chancen. */
function raceTicks() {
  if (!S.profile) return; const r = racePos();
  if (r.exam >= .8 && r.you < .9) AUD.ticks(Math.max(1, Math.min(8, 1 + Math.round((.9 - r.you) * 10))), .7);
}

function splash() {
  document.documentElement.dataset.day = dayPart();
  $('#tabs').classList.add('hidden'); $('#composer').classList.add('hidden'); app.innerHTML = '';
  mountStage();
  const ov = document.createElement('div'); ov.className = 'overlay splash'; ov.id = 'splashOv';
  ov.innerHTML = `<div style="max-width:520px;margin:0 auto;width:100%">
     <h1 class="title">Skipper</h1>
     <p class="lead">Mit Käpt'n, Matrosin und Papagei durch den Sportbootführerschein See.</p>
     <div class="panel">
       <button class="btn wide lamp" id="board" style="font-size:1.1rem">An Bord gehen</button>
       <details style="margin-top:12px"><summary>Schlüssel für Gespräche und echte Stimmen</summary>
         <p class="small muted" style="margin:8px 0 0">Beide werden nur auf diesem Handy gespeichert. Ohne Schlüssel brabbelt die Crew nur und du liest mit.</p>
         <label for="k1">Anthropic-Schlüssel (für Gespräche)</label><input type="password" id="k1" autocomplete="off" placeholder="sk-ant-…" value="${apiKey() ? '••••••••' : ''}">
         <label for="k2">ElevenLabs-Schlüssel (für die Stimmen)</label><input type="password" id="k2" autocomplete="off" placeholder="sk_…" value="${elKey() ? '••••••••' : ''}">
       </details>
       <p class="status" id="sst"></p>
     </div></div>`;
  document.body.appendChild(ov);
  $('#board').onclick = async () => {
    AUD.unlock();
    const a = $('#k1').value.trim(), b = $('#k2').value.trim();
    if (a && !a.startsWith('••')) setApiKey(a);
    if (b && !b.startsWith('••')) { setElKey(b); VOX.resetFlags(); }
    if (elKey()) {
      $('#board').disabled = true; $('#sst').textContent = 'Die Crew stimmt sich ein…';
      try { const list = await Promise.race([VOX.listVoices(true), new Promise((_, r) => setTimeout(() => r({code: 'timeout'}), 6000))]); VOX.autoAssign(list); }
      catch (e) { $('#sst').textContent = e.code === 'el_bad_key' ? 'Der ElevenLabs-Schlüssel wird nicht akzeptiert. Die Crew brabbelt erst einmal.' : 'Die Stimmen sind gerade nicht erreichbar. Die Crew brabbelt erst einmal.'; await new Promise(r => setTimeout(r, 1800)); }
    }
    ov.remove(); runIntro();
  };
}
/* Die Hafen-Bühne: beim Startbild aus der Ferne, im Intro fährt die Kamera heran. */
function mountStage() {
  let h = $('#introHolder'); if (h) h.remove();
  h = document.createElement('div'); h.id = 'introHolder'; h.innerHTML = introScene(S.crew); document.body.appendChild(h);
  return h;
}
/* ---------- Intro: Streit am Steg, die Crew dreht sich um ---------- */
function runIntro() {
  $('#tabs').classList.add('hidden'); app.innerHTML = '';
  const holder = $('#introHolder') || mountStage();
  const stage = holder.querySelector('.stage');
  stage.insertAdjacentHTML('beforeend', '<button class="btn small ghost skip" id="skip" style="background:rgba(255,250,240,.9);color:#2a2019">Überspringen</button>');
  VOX.forceFallback = (elKey() && !VOX.keyBad) ? null : 'babble';
  soundFor('intro');
  setTimeout(() => $('#cam') && $('#cam').classList.add('near'), 250);
  const K = $('#actK'), M = $('#actM'), T = $('#actT');
  const names = s => s.replace('{K}', nameOf('K')).replace('{M}', nameOf('M')).replace('{T}', nameOf('T'));
  const list = INTRO.map(l => ({cid: cid(l.s), t: names(l.t), before: async () => {
    if (l.look) { K.classList.add('look-r'); M.classList.add('look-l'); }
    if (l.horn) await AUD.sfx('nebelhorn', {vol: .35, dur: 1.6});
    if (l.turn) { K.classList.remove('tilt-r', 'look-r'); M.classList.remove('tilt-l', 'look-l'); [K, M, T].forEach(a => { const h = a.querySelector('.hopper'); h.classList.remove('hop'); h.getBoundingClientRect(); h.classList.add('hop'); }); await new Promise(r => setTimeout(r, 600)); }
  }}));
  let skipped = false;
  $('#skip').onclick = () => { skipped = true; VOX.stop(); K.classList.remove('tilt-r', 'look-r'); M.classList.remove('tilt-l', 'look-l'); $('#cam').classList.add('near'); micQuestion(); };
  (async () => { await new Promise(r => setTimeout(r, 2200)); if (skipped) return; await VOX.lines(list, 'fixed'); if (!skipped) micQuestion(); })();
}
function stagePanel(html) {
  let p = $('#stagePanel');
  if (!p) { p = document.createElement('div'); p.id = 'stagePanel'; p.className = 'overlay'; p.style.background = 'none'; p.style.zIndex = '46'; document.body.appendChild(p); }
  p.innerHTML = `<div class="panel">${html}</div>`; return p;
}
function micQuestion() {
  const sk = $('#skip'); if (sk) sk.remove();
  const canMic = VOX.canListen && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  stagePanel(`<h2 style="margin:0 0 4px">Mikrofon einschalten?</h2>
    <p class="muted" style="margin:0 0 12px">Dann redet ihr ganz normal miteinander. Gehört wird nur, solange das Mikrofon rot leuchtet.</p>
    <div class="row">${canMic ? '<button class="btn" id="micYes">Ja, einschalten</button>' : ''}<button class="btn ghost" id="micNo">Lieber tippen</button></div>
    ${canMic ? '' : '<p class="small muted" style="margin:10px 0 0">Dieser Browser kann keine Sprache erkennen. Am besten klappt es mit Chrome auf dem Handy.</p>'}
    <p class="status" id="mst"></p>`);
  const no = () => { $('#stagePanel').remove(); endIntro(true); };
  $('#micNo').onclick = no;
  const y = $('#micYes'); if (y) y.onclick = async () => {
    y.disabled = true; $('#mst').textContent = 'Dein Browser fragt gleich nach dem Mikrofon. Tippe auf „Zulassen“.';
    const ok = await VOX.askMic();
    if (!ok) { $('#mst').className = 'status err'; $('#mst').textContent = 'Das Mikrofon ist gesperrt. Du kannst es später über das Schloss-Symbol in der Adresszeile erlauben. Wir machen erst einmal mit Tippen weiter.'; setTimeout(no, 3500); return; }
    S.micOk = true; save(); convoOnboarding();
  };
}

/* ---------- Kennenlernen im Gespräch ---------- */
const NUMW = {einunddreißig: 31, dreißig: 30, neunundzwanzig: 29, achtundzwanzig: 28, siebenundzwanzig: 27, sechsundzwanzig: 26, fünfundzwanzig: 25, vierundzwanzig: 24, dreiundzwanzig: 23, zweiundzwanzig: 22, einundzwanzig: 21, zwanzig: 20, neunzehn: 19, achtzehn: 18, siebzehn: 17, sechzehn: 16, fünfzehn: 15, vierzehn: 14, dreizehn: 13, zwölft: 12, zwölf: 12, elft: 11, elf: 11, zehnt: 10, zehn: 10, neunt: 9, neun: 9, acht: 8, siebt: 7, sieben: 7, sechst: 6, sechs: 6, fünft: 5, fünf: 5, viert: 4, vier: 4, dritt: 3, drei: 3, zweit: 2, zwei: 2, erst: 1, eins: 1, ein: 1};
const NUMKEYS = Object.keys(NUMW).sort((a, b) => b.length - a.length);
function wordNum(w) {
  w = w.toLowerCase().replace(/[.,!?]/g, ''); if (/^\d+$/.test(w)) return +w;
  const m = w.match(/^(\d+)\./); if (m) return +m[1];
  for (const k of NUMKEYS) if (w.startsWith(k) && ['', 'e', 'en', 'er', 'es', 'te', 'ten', 'ter', 'tes', 'ste', 'sten', 'ster', 's'].includes(w.slice(k.length))) return NUMW[k];
  return null;
}
const MONTHS = ['januar', 'februar', 'märz', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'dezember'];
function parseDate(t) {
  t = t.toLowerCase().replace(/jänner/g, 'januar').replace(/maerz/g, 'märz');
  let d = null, m = null, y = null;
  const num = t.match(/(\d{1,2})\s*\.\s*(\d{1,2})\s*\.?\s*(\d{2,4})?/);
  if (num) { d = +num[1]; m = +num[2]; y = num[3] ? +num[3] : null; }
  else {
    const words = t.split(/\s+/); const mi = words.findIndex(w => MONTHS.some(x => w.startsWith(x)));
    if (mi >= 0) { m = MONTHS.findIndex(x => words[mi].startsWith(x)) + 1; for (let i = mi - 1; i >= 0; i--) { const n = wordNum(words[i]); if (n) { d = n; break; } } const yy = words.slice(mi + 1).join(' ').match(/\d{4}/); if (yy) y = +yy[0]; }
    else { const ns = words.map(wordNum).filter(n => n); if (ns.length >= 2) { d = ns[0]; m = ns[1]; } }
  }
  if (!d || !m || d > 31 || m > 12) return null;
  const now = new Date(); if (y && y < 100) y += 2000;
  if (!y) { y = now.getFullYear(); if (new Date(y, m - 1, d) < new Date(now.getFullYear(), now.getMonth(), now.getDate())) y++; }
  const dt = new Date(y, m - 1, d); if (dt.getMonth() !== m - 1) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function parseMinutes(t) {
  t = t.toLowerCase(); let n = null;
  if (/anderthalb|eineinhalb|ein ?einhalb/.test(t)) n = 90;
  else if (/dreiviertel/.test(t)) n = 45;
  else if (/halbe stunde|halbes stündchen/.test(t)) n = 30;
  else if (/zwei stunden|2 stunden/.test(t)) n = 120;
  else if (/stunde/.test(t) && !/\d/.test(t)) n = 60;
  else { const d = t.match(/\d+/); if (d) n = +d[0]; else { const w = t.split(/\s+/).map(wordNum).filter(x => x); if (w.length) n = w[0]; } if (n && /stunde/.test(t) && n < 5) n *= 60; }
  if (!n) return null;
  return [15, 30, 45, 60, 90].reduce((a, b) => Math.abs(b - n) < Math.abs(a - n) ? b : a);
}
function parseExp(t) {
  t = t.toLowerCase();
  if (/mitgefahren|mit gefahren|als gast|beifahrer|nur dabei|nur mit/.test(t)) return 'guest';
  if (/nein|nie|noch nicht|nö|leider nicht|keine ahnung/.test(t)) return 'none';
  if (/viel|oft|jahre|regelmäßig|ständig|eigenes boot/.test(t)) return 'lots';
  if (/ja|schon|einmal|ein paar mal|gesteuert|gefahren|bisschen/.test(t)) return 'some';
  return null;
}
function parseName(t) {
  t = t.replace(/[.,!?]/g, ' ').trim()
    .replace(/^(also|ähm|äh|ja|okay|ok)\s+/i, '').replace(/^(hallo|moin|hi|hey|servus)\s+/i, '')
    .replace(/^(ich heiße|ich heisse|ich bin der|ich bin die|ich bin|mein name ist|man nennt mich|nenn mich|das ist)\s+/i, '');
  const w = t.split(/\s+/).filter(x => /^[A-Za-zÄÖÜäöüß-]{2,}$/.test(x)).slice(0, 2);
  if (!w.length) return null;
  const n = w.map(x => x[0].toUpperCase() + x.slice(1).toLowerCase()).join(' ');
  return n.length > 24 ? null : n;
}
const MIC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';

async function convoOnboarding() {
  const isNew = !S.profile;
  const prof = S.profile ? {...S.profile} : {name: '', exam: null, minutes: 30, exp: null, about: '', pass: 24};
  const sayRole = (role, t, kind = 'fixed') => VOX.say(cid(role), t, kind);
  let current = null;
  const panel = (inner) => stagePanel(`<div class="talkbar"><div class="micbig on" aria-hidden="true">${MIC_SVG}</div><div class="talkstate" id="ost">Ich höre zu…<small>Sprich ganz in Ruhe.</small></div></div>
    <div class="interim" id="oin"></div>${inner || ''}<div class="row"><button class="btn" id="ofin">Fertig gesprochen</button><button class="btn ghost" id="otype">Lieber tippen</button></div>`);
  let typed = false;
  const hear = async (o = {}) => {
    panel(o.inner);
    $('#otype').onclick = () => { typed = true; if (current) current.cancel(); };
    current = VOX.listen({onInterim: t => { const e = $('#oin'); if (e) e.textContent = t; }, noSpeech: o.noSpeech || 9000, pause: o.pause});
    $('#ofin').onclick = () => current && current.finish();
    const r = await current.done; current = null;
    if (r.err && r.err !== 'aborted') { typed = true; toast(r.err === 'network' ? 'Die Spracherkennung braucht Internet und Chrome. Wir machen mit Tippen weiter.' : 'Das Mikrofon hat nicht geklappt. Wir machen mit Tippen weiter.'); }
    return typed ? null : r.text;
  };
  const choose = (title, html, bind) => new Promise(res => { stagePanel(`<h3 style="margin:0 0 10px">${title}</h3>${html}`); bind(res); });
  const ask = async (line, parse, fallback, o = {}) => {
    for (let i = 0; i < 2 && !typed; i++) {
      await sayRole(i ? (line.againRole || line.s) : line.s, i ? line.again : line.t);
      const t = await hear(o); if (t == null) break;
      const v = parse(t); if (v) return v;
    }
    return fallback();
  };
  if (isNew || !prof.name) {
    prof.name = await ask({s: 'M', t: S.micOk ? ONB.micOk.t : ONB.name.t, again: ONB.nameAgain.t}, parseName, () => choose('Wie heißt du?', '<input type="text" id="fn" placeholder="Vorname" autocomplete="given-name"><button class="btn wide" id="fok" style="margin-top:10px">Weiter</button>', res => { $('#fok').onclick = () => res($('#fn').value.trim() || ''); }));
    if (prof.name) await sayRole('M', `Moin, ${prof.name}! Schön, dass du da bist.`, 'live');
  } else await sayRole('K', `Moin, ${prof.name}! Schön, dass du wieder an Bord bist.`, 'live');
  if (!prof.exam) {
    prof.exam = await ask({s: 'K', t: ONB.exam.t, again: ONB.examAgain.t}, parseDate, () => choose('Wann ist deine Prüfung?', `<input type="date" id="fd" value="${new Date(Date.now() + 28 * 864e5).toISOString().slice(0, 10)}"><button class="btn wide" id="fok" style="margin-top:10px">Weiter</button>`, res => { $('#fok').onclick = () => res($('#fd').value || null); }));
    if (prof.exam) await sayRole('K', `Am ${fmtDate(prof.exam)} also. Das kriegen wir hin.`, 'live');
  }
  if (isNew) {
    prof.minutes = await ask({s: 'M', t: ONB.minutes.t, again: ONB.minutes.t}, parseMinutes, () => choose('Wie viel Zeit hast du am Tag?', '<div class="chips">' + [15, 30, 45, 60, 90].map(m => `<button class="chip" data-m="${m}">${m} Minuten</button>`).join('') + '</div>', res => document.querySelectorAll('[data-m]').forEach(b => b.onclick = () => res(+b.dataset.m))));
    prof.exp = await ask({s: 'K', t: ONB.boat.t, again: ONB.boat.t}, parseExp, () => choose('Wie gut kennst du dich mit Booten aus?', '<div class="chips">' + Object.entries(EXP).map(([k, v]) => `<button class="chip" data-e="${k}">${v[0].toUpperCase() + v.slice(1)}</button>`).join('') + '</div>', res => document.querySelectorAll('[data-e]').forEach(b => b.onclick = () => res(b.dataset.e))));
  }
  if (!typed) {
    await sayRole('M', ONB.room.t);
    const t = await hear({noSpeech: 6500, pause: 1.4});
    S.others = !!(t && t.trim().length > 1);
    if (t != null) await sayRole(S.others ? 'T' : 'K', S.others ? ONB.roomYes.t : ONB.roomFish.t);
  }
  if (!prof.exam) prof.exam = new Date(Date.now() + 28 * 864e5).toISOString().slice(0, 10);
  S.profile = prof; S.plan = null; save();
  await sayRole('K', ONB.done.t);
  endIntro(false);
}
function endIntro(toForm) {
  VOX.stop(); VOX.forceFallback = null;
  const h = $('#introHolder'); if (h) h.remove(); const p = $('#stagePanel'); if (p) p.remove();
  S.introDone = true; S.lastDay = today(); save();
  if (toForm && !S.profile) return onboardingForm();
  $('#tabs').classList.remove('hidden'); setTab('deck'); soundFor('deck');
}
function onboardingForm() {
  $('#tabs').classList.add('hidden');
  const def = new Date(Date.now() + 28 * 864e5).toISOString().slice(0, 10); let exp = 'none';
  app.innerHTML = `<div style="display:flex;gap:12px;align-items:flex-end;margin:22px 0 10px">${charSVG(S.crew.K)}<div><h1 style="margin:0">Moin!</h1><p class="muted" style="margin:0">Erzähl uns kurz von dir, dann stecken wir den Kurs ab.</p></div></div>
  <div class="card">
    <label for="nm">Wie heißt du?</label><input type="text" id="nm" autocomplete="given-name" placeholder="Vorname">
    <label for="ex">Wann ist deine Prüfung?</label><input type="date" id="ex" value="${def}">
    <label for="mi">Wie lange willst du am Tag lernen?</label>
    <select id="mi">${[15, 30, 45, 60, 90].map(m => `<option value="${m}" ${m === 30 ? 'selected' : ''}>${m} Minuten</option>`).join('')}</select>
    <label id="expl">Wie gut kennst du dich mit Booten aus?</label>
    <div class="chips" role="group" aria-labelledby="expl">${Object.entries(EXP).map(([k, v]) => `<button class="chip" data-exp="${k}" aria-pressed="${k === exp}">${v[0].toUpperCase() + v.slice(1)}</button>`).join('')}</div>
    <label for="ab">Magst du noch etwas über dich erzählen? <span class="muted small">(optional)</span></label>
    <textarea id="ab" placeholder="Zum Beispiel: Ich will an der Ostsee chartern. Geschichten helfen mir beim Merken."></textarea>
  </div>
  <button class="btn wide" id="go">Kurs abstecken</button>`;
  app.querySelector('svg.ch').style.width = '84px';
  app.querySelectorAll('[data-exp]').forEach(b => b.onclick = () => { exp = b.dataset.exp; app.querySelectorAll('[data-exp]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $('#go').onclick = () => {
    const ex = $('#ex').value; if (!ex) { $('#ex').focus(); return; }
    S.profile = {name: $('#nm').value.trim(), exam: ex, minutes: +$('#mi').value, exp, about: $('#ab').value.trim(), pass: 24};
    S.plan = null; S.introDone = true; S.lastDay = today(); save();
    $('#tabs').classList.remove('hidden'); setTab('deck'); AUD.unlock(); soundFor('deck');
  };
}

/* ==========================================================================
   Skipper – Werft (v5.72, docs/baukasten.md): Boot und Crew nach Wunsch. Nutzer 20.11.2026: „Figuren/Boot austauschbar … gib mir Auswahlmöglichkeiten“.
   Speichert in S.cfg.look {stil, farben {--var: #farbe}, up [Ausbau], kleid {figur: {teil: wahl}}} und den Namen in S.boat.name (R7: alles optional).
   lookAnwenden() (index.html) setzt Farben, Stil und Ausbau auf <html>; boot.js und figuren.js zeichnen damit überall.
   Ausbau (SK12) ist zum Ausprobieren frei; ob er später als Belohnung erst nach bestimmten Tagen kommt, entscheidet der Nutzer.
   ========================================================================== */
(() => {
'use strict';
const FT = {hinnerk: ['jacke', 'hut', 'hose'], smilla: ['jacke', 'haar', 'hut'], hilke: ['jacke', 'haar'], harms: ['jacke'], backbord: ['fell', 'streifen'], klabauter: ['kopf', 'koerper']};
const FT_NAME = {jacke: 'Jacke', hut: 'Mütze', hose: 'Hose', haar: 'Haare', fell: 'Fell', streifen: 'Streifen', kopf: 'Kopf', koerper: 'Körper'};
const BT = [['rumpf', 'Rumpf'], ['streifen', 'Streifen'], ['unterwasser', 'Unterwasser'], ['dach', 'Kajütdach'], ['schrift', 'Schrift']];
let tab = 'boot', l = {};
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const kopie = () => { const a = (S.cfg && S.cfg.look) || {}; return {stil: a.stil || 'feder', farben: {...(a.farben || {})}, up: Array.isArray(a.up) ? [...a.up] : [], kleid: JSON.parse(JSON.stringify(a.kleid || {}))}; };
function speichern() { S.cfg = S.cfg || {}; S.cfg.look = l; try { save(); } catch (e) {} try { lookAnwenden(); } catch (e) {} vorschau(); }
const farbeVon = (v, std) => l.farben[v] || getComputedStyle(document.documentElement).getPropertyValue(v).trim() || std;

function css() {
  if (document.getElementById('werftcss')) return;
  const s = document.createElement('style'); s.id = 'werftcss';
  s.textContent = `.wf{max-width:520px;margin:0 auto}.wf-vor{border-radius:14px;overflow:hidden;background:linear-gradient(#cfe1e8,#e9f0ee 58%,#7fa6ab 58%,#5e8790);margin:4px 0 8px}
  .wf-vor svg{display:block;width:100%;height:auto}.wf-mini{display:flex;gap:6px;margin-bottom:8px}.wf-mini>div{flex:1;border-radius:12px;background:linear-gradient(#d9e6ea,#eef3f1 62%,#8fb0b4 62%);overflow:hidden}
  .wf-mini svg{display:block;width:100%;height:96px}.wf-crew{display:flex;gap:2px;justify-content:space-between;background:#f6efe0;border-radius:12px;padding:4px 6px;margin-bottom:10px}.wf-crew svg{width:16%;height:96px}
  .wf-tabs{display:flex;gap:6px;margin:0 0 10px}.wf-tabs button{flex:1;padding:8px 4px;border-radius:10px;border:1px solid var(--line,#ccc);background:transparent;color:inherit;font-weight:700}
  .wf-tabs button[aria-pressed="true"]{background:var(--accent,#e8a33a);color:#222;border-color:transparent}
  .wf h4{margin:12px 0 6px}.wf .chips{display:flex;flex-wrap:wrap;gap:6px}.wf .chip[aria-pressed="true"]{outline:3px solid var(--accent,#e8a33a)}
  .wf-farbe{display:inline-flex;align-items:center;gap:6px;margin:0 10px 8px 0;font-size:14px}.wf-farbe input{width:38px;height:30px;border:0;padding:0;background:none}
  .wf-up{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--line,#ddd)}.wf-up input{width:22px;height:22px}.wf-up small{display:block;opacity:.7}
  .wf-stil{display:flex;gap:6px}.wf-stil button{flex:1;border-radius:12px;border:1px solid var(--line,#ccc);background:#fbf6ea;padding:4px;color:#333}.wf-stil button[aria-pressed="true"]{outline:3px solid var(--accent,#e8a33a)}
  .wf-stil svg{width:100%;height:110px}.wf-fig{border-top:1px solid var(--line,#ddd);padding:8px 0}.wf-fig b{display:block;margin-bottom:4px}
  .wf-sw{width:26px;height:26px;border-radius:50%;display:inline-block;border:2px solid #fff;box-shadow:0 0 0 1px #0003;vertical-align:middle}`;
  document.head.appendChild(s);
}
/* Vorschau: die Frieda von der Seite mit Crew, dazu Heck und Draufsicht, darunter alle Figuren */
function crewAnBord() {
  const F = window.FIGUREN; if (!F) return {};
  return {hinter: `<g class="nicht-steuerrad"><g transform="translate(-74 -14) scale(.4)">${F.figur('hinnerk', {blick: 'seite', pose: 'pinne', dreh: false})}</g></g><g class="nur-up nur-steuerrad"><g transform="translate(-50 -8) scale(.4)">${F.figur('hinnerk', {blick: 'seite', pose: 'steuern', pfeife: false, dreh: false})}</g></g>`,
    vor: `<g transform="translate(58 -26) scale(-.37 .37)">${F.figur('smilla', {blick: 'seite', dreh: false})}</g><g transform="translate(-6 -56) scale(-.46 .46)">${F.figur('backbord', {pose: 'sitzen', dreh: false})}</g>`};
}
function vorschau() {
  const v = document.getElementById('wfvor'); if (!v || !window.BOOT) return;
  const wl = y => `<path d="M-140 ${y} Q-125 ${y - 3} -110 ${y} T-80 ${y} T-50 ${y} T-20 ${y} T10 ${y} T40 ${y} T70 ${y} T100 ${y} T130 ${y} V40 H-140Z" fill="#6f9aa0" opacity=".55"/>`;
  v.innerHTML = `<svg viewBox="-120 -104 240 132">${BOOT.seite(crewAnBord())}${wl(4)}</svg>`;
  const m = document.getElementById('wfmini');
  if (m) m.innerHTML = `<div><svg viewBox="-78 -104 156 132">${BOOT.heck({})}</svg></div><div><svg viewBox="-34 -58 68 124">${BOOT.oben({})}</svg></div><div><svg viewBox="-96 -92 186 104">${BOOT.d34({})}</svg></div>`;
  const c = document.getElementById('wfcrew');
  if (c && window.FIGUREN) c.innerHTML = ['hinnerk', 'smilla', 'hilke', 'harms', 'backbord', 'klabauter'].map(id => FIGUREN.bild(id, {blick: 'vorn', dreh: false})).join('');
}
function inhalt() {
  const B = window.BOOT, F = window.FIGUREN;
  if (tab === 'boot') {
    const name = (S.boat && S.boat.name) || '';
    return `<h4>Farbe</h4><div class="chips">${Object.entries(B.FARBEN).map(([k, f]) => `<button class="chip" data-pre="${k}" aria-pressed="${l.farben['--frieda-rumpf'] === f.rumpf && l.farben['--frieda-streifen'] === f.streifen}"><span class="wf-sw" style="background:linear-gradient(${f.rumpf} 55%,${f.streifen} 55% 70%,${f.unterwasser} 70%)"></span> ${f.name}</button>`).join('')}</div>
      <h4>Eigene Farben</h4><div>${BT.map(([k, n]) => `<label class="wf-farbe"><input type="color" data-bf="${k}" value="${esc(farbeVon('--frieda-' + k, B.farben[k]))}">${n}</label>`).join('')}</div>
      <h4>Name am Heck</h4><input type="text" id="wfname" maxlength="12" placeholder="FRIEDA" value="${esc(name)}">
      <h4>Ausbau</h4><p class="small muted" style="margin:0 0 4px">Zum Ausprobieren ist alles frei. Was du einbaust, siehst du in jeder Szene, von der Seite, von achtern und von oben.</p>
      ${Object.entries(B.UPS).map(([k, u]) => `<label class="wf-up"><input type="checkbox" data-up="${k}"${l.up.includes(k) ? ' checked' : ''}><span><b>${u.name}</b><small>später: ${u.wann}</small></span></label>`).join('')}`;
  }
  if (tab === 'crew') return Object.entries(F.FIG).map(([id, f]) => `<div class="wf-fig"><b>${f.name}</b>
      ${Object.entries(f.kleid).map(([teil, opts]) => `<div class="chips" style="margin-bottom:6px">${Object.entries(opts).map(([w, n]) => `<button class="chip" data-kl="${id}|${teil}|${w}" aria-pressed="${F.kleidVon(id, {kleid: l.kleid[id] || {}})[teil] === w}">${n}</button>`).join('')}</div>`).join('')}
      <div>${(FT[id] || []).map(t => `<label class="wf-farbe"><input type="color" data-ff="${id}|${t}" value="${esc(farbeVon(`--${id}-${t}`, f.farben[t]))}">${FT_NAME[t] || t}</label>`).join('')}</div></div>`).join('');
  return `<p class="small muted" style="margin:0 0 8px">Wie die Figuren gezeichnet sind. Das gilt sofort für alle Szenen.</p><div class="wf-stil">${Object.entries(F.STILE).map(([k, n]) => `<button data-stil="${k}" aria-pressed="${l.stil === k}">
      <svg viewBox="-34 -112 86 118">${F.figur('hinnerk', {blick: 'seite', stil: k, dreh: false})}<g transform="translate(34 0)">${F.figur('backbord', {pose: 'sitzen', stil: k, dreh: false})}</g></svg><b>${n.split(':')[0]}</b><div class="small">${n.split(':')[1] || ''}</div></button>`).join('')}</div>`;
}
function zeichnen(w) {
  const b = w.querySelector('#wfinhalt'); b.innerHTML = inhalt();
  w.querySelectorAll('.wf-tabs button').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.tab === tab)));
  b.querySelectorAll('[data-pre]').forEach(x => x.onclick = () => { const f = BOOT.FARBEN[x.dataset.pre]; BT.forEach(([k]) => { if (f[k]) l.farben['--frieda-' + k] = f[k]; }); speichern(); zeichnen(w); });
  b.querySelectorAll('[data-bf]').forEach(x => x.oninput = () => { l.farben['--frieda-' + x.dataset.bf] = x.value; speichern(); });
  const n = b.querySelector('#wfname'); if (n) n.onchange = () => { S.boat = {...(S.boat || {}), name: n.value.trim().slice(0, 12)}; speichern(); };
  b.querySelectorAll('[data-up]').forEach(x => x.onchange = () => { l.up = l.up.filter(u => u !== x.dataset.up); if (x.checked) l.up.push(x.dataset.up); speichern(); });
  b.querySelectorAll('[data-kl]').forEach(x => x.onclick = () => { const [id, teil, wahl] = x.dataset.kl.split('|'); l.kleid[id] = {...(l.kleid[id] || {}), [teil]: wahl}; speichern(); zeichnen(w); });
  b.querySelectorAll('[data-ff]').forEach(x => x.oninput = () => { const [id, t] = x.dataset.ff.split('|'); l.farben[`--${id}-${t}`] = x.value; speichern(); });
  b.querySelectorAll('.wf-stil [data-stil]').forEach(x => x.onclick = () => { l.stil = x.dataset.stil; speichern(); zeichnen(w); });
}
async function oeffnen(start) {
  try { await nachladen('boot.js'); await nachladen('figuren.js'); } catch (e) { toast('Die Werft ließ sich nicht laden.'); return; }
  css(); FIGUREN.css(); BOOT.css(); l = kopie(); tab = start || 'boot';
  const w = sheet(`<div class="wf"><h3 style="margin:0 0 4px">⚓ Werft</h3><p class="small muted" style="margin:0 0 6px">Farbe, Name und Ausbau der Frieda, Kleidung und Farben der Crew, Zeichenstil. Alles gilt überall in der App.</p>
    <div class="wf-vor" id="wfvor"></div><div class="wf-mini" id="wfmini"></div><div class="wf-crew" id="wfcrew"></div>
    <div class="wf-tabs"><button data-tab="boot">⛵ Boot</button><button data-tab="crew">🧑‍✈️ Crew</button><button data-tab="stil">🖌️ Stil</button></div>
    <div id="wfinhalt"></div><button class="btn ghost wide" id="wfreset" style="margin-top:14px">Alles wie am Anfang</button></div>`);
  w.querySelectorAll('.wf-tabs button').forEach(x => x.onclick = () => { tab = x.dataset.tab; zeichnen(w); });
  w.querySelector('#wfreset').onclick = () => { l = {stil: 'feder', farben: {}, up: [], kleid: {}}; speichern(); zeichnen(w); toast('Alles wie am Anfang.'); };
  zeichnen(w); vorschau();
}
window.WERFT = {oeffnen};
})();

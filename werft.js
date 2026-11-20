/* ==========================================================================
   Skipper – Werft (v5.72; v5.73 mit Drehrad, docs/baukasten.md)
   Nutzer 20.11.2026: „das Bild im Auge behalten und ohne viel Scrollen die Einstellungen machen … mit einem Rad zum Drehen … mit Knopf zum Übernehmen“.
   Aufbau (Vollbild): oben die Bühne (echte Filmbühne: Seite, Heck, oben; dazu die Crew), darunter die Zeile „Thema · Wahl“,
   unten ein Steuerrad mit zwei Ringen: außen das Thema (Farben, Name, jeder Platz am Boot, Laternen, Kleidung, Stil, Glas), innen die Wahl.
   Drehen mit dem Finger, Antippen oder die Pfeile. Alles wirkt sofort als Vorschau; gespeichert wird erst mit „Übernehmen“, „Verwerfen“ stellt zurück.
   Speichert in S.cfg.look {stil, glas, farben {--var: #farbe}, up [Teile], kleid {figur: {teil: wahl}}} und den Namen in S.boat.name (R7: alles optional).
   ========================================================================== */
(() => {
'use strict';
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const PAL = {
  rumpf: ['#fbf8f2', '#efe3c4', '#28405e', '#3f6b55', '#a8372c', '#e2b23c', '#8fc1dc', '#2b2b2b', '#6b4a32', '#c96f4a'],
  streifen: ['#c0392b', '#2f4f80', '#f1d36b', '#3c8c5a', '#f3efe6', '#e8642c', '#1f1f1f', '#8fc1dc'],
  unterwasser: ['#1f3b63', '#7a2b25', '#24282c', '#2f5d3a', '#5a5a5a', '#c0392b'],
  dach: ['#cfd6db', '#e9e4d8', '#ece4d2', '#d9d2bd', '#b9874f', '#9aa7b1']
};
const NAMEN = ['FRIEDA', 'SEESCHWALBE', 'MÖWE', 'ALBERTINE', 'KLABAUTER', 'PAULINE'];
const HELL = c => { const h = c.replace('#', ''), r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16); return (r * 299 + g * 587 + b * 114) / 1000 > 150; };
let W = null, alt = null, themen = [], ti = 0, oi = 0, wa = 0, wi = 0, blick = 'seite', geaendert = 0, film = false;

/* ---------- Themen und ihre Wahl ---------- */
function look() { S.cfg = S.cfg || {}; S.cfg.look = S.cfg.look || {}; const l = S.cfg.look; l.farben = l.farben || {}; l.up = Array.isArray(l.up) ? l.up : []; l.kleid = l.kleid || {}; return l; }
function themenBauen() {
  const B = window.BOOT, F = window.FIGUREN, G = (window.FILMB && FILMB.GLAS) || {weich: {name: 'Weich'}};
  const T = [];
  const farbe = (teil, name, ic) => T.push({id: 'f-' + teil, ic, name, blick: 'seite', opts: PAL[teil].map(c => ({w: c, farbe: c, name: c})),
    akt: () => look().farben['--frieda-' + teil] || B.farben[teil], setz: w => { look().farben['--frieda-' + teil] = w; if (teil === 'rumpf' && !look().farben['--frieda-schrift-fest']) look().farben['--frieda-schrift'] = HELL(w) ? '#1f3b63' : '#f3efe6'; }});
  T.push({id: 'satz', ic: '🎨', name: 'Farbsatz', blick: 'seite', opts: Object.entries(B.FARBEN).map(([k, f]) => ({w: k, satz: f, name: f.name})),
    akt: () => { const l = look().farben; const k = Object.entries(B.FARBEN).find(([, f]) => l['--frieda-rumpf'] === f.rumpf && l['--frieda-streifen'] === f.streifen); return k ? k[0] : (l['--frieda-rumpf'] ? '' : 'klassisch'); },
    setz: w => { const f = B.FARBEN[w]; ['rumpf', 'streifen', 'unterwasser', 'dach', 'schrift'].forEach(k => { look().farben['--frieda-' + k] = f[k]; }); }});
  farbe('rumpf', 'Rumpf', '⛵'); farbe('streifen', 'Streifen', '〰️'); farbe('unterwasser', 'Unterwasser', '🌊'); farbe('dach', 'Kajütdach', '🏠');
  T.push({id: 'name', ic: '✒️', name: 'Name am Heck', blick: 'heck', neu: true, opts: NAMEN.map(n => ({w: n, name: n.charAt(0) + n.slice(1).toLowerCase(), text: n.slice(0, 3)})).concat([{w: '*', name: 'Eigener Name …', text: '✎'}]),
    akt: () => ((S.boat && S.boat.name) || 'FRIEDA').toUpperCase(),
    setz: w => { if (w === '*') { const n = prompt('Name am Heck (höchstens 12 Zeichen)', (S.boat && S.boat.name) || ''); if (n == null) return false; w = n.trim().slice(0, 12); } S.boat = {...(S.boat || {}), name: w}; }});
  const PIC = {bug: '🔱', dach: '📡', mast: '🚩', ueber: '⛱️', steuer: '☸️', heck: '🎏', spiegel: '🪜', bordwand: '🛟'};
  const BLICK = {spiegel: 'heck', bordwand: 'seite'};
  for (const [pn, p] of Object.entries(B.PLAETZE)) {
    const teile = Object.entries(B.TEILE).filter(([, t]) => t.platz === pn);
    T.push({id: 'p-' + pn, ic: PIC[pn] || '◻️', name: 'Platz: ' + p.name, platz: pn, blick: BLICK[pn] || (pn === 'dach' ? 'oben' : 'seite'),
      opts: [{w: '', name: 'leer', text: '–'}].concat(teile.map(([tn, t]) => ({w: tn, name: t.name, teil: tn, wann: t.wann}))),
      akt: () => B.belegt(pn) || '', setz: w => { const l = look(); l.up = l.up.filter(u => !(B.TEILE[u] && B.TEILE[u].platz === pn)); if (w) l.up.push(w); }});
  }
  T.push({id: 'laternen', ic: '💡', name: 'Laternen', blick: 'seite', opts: [{w: '', name: 'keine', text: '–'}, {w: 'laternen', name: 'Laternen an Bord', text: '💡'}],
    akt: () => look().up.includes('laternen') ? 'laternen' : '', setz: w => { const l = look(); l.up = l.up.filter(u => u !== 'laternen'); if (w) l.up.push(w); }});
  const KL = [['hinnerk', 'hut', '🧢'], ['hinnerk', 'jacke', '🧥'], ['smilla', 'haar', '💇'], ['smilla', 'jacke', '🧥'], ['hilke', 'weste', '🦺'], ['harms', 'hut', '🎩'], ['backbord', 'fell', '🐈']];
  for (const [fid, teil, ic] of KL) {
    const f = F.FIG[fid];
    T.push({id: `k-${fid}-${teil}`, ic, name: `${f.name.split(',')[0]}: ${({hut: 'Mütze', jacke: 'Jacke', haar: 'Haare', weste: 'Weste', fell: 'Fell'})[teil]}`, blick: 'crew', fig: fid, neu: true,
      opts: Object.entries(f.kleid[teil]).map(([w, n]) => ({w, name: n})), akt: () => F.kleidVon(fid, {kleid: look().kleid[fid] || {}})[teil],
      setz: w => { const l = look(); l.kleid[fid] = {...(l.kleid[fid] || {}), [teil]: w}; }});
  }
  T.push({id: 'stil', ic: '🖌️', name: 'Zeichenstil', blick: 'crew', opts: Object.entries(F.STILE).map(([k, n]) => ({w: k, name: n.split(':')[0], satzLang: n})), akt: () => look().stil || 'feder', setz: w => { look().stil = w; }});
  T.push({id: 'glas', ic: '🪟', name: 'Glas der Filmbühne', blick: 'seite', opts: Object.entries(G).map(([k, g]) => ({w: k, name: g.name, satzLang: g.satz})), akt: () => look().glas || 'weich', setz: w => { look().glas = w; }});
  return T;
}

/* ---------- Aufbau ---------- */
function css() {
  if (document.getElementById('werft2css')) return;
  const s = document.createElement('style'); s.id = 'werft2css';
  s.textContent = `#werft2{position:fixed;inset:0;z-index:2000;display:flex;flex-direction:column;background:#1b2a33;color:#f3e7c9;font-family:var(--body,Nunito,sans-serif);touch-action:none;user-select:none;-webkit-user-select:none}
  #werft2 .wkopf{display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top,0px)) 12px 6px}#werft2 .wkopf b{flex:1;font:800 1.15em 'Baloo 2',sans-serif}
  #werft2 .wx{width:40px;height:40px;border-radius:12px;border:0;background:rgba(243,231,201,.12);color:inherit;font-size:20px}
  #werft2 .wbuehne{position:relative;flex:1 1 auto;min-height:0;margin:0 12px;border-radius:18px;overflow:hidden;background:#cdbf9f}
  #werft2 .wbuehne>.wfilm,#werft2 .wbuehne>.wcrew{position:absolute;inset:0}#werft2 .wcrew{background:radial-gradient(ellipse at 50% 60%,#fbf4e3,#e3d3b0);display:flex;align-items:flex-end;justify-content:center}
  #werft2 .wcrew svg{width:100%;height:100%}
  #werft2 .wblicke{position:absolute;left:8px;right:8px;bottom:8px;display:flex;gap:6px;justify-content:center;z-index:5}
  #werft2 .wblicke button{border:0;border-radius:999px;padding:6px 11px;font:700 .82em inherit;background:rgba(20,32,40,.62);color:#f3e7c9;backdrop-filter:blur(4px)}#werft2 .wblicke button[aria-pressed="true"]{background:#e8a33a;color:#2a1c0e}
  #werft2 .wauge{position:absolute;right:8px;top:8px;z-index:5;border:0;border-radius:12px;width:40px;height:40px;background:rgba(20,32,40,.6);color:#f3e7c9;font-size:18px}#werft2 .wauge[aria-pressed="true"]{background:#e8a33a;color:#2a1c0e}
  #werft2 .wzeile{display:flex;align-items:center;gap:6px;padding:8px 12px 0}#werft2 .wzeile button{width:38px;height:38px;border-radius:50%;border:0;background:rgba(243,231,201,.12);color:inherit;font-size:18px;flex:none}
  #werft2 .wtext{flex:1;text-align:center;line-height:1.15}#werft2 .wtext small{display:block;opacity:.72;font-size:.78em}#werft2 .wtext b{font:800 1.05em 'Baloo 2',sans-serif}
  #werft2 .wrad{position:relative;flex:none;height:min(42dvh,300px)}#werft2 .wrad svg{position:absolute;inset:0;width:100%;height:100%;overflow:hidden}
  #werft2 .wfuss{position:relative;z-index:2;display:flex;gap:8px;padding:6px 12px calc(10px + env(safe-area-inset-bottom,0px))}#werft2 .wfuss button{flex:1;padding:12px;border-radius:14px;font:800 1em inherit;border:0}
  #werft2 .wverw{background:rgba(243,231,201,.12);color:#f3e7c9}#werft2 .wueb{background:#e8a33a;color:#2a1c0e}#werft2 .wueb[disabled]{opacity:.45}
  #werft2 .rt{font:700 9px Nunito,sans-serif;fill:#f3e7c9;text-anchor:middle;pointer-events:none}#werft2 .rt.on{fill:#ffd27a}#werft2 .ri{font-size:17px;text-anchor:middle;dominant-baseline:central;pointer-events:none}
  #werft2 .ot{font:800 10px Nunito,sans-serif;text-anchor:middle;dominant-baseline:central;pointer-events:none}
  #werft2 [hidden]{display:none!important}#werft2 textarea{touch-action:auto}
  :root[data-platz-hl] .fr .platz .pmark{display:none}` +
    ['bug', 'dach', 'mast', 'ueber', 'steuer', 'heck', 'spiegel', 'bordwand'].map(p => `:root[data-platz-hl="${p}"] .fr .platz[data-platz="${p}"] .pmark{display:inline}`).join('');
  document.head.appendChild(s);
}
/* Steuerrad: Mittelpunkt unter dem sichtbaren Teil; außen Themen (r 232), innen Wahl (r 150), Nabe r 96 */
const CX = 200, CY = 322, RA = 232, RI = 150, SA = 360 / 24, SI = 26;
const polar = (r, w) => { const a = (w - 90) * Math.PI / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };
function radSvg() {
  const holz = '#8a5a32', holzD = '#6b4426', messing = '#d9a93b';
  let sp = '';
  for (let i = 0; i < 12; i++) { const [x1, y1] = polar(96, i * 30), [x2, y2] = polar(290, i * 30); sp += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${holzD}" stroke-width="9" stroke-linecap="round"/>`; const [hx, hy] = polar(300, i * 30); sp += `<circle cx="${hx}" cy="${hy}" r="9" fill="${holz}" stroke="${holzD}" stroke-width="2"/>`; }
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet" aria-label="Drehrad: außen das Thema, innen die Wahl">
    <defs><radialGradient id="wrg" cx=".5" cy=".5" r=".5"><stop offset=".7" stop-color="#9b6a3e"/><stop offset="1" stop-color="#6b4426"/></radialGradient>
      <radialGradient id="wng" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#3a5463"/><stop offset="1" stop-color="#1e3240"/></radialGradient></defs>
    <g id="wspeichen">${sp}</g>
    <circle cx="${CX}" cy="${CY}" r="${RA}" fill="none" stroke="url(#wrg)" stroke-width="56"/>
    <circle cx="${CX}" cy="${CY}" r="${RA + 28}" fill="none" stroke="${holzD}" stroke-width="2"/><circle cx="${CX}" cy="${CY}" r="${RA - 28}" fill="none" stroke="${holzD}" stroke-width="2"/>
    <circle cx="${CX}" cy="${CY}" r="${RI}" fill="none" stroke="#24394a" stroke-width="56"/><circle cx="${CX}" cy="${CY}" r="${RI + 28}" fill="none" stroke="${messing}" stroke-width="1.6" opacity=".7"/>
    <circle cx="${CX}" cy="${CY}" r="96" fill="url(#wng)" stroke="${messing}" stroke-width="3"/>
    <g id="waussen"></g><g id="winnen"></g>
    <path d="M${CX} ${CY - RA - 30} l-9 -14 h18z" fill="${messing}" stroke="#7a5a1e" stroke-width="1.5"/><path d="M${CX} ${CY - RI - 30} l-7 -11 h14z" fill="${messing}" stroke="#7a5a1e" stroke-width="1.2"/>
    <text id="wnabe" x="${CX}" y="${CY - 62}" text-anchor="middle" style="font:800 13px 'Baloo 2',sans-serif;fill:#ffd27a"></text>
    <text id="wnabe2" x="${CX}" y="${CY - 44}" text-anchor="middle" style="font:700 10px Nunito,sans-serif;fill:#f3e7c9;opacity:.8"></text></svg>`;
}
function ringeZeichnen() {
  if (!W) return;
  const a = W.querySelector('#waussen'), b = W.querySelector('#winnen'); if (!a || !b) return;
  const n = themen.length;
  a.innerHTML = themen.map((t, i) => { let w = ((i * SA - wa) % 360 + 540) % 360 - 180; if (Math.abs(w) > 78) return ''; const [x, y] = polar(RA, w), on = i === ti;
    return `<g data-ti="${i}" opacity="${(1 - Math.abs(w) / 95).toFixed(2)}"><circle cx="${x}" cy="${y}" r="21" fill="${on ? 'rgba(255,210,122,.25)' : 'transparent'}"/><text class="ri" x="${x}" y="${y - 5}">${t.ic}</text><text class="rt${on ? ' on' : ''}" x="${x}" y="${y + 15}">${esc(kurz(t.name))}</text></g>`; }).join('');
  const T = themen[ti], akt = T.akt();
  b.innerHTML = T.opts.map((o, i) => { let w = i * SI - wi; if (Math.abs(w) > 70) return ''; const [x, y] = polar(RI, w), gew = o.w === akt, sel = i === oi;
    return `<g data-oi="${i}" opacity="${(1 - Math.abs(w) / 90).toFixed(2)}">${perle(o, x, y, gew, sel)}</g>`; }).join('');
  W.querySelector('#wnabe').textContent = kurz(T.opts[oi] ? T.opts[oi].name : '', 22);
  W.querySelector('#wnabe2').textContent = `${oi + 1} von ${T.opts.length}`;
}
const kurz = (s, n = 11) => (s = String(s).replace(/^Platz: /, '')).length > n ? s.slice(0, n - 1) + '…' : s;
function perle(o, x, y, gew, sel) {
  const ring = `<circle cx="${x}" cy="${y}" r="21" fill="${o.farbe || '#f6efe0'}" stroke="${gew ? '#ffd27a' : '#0d1a22'}" stroke-width="${gew ? 3.5 : 1.5}"/>${sel && !gew ? `<circle cx="${x}" cy="${y}" r="24" fill="none" stroke="#ffd27a" stroke-width="1.2" stroke-dasharray="3 3"/>` : ''}`;
  if (o.farbe) return ring;
  if (o.satz) return ring + `<path d="M${x - 15} ${y + 2} H${x + 15} L${x + 11} ${y + 10} H${x - 11}Z" fill="${o.satz.rumpf}" stroke="#333" stroke-width=".8"/><path d="M${x - 15} ${y + 4} H${x + 15}" stroke="${o.satz.streifen}" stroke-width="2.4"/><rect x="${x - 6}" y="${y - 7}" width="12" height="9" fill="${o.satz.dach}" stroke="#333" stroke-width=".7"/>`;
  if (o.teil && window.BOOT) { const t = BOOT.TEILE[o.teil], fn = t.seite || t.oben; const f = (teil, extra = '') => `class="fr-${teil}${extra ? ' ' + extra : ''}"`;
    return ring + `<g class="fr" transform="translate(${x} ${y + (t.seite ? 6 : 0)}) scale(${o.teil === 'bimini' ? .55 : o.teil === 'angel' || o.teil === 'badeleiter' ? .5 : .9})">${fn(f)}</g>`; }
  return ring + `<text class="ot" x="${x}" y="${y}" fill="#2a1c0e">${esc(o.text || kurz(o.name, 7))}</text>`;
}
function textZeile() {
  if (!W) return;
  const T = themen[ti], o = T.opts[oi] || {}, gew = o.w === T.akt();
  W.querySelector('.wtext').innerHTML = `<small>${T.ic} ${esc(T.name)}</small><b>${esc(o.name || '')}${gew ? ' ✓' : ''}</b>${o.wann ? `<small>${o.wann === 'später' ? 'Platz schon eingebaut, Teil zum Ausprobieren' : 'später als Belohnung: ' + esc(o.wann)}</small>` : o.satzLang ? `<small>${esc(o.satzLang.split(':').slice(-1)[0])}</small>` : ''}`;
  const u = W.querySelector('.wueb'); u.disabled = !geaendert; u.textContent = geaendert ? `Übernehmen (${geaendert})` : 'Übernehmen';
}

/* ---------- Vorschau ---------- */
let blickAkt = '';
async function bildZeigen(neu, neuBauen) {
  if (!W) return;
  const B = W.querySelector('.wbuehne'); if (!B) return;
  if (neu === 'crew') {
    blickAkt = 'crew'; B.querySelector('.wfilm').hidden = true; const c = B.querySelector('.wcrew'); c.hidden = false;
    const T = themen[ti], F = window.FIGUREN, haupt = T.fig || 'hinnerk', rest = ['hinnerk', 'smilla', 'hilke', 'harms', 'backbord', 'klabauter'].filter(x => x !== haupt);
    c.innerHTML = `<svg viewBox="-150 -150 300 196" preserveAspectRatio="xMidYMax meet"><g transform="translate(0 0) scale(${F.FIG[haupt].tier ? 3.2 : 1.25})">${F.figur(haupt, {blick: 'vorn', dreh: false, pose: F.FIG[haupt].tier ? 'sitzen' : 'stehen'})}</g>
      ${rest.map((id, i) => `<g transform="translate(${-130 + i * 56 + (i > 1 ? 110 : 0)} 4) scale(${F.FIG[id].tier ? 1.4 : .5})">${F.figur(id, {blick: 'vorn', dreh: false})}</g>`).join('')}</svg>`;
  } else {
    const c = B.querySelector('.wcrew'); c.hidden = true; const fl = B.querySelector('.wfilm'); fl.hidden = false;
    if (!window.FILMB) return;
    if (!film) { FILMB.mount(fl); film = true; neuBauen = true; }
    if (neu !== blickAkt || neuBauen) {
      blickAkt = neu; FILMB.reset();
      if (neu === 'oben') { FILMB.ort('kluever', 'sofort', 'oben'); FILMB.sofort({k: [.55], pier: [.5]}); FILMB.kamera('oben', 'nah', 'sofort'); }
      else if (neu === 'heck') { FILMB.ort('tankstelle', 'sofort', 'heck'); FILMB.sofort({p: [.4]}); FILMB.kamera('heck', 'nah', 'sofort'); }
      else { FILMB.ort('tankstelle', 'sofort', 'seite'); FILMB.sofort({p: [.5]}); FILMB.kamera('seite', 'halbnah', 'sofort'); }
    }
  }
  W.querySelectorAll('.wblicke button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.b === blickAkt)));
}
function platzHervorheben() { const T = themen[ti]; if (T.platz) document.documentElement.dataset.platzHl = T.platz; else delete document.documentElement.dataset.platzHl; }

/* ---------- Bedienung ---------- */
function themaWaehlen(i, sanft = true) {
  ti = (i + themen.length) % themen.length; const T = themen[ti];
  oi = Math.max(0, T.opts.findIndex(o => o.w === T.akt()));
  drehen('a', ti * SA, sanft); drehen('i', oi * SI, sanft);
  platzHervorheben(); if (T.blick && T.blick !== blickAkt) bildZeigen(T.blick); textZeile();
}
function wahlSetzen(i) {
  const T = themen[ti]; oi = Math.max(0, Math.min(T.opts.length - 1, i)); const o = T.opts[oi];
  drehen('i', oi * SI, true);
  if (o.w !== T.akt()) {
    if (T.setz(o.w) === false) { textZeile(); return; }
    geaendert++; try { lookAnwenden(); } catch (e) {}
    if (T.neu) bildZeigen(blickAkt === 'crew' ? 'crew' : blickAkt, true);
    if (T.id === 'glas' && blickAkt === 'crew') bildZeigen('seite');
    try { AUD.click(); } catch (e) {} try { navigator.vibrate && navigator.vibrate(8); } catch (e) {}
  }
  ringeZeichnen(); textZeile();
}
let anim = null;
function drehen(welcher, ziel, sanft) {
  const von = welcher === 'a' ? wa : wi;
  if (welcher === 'a') { const d = ((ziel - wa) % 360 + 540) % 360 - 180; ziel = wa + d; }
  if (!sanft) { if (welcher === 'a') wa = ziel; else wi = ziel; ringeZeichnen(); return; }
  const t0 = performance.now(), dauer = 260;
  const schritt = now => { if (!W) return; const u = Math.min(1, (now - t0) / dauer), e = 1 - Math.pow(1 - u, 3), v = von + (ziel - von) * e; if (welcher === 'a') wa = v; else wi = v; ringeZeichnen(); if (u < 1) requestAnimationFrame(schritt); };
  requestAnimationFrame(schritt);
}
function radBedienung(svg) {
  let zug = null;
  const pos = e => { const r = svg.getBoundingClientRect(), k = 300 / r.height, ox = (r.width * k - 400) / 2; return [(e.clientX - r.left) * k - ox, (e.clientY - r.top) * k]; };
  svg.addEventListener('pointerdown', e => {
    const [x, y] = pos(e), d = Math.hypot(x - CX, y - CY), w = Math.atan2(x - CX, -(y - CY)) * 180 / Math.PI;
    const ring = d > 192 ? 'a' : d > 108 ? 'i' : null; if (!ring) return;
    zug = {ring, w0: w, s0: ring === 'a' ? wa : wi, weg: 0, ziel: e.target.closest('[data-ti],[data-oi]')};
    svg.setPointerCapture(e.pointerId); e.preventDefault();
  });
  svg.addEventListener('pointermove', e => {
    if (!zug) return; const [x, y] = pos(e), w = Math.atan2(x - CX, -(y - CY)) * 180 / Math.PI;
    let dw = w - zug.w0; dw = ((dw % 360) + 540) % 360 - 180; zug.weg = Math.max(zug.weg, Math.abs(dw));
    if (zug.ring === 'a') { wa = zug.s0 - dw; const n = Math.round(wa / SA); const i = ((n % themen.length) + themen.length) % themen.length; if (i !== ti) { ti = i; tick(); } }
    else { const T = themen[ti]; wi = Math.max(-SI * .4, Math.min((T.opts.length - 1 + .4) * SI, zug.s0 - dw)); const i = Math.round(wi / SI); if (i !== oi && i >= 0 && i < T.opts.length) { oi = i; tick(); } }
    ringeZeichnen(); textZeile();
  });
  const los = e => {
    if (!zug) return; const z = zug; zug = null;
    if (z.weg < 4 && z.ziel) { if (z.ziel.dataset.ti != null) themaWaehlen(+z.ziel.dataset.ti); else wahlSetzen(+z.ziel.dataset.oi); return; }
    if (z.ring === 'a') themaWaehlen(Math.round(wa / SA)); else wahlSetzen(Math.round(wi / SI));
  };
  svg.addEventListener('pointerup', los); svg.addEventListener('pointercancel', los);
}
let tickT = 0; function tick() { const n = performance.now(); if (n - tickT > 40) { tickT = n; try { navigator.vibrate && navigator.vibrate(3); } catch (e) {} } }

/* Einstellungen als Text zum Kopieren (Nutzer 20.11.2026: „als Text für dich hier reinkopieren“): lesbare Zeilen plus die Rohdaten (JSON) */
function exportText() {
  const l = look(), B = window.BOOT, F = window.FIGUREN, z = [];
  z.push(`Skipper Werft (v${window.__ver || '?'}), Stand ${new Date().toISOString().slice(0, 16).replace('T', ' ')}${geaendert ? ', mit noch nicht übernommenen Änderungen' : ''}`);
  z.push(`Name am Heck: ${(S.boat && S.boat.name) || 'FRIEDA'}`);
  z.push(`Zeichenstil: ${l.stil || 'feder'}   Glas der Filmbühne: ${l.glas || 'weich'}`);
  z.push('Boot-Farben: ' + (['rumpf', 'streifen', 'unterwasser', 'dach', 'schrift'].map(k => `${k} ${l.farben['--frieda-' + k] || B.farben[k] + ' (Standard)'}`).join(', ')));
  z.push('Plätze: ' + Object.entries(B.PLAETZE).map(([pn, p]) => `${p.name} = ${B.belegt(pn) ? B.TEILE[B.belegt(pn)].name : 'leer'}`).join('; '));
  z.push('Laternen: ' + (l.up.includes('laternen') ? 'ja' : 'nein'));
  z.push('Kleidung: ' + Object.entries(F.FIG).filter(([, f]) => Object.keys(f.kleid).length).map(([id, f]) => { const k = F.kleidVon(id, {kleid: l.kleid[id] || {}}); return `${f.name.split(',')[0]} (${Object.entries(k).map(([t, w]) => `${t} ${f.kleid[t][w]}`).join(', ')})`; }).join('; '));
  const fz = Object.entries(l.farben).filter(([k]) => !k.startsWith('--frieda-')); if (fz.length) z.push('Figurenfarben: ' + fz.map(([k, v]) => `${k} ${v}`).join(', '));
  z.push('Rohdaten: ' + JSON.stringify({name: (S.boat && S.boat.name) || '', look: l}));
  return z.join('\n');
}
async function kopieren() {
  const t = exportText(); let ok = false;
  try { await navigator.clipboard.writeText(t); ok = true; } catch (e) {}
  if (ok) { try { toast('Kopiert. Jetzt bei Claude einfügen.'); } catch (e) {} return; }
  /* ohne Zwischenablage: Text zum Markieren zeigen */
  const f = document.createElement('div'); f.style.cssText = 'position:absolute;inset:0;z-index:20;background:#1b2a33;padding:calc(16px + env(safe-area-inset-top,0px)) 14px 14px;display:flex;flex-direction:column;gap:8px';
  f.innerHTML = `<b>Text markieren, kopieren und bei Claude einfügen:</b><textarea readonly style="flex:1;font:12px monospace;border-radius:10px;padding:8px;user-select:text;-webkit-user-select:text">${esc(t)}</textarea><button class="wueb" style="padding:12px;border-radius:14px;border:0;font:800 1em inherit;background:#e8a33a;color:#2a1c0e">Fertig</button>`;
  W.appendChild(f); const ta = f.querySelector('textarea'); ta.style.touchAction = 'auto'; ta.focus(); ta.select(); f.querySelector('button').onclick = () => f.remove();
}
function schliessen(uebernehmen) {
  if (uebernehmen) { try { save(); } catch (e) {} try { toast('Übernommen. Gilt jetzt überall.'); } catch (e) {} }
  else if (alt) { S.cfg.look = alt.look; if (alt.name === undefined) { if (S.boat) delete S.boat.name; } else S.boat = {...(S.boat || {}), name: alt.name}; }
  try { lookAnwenden(); } catch (e) {}
  delete document.documentElement.dataset.platzHl; delete document.documentElement.dataset.plaetze;
  if (W) W.remove(); W = null; film = false; blickAkt = '';
  try { if (typeof setTab === 'function' && document.querySelector('.ddeck')) setTab('deck'); } catch (e) {}
}
async function oeffnen(start) {
  try { await nachladen('boot.js'); await nachladen('figuren.js'); await nachladen('film.js'); } catch (e) { toast('Die Werft ließ sich nicht laden.'); return; }
  css(); FIGUREN.css(); BOOT.css();
  alt = {look: JSON.parse(JSON.stringify((S.cfg && S.cfg.look) || {})), name: S.boat ? S.boat.name : undefined};
  themen = themenBauen(); geaendert = 0;
  W = document.createElement('div'); W.id = 'werft2';
  W.innerHTML = `<div class="wkopf"><b>⚓ Werft</b><button class="wx" id="wkop" aria-label="Einstellungen kopieren" title="Einstellungen als Text kopieren">📋</button><button class="wx" id="whilfe" aria-label="Hilfe">?</button><button class="wx" id="wzu" aria-label="Schließen">✕</button></div>
    <div class="wbuehne"><div class="wfilm"></div><div class="wcrew" hidden></div><button class="wauge" id="wauge" aria-pressed="false" aria-label="Alle Plätze zeigen">◎</button>
      <div class="wblicke"><button data-b="seite">Seite</button><button data-b="heck">Heck</button><button data-b="oben">Oben</button><button data-b="crew">Crew</button></div></div>
    <div class="wzeile"><button id="wl" aria-label="Vorherige Wahl">‹</button><div class="wtext"></div><button id="wr" aria-label="Nächste Wahl">›</button></div>
    <div class="wrad">${radSvg()}</div>
    <div class="wfuss"><button class="wverw" id="wverw">Verwerfen</button><button class="wueb" id="wueb" disabled>Übernehmen</button></div>`;
  document.body.appendChild(W);
  W.querySelector('#wzu').onclick = () => { if (!geaendert || confirm('Änderungen verwerfen?')) schliessen(false); };
  W.querySelector('#wverw').onclick = () => { if (!geaendert) return schliessen(false); S.cfg.look = JSON.parse(JSON.stringify(alt.look)); if (alt.name === undefined) { if (S.boat) delete S.boat.name; } else S.boat = {...(S.boat || {}), name: alt.name}; geaendert = 0; try { lookAnwenden(); } catch (e) {} bildZeigen(blickAkt || 'seite', true); themaWaehlen(ti, false); };
  W.querySelector('#wueb').onclick = () => schliessen(true);
  W.querySelector('#wkop').onclick = kopieren;
  W.querySelector('#wl').onclick = () => wahlSetzen(oi - 1); W.querySelector('#wr').onclick = () => wahlSetzen(oi + 1);
  W.querySelector('#whilfe').onclick = () => toast('Außen am Rad das Thema drehen, innen die Wahl. Antippen geht auch. Das Bild zeigt alles sofort; erst „Übernehmen“ speichert.', 6500);
  W.querySelector('#wauge').onclick = e => { const an = e.currentTarget.getAttribute('aria-pressed') !== 'true'; e.currentTarget.setAttribute('aria-pressed', String(an)); if (an) document.documentElement.dataset.plaetze = '1'; else delete document.documentElement.dataset.plaetze; };
  W.querySelectorAll('.wblicke button').forEach(b => b.onclick = () => bildZeigen(b.dataset.b));
  radBedienung(W.querySelector('.wrad svg'));
  const startI = Math.max(0, themen.findIndex(t => t.id === ({boot: 'satz', crew: 'k-hinnerk-hut', stil: 'stil'})[start || 'boot']));
  await bildZeigen('seite'); themaWaehlen(startI, false);
}
window.WERFT = {oeffnen, exportText, _themen: () => themen, _wahl: wahlSetzen, _thema: themaWaehlen};
})();

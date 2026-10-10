/* ==========================================================================
   Skipper – Manöverspiel (nachgeladen über loadManoever in index.html). Texte: data/manoever.json.
   Manöver nach dem Praxisprotokoll der Prüfungsrichtlinie (Anlage 4, I. mit Antriebsmaschine).
   Steuerung mit einem Finger wie am Außenborder: Steuerfeld hoch = voraus mit mehr Gas, runter = zurück,
   Mitte = neutral (Raste), seitlich = Pinne bzw. Ruder. Alles bleibt stehen, wo man loslässt (wie in echt).
   Physik: Außenborder lenkt mit dem Schub (auch bei wenig Fahrt), Radeffekt rückwärts (Bug nach Steuerbord),
   Wind drückt das Boot nach Lee und lässt den Bug bei wenig Fahrt abfallen.
   Kommandos: an festen Punkten Auswahl mit vier Antworten (auch „Kein Kommando“), das Spiel steht so lange.
   Vorführung „So geht's“: Schlüsselbilder aus der JSON-Datei, weich verbunden, mit Crew-Erklärungen.
   ========================================================================== */
(() => {
const MN = window.MANOEVER = window.MANOEVER || {};
let D = null;
MN.init = () => D ? Promise.resolve() : fetch('data/manoever.json?v=' + window.__ver).then(r => r.json()).then(j => { D = j.manoever; window.MAN_DATA = D; });
const LISTE = ['ablegen', 'anlegen', 'mob', 'kompass', 'aufstoppen', 'wenden'];
const RAD = Math.PI / 180, n360 = a => ((a % 360) + 360) % 360, dw = (a, b) => ((a - b + 540) % 360) - 180, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, e) => a + (b - a) * e;
const V_VOR = 60, V_RUECK = 32, KN = 12;  // Pixel je Sekunde; 12 px/s = 1 kn
const DOCK_W = 26, BS = 1.4;  // Bootsgröße
const steuer = () => (S.cfg && S.cfg.steuer) || 'pinne';
const sagT = s => typeof s === 'string' ? s : s ? s[steuer()] : '';
const wer = w => w === 'H' ? 'kroeger' : cid(w);
const M_ = () => (S.man = S.man || {});
const fmtK = k => String(Math.round(n360(k)) % 360).padStart(3, '0');
const CSS = `<style>.mwrap{position:relative}.mwrap canvas{display:block;border-radius:14px;touch-action:none}
.mpad{position:absolute;right:10px;bottom:10px;width:150px;height:164px;border-radius:22px;background:rgba(20,30,40,.55);touch-action:none;user-select:none;-webkit-user-select:none}
.mpad .mk{position:absolute;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:#f0b53e;border:3px solid #fffaf0;box-shadow:0 2px 0 rgba(0,0,0,.35);pointer-events:none}
.mpad .ml{position:absolute;left:10px;right:10px;top:50%;height:2px;background:rgba(255,250,240,.55)}.mpad .mv{position:absolute;top:12px;bottom:12px;left:50%;width:2px;background:rgba(255,250,240,.22)}
.mpad b{position:absolute;color:#fffaf0;font:700 10px sans-serif;pointer-events:none}
.mwrap .motorbtn{right:auto;left:10px;bottom:10px}
.mcmd{margin-top:8px;background:var(--paper);border:2px solid var(--line);border-radius:16px;padding:10px 12px;min-height:150px}
.mcmd.an{border-color:var(--lamp);box-shadow:0 0 0 3px rgba(240,181,62,.25)}
.mcmd .ruhe{margin:0;color:var(--muted);font-size:.85rem}
.mcmd h3{margin:0 0 6px;font:700 1rem var(--hfont)}.mcmd .menu{display:grid;grid-template-columns:1fr 1fr;gap:6px}.mcmd .menuitem{text-align:left;min-height:44px;padding:8px 10px;font-size:.88rem}.mcmd .menuitem.richtig{border-color:#1e7f4f;box-shadow:inset 0 0 0 2px #1e7f4f}.mcmd .menuitem.falsch{border-color:#c2473b;box-shadow:inset 0 0 0 2px #c2473b}
.mbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 2px}.mbar .btn{min-height:40px;padding:.4em .9em}
.mgrid{display:grid;grid-template-columns:1fr;gap:8px}.mgrid button{border:2px solid var(--line);background:var(--paper);border-radius:14px;padding:10px;color:var(--ink);text-align:left}.mgrid b{display:block;font:700 1rem var(--hfont)}
.msteps li{margin:4px 0;opacity:.45;cursor:pointer}.msteps li.an{opacity:1;font-weight:700}
.mpruef li{margin:3px 0}</style>`;

/* ---------- Szene: Wasser, Steg, Tonnen, Box, Person, Kompass, Boot, Anzeigen ---------- */
const P = (v, L) => v > 1 ? v : v * L;  // Anteil oder Pixel
function szene(id, W, H, wind) {
  const s = {id, W, H, wind, dock: id === 'ablegen' || id === 'anlegen' ? {x: 0, y: H * .35, w: DOCK_W, h: H * .45} : null};
  if (id === 'ablegen') s.gate = {x: W * .5, y: H * .12};
  if (id === 'wenden') s.box = {x: W * .2, y: H * .28, w: W * .6, h: H * .5};
  if (id === 'aufstoppen') s.tonne = {x: W * .45 + 42, y: H * .35};
  /* Peiltonne links oben: rechts oben liegt die Kompassrose */
  if (id === 'kompass') { s.tonne = {x: W * .2, y: H * .34}; s.wrap = true; }
  return s;
}
function tonne(ctx, x, y, t) { const w = Math.sin(t / 400) * 1.5; ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(x + 2, y + 3, 9, 5, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#d33a2c'; ctx.fillRect(x - 7 + w * .3, y - 9, 14, 18); ctx.fillStyle = '#fff'; ctx.fillRect(x - 7 + w * .3, y - 2, 14, 3); }
function zeichneSzene(ctx, s, t, x) {
  const {W, H} = s;
  drawWater(ctx, W, H, t);
  if (s.box) { ctx.strokeStyle = 'rgba(255,250,240,.7)'; ctx.setLineDash([6, 6]); ctx.lineWidth = 2; ctx.strokeRect(s.box.x, s.box.y, s.box.w, s.box.h); ctx.setLineDash([]); }
  if (s.dock) { const d = s.dock; ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(d.x + 3, d.y + 4, d.w, d.h); ctx.fillStyle = '#8a5a3a'; ctx.fillRect(d.x, d.y, d.w, d.h); ctx.fillStyle = '#5a3a24'; for (let y = d.y + 8; y < d.y + d.h; y += 22) ctx.fillRect(d.x, y, d.w, 3); for (const y of [d.y + 18, d.y + d.h - 18]) { ctx.fillStyle = '#3a2a1c'; ctx.beginPath(); ctx.arc(d.w - 6, y, 4, 0, 7); ctx.fill(); } }
  if (s.gate) { const g = s.gate; ctx.fillStyle = '#d33a2c'; ctx.fillRect(g.x - 50, g.y - 10, 14, 20); ctx.fillStyle = '#2e9a52'; ctx.beginPath(); ctx.moveTo(g.x + 43, g.y - 12); ctx.lineTo(g.x + 55, g.y + 10); ctx.lineTo(g.x + 31, g.y + 10); ctx.fill(); }
  if (s.tonne) tonne(ctx, s.tonne.x, s.tonne.y, t);
  if (s.tonne && s.id === 'kompass') { ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,251,240,.92)'; ctx.fillRect(s.tonne.x - 32, s.tonne.y + 14, 64, 16); ctx.fillStyle = '#2a2019'; ctx.fillText('Peiltonne', s.tonne.x, s.tonne.y + 26); }
  if (x.person) { const p = x.person, wave = Math.sin(t / 220) * 3;
    if (x.ring) { ctx.strokeStyle = '#f07a2c'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(p.x + 14, p.y - 6, 7, 0, 7); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([]); }
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(p.x, p.y + 2, 11, 6, 0, 0, 7); ctx.stroke();
    ctx.strokeStyle = '#f2c9a0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.x + 4, p.y); ctx.lineTo(p.x + 9, p.y - 9 + wave); ctx.stroke();
    ctx.fillStyle = '#f2c9a0'; ctx.beginPath(); ctx.arc(p.x, p.y - 2, 5.5, 0, 7); ctx.fill(); ctx.fillStyle = '#6b4a2b'; ctx.beginPath(); ctx.arc(p.x, p.y - 4, 5.5, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('MOB', p.x, p.y - 14); }
}
/* Boot von oben: Rumpf, Steuerstand, Außenborder (dreht mit), Pinne oder Steuerrad, Schraubenwasser, Heckwelle, Fender */
function zeichneBoot(ctx, b, t, fender) {
  ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.k * RAD); ctx.scale(BS, BS);
  const sp = Math.abs(b.v);
  if (sp > 6) { ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; const l = Math.min(40, sp * .7), d = b.v > 0 ? 1 : -1; ctx.beginPath(); ctx.moveTo(-9, d * 6); ctx.lineTo(-9 - l * .35, d * (6 + l)); ctx.moveTo(9, d * 6); ctx.lineTo(9 + l * .35, d * (6 + l)); ctx.stroke(); }
  ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.moveTo(2, -20); ctx.quadraticCurveTo(14, -4, 12, 18); ctx.lineTo(-8, 18); ctx.quadraticCurveTo(-10, -4, 2, -20); ctx.fill();
  ctx.fillStyle = '#fbf6ec'; ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -24); ctx.quadraticCurveTo(12, -8, 10, 16); ctx.lineTo(-10, 16); ctx.quadraticCurveTo(-12, -8, 0, -24); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c9c2b4'; ctx.fillRect(-7, 9, 14, 6); ctx.fillStyle = '#3d5f8f'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-6, -6, 12, 11, 3) : ctx.rect(-6, -6, 12, 11); ctx.fill();
  if (fender) { ctx.fillStyle = '#e8eef4'; ctx.strokeStyle = '#3d5f8f'; ctx.lineWidth = 1; for (const y of [-8, 4]) { ctx.beginPath(); ctx.ellipse(-12.5, y, 2.6, 4.5, 0, 0, 7); ctx.fill(); ctx.stroke(); } }
  /* Außenborder: Drehpunkt am Spiegel, Schraube zeigt bei positiver Ruderwirkung nach Steuerbord */
  const phi = (b.r || 0) * .55, sx = Math.sin(phi), cy = Math.cos(phi);
  if (b.motor && b.g) { ctx.fillStyle = 'rgba(255,255,255,.55)'; const d = b.g > 0 ? 1 : -.5; for (let i = 1; i <= 4; i++) { const q = (t / 120 + i) % 4; ctx.beginPath(); ctx.arc(sx * (14 + q * 5 * d), 17 + cy * (14 + q * 5 * d), 2.4 + q * .5, 0, 7); ctx.fill(); } }
  ctx.strokeStyle = '#2b2f33'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 17); ctx.lineTo(sx * 11, 17 + cy * 11); ctx.stroke();
  ctx.fillStyle = b.motor ? '#2b2f33' : '#555c63'; ctx.beginPath(); ctx.arc(0, 17, 5, 0, 7); ctx.fill();
  if (steuer() === 'pinne') { ctx.strokeStyle = '#2b2f33'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 17); ctx.lineTo(-sx * 19, 17 - cy * 19); ctx.stroke(); ctx.strokeStyle = '#f0b53e'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-sx * 13, 17 - cy * 13); ctx.lineTo(-sx * 19, 17 - cy * 19); ctx.stroke(); }
  else { ctx.save(); ctx.translate(0, 6); ctx.rotate((b.r || 0) * 1.6); ctx.strokeStyle = '#2b2f33'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, 7); ctx.moveTo(-4.5, 0); ctx.lineTo(4.5, 0); ctx.moveTo(0, -4.5); ctx.lineTo(0, 4.5); ctx.stroke(); ctx.restore(); }
  ctx.lineCap = 'butt'; ctx.restore();
}
function zeichneKompass(ctx, W, k, ziel) {
  const x = W - 112, y = 58, r = 40; ctx.save(); ctx.fillStyle = 'rgba(20,30,40,.6)'; ctx.beginPath(); ctx.arc(x, y, r + 6, 0, 7); ctx.fill();
  ctx.translate(x, y); ctx.rotate(-k * RAD); ctx.strokeStyle = '#fffaf0'; ctx.fillStyle = '#fffaf0'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let a = 0; a < 360; a += 10) { ctx.save(); ctx.rotate(a * RAD); ctx.lineWidth = a % 30 ? 1 : 2; ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, -r + (a % 30 ? 5 : 9)); ctx.stroke(); if (!(a % 30)) { ctx.translate(0, -r + 16); ctx.rotate(-a * RAD + k * RAD); ctx.fillText(a ? String(a / 10) : 'N', 0, 0); } ctx.restore(); }
  if (ziel != null) { ctx.save(); ctx.rotate(ziel * RAD); ctx.fillStyle = '#ff6b5a'; ctx.beginPath(); ctx.moveTo(0, -r - 6); ctx.lineTo(-5, -r + 3); ctx.lineTo(5, -r + 3); ctx.fill(); ctx.restore(); }
  ctx.restore(); ctx.strokeStyle = '#f0b53e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y - r - 8); ctx.lineTo(x, y - r + 10); ctx.stroke();
  ctx.fillStyle = '#fffaf0'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(fmtK(k) + '°', x, y + r + 22);
}
function anzeigen(ctx, s, b, extra) {
  const {W, H} = s, kn = Math.abs(b.v) / KN, pc = Math.round(Math.abs(b.g) * 100), rw = Math.round(Math.abs(b.r || 0) * 30);
  const gang = !b.motor ? 'Motor aus' : !b.g ? 'neutral' : (b.g > 0 ? 'voraus ' : 'zurück ') + pc + ' %';
  const ruder = steuer() === 'pinne' ? (!b.r ? 'Pinne mittschiffs' : 'Pinne nach ' + (b.r > 0 ? 'Bb ' : 'Stb ') + rw + '°') : (!b.r ? 'Ruder mittschiffs' : 'Ruder ' + (b.r > 0 ? 'Stb ' : 'Bb ') + rw + '°');
  ctx.fillStyle = 'rgba(20,30,40,.55)'; ctx.fillRect(6, 6, 168, 46); ctx.fillStyle = '#fffaf0'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(`${kn.toFixed(1).replace('.', ',')} kn · ${gang}`, 12, 24); ctx.font = '12px sans-serif'; ctx.fillText(ruder, 12, 42);
  /* Wind: Pfeil zeigt, wohin er weht */
  const wx = W - 34, wy = 30; ctx.fillStyle = 'rgba(20,30,40,.55)'; ctx.beginPath(); ctx.arc(wx, wy, 22, 0, 7); ctx.fill();
  ctx.save(); ctx.translate(wx, wy); ctx.rotate((s.wind.from + 180) * RAD); ctx.strokeStyle = '#fffaf0'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(0, -12); ctx.moveTo(-5, -6); ctx.lineTo(0, -12); ctx.lineTo(5, -6); ctx.stroke(); ctx.restore();
  ctx.fillStyle = '#fffaf0'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(`Wind ${2 + Math.round(s.wind.s * 3)} Bft`, wx, wy + 36);
  if (extra) { ctx.textAlign = 'right'; ctx.font = 'bold 11px sans-serif'; ctx.fillText(extra, W - 8, H - 10); }
}

/* ---------- Physik ---------- */
function fahre(b, dt, s) {
  const th = b.motor ? b.g : 0, vT = th > 0 ? th * V_VOR : th * V_RUECK;
  b.v += (vT - b.v) * (th ? .8 : .45) * dt;
  /* Außenborder lenkt mit Fahrt und mit Schub, rückwärts umgekehrt; Radeffekt rückwärts dreht den Bug nach Steuerbord */
  let om = (b.r || 0) * (.55 * b.v / V_VOR + .45 * th) + (th < 0 ? .22 * -th : 0);
  /* Wind: bei wenig Fahrt fällt der Bug nach Lee ab */
  const lee = s.wind.from + 180, langsam = 1 - Math.min(1, Math.abs(b.v) / V_VOR);
  om += s.wind.s * .15 * Math.sin(dw(lee, b.k) * RAD) * langsam;
  b.om += (om - b.om) * Math.min(1, 3 * dt); b.k = n360(b.k + b.om / RAD * dt);
  const dr = s.wind.s * 11 * (1 - .5 * (1 - langsam));
  b.dx += (Math.sin(lee * RAD) * dr - b.dx) * .7 * dt; b.dy += (-Math.cos(lee * RAD) * dr - b.dy) * .7 * dt;
  b.x += Math.sin(b.k * RAD) * b.v * dt + b.dx * dt; b.y += -Math.cos(b.k * RAD) * b.v * dt + b.dy * dt;
}

/* ---------- Steuerfeld (ein Finger): hoch/runter Gas mit Raste in der Mitte, seitlich Pinne/Ruder ---------- */
function steuerfeld(el, b, onGang) {
  const DZ = .12; let kx = 0, ky = 0, start = null, lastTap = 0;
  const knob = el.querySelector('.mk');
  const zeig = () => { const w = el.clientWidth, h = el.clientHeight; knob.style.left = (w / 2 + kx * (w / 2 - 24)) + 'px'; knob.style.top = (h / 2 - ky * (h / 2 - 26)) + 'px'; };
  const setze = () => {
    const g = Math.abs(ky) < DZ ? 0 : Math.sign(ky) * (Math.abs(ky) - DZ) / (1 - DZ), war = b.g;
    b.g = Math.round(g * 20) / 20; b.r = steuer() === 'pinne' ? -kx : kx; b.p = kx;
    if ((war === 0) !== (b.g === 0) || Math.sign(war) !== Math.sign(b.g)) onGang(war, b.g);
    if (b.motor) AUD.loop('motorLauf', .18 + Math.abs(b.g) * .3);
    zeig();
  };
  el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); start = {x: e.clientX, y: e.clientY, kx, ky};
    const now = performance.now(); if (now - lastTap < 320) { kx = 0; setze(); start.kx = 0; } lastTap = now; });
  el.addEventListener('pointermove', e => { if (!start) return; const w = el.clientWidth, h = el.clientHeight;
    kx = clamp(start.kx + (e.clientX - start.x) / (w / 2 - 24), -1, 1); ky = clamp(start.ky - (e.clientY - start.y) / (h / 2 - 26), -1, 1); setze(); });
  const los = () => { start = null; };
  el.addEventListener('pointerup', los); el.addEventListener('pointercancel', los);
  zeig();
  return {setze: (gx, px) => { ky = gx; kx = px; setze(); }};
}

/* ---------- Übersicht: alle Manöver ---------- */
MN.spiel = function () {
  if (BONUS && BONUS.key === 'man') return MN.fahren('anlegen');
  returnTo = returnTo || 'cabin';
  const m = M_();
  gameShell('Manöver', `${CSS}<p class="small muted" style="margin:6px 2px 10px">Die Manöver der praktischen Prüfung mit Motor. Erst „So geht's“ ansehen, dann selbst fahren. Für jedes Manöver hast du zwei Versuche, wie in der Prüfung.</p>
    <div class="mgrid">${LISTE.map(id => { const d = D[id], x = m[id] || {}; return `<button data-m="${id}"><b>${x.ok ? '✓ ' : ''}${esc(d.name)}</b><span class="small muted">${esc(d.art)}</span></button>`; }).join('')}</div>
    <div class="mbar"><span class="small">Steuerung:</span><button class="btn small ghost" id="msteuer">${steuer() === 'pinne' ? '🛶 Pinne (Außenborder)' : '☸ Steuerrad'}</button></div>
    <p class="small muted" style="margin:4px 2px">In der Prüfung fährt man meist ein Motorboot mit Steuerrad und Einhebelschaltung, manche Schulen prüfen mit Außenborder und Pinne. Hier kannst du beides üben.</p>`);
  $('#gback').onclick = () => { stopGames(); setTab(returnTo); };
  app.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { AUD.click(); MN.vorher(b.dataset.m); });
  $('#msteuer').onclick = () => { S.cfg.steuer = steuer() === 'pinne' ? 'rad' : 'pinne'; save(); AUD.click(); MN.spiel(); };
};
/* Vor dem Manöver: Ziel, worauf der Prüfer achtet, So geht's oder selbst fahren */
MN.vorher = function (id) {
  const d = D[id], x = M_()[id] || {};
  gameShell(d.name, `${CSS}<div class="card"><p class="small muted" style="margin:0">${esc(d.art)}</p><p style="margin:6px 0 8px">${esc(d.ziel)}</p>
    <p class="small" style="margin:0 0 4px"><b>Darauf achtet der Prüfer:</b></p><ul class="small mpruef" style="margin:0;padding-left:18px">${d.pruefer.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
    <div class="row" style="margin-top:10px"><button class="btn ${x.seen ? 'ghost' : 'lamp'}" id="mdemo">📺 So geht's</button><button class="btn ${x.seen ? 'lamp' : 'ghost'}" id="mlos">Selbst fahren</button></div>`);
  $('#gback').onclick = () => MN.spiel();
  $('#mdemo').onclick = () => { AUD.click(); MN.demo(id); };
  $('#mlos').onclick = () => { AUD.click(); MN.fahren(id); };
};

/* ---------- Selbst fahren ---------- */
MN.fahren = function (id, versuch = 1) {
  const d = D[id], bonus = !!(BONUS && BONUS.key === 'man');
  gameShell(d.name, `${CSS}<div class="gamewrap mwrap"><canvas id="gc"></canvas>
    <div class="mpad" id="mpad"><div class="mv"></div><div class="ml"></div><b style="top:6px;left:0;right:0;text-align:center">voraus</b><b style="top:50%;left:6px;margin-top:-16px">N</b><b style="bottom:6px;left:0;right:0;text-align:center">zurück</b><b style="top:50%;left:8px;margin-top:4px">◀</b><b style="top:50%;right:8px;margin-top:4px">▶</b><i class="mk"></i></div>
    <button class="motorbtn" id="motbtn" aria-pressed="false">Motor<br>starten</button><div class="gameover hidden" id="gover"></div></div>
    <div class="mcmd" id="mcmd" aria-live="polite"></div>
    <div class="mbar">${bonus ? '' : '<button class="btn small ghost" id="mdemo">📺 So geht\'s</button>'}<span class="small muted">${steuer() === 'pinne' ? 'Pinne: Feld nach rechts, Bug dreht nach links (voraus).' : 'Steuerrad: Feld nach rechts, Bug dreht nach rechts (voraus).'} Doppeltipp: mittschiffs.</span></div>`);
  if (bonus) $('#gback').onclick = () => { VOX.stop(); bonusEnde(0); }; else $('#gback').onclick = () => { stopGames(); VOX.stop(); MN.vorher(id); };
  const db = $('#mdemo'); if (db) db.onclick = () => { stopGames(); MN.demo(id); };
  const c = $('#gc'), wrap = c.parentElement, dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = Math.min(520, wrap.clientWidth), H = Math.max(330, Math.min(520, Math.round(window.innerHeight * .52)));
  c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px'; const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
  const wind = {from: id === 'kompass' ? Math.random() * 360 : [0, 30, 330, 60, 300][Math.random() * 5 | 0], s: bonus ? .35 : .3 + Math.random() * .45};
  const s = szene(id, W, H, wind), G = {id, d, s, W, H, t: 0, fehler: 0, bumps: 0, ask: {}, fender: id === 'ablegen', msg: '', msgT: 0, ende: false, bonus, versuch};
  const b = G.b = {x: W * .5, y: H * .9, k: 0, v: 0, om: 0, dx: 0, dy: 0, g: 0, r: 0, motor: false};
  const st = {ablegen: [46, .62 * H, 0, 0, false], anlegen: [W * .6, H * .92, .25, 15, true], mob: [W * .5, H * .66, .5, 30, true], kompass: [W * .3, H * .85, .45, 27, true], aufstoppen: [W * .45, H * .93, .5, 30, true], wenden: [W * .5, H * .56, 0, 0, false]}[id];
  Object.assign(b, {x: st[0], y: st[1], g: st[2], v: st[3], motor: st[4]});
  if (id === 'kompass') { G.kurs = d.kurse[Math.random() * d.kurse.length | 0]; G.halt = 0; }
  const say = (t, ms = 2200) => { G.msg = t; G.msgT = performance.now() + ms; };
  /* Motor */
  const mb = $('#motbtn');
  const motorZeigen = () => { mb.setAttribute('aria-pressed', String(b.motor)); mb.innerHTML = b.motor ? 'Motor<br>aus' : 'Motor<br>starten'; };
  if (b.motor) { AUD.loop('motorLauf', .18 + b.g * .3); motorZeigen(); }
  mb.onclick = () => {
    if (G.pause) return;
    if (!b.motor) { if (b.g !== 0) { say('Erst auf Neutral, dann starten'); AUD.click(); return; } b.motor = true; AUD.sfx('motorStart', {vol: .45}); setTimeout(() => { if (b.motor && !G.ende) AUD.loop('motorLauf', .18); }, 900); say('Motor läuft. Kühlwasserstrahl kommt.'); }
    else { b.motor = false; AUD.loop('motorLauf', 0); say('Motor aus'); AUD.click(); }
    motorZeigen();
  };
  const pad = steuerfeld($('#mpad'), b, (war, g) => { AUD.click(); if (!b.motor && g) say('Der Motor läuft noch nicht'); else if (b.motor) say(!g ? 'Neutral' : g > 0 ? 'Vorwärtsgang eingelegt' : 'Rückwärtsgang eingelegt', 1400); if (G.id === 'wenden' && g < 0 && !G.ask.rueck && b.motor) G.frage('rueck'); });
  pad.setze(b.g ? b.g * .88 + .12 : 0, 0);
  /* Kommando-Abfrage unter dem Fahrbild: das Boot fährt in Zeitlupe weiter, vier Antworten */
  const ruhe = () => { const box = $('#mcmd'); if (!box) return; box.classList.remove('an'); box.innerHTML = '<p class="ruhe">📣 Hier erscheinen die Kommandos, wenn es so weit ist. Solange du wählst, läuft alles in Zeitlupe.</p>'; };
  ruhe();
  G.frage = key => {
    if (G.ask[key]) return; G.ask[key] = true; const k = d.kommandos[key];
    if (G.bonus || !k) { const f = G.nachFrage; G.nachFrage = null; if (f) f(); return; }
    const rep = x => x.replace(/\{kurs\}/g, fmtK(G.kurs || 0)).replace(/\{falsch\}/g, fmtK((G.kurs || 0) + 180)).replace(/\{peil\}/g, fmtK(G.peil || 0)).replace(/\{p2\}/g, fmtK((G.peil || 0) + 180)).replace(/\{p3\}/g, fmtK((G.peil || 0) + 40)).replace(/\{p4\}/g, fmtK((G.peil || 0) - 40));
    const opts = shuffle([{t: rep(k.richtig), ok: 1}].concat(k.falsch.map(f => ({t: rep(f), ok: 0}))));
    G.offen = true; AUD.sfx('glocke', {vol: .3});
    const box = $('#mcmd'); box.classList.add('an');
    box.innerHTML = `<h3>📣 ${esc(rep(k.frage))}</h3><p class="small muted" style="margin:0 0 6px">Was rufst du?</p><div class="menu">${opts.map((o, i) => `<button class="menuitem" data-c="${i}">${esc(o.t)}</button>`).join('')}</div><div id="mcfb"></div>`;
    box.querySelectorAll('[data-c]').forEach(btn => btn.onclick = () => {
      const o = opts[+btn.dataset.c]; box.querySelectorAll('[data-c]').forEach(x => { x.disabled = true; if (opts[+x.dataset.c].ok) x.classList.add('richtig'); }); if (!o.ok) { btn.classList.add('falsch'); G.fehler++; }
      if (key === 'ring') G.ring = true; if (key === 'start' && id === 'anlegen') G.fender = true; if (key === 'frei') G.fender = false;
      AUD.sfx(o.ok ? 'richtig' : 'falsch', {vol: o.ok ? .4 : .3});
      const weiter = () => { if (G.ende) return; ruhe(); G.offen = false; if (G.nachFrage) { const f = G.nachFrage; G.nachFrage = null; f(); } };
      if (o.ok) { VOX.say(cid('K'), rep(k.richtig), 'fixed'); $('#mcfb').innerHTML = `<p class="small" style="margin:8px 0 0;color:#1e7f4f"><b>Richtig.</b></p>`; setTimeout(weiter, 1100); }
      else { VOX.say('kroeger', rep(k.warum), 'fixed'); $('#mcfb').innerHTML = `<p class="small" style="margin:8px 0 6px"><b style="color:#c2473b">Nicht ganz.</b> ${esc(rep(k.warum))}</p><button class="btn lamp small" id="mcw">Weiter</button>`; $('#mcw').onclick = weiter; }
    });
  };
  /* Ende: Bewertung wie im Praxisprotokoll */
  const ende = (ok, text) => {
    if (G.ende) return; G.ende = true; G.offen = false; ruhe();
    if (G.bonus) return bonusEnde(ok ? 1 : 0);
    stopGames(); VOX.stop();
    const reicht = ok && G.fehler <= 1, x = M_()[id] = M_()[id] || {};
    if (reicht) { x.ok = 1; S.best = S.best || {}; recordScore('man', ((S.best && S.best.man) || 0) + 1); }
    save(); AUD.sfx(reicht ? 'richtig' : 'falsch', {vol: .5});
    const grund = ok && !reicht ? `Gefahren hast du gut, aber ${G.fehler} falsche Kommandos sind zu viel.` : text;
    const o = $('#gover'); o.innerHTML = `<h2 style="margin:0 0 4px">${reicht ? 'Ausreichend ✓' : 'Nicht ausreichend'}</h2><p class="muted" style="margin:0 0 8px">${esc(grund)}${G.fehler && reicht ? ` (${G.fehler} falsches Kommando)` : ''}</p>
      <div class="row">${reicht ? `<button class="btn lamp" id="mnext">Nächstes Manöver</button><button class="btn ghost" id="magain">Nochmal</button>` : versuch < 2 ? `<button class="btn lamp" id="magain2">2. Versuch</button><button class="btn ghost" id="mdemo2">📺 So geht's</button>` : `<button class="btn lamp" id="magain">Von vorn üben</button><button class="btn ghost" id="mdemo2">📺 So geht's</button>`}</div>`;
    o.classList.remove('hidden');
    VOX.say('kroeger', reicht ? 'Ausreichend. Weiter.' : versuch < 2 ? 'Nicht ausreichend. Zweiter Versuch.' : 'Nicht ausreichend. Das üben wir noch mal.', 'fixed');
    const n = $('#mnext'); if (n) n.onclick = () => { const i = (LISTE.indexOf(id) + 1) % LISTE.length; S.best.manIdx = i; save(); MN.vorher(LISTE[i]); };
    const a = $('#magain'); if (a) a.onclick = () => MN.fahren(id, 1);
    const a2 = $('#magain2'); if (a2) a2.onclick = () => MN.fahren(id, 2);
    const d2 = $('#mdemo2'); if (d2) d2.onclick = () => MN.demo(id);
  };
  /* Regeln je Manöver: wann kommt welches Kommando, wann ist es geschafft */
  const dock = s.dock, inDock = () => dock && b.y > dock.y - 6 && b.y < dock.y + dock.h + 6;
  const regeln = {
    ablegen() {
      if (!G.ask.start) return G.frage('start');
      if (b.motor && !G.ask.leinen) return G.frage('leinen');
      if (G.ask.leinen && !G.ask.frei && b.x > 46 + 55) return G.frage('frei');
      if (Math.abs(b.y - s.gate.y) < 16 && Math.abs(b.x - s.gate.x) < 36) ende(true, G.fender ? 'Durchs Fahrwasser, aber die Fender hängen noch draußen.' : 'Sauber abgelegt und ab ins Fahrwasser.');
    },
    anlegen() {
      if (G.t > .3 && !G.ask.start) return G.frage('start');
      if (inDock() && b.x < DOCK_W + 90 && !G.ask.nah) return G.frage('nah');
      if (inDock() && b.x < DOCK_W + 30) {
        const kn = Math.abs(b.v) / KN; if (!G.kontakt) { G.kontakt = true; if (kn > 2.5) return ende(false, 'Viel zu schnell an den Steg. Höchstens Schritttempo!'); }
        if (Math.abs(b.v) < 5 && (Math.abs(dw(b.k, 0)) < 20 || Math.abs(dw(b.k, 180)) < 20)) { if (!G.ask.fest) { G.nachFrage = () => ende(true, 'Langsam, parallel und fest am Steg. Prüfungsreif.'); return G.frage('fest'); } }
      } else G.kontakt = false;
    },
    mob() {
      if (G.t > 1.2 && !G.person) { const a = (b.k + 90) * RAD, h = b.k * RAD; G.person = {x: b.x + Math.sin(a) * 26 - Math.sin(h) * 22, y: b.y - Math.cos(a) * 26 + Math.cos(h) * 22}; AUD.sfx('falsch', {vol: .25}); G.nachFrage = () => G.frage('ring'); return G.frage('start'); }
      if (!G.person) return;
      const dist = Math.hypot(b.x - G.person.x, b.y - G.person.y);
      if (dist > 85) G.scharf = true;  /* gewertet wird erst, wenn das Boot einmal weg war und zurückkommt */
      if (!G.scharf) return;
      if (dist < 80 && G.ask.ring && !G.ask.nah && G.t > 6) return G.frage('nah');
      if (dist < 30 && b.motor && b.g !== 0) return ende(false, 'Die Schraube drehte, als der Mensch am Boot war. Lebensgefahr! Vorher auskuppeln.');
      if (dist < 40 && Math.abs(b.v) > 16) return ende(false, 'Viel zu schnell am Menschen. Langsam anfahren und vorher auskuppeln.');
      if (dist < 40 && Math.abs(b.v) < 8) { const luv = Math.abs(dw(b.k, wind.from)) < 50; ende(true, luv ? 'Gegen den Wind angefahren, ausgekuppelt, gestoppt. Der Mensch ist gerettet.' : 'Gerettet. Noch besser: gegen den Wind anfahren, dann treibt das Boot nicht auf den Menschen.'); }
    },
    kompass() {
      if (G.t > .4 && !G.ask.start) return G.frage('start');
      if (!G.ask.start) return;
      const err = Math.abs(dw(b.k, G.kurs)), fahrt = b.v > 15;
      if (!G.ask.liegt) { G.halt = err < 5 && fahrt ? G.halt + G.dt : 0; if (G.halt > 2.5) { G.halt = 0; return G.frage('liegt'); } return; }
      if (err > 9 && !G.weg) { G.weg = true; G.fehler++; say(`Kurs verloren: ${Math.round(err)} Grad daneben`); }
      if (err < 5) G.weg = false;
      G.halt = err < 5 && fahrt ? G.halt + G.dt : G.halt;
      if (G.halt > 8 && !G.ask.peil) { const t = s.tonne; G.peil = n360(Math.atan2(t.x - b.x, -(t.y - b.y)) / RAD); G.nachFrage = () => ende(true, `Kurs ${fmtK(G.kurs)} angelegt, gehalten und gepeilt.`); return G.frage('peil'); }
    },
    aufstoppen() {
      if (G.t > .4 && !G.ask.start) return G.frage('start');
      const t = s.tonne;
      if (b.y - t.y < 140 && !G.ask.vor) return G.frage('vor');
      if (b.y < t.y - 70) return ende(false, 'Über die Tonne hinausgeschossen. Früher und kräftiger rückwärts.');
      if (G.t > 2.5 && Math.abs(b.v) < 4 && b.motor) {
        const ab = Math.abs(dw(b.k, 0));
        if (ab > 12) return ende(false, `Der Bug ist ${Math.round(ab)} Grad weggedreht. Den Radeffekt mit dem Ruder ausgleichen!`);
        if (Math.abs(b.y - t.y) < 32) return ende(true, 'Auf Höhe der Tonne gestoppt, Kurs gehalten. Kursgerecht aufgestoppt.');
        if (b.y > t.y) return ende(false, 'Zu früh gestoppt. Die Tonne ist noch ein Stück voraus.');
      }
    },
    wenden() {
      if (G.t > .3 && !G.ask.start) return G.frage('start');
      const x = s.box; if (b.x < x.x || b.x > x.x + x.w || b.y < x.y || b.y > x.y + x.h) return ende(false, 'Aus dem Raum gefahren. Kurz vor, Ruder umlegen, kurz zurück, wieder umlegen.');
      if (G.t > 3 && Math.abs(dw(b.k, 180)) < 18 && Math.abs(b.v) < 8) ende(true, 'Um 180 Grad gedreht, ohne den Raum zu verlassen.');
    }
  };
  /* Schleife */
  const t0 = performance.now(); G.last = t0;
  const step = now => {
    if (!c.isConnected) return;
    const dt = Math.min(.05, (now - G.last) / 1000); G.last = now; G.dt = dt;
    if (!G.pause && !G.ende) {
      const dt = G.offen ? G.dt * .2 : G.dt;  /* Zeitlupe, solange ein Kommando gewählt wird */
      G.t += dt; fahre(b, dt, s);
      if (id === 'ablegen' && !G.ask.leinen) Object.assign(b, {x: st[0], y: st[1], k: 0, v: 0, om: 0, dx: 0, dy: 0});  /* Leinen sind noch fest */
      /* Die Person treibt langsam nach Lee, bleibt aber im Bild */
      if (G.person) { const lee = (wind.from + 180) * RAD; G.person.x = clamp(G.person.x + Math.sin(lee) * wind.s * 2.2 * dt, 50, W - 50); G.person.y = clamp(G.person.y - Math.cos(lee) * wind.s * 2.2 * dt, 50, H - 70); }
      /* Ränder und Steg */
      if (s.wrap) { b.x = (b.x + W) % W; b.y = (b.y + H) % H; }
      else if (b.x < 16 || b.x > W - 16 || b.y < 16 || b.y > H - 16) { const kn = Math.abs(b.v) / KN; b.v *= -.3; b.x = clamp(b.x, 16, W - 16); b.y = clamp(b.y, 16, H - 16); if (kn > 1.2) { G.bumps++; AUD.crash(); say('Autsch, die Kante!'); if (G.bumps >= 3) ende(false, 'Dreimal angeeckt. Ruhig und langsam, dann klappt es.'); } }
      if (dock && inDock() && b.x < DOCK_W + 15) { const kn = Math.abs(b.v) / KN; b.x = DOCK_W + 15; b.dx = Math.max(0, b.dx); if (kn > 1.5 && G.id === 'ablegen') { G.bumps++; G.fehler++; AUD.crash(); say('Das Boot hat den Steg gerammt!'); } }
      if (bonusZeit(t0)) ende(false, 'Die Zeit ist um.');
      if (!G.ende && !G.offen) regeln[id]();
    }
    zeichneSzene(ctx, s, now - t0, {person: G.person, ring: G.ring});
    /* Beim Peilen: gestrichelte Peillinie vom Boot zur Tonne, damit klar ist, was gepeilt wird */
    if (G.ask.peil && s.tonne) { ctx.save(); ctx.strokeStyle = 'rgba(255,251,240,.85)'; ctx.setLineDash([6, 5]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(s.tonne.x, s.tonne.y); ctx.stroke(); ctx.restore(); }
    zeichneBoot(ctx, b, now - t0, G.fender);
    if (id === 'kompass') zeichneKompass(ctx, W, b.k, G.ask.start ? G.kurs : null);
    anzeigen(ctx, s, b, G.bonus ? '' : `${versuch}. Versuch${G.fehler ? ' · Fehler ' + G.fehler : ''}`);
    if (G.msg && now < G.msgT) { ctx.fillStyle = 'rgba(20,30,40,.78)'; ctx.fillRect(10, H - 56, W - 180, 24); ctx.fillStyle = '#fffaf0'; ctx.font = '13px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(G.msg, 10 + (W - 180) / 2, H - 39); }
    if (!G.ende) gameLoop = requestAnimationFrame(step);
  };
  gameLoop = requestAnimationFrame(step);
};

/* ---------- Vorführung „So geht's“: Schlüsselbilder weich verbunden, Crew erklärt ---------- */
function bahn(demo) {
  const keys = ['x', 'y', 'h', 'g', 'r', 'motor', 'mob'], spur = {};
  keys.forEach(k => { spur[k] = demo.filter(e => e[k] != null).map(e => ({t: e.t, v: e[k]})); });
  const wert = (k, t, stufe) => { const a = spur[k]; if (!a.length) return 0; if (t < a[0].t) return stufe ? 0 : a[0].v; for (let i = 1; i < a.length; i++) if (t < a[i].t) { if (stufe) return a[i - 1].v; const f = (t - a[i - 1].t) / (a[i].t - a[i - 1].t); return k === 'h' ? a[i - 1].v + dw(a[i].v, a[i - 1].v) * f : lerp(a[i - 1].v, a[i].v, f); } return a[a.length - 1].v; };
  /* Ort weich (Catmull-Rom über die Schlüsselbilder mit x und y) */
  const pts = demo.filter(e => e.x != null);
  const ort = (t, W, H) => {
    if (t <= pts[0].t) return {x: P(pts[0].x, W), y: P(pts[0].y, H)};
    let i = pts.findIndex(p => p.t > t); if (i < 0) { const l = pts[pts.length - 1]; return {x: P(l.x, W), y: P(l.y, H)}; }
    const p1 = pts[i - 1], p2 = pts[i], p0 = pts[i - 2] || p1, p3 = pts[i + 1] || p2, f = (t - p1.t) / (p2.t - p1.t);
    const cr = (a, b2, c2, d2) => .5 * (2 * b2 + (c2 - a) * f + (2 * a - 5 * b2 + 4 * c2 - d2) * f * f + (3 * b2 - a - 3 * c2 + d2) * f * f * f);
    return {x: cr(P(p0.x, W), P(p1.x, W), P(p2.x, W), P(p3.x, W)), y: cr(P(p0.y, H), P(p1.y, H), P(p2.y, H), P(p3.y, H))};
  };
  return {wert, ort, ende: demo[demo.length - 1].t};
}
MN.demo = function (id, ab) {
  const d = D[id], x = M_()[id] = M_()[id] || {}; x.seen = 1; save();
  const schritte = d.demo.filter(e => e.sag);
  gameShell(d.name, `${CSS}<div class="gamewrap mwrap"><canvas id="gc"></canvas></div>
    <div class="mbar"><b class="small">📺 So geht's</b><button class="btn small ghost" id="dneu" aria-label="Von vorn">⏮</button><button class="btn small" id="dplay">⏸ Pause</button><button class="btn small lamp" id="dlos">Selbst fahren</button></div>
    <ol class="small msteps" id="dst">${schritte.map(e => `<li><b>${e.wer === 'H' ? 'Prüfer' : esc(nameOf(e.wer))}:</b> ${esc(sagT(e.sag))}</li>`).join('')}</ol>`);
  $('#gback').onclick = () => { stopGames(); VOX.stop(); MN.vorher(id); };
  const c = $('#gc'), wrap = c.parentElement, dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = Math.min(520, wrap.clientWidth), H = Math.min(560, Math.round(window.innerHeight * .62));
  c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px'; const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
  const s = szene(id, W, H, {from: 0, s: .5}), B = bahn(d.demo), lis = [...app.querySelectorAll('#dst li')];
  /* Person beim Mensch-über-Bord, Tonne beim Peilen passend zur Vorführung */
  const pers = d.person ? {x: P(d.person.x, W) + d.person.dx, y: P(d.person.y, H)} : null;
  if (id === 'kompass') { const e = d.demo.find(q => q.cmd && /peilt/.test(q.cmd)), o = B.ort(e.t, W, H); s.tonne = {x: o.x + Math.sin(d.demoPeil * RAD) * 150, y: o.y - Math.cos(d.demoPeil * RAD) * 150}; }
  const ringT = (d.demo.find(e => e.cmd && /Rettungsring/.test(e.cmd)) || {}).t;
  let t = ab || 0, play = !ab, last = performance.now(), gesagt = ab ? d.demo.filter(e => e.t <= ab).length - 1 : -1, cmd = null;
  const pb = $('#dplay'), knopf = () => { pb.textContent = play ? '⏸ Pause' : t >= B.ende ? '▶ Nochmal' : '▶ Weiter'; };
  pb.onclick = () => { AUD.click(); if (t >= B.ende) { t = 0; gesagt = -1; } play = !play; if (!play) VOX.stop(); last = performance.now(); knopf(); };
  $('#dneu').onclick = () => { AUD.click(); VOX.stop(); t = 0; gesagt = -1; play = true; last = performance.now(); knopf(); };
  $('#dlos').onclick = () => { stopGames(); VOX.stop(); MN.fahren(id); };
  lis.forEach((li, i) => li.onclick = () => { VOX.stop(); t = schritte[i].t; gesagt = d.demo.indexOf(schritte[i]) - 1; play = true; last = performance.now(); knopf(); });
  const step = now => {
    if (!c.isConnected) { VOX.stop(); return; }
    if (play) { t += Math.min(.05, (now - last) / 1000); if (t >= B.ende) { t = B.ende; play = false; knopf(); } }
    last = now;
    /* Sätze sprechen, wenn die Zeit an einem Schlüsselbild vorbeiläuft */
    d.demo.forEach((e, i) => { if (i > gesagt && e.t <= t && play) { gesagt = i; const l = []; if (e.cmd) { l.push({cid: cid('K'), t: e.cmd}); cmd = {t: e.t, x: e.cmd}; } if (e.sag) l.push({cid: wer(e.wer), t: sagT(e.sag)}); if (l.length) VOX.lines(l, 'fixed'); } });
    const cur = schritte.filter(e => e.t <= t + .01).length - 1; lis.forEach((li, i) => li.classList.toggle('an', i === cur));
    const o = B.ort(t, W, H), b = {x: o.x, y: o.y, k: n360(B.wert('h', t)), g: B.wert('g', t), r: B.wert('r', t), motor: !!B.wert('motor', t, true), v: 0};
    const vor = B.ort(Math.min(B.ende, t + .2), W, H); b.v = Math.hypot(vor.x - o.x, vor.y - o.y) * 5 * (b.g < 0 ? -1 : 1);
    zeichneSzene(ctx, s, t * 1000, {person: pers && B.wert('mob', t, true) ? pers : null, ring: ringT != null && t >= ringT + .6});
    zeichneBoot(ctx, b, t * 1000, id === 'anlegen' ? t > 1 : id === 'ablegen' ? t < 18.4 : false);
    if (id === 'kompass') zeichneKompass(ctx, W, b.k, t > 2.4 ? 60 : null);
    anzeigen(ctx, s, b, '');
    /* Steuerfeld klein mitzeigen: so bewegt der Finger Gas und Pinne */
    const px = W - 46, py = H - 56, kx = steuer() === 'pinne' ? -b.r : b.r, ky = b.g ? Math.sign(b.g) * (.12 + .88 * Math.abs(b.g)) : 0;
    ctx.fillStyle = 'rgba(20,30,40,.55)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(px - 38, py - 46, 76, 92, 12) : ctx.rect(px - 38, py - 46, 76, 92); ctx.fill();
    ctx.strokeStyle = 'rgba(255,250,240,.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px - 30, py - 4); ctx.lineTo(px + 30, py - 4); ctx.stroke();
    ctx.fillStyle = '#f0b53e'; ctx.strokeStyle = '#fffaf0'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(px + kx * 24, py - 4 - ky * 28, 9, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fffaf0'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(b.motor ? 'Motor läuft' : 'Motor aus', px, py + 40);
    if (cmd && t - cmd.t < 3 && t >= cmd.t) { ctx.font = 'bold 14px sans-serif'; const w = Math.min(W - 20, ctx.measureText('📣 ' + cmd.x).width + 20); ctx.fillStyle = 'rgba(255,251,240,.95)'; ctx.fillRect((W - w) / 2, H * .5 - 70, w, 30); ctx.fillStyle = '#9b2f24'; ctx.fillText('📣 ' + cmd.x, W / 2, H * .5 - 50); }
    gameLoop = requestAnimationFrame(step);
  };
  knopf(); gameLoop = requestAnimationFrame(step);
};
})();

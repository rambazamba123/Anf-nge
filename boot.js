/* ==========================================================================
   Skipper – „Unser Boot“ (v5.30, O169; v5.72 Baukasten: docs/baukasten.md)
   Eine Datei für alle Ansichten der Frieda. Wer das Boot ändern will, ändert nur diese Datei; alle Bühnen holen es von hier.
   v5.72 (Nutzer 20.11.2026: „wenn es vom Nutzer die Farbe gewechselt bekommt, wird das überall übernommen … Upgrades in allen Animationen sichtbar“):
   - Farben laufen über CSS-Variablen (--frieda-rumpf, --frieda-streifen, --frieda-unterwasser, --frieda-dach); die Werft setzt sie auf <html>.
   - Ausbau (Upgrades) hängt an <html data-up="steuerrad laternen …">; jede Ansicht zeichnet jedes Teil, CSS zeigt nur, was eingebaut ist.
   - Der Name am Heck kommt aus S.cfg.look.name (Standard FRIEDA) und wird beim Zeichnen eingesetzt.
   - Mit o.farbe (fremde Boote oder Abendlicht) werden die Farben fest eingesetzt; fremde Boote (o.farbe.rumpf) zeigen keinen Ausbau.
   Ansichten: BOOT.seite(o) (Bug rechts, Wasserlinie y 0, 160 lang), BOOT.oben(o) (Bug oben, 100 lang, 40 breit), BOOT.heck(o) (von achtern, Backbord links,
   Wasserlinie y ≈ 0, 124 breit), BOOT.d34(o) (schräg von achtern, Bug links). o = {antrieb, lichter, nacht, bugLinks, farbe, hs,
   hinter/vor (seite: Crew hinter dem Schanzkleid bzw. davor, in Bug-rechts-Koordinaten, wird mitgespiegelt), mitte/vor (heck: zwischen Kajüte und Spiegel), vor (d34)}
   ========================================================================== */
(() => {
const F = {rumpf: '#fbf8f2', strich: '#5f5446', streifen: '#c0392b', unterwasser: '#1f3b63', dach: '#cfd6db', fenster: '#7fa7c2', deck: '#e9dfcb', motor: '#3b3f44', holz: '#b9874f', fender: '#f5f1e6', schrift: '#1f3b63'};
const L = {r: '#ff4a3d', g: '#3ddc6a', w: '#fff7d6'};
/* Ausbau (SK12: Belohnung fürs Lernen; Farbe und Name jederzeit) */
const UPS = {
  steuerrad: {name: 'Steuerrad statt Pinne', wann: 'nach Tag 3'},
  laternen: {name: 'Laternen', wann: 'nach Tag 5'},
  wimpel: {name: 'Skipperwimpel', wann: 'nach Tag 7'},
  flagge: {name: 'Heckflagge', wann: 'jederzeit'},
  rettungsring: {name: 'Rettungsring', wann: 'jederzeit'},
  bimini: {name: 'Sonnendach', wann: 'jederzeit'},
  radar: {name: 'Radar', wann: 'jederzeit'}
};
const FARBEN = {
  klassisch: {name: 'Klassisch', rumpf: '#fbf8f2', streifen: '#c0392b', unterwasser: '#1f3b63', dach: '#cfd6db', schrift: '#1f3b63'},
  nordsee: {name: 'Nordsee', rumpf: '#28405e', streifen: '#f3efe6', unterwasser: '#7a2b25', dach: '#e9e4d8', schrift: '#f3efe6'},
  kutter: {name: 'Kutter', rumpf: '#a8372c', streifen: '#f1d36b', unterwasser: '#24282c', dach: '#ece4d2', schrift: '#f7efd8'},
  elbe: {name: 'Elbgrün', rumpf: '#3f6b55', streifen: '#f3efe6', unterwasser: '#2a2a2a', dach: '#d9d2bd', schrift: '#f3efe6'},
  senf: {name: 'Senf', rumpf: '#e2b23c', streifen: '#2f4f80', unterwasser: '#1f3b63', dach: '#f3efe6', schrift: '#1f3b63'},
  himmel: {name: 'Himmelblau', rumpf: '#8fc1dc', streifen: '#ffffff', unterwasser: '#c0392b', dach: '#f6f3ea', schrift: '#1f3b63'}
};
const licht = (x, y, c, r = 3.4) => `<circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="${c}" opacity=".25"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;

/* ---------- CSS einmal pro Dokument ---------- */
function css() {
  if (document.getElementById('bootcss')) return;
  const s = document.createElement('style'); s.id = 'bootcss';
  const t = ['rumpf', 'streifen', 'unterwasser', 'dach', 'fenster', 'deck', 'motor', 'holz', 'fender', 'schrift'];
  s.textContent = t.map(k => `.fr .fr-${k}{fill:var(--frieda-${k},${F[k]})}.fr .frs-${k}{stroke:var(--frieda-${k},${F[k]})}`).join('') +
    `.fr .bl{stroke:var(--frieda-strich,${F.strich});stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round}.fr .bd{fill:none;stroke:var(--frieda-strich,${F.strich});stroke-width:.9;opacity:.7;stroke-linecap:round}
    .fr .bsch{fill:#1a1208;opacity:.14}.fr .bhl{fill:#fff;opacity:.28}
    :root[data-stil="kreide"] .fr .bl{stroke-width:2.3;stroke:#3a2e24}:root[data-stil="aquarell"] .fr .bl{stroke:none}:root[data-stil="aquarell"] .fr .bd{opacity:.3}
    .fr .up{display:none}` +
    Object.keys(UPS).map(u => `:root[data-up~="${u}"] .fr .up-${u}{display:inline}:root[data-up~="${u}"] .fr .ohne-${u}{display:none}`).join('') +
    /* Bühnen dürfen dieselben Schalter für Dinge außerhalb des Boots nutzen (z. B. Hinnerk am Rad statt an der Pinne) */
    `.nur-up{display:none}` + Object.keys(UPS).map(u => `:root[data-up~="${u}"] .nur-${u}{display:inline}:root[data-up~="${u}"] .nicht-${u}{display:none}`).join('');
  document.head.appendChild(s);
}
css();

/* ---------- Helfer ---------- */
function ctx(o) {
  const c = {...F, ...(o.farbe || {})}, fest = !!o.farbe, fremd = !!(o.farbe && o.farbe.rumpf) && !o.eigen;   /* o.eigen: die Frieda in anderem Licht (z. B. Abend), Ausbau und Name bleiben */
  /* Füllung: fest eingesetzt (o.farbe) oder über die Variable */
  const f = (teil, extra = '') => fest && o.farbe[teil] ? `fill="${c[teil]}"${extra ? ` class="${extra}"` : ''}` : `class="fr-${teil}${extra ? ' ' + extra : ''}"`;
  const st = (teil, w, extra = '') => fest && o.farbe[teil] ? `stroke="${c[teil]}" stroke-width="${w}" fill="none"${extra ? ` class="${extra}"` : ''}` : `class="frs-${teil}${extra ? ' ' + extra : ''}" stroke-width="${w}" fill="none"`;
  return {c, f, st, fremd};
}
function name() { try { const n = (window.S && ((S.boat && S.boat.name) || (S.cfg && S.cfg.look && S.cfg.look.name))) || '';   /* ein Name für alle: S.boat.name (Einstellungen, Werft) */ return String(n || 'FRIEDA').toUpperCase().replace(/[^A-ZÄÖÜ0-9 \-]/g, '').slice(0, 12) || 'FRIEDA'; } catch (e) { return 'FRIEDA'; } }
const up = (u, inner, fremd) => fremd ? '' : `<g class="up up-${u}">${inner}</g>`;
const ohne = (u, inner, fremd) => fremd ? inner : `<g class="ohne-${u}">${inner}</g>`;
const wrap = (o, cls, inner) => `<g class="fr ${cls}">${o.nacht ? `<g opacity=".3">${inner}</g>` : inner}</g>`;

/* ---------- von oben, Bug nach oben ---------- */
const RUMPF_OBEN = 'M0 -50 C17 -36 20 -6 19 22 L18 46 Q18 50 14 50 L-14 50 Q-18 50 -18 46 L-19 22 C-20 -6 -17 -36 0 -50Z';
function oben(o = {}) {
  const {f, st, fremd} = ctx(o), ein = o.antrieb === 'einbau';
  /* Höhenschichten für die Filmbühne: o.hs(h, inner) legt eine Schicht in Höhe h (0 Wasser … 1 Mastspitze) */
  const H = o.hs || ((h, inner) => inner);
  const kab = 'M-11 -4 H11 V20 H-11Z';
  let s = H(0, `<path d="${RUMPF_OBEN}" ${f('unterwasser')}/>`);
  if (o.hs) s += [.07, .14, .21].map((h, i) => H(h, `<path d="${RUMPF_OBEN}" ${f('rumpf')}/><path d="${RUMPF_OBEN}" class="bsch" style="opacity:${.26 - i * .05}"/>`)).join('');
  s += H(.3, ein ? `<path d="M0 50 V56" stroke="#5f5446" stroke-width="2"/><rect x="-1.5" y="54" width="3" height="9" fill="#888"/>` : `<rect x="-6" y="48" width="12" height="12" rx="3" ${f('motor', 'bl')}/>` + ohne('steuerrad', `<path d="M0 50 L0 36" stroke="#5f5446" stroke-width="2.2" stroke-linecap="round"/>`, fremd));
  s += H(.28, `<path d="${RUMPF_OBEN}" ${f('rumpf', 'bl')}/><path d="M0 -46 C14 -33 16.5 -6 15.5 22 L15 45 M0 -46 C-14 -33 -16.5 -6 -15.5 22 L-15 45" ${st('streifen', 2.2)}/>
    <path d="M0 -42 C10 -32 12 -14 12 -6 L-12 -6 C-12 -14 -10 -32 0 -42Z" ${f('deck', 'bl')}/><path d="M-6 -34 L6 -34 M-8 -26 L8 -26 M-9 -18 L9 -18" class="bd"/>
    <rect x="-13" y="22" width="26" height="22" rx="3" ${f('deck', 'bl')}/><path d="M-11 26 H11 M-11 30 H11 M-11 34 H11 M-11 38 H11" class="bd" style="opacity:.35"/>
    ${[-24, 40].map(y => `<circle cx="-14" cy="${y}" r="1.8" fill="#5f5446"/><circle cx="14" cy="${y}" r="1.8" fill="#5f5446"/>`).join('')}
    ${[-10, 14].map(y => `<ellipse cx="-20.5" cy="${y}" rx="3" ry="5" ${f('fender', 'bl')} style="stroke-width:.6"/><ellipse cx="20.5" cy="${y}" rx="3" ry="5" ${f('fender', 'bl')} style="stroke-width:.6"/>`).join('')}
    ${up('rettungsring', `<circle cx="-8" cy="44" r="4.4" fill="none" stroke="#e8642c" stroke-width="2.4"/><circle cx="-8" cy="44" r="4.4" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="3.4 3.5"/>`, fremd)}
    ${up('steuerrad', `<rect x="4" y="24" width="8" height="7" rx="1.5" ${f('holz', 'bl')}/><circle cx="8" cy="23" r="4" fill="none" stroke="#8a5a32" stroke-width="1.4"/>`, fremd)}
    ${up('flagge', `<path d="M-12 48 L-20 54" stroke="#5f5446" stroke-width="1.2"/><path d="M-20 54 l-6 3 l1 2 l6 -3z" fill="#dd0000"/>`, fremd)}`);
  s += H(.4, `<path d="M-10 -34 Q0 -50 10 -34" stroke="#5f5446" stroke-width="1.2" fill="none"/>`);
  if (o.hs) s += [.36, .44, .52].map(h => H(h, `<path d="${kab}" ${f('rumpf')}/><path d="${kab}" class="bsch" style="opacity:.2"/>`)).join('');
  s += H(.6, `<path d="${kab}" ${f('dach', 'bl')}/><path d="M-8 -1 H8 M-8 3 H8" ${st('fenster', 2)}/><path d="M-9 8 H9 M-9 12 H9" class="bd" style="opacity:.4"/>`);
  s += H(.66, up('bimini', `<path d="M-15 21 H15 V40 H-15Z" fill="#2f6f8f" opacity=".92" class="bl"/><path d="M-15 27 H15 M-15 34 H15" class="bd"/>`, fremd));
  s += H(.7, up('radar', `<circle cx="0" cy="4" r="4.2" fill="#f3f1ea" class="bl"/>`, fremd));
  s += H(.95, up('wimpel', `<path d="M0 14 l7 1.6 l-7 1.6z" fill="#2f4f80"/>`, fremd) + up('laternen', `<circle cx="0" cy="14" r="1.6" fill="${L.w}"/>`, fremd));
  if (o.lichter) s += H(.5, licht(-18, -18, L.r) + licht(18, -18, L.g) + licht(0, 49, L.w, 2.6));
  else s += H(.3, up('laternen', `<rect x="-20" y="-20" width="3" height="4" fill="${L.r}"/><rect x="17" y="-20" width="3" height="4" fill="${L.g}"/>`, fremd));
  return wrap(o, 'boot-oben', s);
}

/* ---------- von der Seite, Bug rechts (mit bugLinks gespiegelt), Wasserlinie y 0 ---------- */
function seite(o = {}) {
  const {f, st, fremd} = ctx(o), ein = o.antrieb === 'einbau', links = !!o.bugLinks;
  const lat = links ? L.r : L.g;   /* wer die Frieda mit dem Bug nach links sieht, sieht ihre Backbordseite */
  const inner = `
  ${up('flagge', `<path d="M-84 -26 L-96 -50" stroke="#5f5446" stroke-width="1.4"/><g transform="translate(-96 -50) rotate(-28)"><path d="M0 0 h-14 v3 h14z" fill="#222"/><path d="M0 3 h-14 v3 h14z" fill="#dd0000"/><path d="M0 6 h-14 v3 h14z" fill="#ffce00"/></g>`, fremd)}
  ${o.hinter || ''}
  <path d="M-80 -6 L66 -6 Q76 -8 82 -24 L80 -26 L-78 -26 L-80 -24Z" ${f('rumpf', 'bl')}/>
  <path d="M-80 -6 L66 -6 Q72 -6 74 -10 L70 6 Q62 12 40 12 L-74 10 L-80 4Z" ${f('unterwasser', 'bl')}/>
  <path d="M-80 -6.5 L67 -6.5" stroke="#fff" stroke-width="1.2" opacity=".7"/>
  <path d="M-79 -14 L78 -14" ${st('streifen', 3.5)}/>
  <path d="M-80 -24 L80 -24" stroke="#8a6a48" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M-78 -22 L60 -22" class="bhl" style="opacity:.25" stroke="#fff" stroke-width="1"/>
  <path d="M-46 -26 L-44 -52 L18 -52 L34 -26Z" ${f('rumpf', 'bl')}/><path d="M-46 -26 L-45.4 -34 L32 -34 L34 -26Z" class="bsch" style="opacity:.08"/>
  <path d="M-44 -52 L18 -52 L20 -56 L-42 -56Z" ${f('dach', 'bl')}/><path d="M-38 -58 H12" stroke="#8a6a48" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M20 -50 L31 -29 L22 -29 L13 -50Z" ${f('fenster')} opacity=".9"/><path d="M19 -47 L23 -40" stroke="#fff" stroke-width="1.2" opacity=".6"/>
  ${[-34, -18, -2].map(x => `<circle cx="${x}" cy="-39" r="4.5" ${f('fenster', 'bl')}/><circle cx="${x}" cy="-39" r="5.8" fill="none" stroke="#8a6a48" stroke-width="1"/><path d="M${x - 2} ${x === -34 ? -41 : -41} l2 -1" stroke="#fff" stroke-width="1" opacity=".7"/>`).join('')}
  <path d="M40 -26 V-36 H78 L80 -26" fill="none" stroke="#5f5446" stroke-width="1.6"/><path d="M60 -26 V-36" stroke="#5f5446" stroke-width="1.2"/>
  <path d="M-78 -26 V-34 H-50" fill="none" stroke="#5f5446" stroke-width="1.4"/>
  <path d="M74 -24 l4 -3 M-70 -24 l-3 -3" stroke="#5f5446" stroke-width="2" stroke-linecap="round"/>
  <path d="M36 -56 V-78" stroke="#5f5446" stroke-width="1.6"/><rect x="34" y="-82" width="4" height="4" fill="#5f5446"/>
  ${ein ? `<path d="M-50 8 L-70 14" stroke="#777" stroke-width="2.5"/><rect x="-76" y="10" width="5" height="12" fill="#999"/><path d="M-80 2 L-86 2 L-86 20 L-80 18Z" fill="#666"/>`
        : `<rect x="-92" y="-34" width="12" height="18" rx="3" ${f('motor', 'bl')}/><path d="M-90 -30 H-82" stroke="#fff" stroke-width="1" opacity=".4"/><rect x="-88" y="-16" width="4" height="26" ${f('motor')}/><rect x="-94" y="8" width="10" height="6" rx="2" ${f('motor')}/>` + ohne('steuerrad', `<path d="M-86 -27 L-62 -33" stroke="#5f5446" stroke-width="2.6" stroke-linecap="round"/>`, fremd)}
  ${up('steuerrad', `<path d="M-66 -26 L-64 -44 L-54 -44 L-52 -26Z" ${f('holz', 'bl')}/><circle cx="-59" cy="-48" r="7" fill="none" stroke="#7a4d2a" stroke-width="2"/>${[0, 45, 90, 135].map(a => `<path d="M-59 -48 l${(7 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(7 * Math.sin(a * Math.PI / 180)).toFixed(1)} M-59 -48 l${(-7 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(-7 * Math.sin(a * Math.PI / 180)).toFixed(1)}" stroke="#7a4d2a" stroke-width="1.1"/>`).join('')}`, fremd)}
  ${up('bimini', `<path d="M-80 -26 L-74 -66 M-48 -26 L-46 -66" stroke="#8a8f93" stroke-width="1.6"/><path d="M-82 -64 Q-62 -74 -42 -64 L-44 -60 Q-62 -68 -80 -60Z" fill="#2f6f8f" class="bl"/>`, fremd)}
  ${up('rettungsring', `<circle cx="50" cy="-33" r="5" fill="none" stroke="#e8642c" stroke-width="2.8"/><circle cx="50" cy="-33" r="5" fill="none" stroke="#fff" stroke-width="2.8" stroke-dasharray="3.9 3.9"/>`, fremd)}
  ${up('radar', `<path d="M-14 -56 V-62" stroke="#5f5446" stroke-width="1.4"/><ellipse cx="-14" cy="-65" rx="7" ry="4.6" fill="#f3f1ea" class="bl"/>`, fremd)}
  ${up('wimpel', `<path d="M36 -81 l14 3 l-14 3z" fill="#2f4f80" class="bl" style="stroke-width:.8"/><circle cx="41" cy="-78" r="1.2" fill="#fff"/>`, fremd)}
  ${o.lichter ? licht(28, -30, lat) + `<path d="M-40 -56 V-74" stroke="#5f5446" stroke-width="2"/>` + licht(36, -80, L.w) + licht(-80, -26, L.w, 2.6)
    : up('laternen', `<rect x="25" y="-33" width="6" height="5" rx="1" fill="${lat}" class="bl" style="stroke-width:.6"/><circle cx="36" cy="-80" r="1.8" fill="${L.w}" class="bl" style="stroke-width:.5"/><rect x="-82" y="-30" width="4" height="4" fill="${L.w}" class="bl" style="stroke-width:.5"/>`, fremd)}
  ${o.vor || ''}`;
  /* der Name wird nicht mitgespiegelt */
  const nm = `<text x="${links ? 30 : -30}" y="-16.6" text-anchor="${links ? 'end' : 'start'}" font-family="Baloo 2,Trebuchet MS,sans-serif" font-weight="800" font-size="7" letter-spacing=".6" ${fremd ? 'fill="#1f3b63"' : 'class="fr-schrift"'}>${fremd ? '' : name()}</text>`;
  return wrap(o, 'boot-seite', `<g${links ? ' transform="scale(-1 1)"' : ''}>${inner}</g>${o.ohneName ? '' : nm}`);
}

/* ---------- von achtern (Backbord links), Wasserlinie y ≈ 0 ---------- */
function heck(o = {}) {
  const {f, st, fremd} = ctx(o);
  const s = `
  <path d="M0 -72 V-92" stroke="#5f5446" stroke-width="1.6"/><rect x="-2" y="-96" width="4" height="4" fill="#5f5446"/>
  ${up('wimpel', `<path d="M0 -95 l12 2.6 l-12 2.6z" fill="#2f4f80"/>`, fremd)}
  ${up('radar', `<path d="M-16 -72 V-77" stroke="#5f5446" stroke-width="1.4"/><ellipse cx="-16" cy="-80" rx="8" ry="4.6" fill="#f3f1ea" class="bl"/>`, fremd)}
  <path d="M-34 -40 L-30 -68 L30 -68 L34 -40Z" ${f('rumpf', 'bl')}/><path d="M-31 -66 L31 -66 L33 -72 L-33 -72Z" ${f('dach', 'bl')}/>
  <rect x="-9" y="-62" width="18" height="22" rx="2" ${f('holz', 'bl')}/><path d="M-6 -58 H6 M-6 -52 H6 M-6 -46 H6" class="bd"/><circle cx="5" cy="-50" r=".9" fill="#5f5446"/>
  ${[-22, 22].map(x => `<rect x="${x - 5}" y="-62" width="10" height="7" rx="2" ${f('fenster', 'bl')}/>`).join('')}
  ${up('bimini', `<path d="M-54 -40 L-50 -82 M54 -40 L50 -82" stroke="#8a8f93" stroke-width="1.8"/><path d="M-58 -80 Q0 -96 58 -80 L56 -75 Q0 -90 -56 -75Z" fill="#2f6f8f" class="bl"/>`, fremd)}
  ${up('steuerrad', `<rect x="22" y="-52" width="12" height="12" rx="2" ${f('holz', 'bl')}/><ellipse cx="28" cy="-56" rx="7" ry="2.4" fill="none" stroke="#7a4d2a" stroke-width="1.8"/>`, fremd)}
  ${o.mitte || ''}
  <path d="M-62 -40 L62 -40 L56 0 Q30 15 0 17 Q-30 15 -56 0 Z" ${f('rumpf', 'bl')}/><path d="M-62 -40 L62 -40 L61.4 -37 L-61.4 -37Z" fill="#8a6a48"/>
  <path d="M-60.5 -30 L60.5 -30 L59.6 -24.5 L-59.6 -24.5Z" ${f('streifen')}/>
  <path d="M-56 0 Q-30 15 0 17 Q30 15 56 0 L54.6 8 Q30 22 0 24 Q-30 22 -54.6 8Z" ${f('unterwasser', 'bl')}/>
  <path d="M-62 -40 L-56 0 Q-40 9 -22 13 L-30 -40Z" class="bsch" style="opacity:.08"/>
  <text x="0" y="-9" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="12" letter-spacing="1" class="fr-schrift">${fremd ? '' : name()}</text>
  <text x="0" y="-1.5" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="800" font-size="5.2" letter-spacing="1.2" class="fr-schrift">${fremd ? '' : 'KUTTERSHAVEN'}</text>
  ${[-50, -36].map(y => `<ellipse cx="64" cy="${y + 22}" rx="5" ry="9" ${f('fender', 'bl')} style="stroke-width:.8"/>`).join('')}
  ${up('rettungsring', `<circle cx="-44" cy="-20" r="7.4" fill="none" stroke="#e8642c" stroke-width="3.6"/><circle cx="-44" cy="-20" r="7.4" fill="none" stroke="#fff" stroke-width="3.6" stroke-dasharray="5.8 5.8"/>`, fremd)}
  ${up('flagge', `<path d="M48 -40 L62 -66" stroke="#5f5446" stroke-width="1.4"/><g transform="translate(62 -66) rotate(14)"><path d="M0 0 h14 v3 h-14z" fill="#222"/><path d="M0 3 h14 v3 h-14z" fill="#dd0000"/><path d="M0 6 h14 v3 h-14z" fill="#ffce00"/></g>`, fremd)}
  <rect x="-10" y="-60" width="20" height="24" rx="5" ${f('motor', 'bl')}/><path d="M-6 -56 H6" stroke="#fff" stroke-width="1" opacity=".4"/><rect x="-3.5" y="-37" width="7" height="44" ${f('motor')}/>
  ${ohne('steuerrad', `<path d="M0 -50 L-14 -44" stroke="#5f5446" stroke-width="2.6" stroke-linecap="round"/>`, fremd)}
  ${o.lichter ? licht(0, -70, L.w, 3) : up('laternen', `<rect x="-2" y="-74" width="4" height="4" fill="${L.w}" class="bl" style="stroke-width:.5"/>`, fremd)}
  ${o.vor || ''}`;
  return wrap(o, 'boot-heck', s);
}

/* ---------- schräg von achtern (für den Orbit), Bug links ---------- */
function d34(o = {}) {
  const {f, st, fremd} = ctx(o);
  const s = `<path d="M12 -56 V-78" stroke="#5f5446" stroke-width="1.6"/>${up('wimpel', `<path d="M12 -77 l12 2.4 l-12 2.4z" fill="#2f4f80"/>`, fremd)}
    <path d="M-84 -22 Q-50 -27 26 -30 L26 -6 Q-30 2 -78 -8 Z" ${f('rumpf', 'bl')}/><path d="M-78 -8 Q-30 2 26 -6 L26 6 Q-20 12 -70 0Z" ${f('unterwasser', 'bl')}/>
    <path d="M-82 -16 Q-40 -19 26 -20" ${st('streifen', 3)}/><path d="M26 -30 L66 -27 L62 -3 Q46 5 26 -6Z" ${f('rumpf', 'bl')}/><path d="M26 -30 L66 -27 L62 -3 Q46 5 26 -6Z" class="bsch" style="opacity:.12"/><path d="M26 -20 L65 -18" ${st('streifen', 3)}/>
    <path d="M26 -6 Q46 5 62 -3 L60 4 Q44 11 26 6Z" ${f('unterwasser', 'bl')}/><path d="M-44 -26 L-42 -52 L10 -54 L22 -28Z" ${f('rumpf', 'bl')}/><path d="M10 -54 L24 -52 L32 -28 L22 -28Z" ${f('rumpf', 'bl')}/><path d="M10 -54 L24 -52 L32 -28 L22 -28Z" class="bsch" style="opacity:.12"/>
    <path d="M-43 -52 L10 -54 L24 -52 L20 -57 L6 -58 L-41 -56Z" ${f('dach', 'bl')}/>${[-30, -14].map(x => `<circle cx="${x}" cy="-40" r="4" ${f('fenster', 'bl')}/>`).join('')}
    ${up('radar', `<ellipse cx="-12" cy="-62" rx="7" ry="4.2" fill="#f3f1ea" class="bl"/>`, fremd)}
    ${up('bimini', `<path d="M24 -28 L28 -66 M60 -26 L58 -64" stroke="#8a8f93" stroke-width="1.6"/><path d="M20 -64 Q42 -74 64 -62 L62 -58 Q42 -68 22 -60Z" fill="#2f6f8f" class="bl"/>`, fremd)}
    ${up('rettungsring', `<circle cx="56" cy="-36" r="5" fill="none" stroke="#e8642c" stroke-width="2.8"/><circle cx="56" cy="-36" r="5" fill="none" stroke="#fff" stroke-width="2.8" stroke-dasharray="3.9 3.9"/>`, fremd)}
    ${up('flagge', `<path d="M64 -27 L74 -50" stroke="#5f5446" stroke-width="1.3"/><g transform="translate(74 -50) rotate(10)"><path d="M0 0 h12 v2.6 h-12z" fill="#222"/><path d="M0 2.6 h12 v2.6 h-12z" fill="#dd0000"/><path d="M0 5.2 h12 v2.6 h-12z" fill="#ffce00"/></g>`, fremd)}
    <rect x="40" y="-46" width="12" height="18" rx="4" ${f('motor', 'bl')}/><rect x="44" y="-30" width="4" height="36" ${f('motor')}/>
    ${up('laternen', `<rect x="62" y="-31" width="3.4" height="3.4" fill="${L.w}"/>`, fremd)}
    ${o.vor || ''}`;
  return wrap(o, 'boot-d34', s);
}

/* Plätze für die Crew je Ansicht (Bühnen setzen ihre Figuren dorthin); mit Steuerrad steht der Steuermann am Rad */
const PLATZ = {
  seite: {pinne: [-72, -26], rad: [-58, -26], vorn: [56, -26], kajuete: [-6, -56]},
  heck: {pinne: [-24, -40], rad: [28, -40], kajuete: [22, -68]}
};

window.BOOT = {oben, seite, heck, d34, farben: F, FARBEN, UPS, PLATZ, RUMPF_OBEN, css, name};
})();

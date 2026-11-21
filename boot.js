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
/* ---------- Plätze und Teile (v5.73; Nutzer 20.11.2026: „feste Plätze, die sich bestücken lassen … damit sich Animationen und Zusätze nicht im Weg sind“) ----------
   Jeder Platz sitzt in jeder Ansicht an einer festen Stelle [x, y] und belegt einen Freiraum (Kreis mit Radius r). Er nimmt höchstens ein Teil auf.
   Die Plätze sind immer eingebaut (unsichtbar; <html data-plaetze> zeigt sie). Bühnen und Animationen fragen BOOT.platz(blick, name), statt eigene Stellen zu erfinden.
   hs: Höhe in der Draufsicht (Höhenschichten der Filmbühne). Die Crew hat eigene Stellen (CREW_PLATZ), die keinen Platz überdecken. */
const PLAETZE = {
  bug:      {name: 'Vorschiff', r: 9, hs: .32, seite: [70, -26], heck: null, oben: [0, -36], d34: [-74, -24]},
  dach:     {name: 'Kajütdach', r: 10, hs: .7, seite: [-30, -56], heck: [-16, -72], oben: [0, 2], d34: [-24, -56]},
  mast:     {name: 'Mast', r: 7, hs: .95, seite: [36, -80], heck: [0, -94], oben: [0, 14], d34: [12, -77]},
  ueber:    {name: 'Über dem Cockpit', r: 18, hs: .66, seite: [-62, -66], heck: [0, -82], oben: [0, 30], d34: [42, -64]},
  steuer:   {name: 'Steuerstand', r: 9, hs: .34, seite: [-59, -26], heck: [28, -40], oben: [8, 27], d34: [32, -28]},
  heck:     {name: 'Heckkorb', r: 9, hs: .34, seite: [-84, -26], heck: [48, -40], oben: [-12, 48], d34: [64, -27]},
  spiegel:  {name: 'Spiegel', r: 8, hs: .3, seite: [-80, -6], heck: [-22, -10], oben: [8, 50], d34: [58, -6]},
  bordwand: {name: 'Bordwand', r: 8, hs: .3, seite: [38, -19], heck: [-44, -20], oben: [-21, -22], d34: [-46, -18]}
};
/* Gewollte Überschneidungen (tools/plaetze-pruefen.js): der Steuermann steht am Steuerstand; von achtern liegt das Sonnendach näher als Dach und Mast und verdeckt sie */
const ERLAUBT = {crew: {rad: 'steuer'}, heck: [['dach', 'ueber'], ['mast', 'ueber']]};
/* In der Ansicht von achtern liegen diese Plätze hinter Kajüte oder Spiegel (werden davor gezeichnet) */
const HECK_HINTEN = {ueber: 1, steuer: 1};
const FLAG = (rot, k = 1) => `<g transform="rotate(${rot}) scale(${k})"><path d="M0 0 h-14 v3 h14z" fill="#222"/><path d="M0 3 h-14 v3 h14z" fill="#dd0000"/><path d="M0 6 h-14 v3 h14z" fill="#ffce00"/></g>`;
const RING = (r, w) => `<circle r="${r}" fill="none" stroke="#e8642c" stroke-width="${w}"/><circle r="${r}" fill="none" stroke="#fff" stroke-width="${w}" stroke-dasharray="${(r * 0.785).toFixed(2)} ${(r * 0.785).toFixed(2)}"/>`;
const SPEI = (cx, cy, r, w) => [0, 45, 90, 135].map(a => { const c = Math.cos(a * Math.PI / 180) * r, s = Math.sin(a * Math.PI / 180) * r; return `<path d="M${(cx - c).toFixed(1)} ${(cy - s).toFixed(1)} L${(cx + c).toFixed(1)} ${(cy + s).toFixed(1)}" stroke="#7a4d2a" stroke-width="${w}"/>`; }).join('');
/* Das Standardboot hat keine Extras; jedes Teil kommt nach einem Hörreise-Tag dazu (`tag`, Nutzer 21.11.2026: „Extras kommen mit der Zeit dazu“; in der Werft schaltet der Testmodus alles frei). */
/* Teile: Zeichnung je Ansicht in Koordinaten um den Platz (Bug rechts wie BOOT.seite); d34 nimmt die Seitenansicht gespiegelt, wenn es keine eigene hat */
const TEILE = {
  steuerrad: {name: 'Steuerrad statt Pinne', platz: 'steuer', tag: 3, wann: 'nach Tag 3',
    seite: f => `<path d="M-7 0 L-5 -18 L5 -18 L7 0Z" ${f('holz', 'bl')}/><circle cx="0" cy="-22" r="7" fill="none" stroke="#7a4d2a" stroke-width="2"/>${SPEI(0, -22, 7, 1.1)}`,
    heck: f => `<rect x="-6" y="-12" width="12" height="12" rx="2" ${f('holz', 'bl')}/><ellipse cx="0" cy="-16" rx="7" ry="2.4" fill="none" stroke="#7a4d2a" stroke-width="1.8"/>`,
    oben: f => `<rect x="-4" y="-3" width="8" height="7" rx="1.5" ${f('holz', 'bl')}/><circle cx="0" cy="-4" r="4" fill="none" stroke="#8a5a32" stroke-width="1.4"/>`},
  bimini: {name: 'Sonnendach', platz: 'ueber', tag: 2, wann: 'nach Tag 2',
    seite: () => `<path d="M-18 40 L-12 0 M14 40 L16 0" stroke="#8a8f93" stroke-width="1.6"/><path d="M-20 2 Q0 -8 20 2 L18 6 Q0 -2 -18 6Z" fill="#2f6f8f" class="bl"/>`,
    heck: () => `<path d="M-54 42 L-50 2 M54 42 L50 2" stroke="#8a8f93" stroke-width="1.8"/><path d="M-58 2 Q0 -14 58 2 L56 7 Q0 -8 -56 7Z" fill="#2f6f8f" class="bl"/>`,
    oben: () => `<path d="M-15 -9 H15 V10 H-15Z" fill="#2f6f8f" opacity=".92" class="bl"/><path d="M-15 -3 H15 M-15 4 H15" class="bd"/>`},
  radar: {name: 'Radar', platz: 'dach', tag: 4, wann: 'nach Tag 4',
    seite: () => `<path d="M0 0 V-6" stroke="#5f5446" stroke-width="1.4"/><ellipse cx="0" cy="-9" rx="7" ry="4.6" fill="#f3f1ea" class="bl"/>`,
    heck: () => `<path d="M0 0 V-5" stroke="#5f5446" stroke-width="1.4"/><ellipse cx="0" cy="-8" rx="8" ry="4.6" fill="#f3f1ea" class="bl"/>`,
    oben: () => `<circle cx="0" cy="0" r="4.2" fill="#f3f1ea" class="bl"/>`},
  suchscheinwerfer: {name: 'Suchscheinwerfer', platz: 'dach', tag: 6, wann: 'nach Tag 6',
    seite: () => `<path d="M-2 0 V-5 H2 V0" fill="#5f5446"/><path d="M-5 -11 H4 L8 -13 V-3 L4 -5 H-5Z" fill="#c9ced2" class="bl"/><ellipse cx="8" cy="-8" rx="1.4" ry="5" fill="#fff6c8"/>`,
    heck: () => `<rect x="-4" y="-10" width="8" height="7" rx="2" fill="#c9ced2" class="bl"/>`, oben: () => `<rect x="-2.5" y="-4" width="5" height="7" rx="1.5" fill="#c9ced2" class="bl"/>`},
  kajak: {name: 'Kajak auf dem Dach', platz: 'dach', tag: 6, wann: 'nach Tag 6',
    seite: () => `<path d="M-20 -2 Q0 -8 20 -2 Q0 3 -20 -2Z" fill="#e8a33a" class="bl"/><ellipse cx="0" cy="-4.2" rx="4" ry="1.2" fill="#3a2e24"/>`,
    heck: () => `<ellipse cx="0" cy="-3" rx="4.4" ry="3" fill="#e8a33a" class="bl"/>`, oben: () => `<ellipse cx="0" cy="0" rx="3" ry="13" fill="#e8a33a" class="bl"/><ellipse cx="0" cy="0" rx="1.6" ry="3" fill="#3a2e24"/>`},
  solar: {name: 'Solarpaneel', platz: 'dach', tag: 7, wann: 'nach Tag 7',
    seite: () => `<path d="M-15 -1 L15 -5 L15 -2 L-15 2Z" fill="#2a3f5a" class="bl"/>`,
    heck: () => `<path d="M-14 -2 H14 V1 H-14Z" fill="#2a3f5a" class="bl"/>`, oben: () => `<rect x="-9" y="-6" width="18" height="11" fill="#2a3f5a" class="bl"/><path d="M-3 -6 V5 M3 -6 V5 M-9 0 H9" stroke="#6f8fb0" stroke-width=".6"/>`},
  wimpel: {name: 'Skipperwimpel', platz: 'mast', tag: 7, wann: 'nach Tag 7',
    seite: () => `<path d="M0 -1 l14 3 l-14 3z" fill="#2f4f80" class="bl" style="stroke-width:.8"/><circle cx="5" cy="2" r="1.2" fill="#fff"/>`,
    heck: () => `<path d="M0 -1 l12 2.6 l-12 2.6z" fill="#2f4f80"/>`, oben: () => `<path d="M0 0 l7 1.6 l-7 1.6z" fill="#2f4f80"/>`},
  antenne: {name: 'Funkantenne', platz: 'mast', tag: 4, wann: 'nach Tag 4',
    seite: () => `<path d="M0 0 V-24" stroke="#3a3a3a" stroke-width="1.1"/><circle cx="0" cy="-24.5" r="1.2" fill="#3a3a3a"/>`,
    heck: () => `<path d="M0 0 V-20" stroke="#3a3a3a" stroke-width="1.1"/>`, oben: () => `<circle r="1.4" fill="#3a3a3a"/>`},
  flagge: {name: 'Heckflagge', platz: 'heck', tag: 1, wann: 'nach Tag 1',
    seite: () => `<path d="M0 0 L-12 -24" stroke="#5f5446" stroke-width="1.4"/><g transform="translate(-12 -24)">${FLAG(-28)}</g>`,
    heck: () => `<path d="M0 0 L14 -26" stroke="#5f5446" stroke-width="1.4"/><g transform="translate(14 -26) scale(-1 1)">${FLAG(-14)}</g>`,
    oben: () => `<path d="M0 0 L-8 6" stroke="#5f5446" stroke-width="1.2"/><path d="M-8 6 l-6 3 l1 2 l6 -3z" fill="#dd0000"/>`},
  angel: {name: 'Angelrute', platz: 'heck', tag: 3, wann: 'nach Tag 3',
    seite: () => `<path d="M0 0 L-24 -34" stroke="#6b4a2a" stroke-width="1.3"/><path d="M-24 -34 Q-32 -8 -34 26" stroke="#ddd" stroke-width=".5" fill="none"/>`,
    heck: () => `<path d="M0 0 L20 -36" stroke="#6b4a2a" stroke-width="1.3"/><path d="M20 -36 Q28 -10 30 44" stroke="#ddd" stroke-width=".5" fill="none"/>`, oben: () => `<path d="M0 0 L-10 12" stroke="#6b4a2a" stroke-width="1.1"/>`},
  grill: {name: 'Heckgrill', platz: 'heck', tag: 5, wann: 'nach Tag 5',
    seite: () => `<path d="M0 0 L-4 -6" stroke="#5f5446" stroke-width="1.2"/><path d="M-11 -7 H3 Q2 -1 -4 -1 Q-10 -1 -11 -7Z" fill="#333" class="bl"/><path d="M-8 -9 q1 -3 0 -5 M-4 -9 q1 -3 0 -5" stroke="#bbb" stroke-width=".6" fill="none"/>`,
    heck: () => `<path d="M-6 -6 H6 Q5 0 0 0 Q-5 0 -6 -6Z" fill="#333" class="bl"/>`, oben: () => `<circle r="3.4" fill="#333" class="bl"/>`},
  badeleiter: {name: 'Badeleiter', platz: 'spiegel', tag: 4, wann: 'nach Tag 4',
    seite: () => `<path d="M-4 -18 L-6 14 M-9 -18 L-11 14" stroke="#c9ced2" stroke-width="1.4"/>${[-12, -4, 4, 12].map(y => `<path d="M${-4.6 + y * -.06} ${y} H${-9.6 + y * -.06}" stroke="#c9ced2" stroke-width="1.2"/>`).join('')}`,
    heck: () => `<path d="M-4 -26 V20 M4 -26 V20" stroke="#c9ced2" stroke-width="1.6"/>${[-18, -8, 2, 12].map(y => `<path d="M-4 ${y} H4" stroke="#c9ced2" stroke-width="1.4"/>`).join('')}`,
    oben: () => `<rect x="-3" y="0" width="6" height="8" fill="none" stroke="#c9ced2" stroke-width="1"/>`},
  rettungsring: {name: 'Rettungsring', platz: 'bordwand', tag: 1, wann: 'nach Tag 1',
    seite: () => RING(5, 2.8), heck: () => RING(7.4, 3.6), oben: () => RING(4.4, 2.4)},
  fenderset: {name: 'Bunte Fender', platz: 'bordwand', tag: 2, wann: 'nach Tag 2',
    seite: () => [['#e8642c', -14], ['#2f6f8f', -6], ['#e2b23c', 2]].map(([c, x]) => `<path d="M${x} -2 V3" stroke="#5f5446" stroke-width=".8"/><ellipse cx="${x}" cy="9" rx="3" ry="6" fill="${c}" class="bl" style="stroke-width:.6"/>`).join(''),
    heck: () => [['#e8642c', -5], ['#2f6f8f', 5]].map(([c, x]) => `<ellipse cx="${x}" cy="6" rx="3.4" ry="6.4" fill="${c}" class="bl" style="stroke-width:.6"/>`).join(''),
    oben: () => `<ellipse cx="0" cy="0" rx="3" ry="5" fill="#e8642c" class="bl"/>`},
  anker: {name: 'Anker am Bug', platz: 'bug', tag: 1, wann: 'nach Tag 1',
    seite: () => `<circle cx="6" cy="2" r="1.6" fill="none" stroke="#4a4a4a" stroke-width="1"/><path d="M6 4 V16 M1 13 Q6 19 11 13 M3 7 H9" stroke="#4a4a4a" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
    oben: () => `<path d="M0 -4 V4 M-3 2 Q0 6 3 2" stroke="#4a4a4a" stroke-width="1.2" fill="none"/>`},
  bordkanone: {name: 'Bordkanone', platz: 'bug', tag: 7, wann: 'nach Tag 7',
    seite: () => `<rect x="-7" y="-4" width="11" height="4" rx="1" fill="#6b4a2a" class="bl"/><circle cx="-5" cy="0" r="2" fill="#4a3424"/><circle cx="2" cy="0" r="2" fill="#4a3424"/><path d="M-6 -6 L11 -9.5 L11.6 -5 L-6 -2.6Z" fill="#b8893a" class="bl"/><circle cx="-6.6" cy="-4.3" r="1.6" fill="#b8893a"/>`,
    oben: () => `<rect x="-3" y="-2" width="6" height="5" fill="#6b4a2a"/><path d="M-1.4 -9 H1.4 V2 H-1.4Z" fill="#b8893a" class="bl"/>`},
  glocke: {name: 'Schiffsglocke', platz: 'bug', tag: 2, wann: 'nach Tag 2',
    seite: () => `<path d="M0 0 V-12 H4" stroke="#5f5446" stroke-width="1.2" fill="none"/><path d="M1 -11 Q1 -4 -1 -3 H9 Q7 -4 7 -11 Q4 -13 1 -11Z" fill="#d9a93b" class="bl"/>`,
    oben: () => `<circle r="2.6" fill="#d9a93b" class="bl"/>`}
};
/* Laternen sind kein Platz: sie sitzen an den gesetzlichen Stellen (Seitenlichter, Topplicht, Hecklicht) */
const AUSSTATTUNG = {laternen: {name: 'Laternen', tag: 5, wann: 'nach Tag 5'}};
const UPS = {...Object.fromEntries(Object.entries(TEILE).map(([k, t]) => [k, {name: t.name, tag: t.tag, wann: t.wann, platz: t.platz}])), ...AUSSTATTUNG};
/* Teile eines Platzes in einer Ansicht; ebene: welche Plätze hier gezeichnet werden */
function plaetze(blick, f, fremd, filter = () => true, hs = null) {
  if (fremd) return '';
  let s = '';
  for (const [pn, p] of Object.entries(PLAETZE)) {
    if (!filter(pn)) continue;
    const a = p[blick]; if (!a) continue;
    let inner = '';
    for (const [tn, t] of Object.entries(TEILE)) {
      if (t.platz !== pn) continue;
      const z = t[blick] ? t[blick](f) : blick === 'd34' && t.seite ? `<g transform="scale(-.85 .85)">${t.seite(f)}</g>` : '';
      if (z) inner += `<g class="up up-${tn}">${z}</g>`;
    }
    const mark = `<g class="pmark"><circle r="${p.r}" fill="rgba(255,255,255,.25)" stroke="#e8642c" stroke-width="1" stroke-dasharray="2.5 2"/><text y="${-p.r - 2}" text-anchor="middle" font-size="5.5" font-family="Nunito,Arial,sans-serif" font-weight="800" fill="#b8402f">${p.name}</text></g>`;
    const g = `<g class="platz" data-platz="${pn}" transform="translate(${a[0]} ${a[1]})">${inner}${mark}</g>`;
    s += hs ? hs(p.hs, g) : g;
  }
  return s;
}
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
    :root[data-stil="kreide"] .fr .bl{stroke-width:2.3;stroke:#3a2e24}:root[data-stil="aquarell"] .fr .bl,:root[data-stil="pastell"] .fr .bl,:root[data-stil="flach"] .fr .bl{stroke:none}:root[data-stil="aquarell"] .fr .bd,:root[data-stil="pastell"] .fr .bd{opacity:.3}
    :root[data-stil="linol"] .fr .bl{stroke-width:2.8;stroke:#1c1612}:root[data-stil="linol"] .fr .bsch{display:none}:root[data-stil="tusche"] .fr .bl{stroke:#2b1d12}
    :root[data-stil="tusche"] .fr{filter:sepia(.8) saturate(1.2)}:root[data-stil="bleistift"] .fr{filter:grayscale(.9) contrast(1.1)}:root[data-stil="pastell"] .fr{filter:saturate(.65) brightness(1.12)}
    :root[data-stil="scherenschnitt"] .fr path,:root[data-stil="scherenschnitt"] .fr rect,:root[data-stil="scherenschnitt"] .fr circle,:root[data-stil="scherenschnitt"] .fr ellipse{fill:#2a2233!important}:root[data-stil="scherenschnitt"] .fr .bl{stroke:none}
    :root[data-stil="scherenschnitt"] .fr [fill="none"],:root[data-stil="scherenschnitt"] .fr .bd{fill:none!important;stroke:#efe3cc;opacity:.7}
    .fr .up{display:none}.fr .pmark{display:none}:root[data-plaetze] .fr .pmark{display:inline}` +
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
`);
  s += H(.4, `<path d="M-10 -34 Q0 -50 10 -34" stroke="#5f5446" stroke-width="1.2" fill="none"/>`);
  if (o.hs) s += [.36, .44, .52].map(h => H(h, `<path d="${kab}" ${f('rumpf')}/><path d="${kab}" class="bsch" style="opacity:.2"/>`)).join('');
  s += H(.6, `<path d="${kab}" ${f('dach', 'bl')}/><path d="M-8 -1 H8 M-8 3 H8" ${st('fenster', 2)}/><path d="M-9 8 H9 M-9 12 H9" class="bd" style="opacity:.4"/>`);
  s += plaetze('oben', f, fremd, () => true, o.hs ? H : null);
  s += H(.95, up('laternen', `<circle cx="0" cy="14" r="1.6" fill="${L.w}"/>`, fremd));
  if (o.lichter) s += H(.5, licht(-18, -18, L.r) + licht(18, -18, L.g) + licht(0, 49, L.w, 2.6));
  else s += H(.3, up('laternen', `<rect x="-20" y="-20" width="3" height="4" fill="${L.r}"/><rect x="17" y="-20" width="3" height="4" fill="${L.g}"/>`, fremd));
  return wrap(o, 'boot-oben', s);
}

/* ---------- von der Seite, Bug rechts (mit bugLinks gespiegelt), Wasserlinie y 0 ---------- */
function seite(o = {}) {
  const {f, st, fremd} = ctx(o), ein = o.antrieb === 'einbau', links = !!o.bugLinks;
  const lat = links ? L.r : L.g;   /* wer die Frieda mit dem Bug nach links sieht, sieht ihre Backbordseite */
  const inner = `
  ${plaetze('seite', f, fremd, pn => pn === 'heck')}
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
  ${plaetze('seite', f, fremd, pn => pn !== 'heck')}
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
  <path d="M-34 -40 L-30 -68 L30 -68 L34 -40Z" ${f('rumpf', 'bl')}/><path d="M-31 -66 L31 -66 L33 -72 L-33 -72Z" ${f('dach', 'bl')}/>
  <rect x="-9" y="-62" width="18" height="22" rx="2" ${f('holz', 'bl')}/><path d="M-6 -58 H6 M-6 -52 H6 M-6 -46 H6" class="bd"/><circle cx="5" cy="-50" r=".9" fill="#5f5446"/>
  ${[-22, 22].map(x => `<rect x="${x - 5}" y="-62" width="10" height="7" rx="2" ${f('fenster', 'bl')}/>`).join('')}
  ${plaetze('heck', f, fremd, pn => !!HECK_HINTEN[pn] || pn === 'dach' || pn === 'mast')}
  ${o.mitte || ''}
  <path d="M-62 -40 L62 -40 L56 0 Q30 15 0 17 Q-30 15 -56 0 Z" ${f('rumpf', 'bl')}/><path d="M-62 -40 L62 -40 L61.4 -37 L-61.4 -37Z" fill="#8a6a48"/>
  <path d="M-60.5 -30 L60.5 -30 L59.6 -24.5 L-59.6 -24.5Z" ${f('streifen')}/>
  <path d="M-56 0 Q-30 15 0 17 Q30 15 56 0 L54.6 8 Q30 22 0 24 Q-30 22 -54.6 8Z" ${f('unterwasser', 'bl')}/>
  <path d="M-62 -40 L-56 0 Q-40 9 -22 13 L-30 -40Z" class="bsch" style="opacity:.08"/>
  <text x="0" y="-9" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="12" letter-spacing="1" class="fr-schrift">${fremd ? '' : name()}</text>
  <text x="0" y="-1.5" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="800" font-size="5.2" letter-spacing="1.2" class="fr-schrift">${fremd ? '' : 'KUTTERSHAVEN'}</text>
  ${[-50, -36].map(y => `<ellipse cx="64" cy="${y + 22}" rx="5" ry="9" ${f('fender', 'bl')} style="stroke-width:.8"/>`).join('')}
  <rect x="-10" y="-60" width="20" height="24" rx="5" ${f('motor', 'bl')}/><path d="M-6 -56 H6" stroke="#fff" stroke-width="1" opacity=".4"/><rect x="-3.5" y="-37" width="7" height="44" ${f('motor')}/>
  ${ohne('steuerrad', `<path d="M0 -50 L-14 -44" stroke="#5f5446" stroke-width="2.6" stroke-linecap="round"/>`, fremd)}
  ${plaetze('heck', f, fremd, pn => !HECK_HINTEN[pn] && pn !== 'dach' && pn !== 'mast')}
  ${o.lichter ? licht(0, -70, L.w, 3) : up('laternen', `<rect x="-2" y="-74" width="4" height="4" fill="${L.w}" class="bl" style="stroke-width:.5"/>`, fremd)}
  ${o.vor || ''}`;
  return wrap(o, 'boot-heck', s);
}

/* ---------- schräg von achtern (für den Orbit), Bug links ---------- */
function d34(o = {}) {
  const {f, st, fremd} = ctx(o);
  const s = `<path d="M12 -56 V-78" stroke="#5f5446" stroke-width="1.6"/>
    <path d="M-84 -22 Q-50 -27 26 -30 L26 -6 Q-30 2 -78 -8 Z" ${f('rumpf', 'bl')}/><path d="M-78 -8 Q-30 2 26 -6 L26 6 Q-20 12 -70 0Z" ${f('unterwasser', 'bl')}/>
    <path d="M-82 -16 Q-40 -19 26 -20" ${st('streifen', 3)}/><path d="M26 -30 L66 -27 L62 -3 Q46 5 26 -6Z" ${f('rumpf', 'bl')}/><path d="M26 -30 L66 -27 L62 -3 Q46 5 26 -6Z" class="bsch" style="opacity:.12"/><path d="M26 -20 L65 -18" ${st('streifen', 3)}/>
    <path d="M26 -6 Q46 5 62 -3 L60 4 Q44 11 26 6Z" ${f('unterwasser', 'bl')}/><path d="M-44 -26 L-42 -52 L10 -54 L22 -28Z" ${f('rumpf', 'bl')}/><path d="M10 -54 L24 -52 L32 -28 L22 -28Z" ${f('rumpf', 'bl')}/><path d="M10 -54 L24 -52 L32 -28 L22 -28Z" class="bsch" style="opacity:.12"/>
    <path d="M-43 -52 L10 -54 L24 -52 L20 -57 L6 -58 L-41 -56Z" ${f('dach', 'bl')}/>${[-30, -14].map(x => `<circle cx="${x}" cy="-40" r="4" ${f('fenster', 'bl')}/>`).join('')}
    <rect x="40" y="-46" width="12" height="18" rx="4" ${f('motor', 'bl')}/><rect x="44" y="-30" width="4" height="36" ${f('motor')}/>
    ${plaetze('d34', f, fremd)}
    ${up('laternen', `<rect x="62" y="-31" width="3.4" height="3.4" fill="${L.w}"/>`, fremd)}
    ${o.vor || ''}`;
  return wrap(o, 'boot-d34', s);
}

/* Plätze für die Crew je Ansicht (Bühnen setzen ihre Figuren dorthin); mit Steuerrad steht der Steuermann am Rad */
const PLATZ = {
  seite: {pinne: [-72, -26], rad: [-58, -26], vorn: [52, -26], kajuete: [-4, -56], kajuete2: [10, -56]},
  heck: {pinne: [-24, -40], rad: [28, -40], kajuete: [22, -68]}
};
/* Wo sitzt ein Platz? (Animationen und Bühnen hängen Dinge dorthin, statt eigene Stellen zu erfinden) */
function platz(blick, n) { const p = PLAETZE[n]; if (!p || !p[blick]) return null; return {x: p[blick][0], y: p[blick][1], r: p.r, name: p.name}; }
/* Was steckt gerade auf einem Platz? (aus S.cfg.look.up, ein Teil je Platz) */
function belegt(n) { try { const up = (window.S && S.cfg && S.cfg.look && S.cfg.look.up) || []; return up.find(t => TEILE[t] && TEILE[t].platz === n) || null; } catch (e) { return null; } }

window.BOOT = {oben, seite, heck, d34, farben: F, FARBEN, UPS, TEILE, PLAETZE, ERLAUBT, AUSSTATTUNG, PLATZ, platz, belegt, RUMPF_OBEN, css, name};
})();

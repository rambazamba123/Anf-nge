/* ==========================================================================
   Skipper – „Unser Boot“ (v5.30, O169: Nutzer 08.11.2026 „ja genau, nur in Situationen extra angepasst“)
   Eine Datei für alle Ansichten der Frieda. Wer das Boot ändern will, ändert nur diese Datei; alle Animationen holen es von hier.
   Aussehen (Q3, 01.11.2026): weißer Rumpf, roter Streifen, dunkelblaues Unterwasserschiff, graues Kajütdach.
   Antrieb: 'aussen' (Außenborder, Standard wie in 3D und Folge 1-3) oder 'einbau' (Einbaumotor mit Welle und Ruder).
   Maße: von oben 100 lang (Bug bei y −50, Heck bei y +50), 40 breit; von der Seite 160 lang, Wasserlinie y 0, Bug rechts.
   BOOT.oben(o), BOOT.seite(o): o = {antrieb, lichter, nacht, bugLinks, farbe}
   ========================================================================== */
(() => {
const F = {rumpf: '#fbf8f2', strich: '#5f5446', streifen: '#c0392b', unterwasser: '#1f3b63', dach: '#cfd6db', fenster: '#7fa7c2', deck: '#e9dfcb', motor: '#3b3f44', holz: '#b9874f'};
const L = {r: '#ff4a3d', g: '#3ddc6a', w: '#fff7d6'};
const licht = (x, y, c, r = 3.4) => `<circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="${c}" opacity=".25"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;

/* von oben, Bug nach oben */
function oben(o = {}) {
  const c = {...F, ...(o.farbe || {})}, ein = o.antrieb === 'einbau';
  return `<g class="boot-oben">
  <path d="M0 -50 C17 -36 20 -6 19 22 L18 46 Q18 50 14 50 L-14 50 Q-18 50 -18 46 L-19 22 C-20 -6 -17 -36 0 -50Z" fill="${c.rumpf}" stroke="${c.strich}" stroke-width="2.4"/>
  <path d="M0 -46 C14 -33 16.5 -6 15.5 22 L15 45 M0 -46 C-14 -33 -16.5 -6 -15.5 22 L-15 45" stroke="${c.streifen}" stroke-width="2.2" fill="none"/>
  <path d="M0 -42 C10 -32 12 -14 12 -6 L-12 -6 C-12 -14 -10 -32 0 -42Z" fill="${c.deck}" stroke="${c.strich}" stroke-width="1"/>
  <path d="M-11 -4 H11 V20 H-11Z" fill="${c.dach}" stroke="${c.strich}" stroke-width="1.6" rx="3"/>
  <path d="M-9 -2 H9 M-9 2 H9" stroke="${c.fenster}" stroke-width="2"/>
  <rect x="-13" y="22" width="26" height="22" rx="3" fill="${c.deck}" stroke="${c.strich}" stroke-width="1.2"/>
  <circle cx="-14" cy="-24" r="1.8" fill="${c.strich}"/><circle cx="14" cy="-24" r="1.8" fill="${c.strich}"/><circle cx="-14" cy="40" r="1.8" fill="${c.strich}"/><circle cx="14" cy="40" r="1.8" fill="${c.strich}"/>
  ${ein ? `<path d="M0 50 V56" stroke="${c.strich}" stroke-width="2"/><rect x="-1.5" y="54" width="3" height="9" fill="#888"/>` : `<rect x="-6" y="48" width="12" height="12" rx="3" fill="${c.motor}"/><rect x="-2" y="58" width="4" height="6" fill="#666"/>`}
  ${o.lichter ? licht(-18, -18, L.r) + licht(18, -18, L.g) + licht(0, 49, L.w, 2.6) : ''}</g>`;
}

/* von der Seite, Bug rechts (mit bugLinks gespiegelt), Wasserlinie y 0 */
function seite(o = {}) {
  const c = {...F, ...(o.farbe || {})}, ein = o.antrieb === 'einbau';
  const inner = `<path d="M-80 -6 L66 -6 Q76 -8 82 -24 L80 -26 L-78 -26 L-80 -24Z" fill="${c.rumpf}" stroke="${c.strich}" stroke-width="2"/>
  <path d="M-80 -6 L66 -6 Q72 -6 74 -10 L70 6 Q62 12 40 12 L-74 10 L-80 4Z" fill="${c.unterwasser}" stroke="${c.strich}" stroke-width="1.6"/>
  <path d="M-79 -14 L78 -14" stroke="${c.streifen}" stroke-width="3.5"/>
  <path d="M-46 -26 L-44 -52 L18 -52 L34 -26Z" fill="${c.rumpf}" stroke="${c.strich}" stroke-width="2"/>
  <path d="M-44 -52 L18 -52 L20 -56 L-42 -56Z" fill="${c.dach}" stroke="${c.strich}" stroke-width="1.4"/>
  <path d="M20 -50 L31 -29 L22 -29 L13 -50Z" fill="${c.fenster}" opacity=".9"/>
  ${[-34, -18, -2].map(x => `<circle cx="${x}" cy="-39" r="4.5" fill="${c.fenster}" stroke="${c.strich}" stroke-width="1.4"/>`).join('')}
  <path d="M40 -26 V-36 H78 L80 -26" fill="none" stroke="${c.strich}" stroke-width="1.6"/>
  ${ein ? `<path d="M-50 8 L-70 14" stroke="#777" stroke-width="2.5"/><rect x="-76" y="10" width="5" height="12" fill="#999"/><path d="M-80 2 L-86 2 L-86 20 L-80 18Z" fill="#666"/>`
        : `<rect x="-92" y="-34" width="12" height="18" rx="3" fill="${c.motor}"/><rect x="-88" y="-16" width="4" height="26" fill="#555"/><rect x="-94" y="8" width="10" height="6" rx="2" fill="#555"/>`}
  ${o.lichter ? licht(56, -22, L.g) + `<path d="M-40 -56 V-74" stroke="${c.strich}" stroke-width="2"/>` + licht(-40, -76, L.w) + licht(-80, -26, L.w, 2.6) : ''}`;
  return `<g class="boot-seite"${o.bugLinks ? ' transform="scale(-1 1)"' : ''}>${o.nacht ? `<g opacity=".3">${inner}</g>` : inner}</g>`;
}

window.BOOT = {oben, seite, farben: F};
})();

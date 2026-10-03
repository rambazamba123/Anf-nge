/* ==========================================================================
   Szenen: Tageszeit, Wetter, Deck, Kajüte, Intro-Hafen
   Flach, warm, wenig Details. Alles zeichnet sich aus Tageszeit und Wetter.
   ========================================================================== */

/* Tageszeit aus der Handyuhr */
function dayPart(d = new Date()) {
  const h = d.getHours() + d.getMinutes() / 60;
  if (h >= 5 && h < 9) return 'morgen';
  if (h >= 9 && h < 17.5) return 'tag';
  if (h >= 17.5 && h < 21.5) return 'abend';
  return 'nacht';
}
/* Wetter: pro Tag zufällig, aber den ganzen Tag gleich. Meistens schön. */
function weatherToday() {
  const forced = window.S && S.cfg && S.cfg.wx && S.cfg.wx !== 'auto' ? S.cfg.wx : null;
  if (forced) return forced;
  const d = new Date(); let x = d.getFullYear() * 1000 + (d.getMonth() + 1) * 40 + d.getDate();
  x = Math.imul(x ^ (x >>> 13), 0x5bd1e995); x ^= x >>> 15; const r = ((x >>> 0) % 1000) / 1000;
  return r < .6 ? 'schoen' : r < .74 ? 'windig' : r < .82 ? 'sturm' : r < .93 ? 'regen' : 'nebel';
}
const WX_NAMES = {schoen: 'Schönes Wetter', windig: 'Frischer Wind', sturm: 'Wind und Regen', regen: 'Windstill und Regen', nebel: 'Nebel'};
const DAY_NAMES = {morgen: 'Morgen', tag: 'Tag', abend: 'Abend', nacht: 'Nacht'};

function palette(day, wx) {
  const P = {
    morgen: {skyT: '#a9cbe0', skyB: '#f3d3ae', sea: '#4f8fa8', seaD: '#3a7590', sun: '#f6c25a', cloud: '#fdf6ea', wall: '#6e4c34'},
    tag: {skyT: '#8fc3e3', skyB: '#d3e8f1', sea: '#3f86a6', seaD: '#2f6f8f', sun: '#f6cd4c', cloud: '#ffffff', wall: '#6b4a33'},
    abend: {skyT: '#5d6fa3', skyB: '#f0a36b', sea: '#3b6f8f', seaD: '#2c5874', sun: '#f08a4b', cloud: '#f6d3c0', wall: '#56392a'},
    nacht: {skyT: '#14213a', skyB: '#25385a', sea: '#1b3550', seaD: '#12273d', sun: '#f3ecd2', cloud: '#3a4a63', wall: '#3e2a1f'},
  }[day];
  const p = {...P};
  if (wx === 'regen' || wx === 'sturm') Object.assign(p, day === 'nacht' ? {skyT: '#1a2230', skyB: '#2a3442', cloud: '#3a4452'} : {skyT: '#7f8d99', skyB: '#aeb8bf', sea: '#4f7486', seaD: '#3d6072', cloud: '#c9cfd3'});
  if (wx === 'nebel') Object.assign(p, day === 'nacht' ? {skyT: '#2a3340', skyB: '#3a4452', cloud: '#55606c'} : {skyT: '#c9d0d4', skyB: '#e1e5e6', sea: '#8fa6ae', seaD: '#7d959e', cloud: '#eef1f2'});
  if (wx === 'windig' && day !== 'nacht') p.cloud = day === 'abend' ? '#f0cbb8' : '#f3f6f8';
  return p;
}
const styleVars = p => Object.entries(p).map(([k, v]) => `--${k}:${v}`).join(';');

/* Wiederverwendbare Teile */
const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" style="fill:var(--cloud)"><circle cx="0" cy="10" r="12"/><circle cx="16" cy="4" r="16"/><circle cx="34" cy="10" r="12"/><rect x="-6" y="10" width="46" height="12" rx="6"/></g>`;
const waves = (y, cls, fill, op) => {
  let d = `M0 ${y}`; for (let x = 0; x < 800; x += 50) d += ` q12.5 -6 25 0 t25 0`;
  return `<path class="wv ${cls}" d="${d} V320 H0 Z" style="fill:${fill}" opacity="${op}"/>`;
};
const rain = (h = 300) => { let s = ''; for (let i = 0; i < 46; i++) { const x = (i * 37) % 420 - 10, y = (i * 53) % h; s += `<path d="M${x} ${y} l-5 13" />`; } return `<g class="rain" stroke="#dfe8ee" stroke-width="1.4" stroke-linecap="round" opacity=".7"><g class="fall"><g>${s}</g><g transform="translate(0 -${h})">${s}</g></g></g>`; };
const fog = () => `<g class="fog" fill="#f2f4f4"><rect class="f1" x="-200" y="120" width="800" height="40" rx="20" opacity=".45"/><rect class="f2" x="-300" y="175" width="900" height="36" rx="18" opacity=".4"/><rect class="f3" x="-150" y="215" width="700" height="44" rx="22" opacity=".35"/></g>`;
const stars = () => { let s = ''; [[30, 30], [70, 18], [110, 40], [150, 22], [190, 50], [230, 14], [262, 36], [370, 24], [384, 70], [52, 70], [138, 76]].forEach(([x, y], i) => s += `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1 : 1.5}"/>`); return `<g class="stars" fill="#fbf3d6">${s}</g>`; };
const sunMoon = (x, y) => `<g class="sky-o"><circle class="sun" cx="${x}" cy="${y}" r="17" style="fill:var(--sun)"/><circle class="moon-cut" cx="${x + 7}" cy="${y - 5}" r="14" style="fill:var(--skyT)"/></g>`;
const lighthouse = (x, y) => `<g class="lh" transform="translate(${x} ${y})"><path class="beam" d="M4 -29 L-46 -35 L-46 -23 Z M4 -29 L54 -36 L54 -22 Z" fill="#fff3c0" opacity="0"/><path d="M-6 0 L-3 -26 L11 -26 L14 0 Z" fill="#f7f2e6"/><path d="M-4.6 -9 L12.6 -9 L13.2 -4 L-5.2 -4 Z M-3.6 -20 L11.6 -20 L12 -15 L-4 -15 Z" fill="#c2473b"/><rect x="-2" y="-32" width="12" height="6" rx="1" fill="#2b2118"/><circle class="lamp" cx="4" cy="-29" r="2.2" fill="#f6cd4c"/></g>`;

/* ---------- Das Boot (Seitenansicht mit aufgeschnittener Kajüte) ---------- */
function boatG(crew, o = {}) {
  const cut = o.cut !== false;
  return `<g class="boat">
    <rect x="197" y="34" width="5" height="118" rx="2" fill="#5a3e2a"/>
    <path class="flag" d="M202 34 L226 38 L202 43 Z" fill="#d6513c"/>
    <path d="M206 42 L206 146 L298 146 Q266 96 206 42 Z" fill="#fbf3e1"/>
    <path d="M193 46 L193 144 L110 150 Q146 100 193 46 Z" fill="#efe3c8"/>
    <path d="M203 148 L302 148" stroke="#5a3e2a" stroke-width="4" stroke-linecap="round"/>
    <rect x="140" y="136" width="122" height="17" rx="8" fill="#f7f2e6"/>
    <circle cx="160" cy="144.5" r="3.2" fill="#8cbfe3"/><circle cx="176" cy="144.5" r="3.2" fill="#8cbfe3"/><circle cx="226" cy="144.5" r="3.2" fill="#8cbfe3"/><circle cx="242" cy="144.5" r="3.2" fill="#8cbfe3"/>
    <path d="M318 150 L350 138" stroke="#5a3e2a" stroke-width="3.5" stroke-linecap="round"/>
    <rect x="343" y="150" width="23" height="14" rx="6" fill="#5c5c5c"/>
    <path d="M347 163 L362 163 L361 188 L357 214 L351 214 L349 188 Z" fill="#4a4a4a"/>
    <path d="M58 150 L344 150 Q340 184 318 205 L120 207 Q80 194 58 150 Z" fill="#fbf6ec"/>
    <path d="M60 154 L343 154 L341.5 162 L64 162 Z" fill="#3d5f8f"/>
    <path d="M100 196 Q210 204 326 197 L318 205 L120 207 Q106 202 100 196 Z" fill="#c2473b"/>
    ${cut ? `<path class="cut" d="M128 166 L300 166 L300 194 Q214 200 128 195 Z" style="fill:var(--cabin,#f3d79a)"/>
    <g clip-path="url(#cutClip)">
      <circle cx="212" cy="172" r="26" fill="#ffe7a8" opacity=".55"/>
      <rect x="128" y="191" width="172" height="5" fill="#b78452"/>
      ${charG(crew.K, 145, 164, .25)}${charG(crew.M, 226, 166, .24)}
      <path d="M262 186 L282 186" stroke="#7a4e33" stroke-width="2"/>${charG(crew.T, 263, 167, .16)}
      <rect x="186" y="186" width="34" height="4" rx="1" fill="#8a5a3a"/>
      <path d="M212 166 v4" stroke="#6b4a2b" stroke-width="1"/><path d="M208 170 h8 l-2 3 h-4 z" fill="#c79a3b"/>
    </g>
    <path d="M128 166 L300 166 L300 194 Q214 200 128 195 Z" fill="none" stroke="#b98a5a" stroke-width="1.2" stroke-dasharray="3 2"/>` : ''}
    <circle class="navl red" cx="62" cy="151" r="3.4" fill="#e2463b"/>
    <circle class="navl white" cx="340" cy="146" r="3" fill="#fffbe8"/>
  </g>`;
}
const buoyG = (x, y) => `<g transform="translate(${x} ${y})"><g class="buoy"><path d="M-1 -26 L-1 -14" stroke="#2b2118" stroke-width="1.6"/><rect x="-6" y="-34" width="10" height="9" fill="#c2473b"/><rect x="-10" y="-14" width="18" height="26" rx="2" fill="#c2473b"/><path d="M-12 12 L10 12 L8 17 L-10 17 Z" fill="#8a2f26"/></g></g>`;

function deckScene(crew, o = {}) {
  const day = dayPart(), wx = weatherToday(), p = palette(day, wx);
  p.cabin = day === 'nacht' ? '#f0c470' : '#f3d79a';
  return `<div class="scene deck" data-day="${day}" data-wx="${wx}" style="${styleVars(p)}">
  <svg viewBox="0 0 400 300" ${o.fill ? 'preserveAspectRatio="xMidYMax slice"' : ''} role="img" aria-label="Segelboot auf See, ${DAY_NAMES[day]}, ${WX_NAMES[wx]}. In der aufgeschnittenen Kajüte sitzt die Crew.">
    <defs><clipPath id="cutClip"><path d="M128 166 L300 166 L300 194 Q214 200 128 195 Z"/></clipPath></defs>
    <rect width="400" height="300" style="fill:var(--skyT)"/>
    <rect y="112" width="400" height="80" style="fill:var(--skyB)"/>
    ${stars()}${sunMoon(326, 52)}
    <g class="clouds">${cloud(30, 40, 1)}${cloud(150, 70, .7)}${cloud(250, 30, .85)}${cloud(-120, 60, .9)}</g>
    ${lighthouse(32, 187)}
    <path d="M300 187 L304 179 L330 177 L336 182 L352 183 L356 187 Z" fill="#b5563a"/><path d="M304 179 L330 177" stroke="#6a8f4a" stroke-width="2"/>
    <rect y="186" width="400" height="114" style="fill:var(--sea)"/>
    ${waves(198, 'w1', 'var(--seaD)', .45)}
    <g class="rocker">${boatG(crew)}</g>
    ${buoyG(374, 214)}
    ${waves(232, 'w2', 'var(--seaD)', .55)}${waves(268, 'w3', 'var(--seaD)', .65)}
    ${rain()}${fog()}
  </svg>
  ${o.hotspots === false ? '' : `
  <button class="hs" style="left:44%;top:77%" data-go="cabin"><i></i>Kajüte</button>
  <button class="hs" style="left:64%;top:28%" data-go="learn"><i></i>Lernen</button>
  <button class="hs" style="left:50%;top:7%" data-go="log"><i></i>Logbuch</button>
  <button class="hs left" style="left:93%;top:64%" data-go="exam"><i></i>Prüfung</button>`}
  ${o.hotspots === false ? '' : `<div class="wx-tag">${DAY_NAMES[day]} · ${WX_NAMES[wx]}</div>`}
  <div class="bubble hidden" id="bubble" role="status" aria-live="polite"><b></b><span></span></div>
</div>`;
}

/* ---------- Kajüte ---------- */
function cabinScene(crew) {
  const day = dayPart(), wx = weatherToday(), p = palette(day, wx);
  const now = new Date(), hr = (now.getHours() % 12 + now.getMinutes() / 60) * 30, mn = now.getMinutes() * 6;
  return `<div class="scene cabin" data-day="${day}" data-wx="${wx}" style="${styleVars(p)}">
  <svg viewBox="0 0 400 300" role="img" aria-label="Gemütliche Kajüte bei Lampenlicht. Die Crew sitzt am Tisch.">
    <defs><clipPath id="portClip"><circle cx="322" cy="86" r="31"/></clipPath></defs>
    <rect width="400" height="300" style="fill:var(--wall)"/>
    <path d="M38 0V300M76 0V300M114 0V300M152 0V300M190 0V300M228 0V300M266 0V300M304 0V300M342 0V300M380 0V300" stroke="#000" stroke-opacity=".14" stroke-width="2"/>
    <g class="glow"><circle cx="200" cy="62" r="160" fill="#ffcf7a" opacity=".06"/><circle cx="200" cy="62" r="105" fill="#ffcf7a" opacity=".09"/><circle cx="200" cy="62" r="58" fill="#ffd98f" opacity=".15"/></g>
    <g class="rocker">
      <g clip-path="url(#portClip)">
        <rect x="286" y="50" width="72" height="72" style="fill:var(--skyT)"/><rect x="286" y="80" width="72" height="20" style="fill:var(--skyB)"/>
        ${day === 'nacht' ? '<circle cx="306" cy="70" r="6" fill="#f5e9b8"/><circle cx="330" cy="62" r="1.2" fill="#f5e9b8"/><circle cx="342" cy="74" r="1" fill="#f5e9b8"/>' : day === 'tag' || day === 'morgen' ? '<circle cx="338" cy="68" r="7" style="fill:var(--sun)"/>' : '<circle cx="304" cy="96" r="9" style="fill:var(--sun)"/>'}
        <rect x="286" y="98" width="72" height="30" style="fill:var(--sea)"/>
        <path class="pw" d="M280 102 q8 -4 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 V128 H280 Z" style="fill:var(--seaD)" opacity=".7"/>
        <g class="port-rain" stroke="#e8f0f4" stroke-width="1.3" stroke-linecap="round" opacity=".8"><path d="M300 56 l-3 9 M318 64 l-3 9 M336 52 l-3 9 M308 82 l-3 9 M344 78 l-3 9 M326 92 l-3 9 M298 100 l-3 9"/></g>
        <rect class="port-fog" x="286" y="50" width="72" height="72" fill="#eef1f2" opacity="0"/>
      </g>
      <circle cx="322" cy="86" r="34" fill="none" stroke="#c8962e" stroke-width="7"/>
      <circle cx="322" cy="86" r="30.5" fill="none" stroke="#a37620" stroke-width="1.5"/>
      <rect x="18" y="76" width="80" height="5" fill="#7a4e33"/>
      <rect x="24" y="54" width="9" height="22" fill="#a8473a"/><rect x="35" y="58" width="8" height="18" fill="#3e6b5a"/><rect x="45" y="52" width="10" height="24" fill="#c8962e"/><rect x="57" y="60" width="7" height="16" fill="#3d5f8f"/>
      <circle cx="82" cy="68" r="8" fill="#3e6b5a"/><path d="M82 60 Q86 52 82 48" stroke="#6aa06a" stroke-width="2" fill="none"/>
      <g class="clock" transform="translate(134 46)"><circle r="16" fill="#f7f2e6" stroke="#8a6420" stroke-width="3"/>
        <path d="M0 -12 V-10 M12 0 H10 M0 12 V10 M-12 0 H-10" stroke="#8a6420" stroke-width="1.5"/>
        <path d="M0 0 V-7" stroke="#2b2118" stroke-width="2.2" stroke-linecap="round" transform="rotate(${hr})"/>
        <path d="M0 0 V-11" stroke="#2b2118" stroke-width="1.4" stroke-linecap="round" transform="rotate(${mn})"/><circle r="1.6" fill="#2b2118"/></g>
      <g class="lamp-sw"><path d="M200 0 V38" stroke="#2a1c14" stroke-width="2"/><rect x="191" y="34" width="18" height="6" rx="2" fill="#8a6420"/>
        <rect x="190" y="40" width="20" height="24" rx="6" fill="#f3d27a" opacity=".9" stroke="#8a6420" stroke-width="2"/><ellipse cx="200" cy="52" rx="3.5" ry="6" fill="#fff3c4"/></g>
      ${charG(crew.K, 50, 98, 1.05)}
      ${charG(crew.M, 212, 106, 1)}
      <path d="M298 170 L356 170" stroke="#7a4e33" stroke-width="4" stroke-linecap="round"/><path d="M350 170 L356 186" stroke="#7a4e33" stroke-width="3"/>
      ${charG(crew.T, 305, 104, .45)}
      <rect x="20" y="236" width="360" height="14" rx="5" fill="#8a5a3a"/>
      <rect x="50" y="250" width="10" height="50" fill="#6e452c"/><rect x="340" y="250" width="10" height="50" fill="#6e452c"/>
      <path d="M150 236 L172 228 L226 228 L210 236 Z" fill="#efe2c2"/><path d="M170 233 L205 231" stroke="#c0392b" stroke-width="1" stroke-dasharray="3 2"/>
      <rect x="96" y="224" width="13" height="12" rx="2" fill="#f7f3ea"/><path d="M109 228 Q114 230 109 233" stroke="#f7f3ea" stroke-width="2" fill="none"/>
      <path class="steam" d="M100 220 Q97 214 101 208 M105 220 Q102 213 106 206" stroke="#f7f3ea" stroke-width="1.2" fill="none" opacity=".6"/>
      <rect x="276" y="224" width="13" height="12" rx="2" fill="#f7f3ea"/><path class="steam" d="M280 220 Q277 214 281 208" stroke="#f7f3ea" stroke-width="1.2" fill="none" opacity=".6"/>
    </g>
  </svg>
  <div class="bubble hidden" id="bubble" role="status" aria-live="polite"><b></b><span></span></div>
</div>`;
}

/* ---------- Intro: Hafen mit Steg. Die Kamera fährt auf die Crew zu. ---------- */
function introScene(crew) {
  const day = dayPart(), wx = weatherToday(), p = palette(day, wx);
  p.cabin = '#f3d79a';
  return `<div class="stage" data-day="${day}" data-wx="${wx}" style="${styleVars(p)}">
  <svg viewBox="0 0 400 640" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Ein Steg im Hafen. Zwei Seeleute streiten sich, ein Papagei sitzt auf einem Poller.">
    <defs><clipPath id="cutClip"><path d="M128 166 L300 166 L300 194 Q214 200 128 195 Z"/></clipPath></defs>
    <rect width="400" height="640" style="fill:var(--skyT)"/>
    <rect y="200" width="400" height="140" style="fill:var(--skyB)"/>
    ${stars()}${sunMoon(318, 120)}
    <g class="clouds">${cloud(20, 120, 1.1)}${cloud(170, 170, .8)}${cloud(280, 90, .9)}</g>
    ${lighthouse(40, 338)}
    <rect y="336" width="400" height="304" style="fill:var(--sea)"/>
    ${waves(350, 'w1', 'var(--seaD)', .45)}
    <g id="cam">
      <g transform="translate(-30 238) scale(1.15)"><g class="rocker">${boatG(crew, {cut: false})}</g></g>
      ${waves(470, 'w2', 'var(--seaD)', .5)}
      <path d="M-40 640 L30 486 L370 486 L440 640 Z" fill="#9a6a42"/>
      <path d="M30 486 L370 486 L374 494 L26 494 Z" fill="#7a4e33"/>
      <path d="M14 520 L386 520 M0 556 L400 556 M-12 594 L412 594" stroke="#7a4e33" stroke-width="2.5"/>
      <rect x="302" y="520" width="34" height="46" rx="6" fill="#3a2a20"/><ellipse cx="319" cy="520" rx="19" ry="7" fill="#4a3628"/>
      <g class="tilt-r actor" id="actK"><g class="hopper">${charG(crew.K, 56, 410, 1.2)}</g></g>
      <g class="tilt-l actor" id="actM"><g class="hopper">${charG(crew.M, 182, 418, 1.15)}</g></g>
      <g class="actor" id="actT"><g class="hopper">${charG(crew.T, 296, 455, .46)}</g></g>
    </g>
    ${rain(640)}${fog()}
  </svg>
  <div class="bubble hidden" id="bubble" role="status" aria-live="polite"><b></b><span></span></div>
</div>`;
}

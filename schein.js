/* Entwurf „Mein Schein“ (V26): alles, was für die Prüfung zählt, an einem Ort.
   Aufbau wie die echte Prüfung: Theorie, Signale, Navigation, Praxis, Probeprüfung. Fortschritt je Schein, Scheinmappe im Logbuch.
   Die Crew (Podcast, Gespräche, Harms an Bord) bleibt beim Crew-Schein; hier darf man jeden Schein lernen.
   Nutzt nur vorhandene Lernwege (startUnit, reviewSession, trapRound, navSchool, maneuverGame, knotenBrett, examIntro). */
(function () {
'use strict';
/* Signal-Themen je Schein (amtliche Fragen in Prüfungsform: Zeichen, Bild oder Tonfolge, Antwort ankreuzen) */
const SIGNALE = {sbf: ['s2', 's3', 's6'], binnen: ['i4', 'i5'], sks: []};
/* Spiele zum Hören und Sehen: Regeln auf See, deshalb nicht für Binnen */
const SIG_SPIELE = {sbf: ['horn', 'lights', 'lh', 'buoy'], sks: ['lights', 'lh', 'buoy'], binnen: []};
const NAVI_LEK = {sbf: 9, sks: 11, binnen: 0};
const MANOEVER = ['ablegen', 'anlegen', 'mob', 'kompass', 'aufstoppen', 'wenden'];
const KNOTEN_ZAHL = 9;
const GEWICHT = {theorie: .5, signale: .15, navi: .15, praxis: .2};
const NAECHSTER = {sbf: 'sks', binnen: 'sbf', sks: null};

const CSS = `<style>
.mshead{display:flex;align-items:center;justify-content:space-between;margin:14px 0 8px}
.mshead h1{margin:0;font:700 1.5rem/1.1 var(--hfont)}
.schips{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 6px;margin:0 -2px}
.schip{flex:0 0 auto;display:flex;align-items:center;gap:8px;border:2px solid var(--line);background:var(--paper);border-radius:16px;padding:6px 10px 6px 6px;color:var(--ink);font:700 .85rem var(--bfont);min-height:48px}
.schip[aria-pressed="true"]{border-color:var(--ink);box-shadow:0 2px 0 var(--ink)}
.schip small{display:block;font-weight:600;color:var(--muted);font-size:.72rem}
.schip.bald{opacity:.45}
.msring{display:block}
.msring text{font:700 11px var(--bfont);fill:var(--ink)}
.msreife{display:grid;grid-template-columns:96px 1fr;gap:12px;align-items:center}
.msreife .big text{font-size:20px}
.mssec{margin-top:12px}
.mssec .kopf{display:flex;align-items:center;gap:10px}
.mssec .kopf h2{margin:0;font:700 1.15rem var(--hfont);flex:1}
.mssec .ico{font-size:1.4rem;width:34px;text-align:center}
.mssec .pr{margin:4px 0 8px;font-size:.85rem;color:var(--muted)}
.mssec .menu{display:grid;gap:6px}
.mssec .menuitem,.mstema .menuitem,.msmenu .menuitem{display:flex;justify-content:space-between;align-items:center;gap:8px}
.mssec .menuitem small,.mstema .menuitem small,.msmenu .menuitem small{color:var(--muted);font-weight:600;white-space:nowrap}
.msspiel{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.msspiel button{border:2px dashed var(--line);background:none;border-radius:12px;padding:8px 10px;font:700 .82rem var(--bfont);color:var(--ink);min-height:44px}
.msbar{height:8px;border-radius:5px;background:var(--line);overflow:hidden;margin-top:6px}
.msbar i{display:block;height:100%;background:var(--stb)}
.mstema{border:2px solid var(--line);border-radius:14px;padding:10px 12px;margin:8px 0;background:var(--paper)}
.mstema.tipp{border-color:var(--lamp)}
.mstema .row{justify-content:space-between}
.mstema .einh{display:grid;gap:6px;margin-top:8px}
.mstempel{display:inline-block;border:2px solid var(--stb);color:var(--stb);border-radius:8px;padding:2px 8px;font:800 .78rem var(--bfont);transform:rotate(-3deg)}
.msmappe .zeile{display:grid;grid-template-columns:44px 1fr auto;gap:10px;align-items:center;padding:8px 0;border-top:1px solid var(--line)}
.msmappe .zeile:first-of-type{border-top:0}
</style>`;

const fach = id => id === S.course ? S : ((S.courses || {})[id] || {});
const qsOf = id => fach(id).qs || {};
const proz = v => Math.round(v * 100) + ' %';
/* Eine Frage zählt voll, wenn sie sicher sitzt (dreimal in Folge richtig), angefangen zählt ein wenig */
const wert = (list, qs) => list.length ? list.reduce((a, q) => { const s = qs[q.n]; return a + (!s ? 0 : s.b >= 3 ? 1 : .3); }, 0) / list.length : 0;
const sicher = (list, qs) => list.filter(q => qs[q.n] && qs[q.n].b >= 3).length;

function signalThemen(id) { const C = COURSES[id]; return (SIGNALE[id] || []).map(t => C.topics.find(x => x.id === t)).filter(Boolean); }
function theorieThemen(id) { const sig = SIGNALE[id] || []; return COURSES[id].topics.filter(t => !sig.includes(t.id)); }
function knotenOk() { return Object.entries(S.knoten || {}).filter(([k, v]) => k !== 'palstek-anim' && v && v.ok).length; }
function manOk() { return MANOEVER.filter(m => S.man && S.man[m] && S.man[m].ok).length; }
function naviOk(id) { const lek = (S.navi && S.navi.lek) || {}, n = NAVI_LEK[id] || 0; let k = 0; for (let i = 1; i <= n; i++) if (lek['L' + i] && lek['L' + i].sterne >= 1) k++; return k; }

/* Die Prüfungsteile eines Scheins mit Stand 0…1 */
function teile(id) {
  const C = COURSES[id], items = C.items(), qs = qsOf(id), sigT = signalThemen(id);
  const istSig = q => sigT.some(t => t.has(q)), theo = items.filter(q => !istSig(q)), sig = items.filter(istSig);
  const out = [{k: 'theorie', v: wert(theo, qs), info: `${sicher(theo, qs)} von ${theo.length} Fragen sicher`}];
  if (sig.length) out.push({k: 'signale', v: wert(sig, qs), info: `${sicher(sig, qs)} von ${sig.length} Fragen sicher`});
  if (NAVI_LEK[id]) out.push({k: 'navi', v: naviOk(id) / NAVI_LEK[id], info: `${naviOk(id)} von ${NAVI_LEK[id]} Lektionen`});
  out.push({k: 'praxis', v: (manOk() / MANOEVER.length + knotenOk() / KNOTEN_ZAHL) / 2, info: `${manOk()} von ${MANOEVER.length} Manövern · ${knotenOk()} von ${KNOTEN_ZAHL} Knoten`});
  return out;
}
function reife(id) { const t = teile(id), w = t.reduce((a, x) => a + GEWICHT[x.k], 0); return t.reduce((a, x) => a + x.v * GEWICHT[x.k], 0) / w; }
function probe(id) { const ex = fach(id).exams || []; return {alle: ex, letzte: ex.slice(-3), ok: ex.slice(-3).filter(e => e.pass).length}; }
const bestanden = id => S.scheine && S.scheine[id] && S.scheine[id].ok;
const pruefungsreif = id => reife(id) >= .85 && probe(id).ok >= 2;
const begonnen = id => id === S.course || id === S.crewSchein || Object.keys(qsOf(id)).length > 0;

function ring(v, size, col, txt) {
  const r = size / 2 - 5, u = 2 * Math.PI * r;
  return `<svg class="msring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="6"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(u * Math.max(.001, v)).toFixed(1)} ${u.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    ${txt != null ? `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central">${txt}</text>` : ''}</svg>`;
}
const farbe = id => COURSE_COLOR[id] || '#f0b53e';
const los = fn => () => { AUD.click(); SCHEIN_RET = true; returnTo = 'cabin'; fn(); };

/* ---------- Übersicht ---------- */
function hub() {
  subScreen(); place = 'schein'; $('#tabs').classList.remove('hidden'); document.body.classList.add('mittabs');
  const id = S.course, C = COURSE, t = teile(id), r = reife(id), pr = probe(id), ok = bestanden(id);
  const tk = Object.fromEntries(t.map(x => [x.k, x]));
  const rec = recommendNext(), zahlen = todayNumbers();
  const chip = cid => { const c = COURSES[cid], rv = begonnen(cid) ? reife(cid) : 0;
    return `<button class="schip" data-s="${cid}" aria-pressed="${cid === id}">${ring(rv, 40, farbe(cid))}<span>${esc(c.short)} ${cid === S.crewSchein ? '⚓' : ''}${bestanden(cid) ? '🎓' : ''}<small>${bestanden(cid) ? 'bestanden' : begonnen(cid) ? proz(rv) : 'noch nicht begonnen'}</small></span></button>`; };
  const zeile = (key, label, info) => `<button class="menuitem" data-go="${key}"><span>${label}</span>${info ? `<small>${esc(info)}</small>` : ''}</button>`;
  const sek = (k, titel, pruef, inhalt) => `<section class="card mssec" aria-label="${esc(titel)}"><div class="kopf"><span class="ico">${({theorie: '📖', signale: '🏮', navi: '🧭', praxis: '🪢', pruefung: '🎓'})[k]}</span><h2>${esc(titel)}</h2>${tk[k] ? ring(tk[k].v, 44, 'var(--stb)', Math.round(tk[k].v * 100)) : ''}</div>
    <p class="pr">${pruef}</p>${tk[k] ? `<p class="small" style="margin:-4px 0 8px">${esc(tk[k].info)}</p>` : ''}${inhalt}</section>`;
  const spiele = (SIG_SPIELE[id] || []).map(k => GAMES.find(g => g.k === k)).filter(g => g && (!g.ok || g.ok()));
  app.innerHTML = `${CSS}<div class="mshead"><h1>Mein Schein</h1><button class="btn small ghost" id="msset">Einstellungen</button></div>
    <div class="schips" role="group" aria-label="Schein wählen">${Object.keys(COURSES).map(chip).join('')}${COURSES_SOON.map(c => `<button class="schip bald" aria-disabled="true" data-bald="${c.id}">${ring(0, 40, 'var(--line)')}<span>${esc(c.name.split(' ')[0])}<small>kommt später</small></span></button>`).join('')}</div>
    <p class="small muted" style="margin:2px 0 10px">⚓ Crew-Schein: <b>${esc(COURSES[S.crewSchein || id].short)}</b>. Darüber reden Crew und Podcast an Bord. <button class="linkbtn" id="mscrew" style="background:none;border:0;padding:0;color:var(--sea);font:inherit;text-decoration:underline">ändern</button></p>
    ${ok ? `<div class="card" style="border-color:var(--stb)"><p style="margin:0"><span class="mstempel">BESTANDEN</span> am <b>${fmtDate(ok)}</b>. Glückwunsch, ${esc(C.short)} ist in der Tasche!</p>
      <p class="small muted" style="margin:6px 0 8px">Dein Lernstand bleibt. Hier kannst du jederzeit auffrischen.</p>${NAECHSTER[id] && !bestanden(NAECHSTER[id]) ? `<button class="btn small" data-s="${NAECHSTER[id]}">Als Nächstes: ${esc(COURSES[NAECHSTER[id]].short)}</button>` : ''}</div>` : ''}
    <section class="card"><div class="msreife"><div class="big">${ring(r, 96, farbe(id), proz(r))}</div><div><b>Prüfungsreife ${esc(C.short)}</b>${pruefungsreif(id) ? ' <span class="mstempel">PRÜFUNGSREIF</span>' : ''}
      <p class="small muted" style="margin:4px 0 0">${daysLeft() ? `Noch ${daysLeft()} Tage bis zur Prüfung am ${fmtDate(S.profile.exam)}.` : 'Heute ist Prüfungstag!'} Fällig: ${zahlen.due} · neu geplant: ${zahlen.newLeft}</p></div></div>
      <button class="btn lamp wide" id="msheute" style="margin-top:10px">Heute dran: ${esc(rec.label)}</button>
      <p class="small muted" style="margin:6px 0 0">Die Crew wählt aus: angefangene Kapitel zuerst, dann fällige Wiederholungen, dann das nächste Thema. <button id="msfp" style="background:none;border:0;padding:0;color:var(--sea);font:inherit;text-decoration:underline">Fahrplan ansehen</button></p></section>
    ${sek('theorie', 'Theorie', C.kind === 'open' ? 'In der Prüfung: Fragen mit freier Antwort, schriftlich.' : 'In der Prüfung: Fragebogen zum Ankreuzen, ' + esc(C.exam.desc.split('.')[0]) + '.',
      `<div class="menu">${zeile('themen', 'Themen frei wählen', theorieThemen(id).length + ' Themen')}${zeile('wdh', 'Wiederholen', zahlen.due + ' fällig')}${zeile('fallen', C.kind === 'mc' ? 'Prüfungsfallen' : 'Wackelkandidaten', 'die gemeinen Fragen')}</div>`)}
    ${tk.signale ? sek('signale', 'Signale: Lichter, Töne, Tonnen', 'In der Prüfung: Zeichen, Bild oder Tonfolge (z. B. kurz-lang-kurz) und die richtige Bedeutung ankreuzen. Genau so wird hier gelernt.',
      `<div class="menu">${signalThemen(id).map(th => { const list = C.items().filter(th.has); return zeile('sig:' + th.id, esc(th.name), sicher(list, S.qs) + ' von ' + list.length + ' sicher'); }).join('')}${zeile('lex', 'Nachschlagen im Lexikon', 'Bilder und Tonfolgen')}</div>
      ${spiele.length ? `<p class="small muted" style="margin:10px 0 0"><b>Wie in echt:</b> hören und sehen. Spiele mit Rekord, zählen nicht zum Fortschritt.</p><div class="msspiel">${spiele.map(g => `<button data-spiel="${g.k}">🎮 ${esc(g.n)}</button>`).join('')}</div>` : ''}`) : ''}
    ${!tk.signale && spiele.length ? sek('signale', 'Signale üben', 'Im SKS stecken Lichter und Schallsignale in den Fragen zum Schifffahrtsrecht. Zum Üben wie in echt:', `<div class="msspiel">${spiele.map(g => `<button data-spiel="${g.k}">🎮 ${esc(g.n)}</button>`).join('')}</div>`) : ''}
    ${tk.navi ? sek('navi', 'Navigation', id === 'sks' ? 'In der Prüfung: Kartenaufgabe mit 30 Punkten, bestanden ab 20.' : 'In der Prüfung: Navigationsaufgabe auf der Übungskarte, mindestens 7 von 9 Punkten.',
      `<div class="menu">${zeile('navi', 'Kartentisch: Lektionen und Prüfungsaufgabe', '')}</div>`) : ''}
    ${sek('praxis', 'Praxis: Manöver und Knoten', id === 'sks' ? 'Im SKS wird unter Segeln und mit Motor geprüft. Hier übst du die Motor-Manöver und die Knoten.' : 'In der praktischen Prüfung: Manöver mit Motor und Knoten (7 der 9 Knoten werden verlangt, 6 müssen sitzen).',
      `<div class="menu">${zeile('man', 'Manöver fahren', manOk() + ' von ' + MANOEVER.length + ' geschafft')}${zeile('knoten', 'Knotenbrett', knotenOk() + ' von ' + KNOTEN_ZAHL + ' mit echtem Tau')}</div>
      <div class="msspiel"><button data-spiel="knoten">🎮 Knotenkunde</button></div>`)}
    ${sek('pruefung', 'Probeprüfung', esc(C.exam.rule.split('. ')[0]) + '.', `<div class="menu">${zeile('harms', 'Kapitän Harms prüft dich', pr.alle.length ? 'zuletzt: ' + pr.letzte.map(e => e.pass ? '✓' : '✗').join(' ') : 'noch keine')}</div>
      <p class="small muted" style="margin:8px 0 0">Prüfungsreif heißt hier: mindestens 85 % und zwei der letzten drei Probeprüfungen bestanden.</p>`)}
    <div class="card"><b>${ok ? 'Eintrag ändern' : 'Echte Prüfung bestanden?'}</b><p class="small muted" style="margin:4px 0 8px">${ok ? 'Falls du dich vertippt hast.' : 'Trag es hier ein. Der Schein wandert mit Datum in deine Scheinmappe im Logbuch.'}</p><button class="btn small${ok ? ' ghost' : ''}" id="msok">${ok ? 'Eintrag löschen' : 'Bestanden eintragen'}</button></div>
    <p class="small muted" style="margin:10px 4px 24px">So rechnet die App: Theorie zählt die Hälfte, Signale, Navigation und Praxis den Rest. Eine Frage zählt, wenn sie dreimal in Folge richtig war. Manöver und Knoten zählen für jeden Schein, du lernst sie nur einmal.</p>`;
  app.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { AUD.click(); S.lernSchein = b.dataset.s; scheinAktiv(b.dataset.s); save(); hub(); window.scrollTo(0, 0); });
  app.querySelectorAll('[data-bald]').forEach(b => b.onclick = () => toast('Kommt, sobald die amtlichen Kataloge da sind.'));
  $('#msset').onclick = () => { AUD.click(); renderSettings(); };
  $('#mscrew').onclick = crewWahl;
  $('#msfp').onclick = () => fahrplanSheet();
  $('#msheute').onclick = los(() => rec.run());
  $('#msok').onclick = () => ok ? (delete S.scheine[id], save(), hub()) : bestandenSheet(id);
  const GO = {themen: () => themen(), wdh: () => reviewSession(), fallen: () => trapRound(), lex: () => renderLexikon(), navi: () => navSchool(), man: () => maneuverGame(), knoten: () => knotenBrett(), harms: () => examIntro('harms')};
  app.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { const g = b.dataset.go; if (g.startsWith('sig:')) return themaSheet(TOPICS.find(t => t.id === g.slice(4))); los(GO[g])(); });
  app.querySelectorAll('[data-spiel]').forEach(b => b.onclick = () => { const g = GAMES.find(x => x.k === b.dataset.spiel); if (!g) return; LOG.add('spiel', g.n); los(g.f)(); });
}

/* ---------- Themen: frei wählbar, die Crew markiert das nächste ---------- */
function einheiten(th) {
  return UNITS.filter(u => u.topic === th).map(u => `<button class="menuitem" data-u="${u.id}"><span>${esc(u.label.replace(th.name, '').replace(/^ \((.*)\)$/, '$1') || 'Alle Fragen')}</span><small>${STAGE_NAMES[unitStage(u)]}</small></button>`).join('');
}
function naechstesThema() { const u = UNITS.find(x => ['vorab', 'erklaert'].includes(unitStage(x))) || UNITS.find(x => unitStage(x) === 'neu'); return u && u.topic; }
function bindUnits(root) { root.querySelectorAll('[data-u]').forEach(b => b.onclick = () => { closeSheet(); const u = UNITS.find(x => x.id === b.dataset.u); if (u) los(() => startUnit(u))(); }); }
function themen() {
  subScreen(); place = 'schein';
  const id = S.course, tipp = naechstesThema();
  app.innerHTML = `${CSS}<div class="topbar"><button class="btn small ghost" id="msback">← Mein Schein</button><b class="tbtitle">Theorie · ${esc(COURSE.short)}</b><span></span></div>
    <p class="small muted" style="margin:10px 2px">Die Reihenfolge ist ein Vorschlag der Crew, der Stern zeigt das nächste Thema. Du darfst jedes Thema jederzeit wählen. Jedes Kapitel: erst raten, dann erklären lassen, dann nochmal.</p>
    ${theorieThemen(id).map(th => { const s = topicStats(th); return `<div class="mstema${th === tipp ? ' tipp' : ''}"><div class="row"><b>${th === tipp ? '⭐ ' : ''}${esc(th.name)}</b><small class="muted">${s.m} von ${s.total} sicher</small></div>
      <div class="msbar"><i style="width:${s.total ? Math.round(s.m / s.total * 100) : 0}%"></i></div><div class="einh">${einheiten(th)}</div></div>`; }).join('')}`;
  $('#msback').onclick = () => { AUD.click(); setTab('schein'); };
  bindUnits(app);
}
function themaSheet(th) {
  if (!th) return;
  const s = topicStats(th), w = sheet(`${CSS}<h2 style="margin:0 0 4px">${esc(th.name)}</h2><p class="small muted" style="margin:0 0 8px">${s.m} von ${s.total} Fragen sicher. Gefragt wird wie in der Prüfung.</p><div class="menu msmenu">${einheiten(th)}</div>`);
  bindUnits(w);
}

/* ---------- Crew-Schein und „bestanden“ ---------- */
function crewWahl() {
  const w = sheet(`<h2 style="margin:0 0 4px">Crew-Schein</h2><p class="small muted" style="margin:0 0 10px">Über diesen Schein reden Hinnerk, Smilla und Klabauter an Bord: Podcast, Gespräche, Tipps. Lernen kannst du trotzdem jeden Schein.</p>
    <div class="menu">${Object.keys(COURSES).map(cid => `<button class="menuitem" data-c="${cid}"><b>${esc(COURSES[cid].name)}</b>${cid === S.crewSchein ? '<small>⚓ jetzt</small>' : ''}</button>`).join('')}</div>`);
  w.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { S.crewSchein = b.dataset.c; save(); closeSheet(); toast('Die Crew kümmert sich jetzt um ' + COURSES[S.crewSchein].short + '.'); hub(); });
}
function bestandenSheet(id) {
  const heute = new Date().toISOString().slice(0, 10);
  const w = sheet(`<h2 style="margin:0 0 4px">${esc(COURSES[id].short)} bestanden</h2><p class="small muted" style="margin:0 0 10px">Wann war die Prüfung?</p>
    <input type="date" id="msdat" value="${heute}" max="${heute}"><button class="btn lamp wide" id="msja" style="margin-top:10px">Eintragen</button>`);
  w.querySelector('#msja').onclick = () => { const d = w.querySelector('#msdat').value || heute; S.scheine = S.scheine || {}; S.scheine[id] = {ok: d}; save(); closeSheet(); AUD.sfx('richtig', {vol: .5}); toast('Mast- und Schotbruch gehabt! Glückwunsch, Kapitän.'); LOG.add('schein', COURSES[id].short + ' bestanden'); hub(); };
}

/* ---------- Scheinmappe im Logbuch ---------- */
function mappe(el) {
  el.innerHTML = `${CSS}<section class="card msmappe"><h3 style="margin:0 0 4px">Scheinmappe</h3>${Object.keys(COURSES).map(cid => { const ok = bestanden(cid), rv = begonnen(cid) ? reife(cid) : 0;
    return `<div class="zeile">${ring(ok ? 1 : rv, 44, farbe(cid), ok ? '🎓' : Math.round(rv * 100))}<div><b>${esc(COURSES[cid].short)}</b> ${cid === S.crewSchein ? '⚓' : ''}<br><span class="small muted">${ok ? 'bestanden am ' + fmtDate(ok) : begonnen(cid) ? 'Prüfungsreife ' + proz(rv) + (pruefungsreif(cid) ? ' · prüfungsreif' : '') : 'noch nicht begonnen'}</span></div><button class="btn small ghost" data-m="${cid}">Öffnen</button></div>`; }).join('')}</section>`;
  el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { AUD.click(); S.lernSchein = b.dataset.m; save(); setTab('schein'); });
}

window.SCHEIN = {hub, themen, mappe, reife, teile};
})();

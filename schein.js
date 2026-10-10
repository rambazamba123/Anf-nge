/* V26 „Meine Prüfungen“ (in der Kajüte beim Käpt'n): alles, was für die Prüfung zählt, aufgebaut wie die echte Prüfung.
   Oben die Scheine (⚓ Crew-Schein, 🎓 bestanden), dann der Stand je Bereich bis 100 % (Theorie, Navigation, Praxis),
   darunter eingeklappte Abschnitte: Theorie, Seezeichen und Signale, Navigation, Praxis, Probeprüfung.
   Bausteine: Die 72 Basisfragen gelten für SBF See und SBF Binnen gemeinsam (siehe basisTeilen in index.html).
   Rechnet mit fortschritt(), fragenStand(), naviStand(), praxisStand() aus index.html. */
(function () {
'use strict';
/* Signal-Themen je Schein: amtliche Fragen in Prüfungsform (Bild, Zeichen oder Tonfolge, Antwort ankreuzen) */
const SIGNALE = {sbf: ['s2', 's3', 's6'], binnen: ['i2', 'i4', 'i5'], sks: []};
const BASIS = q => typeof q.n === 'number' && q.n <= 72;
const NAECHSTER = {sbf: 'sks', binnen: 'sbf', sks: null};
const PARTNER = {sbf: 'binnen', binnen: 'sbf'};
const offen = {};  /* welche Abschnitte gerade aufgeklappt sind (nur für diese Sitzung) */

const CSS = `<style>
.mpk .schips{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 6px;margin:4px -2px 0}
.mpk .schip{flex:0 0 auto;display:flex;align-items:center;gap:8px;border:2px solid var(--line);background:var(--paper);border-radius:16px;padding:6px 10px 6px 6px;color:var(--ink);font:700 .85rem var(--bfont);min-height:48px}
.mpk .schip[aria-pressed="true"]{border-color:var(--ink);box-shadow:0 2px 0 var(--ink)}
.mpk .schip small{display:block;font-weight:600;color:var(--muted);font-size:.72rem}
.mpk .schip.bald{opacity:.45}
.mpk .msring text{font:700 12px var(--bfont);fill:var(--ink)}
.mpk .stand{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px;text-align:center}
.mpk .stand b{display:block;font-size:.9rem;margin-top:4px}.mpk .stand small{color:var(--muted);font-size:.74rem}
.mpk details.mssec{margin-top:10px}
.mpk details.mssec>summary{list-style:none;display:flex;align-items:center;gap:10px;cursor:pointer;min-height:44px}
.mpk details.mssec>summary::-webkit-details-marker{display:none}
.mpk details.mssec>summary h2{margin:0;font:700 1.12rem var(--hfont);flex:1}
.mpk details.mssec>summary .pf{font-size:1.1rem;color:var(--muted);transition:transform .2s}
.mpk details.mssec[open]>summary .pf{transform:rotate(90deg)}
.mpk .ico{font-size:1.35rem;width:30px;text-align:center}
.mpk .pr{margin:6px 0 8px;font-size:.85rem;color:var(--muted)}
.mpk .menu{display:grid;gap:6px}
.mpk .menuitem{display:flex;justify-content:space-between;align-items:center;gap:8px}
.mpk .menuitem small{color:var(--muted);font-weight:600;white-space:nowrap}
.mpk .baustein{display:flex;justify-content:space-between;gap:8px;font-size:.85rem;padding:4px 0;border-top:1px dashed var(--line)}
.mpk .baustein:first-of-type{border-top:0}
.mpk .mstempel{display:inline-block;border:2px solid var(--stb);color:var(--stb);border-radius:8px;padding:2px 8px;font:800 .78rem var(--bfont);transform:rotate(-3deg)}
.mpk .msbar{height:8px;border-radius:5px;background:var(--line);overflow:hidden;margin-top:6px}.mpk .msbar i{display:block;height:100%;background:var(--stb)}
.mpk .mstema{border:2px solid var(--line);border-radius:14px;padding:10px 12px;margin:8px 0;background:var(--paper)}
.mpk .mstema.tipp{border-color:var(--lamp)}
.mpk .mstema .einh{display:grid;gap:6px;margin-top:8px}
</style>`;

const fach = id => id === S.course ? S : ((S.courses || {})[id] || {});
const bestanden = id => S.scheine && S.scheine[id] && S.scheine[id].ok;
const begonnen = id => id === S.course || id === S.crewSchein || Object.keys(qsVon(id)).length > 0;
const farbe = id => COURSE_COLOR[id] || '#f0b53e';
function ring(v, size, col, txt) {
  const r = size / 2 - 5, u = 2 * Math.PI * r;
  return `<svg class="msring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="6"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(u * Math.max(.001, v)).toFixed(1)} ${u.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    ${txt != null ? `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central">${txt}</text>` : ''}</svg>`;
}
/* Gesamtstand für die Schein-Leiste: Mittel der Bereiche */
function gesamt(id) { const f = fortschritt(id), t = [f.theorie.v, f.praxis.v].concat(f.navi ? [f.navi.v] : []); return t.reduce((a, b) => a + b, 0) / t.length; }
function signalThemen(id) { return (SIGNALE[id] || []).map(t => COURSES[id].topics.find(x => x.id === t)).filter(Boolean); }
function probe(id) { const ex = fach(id).exams || []; return {alle: ex, letzte: ex.slice(-3), ok: ex.slice(-3).filter(e => e.pass).length}; }
/* Gelernt wird von hier aus: am Ende kommt man wieder hierher (lernHeim in index.html) */
const los = fn => () => { AUD.unlock(); AUD.click(); lernHeim = 'pruef'; returnTo = 'cabin'; fn(); };

function seite(id) {
  if (id) S.lernSchein = id;
  scheinAktiv(S.lernSchein && COURSES[S.lernSchein] ? S.lernSchein : S.course);
  subScreen(); place = 'pruef';
  const cur = S.course, C = COURSE, f = fortschritt(cur), pr = probe(cur), ok = bestanden(cur), partner = PARTNER[cur];
  const chip = c => { const g = begonnen(c) ? gesamt(c) : 0;
    return `<button class="schip" data-s="${c}" aria-pressed="${c === cur}">${ring(bestanden(c) ? 1 : g, 40, farbe(c))}<span>${esc(COURSES[c].short)} ${c === S.crewSchein ? '⚓' : ''}${bestanden(c) ? '🎓' : ''}<small>${bestanden(c) ? 'bestanden' : begonnen(c) ? proz(g) : 'noch nicht begonnen'}</small></span></button>`; };
  const zeile = (key, label, info) => `<button class="menuitem" data-go="${key}"><span>${label}</span>${info ? `<small>${esc(info)}</small>` : ''}</button>`;
  const sek = (k, ico, titel, wert, inhalt) => `<details class="card mssec" data-sec="${k}"${offen[k] ? ' open' : ''}><summary><span class="ico" aria-hidden="true">${ico}</span><h2>${esc(titel)}</h2>${wert != null ? ring(wert, 42, 'var(--stb)', Math.round(wert * 100)) : ''}<span class="pf" aria-hidden="true">›</span></summary>${inhalt}</details>`;
  const items = C.items(), sigT = signalThemen(cur);
  /* Bausteine der Theorie: Basis gemeinsam mit dem Partner-Schein, dann die eigenen Zusätze */
  const bau = [];
  if (partner) {
    const b = fragenStand(cur, BASIS), z = fragenStand(cur, q => !BASIS(q) && (cur !== 'binnen' || q.n <= 253));
    bau.push(`<div class="baustein"><span>Basisfragen 🔗 <small class="muted">gelten auch für ${esc(COURSES[partner].short)}</small></span><b>${b.sicher} von ${b.n}</b></div>`);
    bau.push(`<div class="baustein"><span>${cur === 'sbf' ? 'See-Fragen' : 'Binnen-Fragen'}</span><b>${z.sicher} von ${z.n}</b></div>`);
    if (cur === 'binnen') { const g = fragenStand(cur, q => q.n >= 254); bau.push(`<div class="baustein"><span>Segelfragen <small class="muted">${S.binSegel ? 'zählen mit' : 'nur mit Segeln, zählen gerade nicht'}</small></span><b>${g.sicher} von ${g.n}</b></div>`); }
  } else bau.push(`<div class="baustein"><span>Fragen und Antworten</span><b>${f.theorie.sicher} von ${f.theorie.n}</b></div>`);
  const prText = cur === 'sks' ? 'In der Prüfung: Fragebogen mit freien Antworten (60 Punkte, bestanden ab 39) und eine Kartenaufgabe.'
    : `In der Prüfung: ${esc(C.exam.desc)}${cur === 'sbf' ? ' Dazu die Navigationsaufgabe.' : ''}`;
  app.innerHTML = `${CSS}<div class="mpk"><div class="topbar"><button class="btn small ghost" id="back">← Kajüte</button><b class="tbtitle">Meine Prüfungen</b><span></span></div>
    <div class="schips" role="group" aria-label="Schein wählen">${Object.keys(COURSES).map(chip).join('')}${COURSES_SOON.map(c => `<button class="schip bald" aria-disabled="true" data-bald="${c.id}">${ring(0, 40, 'var(--line)')}<span>${esc(c.name.split(' ')[0])}<small>kommt später</small></span></button>`).join('')}</div>
    <p class="small muted" style="margin:2px 0 8px">⚓ Crew-Schein: <b>${esc(COURSES[S.crewSchein].short)}</b>. Um ihn kümmert sich die Crew an Bord. Lernen kannst du hier jeden Schein. <button class="linkbtn" id="crew">ändern</button></p>
    ${ok ? `<div class="card" style="border-color:var(--stb)"><p style="margin:0"><span class="mstempel">BESTANDEN</span> am <b>${fmtDate(ok)}</b>. ${esc(C.short)} ist in der Tasche!</p>
      <p class="small muted" style="margin:6px 0 8px">Dein Lernstand bleibt, hier kannst du jederzeit auffrischen.</p>${NAECHSTER[cur] && !bestanden(NAECHSTER[cur]) ? `<button class="btn small" data-s="${NAECHSTER[cur]}">Als Nächstes: ${esc(COURSES[NAECHSTER[cur]].short)}</button>` : ''}</div>` : ''}
    <section class="card"><h3 style="margin:0 0 8px">Dein Stand · ${esc(C.short)}</h3><div class="stand">
      <div>${ring(f.theorie.v, 74, farbe(cur), proz(f.theorie.v))}<b>Theorie</b><small>${f.theorie.sicher} von ${f.theorie.n} sicher</small></div>
      ${f.navi ? `<div>${ring(f.navi.v, 74, farbe(cur), proz(f.navi.v))}<b>Navigation</b><small>${f.navi.done} von ${f.navi.n} Lektionen</small></div>` : ''}
      <div>${ring(f.praxis.v, 74, farbe(cur), proz(f.praxis.v))}<b>Praxis</b><small>${f.praxis.man}/${f.praxis.manN} Manöver · ${f.praxis.knoten}/${f.praxis.knotenN} Knoten</small></div></div>
      <p class="small muted" style="margin:8px 0 0">Jede Anzeige geht bis 100 %. Theorie: Eine Frage zählt voll, wenn sie dreimal in Folge richtig war. Praxis zählt für jeden Schein, du lernst sie nur einmal.</p></section>
    ${sek('theorie', '📖', 'Theorie', f.theorie.v, `<p class="pr">${prText}</p>${bau.join('')}<div class="menu" style="margin-top:8px">${zeile('themen', 'Themen frei wählen', C.topics.length + ' Themen')}${zeile('wdh', 'Wiederholen', todayNumbers().due + ' fällig')}${zeile('fallen', C.kind === 'mc' ? 'Prüfungsfallen' : 'Wackelkandidaten', 'die gemeinen Fragen')}${C.kind === 'mc' ? zeile('lex', 'Lexikon', 'Bilder und Tonfolgen') : ''}</div>`)}
    ${sek('zeichen', '🚩', cur === 'sks' ? 'Seezeichen (Auffrischen)' : 'Seezeichen und Signale', sigT.length ? fragenStand(cur, q => sigT.some(t => t.has(q))).v : null,
      `<p class="pr">${cur === 'sks' ? 'Für den SKS setzt die Prüfung die Seezeichen des SBF See voraus. Hier frischst du sie auf.' : 'In der Prüfung: Bild, Zeichen oder Tonfolge, dazu die richtige Bedeutung ankreuzen. Erst der Grundkurs, dann die Prüfungsfragen.'}</p>
      <div class="menu">${zeile('kurs', '⭐ ' + (cur === 'binnen' ? 'Grundkurs Zeichen Binnen' : 'Grundkurs Seezeichen'), cur === 'binnen' ? '3 Lektionen' : 'Originalbilder')}${sigT.map(th => { const st2 = fragenStand(cur, th.has); return zeile('sig:' + th.id, esc(th.name), st2.sicher + ' von ' + st2.n + ' sicher'); }).join('')}</div>
      <p class="small muted" style="margin:8px 0 0">${cur === 'binnen' ? 'Die Spiele in der Spielekiste zeigen die Regeln auf See. Für Binnen zählen die Prüfungsfragen hier.' : 'Zum Hören und Sehen wie in echt gibt es Spiele in der Spielekiste (Schallsignale, Lichter, Leuchtfeuer, Tonnen-Slalom).'}</p>`)}
    ${f.navi ? sek('navi', '🧭', 'Navigation', f.navi.v, `<p class="pr">${cur === 'sks' ? 'In der Prüfung: Kartenaufgabe mit 30 Punkten, bestanden ab 20.' : 'In der Prüfung: Navigationsaufgabe auf der Übungskarte, mindestens 7 von 9 Punkten.'} Gelernt wird mit einer erfundenen Übungskarte, gerechnet wird wie auf der echten.</p>
      <div class="menu">${zeile('navi', 'Navigationsschule', f.navi.done + ' von ' + f.navi.n + ' Lektionen mit Stern')}</div>`) : ''}
    ${sek('praxis', '🪢', 'Praxis', f.praxis.v, `<p class="pr">${cur === 'sks' ? 'Im SKS wird unter Segeln und mit Motor geprüft. Hier übst du die Motor-Manöver und die Knoten.' : 'In der praktischen Prüfung: Manöver mit Motor und Knoten. Von den 9 Knoten werden 7 verlangt, 6 müssen sitzen.'}</p>
      <div class="menu">${zeile('man', 'Manöver fahren', f.praxis.man + ' von ' + f.praxis.manN + ' ausreichend')}${zeile('knoten', 'Knotenbrett', f.praxis.knoten + ' von ' + f.praxis.knotenN + ' sicher')}${zeile('knotenkunde', 'Knotenkunde', 'Erkennen, Wofür, Reihenfolge')}</div>`)}
    ${sek('pruefung', '🎓', 'Probeprüfung', null, `<p class="pr">Wie in der echten Prüfung: gleiche Fragenzahl, gleiche Zeit, gleiche Bestehensregel. ${esc(C.exam.rule.split('. ')[0])}.</p>
      <div class="menu">${zeile('harms', 'Kapitän Harms prüft dich', pr.alle.length ? 'zuletzt: ' + pr.letzte.map(e => e.pass ? '✓' : '✗').join(' ') : 'noch keine')}${f.navi ? zeile('naviexam', 'Navigationsaufgabe auf Zeit', 'ohne Hilfen') : ''}</div>`)}
    <div class="card"><b>${ok ? 'Eintrag ändern' : 'Echte Prüfung bestanden?'}</b><p class="small muted" style="margin:4px 0 8px">${ok ? 'Falls du dich vertippt hast.' : 'Trag es hier ein. Der Schein bekommt ein 🎓, dein Lernstand bleibt.'}</p><button class="btn small${ok ? ' ghost' : ''}" id="msok">${ok ? 'Eintrag löschen' : 'Bestanden eintragen'}</button></div></div>`;
  $('#back').onclick = () => { AUD.click(); lernHeim = null; setTab('cabin'); };
  app.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { AUD.click(); seite(b.dataset.s); window.scrollTo(0, 0); });
  app.querySelectorAll('[data-bald]').forEach(b => b.onclick = () => toast('Kommt, sobald die amtlichen Kataloge da sind.'));
  app.querySelectorAll('details.mssec').forEach(d => d.addEventListener('toggle', () => { offen[d.dataset.sec] = d.open; if (d.open) AUD.click(); }));
  $('#crew').onclick = crewWahl;
  $('#msok').onclick = () => ok ? (delete S.scheine[cur], save(), seite()) : bestandenSheet(cur);
  const kn = () => loadKnoten().then(() => KNOTEN.spiel()).catch(() => toast('Die Knoten ließen sich nicht laden.'));
  const GO = {themen: () => themen(), wdh: () => reviewSession(), fallen: () => trapRound(), lex: () => renderLexikon(), navi: () => navSchool(), man: () => maneuverGame(), knoten: () => knotenBrett(), knotenkunde: kn,
    harms: () => examIntro('harms'), naviexam: () => loadNavi().then(() => NAV.exam()), kurs: () => seezeichenKurs(cur === 'binnen' ? 'binnen' : 'see')};
  app.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { const g = b.dataset.go; if (g.startsWith('sig:')) return themaSheet(TOPICS.find(t => t.id === g.slice(4))); if (GO[g]) los(GO[g])(); });
}

/* ---------- Themen: frei wählbar, der Stern zeigt das nächste ---------- */
function einheiten(th) {
  return UNITS.filter(u => u.topic === th).map(u => `<button class="menuitem" data-u="${u.id}"><span>${esc(u.label.replace(th.name, '').replace(/^ \((.*)\)$/, '$1') || 'Alle Fragen')}</span><small>${STAGE_NAMES[unitStage(u)]}</small></button>`).join('');
}
function naechstesThema() { const u = UNITS.find(x => ['vorab', 'erklaert'].includes(unitStage(x))) || UNITS.find(x => unitStage(x) === 'neu'); return u && u.topic; }
function bindUnits(root) { root.querySelectorAll('[data-u]').forEach(b => b.onclick = () => { closeSheet(); const u = UNITS.find(x => x.id === b.dataset.u); if (u) los(() => startUnit(u))(); }); }
function themen() {
  subScreen(); place = 'pruef';
  const tipp = naechstesThema(), partner = PARTNER[S.course];
  app.innerHTML = `${CSS}<div class="mpk"><div class="topbar"><button class="btn small ghost" id="back">← Meine Prüfungen</button><b class="tbtitle">Theorie · ${esc(COURSE.short)}</b><span></span></div>
    <p class="small muted" style="margin:10px 2px">Die Reihenfolge ist ein Vorschlag der Crew, der Stern zeigt das nächste Thema. Du darfst jedes Thema jederzeit wählen. Jedes Kapitel: erst raten, dann erklären lassen, dann nochmal.</p>
    ${TOPICS.map(th => { const s = topicStats(th), basis = partner && th.to && th.to <= 72;
      return `<div class="mstema${th === tipp ? ' tipp' : ''}"><div class="row" style="justify-content:space-between"><b>${th === tipp ? '⭐ ' : ''}${esc(th.name)}${basis ? ' 🔗' : ''}</b><small class="muted">${s.m} von ${s.total} sicher</small></div>
      ${basis ? `<small class="muted">Basis: gilt auch für ${esc(COURSES[partner].short)}</small>` : ''}<div class="msbar"><i style="width:${s.total ? Math.round(s.m / s.total * 100) : 0}%"></i></div><div class="einh">${einheiten(th)}</div></div>`; }).join('')}</div>`;
  $('#back').onclick = () => { AUD.click(); seite(); };
  bindUnits(app);
}
function themaSheet(th) {
  if (!th) return;
  const s = topicStats(th), w = sheet(`${CSS}<div class="mpk"><h2 style="margin:0 0 4px">${esc(th.name)}</h2><p class="small muted" style="margin:0 0 8px">${s.m} von ${s.total} Fragen sicher. Gefragt wird wie in der Prüfung.</p><div class="menu">${einheiten(th)}</div></div>`);
  bindUnits(w);
}

/* ---------- Crew-Schein und „bestanden“ ---------- */
function crewWahl() {
  const w = sheet(`<h2 style="margin:0 0 4px">Crew-Schein</h2><p class="small muted" style="margin:0 0 10px">Um diesen Schein kümmern sich Hinnerk, Smilla und Klabauter an Bord: Kurs für heute, Kajütenfunk, Gespräche. Lernen kannst du in „Meine Prüfungen“ trotzdem jeden Schein.</p>
    <div class="menu">${Object.keys(COURSES).map(c => `<button class="menuitem" data-c="${c}"><b>${esc(COURSES[c].name)}</b>${c === S.crewSchein ? '<small>⚓ jetzt</small>' : ''}</button>`).join('')}</div>`);
  w.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { S.crewSchein = b.dataset.c; save(); closeSheet(); toast('Die Crew kümmert sich jetzt um ' + COURSES[S.crewSchein].short + '.'); seite(); });
}
function bestandenSheet(id) {
  const heute = new Date().toISOString().slice(0, 10);
  const w = sheet(`<h2 style="margin:0 0 4px">${esc(COURSES[id].short)} bestanden</h2><p class="small muted" style="margin:0 0 10px">Wann war die Prüfung?</p>
    <input type="date" id="msdat" value="${heute}" max="${heute}"><button class="btn lamp wide" id="msja" style="margin-top:10px">Eintragen</button>`);
  w.querySelector('#msja').onclick = () => { const d = w.querySelector('#msdat').value || heute; S.scheine = S.scheine || {}; S.scheine[id] = {ok: d}; save(); closeSheet(); AUD.sfx('richtig', {vol: .5}); toast('Glückwunsch, Kapitän! Eingetragen.'); LOG.add('schein', COURSES[id].short + ' bestanden'); seite(); };
}

window.SCHEIN = {seite, themen};
})();

/* crew.js: Crew-Regisseur (v5.21, Nutzer 04.11.2026 „Lebendige Crew, Dialogsteuerung und Crew-Gedächtnis“).
   Ganz ohne Live-KI: Er wählt aus vorgeschriebenen (später eingesprochenen) Gesprächen in data/crew-dialoge.json das passende aus.
   Regeln: passt zu Ort und Gedächtnis (wenn/nicht), höchstens so oft wie erlaubt (max), nicht zu bald wieder (pause in Folgen),
   höhere Priorität zuerst, sonst Zufall mit Gewicht; die Crew darf auch schweigen (ruhe). Gespräche unter der Crew brauchen keinen Spieler.
   Gedächtnis S.crewMem {f: {merkmal: Datum}, g: {gespraechId: {n, lauf}}, lauf: Zähler der Plauder-Gelegenheiten} (R7: Standard beim ersten Aufruf).
   Schnittstelle: CREWDIR.merke(id) · CREWDIR.weiss(id) · CREWDIR.waehle(ort) · CREWDIR.plaudern(ort, sprich) · CREWDIR.laden() */
window.CREWDIR = (() => {
  let D = null;
  const laden = () => D ? Promise.resolve(D) : fetch('data/crew-dialoge.json?v=' + window.__ver).then(r => r.json()).then(j => (D = j)).catch(() => (D = {gespraeche: [], ruhe: {}}));
  function mem() { if (!S.crewMem || typeof S.crewMem !== 'object') S.crewMem = {}; const m = S.crewMem; m.f = m.f || {}; m.g = m.g || {}; m.lauf = m.lauf || 0; return m; }
  const merke = id => { const m = mem(); if (!m.f[id]) { m.f[id] = new Date().toISOString().slice(0, 10); save(); } };
  const weiss = id => !!mem().f[id];
  /* Bedingungen: Merkmal (aus dem Gedächtnis), Freigabe (S.freigaben), fertige Folge (S.folgen) */
  /* frei:id fragt seit v5.22 das Ausbildungsheft (LERN.darf; alte Freigabe-IDs wie fender werden umgestellt) */
  const frei = id => window.LERN ? LERN.darf(LERN.ALT[id] || id) : !!(S.freigaben && S.freigaben[id] && S.freigaben[id].frei);
  const test = x => x.startsWith('frei:') ? frei(x.slice(5)) : x.startsWith('folge:') ? !!(S.folgen && S.folgen[x.slice(6)] && S.folgen[x.slice(6)].fertig) : weiss(x);
  const gilt = b => !b || (Array.isArray(b) ? b : [b]).every(test);
  const gegen = b => !b || !(Array.isArray(b) ? b : [b]).some(test);
  function kandidaten(ort) { const m = mem();
    return (D.gespraeche || []).filter(g => (!g.ort || g.ort.includes(ort)) && gilt(g.wenn) && gegen(g.nicht)
      && (g.max == null || ((m.g[g.id] || {}).n || 0) < g.max) && (m.lauf - ((m.g[g.id] || {}).lauf ?? -99)) >= (g.pause ?? 10)); }
  /* Auswahl: höchste Priorität gewinnt, innerhalb gleicher Priorität Zufall (seltener Gehörtes bevorzugt) */
  function waehle(ort) { if (!D) return null; const m = mem(); m.lauf++;
    const k = kandidaten(ort); if (!k.length) { save(); return null; }
    const top = Math.max(...k.map(g => g.prio || 0)), wahl = k.filter(g => (g.prio || 0) === top);
    if (!top && Math.random() < ((D.ruhe || {})[ort] ?? .3)) { save(); return null; } /* schweigen ist erlaubt */
    const gew = wahl.map(g => 1 / (1 + ((m.g[g.id] || {}).n || 0))), sum = gew.reduce((a, b) => a + b, 0); let r = Math.random() * sum, g = wahl[0];
    for (let i = 0; i < wahl.length; i++) { r -= gew[i]; if (r <= 0) { g = wahl[i]; break; } }
    const e = m.g[g.id] = m.g[g.id] || {n: 0}; e.n++; e.lauf = m.lauf; if (g.merke) (Array.isArray(g.merke) ? g.merke : [g.merke]).forEach(x => { if (!m.f[x]) m.f[x] = new Date().toISOString().slice(0, 10); });
    save(); return g; }
  /* Ein Gespräch spielen: sprich(wer, text) muss ein Promise liefern (3D: api.sprich). Varianten: eine Zeile darf {wer, v: [Texte]} sein */
  async function plaudern(ort, sprich) { await laden(); const g = waehle(ort); if (!g) return null;
    for (const z of g.zeilen) { const t = z.v ? z.v[Math.floor(Math.random() * z.v.length)] : z.t; await sprich(z.wer, t); } return g.id; }
  return {laden, merke, weiss, waehle, plaudern, kandidaten: ort => { mem(); return D ? kandidaten(ort).map(g => g.id) : []; }};
})();

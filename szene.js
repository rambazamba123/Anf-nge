/* Szenen-Player und Vorlesen (VISION.md H2, N1, M14), nachgeladen über nachladen('szene.js').
   SZENE.spiele(schritte, opt): ein Format für alles Gesprochene der Reise (Tagesbesprechung, Einweisungen, Rundgänge, Häppchen).
     Schritte:
       {wer: 'hinnerk'|'smilla'|'klabauter'|'kroeger', t: 'Satz'}   gesprochen; fester Satz (R10), kommt ins Stimmenpaket
       {bild: 'img/…', alt: '…'}                                    Bild zeigen (bleibt, bis das nächste kommt)
       {wahl: 'Frage?', opts: [{t: 'Knopf', ok: true?, wert: 'x', dann: [Schritte]}]}   du entscheidest mit; ok/falsch nur bei Wissensfragen
       {knopf: 'Weiter'}                                            wartet auf Tippen
       {pause: 2}                                                   Sekunden Stille
       {aktion: 'name', …}                                          opt.aktionen[name](schritt) → Promise, z. B. Werkzeug öffnen
       {frage: 123}                                                 amtliche Frage mit Vorlesen und Zuruf (opt.frage(n) liefert sie)
     Ergebnis: Promise {ende: 'fertig'|'abgebrochen', wahlen: {wert…}}
   SZENE.frage(q, order, opt): Frage und Antworten vorlesen (Handystimme, kostet nichts), dazu Zuruf.
     Zuruf (VS43, Nutzer 28.10.2026): während des Vorlesens zählen nur Alfa, Bravo, Charlie, Delta; danach auch A bis D.
     Vorgelesen werden die Antworten mit „A, B, C, D“, damit das Mikrofon die Funkwörter nicht aus dem Lautsprecher hört. */
window.SZENE = (() => {
  const NAMEN = {hinnerk: "Käpt'n", smilla: 'Smilla', klabauter: 'Klabauter', kroeger: 'Harms'};
  const BUCHST = ['A', 'B', 'C', 'D'];
  let aktiv = null, hoer = null;

  /* ---------- Szenen ---------- */
  function stop() { if (aktiv) { aktiv.aus = true; if (aktiv.weiter) aktiv.weiter(); } aktiv = null; zurufAus(); }
  const warte = (me, ms) => new Promise(r => { const t = setTimeout(r, ms); me.weiter = () => { clearTimeout(t); r(); }; });
  function sprecher(cid) { return CREW[cid] ? cid : (S.crew && S.crew[cid]) || 'hinnerk'; }

  async function spiele(schritte, opt = {}) {
    stop();
    const box = opt.box; if (!box) return {ende: 'abgebrochen', wahlen: {}};
    const me = aktiv = {aus: false, weiter: null, wahlen: {}};
    box.innerHTML = `<div class="szene"><div class="szbild" id="szbild"></div><div class="szrede" id="szrede"></div><div class="szwahl" id="szwahl"></div>
      <div class="row szsteuer"><button class="btn small ghost" id="szweiter">⏩ Weiter</button>${opt.ueberspringbar === false ? '' : '<button class="btn small ghost" id="szende">Szene überspringen</button>'}</div></div>`;
    const q = s => box.querySelector(s);
    q('#szweiter').onclick = () => { VOX.stop('Szene weiter'); if (me.weiter) me.weiter(); };
    const se = q('#szende'); if (se) se.onclick = () => { me.ende = 'abgebrochen'; VOX.stop('Szene übersprungen'); me.aus = true; if (me.weiter) me.weiter(); };
    AUD.unlock();
    await lauf(schritte, me, q, opt);
    if (aktiv === me) aktiv = null;
    VOX.stop('Szene zu Ende');
    return {ende: me.ende || (me.aus ? 'abgebrochen' : 'fertig'), wahlen: me.wahlen};
  }

  async function lauf(schritte, me, q, opt) {
    for (const s of schritte || []) {
      if (me.aus) return;
      if (s.wer && s.t) {
        const cid = sprecher(s.wer);
        q('#szrede').innerHTML = `<div class="szzeile">${charSVG(cid)}<div class="say"><b>${esc(NAMEN[cid] || CREW[cid].short)}:</b> ${esc(s.t)}</div></div>`;
        await Promise.race([VOX.say(cid, s.t, s.art || opt.art || 'fixed'), new Promise(r => { me.weiter = r; })]);
        me.weiter = null;
        if (!me.aus) await warte(me, 250);
      } else if (s.bild) {
        q('#szbild').innerHTML = `<img src="${esc(s.bild)}" alt="${esc(s.alt || '')}">`;
      } else if (s.knopf) {
        await new Promise(r => { const b = document.createElement('button'); b.className = 'btn lamp wide'; b.textContent = s.knopf; b.onclick = () => { AUD.click(); r(); }; q('#szwahl').innerHTML = ''; q('#szwahl').appendChild(b); me.weiter = r; });
        q('#szwahl').innerHTML = ''; me.weiter = null;
      } else if (s.pause) {
        await warte(me, s.pause * 1000); me.weiter = null;
      } else if (s.wahl) {
        const o = await waehle(s, me, q); me.weiter = null;
        if (me.aus || !o) return;
        if (s.id) me.wahlen[s.id] = o.wert != null ? o.wert : o.t;
        if (o.dann) await lauf(o.dann, me, q, opt);
      } else if (s.aktion) {
        const f = opt.aktionen && opt.aktionen[s.aktion];
        if (f) { VOX.stop('Aktion'); const r = await f(s, me); if (r && s.id) me.wahlen[s.id] = r; }
      } else if (s.frage != null) {
        const fr = opt.frage && opt.frage(s.frage); if (!fr) continue;
        const r = await frageInSzene(fr, me, q); if (s.id) me.wahlen[s.id] = r;
      }
    }
  }

  function waehle(s, me, q) {
    const w = q('#szwahl');
    w.innerHTML = `<p class="small" style="margin:0 0 6px"><b>${esc(s.wahl)}</b></p>` + s.opts.map((o, i) => `<button class="btn ${o.empfohlen ? '' : 'ghost'} szopt" data-o="${i}">${esc(o.t)}${o.empfohlen ? ' <small>⭐ Empfehlung</small>' : ''}</button>`).join('');
    return new Promise(res => {
      me.weiter = () => { if (me.aus) res(null); };   /* „Weiter“ überspringt keine Entscheidung, nur „Szene überspringen“ */
      w.querySelectorAll('[data-o]').forEach(b => b.onclick = async () => {
        const o = s.opts[+b.dataset.o]; AUD.click();
        w.querySelectorAll('button').forEach(x => x.disabled = true);
        if (o.ok != null) { AUD.sfx(o.ok ? 'richtig' : 'falsch', {vol: .7}); b.style.background = o.ok ? 'var(--stb-soft)' : 'var(--bb-soft)'; await new Promise(r => setTimeout(r, 900)); }
        w.innerHTML = ''; res(o);
      });
    });
  }

  /* Amtliche Frage mitten in einer Szene: vorlesen, antworten, zählt wie im Quiz */
  function frageInSzene(fr, me, q) {
    const order = [0, 1, 2, 3].sort(() => Math.random() - .5), w = q('#szwahl');
    w.innerHTML = `<p style="margin:0 0 6px"><b>${esc(fr.q)}</b></p>${fr.img ? fr.img.map(s => `<img src="${esc(s)}" alt="" style="max-width:100%;max-height:180px">`).join('') : ''}` +
      order.map((k, j) => `<button class="ans" data-k="${k}"><b class="abc">${BUCHST[j]}</b> ${esc(fr.a[k])}</button>`).join('');
    return new Promise(res => {
      let ctl = null;
      const fertig = k => {
        if (ctl) ctl.stop(); VOX.stop('Antwort');
        const ok = k === 0; AUD.sfx(ok ? 'richtig' : 'falsch', {vol: .6});
        w.querySelectorAll('.ans').forEach(b => { b.disabled = true; const kk = +b.dataset.k; if (kk === 0) b.classList.add('ok'); else if (kk === k) b.classList.add('no'); });
        if (typeof record === 'function' && fr.n && S.course !== 'sks') { try { record(fr.n, ok); } catch (e) {} }
        setTimeout(() => { w.innerHTML = ''; res(ok ? 'richtig' : 'falsch'); }, 1600);
      };
      me.weiter = () => { if (me.aus) { if (ctl) ctl.stop(); res(null); } else VOX.stop('Vorlesen übersprungen'); };
      w.querySelectorAll('.ans').forEach(b => b.onclick = () => fertig(+b.dataset.k));
      ctl = frage(fr, order, {onPick: fertig});
    });
  }

  /* ---------- Vorlesen und Zuruf ---------- */
  function vorlesenAn() { return !S.cfg || S.cfg.vorlesen !== false; }
  function zurufAn() { return !!(S.cfg && S.cfg.zuruf) && !!(window.SpeechRecognition || window.webkitSpeechRecognition); }
  function text(q, order) {
    const f = String(q.q).replace(/\s*\(([●▬\s]+)\)/, '').trim();
    return f + ' ' + order.map((k, j) => BUCHST[j] + ': ' + String(q.a[k]).trim().replace(/[.!?]*$/, '.')).join(' ');
  }
  /* Funkwörter und Buchstaben → Platz 0–3 der angezeigten Reihenfolge */
  const FUNK = [/\balfa\b|\balpha\b/, /\bbravo\b/, /\bcharl(ie|y|i)\b|\btschar?l/, /\bdelta\b/];
  const LAUT = [/^(a|ah|aa)$/, /^(b|be|bee|beh)$/, /^(c|ce|zeh|tse|cee)$/, /^(d|de|dee|deh)$/];
  function deute(t, auchLaut) {
    t = String(t).toLowerCase().replace(/[.,!?]/g, ' ').trim();
    for (let i = 0; i < 4; i++) if (FUNK[i].test(t)) return i;
    if (auchLaut) { const w = t.split(/\s+/).pop(); for (let i = 0; i < 4; i++) if (LAUT[i].test(w)) return i; }
    return -1;
  }
  function zurufAus() { if (hoer) { hoer.aus = true; try { hoer.rec && hoer.rec.abort(); } catch (e) {} if (hoer.anzeige) hoer.anzeige(''); } hoer = null; }
  function zuruf(onPlatz, anzeige) {
    zurufAus();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return null;
    const h = hoer = {aus: false, laut: false, rec: null, anzeige, bis: Date.now() + 60000};
    const start = () => {
      if (h.aus) return;
      if (Date.now() > h.bis) { anzeige && anzeige(''); return; }
      const rec = h.rec = new SR(); rec.lang = 'de-DE'; rec.interimResults = true; rec.continuous = true; rec.maxAlternatives = 3;
      rec.onresult = ev => {
        for (let i = ev.resultIndex; i < ev.results.length; i++) for (let a = 0; a < ev.results[i].length; a++) {
          const p = deute(ev.results[i][a].transcript, h.laut);
          if (p >= 0 && !h.aus) { h.aus = true; try { rec.abort(); } catch (e) {} anzeige && anzeige(''); return onPlatz(p); }
        }
      };
      rec.onerror = ev => { if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') { h.aus = true; anzeige && anzeige('🎙️ Kein Mikrofon erlaubt'); } };
      rec.onend = () => { if (!h.aus) setTimeout(start, 120); };
      try { rec.start(); anzeige && anzeige(h.laut ? '🎙️ Ich höre: Alfa bis Delta oder A bis D' : '🎙️ Ich höre: Alfa, Bravo, Charlie, Delta'); } catch (e) { setTimeout(start, 300); }
    };
    start();
    /* nach dem Vorlesen: neu starten, damit Reste aus dem Lautsprecher nicht zählen, dann auch A bis D */
    h.vorbei = () => { if (h.aus) return; h.laut = true; h.bis = Date.now() + 30000; try { h.rec && h.rec.abort(); } catch (e) {} };
    return h;
  }
  /* q: {q, a[4]} (a[0] richtig), order: angezeigte Reihenfolge, opt.onPick(k) bekommt den Index in q.a */
  function frage(q, order, opt = {}) {
    const wer = sprecher(opt.wer || 'M');
    const ctl = {aus: false, stop() { this.aus = true; zurufAus(); VOX.stop('Frage beantwortet'); }};
    const anzeige = t => { const el = opt.anzeigeEl || document.getElementById('zurufinfo'); if (el) el.textContent = t; };
    const h = zurufAn() && opt.onPick ? zuruf(p => { if (!ctl.aus) { ctl.aus = true; VOX.stop('Zuruf'); opt.onPick(order[p]); } }, anzeige) : null;
    (async () => {
      if (vorlesenAn()) await VOX.say(wer, text(q, order), 'local');
      if (!ctl.aus && h) h.vorbei();
    })();
    return ctl;
  }

  return {spiele, stop, frage, text, deute, vorlesenAn, zurufAn};
})();

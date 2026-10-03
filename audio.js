/* ==========================================================================
   Ton-Mischpult
   Drei Kanäle (Musik, Geräusche, Effekte) mit weichen Übergängen.
   Musik wird leiser, sobald jemand spricht.
   ========================================================================== */
const AUD = (() => {
  const FILES = {
    'musik-intro': 'audio/musik-intro.mp3', 'musik-lernen': 'audio/musik-lernen.mp3',
    'musik-deck': 'audio/musik-deck.mp3', 'musik-abend': 'audio/musik-abend.mp3',
    wellen: 'audio/wellen.mp3', wind: 'audio/wind.mp3', windLeise: 'audio/wind-leise.mp3',
    regen: 'audio/regen.mp3', uhr: 'audio/uhr.mp3', segel: 'audio/segel.mp3', glocke: 'audio/glocke.mp3',
    moewe: 'audio/moewe.mp3', nebelhornFern: 'audio/nebelhorn-fern.mp3', nebelhorn: 'audio/nebelhorn.mp3',
  };
  let ctx = null, master, bus = {}, filt, buffers = {}, loading = {};
  let music = {name: null, src: null, gain: null}, loops = {}, duckState = 0, events = [], unlocked = false;
  const cfg = () => (window.S && S.cfg) || {music: .35, amb: .6, sfx: .7};

  function init() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.connect(ctx.destination);
    filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 20000; filt.connect(master);
    ['music', 'amb', 'sfx'].forEach(k => { bus[k] = ctx.createGain(); bus[k].connect(k === 'amb' ? filt : master); });
    applyVolumes();
    return ctx;
  }
  function unlock() {
    init(); if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (!unlocked) { const b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource(); s.buffer = b; s.connect(master); s.start(0); unlocked = true; }
  }
  function applyVolumes() {
    if (!ctx) return; const c = cfg(), t = ctx.currentTime;
    bus.music.gain.setTargetAtTime(c.music * (duckState ? (music.name === 'musik-abend' ? .12 : .35) : 1), t, .25);
    bus.amb.gain.setTargetAtTime(c.amb, t, .3);
    bus.sfx.gain.setTargetAtTime(c.sfx, t, .1);
  }
  async function load(name) {
    if (buffers[name]) return buffers[name];
    if (loading[name]) return loading[name];
    init(); if (!ctx) return null;
    loading[name] = fetch(FILES[name]).then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); })
      .then(a => new Promise((res, rej) => ctx.decodeAudioData(a, res, rej)))
      .then(b => (buffers[name] = b)).catch(() => null);
    return loading[name];
  }

  /* ---------- Musik ---------- */
  async function playMusic(name) {
    if (!ctx || music.name === name) return;
    const old = music; music = {name, src: null, gain: null};
    if (old.gain) { old.gain.gain.setTargetAtTime(0, ctx.currentTime, .8); const s = old.src; setTimeout(() => { try { s.stop(); } catch (e) {} }, 4000); }
    applyVolumes();
    if (!name) return;
    const buf = await load(name); if (!buf || music.name !== name) return;
    const g = ctx.createGain(); g.gain.value = 0; g.connect(bus.music);
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.loopStart = .05; s.loopEnd = buf.duration - .05;
    s.connect(g); s.start(0, .05);
    g.gain.setTargetAtTime(1, ctx.currentTime, 1.2);
    music.src = s; music.gain = g;
  }
  function duck(on) { duckState = on ? 1 : 0; applyVolumes(); }

  /* ---------- Dauer-Geräusche ---------- */
  async function setLoop(name, vol, rate = 1) {
    if (!ctx) return;
    let L = loops[name];
    if (!vol) { if (L) L.gain.gain.setTargetAtTime(0, ctx.currentTime, .9); return; }
    if (!L) {
      L = loops[name] = {gain: ctx.createGain(), src: null}; L.gain.gain.value = 0; L.gain.connect(bus.amb);
      const buf = await load(name); if (!buf) return;
      const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.loopStart = .06; s.loopEnd = buf.duration - .06;
      s.playbackRate.value = rate; s.connect(L.gain); s.start(0, Math.random() * Math.max(0, buf.duration - 1)); L.src = s;
    }
    L.gain.gain.setTargetAtTime(vol, ctx.currentTime, .9);
  }
  function indoor(on) { if (!ctx) return; filt.frequency.setTargetAtTime(on ? 1100 : 20000, ctx.currentTime, .4); }

  /* ---------- Effekte ---------- */
  async function sfx(name, o = {}) {
    if (!ctx) return; const buf = await load(name); if (!buf) return;
    const g = ctx.createGain(); g.gain.value = o.vol == null ? 1 : o.vol; g.connect(bus.sfx);
    const s = ctx.createBufferSource(); s.buffer = buf; if (o.rate) s.playbackRate.value = o.rate; s.connect(g);
    const off = o.offset || 0, dur = o.dur || (buf.duration - off);
    s.start(0, off, dur);
    if (o.dur) { g.gain.setValueAtTime(g.gain.value, ctx.currentTime + Math.max(0, dur - .4)); g.gain.linearRampToValueAtTime(0, ctx.currentTime + dur); }
    return new Promise(r => { s.onended = r; });
  }
  /* Uhr: tickt n Sekunden lang (eine Sekunde = ein Tick) */
  function ticks(n, vol = .8) { return sfx('uhr', {offset: 1, dur: Math.max(1, n), vol}); }

  /* Zufällige Ereignisse je nach Wetter (Möwen, Nebelhorn, flatterndes Segel) */
  function clearEvents() { events.forEach(clearTimeout); events = []; }
  function every(minS, maxS, fn) {
    const tick = () => { fn(); events.push(setTimeout(tick, (minS + Math.random() * (maxS - minS)) * 1000)); };
    events.push(setTimeout(tick, (minS * .4 + Math.random() * minS) * 1000));
  }

  /* Wetterklang: wx = schoen | windig | sturm | regen | nebel, place = deck | kajuete | quiz | exam */
  function weather(wx, day, place) {
    if (!ctx) return;
    const out = place === 'deck' || place === 'intro', night = day === 'nacht', on = !(window.S && S.cfg && S.cfg.wxSound === false);
    const v = {wellen: 0, wind: 0, windLeise: 0, regen: 0, uhr: 0};
    if (on) {
      if (wx === 'windig') Object.assign(v, {wellen: .55, wind: .4, windLeise: .25});
      if (wx === 'sturm') Object.assign(v, {wellen: .6, wind: .5, windLeise: .3, regen: .5});
      if (wx === 'regen') Object.assign(v, {regen: .6});
      if (wx === 'nebel') Object.assign(v, {wellen: .12});
      if (wx === 'schoen' && out) v.wellen = .08;
      if (place === 'kajuete') v.uhr = .06;
      if (place === 'quiz') Object.keys(v).forEach(k => v[k] *= .35);
      if (place === 'exam') Object.keys(v).forEach(k => v[k] = 0);
    }
    Object.entries(v).forEach(([k, x]) => setLoop(k, x));
    indoor(place === 'kajuete' || place === 'quiz' || place === 'exam');
    clearEvents();
    if (!on || place === 'exam') return;
    if (!night && (wx === 'schoen' || wx === 'windig')) every(28, 75, () => sfx('moewe', {offset: Math.random() * 26, dur: 3 + Math.random() * 3, vol: out ? .45 : .2}));
    if (wx === 'nebel') every(40, 90, () => sfx(Math.random() < .6 ? 'nebelhornFern' : 'nebelhorn', {vol: out ? .5 : .25}));
    if (wx === 'windig' || wx === 'sturm') every(18, 50, () => sfx('segel', {vol: out ? .5 : .2, rate: .9 + Math.random() * .25}));
  }

  /* ---------- Schallsignale (Typhon) ----------
     Laut Katalog: kurzer Ton etwa 1 Sekunde, langer Ton etwa 4–6 Sekunden. */
  const SIG = {short: 1, long: 4.5, gap: 1, groupGap: 2.5};
  function parseSig(str) {
    const out = []; let gap = false;
    const s = String(str).replace(/mindestens\s*/i, '');
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '●' || c === '▬') { out.push({type: c === '●' ? 'short' : 'long', gapBefore: gap}); gap = false; }
      else if (c === ' ' && s[i + 1] === ' ') gap = true;
    }
    return out;
  }
  function horn(str, onTone) {
    init(); if (!ctx) return {done: Promise.resolve(), stop() {}};
    const tones = parseSig(str); let t = ctx.currentTime + .15, stopped = false; const nodes = [];
    tones.forEach((tn, i) => {
      if (i) t += tn.gapBefore ? SIG.groupGap : SIG.gap;
      const d = SIG[tn.type], g = ctx.createGain(); g.gain.value = 0; g.connect(bus.sfx);
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.connect(g);
      [[148, 'sawtooth', .5], [222, 'sawtooth', .28], [296, 'square', .1]].forEach(([f, type, a]) => {
        const o = ctx.createOscillator(), og = ctx.createGain(); o.type = type; o.frequency.value = f; og.gain.value = a;
        o.connect(og); og.connect(lp); o.start(t); o.stop(t + d + .2); nodes.push(o);
      });
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.55, t + .08); g.gain.setValueAtTime(.55, t + d - .1); g.gain.linearRampToValueAtTime(0, t + d);
      if (onTone) { const at = (t - ctx.currentTime) * 1000; setTimeout(() => !stopped && onTone(i, tn.type, d), at); }
      t += d;
    });
    const total = (t - ctx.currentTime) * 1000 + 200;
    return {total, done: new Promise(r => setTimeout(r, total)), stop() { stopped = true; nodes.forEach(o => { try { o.stop(); } catch (e) {} }); }};
  }

  /* Brabbeln statt Stimme (wenn keine Stimme verfügbar ist) */
  function babble(text, pitch = 1) {
    init(); if (!ctx) return Promise.resolve();
    const syl = Math.min(40, Math.max(3, Math.round(String(text).length / 4)));
    let t = ctx.currentTime + .05;
    for (let i = 0; i < syl; i++) {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle';
      o.frequency.value = (180 + Math.random() * 120) * pitch; g.gain.value = 0;
      o.connect(g); g.connect(bus.sfx);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.18, t + .02); g.gain.linearRampToValueAtTime(0, t + .09);
      o.start(t); o.stop(t + .1); t += .1 + Math.random() * .05;
    }
    return new Promise(r => setTimeout(r, (t - ctx.currentTime) * 1000 + 300));
  }
  /* Kleiner Klick für Tasten */
  function click() {
    if (!ctx) return; const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = 660;
    g.gain.value = 0; o.connect(g); g.connect(bus.sfx); const t = ctx.currentTime;
    g.gain.linearRampToValueAtTime(.12, t + .005); g.gain.exponentialRampToValueAtTime(.0001, t + .12); o.start(t); o.stop(t + .13);
  }
  return {clock: v => setLoop('uhr', v), init, unlock, playMusic, duck, sfx, ticks, weather, horn, babble, click, applyVolumes, parseSig, get ready() { return !!ctx && ctx.state === 'running'; }};
})();

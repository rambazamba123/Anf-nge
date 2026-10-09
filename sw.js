/* Skipper – Service Worker
   Bei jeder neuen App-Version VERSION hochzählen (gleich wie __ver in index.html).
   Nur dann merkt das Handy, dass es etwas Neues gibt, und zeigt „Jetzt laden“.
   MEDIEN hochzählen, wenn ein Bild oder Ton unter gleichem Namen ersetzt wurde (neue Namen brauchen das nicht). */
const VERSION = '4.65';
const MEDIEN = 'skipper-medien-2';
const CACHE = 'skipper-' + VERSION;
const CORE = ['./', 'index.html', 'datenschutz.html', 'impressum.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'fonts/fonts.css', 'fonts/baloo2-latin.woff2', 'fonts/baloo2-latin-ext.woff2', 'fonts/nunito-latin.woff2', 'fonts/nunito-latin-ext.woff2']
  .concat(['sbf', 'sks', 'nav', 'folgen', 'binnen', 'lexikon', 'karte', 'navi', 'karten-sbf', 'karten-bin', 'karten-sks', 'toerns', 'ereignisse', 'ausruestung', 'tags', 'sks-mc', 'knoten', 'einfuehrungen'].map(f => 'data/' + f + '.json?v=' + VERSION)).concat(['navi.js?v=' + VERSION, 'toern.js?v=' + VERSION, 'knoten.js?v=' + VERSION]);

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
  /* Kein skipWaiting hier: Die neue Version wartet, bis man auf „Jetzt laden“ tippt. */
});

self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });

/* Alte App-Versionen und alte Medien-Speicher aufräumen */
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('skipper-') && k !== CACHE && k !== MEDIEN).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

/* Bilder, Töne, Stimmen und Schriften ändern sich selten: erst aus dem Speicher, sonst laden und merken.
   Alles andere (Seite, Stimmen-Manifest, Daten): erst frisch aus dem Netz, ohne Netz aus dem Speicher. */
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (req.headers.has('range')) return;
  const media = /\/(img|audio|fonts)\/.+\.(png|jpe?g|webp|svg|mp3|woff2)$/i.test(url.pathname);
  if (media) {
    e.respondWith(caches.open(MEDIEN).then(async c => {
      const hit = await c.match(req, {ignoreSearch: true}) || await caches.match(req, {ignoreSearch: true});
      if (hit) return hit;
      const r = await fetch(req);
      if (r.ok && r.status === 200) c.put(req, r.clone());
      return r;
    }));
    return;
  }
  e.respondWith(fetch(req, {cache: 'no-cache'}).then(r => {
    if (r.ok && r.status === 200) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  }).catch(() => caches.match(req).then(hit => hit || caches.match('index.html'))));
});

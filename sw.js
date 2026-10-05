/* Skipper – Service Worker
   Bei jeder neuen App-Version VERSION hochzählen (gleich wie __ver in index.html).
   Nur dann merkt das Handy, dass es etwas Neues gibt, und zeigt „Jetzt laden“. */
const VERSION = '4.24';
const CACHE = 'skipper-' + VERSION;
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png']
  .concat(['sbf', 'sks', 'nav', 'folgen', 'binnen', 'lexikon', 'karte', 'navi', 'karten-sbf', 'karten-bin', 'karten-sks'].map(f => 'data/' + f + '.json?v=' + VERSION)).concat(['navi.js?v=' + VERSION]);

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
  /* Kein skipWaiting hier: Die neue Version wartet, bis man auf „Jetzt laden“ tippt. */
});

self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('skipper-') && k !== CACHE && k !== 'skipper-medien').map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

/* Bilder und Geräusche ändern sich selten: erst aus dem Speicher, sonst laden und merken.
   Alles andere (Seite, Stimmen-Manifest, Daten): erst frisch aus dem Netz, ohne Netz aus dem Speicher. */
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (req.headers.has('range')) return;
  const media = /\/(img|audio)\/.+\.(png|jpe?g|webp|svg|mp3)$/i.test(url.pathname);
  if (media) {
    e.respondWith(caches.open('skipper-medien').then(async c => {
      const hit = await c.match(req);
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

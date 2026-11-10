// Offline-first service worker. Bump VERSION to force an update.
const VERSION = 'v11';
const CACHE = `cafe-journal-${VERSION}`;
const SHELL = ['./', 'index.html', 'styles.css', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'js/app.js', 'js/util.js', 'js/i18n.js', 'js/icons.js', 'js/motion.js', 'js/store.js', 'js/ui.js', 'js/views.js', 'js/forms.js', 'js/export.js', 'js/qr.js', 'js/share.js', 'js/brewscene.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== CACHE).map((x) => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin && url.hostname !== 'cdn.jsdelivr.net') return;
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const hit = await c.match(req, { ignoreSearch: true });
    if (url.origin === location.origin) {
      // app files: network first (so updates show immediately), cache when offline or slow
      const net = fetch(req, { cache: 'no-cache' }).then((r) => { if (r.ok) c.put(req, r.clone()); return r; });
      if (!hit) return net;
      return Promise.race([net.catch(() => hit), new Promise((r) => setTimeout(() => r(hit), 2500))]);
    }
    // CDN (Motion): cache after first load so it works offline
    const net = fetch(req).then((r) => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});

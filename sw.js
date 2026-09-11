const CACHE_NAME = 'ft231-v8';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          // SOLO borra las memorias viejas del ft231, ignora las del 230
          if (k.startsWith('ft231-') && k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('script.google.com')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    }).catch(() => caches.match('./index.html'))
  );
});

/**
 * MC Oran Official Portal — Service Worker (PWA Offline & Cache-First)
 */
const CACHE_NAME = 'mco-portal-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/i18n.js',
  '/js/data.js',
  '/js/charts.js',
  '/js/app.js',
  '/manifest.json',
  '/assets/crest.svg',
  '/assets/hero-stadium.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});

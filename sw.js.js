/* ══════════════════════════════════════════════
   AP SCHOOLS — SERVICE WORKER
   Offline-first caching strategy
══════════════════════════════════════════════ */

const CACHE_VERSION = 'ap-schools-v1.0.0';
const CORE_CACHE = 'core-' + CACHE_VERSION;
const RUNTIME_CACHE = 'runtime-' + CACHE_VERSION;

/* Core assets — always cached on install */
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './js/app.js',
  './pages/setup.html',
  './pages/activation.html',
  './pages/create-password.html',
  './pages/login.html',
  './pages/forgot-password.html',
  './pages/roles.html',
  './pages/teacher.html',
  './pages/ediary.html',
  './pages/announce.html',
  './pages/review.html',
  './pages/share.html',
  './pages/cook.html',
  './pages/menu.html',
  './pages/settings.html',
  './pages/edit-officers.html',
  './pages/device-info.html',
  './data/districts.json',
  './data/subjects.json',
  './data/strings-en.json',
  './assets/emblem.png',
  './assets/logo.png',
  './assets/favicon.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './manifest.json'
];

/* ── INSTALL ── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

/* ── ACTIVATE ── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CORE_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

/* ── FETCH ── */
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== 'GET') return;

  // Skip Chrome extensions etc.
  if (!req.url.startsWith('http')) return;

  // For navigation → network-first, fallback to cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // For static assets → cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req).then((res) => {
        // Cache successful responses
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => {
        // For fonts/images that fail offline — return empty response
        return new Response('', { status: 408, statusText: 'Offline' });
      });
    })
  );
});

/* ── MESSAGE — Allow skip waiting ── */
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
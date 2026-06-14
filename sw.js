// Kill-switch service worker — clears all caches then unregisters.
// Prevents stale chunk hashes from causing "Load failed" / "Failed to fetch" errors.

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll())
      .then((clients) => clients.forEach((c) => c.navigate(c.url))),
  );
});

// Network-only — never cache responses
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

const CACHE_NAME = "registro-horas-v1.1";
const urlsToCache = [
  "./index.html?v=1.1",
  "./style.css?v=1.1",
  "./script.js?v=1.1",
  "./manifest.json?v=1.1",
  "./icon-192.png?v=1.1",
  "./icon-512.png?v=1.1"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});
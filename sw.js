// Name of cache
const CACHE_NAME = "crop-app-cache-v1";

// Files to cache (add your html pages here)
const URLS_TO_CACHE = [
  "/",
  "/farmer-scan.html",
  "/vendor-only.html",
  "/manifest.json"
];

// Install SW & cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate SW
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch from cache OR network fallback
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() =>
          caches.match("/farmer-scan.html")
        )
      );
    })
  );
});

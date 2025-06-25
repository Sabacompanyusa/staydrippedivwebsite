// Service Worker for Stay Dripped Mobile IV
// This is a placeholder service worker to prevent 404 errors

const CACHE_NAME = "stay-dripped-v1";
const urlsToCache = [
  "/",
  "/assets/css/style.css",
  "/assets/css/responsive.css",
  "/assets/css/animations.css",
  "/assets/js/main.js",
  "/assets/js/booking.js",
];

// Install event
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    }),
  );
});

// Fetch event
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    }),
  );
});

// Service Worker for Stay Dripped Mobile IV
// This service worker provides basic caching functionality

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
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => {
        console.error("Service Worker installation failed:", error);
      }),
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch((error) => {
        console.error("Service Worker fetch failed:", error);
        // Return a fallback response if needed
        return new Response("Service unavailable", {
          status: 503,
          statusText: "Service Unavailable",
        });
      }),
  );
});

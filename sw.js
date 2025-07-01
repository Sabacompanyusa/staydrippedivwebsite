// Service Worker for Stay Dripped Mobile IV
// This service worker provides basic caching functionality

const CACHE_NAME = "stay-dripped-v2";
const urlsToCache = [
  "/",
  "/assets/css/style.css",
  "/assets/css/responsive.css",
  "/assets/css/animations.css",
  "/assets/js/main.js",
  "/assets/js/booking.js",
  "/assets/js/globals.js",
  "/assets/images/logo.png",
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
  // Skip non-GET requests and external URLs
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      // Try to fetch from network
      return fetch(event.request)
        .then((fetchResponse) => {
          // Only cache successful responses for same-origin requests
          if (fetchResponse.status === 200 && fetchResponse.type === "basic") {
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return fetchResponse;
        })
        .catch((error) => {
          console.error(
            "Service Worker fetch failed for:",
            event.request.url,
            error,
          );

          // Return offline page for navigation requests if available
          if (event.request.mode === "navigate") {
            return (
              caches.match("/") ||
              new Response("Offline", {
                status: 503,
                statusText: "Service Unavailable",
              })
            );
          }

          // For other requests, just fail gracefully
          throw error;
        });
    }),
  );
});

// Stay Dripped Mobile IV - Service Worker
// Professional Mobile IV Therapy Website

self.babelHelpers = {
  asyncToGenerator: function (e) {
    return function () {
      var t = e.apply(this, arguments);
      return new Promise(function (e, r) {
        return (function n(o, i) {
          try {
            var c = t[o](i),
              l = c.value;
          } catch (e) {
            return void r(e);
          }
          if (!c.done)
            return Promise.resolve(l).then(
              function (e) {
                n("next", e);
              },
              function (e) {
                n("throw", e);
              },
            );
          e(l);
        })("next");
      });
    };
  },
};

// Service Worker Configuration for Stay Dripped Mobile IV
const CACHE_NAME = "stay-dripped-mobile-iv-v1";
const STATIC_CACHE_NAME = "stay-dripped-static-v1";
const DYNAMIC_CACHE_NAME = "stay-dripped-dynamic-v1";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/assets/css/main.css",
  "/assets/css/style.css",
  "/js/index.js",
  "/js/modules/analytics.js",
  "/js/modules/back-to-top.js",
  "/js/modules/mobile-menu.js",
  "/js/modules/smooth-scroll.js",
  "/manifest.json",
  // Add your critical assets here
];

// Cache strategies for different resource types
const CACHE_STRATEGIES = {
  // Cache first for static assets
  static: [/\.(?:css|js|woff|woff2|ttf|eot)$/, /\/assets\//, /\/components\//],
  // Network first for HTML pages
  pages: [/\.html$/, /\/$/, /\/pages\//],
  // Cache first for images
  images: [/\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/, /\/images\//],
};

// Service Worker Installation
self.addEventListener("install", (event) => {
  console.log("Stay Dripped Mobile IV Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log(
          "Stay Dripped Mobile IV Service Worker: Caching static assets",
        );
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log(
          "Stay Dripped Mobile IV Service Worker: Installation complete",
        );
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error(
          "Stay Dripped Mobile IV Service Worker: Installation failed",
          error,
        );
      }),
  );
});

// Service Worker Activation
self.addEventListener("activate", (event) => {
  console.log("Stay Dripped Mobile IV Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName.startsWith("stay-dripped-")
            ) {
              console.log(
                "Stay Dripped Mobile IV Service Worker: Deleting old cache:",
                cacheName,
              );
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log(
          "Stay Dripped Mobile IV Service Worker: Activation complete",
        );
        return self.clients.claim();
      }),
  );
});

// Fetch Event Handler
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Skip analytics and tracking requests
  if (
    url.hostname.includes("google-analytics.com") ||
    url.hostname.includes("googletagmanager.com") ||
    url.hostname.includes("facebook.com") ||
    url.hostname.includes("doubleclick.net")
  ) {
    return;
  }

  event.respondWith(handleRequest(request));
});

// Request handling logic
async function handleRequest(request) {
  const url = new URL(request.url);

  try {
    // Strategy 1: Cache First for Static Assets
    if (isStaticAsset(request)) {
      return await cacheFirst(request, STATIC_CACHE_NAME);
    }

    // Strategy 2: Network First for Pages
    if (isPageRequest(request)) {
      return await networkFirst(request, DYNAMIC_CACHE_NAME);
    }

    // Strategy 3: Cache First for Images
    if (isImageRequest(request)) {
      return await cacheFirst(request, DYNAMIC_CACHE_NAME);
    }

    // Default: Network First
    return await networkFirst(request, DYNAMIC_CACHE_NAME);
  } catch (error) {
    console.error(
      "Stay Dripped Mobile IV Service Worker: Request failed",
      error,
    );

    // Fallback to offline page for navigation requests
    if (request.mode === "navigate") {
      return (
        (await caches.match("/404.html")) || (await caches.match("/index.html"))
      );
    }

    throw error;
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    console.log(
      "Stay Dripped Mobile IV Service Worker: Cache hit for",
      request.url,
    );
    return cachedResponse;
  }

  console.log(
    "Stay Dripped Mobile IV Service Worker: Cache miss, fetching",
    request.url,
  );
  const networkResponse = await fetch(request);

  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  try {
    console.log(
      "Stay Dripped Mobile IV Service Worker: Network first for",
      request.url,
    );
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log(
      "Stay Dripped Mobile IV Service Worker: Network failed, trying cache for",
      request.url,
    );
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Request type detection helpers
function isStaticAsset(request) {
  return CACHE_STRATEGIES.static.some((pattern) => pattern.test(request.url));
}

function isPageRequest(request) {
  return (
    request.mode === "navigate" ||
    CACHE_STRATEGIES.pages.some((pattern) => pattern.test(request.url))
  );
}

function isImageRequest(request) {
  return CACHE_STRATEGIES.images.some((pattern) => pattern.test(request.url));
}

// Background Sync for offline form submissions
self.addEventListener("sync", (event) => {
  console.log(
    "Stay Dripped Mobile IV Service Worker: Background sync triggered",
  );

  if (event.tag === "booking-form") {
    event.waitUntil(syncBookingForm());
  }

  if (event.tag === "contact-form") {
    event.waitUntil(syncContactForm());
  }
});

// Sync booking form submissions
async function syncBookingForm() {
  try {
    const bookingData = await getStoredBookingData();
    if (bookingData.length > 0) {
      for (const booking of bookingData) {
        await submitBooking(booking);
        await removeStoredBooking(booking.id);
      }
      console.log(
        "Stay Dripped Mobile IV Service Worker: Booking forms synced",
      );
    }
  } catch (error) {
    console.error(
      "Stay Dripped Mobile IV Service Worker: Booking sync failed",
      error,
    );
  }
}

// Sync contact form submissions
async function syncContactForm() {
  try {
    const contactData = await getStoredContactData();
    if (contactData.length > 0) {
      for (const contact of contactData) {
        await submitContact(contact);
        await removeStoredContact(contact.id);
      }
      console.log(
        "Stay Dripped Mobile IV Service Worker: Contact forms synced",
      );
    }
  } catch (error) {
    console.error(
      "Stay Dripped Mobile IV Service Worker: Contact sync failed",
      error,
    );
  }
}

// IndexedDB helpers for offline form storage
async function getStoredBookingData() {
  // Implementation for retrieving stored booking data
  return [];
}

async function getStoredContactData() {
  // Implementation for retrieving stored contact data
  return [];
}

async function submitBooking(bookingData) {
  // Implementation for submitting booking data
  return fetch("/api/booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });
}

async function submitContact(contactData) {
  // Implementation for submitting contact data
  return fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });
}

async function removeStoredBooking(id) {
  // Implementation for removing stored booking data
}

async function removeStoredContact(id) {
  // Implementation for removing stored contact data
}

// Push notification handling
self.addEventListener("push", (event) => {
  console.log(
    "Stay Dripped Mobile IV Service Worker: Push notification received",
  );

  const options = {
    body: "Thank you for choosing Stay Dripped Mobile IV",
    icon: "/assets/icons/icon-192x192.png",
    badge: "/assets/icons/badge-72x72.png",
    data: {
      url: "/",
    },
    actions: [
      {
        action: "open",
        title: "View Details",
        icon: "/assets/icons/view-icon.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/assets/icons/close-icon.png",
      },
    ],
  };

  if (event.data) {
    const payload = event.data.json();
    options.body = payload.body || options.body;
    options.data.url = payload.url || options.data.url;
  }

  event.waitUntil(
    self.registration.showNotification("Stay Dripped Mobile IV", options),
  );
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("Stay Dripped Mobile IV Service Worker: Notification clicked");

  event.notification.close();

  if (event.action === "open") {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});

// Message handling for cache updates
self.addEventListener("message", (event) => {
  console.log(
    "Stay Dripped Mobile IV Service Worker: Message received",
    event.data,
  );

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "UPDATE_CACHE") {
    event.waitUntil(updateCache());
  }
});

// Update cache manually
async function updateCache() {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    await cache.addAll(STATIC_ASSETS);
    console.log("Stay Dripped Mobile IV Service Worker: Cache updated");
  } catch (error) {
    console.error(
      "Stay Dripped Mobile IV Service Worker: Cache update failed",
      error,
    );
  }
}

// Cleanup old caches periodically
async function cleanupCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(
    (name) =>
      name.startsWith("stay-dripped-") &&
      name !== STATIC_CACHE_NAME &&
      name !== DYNAMIC_CACHE_NAME,
  );

  return Promise.all(oldCaches.map((name) => caches.delete(name)));
}

// Performance monitoring
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    const start = performance.now();

    event.respondWith(
      fetch(event.request).then((response) => {
        const end = performance.now();
        console.log(
          `Stay Dripped Mobile IV API: ${event.request.url} took ${end - start}ms`,
        );
        return response;
      }),
    );
  }
});

console.log("Stay Dripped Mobile IV Service Worker: Loaded successfully");

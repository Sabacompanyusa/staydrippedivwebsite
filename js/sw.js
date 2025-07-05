// Stay Dripped Mobile IV - Service Worker
// Professional Mobile IV Therapy Website
// Personalized for Premium Mobile IV Services

// Simplified babel helper for async/await compatibility
self.babelHelpers = {
  asyncToGenerator: function (fn) {
    return function () {
      const gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            const info = gen[key](arg);
            const value = info.value;
            if (info.done) {
              resolve(value);
            } else {
              Promise.resolve(value).then(
                (result) => step("next", result),
                (error) => step("throw", error),
              );
            }
          } catch (error) {
            reject(error);
          }
        }
        step("next");
      });
    };
  },
};

// Service Worker Configuration for Stay Dripped Mobile IV
// Professional Mobile IV Therapy - Premium Experience
const VERSION = "2.0.0";
const CACHE_NAME = `stay-dripped-mobile-iv-v${VERSION}`;
const STATIC_CACHE_NAME = `stay-dripped-static-v${VERSION}`;
const DYNAMIC_CACHE_NAME = `stay-dripped-dynamic-v${VERSION}`;
const API_CACHE_NAME = `stay-dripped-api-v${VERSION}`;
const IMAGES_CACHE_NAME = `stay-dripped-images-v${VERSION}`;

// Critical assets for Stay Dripped Mobile IV
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/booking.html",
  "/services.html",
  "/assets/css/main.css",
  "/assets/css/main.scss",
  "/assets/css/style.css",
  "/js/index.js",
  "/js/modules/analytics.js",
  "/js/modules/back-to-top.js",
  "/js/modules/mobile-menu.js",
  "/js/modules/smooth-scroll.js",
  "/js/modules/service-worker.js",
  "/manifest.json",
  "/pages/iv-therapy.html",
  "/pages/nad-therapy.html",
  "/pages/peptide-therapy.html",
  "/pages/injection-shots.html",
  "/pages/weight-management.html",
  "/pages/aesthetic.html",
  "/pages/hormone-replacement.html",
  "/pages/blood-testing.html",
  "/components/css/buttons.css",
  "/components/css/cards.css",
  "/components/css/header.css",
  "/components/css/hero.css",
  "/components/css/footer.css",
];

// API endpoints for Stay Dripped Mobile IV
const API_ENDPOINTS = [
  "/api/booking",
  "/api/contact",
  "/api/services",
  "/api/pricing",
  "/api/availability",
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

// Service Worker Installation - Stay Dripped Mobile IV
self.addEventListener("install", (event) => {
  console.log("🩺 Stay Dripped Mobile IV: Service Worker Installing...");
  console.log("💧 Premium Mobile IV Therapy - PWA Ready");

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log("📱 Stay Dripped Mobile IV: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log("🔗 Stay Dripped Mobile IV: Preparing API cache");
        return Promise.resolve();
      }),
      caches.open(IMAGES_CACHE_NAME).then((cache) => {
        console.log("🖼️ Stay Dripped Mobile IV: Preparing image cache");
        return Promise.resolve();
      }),
    ])
      .then(() => {
        console.log(
          "✅ Stay Dripped Mobile IV: Service Worker Installation Complete",
        );
        console.log("🚀 Ready to serve premium mobile IV therapy experience");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("❌ Stay Dripped Mobile IV: Installation failed", error);
      }),
  );
});

// Service Worker Activation - Stay Dripped Mobile IV
self.addEventListener("activate", (event) => {
  console.log("🔄 Stay Dripped Mobile IV: Service Worker Activating...");

  const currentCaches = [
    STATIC_CACHE_NAME,
    DYNAMIC_CACHE_NAME,
    API_CACHE_NAME,
    IMAGES_CACHE_NAME,
  ];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old Stay Dripped caches
            if (
              !currentCaches.includes(cacheName) &&
              cacheName.startsWith("stay-dripped-")
            ) {
              console.log(
                "🗑️ Stay Dripped Mobile IV: Removing outdated cache:",
                cacheName,
              );
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("✅ Stay Dripped Mobile IV: Activation Complete");
        console.log("💉 Premium Mobile IV Therapy Service Active");
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
  try {
    return await routeRequest(request);
  } catch (error) {
    console.error(
      "⚠️ Stay Dripped Mobile IV: Request failed for",
      request.url,
      error,
    );
    return await handleRequestError(request, error);
  }
}

// Route request to appropriate strategy
async function routeRequest(request) {
  if (isStaticAsset(request)) {
    return await cacheFirst(request, STATIC_CACHE_NAME);
  }
  if (isPageRequest(request)) {
    return await networkFirst(request, DYNAMIC_CACHE_NAME);
  }
  if (isImageRequest(request)) {
    return await cacheFirst(request, IMAGES_CACHE_NAME);
  }
  if (isApiRequest(request)) {
    return await networkFirst(request, API_CACHE_NAME);
  }
  return await networkFirst(request, DYNAMIC_CACHE_NAME);
}

// Handle request errors with fallbacks
async function handleRequestError(request, error) {
  if (request.mode === "navigate") {
    console.log("📱 Stay Dripped Mobile IV: Serving offline fallback");
    return await getOfflineFallback();
  }
  throw error;
}

// Create offline fallback response
async function getOfflineFallback() {
  const cachedFallback =
    (await caches.match("/404.html")) || (await caches.match("/index.html"));
  if (cachedFallback) return cachedFallback;

  return new Response(createOfflineHTML(), {
    headers: { "Content-Type": "text/html" },
  });
}

// Generate offline HTML content
function createOfflineHTML() {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Stay Dripped Mobile IV - Offline</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Inter, sans-serif; text-align: center; padding: 50px; }
        .offline { color: #1a2a47; }
        .logo { font-size: 2rem; font-weight: 800; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <div class="offline">
        <div class="logo">💧 Stay Dripped Mobile IV</div>
        <h1>You're Offline</h1>
        <p>Please check your internet connection and try again.</p>
        <p><strong>Call (602) 688-9825</strong> for immediate assistance</p>
    </div>
</body>
</html>`;
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    console.log("⚡ Stay Dripped Mobile IV: Cache hit for", request.url);
    return cachedResponse;
  }

  console.log("🌐 Stay Dripped Mobile IV: Cache miss, fetching", request.url);
  const networkResponse = await fetch(request);

  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  try {
    console.log("🌐 Stay Dripped Mobile IV: Network first for", request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log(
      "📱 Stay Dripped Mobile IV: Network failed, serving from cache for",
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

function isApiRequest(request) {
  return API_ENDPOINTS.some((endpoint) => request.url.includes(endpoint));
}

// Background Sync for offline form submissions
self.addEventListener("sync", (event) => {
  console.log("🔄 Stay Dripped Mobile IV: Background sync triggered");

  if (event.tag === "booking-form") {
    console.log("📅 Stay Dripped Mobile IV: Syncing booking forms");
    event.waitUntil(syncBookingForm());
  }

  if (event.tag === "contact-form") {
    console.log("📧 Stay Dripped Mobile IV: Syncing contact forms");
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
  try {
    // Return empty array if no IndexedDB implementation yet
    return [];
  } catch (error) {
    console.error("Error retrieving booking data:", error);
    return [];
  }
}

async function getStoredContactData() {
  try {
    // Return empty array if no IndexedDB implementation yet
    return [];
  } catch (error) {
    console.error("Error retrieving contact data:", error);
    return [];
  }
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
  try {
    // No-op until IndexedDB implementation
    console.log("Booking removal requested for ID:", id);
  } catch (error) {
    console.error("Error removing booking:", error);
  }
}

async function removeStoredContact(id) {
  try {
    // No-op until IndexedDB implementation
    console.log("Contact removal requested for ID:", id);
  } catch (error) {
    console.error("Error removing contact:", error);
  }
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
  // Validate message data
  if (!event.data || typeof event.data !== "object" || !event.data.type) {
    return;
  }

  console.log(
    "Stay Dripped Mobile IV Service Worker: Message received",
    event.data.type,
  );

  // Only handle expected message types
  const allowedTypes = ["SKIP_WAITING", "UPDATE_CACHE"];
  if (!allowedTypes.includes(event.data.type)) {
    return;
  }

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data.type === "UPDATE_CACHE") {
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

// Performance monitoring is handled in the main fetch event listener above

console.log("🩺 Stay Dripped Mobile IV Service Worker: Loaded Successfully");
console.log("💧 Premium Mobile IV Therapy - PWA Ready");
console.log("📱 Professional Healthcare Experience Enabled");
console.log("🚀 Visit staydrippedmobileiv.com | Call (602) 688-9825");

// Enhanced Service Worker for Stay Dripped Mobile IV

const CACHE_NAME = "stay-dripped-v1.0.0";
const STATIC_CACHE = "static-v1.0.0";
const DYNAMIC_CACHE = "dynamic-v1.0.0";
const IMAGE_CACHE = "images-v1.0.0";

// Files to precache
const STATIC_FILES = [
  "/",
  "assets/css/main.css",
  "/js/main.js",
  "json/manifest.json",
  "/assets/icons/favicon-32x32.png",
  "/assets/icons/apple-touch-icon.png",
  "/components/html/header.html",
  "/components/html/footer.html",
  "/components/html/hero.html",
  "/offline.html", // Offline fallback page
];

// Install event - precache static files
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Precaching static files");
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log("Service Worker: Skip waiting");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Precaching failed", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== IMAGE_CACHE
            ) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker: Claiming clients");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests (unless specifically needed)
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  try {
    // Different strategies based on request type
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    } else if (isImage(url.pathname)) {
      return await cacheFirst(request, IMAGE_CACHE);
    } else if (isHTMLPage(request)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    } else {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
  } catch (error) {
    console.error("Service Worker: Request failed", error);
    return await getOfflineFallback(request);
  }
}

// Cache first strategy - good for static assets
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request, cache);
    return cachedResponse;
  }

  const networkResponse = await fetch(request);

  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

// Network first strategy - good for HTML pages
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Stale while revalidate - update cache in background
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Fail silently for background updates
    console.log("Service Worker: Background update failed", error);
  }
}

// Get offline fallback
async function getOfflineFallback(request) {
  const cache = await caches.open(STATIC_CACHE);

  if (isHTMLPage(request)) {
    const offlinePage = await cache.match("/offline.html");
    if (offlinePage) {
      return offlinePage;
    }
  }

  if (isImage(request.url)) {
    const offlineImage = await cache.match("/assets/icons/offline-image.png");
    if (offlineImage) {
      return offlineImage;
    }
  }

  // Return a basic response for other types
  return new Response("Offline", {
    status: 503,
    statusText: "Service Unavailable",
  });
}

// Helper functions
function isStaticAsset(pathname) {
  return pathname.match(/\.(css|js|woff|woff2|ttf|eot|ico|svg)$/);
}

function isImage(pathname) {
  return pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/);
}

function isHTMLPage(request) {
  return request.headers.get("accept")?.includes("text/html");
}

// Background sync for form submissions
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync", event.tag);

  if (event.tag === "booking-form") {
    event.waitUntil(syncBookingForm());
  }
});

async function syncBookingForm() {
  try {
    // Get pending form data from IndexedDB
    const pendingData = await getPendingFormData();

    if (pendingData.length > 0) {
      for (const data of pendingData) {
        await submitFormData(data);
        await removePendingFormData(data.id);
      }
    }
  } catch (error) {
    console.error("Service Worker: Form sync failed", error);
  }
}

// Push notification handling
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received");

  if (!event.data) {
    return;
  }

  const data = event.data.json();

  const options = {
    body: data.body,
    icon: "/assets/icons/apple-touch-icon.png",
    badge: "/assets/icons/badge-icon.png",
    vibrate: [200, 100, 200],
    data: data.data,
    actions: [
      {
        action: "view",
        title: "View",
        icon: "/assets/icons/view-icon.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/assets/icons/dismiss-icon.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event.action);

  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
  }
});

// Message handling for cache updates
self.addEventListener("message", (event) => {
  console.log("Service Worker: Message received", event.data);

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data.type === "CACHE_URLS") {
    event.waitUntil(cacheUrls(event.data.urls));
  }
});

async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.error("Service Worker: Failed to cache URL", url, error);
    }
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingFormData() {
  // Implementation would use IndexedDB to retrieve pending form submissions
  return [];
}

async function submitFormData(data) {
  // Implementation would submit form data to server
  console.log("Service Worker: Submitting form data", data);
}

async function removePendingFormData(id) {
  // Implementation would remove data from IndexedDB
  console.log("Service Worker: Removing pending form data", id);
}

console.log("Service Worker: Loaded and ready");

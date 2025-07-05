// Stay Dripped Mobile IV - Service Worker Registration
// Professional Mobile IV Therapy Website

class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.isUpdateAvailable = false;
    this.init();
  }

  async init() {
    if ("serviceWorker" in navigator) {
      try {
        await this.registerServiceWorker();
        this.setupUpdateNotifications();
        this.setupOfflineHandling();
        console.log("Stay Dripped Mobile IV: Service Worker initialized");
      } catch (error) {
        console.error(
          "Stay Dripped Mobile IV: Service Worker initialization failed",
          error,
        );
      }
    } else {
      console.log("Stay Dripped Mobile IV: Service Worker not supported");
    }
  }

  async registerServiceWorker() {
    try {
      this.registration = await navigator.serviceWorker.register("/js/sw.js", {
        scope: "/",
      });

      console.log(
        "Stay Dripped Mobile IV: Service Worker registered successfully",
      );

      // Handle updates
      this.registration.addEventListener("updatefound", () => {
        console.log("Stay Dripped Mobile IV: New Service Worker version found");
        this.handleUpdate();
      });

      // Check for updates periodically
      setInterval(() => {
        this.registration.update();
      }, 60000); // Check every minute
    } catch (error) {
      console.error(
        "Stay Dripped Mobile IV: Service Worker registration failed",
        error,
      );
      throw error;
    }
  }

  handleUpdate() {
    const newWorker = this.registration.installing;

    if (newWorker) {
      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          this.isUpdateAvailable = true;
          this.showUpdateNotification();
        }
      });
    }
  }

  showUpdateNotification() {
    // Create a subtle update notification
    const notification = document.createElement("div");
    notification.className = "sw-update-notification";

    const content = document.createElement("div");
    content.className = "sw-update-content";

    const text = document.createElement("div");
    text.className = "sw-update-text";
    const strong = document.createElement("strong");
    strong.textContent = "Stay Dripped Mobile IV";
    text.appendChild(strong);
    text.appendChild(document.createTextNode(" has been updated!"));
    text.appendChild(document.createElement("br"));
    const small = document.createElement("small");
    small.textContent = "Refresh to get the latest features";
    text.appendChild(small);

    const actions = document.createElement("div");
    actions.className = "sw-update-actions";

    const updateBtn = document.createElement("button");
    updateBtn.className = "sw-update-btn sw-update-btn--primary";
    updateBtn.textContent = "Update Now";
    updateBtn.addEventListener("click", () => this.activateUpdate());

    const laterBtn = document.createElement("button");
    laterBtn.className = "sw-update-btn sw-update-btn--secondary";
    laterBtn.textContent = "Later";
    laterBtn.addEventListener("click", () => this.dismissUpdate());

    actions.appendChild(updateBtn);
    actions.appendChild(laterBtn);
    content.appendChild(text);
    content.appendChild(actions);
    notification.appendChild(content);

    this.addUpdateNotificationStyles();
    document.body.appendChild(notification);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      this.dismissUpdate();
    }, 10000);
  }

  activateUpdate() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: "SKIP_WAITING" });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }
  }

  dismissUpdate() {
    const notification = document.querySelector(".sw-update-notification");
    if (notification) {
      notification.style.animation = "slideOutToRight 0.3s ease-in forwards";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }

  setupOfflineHandling() {
    // Handle online/offline status
    window.addEventListener("online", () => {
      this.showConnectionStatus("You're back online!", "success");
      this.syncOfflineData();
    });

    window.addEventListener("offline", () => {
      this.showConnectionStatus(
        "You're offline. Some features may be limited.",
        "warning",
      );
    });
  }

  showConnectionStatus(message, type = "info") {
    const statusBar = document.createElement("div");
    statusBar.className = `sw-status-bar sw-status-bar--${type}`;
    statusBar.textContent = message;

    const style = document.createElement("style");
    style.textContent = `
            .sw-status-bar {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 24px;
                border-radius: 8px;
                color: white;
                font-size: 14px;
                font-weight: 500;
                z-index: 10001;
                animation: slideUpFromBottom 0.3s ease-out;
            }

            .sw-status-bar--success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            }

            .sw-status-bar--warning {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            }

            .sw-status-bar--info {
                background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
            }

            @keyframes slideUpFromBottom {
                from {
                    transform: translateX(-50%) translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;

    document.head.appendChild(style);
    document.body.appendChild(statusBar);

    setTimeout(() => {
      statusBar.style.animation = "slideDownToBottom 0.3s ease-in forwards";
      setTimeout(() => {
        statusBar.remove();
        style.remove();
      }, 300);
    }, 3000);
  }

  async syncOfflineData() {
    if (this.registration && this.registration.sync) {
      try {
        await this.registration.sync.register("booking-form");
        await this.registration.sync.register("contact-form");
        console.log("Stay Dripped Mobile IV: Background sync registered");
      } catch (error) {
        console.error(
          "Stay Dripped Mobile IV: Background sync registration failed",
          error,
        );
      }
    }
  }

  setupUpdateNotifications() {
    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "CACHE_UPDATED") {
        console.log("Stay Dripped Mobile IV: Cache updated");
      }
    });
  }

  // PWA Install Prompt
  setupInstallPrompt() {
    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      this.showInstallButton();
    });

    window.addEventListener("appinstalled", () => {
      console.log("Stay Dripped Mobile IV: PWA installed");
      this.hideInstallButton();

      // Track install event
      if (typeof gtag !== "undefined") {
        gtag("event", "pwa_install", {
          event_category: "engagement",
          event_label: "Stay Dripped Mobile IV PWA",
        });
      }
    });

    // Handle install button click
    window.addEventListener("click", async (e) => {
      if (e.target.matches(".pwa-install-btn")) {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const result = await deferredPrompt.userChoice;

          if (result.outcome === "accepted") {
            console.log("Stay Dripped Mobile IV: PWA install accepted");
          } else {
            console.log("Stay Dripped Mobile IV: PWA install dismissed");
          }

          deferredPrompt = null;
          this.hideInstallButton();
        }
      }
    });
  }

  showInstallButton() {
    // Add install button to header actions
    const headerActions = document.querySelector(".header-actions");
    if (headerActions && !document.querySelector(".pwa-install-btn")) {
      const installBtn = document.createElement("button");
      installBtn.className = "pwa-install-btn btn btn--ghost btn--sm";
      installBtn.title = "Install Stay Dripped Mobile IV App";

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "16");
      svg.setAttribute("height", "16");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "currentColor");

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttribute("d", "M19 13H13V19H11V13H5L12 6L19 13Z");

      svg.appendChild(path);
      installBtn.appendChild(svg);
      installBtn.appendChild(document.createTextNode("Install App"));

      headerActions.insertBefore(installBtn, headerActions.firstChild);
    }
  }

  hideInstallButton() {
    const installBtn = document.querySelector(".pwa-install-btn");
    if (installBtn) {
      installBtn.remove();
    }
  }
}

// Initialize Service Worker Manager
window.serviceWorkerManager = new ServiceWorkerManager();

// Add additional styles for offline handling
const additionalStyles = document.createElement("style");
additionalStyles.textContent = `
    @keyframes slideOutToRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes slideDownToBottom {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(additionalStyles);

export default ServiceWorkerManager;

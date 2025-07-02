// Main JavaScript entry point for Stay Dripped Mobile IV

// Import all modules
import "./modules/dark-mode.js";
import "./modules/lazy-loading.js";
import "./modules/mobile-menu.js";
import "./modules/smooth-scroll.js";
import "./modules/analytics.js";
import "./modules/back-to-top.js";

// Application initialization
class App {
  constructor() {
    this.version = "1.0.0";
    this.isDebug = process.env.NODE_ENV === "development";
    this.init();
  }

  init() {
    // Log app initialization
    if (this.isDebug) {
      console.log(`Stay Dripped Mobile IV - v${this.version} initialized`);
    }

    // Initialize core functionality
    this.initServiceWorker();
    this.initErrorHandling();
    this.initPerformanceMonitoring();
    this.initAccessibilityEnhancements();

    // Custom events for module communication
    this.setupCustomEvents();

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }

  onDOMReady() {
    // Remove no-js class and add js class
    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js");

    // Initialize interactive elements
    this.initInteractiveElements();
    this.initFormEnhancements();
    this.initImageOptimization();

    // Announce to screen readers that page is ready
    this.announcePageReady();

    // Trigger custom event for other scripts
    window.dispatchEvent(
      new CustomEvent("appReady", {
        detail: { version: this.version },
      }),
    );
  }

  initServiceWorker() {
    if ("serviceWorker" in navigator && window.location.protocol === "https:") {
      window.addEventListener("load", async () => {
        try {
          const registration =
            await navigator.serviceWorker.register("/service-worker.js");

          if (this.isDebug) {
            console.log("SW registered: ", registration);
          }

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                this.showUpdateAvailable();
              }
            });
          });
        } catch (registrationError) {
          if (this.isDebug) {
            console.log("SW registration failed: ", registrationError);
          }
        }
      });
    }
  }

  initErrorHandling() {
    // Global error handler
    window.addEventListener("error", (event) => {
      if (this.isDebug) {
        console.error("Global error:", event.error);
      }

      // Track errors in analytics
      if (window.analyticsManager) {
        window.analyticsManager.trackEvent("error", "javascript", {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
        });
      }
    });

    // Unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      if (this.isDebug) {
        console.error("Unhandled promise rejection:", event.reason);
      }

      if (window.analyticsManager) {
        window.analyticsManager.trackEvent("error", "promise_rejection", {
          reason: event.reason?.toString() || "Unknown",
        });
      }
    });
  }

  initPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ("PerformanceObserver" in window) {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];

        if (window.analyticsManager) {
          window.analyticsManager.trackEvent("performance", "lcp", {
            value: Math.round(lastEntry.startTime),
          });
        }
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay
      new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry) => {
          if (window.analyticsManager) {
            window.analyticsManager.trackEvent("performance", "fid", {
              value: Math.round(entry.processingStart - entry.startTime),
            });
          }
        });
      }).observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        if (window.analyticsManager) {
          window.analyticsManager.trackEvent("performance", "cls", {
            value: Math.round(clsValue * 1000) / 1000,
          });
        }
      }).observe({ entryTypes: ["layout-shift"] });
    }
  }

  initAccessibilityEnhancements() {
    // Keyboard navigation for custom elements
    document.addEventListener("keydown", (e) => {
      // Enhanced keyboard navigation will be added here
      this.handleKeyboardNavigation(e);
    });

    // Focus management
    document.addEventListener("focusin", (e) => {
      // Ensure focus is visible
      if (
        e.target.matches(".btn, .card--interactive, a, input, textarea, select")
      ) {
        e.target.classList.add("focus-visible");
      }
    });

    document.addEventListener("focusout", (e) => {
      e.target.classList.remove("focus-visible");
    });

    // Reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("reduce-motion");
    }
  }

  handleKeyboardNavigation(e) {
    // Escape key handling
    if (e.key === "Escape") {
      // Close any open modals, dropdowns, etc.
      const openElements = document.querySelectorAll(
        ".mobile-menu.active, .dropdown.open",
      );
      openElements.forEach((el) => {
        el.classList.remove("active", "open");
      });
    }

    // Tab trap for modals (handled by individual components)
    // Arrow key navigation for carousels/galleries (future enhancement)
  }

  initInteractiveElements() {
    // Add ripple effect to buttons
    document.addEventListener("click", (e) => {
      if (e.target.matches(".btn:not(.btn--link)")) {
        this.createRippleEffect(e);
      }
    });

    // Copy to clipboard functionality
    document.addEventListener("click", (e) => {
      if (e.target.matches("[data-copy]")) {
        this.copyToClipboard(e.target.dataset.copy);
      }
    });
  }

  createRippleEffect(e) {
    const button = e.target;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    // Remove existing ripples
    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) {
      existingRipple.remove();
    }

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 400);
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      this.showToast("Failed to copy", "error");
    }
  }

  initFormEnhancements() {
    // Real-time validation
    document.addEventListener("input", (e) => {
      if (e.target.matches("input[required], textarea[required]")) {
        this.validateField(e.target);
      }
    });

    // Form submission enhancement
    document.addEventListener("submit", (e) => {
      if (e.target.matches("form[data-enhanced]")) {
        this.handleFormSubmission(e);
      }
    });
  }

  validateField(field) {
    const isValid = field.checkValidity();
    field.classList.toggle("is-valid", isValid);
    field.classList.toggle("is-invalid", !isValid);

    // Update ARIA attributes
    field.setAttribute("aria-invalid", !isValid);
  }

  handleFormSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');

    // Add loading state
    if (submitButton) {
      submitButton.classList.add("btn--loading");
      submitButton.disabled = true;
    }

    // Simulate form processing (replace with actual form handling)
    setTimeout(() => {
      if (submitButton) {
        submitButton.classList.remove("btn--loading");
        submitButton.disabled = false;
      }
      this.showToast("Form submitted successfully!", "success");
    }, 2000);
  }

  initImageOptimization() {
    // WebP support detection
    const webpSupported = this.supportsWebP();
    document.documentElement.classList.toggle("webp", webpSupported);
    document.documentElement.classList.toggle("no-webp", !webpSupported);
  }

  supportsWebP() {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }

  setupCustomEvents() {
    // Theme change event
    window.addEventListener("themeChanged", (e) => {
      if (this.isDebug) {
        console.log("Theme changed to:", e.detail.theme);
      }
    });

    // Performance events
    window.addEventListener("performanceEntry", (e) => {
      if (this.isDebug) {
        console.log("Performance entry:", e.detail);
      }
    });
  }

  showUpdateAvailable() {
    // Create update notification
    const notification = document.createElement("div");
    notification.className = "update-notification";
    notification.innerHTML = `
      <p>A new version is available!</p>
      <button onclick="window.location.reload()">Update</button>
      <button onclick="this.parentElement.remove()">Dismiss</button>
    `;
    document.body.appendChild(notification);
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    toast.setAttribute("role", "alert");

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add("toast--visible"), 100);

    // Remove after delay
    setTimeout(() => {
      toast.classList.remove("toast--visible");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  announcePageReady() {
    // Create announcement for screen readers
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = "Page loaded and ready for interaction";

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => announcement.remove(), 1000);
  }
}

// Initialize the application
new App();

// Export for module usage
export default App;

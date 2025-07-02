// Analytics and Tracking Management

class AnalyticsManager {
  constructor() {
    this.isEnabled = false;
    this.consentGiven = false;
    this.trackingQueue = [];

    this.init();
  }

  init() {
    // Check for existing consent
    this.checkConsent();

    // Initialize analytics if consent is given
    if (this.consentGiven) {
      this.enableTracking();
    } else {
      this.showConsentBanner();
    }

    // Set up event listeners
    this.setupEventListeners();
  }

  checkConsent() {
    const consent = localStorage.getItem("analytics_consent");
    this.consentGiven = consent === "true";
  }

  enableTracking() {
    this.isEnabled = true;

    // Load Google Analytics if not already loaded
    this.loadGoogleAnalytics();

    // Process queued events
    this.processQueue();

    // Track page view
    this.trackPageView();
  }

  loadGoogleAnalytics() {
    // Only load if GA ID is available and not already loaded
    const gaId = "G-XXXXXXXXXX"; // Replace with actual GA4 ID

    if (!window.gtag && gaId !== "G-XXXXXXXXXX") {
      // Load GA4
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        dataLayer.push(arguments);
      };

      gtag("js", new Date());
      gtag("config", gaId, {
        anonymize_ip: true,
        cookie_flags: "SameSite=None;Secure",
      });
    }
  }

  showConsentBanner() {
    // Check if banner is already shown
    if (document.querySelector(".consent-banner")) return;

    const banner = document.createElement("div");
    banner.className = "consent-banner";
    banner.innerHTML = `
      <div class="consent-banner__content">
        <p>We use cookies to improve your experience and analyze site usage. By continuing to browse, you consent to our use of cookies.</p>
        <div class="consent-banner__actions">
          <button class="btn btn--sm btn--secondary" data-consent="reject">Decline</button>
          <button class="btn btn--sm btn--primary" data-consent="accept">Accept</button>
        </div>
      </div>
    `;

    // Add styles
    const styles = `
      .consent-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(26, 42, 71, 0.95);
        color: white;
        padding: 1rem;
        z-index: 1000;
        backdrop-filter: blur(10px);
      }
      .consent-banner__content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      .consent-banner__actions {
        display: flex;
        gap: 0.5rem;
      }
      @media (max-width: 768px) {
        .consent-banner__content {
          flex-direction: column;
          text-align: center;
        }
      }
    `;

    if (!document.querySelector("#consent-styles")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "consent-styles";
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    document.body.appendChild(banner);

    // Add event listeners
    banner.addEventListener("click", (e) => {
      if (e.target.dataset.consent === "accept") {
        this.giveConsent();
        banner.remove();
      } else if (e.target.dataset.consent === "reject") {
        this.rejectConsent();
        banner.remove();
      }
    });
  }

  giveConsent() {
    localStorage.setItem("analytics_consent", "true");
    this.consentGiven = true;
    this.enableTracking();
  }

  rejectConsent() {
    localStorage.setItem("analytics_consent", "false");
    this.consentGiven = false;
  }

  setupEventListeners() {
    // Track button clicks
    document.addEventListener("click", (e) => {
      if (e.target.matches(".btn, .card--interactive, .cta-button")) {
        this.trackEvent("click", "button", {
          text: e.target.textContent.trim(),
          url: window.location.pathname,
        });
      }
    });

    // Track form submissions
    document.addEventListener("submit", (e) => {
      if (e.target.matches("form")) {
        this.trackEvent("submit", "form", {
          form_id: e.target.id || "unknown",
          url: window.location.pathname,
        });
      }
    });

    // Track outbound links
    document.addEventListener("click", (e) => {
      if (
        e.target.matches(
          'a[href^="http"]:not([href*="' + window.location.hostname + '"])',
        )
      ) {
        this.trackEvent("click", "outbound_link", {
          url: e.target.href,
          text: e.target.textContent.trim(),
        });
      }
    });

    // Track scroll depth
    this.trackScrollDepth();
  }

  trackEvent(action, category, parameters = {}) {
    const eventData = {
      action,
      category,
      timestamp: Date.now(),
      url: window.location.pathname,
      ...parameters,
    };

    if (this.isEnabled && window.gtag) {
      gtag("event", action, {
        event_category: category,
        ...parameters,
      });
    } else {
      // Queue the event for later
      this.trackingQueue.push(eventData);
    }

    // Also send to custom analytics if needed
    this.sendToCustomAnalytics(eventData);
  }

  trackPageView() {
    if (this.isEnabled && window.gtag) {
      gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }

  trackScrollDepth() {
    let maxScroll = 0;
    const thresholds = [25, 50, 75, 90];
    const tracked = new Set();

    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100,
      );

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        thresholds.forEach((threshold) => {
          if (scrollPercent >= threshold && !tracked.has(threshold)) {
            tracked.add(threshold);
            this.trackEvent("scroll", "scroll_depth", {
              scroll_depth: threshold,
            });
          }
        });
      }
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          trackScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
  }

  processQueue() {
    while (this.trackingQueue.length > 0) {
      const event = this.trackingQueue.shift();
      this.trackEvent(event.action, event.category, event);
    }
  }

  sendToCustomAnalytics(eventData) {
    // Implement custom analytics endpoint if needed
    // This could be your own analytics server or third-party service
    console.log("Analytics Event:", eventData);
  }

  // Public method to track custom events
  static track(action, category, parameters = {}) {
    if (window.analyticsManager) {
      window.analyticsManager.trackEvent(action, category, parameters);
    }
  }
}

// Initialize analytics manager
const analyticsManager = new AnalyticsManager();
window.analyticsManager = analyticsManager;

export default AnalyticsManager;

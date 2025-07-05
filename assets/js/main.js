/**
 * Stay Dripped Mobile IV - Main JavaScript
 * Comprehensive functionality for the website
 */

class StayDrippedApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
    this.setupAnalytics();
    this.setupAccessibility();
  }

  setupEventListeners() {
    // DOM Content Loaded
    document.addEventListener("DOMContentLoaded", () => {
      this.initializeOnLoad();
    });

    // Window Load
    window.addEventListener("load", () => {
      this.optimizePerformance();
    });

    // Scroll Events
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Resize Events
    window.addEventListener(
      "resize",
      this.debounce(() => {
        this.handleResize();
      }, 250),
    );
  }

  initializeOnLoad() {
    this.setupFAQ();
    this.setupSmoothScrolling();
    this.setupBackToTop();
    this.setupDarkMode();
    this.setupMobileMenu();
    this.setupFormHandling();
    this.setupIntersectionObserver();
  }

  setupFAQ() {
    const faqButtons = document.querySelectorAll(".faq-question");

    faqButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const answer = button.nextElementSibling;
        const expanded = button.getAttribute("aria-expanded") === "true";
        const icon = button.querySelector("span");

        // Close all other answers
        document.querySelectorAll(".faq-answer").forEach((el) => {
          if (el !== answer) {
            el.style.display = "none";
            el.previousElementSibling.setAttribute("aria-expanded", "false");
            el.previousElementSibling.querySelector("span").textContent = "+";
          }
        });

        // Toggle current answer
        button.setAttribute("aria-expanded", !expanded);
        answer.style.display = expanded ? "none" : "block";
        icon.textContent = expanded ? "+" : "−";

        // Track analytics
        this.trackEvent(
          "FAQ",
          expanded ? "close" : "open",
          button.textContent.trim(),
        );
      });
    });
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));

        if (target) {
          const headerHeight =
            document.querySelector(".site-header").offsetHeight;
          const targetPosition = target.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          // Track analytics
          this.trackEvent(
            "Navigation",
            "scroll_to_section",
            anchor.getAttribute("href"),
          );
        }
      });
    });
  }

  setupBackToTop() {
    const backToTop = document.getElementById("back-to-top");

    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.trackEvent("Navigation", "back_to_top");
      });
    }
  }

  setupDarkMode() {
    const toggle = document.getElementById("dark-mode-toggle");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const savedMode = localStorage.getItem("darkMode");

    // Initialize dark mode
    if (savedMode === "true" || (savedMode === null && prefersDark)) {
      document.documentElement.classList.add("dark-mode");
      if (toggle) toggle.textContent = "🌙";
    }

    if (toggle) {
      toggle.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark-mode");
        toggle.textContent = isDark ? "🌙" : "☀️";
        localStorage.setItem("darkMode", isDark);

        this.trackEvent(
          "UI",
          "dark_mode_toggle",
          isDark ? "enabled" : "disabled",
        );
      });
    }
  }

  setupMobileMenu() {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const nav = document.querySelector(".main-nav");

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const isOpen = toggle.classList.toggle("active");
        nav.classList.toggle("active");
        document.body.style.overflow = isOpen ? "hidden" : "";

        this.trackEvent("UI", "mobile_menu_toggle", isOpen ? "open" : "close");
      });

      // Close menu when clicking nav links
      nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          toggle.classList.remove("active");
          nav.classList.remove("active");
          document.body.style.overflow = "";
        });
      });
    }
  }

  setupFormHandling() {
    // Email capture forms
    document.querySelectorAll('form[data-capture="email"]').forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;

        if (this.validateEmail(email)) {
          this.handleEmailCapture(email);
          this.trackEvent("Lead", "email_capture", "success");
        } else {
          this.showNotification("Please enter a valid email address", "error");
          this.trackEvent("Lead", "email_capture", "validation_error");
        }
      });
    });

    // Phone number clicks
    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
      link.addEventListener("click", () => {
        this.trackEvent("Contact", "phone_click", link.getAttribute("href"));
      });
    });

    // Email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
      link.addEventListener("click", () => {
        this.trackEvent("Contact", "email_click", link.getAttribute("href"));
      });
    });
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
          this.trackEvent(
            "Engagement",
            "section_view",
            entry.target.id || entry.target.className,
          );
        }
      });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll("section, .card").forEach((el) => {
      observer.observe(el);
    });
  }

  handleScroll() {
    const scrollY = window.scrollY;
    const backToTop = document.getElementById("back-to-top");
    const header = document.querySelector(".site-header");

    // Back to top button
    if (backToTop) {
      backToTop.style.display = scrollY > 300 ? "block" : "none";
    }

    // Header scroll effect
    if (header) {
      header.classList.toggle("scrolled", scrollY > 100);
    }

    // Floating review buttons visibility
    const floatingBtns = document.querySelectorAll(".floating-review-btn");
    floatingBtns.forEach((btn) => {
      btn.style.opacity = scrollY > 200 ? "1" : "0.7";
    });
  }

  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 1024) {
      const toggle = document.querySelector(".mobile-menu-toggle");
      const nav = document.querySelector(".main-nav");

      if (toggle && nav) {
        toggle.classList.remove("active");
        nav.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  }

  optimizePerformance() {
    // Lazy load images
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }

    // Preload critical resources
    this.preloadResources();
  }

  preloadResources() {
    const criticalResources = [
      "https://staydripped.intakeq.com/booking",
      "https://static.elfsight.com/platform/platform.js",
    ];

    criticalResources.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = url;
      link.as = "script";
      document.head.appendChild(link);
    });
  }

  setupAnalytics() {
    // Initialize analytics if available
    if (typeof gtag === "function") {
      this.analytics = gtag;
    } else if (typeof fbq === "function") {
      this.analytics = fbq;
    }

    // Track page view
    this.trackEvent("Page", "view", window.location.pathname);
  }

  setupAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector(".skip-link");
    if (skipLink) {
      skipLink.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute("href"));
        if (target) {
          target.focus();
          target.scrollIntoView();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      // Escape key closes modals/menus
      if (e.key === "Escape") {
        const activeMenu = document.querySelector(".mobile-menu-toggle.active");
        if (activeMenu) {
          activeMenu.click();
        }
      }
    });

    // Focus management
    document.addEventListener("focusin", (e) => {
      if (e.target.matches(".btn, a, input, textarea, select")) {
        e.target.classList.add("focus-visible");
      }
    });

    document.addEventListener("focusout", (e) => {
      e.target.classList.remove("focus-visible");
    });
  }

  // Utility Functions
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  handleEmailCapture(email) {
    // Store email for booking
    sessionStorage.setItem("userEmail", email);

    // Show success message
    this.showNotification("Thanks! We'll be in touch soon.", "success");

    // Optionally redirect to booking with email pre-filled
    setTimeout(() => {
      window.open(
        `https://staydripped.intakeq.com/booking?email=${encodeURIComponent(email)}`,
        "_blank",
      );
    }, 1000);
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()" aria-label="Close">×</button>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "var(--accent)" : type === "error" ? "#dc3545" : "var(--primary)"};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 400px;
      animation: slide-in-right 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = "slideOutRight 0.3s ease-out";
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  trackEvent(category, action, label = "") {
    // Track with multiple analytics providers
    try {
      // Google Analytics 4
      if (typeof gtag === "function") {
        gtag("event", action, {
          event_category: category,
          event_label: label,
        });
      }

      // Facebook Pixel
      if (typeof fbq === "function") {
        fbq("track", "CustomEvent", {
          category,
          action,
          label,
        });
      }

      // Console log for debugging
      if (process.env.NODE_ENV === "development") {
        console.log("Analytics Event:", { category, action, label });
      }
    } catch (error) {
      console.warn("Analytics tracking error:", error);
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Global booking function for membership buttons
window.forwardToBooking = function (form) {
  const email = form.email?.value || "";
  const plan = form.plan?.value || "";

  const serviceMap = {
    Premium: "PREMIUM_MEMBERSHIP_2025",
    Essential: "ESSENTIAL_MEMBERSHIP_2025",
    Shot: "SHOTPASS_MEMBERSHIP_2025",
  };

  const serviceId = serviceMap[plan] || "";
  const url = serviceId
    ? `https://staydripped.intakeq.com/booking?serviceId=${serviceId}&email=${encodeURIComponent(email)}`
    : "https://staydripped.intakeq.com/booking";

  window.open(url, "_blank", "noopener");

  // Track conversion
  if (window.stayDrippedApp) {
    window.stayDrippedApp.trackEvent("Conversion", "membership_signup", plan);
  }

  return false;
};

// Initialize the application
window.stayDrippedApp = new StayDrippedApp();

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = StayDrippedApp;
}

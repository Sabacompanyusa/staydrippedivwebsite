// Smooth Scroll for Anchor Links

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Check if browser supports smooth scrolling
    if ("scrollBehavior" in document.documentElement.style) {
      // Native smooth scrolling is supported
      document.documentElement.style.scrollBehavior = "smooth";
    } else {
      // Polyfill for older browsers
      this.polyfill();
    }

    // Handle anchor links
    this.handleAnchorLinks();
  }

  handleAnchorLinks() {
    // Get all anchor links that point to elements on the same page
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");

        // Skip if it's just "#"
        if (href === "#") return;

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
          this.scrollToElement(targetElement);

          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }

          // Focus the target element for accessibility
          this.focusElement(targetElement);
        }
      });
    });
  }

  scrollToElement(element) {
    const headerHeight = this.getHeaderHeight();
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      // Animated scroll for older browsers
      this.animateScroll(offsetPosition);
    }
  }

  getHeaderHeight() {
    const header = document.querySelector(".site-header");
    return header ? header.offsetHeight + 20 : 20; // Add some padding
  }

  focusElement(element) {
    // Make element focusable if it isn't already
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "-1");
    }

    // Focus the element
    element.focus();

    // Remove tabindex after focusing if we added it
    setTimeout(() => {
      if (element.getAttribute("tabindex") === "-1") {
        element.removeAttribute("tabindex");
      }
    }, 100);
  }

  animateScroll(targetPosition) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 second
    let start = null;

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = this.easeInOutQuad(
        timeElapsed,
        startPosition,
        distance,
        duration,
      );
      window.scrollTo(0, run);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  // Easing function for smooth animation
  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  polyfill() {
    // Basic polyfill for smooth scrolling
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        return setTimeout(callback, 16);
      };
    }
  }

  // Public method to scroll to any element
  static scrollTo(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (element) {
      const instance = new SmoothScroll();
      const headerHeight = instance.getHeaderHeight();
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }
}

// Initialize smooth scroll
document.addEventListener("DOMContentLoaded", () => {
  new SmoothScroll();
});

// Make it available globally
window.SmoothScroll = SmoothScroll;

export default SmoothScroll;

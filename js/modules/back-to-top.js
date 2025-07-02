// Back to Top Button Functionality

class BackToTop {
  constructor() {
    this.button = document.getElementById("back-to-top");
    this.scrollThreshold = 300; // Show button after scrolling 300px
    this.init();
  }

  init() {
    if (!this.button) return;

    // Show/hide button based on scroll position
    this.handleScroll();
    window.addEventListener("scroll", () => this.handleScroll(), {
      passive: true,
    });

    // Add click event to scroll to top
    this.button.addEventListener("click", () => this.scrollToTop());
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.scrollThreshold) {
      this.showButton();
    } else {
      this.hideButton();
    }
  }

  showButton() {
    this.button.style.display = "flex";
    // Trigger reflow to ensure display change is processed
    this.button.offsetHeight;
    this.button.style.opacity = "1";
    this.button.style.transform = "scale(1)";
  }

  hideButton() {
    this.button.style.opacity = "0";
    this.button.style.transform = "scale(0.8)";

    // Hide button after transition
    setTimeout(() => {
      if (this.button.style.opacity === "0") {
        this.button.style.display = "none";
      }
    }, 200);
  }

  scrollToTop() {
    const startPosition = window.pageYOffset;
    const duration = Math.min(startPosition / 3, 800); // Max 800ms duration

    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // Fallback animation for older browsers
      this.animateScroll(startPosition, duration);
    }

    // Track analytics
    if (window.analyticsManager) {
      window.analyticsManager.trackEvent("click", "back_to_top");
    }
  }

  animateScroll(startPosition, duration) {
    let start = null;

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = this.easeOutCubic(
        timeElapsed,
        startPosition,
        -startPosition,
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
  easeOutCubic(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new BackToTop();
});

export default BackToTop;

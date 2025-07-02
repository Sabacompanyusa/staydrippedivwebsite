// Lazy Loading for Images and Content

class LazyLoader {
  constructor() {
    this.imageObserver = null;
    this.contentObserver = null;
    this.init();
  }

  init() {
    // Check for Intersection Observer support
    if ("IntersectionObserver" in window) {
      this.setupImageLazyLoading();
      this.setupContentLazyLoading();
    } else {
      // Fallback for older browsers
      this.fallbackImageLoading();
    }
  }

  setupImageLazyLoading() {
    this.imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.imageObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      },
    );

    // Observe all lazy images
    document.querySelectorAll("img[data-src], img.lazy").forEach((img) => {
      this.imageObserver.observe(img);
    });
  }

  setupContentLazyLoading() {
    this.contentObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            this.contentObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -100px 0px",
        threshold: 0.1,
      },
    );

    // Observe elements with lazy animation classes
    document.querySelectorAll(".lazy-animate").forEach((element) => {
      this.contentObserver.observe(element);
    });
  }

  loadImage(img) {
    // Handle data-src attribute
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    }

    // Handle data-srcset attribute
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      img.removeAttribute("data-srcset");
    }

    // Add loaded class and remove lazy class
    img.addEventListener("load", () => {
      img.classList.add("loaded");
      img.classList.remove("lazy");
    });

    // Handle load errors
    img.addEventListener("error", () => {
      img.classList.add("error");
      img.classList.remove("lazy");
    });
  }

  fallbackImageLoading() {
    // Load all lazy images immediately for older browsers
    document.querySelectorAll("img[data-src]").forEach((img) => {
      this.loadImage(img);
    });

    // Animate all lazy content immediately
    document.querySelectorAll(".lazy-animate").forEach((element) => {
      element.classList.add("animate-in");
    });
  }

  // Public method to refresh observers (useful for dynamic content)
  refresh() {
    if (this.imageObserver) {
      document.querySelectorAll("img[data-src]:not(.loaded)").forEach((img) => {
        this.imageObserver.observe(img);
      });
    }

    if (this.contentObserver) {
      document
        .querySelectorAll(".lazy-animate:not(.animate-in)")
        .forEach((element) => {
          this.contentObserver.observe(element);
        });
    }
  }

  // Clean up observers
  destroy() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
    if (this.contentObserver) {
      this.contentObserver.disconnect();
    }
  }
}

// Initialize lazy loader
const lazyLoader = new LazyLoader();

// Make it available globally for dynamic content
window.lazyLoader = lazyLoader;

export default LazyLoader;

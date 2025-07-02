/**
 * Premium Interactions & Visual Enhancements
 * Enhanced JavaScript for Stay Dripped Mobile IV
 */

class PremiumInteractions {
  constructor() {
    try {
      this.init();
    } catch (error) {
      console.warn("PremiumInteractions initialization error:", error);
    }
  }

  init() {
    const methods = [
      "createScrollIndicator",
      "setupParallaxEffects",
      "setupIntersectionObserver",
      "setupSmoothScrolling",
      "setupButtonRippleEffect",
      "setupImageLazyLoading",
      "setupPreloadAnimations",
      "setupFloatingElements",
      "setupMouseTracker",
    ];

    methods.forEach((methodName) => {
      try {
        if (typeof this[methodName] === "function") {
          this[methodName]();
        }
      } catch (error) {
        console.warn(`Error in ${methodName}:`, error);
      }
    });
  }

  // Scroll Progress Indicator
  createScrollIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "scroll-progress-indicator";
    indicator.innerHTML = `
      <div class="scroll-progress-bar"></div>
      <div class="scroll-progress-glow"></div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .scroll-progress-indicator {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        z-index: 9999;
        background: rgba(15, 23, 42, 0.1);
        backdrop-filter: blur(10px);
      }

      .scroll-progress-bar {
        height: 100%;
        background: var(--gradient-cyan);
        width: 0%;
        transition: width 0.2s ease-out;
        position: relative;
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
      }

      .scroll-progress-glow {
        position: absolute;
        top: -2px;
        right: -20px;
        width: 40px;
        height: 8px;
        background: radial-gradient(ellipse, rgba(0, 212, 255, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .scroll-progress-indicator.visible .scroll-progress-glow {
        opacity: 1;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(indicator);

    const progressBar = indicator.querySelector(".scroll-progress-bar");

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      progressBar.style.width = `${scrollPercent}%`;

      if (scrollPercent > 5) {
        indicator.classList.add("visible");
      } else {
        indicator.classList.remove("visible");
      }
    });
  }

  // Enhanced Parallax Effects
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll(
      ".parallax, .hero, .service-card",
    );

    if (parallaxElements.length === 0) return;

    let ticking = false;

    function updateParallax() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      const rateGlow = scrolled * -0.3;

      parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.1;
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;

        // Add subtle glow effect on scroll
        if (element.classList.contains("service-card")) {
          const glowIntensity = Math.min(scrolled / 1000, 0.3);
          element.style.boxShadow = `
            var(--shadow-metal),
            0 0 ${20 + scrolled / 20}px rgba(0, 212, 255, ${glowIntensity})
          `;
        }
      });

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener("scroll", requestTick);
  }

  // Enhanced Intersection Observer for Animations
  setupIntersectionObserver() {
    const animatedElements = document.querySelectorAll(
      ".service-card, .card, .hero-content, .section",
    );

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "-50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate-in");

            // Add staggered animations
            const delay = index * 100;
            entry.target.style.animationDelay = `${delay}ms`;

            // Add glow effect to cards
            if (
              entry.target.classList.contains("service-card") ||
              entry.target.classList.contains("card")
            ) {
              setTimeout(() => {
                entry.target.style.boxShadow = `
                  var(--shadow-metal),
                  0 0 30px rgba(0, 212, 255, 0.2)
                `;
              }, delay + 300);
            }
          }, index * 50);
        }
      });
    }, observerOptions);

    animatedElements.forEach((el) => observer.observe(el));

    // Add CSS for animations
    const style = document.createElement("style");
    style.textContent = `
      .animate-in {
        animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards,
                   glow 0.8s ease-out 0.3s forwards;
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(50px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes glow {
        from {
          box-shadow: var(--shadow);
        }
        to {
          box-shadow: var(--shadow-metal);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Enhanced Smooth Scrolling
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
          const headerHeight =
            document.querySelector("header")?.offsetHeight || 0;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight -
            20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          // Add visual feedback
          target.style.transform = "scale(1.02)";
          target.style.transition = "transform 0.3s ease";

          setTimeout(() => {
            target.style.transform = "scale(1)";
          }, 300);
        }
      });
    });
  }

  // Button Ripple Effect
  setupButtonRippleEffect() {
    const buttons = document.querySelectorAll(
      ".btn, .service-btn, .metallic-btn, button",
    );

    buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
          z-index: 1;
        `;

        this.style.position = "relative";
        this.style.overflow = "hidden";
        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Add ripple animation CSS
    const style = document.createElement("style");
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Enhanced Image Lazy Loading
  setupImageLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));

    // Add loading animation
    const style = document.createElement("style");
    style.textContent = `
      img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }

      img.loaded {
        opacity: 1;
        animation: none;
      }

      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Preload Animations Setup
  setupPreloadAnimations() {
    // Add entrance animations to elements
    const elements = document.querySelectorAll(
      ".hero-content, .service-card, .card",
    );
    elements.forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

      setTimeout(
        () => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        },
        index * 100 + 200,
      );
    });
  }

  // Floating Elements Effect
  setupFloatingElements() {
    const floatingElements = document.querySelectorAll(".service-card, .card");

    floatingElements.forEach((element, index) => {
      const duration = 3000 + index * 500;
      const delay = index * 200;

      element.style.animation = `float ${duration}ms ease-in-out ${delay}ms infinite alternate`;
    });

    // Add floating animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes float {
        from {
          transform: translateY(0px) rotateX(0deg);
        }
        to {
          transform: translateY(-10px) rotateX(2deg);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Mouse Tracker for Interactive Effects
  setupMouseTracker() {
    let mouseX = 0,
      mouseY = 0;
    let isMoving = false;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;

      clearTimeout(this.mouseTimeout);
      this.mouseTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);

      // Add subtle parallax to cards based on mouse position
      const cards = document.querySelectorAll(".service-card, .card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (mouseX - centerX) * 0.01;
        const deltaY = (mouseY - centerY) * 0.01;

        card.style.transform = `translate(${deltaX}px, ${deltaY}px) perspective(1000px) rotateX(${deltaY * 0.1}deg) rotateY(${deltaX * 0.1}deg)`;
      });
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PremiumInteractions();
});

// Enhanced Loading Performance
class PerformanceOptimizer {
  constructor() {
    this.setupCriticalResourceHints();
    this.setupLazyLoading();
    this.setupCacheStrategies();
  }

  setupCriticalResourceHints() {
    // Preload critical fonts
    const fontLink = document.createElement("link");
    fontLink.rel = "preload";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
    fontLink.as = "style";
    fontLink.crossOrigin = "anonymous";
    document.head.appendChild(fontLink);

    // DNS prefetch for external resources
    const dnsPrefetches = [
      "https://intakeq.com",
      "https://static.elfsight.com",
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ];

    dnsPrefetches.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  setupLazyLoading() {
    // Lazy load non-critical CSS
    const nonCriticalCSS = [
      "assets/css/animations.css",
      "assets/css/responsive.css",
    ];

    nonCriticalCSS.forEach((css) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = css;
      link.media = "print";
      link.onload = () => {
        link.media = "all";
      };
      document.head.appendChild(link);
    });
  }

  setupCacheStrategies() {
    // Service worker registration for caching
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }
  }
}

// Initialize performance optimizations
new PerformanceOptimizer();

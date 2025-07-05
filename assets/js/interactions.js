/**
 * Advanced Interactive Enhancements
 * Professional interactions for Stay Dripped Mobile IV
 */

class AdvancedInteractions {
  constructor() {
    try {
      this.init();
    } catch (error) {
      console.warn("AdvancedInteractions initialization error:", error);
    }
  }

  init() {
    const methods = [
      "setupAdvancedScrollEffects",
      "setupMagneticButtons",
      "setupTextAnimations",
      "setupParticleBackground",
      "setupSmoothReveal",
      "setupAdvancedFAQ",
      "setupPerformanceOptimization",
      "setupAccessibilityEnhancements",
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

  // Advanced Scroll Effects
  setupAdvancedScrollEffects() {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollEffects = () => {
      const scrollY = window.scrollY;
      const scrollDirection = scrollY > lastScrollY ? "down" : "up";
      const scrollPercentage =
        (scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      // Header background opacity
      const header = document.querySelector("header");
      if (header) {
        const opacity = Math.min(scrollY / 100, 0.95);
        header.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
        header.style.backdropFilter = `blur(${Math.min(scrollY / 10, 20)}px)`;
      }

      // Floating cards effect
      const cards = document.querySelectorAll(
        ".card, .service-card, .how-it-works-step",
      );
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          const progress =
            (window.innerHeight - rect.top) /
            (window.innerHeight + rect.height);
          const translateY = (progress - 0.5) * 20;
          card.style.transform = `translateY(${translateY}px) perspective(1000px) rotateX(${progress * 2}deg)`;
        }
      });

      // Section reveal effects
      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;

        if (isVisible && !section.classList.contains("revealed")) {
          section.classList.add("revealed");
          this.triggerSectionAnimations(section);
        }
      });

      lastScrollY = scrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    };

    window.addEventListener("scroll", requestTick, { passive: true });

    // Add CSS for scroll effects
    const style = document.createElement("style");
    style.textContent = `
      .revealed .animate-slide-up {
        animation: advancedSlideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }

      @keyframes advancedSlideUp {
        from {
          opacity: 0;
          transform: translateY(60px) scale(0.9);
          filter: blur(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
      }

      section {
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
    `;
    document.head.appendChild(style);
  }

  // Magnetic Button Effects
  setupMagneticButtons() {
    const buttons = document.querySelectorAll(
      ".btn-primary, .btn-secondary, .booking-btn, .premium-btn",
    );

    buttons.forEach((button) => {
      button.addEventListener("mousemove", (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = Math.max(rect.width, rect.height) / 2;
        const strength = Math.max(0, 1 - distance / maxDistance);

        const moveX = (x / maxDistance) * 10 * strength;
        const moveY = (y / maxDistance) * 10 * strength;

        button.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.05})`;

        // Gradient following mouse
        const gradientX = ((e.clientX - rect.left) / rect.width) * 100;
        const gradientY = ((e.clientY - rect.top) / rect.height) * 100;

        button.style.background = `
          radial-gradient(circle at ${gradientX}% ${gradientY}%,
            rgba(255,255,255,0.2) 0%,
            transparent 50%),
          var(--gradient-primary)
        `;
      });

      button.addEventListener("mouseleave", () => {
        button.style.transform = "";
        button.style.background = "";
      });
    });
  }

  // Advanced Text Animations
  setupTextAnimations() {
    const animateText = (element) => {
      const text = element.textContent;
      element.innerHTML = "";

      text.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(20px) rotateX(90deg)";
        span.style.transition = `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.03}s`;
        element.appendChild(span);

        setTimeout(
          () => {
            span.style.opacity = "1";
            span.style.transform = "translateY(0) rotateX(0)";
          },
          100 + index * 30,
        );
      });
    };

    const textElements = document.querySelectorAll(
      ".how-it-works-title, .faq-title, .booking-title, .testimonials-title",
    );

    const textObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !entry.target.classList.contains("text-animated")
          ) {
            entry.target.classList.add("text-animated");
            animateText(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    textElements.forEach((el) => textObserver.observe(el));
  }

  // Particle Background Effect
  setupParticleBackground() {
    const createParticle = (container) => {
      const particle = document.createElement("div");
      particle.className = "particle";

      const size = Math.random() * 4 + 1;
      const x = Math.random() * container.offsetWidth;
      const y = Math.random() * container.offsetHeight;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(0, 229, 255, 0.6) 0%, transparent 70%);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: float ${8 + Math.random() * 8}s ease-in-out infinite;
        animation-delay: ${Math.random() * 8}s;
      `;

      container.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 16000);
    };

    const heroSection = document.querySelector(".hero");
    const bookingSection = document.querySelector(".booking-section");

    [heroSection, bookingSection].forEach((section) => {
      if (section) {
        section.style.position = "relative";
        section.style.overflow = "hidden";

        setInterval(() => {
          if (Math.random() < 0.3) {
            createParticle(section);
          }
        }, 2000);
      }
    });
  }

  // Smooth Reveal Animations
  setupSmoothReveal() {
    const revealElements = document.querySelectorAll(
      ".card, .service-card, .how-it-works-step, .faq-item",
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0) scale(1)";
              entry.target.style.filter = "blur(0)";
            }, index * 150);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "-50px 0px",
      },
    );

    revealElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(60px) scale(0.9)";
      el.style.filter = "blur(5px)";
      el.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      revealObserver.observe(el);
    });
  }

  // Advanced FAQ Interactions
  setupAdvancedFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item, index) => {
      const summary = item.querySelector(".faq-summary");
      const answer = item.querySelector(".faq-answer");

      if (summary && answer) {
        summary.addEventListener("click", (e) => {
          e.preventDefault();

          // Close other items
          faqItems.forEach((otherItem) => {
            if (otherItem !== item && otherItem.hasAttribute("open")) {
              otherItem.removeAttribute("open");
              const otherAnswer = otherItem.querySelector(".faq-answer");
              if (otherAnswer) {
                otherAnswer.style.maxHeight = "0";
                otherAnswer.style.opacity = "0";
              }
            }
          });

          // Toggle current item
          if (item.hasAttribute("open")) {
            item.removeAttribute("open");
            answer.style.maxHeight = "0";
            answer.style.opacity = "0";
          } else {
            item.setAttribute("open", "");
            answer.style.maxHeight = answer.scrollHeight + "px";
            answer.style.opacity = "1";

            // Scroll to item
            setTimeout(() => {
              item.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
              });
            }, 300);
          }
        });

        // Initialize styles
        answer.style.maxHeight = "0";
        answer.style.opacity = "0";
        answer.style.transition =
          "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        answer.style.overflow = "hidden";
      }
    });
  }

  // Performance Optimization
  setupPerformanceOptimization() {
    // Throttle resize events
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.recalculateAnimations();
      }, 150);
    });

    // Intersection observer for performance
    const performanceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-viewport");
          } else {
            entry.target.classList.remove("in-viewport");
          }
        });
      },
      { threshold: 0.1 },
    );

    document
      .querySelectorAll(".animate-float, .animate-pulse-glow")
      .forEach((el) => {
        performanceObserver.observe(el);
      });

    // Add CSS for performance optimization
    const style = document.createElement("style");
    style.textContent = `
      .animate-float:not(.in-viewport),
      .animate-pulse-glow:not(.in-viewport) {
        animation-play-state: paused;
      }

      .in-viewport.animate-float,
      .in-viewport.animate-pulse-glow {
        animation-play-state: running;
      }
    `;
    document.head.appendChild(style);
  }

  // Accessibility Enhancements
  setupAccessibilityEnhancements() {
    // Keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll(
      ".faq-summary, .card, .service-card",
    );

    interactiveElements.forEach((element) => {
      if (!element.hasAttribute("tabindex")) {
        element.setAttribute("tabindex", "0");
      }

      element.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          element.click();
        }
      });
    });

    // Focus management
    document.addEventListener("focusin", (e) => {
      if (e.target.classList.contains("faq-summary")) {
        e.target.style.outline = "3px solid rgba(0, 229, 255, 0.5)";
        e.target.style.outlineOffset = "2px";
      }
    });

    document.addEventListener("focusout", (e) => {
      if (e.target.classList.contains("faq-summary")) {
        e.target.style.outline = "";
        e.target.style.outlineOffset = "";
      }
    });

    // Reduced motion handling
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const style = document.createElement("style");
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Helper Methods
  triggerSectionAnimations(section) {
    const animatedElements = section.querySelectorAll(".animate-slide-up");
    animatedElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, index * 100);
    });
  }

  recalculateAnimations() {
    // Recalculate animation positions on resize
    const animatedElements = document.querySelectorAll(".card, .service-card");
    animatedElements.forEach((el) => {
      el.style.transform = "";
    });
  }
}

// Initialize when DOM is loaded safely
document.addEventListener("DOMContentLoaded", () => {
  try {
    new AdvancedInteractions();
  } catch (error) {
    console.warn("AdvancedInteractions initialization error:", error);
  }
});

// Export for potential module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = AdvancedInteractions;
}

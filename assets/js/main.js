// Main JavaScript file for Stay Dripped Mobile IV
(function() {
  'use strict';

  // Initialize the application
  window.initializeApp = function() {
    initScrollIndicator();
    initSmoothScrolling();
    initLazyLoading();
    initAccessibility();
    initAnalytics();
  };

  // Scroll Progress Indicator
  function initScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    
    if (scrollIndicator) {
      window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollIndicator.style.width = scrolled + '%';
      });
    }
  }

  // Smooth Scrolling for all anchor links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') return;
        
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
        }
      });
    });

    // Clear location hash when user scrolls away from the target
    window.addEventListener('scroll', debounce(() => {
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const offset = target.getBoundingClientRect().top - headerHeight;
          if (Math.abs(offset) > 200) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }
      }
    }, 200));
  }

  // Lazy Loading for images
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  // Accessibility improvements
  function initAccessibility() {
    // Skip to main content
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView();
        }
      });
    }
    
    // Manage focus for modals
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // Close any open modals
        const activeModals = document.querySelectorAll('.modal.active, .exam-modal-overlay.active');
        activeModals.forEach(modal => {
          if (modal.id === 'examModal' && typeof closeExamModal === 'function') {
            closeExamModal();
          }
          // Add handlers for other modals as needed
        });
      }
    });
    
    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(element => {
      if (!element.hasAttribute('tabindex') && element.tagName !== 'A' && element.tagName !== 'BUTTON') {
        element.setAttribute('tabindex', '0');
      }
    });
  }

  // Initialize Analytics
  function initAnalytics() {
    // Page view tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
    
    // Track CTA clicks
    document.querySelectorAll('.cta, .cta-button').forEach(button => {
      button.addEventListener('click', function() {
        const label = this.textContent.trim();
        if (typeof gtag !== 'undefined') {
          gtag('event', 'click', {
            event_category: 'cta',
            event_label: label,
            value: 1
          });
        }
      });
    });
    
    // Track phone number clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', function() {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'click', {
            event_category: 'contact',
            event_label: 'phone_number',
            value: 1
          });
        }
      });
    });
    
    // Track email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      link.addEventListener('click', function() {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'click', {
            event_category: 'contact',
            event_label: 'email',
            value: 1
          });
        }
      });
    });
  }

  // Utility functions
  window.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  window.throttle = function(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // Form validation
  window.validateEmail = function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  window.validatePhone = function(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  };

  // Animation on scroll
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .slide-in');
    
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      animatedElements.forEach(element => {
        animationObserver.observe(element);
      });
    } else {
      // Fallback: show all elements
      animatedElements.forEach(element => {
        element.classList.add('animated');
      });
    }
  }

  // Initialize animations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }

  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      if (typeof gtag !== 'undefined' && pageLoadTime > 0) {
        gtag('event', 'timing_complete', {
          name: 'load',
          value: pageLoadTime,
          event_category: 'performance'
        });
      }
    });
  }

  // Service Worker registration (for PWA support)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('ServiceWorker registration successful');
      }).catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }

})();

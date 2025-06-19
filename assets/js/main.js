// Main site initialization and interactive behaviors
// Copyright © 2025 Stay Dripped Mobile IV

function initializeApp() {
  initScrollIndicator();
  initMobileMenu();
  initSmoothScroll();
  initHeroButtons();
  initFadeIn();
  initTestimonialsSlider();
  exposeMembershipModal();
}

function initScrollIndicator() {
  const indicator = document.getElementById('scrollIndicator');
  if (!indicator) return;
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const width = (scrollTop / docHeight) * 100;
    indicator.style.width = width + '%';
  });
}

function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const nav = document.getElementById('navMenu');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('open');
    const expanded = toggle.classList.contains('active');
    toggle.setAttribute('aria-expanded', expanded);
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId) || document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function initHeroButtons() {
  const heroBtn = document.getElementById('heroBookBtn');
  const headerBtn = document.getElementById('headerBookBtn');
  const bookingSection = document.getElementById('booking-section');
  [heroBtn, headerBtn].forEach(btn => {
    if (btn && bookingSection) {
      btn.addEventListener('click', () => {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      });
    }
  });
}

function initTestimonialsSlider() {
  const slider = document.querySelector('.testimonial-slider');
codex/resolve-conflicts-in-codex/integrate-full-website-features-a
  if (!slider) return;
  const blocks = Array.from(slider.querySelectorAll('blockquote'));
  const prev = document.querySelector('.testimonial-prev');
  const next = document.querySelector('.testimonial-next');
  const dotsContainer = document.querySelector('.testimonial-dots');
  let current = 0;
  if (slider) {
    const blocks = Array.from(slider.querySelectorAll('blockquote'));
    const prev = document.querySelector('.testimonial-prev');
    const next = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    let current = 0;

    const showSlide = idx => {
      blocks.forEach((b, i) => b.classList.toggle('active', i === idx));
      if (dotsContainer) {
        dotsContainer.querySelectorAll('button').forEach((dot, i) => {
          dot.classList.toggle('active', i === idx);
        });
      }
      current = idx;
  };
main

  const showSlide = idx => {
    blocks.forEach((b, i) => b.classList.toggle('active', i === idx));
    if (dotsContainer) {
      dotsContainer.querySelectorAll('button').forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
      });
    }
    current = idx;
  };

  if (dotsContainer) {
    blocks.forEach((_, i) => {
      const d = document.createElement('button');
      if (i === 0) d.classList.add('active');
      d.addEventListener('click', () => showSlide(i));
      dotsContainer.appendChild(d);
    });
  }

  prev && prev.addEventListener('click', () =>
    showSlide((current - 1 + blocks.length) % blocks.length)
  );
  next && next.addEventListener('click', () =>
    showSlide((current + 1) % blocks.length)
  );
}

function initFadeIn() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function exposeMembershipModal() {
  window.showMembershipModal = function () {
    if (window.membershipManager) {
      window.membershipManager.showEmailCaptureModal('Essential');
    }
  };
codex/resolve-conflicts-in-codex/integrate-full-website-features-a
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initializeApp === 'function') {
    initializeApp();
  }

  /* Scroll progress indicator */
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) {
    window.addEventListener('scroll', () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / total) * 100;
      indicator.style.width = progress + '%';
    });
  }

  /* Newsletter form submission */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = newsletterForm.email.value;
      if (window.gtag) {
        gtag('event', 'newsletter_signup', { email });
      }
      newsletterForm.reset();
      alert('Thanks for subscribing!');
    });
  }
});
    if (window.membershipManager) {
      window.membershipManager.showEmailCaptureModal('Essential');
    }
  };
main
});

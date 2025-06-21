// Main site initialization and interactive behaviors
// Copyright © 2025 Stay Dripped Mobile IV

function initializeApp() {
  initScrollIndicator();
  initMobileMenu();
  initSmoothScroll();
  initScrollSpy();
  initHeaderScrollEffect();
  initBookingModal();
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
    nav.classList.toggle('active');
    nav.classList.toggle('open');
    const expanded = toggle.classList.contains('active');
    toggle.setAttribute('aria-expanded', expanded);
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetSelector = link.getAttribute('href');
      const target = document.querySelector(targetSelector);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(sec => observer.observe(sec));
}

function initHeaderScrollEffect() {
  const header = document.querySelector('.header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
}

function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const openBtn = document.getElementById('openBooking');
  const closeBtn = modal ? modal.querySelector('.close') : null;
  if (!modal || !openBtn || !closeBtn) return;

  openBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
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
  if (!slider) return;

  const blocks = Array.from(slider.querySelectorAll('blockquote'));
  const prev = slider.querySelector('.testimonial-prev');
  const next = slider.querySelector('.testimonial-next');
  const dotsContainer = slider.querySelector('.testimonial-dots');
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

  if (dotsContainer) {
    blocks.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => showSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  prev?.addEventListener('click', () =>
    showSlide((current - 1 + blocks.length) % blocks.length)
  );
  next?.addEventListener('click', () =>
    showSlide((current + 1) % blocks.length)
  );

  showSlide(0);
  setInterval(() =>
    showSlide((current + 1) % blocks.length),
    5000
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

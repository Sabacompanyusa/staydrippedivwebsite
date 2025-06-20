// Main site initialization and interactive behaviors
// Copyright © 2025 Stay Dripped Mobile IV

function initializeApp() {
  initScrollIndicator();
  initMobileMenu();
  initSmoothScroll();
  initHeroButtons();
  initFadeIn();
  initTestimonialsSlider();
  initBookingModal();
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
    const expanded = toggle.classList.contains('active');
    toggle.setAttribute('aria-expanded', expanded);
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
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
  const quotes = document.querySelectorAll('.testimonial-slider blockquote');
  const dotsContainer = document.querySelector('.testimonial-dots');
  if (!quotes.length) return;
  let current = 0;

  // build dots
  if (dotsContainer) {
    quotes.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot';
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      dot.addEventListener('click', () => showQuote(i));
      dotsContainer.appendChild(dot);
    });
  }

  function showQuote(idx) {
    quotes.forEach((q, i) => {
      q.classList.toggle('active', i === idx);
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        if (dots[i]) {
          dots[i].classList.add('active');
        }
        if (dots[current]) {
          dots[current].classList.remove('active');
        }
      }
    });
    current = idx;
  }

  function cycle() {
    const next = (current + 1) % quotes.length;
    showQuote(next);
  }

  showQuote(0);
  setInterval(cycle, 5000);
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

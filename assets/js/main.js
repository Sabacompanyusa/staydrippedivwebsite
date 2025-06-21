// General site interactions and small widgets
// Handles mobile menu toggle, smooth scrolling, testimonial slider
// and exposes helper used by membership CTA button.

document.addEventListener('DOMContentLoaded', () => {
  /* Mobile menu toggle */
  const navMenu = document.getElementById('navMenu');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });
  }

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* Book buttons scroll to booking section */
  const bookingSection = document.getElementById('booking-section');
  [document.getElementById('heroBookBtn'), document.getElementById('headerBookBtn')]
    .forEach(btn => {
      btn && bookingSection && btn.addEventListener('click', () => {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      });
    });

  /* Testimonials slider */
  const slider = document.querySelector('.testimonial-slider');
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

  /* Expose membership modal helper */
  window.showMembershipModal = function () {
    if (window.membershipManager) {
      window.membershipManager.showEmailCaptureModal('Essential');
    }
  };

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

  /* Animate elements on scroll */
  const animated = document.querySelectorAll('[data-animate]');
  if (animated.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animated.forEach(el => observer.observe(el));
  }
});

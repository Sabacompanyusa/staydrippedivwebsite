// General front-end interactions
// Handles mobile menu toggle, scroll indicator, animations, and helper actions

function initScrollIndicator() {
  const indicator = document.getElementById('scrollIndicator');
  if (!indicator) return;
  const update = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    indicator.style.width = progress + '%';
  };
  window.addEventListener('scroll', update);
  update();
}

function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (elements.length === 0) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  elements.forEach(el => observer.observe(el));
}

function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    toggle.classList.toggle('open');
  });
}

function initBookingButtons() {
  const bookingSection = document.getElementById('booking-section');
  if (!bookingSection) return;
  const scrollToBooking = () => bookingSection.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('heroBookBtn')?.addEventListener('click', scrollToBooking);
  document.getElementById('headerBookBtn')?.addEventListener('click', scrollToBooking);
}

function exposeMembershipModal() {
  window.showMembershipModal = function(type = 'Essential') {
    if (window.membershipManager && typeof window.membershipManager.showEmailCaptureModal === 'function') {
      window.membershipManager.showEmailCaptureModal(type);
    }
  };
}

function initializeApp() {
  initScrollIndicator();
  initFadeIn();
  initMobileMenu();
  initBookingButtons();
  exposeMembershipModal();
}

document.addEventListener('DOMContentLoaded', initializeApp);

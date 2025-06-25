// Simplified booking interactions for Stay Dripped Mobile IV
// Handles tab switching and membership booking redirects

document.addEventListener('DOMContentLoaded', () => {
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabContents = document.querySelectorAll('.tab-content');

  tabLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('data-tab');
      tabLinks.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      link.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });
});

function forwardToBooking(form) {
  const email = form.email?.value || '';
  const plan = form.plan?.value || '';
  if (!email) return false;

  const serviceMap = {
    Premium: 'PREMIUM_MEMBERSHIP_2025',
    Essential: 'ESSENTIAL_MEMBERSHIP_2025',
    Shot: 'SHOTPASS_MEMBERSHIP_2025'
  };
  const serviceId = serviceMap[plan] || '';
  const url = `https://staydripped.intakeq.com/booking?serviceId=${serviceId}&email=${encodeURIComponent(email)}`;
  window.open(url, '_blank', 'noopener');
  return false;
}

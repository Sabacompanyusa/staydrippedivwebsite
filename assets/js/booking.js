/**

- Stay Dripped Mobile IV - Enhanced Booking System
- Handles tabbed booking UI, smart quiz recommendations, membership CTAs,
- and integration with IntakeQ booking platform
- Copyright © 2025 Stay Dripped Mobile IV LLC
  */

// =============================================
// CONFIGURATION & CONSTANTS
// =============================================

const BOOKING_CONFIG = {
// IntakeQ Base URL
baseBookingUrl: 'https://staydripped.intakeq.com/booking',

// Service IDs for different IV treatments
serviceIds: {
// Basic IVs
basicHydration: '17d0bbca-a123-4b56-789c-def012345678',
hangoverRelief: 'a7d83ea1-cf5e-4865-923e-bfe2232de898',
rehydratePlus: 'ae66ce7c-fa68-408c-9ab0-a04b287f6b31',

// Standard IVs
myersCocktail: 'c13f904a-a8d0-43b1-bd5f-570387ee77d6',
megaMyersCocktail: 'e14cdb17-a9d1-47cb-90e1-d3050059bcf3',
immuneBoost: 'b45d12e3-78a9-4c56-def0-123456789abc',

// Specialty IVs
beautyGlow: '0c0c56b7-85a4-4e01-9b9c-180bc714fa94',
athleticRecovery: 'f789abc1-2345-6789-def0-123456789abc',
antiAging: 'c456def7-89ab-1234-5678-9abcdef01234',

// Premium IVs
goldUltimateHydration: '3519d39a-31ac-4944-80c9-4eb667a13df4',
platinumWellness: 'd567890a-bcde-4567-890a-bcdef0123456',
executiveHealth: 'e678901b-cdef-5678-901b-cdef01234567',

// NAD+ Treatments
nadBasic: 'f789012c-def0-6789-012c-def012345678',
nadPremium: 'g890123d-ef01-7890-123d-ef0123456789',
nadTherapy: 'h901234e-f012-8901-234e-f01234567890',

// Memberships
premiumMembership: 'PREMIUM_MEMBERSHIP_2025',
essentialMembership: 'ESSENTIAL_MEMBERSHIP_2025',
shotPassMembership: 'SHOTPASS_MEMBERSHIP_2025'

},

// Quiz recommendation mapping
quizMapping: {
hangover: {
name: 'Scottsdale Hangover Relief IV',
serviceId: 'hangoverRelief',
description: 'Fast-acting relief from hangover symptoms with targeted hydration and anti-nausea medication.'
},
energy: {
name: "Mega Myers' Cocktail",
serviceId: 'megaMyersCocktail',
description: 'High-dose vitamin blend to boost energy and combat fatigue.'
},
hydration: {
name: 'Gold Ultimate Hydration',
serviceId: 'goldUltimateHydration',
description: 'Premium hydration therapy with electrolytes and essential vitamins.'
},
immunity: {
name: 'Myers' Cocktail',
serviceId: 'myersCocktail',
description: 'Classic vitamin cocktail to strengthen immune system and overall wellness.'
},
beauty: {
name: 'Beauty Glow IV Drip',
serviceId: 'beautyGlow',
description: 'Anti-aging formula with glutathione and vitamins for radiant skin.'
},
recovery: {
name: 'Athletic Recovery IV',
serviceId: 'athleticRecovery',
description: 'Specialized blend for muscle recovery and performance enhancement.'
},
wellness: {
name: 'Platinum Wellness IV',
serviceId: 'platinumWellness',
description: 'Comprehensive wellness formula with premium nutrients and antioxidants.'
},
antiaging: {
name: 'Anti-Aging Premium IV',
serviceId: 'antiAging',
description: 'Advanced anti-aging therapy with NAD+ precursors and cellular support.'
}
}
};

// =============================================
// BOOKING TAB SYSTEM
// =============================================

class BookingTabManager {
constructor() {
this.tabButtons = document.querySelectorAll('.tab-link');
this.tabContents = document.querySelectorAll('.tab-content');
this.activeTab = 'basic';
this.init();
}

init() {
this.bindEvents();
this.setActiveTab(this.activeTab);
this.trackTabAnalytics();
}

bindEvents() {
this.tabButtons.forEach(button => {
button.addEventListener('click', (e) => {
e.preventDefault();
const target = button.getAttribute('data-tab');
this.setActiveTab(target);
this.trackTabClick(target);
});
});

// Add keyboard navigation
this.tabButtons.forEach((button, index) => {
  button.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const direction = e.key === 'ArrowLeft' ? -1 : 1;
      const newIndex = (index + direction + this.tabButtons.length) % this.tabButtons.length;
      this.tabButtons[newIndex].focus();
      this.tabButtons[newIndex].click();
    }
  });
});

}

setActiveTab(targetTab) {
// Remove active class from all tabs and contents
this.tabButtons.forEach(btn => {
btn.classList.remove('active');
btn.setAttribute('aria-selected', 'false');
});

this.tabContents.forEach(content => {
  content.classList.remove('active');
  content.setAttribute('aria-hidden', 'true');
});

// Add active class to target tab and content
const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
const activeContent = document.getElementById(targetTab);

if (activeButton && activeContent) {
  activeButton.classList.add('active');
  activeButton.setAttribute('aria-selected', 'true');
  
  activeContent.classList.add('active');
  activeContent.setAttribute('aria-hidden', 'false');
  
  this.activeTab = targetTab;
  
  // Smooth scroll to booking section
  if (window.innerWidth <= 768) {
    activeContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

}

trackTabClick(tabName) {
// Analytics tracking
if (typeof gtag !== 'undefined') {
gtag('event', 'tab_click', {
event_category: 'booking',
event_label: tabName,
value: 1
});
}
}

trackTabAnalytics() {
// Track initial page load with default tab
if (typeof gtag !== 'undefined') {
gtag('event', 'booking_page_view', {
event_category: 'booking',
event_label: 'default_tab_basic'
});
}
}
}

// =============================================
// SMART QUIZ RECOMMENDATION SYSTEM
// =============================================

class SmartQuizManager {
constructor() {
this.steps = document.querySelectorAll('.quiz-step');
this.currentStep = 0;
this.answers = {};
this.init();
}

init() {
if (this.steps.length === 0) return;

this.bindEvents();
this.showStep(0);

}

bindEvents() {
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');
const quizForm = document.getElementById('quiz-form');
const retakeBtn = document.getElementById('retakeQuiz');

nextBtn?.addEventListener('click', () => this.nextStep());
prevBtn?.addEventListener('click', () => this.prevStep());
submitBtn?.addEventListener('click', (e) => this.submitQuiz(e));
retakeBtn?.addEventListener('click', () => this.resetQuiz());

// Handle form submission
quizForm?.addEventListener('submit', (e) => this.submitQuiz(e));

// Auto-advance on selection for better UX
this.steps.forEach(step => {
  const inputs = step.querySelectorAll('input[type="radio"], select');
  inputs.forEach(input => {
    input.addEventListener('change', () => {
      if (input.type === 'radio' || input.tagName === 'SELECT') {
        setTimeout(() => {
          if (this.currentStep < this.steps.length - 1) {
            this.nextStep();
          }
        }, 500);
      }
    });
  });
});

}

showStep(stepIndex) {
this.steps.forEach((step, index) => {
step.classList.toggle('active', index === stepIndex);
step.setAttribute('aria-hidden', index !== stepIndex);
});

this.updateNavigationButtons();
this.updateProgressBar();

}

nextStep() {
const currentStepElement = this.steps[this.currentStep];

if (!this.validateCurrentStep()) {
  this.showValidationError('Please select an option to continue.');
  return;
}

this.saveCurrentAnswer();

if (this.currentStep < this.steps.length - 1) {
  this.currentStep++;
  this.showStep(this.currentStep);
}

}

prevStep() {
if (this.currentStep > 0) {
this.currentStep--;
this.showStep(this.currentStep);
}
}

validateCurrentStep() {
const currentStepElement = this.steps[this.currentStep];
const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required]');

return Array.from(requiredInputs).every(input => {
  if (input.type === 'radio') {
    const radioGroup = currentStepElement.querySelectorAll(`input[name="${input.name}"]`);
    return Array.from(radioGroup).some(radio => radio.checked);
  }
  return input.value.trim() !== '';
});

}

saveCurrentAnswer() {
const currentStepElement = this.steps[this.currentStep];
const inputs = currentStepElement.querySelectorAll('input, select');

inputs.forEach(input => {
  if (input.type === 'radio' && input.checked) {
    this.answers[input.name] = input.value;
  } else if (input.type !== 'radio' && input.value) {
    this.answers[input.name] = input.value;
  }
});

}

updateNavigationButtons() {
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');

if (prevBtn) {
  prevBtn.style.display = this.currentStep > 0 ? 'inline-block' : 'none';
}

if (this.currentStep === this.steps.length - 1) {
  if (nextBtn) nextBtn.style.display = 'none';
  if (submitBtn) submitBtn.style.display = 'inline-block';
} else {
  if (nextBtn) nextBtn.style.display = 'inline-block';
  if (submitBtn) submitBtn.style.display = 'none';
}

}

updateProgressBar() {
const progressBar = document.querySelector('.quiz-progress-bar');
if (progressBar) {
const progress = ((this.currentStep + 1) / this.steps.length) * 100;
progressBar.style.width = `${progress}%`;
}

const progressText = document.querySelector('.quiz-progress-text');
if (progressText) {
  progressText.textContent = `Step ${this.currentStep + 1} of ${this.steps.length}`;
}

}

submitQuiz(e) {
e.preventDefault();

this.saveCurrentAnswer();
const recommendation = this.calculateRecommendation();
this.showResult(recommendation);
this.trackQuizCompletion(recommendation);

}

calculateRecommendation() {
const { feeling, goal, frequency, budget } = this.answers;

// Advanced recommendation logic
let recommendedService = 'rehydratePlus';

// Primary goal-based recommendations
if (goal) {
  const goalMapping = {
    hangover: 'hangover',
    energy: 'energy',
    hydration: 'hydration',
    immunity: 'immunity',
    beauty: 'beauty',
    recovery: 'recovery',
    wellness: 'wellness',
    antiaging: 'antiaging'
  };
  
  recommendedService = goalMapping[goal] || 'hydration';
}

// Adjust based on feeling
if (feeling === 'terrible' && goal !== 'hangover') {
  recommendedService = 'hangover';
} else if (feeling === 'tired' && goal !== 'energy') {
  recommendedService = 'energy';
}

// Budget considerations
if (budget === 'budget' && recommendedService.includes('premium')) {
  recommendedService = recommendedService.replace('premium', 'basic');
}

return BOOKING_CONFIG.quizMapping[recommendedService] || BOOKING_CONFIG.quizMapping.hydration;

}

showResult(recommendation) {
const quizContainer = document.getElementById('quiz-form');
const resultContainer = document.getElementById('quiz-result');
const resultText = document.getElementById('result-text');
const resultDescription = document.getElementById('result-description');
const bookLink = document.getElementById('book-link');

if (quizContainer) quizContainer.style.display = 'none';
if (resultContainer) resultContainer.style.display = 'block';

if (resultText) {
  resultText.textContent = recommendation.name;
}

if (resultDescription) {
  resultDescription.textContent = recommendation.description;
}

if (bookLink) {
  const serviceId = BOOKING_CONFIG.serviceIds[recommendation.serviceId];
  bookLink.href = `${BOOKING_CONFIG.baseBookingUrl}?serviceId=${serviceId}`;
}

// Scroll to result
resultContainer?.scrollIntoView({ behavior: 'smooth' });

}

resetQuiz() {
this.currentStep = 0;
this.answers = {};

// Reset form
const quizForm = document.getElementById('quiz-form');
if (quizForm) {
  quizForm.reset();
  quizForm.style.display = 'block';
}

// Hide result
const resultContainer = document.getElementById('quiz-result');
if (resultContainer) {
  resultContainer.style.display = 'none';
}

this.showStep(0);

}

showValidationError(message) {
const errorElement = document.querySelector('.quiz-error') || this.createErrorElement();
errorElement.textContent = message;
errorElement.style.display = 'block';

setTimeout(() => {
  errorElement.style.display = 'none';
}, 3000);

}

createErrorElement() {
const errorDiv = document.createElement('div');
errorDiv.className = 'quiz-error';
errorDiv.style.cssText = `color: #f44336; background: #ffebee; padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid #ffcdd2; display: none;`;

const currentStep = this.steps[this.currentStep];
currentStep.appendChild(errorDiv);

return errorDiv;

}

trackQuizCompletion(recommendation) {
if (typeof gtag !== 'undefined') {
gtag('event', 'quiz_completed', {
event_category: 'engagement',
event_label: recommendation.name,
recommended_service: recommendation.serviceId
});
}
}
}

// =============================================
// MEMBERSHIP & EMAIL CAPTURE SYSTEM
// =============================================

class MembershipManager {
constructor() {
this.bindMembershipEvents();
}

bindMembershipEvents() {
// Handle membership form submissions
const membershipForms = document.querySelectorAll('.membership-form, .lead-capture');
membershipForms.forEach(form => {
form.addEventListener('submit', (e) => this.handleMembershipSubmission(e));
});

// Handle individual membership buttons
const membershipButtons = document.querySelectorAll('[data-membership]');
membershipButtons.forEach(button => {
  button.addEventListener('click', (e) => this.handleMembershipClick(e));
});

}

handleMembershipSubmission(e) {
e.preventDefault();
const form = e.target;
const email = form.email?.value;
const plan = form.plan?.value;

if (!email || !this.isValidEmail(email)) {
  this.showError(form, 'Please enter a valid email address.');
  return false;
}

this.forwardToBooking(email, plan);
this.trackMembershipInterest(plan, email);

return false;

}

handleMembershipClick(e) {
const button = e.target;
const membershipType = button.getAttribute('data-membership');
const emailField = document.querySelector('.membership-email-input');

if (emailField && emailField.value) {
  this.forwardToBooking(emailField.value, membershipType);
} else {
  this.showEmailCaptureModal(membershipType);
}

}

forwardToBooking(email, plan) {
const encodedEmail = encodeURIComponent(email);
let serviceId = '';

// Map membership plans to service IDs
const membershipMap = {
  Premium: BOOKING_CONFIG.serviceIds.premiumMembership,
  Essential: BOOKING_CONFIG.serviceIds.essentialMembership,
  Shot: BOOKING_CONFIG.serviceIds.shotPassMembership,
  premium: BOOKING_CONFIG.serviceIds.premiumMembership,
  essential: BOOKING_CONFIG.serviceIds.essentialMembership,
  shotpass: BOOKING_CONFIG.serviceIds.shotPassMembership
};

serviceId = membershipMap[plan] || membershipMap.Essential;

const bookingUrl = `${BOOKING_CONFIG.baseBookingUrl}?serviceId=${serviceId}&email=${encodedEmail}`;

// Open in new tab for better UX
window.open(bookingUrl, '_blank', 'noopener,noreferrer');

// Show success message
this.showSuccessMessage('Redirecting to secure booking page...');

}

showEmailCaptureModal(membershipType) {
const modal = this.createEmailModal(membershipType);
document.body.appendChild(modal);
modal.style.display = 'flex';

// Focus on email input
const emailInput = modal.querySelector('input[type="email"]');
if (emailInput) {
  setTimeout(() => emailInput.focus(), 100);
}

}

createEmailModal(membershipType) {
const modal = document.createElement('div');
modal.className = 'membership-modal';
modal.innerHTML = `<div class="modal-content"> <div class="modal-header"> <h3>Join ${membershipType} Membership</h3> <button class="modal-close">&times;</button> </div> <div class="modal-body"> <p>Enter your email to continue with ${membershipType} membership enrollment:</p> <form class="modal-membership-form"> <input type="email" name="email" placeholder="your@email.com" required> <input type="hidden" name="plan" value="${membershipType}"> <button type="submit" class="cta primary">Continue to Booking</button> </form> </div> </div>`;

modal.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

// Bind modal events
modal.querySelector('.modal-close').addEventListener('click', () => {
  modal.remove();
});

modal.querySelector('.modal-membership-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = modal.querySelector('input[type="email"]').value;
  this.forwardToBooking(email, membershipType);
  modal.remove();
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.remove();
  }
});

return modal;

}

isValidEmail(email) {
const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
return emailRegex.test(email);
}

showError(form, message) {
const errorElement = form.querySelector('.error-message') || this.createErrorElement(form);
errorElement.textContent = message;
errorElement.style.display = 'block';

setTimeout(() => {
  errorElement.style.display = 'none';
}, 5000);

}

showSuccessMessage(message) {
const successElement = document.createElement('div');
successElement.className = 'success-message';
successElement.textContent = message;
successElement.style.cssText = `position: fixed; top: 20px; right: 20px; background: #4caf50; color: white; padding: 1rem 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; animation: slideIn 0.3s ease-out;`;

document.body.appendChild(successElement);

setTimeout(() => {
  successElement.remove();
}, 3000);

}

createErrorElement(form) {
const errorDiv = document.createElement('div');
errorDiv.className = 'error-message';
errorDiv.style.cssText = `color: #f44336; background: #ffebee; padding: 0.75rem; border-radius: 6px; margin: 0.5rem 0; border: 1px solid #ffcdd2; display: none; font-size: 0.9rem;`;

form.appendChild(errorDiv);
return errorDiv;

}

trackMembershipInterest(plan, email) {
if (typeof gtag !== 'undefined') {
gtag('event', 'membership_interest', {
event_category: 'conversion',
event_label: plan,
value: 1
});
}

// Track in localStorage for retargeting
try {
  const membershipData = {
    plan,
    email: email ? btoa(email) : null, // Basic encoding for privacy
    timestamp: Date.now()
  };
  localStorage.setItem('staydripped_membership_interest', JSON.stringify(membershipData));
} catch (e) {
  console.warn('Could not save membership interest data');
}

}
}

// =============================================
// BOOKING UTILITIES & HELPERS
// =============================================

class BookingUtils {
static createBookingUrl(serviceId, email = null, additionalParams = {}) {
const url = new URL(BOOKING_CONFIG.baseBookingUrl);

url.searchParams.append('serviceId', serviceId);

if (email) {
  url.searchParams.append('email', email);
}

Object.entries(additionalParams).forEach(([key, value]) => {
  if (value) {
    url.searchParams.append(key, value);
  }
});

return url.toString();

}

static trackBookingClick(serviceType, source = 'website') {
if (typeof gtag !== 'undefined') {
gtag('event', 'booking_click', {
event_category: 'conversion',
event_label: serviceType,
event_source: source,
value: 1
});
}
}

static initializeTooltips() {
const tooltips = document.querySelectorAll('[data-tooltip]');
tooltips.forEach(element => {
element.addEventListener('mouseenter', this.showTooltip);
element.addEventListener('mouseleave', this.hideTooltip);
});
}

static showTooltip(e) {
const element = e.target;
const tooltipText = element.getAttribute('data-tooltip');

const tooltip = document.createElement('div');
tooltip.className = 'custom-tooltip';
tooltip.textContent = tooltipText;
tooltip.style.cssText = `
  position: absolute;
  background: #333;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  z-index: 1000;
  pointer-events: none;
  white-space: nowrap;
`;

document.body.appendChild(tooltip);

const rect = element.getBoundingClientRect();
tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

element._tooltip = tooltip;

}

static hideTooltip(e) {
const tooltip = e.target._tooltip;
if (tooltip) {
tooltip.remove();
delete e.target._tooltip;
}
}
}

// =============================================
// INITIALIZATION
// =============================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
try {
// Initialize core booking systems
window.bookingTabManager = new BookingTabManager();
window.smartQuizManager = new SmartQuizManager();
window.membershipManager = new MembershipManager();

// Initialize utilities
BookingUtils.initializeTooltips();

// Add global booking utility functions
window.forwardToBooking = (form) => {
  const email = form.email?.value;
  const plan = form.plan?.value;
  
  if (window.membershipManager) {
    return window.membershipManager.forwardToBooking(email, plan);
  }
  return false;
};

// Add resize handler for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Refresh tab layout if needed
    if (window.bookingTabManager && window.innerWidth <= 768) {
      const activeTab = document.querySelector('.tab-link.active');
      if (activeTab) {
        const tabContent = document.querySelector('.tab-content.active');
        if (tabContent) {
          tabContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }, 250);
});

console.log('Stay Dripped booking system initialized successfully');

} catch (error) {
console.error('Error initializing booking system:', error);

// Fallback for basic functionality
const tabButtons = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-tab');
    
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === target) content.classList.add('active');
    });
  });
});

}
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
module.exports = {
BookingTabManager,
SmartQuizManager,
MembershipManager,
BookingUtils,
BOOKING_CONFIG
};
}

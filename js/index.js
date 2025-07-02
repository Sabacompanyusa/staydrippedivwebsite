// Main JavaScript entry point for Stay Dripped Mobile IV

// Import modules
import "./modules/dark-mode.js";
import "./modules/lazy-loading.js";
import "./modules/mobile-menu.js";
import "./modules/smooth-scroll.js";
import "./modules/analytics.js";

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  console.log("Stay Dripped Mobile IV - Application initialized");

  // Initialize service worker for PWA
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
});

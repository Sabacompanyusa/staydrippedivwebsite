/**
 * Good Faith Exam (GFE) Utility Script
 * Ensures consistent GFE functionality across all pages
 * Requires: moment.js and Qualiphy disclosure script
 */

(function () {
  "use strict";

  // Ensure scripts are loaded
  function loadGFEScripts() {
    // Load moment.js if not already loaded
    if (typeof moment === "undefined") {
      const momentScript = document.createElement("script");
      momentScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js";
      momentScript.async = true;
      document.head.appendChild(momentScript);
    }

    // Load Qualiphy script if not already loaded
    if (!document.getElementById("qualiphy-script")) {
      const qualiphyScript = document.createElement("script");
      qualiphyScript.id = "qualiphy-script";
      qualiphyScript.type = "text/javascript";
      qualiphyScript.src =
        "https://www.app.qualiphy.me/scripts/quidget_disclosure.js";
      qualiphyScript.setAttribute(
        "data-formsrc",
        "https://www.app.qualiphy.me/qualiphy-widget?clinic=Stay Dripped Mobile IV LLC&clinicId=3454&first_name=&last_name=&email=&phone_number=&gender=&exams=918,2095,2097,2246,2316,2120,2315,2129,1620,2130,1623,2248,1148,1693,2122,1287,1694,2207&tele_state_required=true&token=25f1c2618e146d725e934313417e918418a5068e",
      );
      qualiphyScript.setAttribute("data-timezone", "-6");
      qualiphyScript.setAttribute(
        "data-examhours",
        '[{"SUN":{"FROM":"00:00","TO":"23:59","isDaySelected":true}},{"MON":{"FROM":"00:00","TO":"23:59","isDaySelected":true}},{"TUE":{"FROM":"00:00","TO":"23:59","isDaySelected":true}},{"WED":{"FROM":"00:00","TO":"23:59","isDaySelected":true}},{"THU":{"FROM":"00:00","TO":"23:59","isDaySelected":true}},{"FRI":{"FROM":"00:00","TO":"23:59","isDaySelected":true}},{"SAT":{"FROM":"00:00","TO":"23:59","isDaySelected":true}}]',
      );
      qualiphyScript.async = true;
      document.head.appendChild(qualiphyScript);
    }
  }

  // Create GFE button programmatically
  function createGFEButton(options = {}) {
    const {
      width = "150px",
      height = "40px",
      text = "Good Faith Exam",
      container = null,
    } = options;

    const button = document.createElement("div");
    button.id = "loadFormButton";
    button.style.cssText = `
            width: ${width};
            height: ${height};
            cursor: pointer;
            background-color: #cfc9ff;
            color: #0a005b;
            border: none;
            border-radius: 5px;
            font-weight: 600;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease;
        `;
    button.textContent = text;

    // Add hover effects
    button.addEventListener("mouseover", function () {
      this.style.backgroundColor = "#8058fa";
      this.style.color = "white";
    });

    button.addEventListener("mouseout", function () {
      this.style.backgroundColor = "#CFC9FF";
      this.style.color = "#0A005B";
    });

    // Add click handler
    button.addEventListener("click", function () {
      if (typeof showDisclosureModal === "function") {
        showDisclosureModal();
      } else {
        console.warn("Qualiphy disclosure modal function not available");
      }
    });

    // Add to container if specified
    if (container) {
      container.appendChild(button);
    }

    return button;
  }

  // Initialize GFE functionality when DOM is ready
  function initGFE() {
    loadGFEScripts();

    // Add "not available" message if it doesn't exist
    if (!document.getElementById("not-available")) {
      const notAvailable = document.createElement("p");
      notAvailable.id = "not-available";
      notAvailable.style.display = "none";
      notAvailable.textContent = "Not available!";
      document.body.appendChild(notAvailable);
    }

    // Initialize any existing GFE buttons
    const existingButtons = document.querySelectorAll(
      '[onclick*="showDisclosureModal"]',
    );
    existingButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        if (typeof showDisclosureModal === "function") {
          showDisclosureModal();
        } else {
          console.warn("Qualiphy disclosure modal function not available");
        }
      });
    });
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGFE);
  } else {
    initGFE();
  }

  // Expose utility functions globally
  window.GFEUtility = {
    createButton: createGFEButton,
    loadScripts: loadGFEScripts,
    init: initGFE,
  };
})();

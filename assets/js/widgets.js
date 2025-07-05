// Comprehensive booking widget updater for Stay Dripped IV Therapy services
// This script updates all service booking links and adds IntakeQ widgets

document.addEventListener("DOMContentLoaded", function () {
  // Service mapping with their specific IntakeQ service IDs
  const serviceMap = {
    // Rehydrate Services
    "Basic Rehydrate IV Bag (500mL)": {
      serviceId: "73e00621-4069-486a-9fa8-a5a94a089618",
      name: "Rehydrate IV Drip",
    },
    "Basic Rehydrate IV Bag 2.0 (1000mL)": {
      serviceId: "ae66ce7c-fa68-408c-9ab0-a04b287f6b31",
      name: "Rehydrate Plus IV Drip",
    },

    // Myers' Cocktail Services
    "Jr Myers' Cocktail IV Bag": {
      serviceId: "065ab682-3334-403a-9635-ea461e520a6d",
      name: "Jr. Myers' Cocktail IV Drip",
    },
    "Myers' Cocktail IV Bag": {
      serviceId: "c13f904a-a8d0-43b1-bd5f-570387ee77d6",
      name: "Myers' Cocktail IV Drip",
    },
    "Mega Myers' Cocktail IV Bag": {
      serviceId: "e14cdb17-a9d1-47cb-90e1-d3050059bcf3",
      name: "Mega Myers' Cocktail IV Drip",
    },

    // Hangover Relief
    "The Day After Hangover Relief IV Bag": {
      serviceId: "a7d83ea1-cf5e-4865-923e-bfe2232de898",
      name: "The Day After Hangover Relief IV Drip",
    },

    // Ultimate Hydration
    'The "Gold" Ultimate Hydration & Recovery IV Bag': {
      serviceId: "3519d39a-31ac-4944-80c9-4eb667a13df4",
      name: 'The "Gold" Ultimate Hydration & Recovery IV Drip',
    },
    'The "Platinum" Ultimate Hydration & Recovery IV Bag': {
      serviceId: "0c0c56b7-85a4-4e01-9b9c-180bc714fa94",
      name: 'The "Platinum" Ultimate Hydration & Recovery IV Drip',
    },

    // Detox
    'The "Arizona" Detox & Cleanse IV Bag': {
      serviceId: "3fb4cbbb-5e12-447c-a236-869573ef730f",
      name: 'The "Arizona" Detox & Cleanse IV Drip',
    },

    // NAD+
    "The Basic NAD+ IV Bag": {
      serviceId: "7c8dcca4-35b4-44bd-a242-d1fdc722ddb5",
      name: "The Basic NAD+ IV Drip",
    },

    // Memberships
    "Monthly Membership: Shot Pass": {
      serviceId: "08549cfc-d53e-4841-9366-d63b9c22251a",
      name: "Monthly Membership: Shot Pass",
    },
    "Monthly Membership: Essentials Plan": {
      serviceId: "d7b705fd-04b7-4b2e-bda7-950417d6007d",
      name: "Monthly Membership: Essentials Plan",
    },
  };

  // Function to update booking links and add widgets
  function updateServiceBooking(serviceTitle, serviceData) {
    // Find all service cards
    const serviceCards = document.querySelectorAll(".menu-card");

    serviceCards.forEach((card) => {
      const titleElement = card.querySelector("h3");
      if (
        titleElement &&
        titleElement.textContent.includes(serviceTitle.replace(/\'/g, "'"))
      ) {
        // Update booking link
        const bookingLink = card.querySelector(
          'a[href*="intakeq.com/booking"]:not([href*="serviceId"])',
        );
        if (bookingLink) {
          bookingLink.href = `https://Staydripped.intakeq.com/booking?serviceId=${serviceData.serviceId}`;
        }

        // Add IntakeQ widget if not already present
        const existingWidget = card.querySelector(".intakeq-widget");
        if (!existingWidget) {
          const actionButtons = card.querySelector(".action-buttons");
          if (actionButtons) {
            const widgetContainer = document.createElement("div");
            widgetContainer.className = "intakeq-widget";
            widgetContainer.style.marginTop = "1rem";

            widgetContainer.innerHTML = `
              <script>
                (function (c) {
                  window.intakeq="68460f36bc104b6aa9da43e0";
                  window.intakeqServiceId="${serviceData.serviceId}"; 
                  var i = c.createElement("script");
                  i.type = "text/javascript";
                  i.async = true;
                  i.src = "https://intakeq.com/js/widget.min.js?1";
                  document.head.appendChild(i);
                })(document);
              </script>
              <div id="intakeq-${serviceData.serviceId}" style="max-width:720px; width: 100%;"></div>
            `;

            actionButtons.parentNode.insertBefore(
              widgetContainer,
              actionButtons.nextSibling,
            );
          }
        }
      }
    });
  }

  // Update all services
  Object.entries(serviceMap).forEach(([title, data]) => {
    updateServiceBooking(title, data);
  });

  // Also update any remaining generic booking links
  const genericLinks = document.querySelectorAll(
    'a[href="https://Staydripped.intakeq.com/booking"]:not([href*="serviceId"])',
  );
  genericLinks.forEach((link) => {
    // For any remaining generic links, use the default widget ID
    link.href =
      "https://Staydripped.intakeq.com/booking?serviceId=68460f36bc104b6aa9da43e0";
  });

  console.log(
    "Stay Dripped: All booking widgets updated with specific service IDs",
  );
});

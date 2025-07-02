// Mobile Menu Functionality

class MobileMenu {
  constructor() {
    this.toggle = document.querySelector(".mobile-menu-toggle");
    this.menu = document.querySelector(".mobile-menu");
    this.closeBtn = document.querySelector(".mobile-menu__close");
    this.links = document.querySelectorAll(".mobile-menu__link");
    this.isOpen = false;

    this.init();
  }

  init() {
    if (!this.toggle || !this.menu) return;

    // Bind event listeners
    this.toggle.addEventListener("click", () => this.toggleMenu());

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.closeMenu());
    }

    // Close menu when clicking on links
    this.links.forEach((link) => {
      link.addEventListener("click", () => this.closeMenu());
    });

    // Close menu when clicking outside
    this.menu.addEventListener("click", (e) => {
      if (e.target === this.menu) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeMenu();
      }
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768 && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.isOpen = true;
    this.menu.classList.add("active");
    this.toggle.classList.add("active");
    document.body.style.overflow = "hidden";

    // Focus management for accessibility
    this.trapFocus();

    // Trigger custom event
    window.dispatchEvent(new CustomEvent("mobileMenuOpened"));
  }

  closeMenu() {
    this.isOpen = false;
    this.menu.classList.remove("active");
    this.toggle.classList.remove("active");
    document.body.style.overflow = "";

    // Return focus to toggle button
    this.toggle.focus();

    // Trigger custom event
    window.dispatchEvent(new CustomEvent("mobileMenuClosed"));
  }

  trapFocus() {
    const focusableElements = this.menu.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select',
    );

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    // Focus first element
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    // Trap focus within menu
    this.menu.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
}

// Initialize mobile menu
document.addEventListener("DOMContentLoaded", () => {
  new MobileMenu();
});

export default MobileMenu;

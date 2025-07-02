// Dark Mode Toggle Functionality

class DarkModeManager {
  constructor() {
    this.toggle = document.getElementById("dark-mode-toggle");
    this.init();
  }

  init() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const currentTheme = savedTheme || systemTheme;

    // Apply initial theme
    this.setTheme(currentTheme);

    // Add event listeners
    if (this.toggle) {
      this.toggle.addEventListener("click", () => this.toggleTheme());
    }

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          this.setTheme(e.matches ? "dark" : "light");
        }
      });
  }

  setTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      this.updateToggleIcon("🌙");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      this.updateToggleIcon("☀️");
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    this.setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Trigger custom event for other components
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { theme: newTheme },
      }),
    );
  }

  updateToggleIcon(icon) {
    if (this.toggle) {
      this.toggle.textContent = icon;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new DarkModeManager());
} else {
  new DarkModeManager();
}

export default DarkModeManager;

// Dark Mode Toggle Implementation
class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'light';
    this.init();
  }

  init() {
    // Apply stored theme
    this.applyTheme(this.currentTheme);

    // Create toggle button
    this.createToggleButton();

    // Listen for system theme changes
    this.listenForSystemThemeChanges();
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  setStoredTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.setStoredTheme(theme);
    this.updateToggleButton();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';

    // Add transition class for smooth animation
    document.documentElement.classList.add('theme-transition');

    this.applyTheme(newTheme);

    // Remove transition class after animation
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);

    // Track theme change analytics
    this.trackThemeChange(newTheme);
  }

  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.innerHTML = `
      <span class="theme-toggle-icon">🌙</span>
      <span class="theme-toggle-text">Dark</span>
    `;
    button.addEventListener('click', () => this.toggleTheme());

    document.body.appendChild(button);
    this.toggleButton = button;
  }

  updateToggleButton() {
    if (!this.toggleButton) return;

    const isDark = this.currentTheme === 'dark';
    const icon = this.toggleButton.querySelector('.theme-toggle-icon');
    const text = this.toggleButton.querySelector('.theme-toggle-text');

    icon.textContent = isDark ? '☀️' : '🌙';
    text.textContent = isDark ? 'Light' : 'Dark';
  }

  listenForSystemThemeChanges() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        // Only follow system if user hasn't manually set a preference
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  trackThemeChange(theme) {
    // Analytics tracking
    if (window.gtag) {
      window.gtag('event', 'theme_change', {
        'custom_parameter': theme
      });
    }

    console.log(`Theme changed to: ${theme}`);
  }

  // Public API
  setTheme(theme) {
    if (['light', 'dark'].includes(theme)) {
      this.applyTheme(theme);
    }
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  reset() {
    localStorage.removeItem('theme');
    this.applyTheme(this.getSystemTheme());
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
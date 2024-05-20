/**
 * @module Theme
 */

/**
 * Applies the selected theme to the document by setting CSS variables.
 *
 * @param {string} theme - The selected theme. It can be either 'night' or 'day'.
 */
export const applyTheme = (theme) => {
  /**
   * CSS variable for the dark theme
   * @type {string}
   * @prop {string} colorDark - The CSS variable value for the dark color in dark mode
   * @prop {string} colorLight- The CSS variable value for the light color in dark mode
   */
  const colorDark = theme === "night" ? "255, 255, 255" : "10, 10, 20";

  /**
   * CSS variable for the light theme
   * @type {string}
   * @prop {string} colorDark - The CSS variable value for the dark color in light mode
   * @prop {string} colorLight - The CSS variable value for the light color in light mode
   */
  const colorLight = theme === "night" ? "10, 10, 20" : "255, 255, 255";

  /**
   *Set the CSS variables for dark and light colors
   * */
  document.documentElement.style.setProperty("--color-dark", colorDark);
  document.documentElement.style.setProperty("--color-light", colorLight);
};

/**
 * Web component for toggling the theme between 'night' and 'day'.
 *
 * @class ThemeToggleComponent
 * @extends HTMLElement
 */
class ThemeToggleComponent extends HTMLElement {
  /**
   * Creates an instance of ThemeToggleComponent.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * Lifecycle method called when the component is connected to the DOM.
   * Renders the toggle button and attaches event listeners.
   */
  connectedCallback() {
    this.render();
    this.shadowRoot
      .querySelector("button")
      .addEventListener("click", this.toggleTheme.bind(this));
  }

  /**
   * Toggles the theme between 'night' and 'day'.
   */
  toggleTheme() {
    const currentTheme =
      document.documentElement.style.getPropertyValue("--color-dark") ===
      "255, 255, 255"
        ? "night"
        : "day";
    const newTheme = currentTheme === "night" ? "day" : "night";
    applyTheme(newTheme);
  }

  /**
   * Renders the toggle button.
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        button {
          padding: 0.5rem 1rem;
          background-color: var(--color-dark);
          color: var(--color-light);
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      </style>
      <button>Toggle Theme</button>
    `;
  }
}

// Define the custom element
customElements.define("theme-toggle", ThemeToggleComponent);

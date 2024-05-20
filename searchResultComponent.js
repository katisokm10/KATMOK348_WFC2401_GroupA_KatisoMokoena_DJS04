/**
 * Custom element representing a search overlay with search results.
 * @class SearchOverlayComponent
 * @extends HTMLElement
 */
class SearchOverlayComponent extends HTMLElement {
  /**
   * Creates an instance of SearchOverlayComponent.
   * @constructor
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.searchInput = null;
    this.searchButton = null;
    this.searchResultsContainer = null;
  }

  /**
   * Lifecycle method called when the component is connected to the DOM.
   * Renders the search overlay and attaches event listeners.
   * @method connectedCallback
   */
  connectedCallback() {
    this.render();
    this.cacheDOM();
    this.attachEventListeners();
  }

  /**
   * Caches DOM elements for later use.
   * @method cacheDOM
   */
  cacheDOM() {
    this.searchInput = this.shadowRoot.querySelector("[data-search-input]");
    this.searchButton = this.shadowRoot.querySelector("[data-search-button]");
    this.searchResultsContainer = this.shadowRoot.querySelector("[data-search-results]");
  }

  /**
   * Attaches event listeners to DOM elements.
   * @method attachEventListeners
   */
  attachEventListeners() {
    if (this.searchInput && this.searchButton) {
      this.searchInput.addEventListener("input", this.handleSearch.bind(this));
      this.searchButton.addEventListener("click", this.handleSearch.bind(this));
    }
  }

  /**
   * Renders the search overlay component.
   * @method render
   */
  render() {
    this.shadowRoot.innerHTML = `
      <div class="search-overlay">
        <input type="text" data-search-input placeholder="Search..." />
        <button data-search-button>Search</button>
        <div class="search-results" data-search-results></div>
      </div>
      <style>
        /* CSS styles for the search overlay */
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 1rem;
          background-color: rgba(var(--color-light), 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        /* Other CSS styles omitted for brevity */
      </style>
    `;
  }

  /**
   * Handles the search action triggered by user input.
   * @method handleSearch
   */
  handleSearch() {
    const searchInputValue = this.searchInput.value;
    const searchResults = this.searchBooks(searchInputValue);
    this.displaySearchResults(searchResults);
  }

  /**
   * Searches for books based on the provided query.
   * @method searchBooks
   * @param {string} query - The search query.
   * @returns {Array} An array of search results.
   */
  searchBooks(query) {
    const lowercaseQuery = query.toLowerCase();
    const searchResults = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(lowercaseQuery) ||
        authors[book.author].toLowerCase().includes(lowercaseQuery)
      );
    });
    return searchResults;
  }

  /**
   * Displays the search results in the search overlay.
   * @method displaySearchResults
   * @param {Array} results - An array of search results.
   */
  displaySearchResults(results) {
    if (this.searchResultsContainer) {
      this.searchResultsContainer.innerHTML = "";
      const searchResultsComponent = document.createElement("search-results");
      searchResultsComponent.setAttribute("data-results", JSON.stringify(results));
      this.searchResultsContainer.appendChild(searchResultsComponent);
    }
  }
}

// Define the custom element
customElements.define("search-overlay", SearchOverlayComponent);
 

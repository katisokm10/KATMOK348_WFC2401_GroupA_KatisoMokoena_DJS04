// SearchResultsComponent.js

/**
 * Represents a custom search overlay component with search results.
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
  }

  /**
   * Lifecycle method called when the component is connected to the DOM.
   * Renders the search overlay and attaches event listeners.
   * @method connectedCallback
   */
  connectedCallback() {
    this.render();
    // Add event listeners for search input and button
    this.shadowRoot
      .querySelector("[data-search-input]")
      .addEventListener("input", this.handleSearch.bind(this));
    this.shadowRoot
      .querySelector("[data-search-button]")
      .addEventListener("click", this.handleSearch.bind(this));
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
    const searchInput = this.shadowRoot.querySelector(
      "[data-search-input]"
    ).value;
    // Implement search functionality here
    const searchResults = this.searchBooks(searchInput);
    this.displaySearchResults(searchResults);
  }

  /**
   * Searches for books based on the provided query.
   * @method searchBooks
   * @param {string} query - The search query.
   * @returns {Array} An array of search results.
   */
  searchBooks(query) {
    // convert the query to lowercase for case insensitive search
    const lowercaseQuery = query.toLowerCase();
    // filter books based on the query
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
    // Clear previous results
    const searchResultsContainer = this.shadowRoot.querySelector(
      "[data-search-results]"
    );
    searchResultsContainer.innerHTML = "";

    // Render search results using SearchResultsComponent
    const searchResultsComponent = document.createElement("search-results");
    searchResultsComponent.setAttribute(
      "data-results",
      JSON.stringify(results)
    );
    searchResultsContainer.appendChild(searchResultsComponent);
  }
}

// Define the custom element
customElements.define("search-overlay", SearchOverlayComponent);

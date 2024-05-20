// Import custom elements
import "./book-preview.js";
import "./searchResultComponent.js";
import "./ratingReviewComponent.js";

// Import data and constants
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import { applyTheme } from "./theme.js";

// Function to create HTML element
const createElement = (tag, attributes = {}, innerHTML = "") => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value)
  );
  element.innerHTML = innerHTML;
  return element;
};

// Function to render dropdown options
const renderOptions = (data, selector, defaultValue) => {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createElement("option", { value: "any" }, defaultValue));
  Object.entries(data).forEach(([id, name]) =>
    fragment.appendChild(createElement("option", { value: id }, name))
  );
  document.querySelector(selector).appendChild(fragment);
};

// Function to render book previews
const renderBooks = (matches, limit) => {
  const fragment = document.createDocumentFragment();
  matches.slice(0, limit).forEach(({ author, id, image, title }) => {
    const element = createElement(
      "button",
      { class: "preview", "data-preview": id },
      `<img class="preview__image" src="${image}" />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>`
    );
    fragment.appendChild(element);
  });
  document.querySelector("[data-list-items]").appendChild(fragment);
};

// Initial rendering of books and dropdown options
renderBooks(books, BOOKS_PER_PAGE);
renderOptions(genres, "[data-search-genres]", "All Genres");
renderOptions(authors, "[data-search-authors]", "All Authors");

// Function to handle overlay cancellation
const handleCancel = (selector) => () => {
  document.querySelector(selector).open = false;
};

// Event listeners for cancel buttons
document
  .querySelector("[data-search-cancel]")
  .addEventListener("click", handleCancel("[data-search-overlay]"));
document
  .querySelector("[data-settings-cancel]")
  .addEventListener("click", handleCancel("[data-settings-overlay]"));

// Event listener to open search overlay and focus on input
document.querySelector("[data-header-search]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = true;
  document.querySelector("[data-search-title]").focus();
});

// Event listener to open settings overlay
document
  .querySelector("[data-header-settings]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = true;
  });

// Event listener to close active book preview overlay
document.querySelector("[data-list-close]").addEventListener("click", () => {
  document.querySelector("[data-list-active]").open = false;
});

// Event listener for settings form submission
document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const { theme } = Object.fromEntries(new FormData(event.target));
    applyTheme(theme);
    document.querySelector("[data-settings-overlay]").open = false;
  });

// Initialize variables
let matches = books;
let page = 1;

// Event listener for search form submission
document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    matches = books.filter(
      ({ title, author, genres }) =>
        (filters.title.trim() === "" ||
          title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === "any" || author === filters.author) &&
        (filters.genre === "any" || genres.includes(filters.genre))
    );
    const listMessage = document.querySelector("[data-list-message]");
    listMessage.classList.toggle("list__message_show", matches.length < 1);
    document.querySelector("[data-list-items]").innerHTML = "";
    renderBooks(matches, BOOKS_PER_PAGE);
    const showMoreButton = document.querySelector("[data-list-button]");
    showMoreButton.disabled = matches.length <= BOOKS_PER_PAGE;
    showMoreButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${Math.max(
      matches.length - BOOKS_PER_PAGE,
      0
    )})</span>
  `;
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector("[data-search-overlay]").open = false;
  });

// Event listener for show more button
document.querySelector("[data-list-button]").addEventListener("click", () => {
  const fragment = document.createDocumentFragment();
  const startIndex = page * BOOKS_PER_PAGE;
  const endIndex = Math.min(startIndex + BOOKS_PER_PAGE, matches.length);
  matches.slice(startIndex, endIndex).forEach(({ author, id, image, title }) => {
    const element = createElement(
      "button",
      { class: "preview", "data-preview": id },
      `<img class="preview__image" src="${image}" />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>`
    );
    fragment.appendChild(element);
  });
  document.querySelector("[data-list-items]").appendChild(fragment);
  page++;
  const showMoreButton = document.querySelector("[data-list-button]");
  showMoreButton.disabled = matches.length <= page * BOOKS_PER_PAGE;
  showMoreButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${Math.max(
      matches.length - page * BOOKS_PER_PAGE,
      0
    )})</span>
  `;
});

// Event listener for clicking on book previews
document.querySelector("[data-list-items]").addEventListener("click", (event) => {
  let node = event.target;
  while (node && !node.dataset.preview) {
    if (!node.parentNode) break;
    node = node.parentNode;
  }
  if (node) {
    const book = books.find(({ id }) => id === node.dataset.preview);
    if (book) {
      document.querySelector("[data-list-active]").open = true;
      document.querySelector("[data-list-blur]").src = book.image;
      document.querySelector("[data-list-image]").src = book.image;
      document.querySelector("[data-list-title]").innerText = book.title;
      document.querySelector("[data-list-subtitle]").innerText = `${
        authors[book.author]
      } (${new Date(book.published).getFullYear()})`;
      document.querySelector("[data-list-description]").innerText =
        book.description;
    }
  }
});

'use strict';

(function () {
  const input = document.querySelector('#book-search-input');
  const results = document.querySelector('#book-search-results');

  if (!input) {
    return
  }

  input.addEventListener('focus', init);           // Initialize search index on first focus
  input.addEventListener('keyup', search);         // Perform search on key input
  input.addEventListener('keydown', handleEscape); // Clear results on ESC key
  input.addEventListener('blur', clearResults);    // Clear results when input loses focus

  // Global hotkey listener to focus search input
  document.addEventListener('keypress', focusSearchFieldOnKeyPress);

  /**
   * Focus search input when hotkey is pressed anywhere on the page.
   * @param {Event} event - Keypress event
   */
  function focusSearchFieldOnKeyPress(event) {
    if (event.target.value !== undefined) {
      return;
    }

    if (input === document.activeElement) {
      return;
    }

    const characterPressed = String.fromCharCode(event.charCode);
    if (!isHotkey(characterPressed)) {
      return;
    }

    input.focus();
    event.preventDefault();
  }

  /**
   * Check if the pressed character matches the configured hotkey.
   * @param {string} character
   * @returns {boolean}
   */
  function isHotkey(character) {
    const dataHotkeys = input.getAttribute('data-hotkeys') || '';
    return dataHotkeys.indexOf(character) >= 0;
  }

  /**
   * Handle ESC key to clear search results and blur input.
   * @param {KeyboardEvent} event - Keydown event
   */
  function handleEscape(event) {
    if (event.key === 'Escape') {
      clearResults();
      input.blur();
    }
  }

  function clearResults() {
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
  }

  /**
   * Initialize search index on first focus.
   */
  function init() {
    input.removeEventListener('focus', init);
    input.required = true;

    window.bookSearch.initIndex()
      .then(() => input.required = false)
      .then(search);
  }

  /**
   * Perform search and display preview results (upto 3 items).
   */
  function search() {
    clearResults();

    if (!input.value) {
      return;
    }

    const searchHits = window.bookSearchIndex.search(input.value);
    const searchPreview = searchHits.slice(0, 3);

    // Display top 3 search results as preview
    searchPreview.forEach(function (page) {
      const li = element('<li><a href></a></li>');
      const a = li.querySelector('a')

      a.href = page.item.href;
      a.textContent = page.item.title;

      results.appendChild(li);
    });

    // Show "more" link if there are additional results
    if (searchHits.length > 3) {
      const moreLink = element('<li class="book-search-more"><a href></a></li>');
      const a = moreLink.querySelector('a');
      a.href = '{{ "/search/" | relURL }}?q=' + encodeURIComponent(input.value);
      a.textContent = '더보기 (총 ' + searchHits.length + '개)';
      results.appendChild(moreLink);
    }
  }

  /**
   * Create DOM element from HTML string.
   * @param {string} content - HTML string
   * @returns {Node} Created DOM element
   */
  function element(content) {
    const div = document.createElement('div');
    div.innerHTML = content;
    return div.firstChild;
  }
})();

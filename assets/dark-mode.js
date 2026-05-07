document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('dark-mode-toggle');
  const storageKey = 'hugo-dark-mode';

  function setTheme(isDark) {
    const root = document.documentElement;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem(storageKey, isDark ? 'dark' : 'light');
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function isDarkTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function loadHighlightTheme() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = isDarkTheme() 
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/vs2015.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/xcode.min.css';

    document.head.appendChild(link);
    link.onload = function() {
      hljs.highlightAll();
      hljs.initLineNumbersOnLoad();
    };
  }

  setTheme(getPreferredTheme());
  loadHighlightTheme();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      setTheme(!isDarkTheme());
      loadHighlightTheme();

      if (window.DISQUS && typeof window.reloadDisqus === 'function') {
        window.reloadDisqus();
      }
    });
  }
});
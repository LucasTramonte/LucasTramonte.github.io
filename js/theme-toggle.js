(function () {
  var THEME_KEY = 'theme';
  var DEBUG_KEY = 'debug';
  var toggleButton = document.getElementById('theme-toggle');
  var themeIcon = document.getElementById('theme-icon');

  if (!toggleButton || !themeIcon) {
    return;
  }

  function isDebugEnabled() {
    try {
      return localStorage.getItem(DEBUG_KEY) === '1';
    } catch (error) {
      return false;
    }
  }

  function auditLog(eventName, payload) {
    if (!isDebugEnabled()) {
      return;
    }

    var timestamp = new Date().toISOString();
    if (typeof payload === 'undefined') {
      console.info('[portfolio][' + timestamp + '] ' + eventName);
      return;
    }

    console.info('[portfolio][' + timestamp + '] ' + eventName, payload);
  }

  function updateIcon(isDark) {
    themeIcon.className = isDark ? 'fas fa-2x fa-sun' : 'fas fa-2x fa-moon';
  }

  function applyTheme(theme) {
    var isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    updateIcon(isDark);
  }

  function resolveInitialTheme() {
    var savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  var initialTheme = resolveInitialTheme();
  applyTheme(initialTheme);
  auditLog('theme:init', { theme: initialTheme });

  toggleButton.addEventListener('click', function () {
    var nextTheme = document.body.classList.contains('dark-mode')
      ? 'light'
      : 'dark';

    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    auditLog('theme:toggle', { theme: nextTheme });
  });
})();

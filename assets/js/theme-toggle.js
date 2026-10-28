/* Theme toggle: cycles auto -> light -> dark. "auto" follows the system setting. */
(function () {
  var root = document.documentElement;
  var button = document.getElementById('theme-toggle');
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var order = ['auto', 'light', 'dark'];
  var labels = { auto: 'Auto', light: 'Light', dark: 'Dark' };

  function getPref() {
    try { return localStorage.getItem('theme') || 'auto'; } catch (e) { return 'auto'; }
  }

  function apply(pref) {
    var dark = pref === 'dark' || (pref === 'auto' && media && media.matches);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.setAttribute('data-theme-pref', pref);
    if (button) {
      var text = 'Color theme: ' + labels[pref].toLowerCase();
      button.setAttribute('aria-label', text);
      button.setAttribute('title', text);
      button.querySelector('.theme-toggle__label').textContent = labels[pref];
    }
  }

  if (button) {
    button.addEventListener('click', function () {
      var next = order[(order.indexOf(getPref()) + 1) % order.length];
      try { localStorage.setItem('theme', next); } catch (e) {}
      apply(next);
    });
  }

  if (media) {
    var onChange = function () { if (getPref() === 'auto') apply('auto'); };
    if (media.addEventListener) media.addEventListener('change', onChange);
    else if (media.addListener) media.addListener(onChange);
  }

  apply(getPref());
})();

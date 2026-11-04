(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Toast ------------------------------------------------------------------ */

  var toastEl;
  var toastTimer;

  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    // Force a reflow so the transition runs when the toast is reused.
    void toastEl.offsetWidth;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2600);
  }

  /* Theme toggle: auto (X) -> light (1) -> dark (0) ------------------------- */

  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var order = ['auto', 'light', 'dark'];

  function getPref() {
    try { return localStorage.getItem('theme') || 'auto'; } catch (e) { return 'auto'; }
  }

  function applyTheme(pref) {
    var dark = pref === 'dark' || (pref === 'auto' && media && media.matches);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.setAttribute('data-theme-pref', pref);
    var button = document.getElementById('theme-toggle');
    if (button) {
      var text = 'Color theme: ' + pref + (pref === 'auto' ? ' (follows your system)' : '');
      button.setAttribute('aria-label', text);
      button.setAttribute('title', text);
    }
  }

  var themeButton = document.getElementById('theme-toggle');
  if (themeButton) {
    themeButton.addEventListener('click', function () {
      var next = order[(order.indexOf(getPref()) + 1) % order.length];
      try { localStorage.setItem('theme', next); } catch (e) {}
      applyTheme(next);
    });
  }

  if (media) {
    var onSystemChange = function () {
      if (getPref() === 'auto') applyTheme('auto');
    };
    if (media.addEventListener) media.addEventListener('change', onSystemChange);
    else if (media.addListener) media.addListener(onSystemChange);
  }

  applyTheme(getPref());

  /* BibTeX copy ------------------------------------------------------------ */

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(area);
      if (ok) resolve(); else reject(new Error('copy failed'));
    });
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-bibtex]');
    if (!button) return;
    copyText(button.getAttribute('data-bibtex')).then(function () {
      toast('BibTeX copied to clipboard ✓');
    }, function () {
      toast('Could not copy BibTeX');
    });
  });

  /* Easter egg: click the avatar 5 times to inject bit-flips, then watch
     triple modular redundancy (TMR) correct them. ------------------------- */

  var avatar = document.querySelector('.sidebar__avatar');
  var clicks = 0;
  var clickTimer;
  var injecting = false;

  function textNodes() {
    var nodes = [];
    var scopes = document.querySelectorAll('.content, .sidebar__text');
    Array.prototype.forEach.call(scopes, function (scope) {
      var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          return /[A-Za-z0-9]/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      while (walker.nextNode()) nodes.push(walker.currentNode);
    });
    return nodes;
  }

  // Flip one random bit of an alphanumeric character, keeping it printable.
  function flip(ch) {
    var code = ch.charCodeAt(0);
    for (var tries = 0; tries < 8; tries++) {
      var flipped = code ^ (1 << Math.floor(Math.random() * 7));
      if (flipped > 32 && flipped < 127) return String.fromCharCode(flipped);
    }
    return '#';
  }

  function injectFaults() {
    injecting = true;
    var nodes = textNodes();
    var originals = nodes.map(function (node) { return node.nodeValue; });
    var sites = [];
    nodes.forEach(function (node, n) {
      var value = node.nodeValue;
      for (var i = 0; i < value.length; i++) {
        if (/[A-Za-z0-9]/.test(value[i])) sites.push([n, i]);
      }
    });

    var count = Math.min(sites.length, 18 + Math.floor(Math.random() * 14));
    var faults = [];
    for (var k = 0; k < count; k++) {
      faults.push(sites.splice(Math.floor(Math.random() * sites.length), 1)[0]);
    }

    function render(active) {
      var values = originals.slice();
      active.forEach(function (site) {
        var v = values[site[0]];
        values[site[0]] = v.slice(0, site[1]) + flip(v[site[1]]) + v.slice(site[1] + 1);
      });
      nodes.forEach(function (node, n) {
        if (node.nodeValue !== values[n]) node.nodeValue = values[n];
      });
    }

    function finish() {
      nodes.forEach(function (node, n) { node.nodeValue = originals[n]; });
      root.classList.remove('is-faulty');
      injecting = false;
      toast('TMR corrected ' + count + ' bit-flips ✓');
    }

    root.classList.add('is-faulty');
    toast('⚡ Injecting ' + count + ' single-event upsets…');

    if (reduceMotion) {
      render(faults);
      setTimeout(finish, 1200);
      return;
    }

    // Faults appear, flicker, then get voted out one by one.
    var tick = 0;
    var timer = setInterval(function () {
      tick++;
      var visible = tick < 14 ? faults.slice(0, Math.ceil(faults.length * tick / 6)) : faults.slice(0, faults.length - (tick - 14) * 2);
      render(visible);
      if (tick >= 14 && visible.length === 0) {
        clearInterval(timer);
        finish();
      }
    }, 70);
  }

  if (avatar) {
    avatar.addEventListener('click', function () {
      if (injecting) return;
      avatar.classList.remove('is-hit');
      void avatar.offsetWidth;
      avatar.classList.add('is-hit');
      clicks++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(function () { clicks = 0; }, 1500);
      if (clicks >= 5) {
        clicks = 0;
        injectFaults();
      }
    });
  }

  if (window.console && console.log) {
    console.log('%c⚡ Fault injection enabled. Click the avatar 5 times.', 'color:#3c97b3;font-weight:bold');
  }
})();

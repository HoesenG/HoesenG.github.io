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

  /* Greeting: "salut!" during the day, "bonsoir!" in the evening,
     by the visitor's local time. ------------------------------------------ */

  var greeting = document.querySelector('[data-greeting]');
  if (greeting) {
    var hour = new Date().getHours();
    greeting.textContent = hour >= 5 && hour < 18 ? 'salut!' : 'bonsoir!';
  }

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

  /* Easter egg: pressing the avatar injects bit-flips into the page text.
     Clicking faster, or holding the avatar down, flips more and more of the
     page. Once it is released, a triple modular redundancy (TMR) scrubber
     votes the faults out evenly across the page, quickly at first and then
     settling gently, so every part of the screen recovers at the same pace.
     ----------------------------------------------------------------------- */

  var avatar = document.querySelector('.sidebar__avatar');
  var burst = null; // state while any fault is active
  var IDLE_MS = 350; // pause after the last press before recovery starts
  var TICK_MS = 40;
  var HOLD_TICK_MS = 100;
  var hold = null;   // { start, timer } while the avatar is held down

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

  // Flip random bits of a character, keeping the result printable.
  function flip(ch, bits) {
    var code = ch.charCodeAt(0);
    for (var tries = 0; tries < 8; tries++) {
      var flipped = code;
      for (var b = 0; b < (bits || 1); b++) flipped ^= 1 << Math.floor(Math.random() * 7);
      if (flipped > 32 && flipped < 127 && flipped !== code) return String.fromCharCode(flipped);
    }
    return '#';
  }

  function bitsFor(heat) {
    return heat > 8 ? 3 : heat > 4 ? 2 : 1;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function startBurst() {
    var nodes = textNodes();
    var sites = []; // every alphanumeric character, in reading order
    nodes.forEach(function (node, n) {
      var value = node.nodeValue;
      for (var i = 0; i < value.length; i++) {
        if (/[A-Za-z0-9]/.test(value[i])) sites.push([n, i]);
      }
    });
    return {
      nodes: nodes,
      originals: nodes.map(function (node) { return node.nodeValue; }),
      sites: sites,
      faults: {},      // site index -> { ch, rank }
      active: 0,
      corrected: 0,
      heat: 0,
      lastClick: 0,
      recovery: null,  // { start, duration } while the scrubber runs
      timer: null
    };
  }

  function render() {
    var values = burst.originals.slice();
    var chars = {};
    Object.keys(burst.faults).forEach(function (s) {
      var site = burst.sites[s];
      (chars[site[0]] = chars[site[0]] || []).push([site[1], burst.faults[s].ch]);
    });
    Object.keys(chars).forEach(function (n) {
      var v = values[n].split('');
      chars[n].forEach(function (c) { v[c[0]] = c[1]; });
      values[n] = v.join('');
    });
    burst.nodes.forEach(function (node, n) {
      if (node.nodeValue !== values[n]) node.nodeValue = values[n];
    });
  }

  function startRecovery(now) {
    // Each fault gets a random place in the correction order, so the page
    // clears evenly wherever the reader happens to be looking.
    var total = burst.sites.length;
    Object.keys(burst.faults).forEach(function (s) {
      burst.faults[s].rank = Math.random();
    });
    // Bigger messes take longer to scrub: about 0.7 s after a single click,
    // up to 2.6 s when the whole page is garbled.
    var damage = Math.min(1, 1.5 * Math.sqrt(burst.active / total));
    burst.recovery = { start: now, duration: 600 + 2000 * damage };
  }

  function tick() {
    var now = Date.now();
    var heat = currentHeat(now);

    if (!burst.recovery && now - burst.lastClick >= IDLE_MS) startRecovery(now);

    var progress = burst.recovery ? easeOutCubic(Math.min(1, (now - burst.recovery.start) / burst.recovery.duration)) : -1;
    var flicker = burst.recovery ? 0.15 : Math.min(0.8, 0.25 + heat * 0.05);
    var bits = bitsFor(heat);

    Object.keys(burst.faults).forEach(function (s) {
      var fault = burst.faults[s];
      if (progress >= 1 || (progress >= 0 && fault.rank <= progress)) {
        delete burst.faults[s];
        burst.active--;
        burst.corrected++;
      } else if (!reduceMotion && Math.random() < flicker) {
        var site = burst.sites[s];
        fault.ch = flip(burst.originals[site[0]][site[1]], bits);
      }
    });
    render();

    if (burst.active === 0) {
      clearInterval(burst.timer);
      burst.nodes.forEach(function (node, n) { node.nodeValue = burst.originals[n]; });
      toast('Corrected ' + burst.corrected + ' bit-flip' + (burst.corrected === 1 ? '' : 's') + ' ✓');
      burst = null;
    }
  }

  // Each click adds 1 heat; heat cools off with a time constant of 1.2 s.
  function currentHeat(now) {
    return burst.heat * Math.exp(-(now - burst.lastClick) / 1200);
  }

  function addFaults(count, heat) {
    var now = Date.now();
    var total = burst.sites.length;
    var bits = bitsFor(heat);
    burst.heat = heat;
    burst.lastClick = now;
    burst.recovery = null; // new faults interrupt the scrubber

    for (var k = 0, tries = 0; k < count && tries < count * 3 && burst.active < total; tries++) {
      var s = Math.floor(Math.random() * total);
      if (burst.faults[s]) continue;
      var site = burst.sites[s];
      burst.faults[s] = { ch: flip(burst.originals[site[0]][site[1]], bits), rank: 0 };
      burst.active++;
      k++;
    }

    render();
    if (!burst.timer) burst.timer = setInterval(tick, TICK_MS);
  }

  // A press flips a couple of characters; fast repeated presses flip a
  // growing share of the page, up to all of it.
  function press() {
    if (!burst) burst = startBurst();
    var heat = currentHeat(Date.now()) + 1;
    var share = Math.min(0.6, 0.001 * Math.pow(heat - 1, 2.5));
    addFaults(2 + Math.round(burst.sites.length * share), heat);
  }

  // While held, the flip rate ramps up with time held: barely anything in
  // the first second, about a third of the page by 3 s, nearly all by 6 s.
  function holdTick() {
    if (!burst) burst = startBurst();
    var held = (Date.now() - hold.start) / 1000;
    var share = Math.min(0.2, 0.004 * held * held);
    var count = Math.round(burst.sites.length * share) + (held > 0.4 ? 1 : 0);
    addFaults(count, Math.max(currentHeat(Date.now()), 1 + 2 * held));
  }

  function release() {
    if (!hold) return;
    clearInterval(hold.timer);
    hold = null;
    avatar.classList.remove('is-pressed');
  }

  if (avatar) {
    avatar.addEventListener('pointerdown', function (event) {
      if (event.button !== 0) return;
      event.preventDefault();
      try { avatar.setPointerCapture(event.pointerId); } catch (e) {}
      release();
      avatar.classList.add('is-pressed');
      press();
      hold = { start: Date.now(), timer: setInterval(holdTick, HOLD_TICK_MS) };
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (type) {
      avatar.addEventListener(type, release);
    });
    avatar.addEventListener('contextmenu', function (event) { event.preventDefault(); });
  }

  if (window.console && console.log) {
    console.log('%c⚡ Fault injection enabled. Try clicking, or holding, the avatar.', 'color:#26758e;font-weight:bold');
  }
})();

/* Thai / English switcher.
   Thai is the source language of the page. In English mode this script translates every Thai text node and
   placeholder/title/aria-label/alt attribute from the dictionary in i18n-en.js (the same pass also catches text
   that app.js renders later, e.g. cloud data, modals and the weather bar).
   Text that is not in the dictionary (for example new wording typed by the admin) simply stays Thai.
   Switching language reloads the page, so no live revert logic is needed. */
(function () {
  var LANG = (window.SITE_LANG === 'en' && window.I18N_EN) ? 'en' : 'th';
  window.SITE_LANG = LANG;

  var SKIPTAG = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1 };
  var SKIP = SKIPTAG;
  var TH = /[\u0E01-\u0E3E\u0E40-\u0E5B]/; // Thai letters, not the baht sign (U+0E3F)
  var D = window.I18N_EN || {};
  var exact = new Map();
  var pats = [];
  var Dn = {};

  // Collapse whitespace and unify the two spellings of "นํ้า/น้ำ" (nikhahit + tone mark vs. sara am) so keys match typed text.
  function norm(s) {
    return s.replace(/\u0E4D\u0E49\u0E32/g, '\u0E49\u0E33').replace(/\u0E4D\u0E32/g, '\u0E33').replace(/\s+/g, ' ').trim();
  }

  function esc(s) { return s.replace(/[.*+?^$()|[\]\\]/g, '\\$&'); }
  Object.keys(D).forEach(function (k0) {
    var k = norm(k0);
    Dn[k] = D[k0];
    if (!/\{\d+\}/.test(k)) { exact.set(k, D[k0]); return; }
    var names = [];
    var src = esc(k).replace(/\{(\d+)\}/g, function (_, n) { names.push(n); return '(.+?)'; });
    pats.push({ rx: new RegExp('^' + src + '$'), names: names, en: D[k0], len: k.length });
  });
  pats.sort(function (a, b) { return b.len - a.len; });

  function lookup(core) {
    var r = exact.get(core);
    if (r !== undefined) return r;
    for (var i = 0; i < pats.length; i++) {
      var p = pats[i], m = p.rx.exec(core);
      if (!m) continue;
      return p.en.replace(/\{(\d+)\}/g, function (_, n) {
        var gi = p.names.indexOf(n);
        var cap = gi < 0 ? '' : m[gi + 1];
        return TH.test(cap) ? T(cap) : cap;
      });
    }
    return null;
  }

  /** Translate a string (keeps leading/trailing whitespace). Returns the input unchanged when it is not Thai or unknown. */
  function T(s) {
    if (LANG !== 'en' || typeof s !== 'string' || !TH.test(s)) return s;
    var core = norm(s);
    var r = lookup(core);
    if (r === null) return s;
    return s.match(/^\s*/)[0] + r + s.match(/\s*$/)[0];
  }
  window.T = T;

  /** Message template: tt('📅 เช็คอิน: {0}', date). Falls back to the Thai template; always fills {n}. */
  window.tt = function (key) {
    var args = Array.prototype.slice.call(arguments, 1);
    var out = (LANG === 'en' && Dn[norm(key)] !== undefined) ? Dn[norm(key)] : key;
    return out.replace(/\{(\d+)\}/g, function (m, i) { return args[i] === undefined ? m : args[i]; });
  };

  window.setSiteLang = function (l) {
    try { localStorage.setItem('baantaphai_lang', l); } catch (e) {}
    var u = new URL(location.href);
    u.searchParams.delete('lang');
    location.href = u.toString();
  };
  window.toggleSiteLang = function () { window.setSiteLang(LANG === 'en' ? 'th' : 'en'); };

  function paintToggle() {
    document.querySelectorAll('[data-lang-toggle]').forEach(function (b) {
      b.setAttribute('aria-label', LANG === 'en' ? 'เปลี่ยนเป็นภาษาไทย' : 'Switch to English');
      b.setAttribute('title', LANG === 'en' ? 'ภาษาไทย' : 'English');
      var t = b.querySelector('[data-lang-label]');
      if (t) t.textContent = LANG === 'en' ? 'ไทย' : 'EN';
    });
  }
  document.addEventListener('DOMContentLoaded', paintToggle);
  paintToggle();

  // Debug helper: window.i18nMissing() lists visible Thai text that has no English yet (admin areas excluded).
  window.i18nMissing = function () {
    var w = document.createTreeWalker(document.body, 4), n, seen = {};
    while ((n = w.nextNode())) {
      if (!TH.test(n.nodeValue) || SKIPTAG[n.parentNode.nodeName] || isAdmin(n.parentElement)) continue;
      seen[norm(n.nodeValue)] = 1;
    }
    return Object.keys(seen);
  };

  if (LANG !== 'en') return;

  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

  // The admin editor stays Thai: its labels and forms are never translated.
  var ADM = '[id^="edit"],[id^="manage"],#adminBar,#adminToolsPanel,#publishModal,#adminPinModal,[id$="AdminTrigger"],[id$="AdminTriggers"],#previewModeFloatingBar,.modal-admin-only,.extra-admin';
  function isAdmin(el) { return !!(el && el.closest && el.closest(ADM)); }

  function textNode(n) {
    var v = n.nodeValue;
    if (!v || !TH.test(v) || n.__en === v) return;
    var p = n.parentNode;
    if (p && (SKIP[p.nodeName] || isAdmin(p))) return;
    var r = T(v);
    if (r !== v) { n.__en = r; n.nodeValue = r; }
  }

  function attrs(el) {
    if (isAdmin(el)) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i], v = el.getAttribute(a);
      if (v && TH.test(v)) {
        var r = T(v);
        if (r !== v) el.setAttribute(a, r);
      }
    }
  }

  function walk(root) {
    if (root.nodeType === 3) { textNode(root); return; }
    if (root.nodeType !== 1 || SKIP[root.nodeName]) return;
    attrs(root);
    var w = document.createTreeWalker(root, 1 | 4, null);
    var n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) textNode(n);
      else if (SKIP[n.nodeName]) { /* children are skipped by the text-node parent check */ }
      else attrs(n);
    }
  }

  function meta() {
    var M = window.I18N_EN_META || {};
    document.documentElement.lang = 'en';
    if (M.title) document.title = M.title;
    [['name', 'description', M.description], ['property', 'og:description', M.ogDescription || M.description],
     ['property', 'og:title', M.title], ['name', 'twitter:title', M.title], ['property', 'og:site_name', M.siteName],
     ['property', 'og:image:alt', M.imageAlt], ['property', 'og:locale', 'en_US']].forEach(function (x) {
      if (!x[2]) return;
      var el = document.querySelector('meta[' + x[0] + '="' + x[1] + '"]');
      if (el) el.setAttribute('content', x[2]);
    });
  }

  var mo = new MutationObserver(function (recs) {
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i];
      if (r.type === 'characterData') textNode(r.target);
      else if (r.type === 'attributes') attrs(r.target);
      else for (var j = 0; j < r.addedNodes.length; j++) walk(r.addedNodes[j]);
    }
  });

  function start() {
    document.documentElement.classList.add('lang-en');
    meta();
    walk(document.documentElement);
    mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    paintToggle();
  }
  start();

  function reveal() { document.documentElement.classList.remove('i18n-pending'); }
  document.addEventListener('DOMContentLoaded', function () { setTimeout(reveal, 0); });
  window.addEventListener('load', reveal);
})();

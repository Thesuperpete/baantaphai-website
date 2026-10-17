    (function () {
      // Header: transparent over the hero, solid once scrolled
      var header = document.getElementById('siteHeader');
      function syncHeader() {
        if (!header) return;
        header.classList.toggle('nav-top', window.scrollY < 40);
      }
      syncHeader();
      window.addEventListener('scroll', syncHeader, { passive: true });

      // Floating contact button: pull live links from the (admin-editable) header buttons
      var fab = document.getElementById('contactFab');
      var btn = document.getElementById('contactFabBtn');
      if (!fab || !btn) return;
      function copyHref(fromId, toId) {
        var src = document.getElementById(fromId), dst = document.getElementById(toId);
        if (src && dst) dst.href = src.href;
      }
      function syncFab() {
        copyHref('navLineBtn', 'fabLine');
        copyHref('navMessengerBtn', 'fabMessenger');
        copyHref('navPhoneLink', 'fabPhone');
        var t = document.getElementById('navPhoneText'), ft = document.getElementById('fabPhoneText');
        if (t && ft && t.textContent.trim()) ft.textContent = 'โทร ' + t.textContent.trim();
      }
      btn.addEventListener('click', function () {
        syncFab();
        var open = fab.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-comment-dots';
      });
      document.addEventListener('click', function (e) {
        if (fab.classList.contains('open') && !fab.contains(e.target)) {
          fab.classList.remove('open');
          btn.firstElementChild.className = 'fa-solid fa-comment-dots';
        }
      });
      syncFab();
    })();


    // ===== Hero background: one picture, optionally replaced by a looping muted video =====
    // SITE_HERO.heroVideo accepts a direct file (.mp4/.webm/.mov), a YouTube link or a Vimeo link.
    (function () {
      var hero = document.getElementById('hero');
      var wrap = document.getElementById('heroVideoWrap');
      var main = document.getElementById('heroMainImage');
      if (!hero || !wrap) return;
      var current = '', io = null, frame = null;

      function parse(u) {
        u = (u || '').trim();
        if (!u) return null;
        var m = u.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i);
        if (m) return { type: 'yt', id: m[1] };
        m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
        if (m) return { type: 'vimeo', id: m[1] };
        if (/^https?:\/\//i.test(u) || u.charAt(0) === '/') return { type: 'file', src: u };
        return null;
      }
      function fit() {
        if (!frame) return;
        var W = wrap.clientWidth, H = wrap.clientHeight;
        var w = Math.max(W, H * 16 / 9), h = w * 9 / 16;
        frame.style.width = w + 'px'; frame.style.height = h + 'px';
      }
      function clear() {
        if (io) { io.disconnect(); io = null; }
        wrap.innerHTML = ''; wrap.classList.add('hidden'); wrap.classList.remove('ready'); frame = null;
      }
      function ready() { requestAnimationFrame(function () { wrap.classList.add('ready'); }); setTimeout(function () { wrap.classList.add('ready'); }, 400); }

      function apply() {
        var url = (typeof SITE_HERO !== 'undefined' && SITE_HERO && SITE_HERO.heroVideo) || '';
        var conn = navigator.connection || {};
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var key = (reduce || conn.saveData) ? '' : url;      // respect reduced-motion / data-saver: keep the picture
        if (key === current) return;
        current = key; clear();
        var v = parse(key);
        if (!v) return;
        wrap.classList.remove('hidden');
        if (v.type === 'file') {
          var el = document.createElement('video');
          el.className = 'hero-video-el'; el.muted = true; el.defaultMuted = true; el.loop = true; el.autoplay = true; el.playsInline = true;
          el.setAttribute('muted', ''); el.setAttribute('playsinline', ''); el.setAttribute('aria-hidden', 'true'); el.preload = 'auto';
          if (main && main.currentSrc) el.poster = main.currentSrc;
          function tryPlay() { if (!el.isConnected) return; var q = el.play(); if (q && q.catch) q.catch(function () { /* autoplay blocked: the picture stays */ }); }
          el.addEventListener('playing', ready, { once: true });
          el.addEventListener('error', function () { clear(); current = ''; });
          el.addEventListener('loadeddata', tryPlay);
          el.addEventListener('canplay', tryPlay);
          document.addEventListener('visibilitychange', function () { if (!document.hidden) tryPlay(); });
          ['touchstart', 'pointerdown', 'scroll'].forEach(function (ev) { window.addEventListener(ev, function () { if (el.paused) tryPlay(); }, { once: true, passive: true }); });
          el.src = v.src;
          wrap.appendChild(el);
          tryPlay();
          // pause when the hero is off screen or the tab is hidden (saves battery/data)
          if ('IntersectionObserver' in window) {
            io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { var q = el.play(); if (q && q.catch) q.catch(function () {}); } else el.pause(); }); }, { threshold: 0.05 });
            io.observe(hero);
          }
        } else {
          var f = document.createElement('iframe');
          f.className = 'hero-video-frame'; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
          f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture'); f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          f.src = v.type === 'yt'
            ? 'https://www.youtube-nocookie.com/embed/' + v.id + '?autoplay=1&mute=1&loop=1&playlist=' + v.id + '&controls=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0'
            : 'https://player.vimeo.com/video/' + v.id + '?background=1&autoplay=1&muted=1&loop=1&autopause=0&byline=0&title=0';
          f.addEventListener('load', function () { setTimeout(ready, 900); }, { once: true });
          frame = f; wrap.appendChild(f); fit();
        }
      }

      window.addEventListener('resize', fit, { passive: true });
      var orig = window.renderHeroSection;
      if (typeof orig === 'function') {
        window.renderHeroSection = function () { var r = orig.apply(this, arguments); apply(); return r; };
      }
      window.btHeroVideo = { refresh: apply };
      apply();
    })();


    // ===== Finishing touches: scroll progress, back-to-top, nav scrollspy, reveal-on-scroll =====
    (function () {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      var bar = document.createElement('div'); bar.id = 'scrollProgress'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
      var top = document.createElement('button'); top.id = 'backToTop'; top.type = 'button'; top.setAttribute('aria-label', 'กลับขึ้นด้านบน');
      top.innerHTML = '<i class="fa-solid fa-arrow-up"></i>'; document.body.appendChild(top);
      top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

      var ticking = false;
      function onScroll() {
        if (ticking) return; ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          var h = document.documentElement.scrollHeight - innerHeight;
          bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
          top.classList.toggle('show', scrollY > 700);
          // nav items are admin-editable and re-rendered, so look them up fresh each time
          var links = Array.prototype.slice.call(document.querySelectorAll('#siteHeader nav a'));
          var cur = null, curTop = -1e9;
          links.forEach(function (a) {
            var href = a.getAttribute('href') || '';
            var t = /^#[\w-]+$/.test(href) ? document.getElementById(href.slice(1)) : null;
            var y = t ? t.getBoundingClientRect().top : null;
            if (y !== null && y <= 160 && y > curTop) { cur = a; curTop = y; }
          });
          links.forEach(function (a) { a.classList.toggle('nav-active', a === cur); });
        });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      if (reduce || !('IntersectionObserver' in window)) return;
      function setupReveal() {
        var picks = [];
        document.querySelectorAll('section:not(#hero)').forEach(function (sec) {
          var wrap = sec.querySelector(':scope > div');
          if (wrap) Array.prototype.forEach.call(wrap.children, function (c) { picks.push(c); });
        });
        document.querySelectorAll('.attr-card, #activitiesGridContainer > div, .room-card, .menu-item-card, .photo-card, .review-card, .dine-card, .spot-card').forEach(function (c) { picks.push(c); });
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            var el = en.target; io.unobserve(el);
            el.classList.add('bt-in');
            setTimeout(function () { el.classList.remove('bt-reveal', 'bt-in'); el.style.removeProperty('--d'); }, 1300);
          });
        }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
        var seen = new Set();
        picks.forEach(function (el, i) {
          if (seen.has(el) || el.classList.contains('bt-reveal') || el.closest('.hidden')) return; seen.add(el);
          var r = el.getBoundingClientRect();
          if (r.top < innerHeight * 0.9 && r.bottom > 0) return; // already on screen: leave alone
          var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
          el.style.setProperty('--d', Math.min(sib % 4, 3) * 90 + 'ms');
          el.classList.add('bt-reveal'); io.observe(el);
        });
      }
      // dynamic sections render shortly after load; wait for them, then arm once
      setTimeout(setupReveal, 1600);
    })();

    // ===== Placeholder links ("รอใส่" etc.): never navigate to a broken page =====
    (function () {
      function isPlaceholder(href) {
        href = (href || '').trim();
        if (!href) return false;
        if (/^(#|https?:|tel:|mailto:|sms:|line:|fb-messenger:|javascript:|\/|\.)/i.test(href)) return false;
        return /[\u0E00-\u0E7F]/.test(href); // Thai text typed where a URL belongs
      }
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href]');
        if (!a || !isPlaceholder(a.getAttribute('href'))) return;
        e.preventDefault();
        e.stopPropagation();
        var msg = (typeof isAdminMode !== 'undefined' && isAdminMode)
          ? '🔗 ลิงก์นี้ยังเป็น "' + a.getAttribute('href').trim() + '" — ตั้งลิงก์จริงได้ที่ปุ่มแก้ไขเมนู'
          : '✨ หน้านี้กำลังจัดเตรียม เร็ว ๆ นี้';
        if (typeof showToast === 'function') showToast(msg);
      }, true);
      function mark() {
        document.querySelectorAll('a[href]').forEach(function (a) {
          var ph = isPlaceholder(a.getAttribute('href'));
          a.classList.toggle('link-pending', ph);
          if (ph) a.setAttribute('aria-disabled', 'true'); else if (a.getAttribute('aria-disabled') === 'true') a.removeAttribute('aria-disabled');
        });
      }
      mark();
      var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(mark, 150); })
        .observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
    })();

    // ===== Admin tools panel =====
    function toggleAdminTools(force) {
      const p = document.getElementById('adminToolsPanel');
      const t = document.getElementById('adminToolsToggle');
      if (!p) return;
      const open = typeof force === 'boolean' ? force : p.classList.contains('hidden');
      p.classList.toggle('hidden', !open);
      if (t) { t.setAttribute('aria-expanded', open ? 'true' : 'false'); t.classList.toggle('is-open', open); }
    }
    document.addEventListener('click', function (e) {
      const p = document.getElementById('adminToolsPanel');
      if (!p || p.classList.contains('hidden')) return;
      if (e.target.closest('.admin-tool')) { toggleAdminTools(false); return; }       // picked a tool -> its modal opens
      if (!e.target.closest('#adminToolsPanel') && !e.target.closest('#adminToolsToggle')) toggleAdminTools(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleAdminTools(false); });

    // ===== Accurate anchor navigation (menus, drawer, buttons) =====
    // Scrolls so a section sits right under the sticky header ("home" goes to the very top), then re-measures
    // once images/layout settle and corrects any drift.
    (function () {
      var timer = null;
      function headerOffset() {
        var h = document.getElementById('siteHeader');
        return h ? h.getBoundingClientRect().height : 64;
      }
      function targetY(el, id) {
        if (id === 'hero') return 0;                                         // "home" = very top (shows the announcement strip)
        return Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset() + 1);
      }
      function go(el, id) {
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var behavior = (reduce || document.hidden) ? 'instant' : 'smooth';   // 'auto' would defer to the CSS smooth rule
        clearTimeout(timer);
        window.scrollTo({ top: targetY(el, id), behavior: behavior });
        var fix = function () {                                              // correct any drift after the layout settled
          var y = targetY(el, id);
          if (Math.abs(window.scrollY - y) > 6) window.scrollTo({ top: y, behavior: 'instant' });
        };
        setTimeout(fix, behavior === 'smooth' ? 900 : 120);
        setTimeout(fix, behavior === 'smooth' ? 1700 : 500);
        try { history.replaceState(null, '', '#' + id); } catch (e) {}
        if (el.getAttribute('tabindex') === '-1') el.focus({ preventScroll: true });   // skip links: keyboard users must land inside the target
      }
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
        var id = (a.getAttribute('href') || '').slice(1);
        if (!id || !/^[\w-]+$/.test(id)) return;
        var el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        go(el, id);
      }, true);   // capture phase: the mobile drawer panel calls stopPropagation(), which would otherwise hide its links from us
    })();



    // ===== Ayutthaya x Japan: falling sakura petals in the hero =====
    (function () {
      function petals() {
        var hero = document.getElementById('hero');
        if (!hero || hero.querySelector('.sakura-fall')) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var box = document.createElement('div');
        box.className = 'sakura-fall';
        box.setAttribute('aria-hidden', 'true');
        var small = window.innerWidth < 640, count = small ? 9 : 16;
        for (var i = 0; i < count; i++) {
          var p = document.createElement('i');
          var r = function (a, b) { return a + Math.random() * (b - a); };
          p.style.setProperty('--x', r(0, 98).toFixed(1) + '%');
          p.style.setProperty('--s', r(9, 18).toFixed(0) + 'px');
          p.style.setProperty('--d', r(11, 20).toFixed(1) + 's');
          p.style.setProperty('--dl', (-r(0, 18)).toFixed(1) + 's');
          p.style.setProperty('--dx', r(-120, 160).toFixed(0) + 'px');
          box.appendChild(p);
        }
        var shade = hero.querySelector('.hero-shade');
        if (shade && shade.nextSibling) hero.insertBefore(box, shade.nextSibling); else hero.appendChild(box);
      }
      try { petals(); } catch (e) { console.warn('[sakura petals]', e); }
    })();


    // ===== Accessibility layer: keyboard-operable cards, dialog semantics + focus management, live announcements =====
    (function () {
      var NATIVE = /^(BUTTON|A|INPUT|SELECT|TEXTAREA|SUMMARY|LABEL)$/;
      var live = document.getElementById('a11yLive');
      window.a11yAnnounce = function (msg) { if (!live) return; live.textContent = ''; setTimeout(function () { live.textContent = String(msg || ''); }, 60); };

      function isBackdrop(el) {
        var c = (el.getAttribute('class') || '');
        if (/\bfixed\b/.test(c) && /inset-0/.test(c)) return true;
        if (el.id && /(Modal|Drawer|Backdrop|Overlay)$/i.test(el.id)) return true;
        return /^\s*event\.stopPropagation\(\)\s*;?\s*$/.test(el.getAttribute('onclick') || '');
      }
      function enhance(root) {
        (root || document).querySelectorAll('[onclick]').forEach(function (el) {
          if (NATIVE.test(el.tagName) || el.hasAttribute('role') || el.hasAttribute('tabindex') || isBackdrop(el)) return;
          el.setAttribute('role', 'button');
          el.setAttribute('tabindex', '0');
        });
      }
      var timer = null;
      function schedule() { clearTimeout(timer); timer = setTimeout(function () { enhance(document); }, 120); }
      enhance(document);
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });

      document.addEventListener('keydown', function (e) {
        var t = e.target;
        if (!t || t.nodeType !== 1 || NATIVE.test(t.tagName) || t.getAttribute('role') !== 'button') return;
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); t.click(); }
      });

      // dialogs: role/aria-modal/label, focus in, focus trapped, focus returned, Esc
      var MODAL_SEL = '[id$="Modal"], #mobileMenuDrawer';
      var stack = [];
      function visible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }
      function focusables(m) {
        return [].slice.call(m.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(visible);
      }
      function isOpen(m) { return !m.classList.contains('hidden') && getComputedStyle(m).display !== 'none'; }
      function labelId(m) {
        var h = m.querySelector('h1, h2, h3, h4, [id$="Title"]');
        if (!h || !h.textContent.trim()) return null;
        if (!h.id) h.id = (m.id || 'dialog') + '__title';
        return h.id;
      }
      function opened(m) {
        if (stack.indexOf(m) > -1) return;
        m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
        if (!m.hasAttribute('aria-label') && !m.hasAttribute('aria-labelledby')) {
          var id = labelId(m);
          if (id) m.setAttribute('aria-labelledby', id); else m.setAttribute('aria-label', (m.id || 'dialog').replace(/Modal$|Drawer$/, ''));
        }
        if (!m.hasAttribute('tabindex')) m.setAttribute('tabindex', '-1');
        m.__ret = document.activeElement;
        stack.push(m);
        setTimeout(function () { var f = focusables(m)[0] || m; try { f.focus({ preventScroll: true }); } catch (e) {} }, 40);
      }
      function closed(m) {
        var i = stack.indexOf(m); if (i < 0) return;
        stack.splice(i, 1);
        var r = m.__ret; m.__ret = null;
        if (r && r !== document.body && document.contains(r)) setTimeout(function () { try { r.focus({ preventScroll: true }); } catch (e) {} }, 0);
      }
      var mo = new MutationObserver(function (list) {
        list.forEach(function (mu) { var t = mu.target; if (t.nodeType === 1 && t.matches(MODAL_SEL)) { if (isOpen(t)) opened(t); else closed(t); } });
      });
      document.querySelectorAll(MODAL_SEL).forEach(function (m) { mo.observe(m, { attributes: true, attributeFilter: ['class', 'style'] }); });

      document.addEventListener('keydown', function (e) {
        var top = stack[stack.length - 1]; if (!top) return;
        if (e.key === 'Escape') {
          if (/(Edit|Manage|Publish|Admin)/i.test(top.id)) return;   // never discard in-progress admin edits with a stray Esc
          setTimeout(function () {
            if (stack.indexOf(top) < 0 || !isOpen(top)) return;
            var c = top.querySelector('[onclick*="lose"], [aria-label*="ปิด"]');
            if (c) c.click(); else top.classList.add('hidden');
          }, 40);
        } else if (e.key === 'Tab') {
          var f = focusables(top);
          if (!f.length) { e.preventDefault(); return; }
          var first = f[0], last = f[f.length - 1], a = document.activeElement;
          if (e.shiftKey && (a === first || a === top)) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
        }
      });
    })();

    try { initOmikujiLock(); } catch (e) { console.warn('[omikuji lock]', e); }
    try { renderExtraSections(); } catch (e) { console.warn('[extra sections]', e); }
  

// ===== Optional fonts: loaded only when the saved site data actually uses them (or an admin is editing) =====
(function () {
  var EXTRA = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&family=Mitr:wght@300;400;500;600&family=Kanit:wght@300;400;500;600&display=swap';
  var loaded = false;
  function load() {
    if (loaded) return; loaded = true;
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = EXTRA; document.head.appendChild(l);
  }
  function needed() {
    try {
      if (document.querySelector('[class*="font-override-ibm"], [class*="font-override-sarabun"], [class*="font-override-mitr"], [class*="font-override-kanit"]')) return true;
      var css = (document.getElementById('site-dynamic-font') || {}).textContent || '';
      if (/"(IBM Plex Sans Thai|Sarabun|Mitr|Kanit)"/.test(css.replace(/\.font-override-[\s\S]*?\}/g, ''))) return true;
      if (typeof isAdminMode !== 'undefined' && isAdminMode) return true;
    } catch (e) {}
    return false;
  }
  window.ensureExtraFonts = function () { if (needed()) load(); };
  [900, 3500, 8000].forEach(function (ms) { setTimeout(window.ensureExtraFonts, ms); });
  document.addEventListener('click', function () { setTimeout(window.ensureExtraFonts, 400); }, { passive: true });
})();


// ===== Stock photos are not this resort: until a real photo is set, show a plain branded placeholder instead =====
(function () {
  var PH = 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20800%20600%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%27%20stop-color%3D%27%2312306B%27%2F%3E%3Cstop%20offset%3D%271%27%20stop-color%3D%27%230B2545%27%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%3Crect%20x%3D%2724%27%20y%3D%2724%27%20width%3D%27752%27%20height%3D%27552%27%20rx%3D%2718%27%20fill%3D%27none%27%20stroke%3D%27%23C9A24B%27%20stroke-opacity%3D%27.55%27%20stroke-width%3D%272%27%2F%3E%3Cg%20transform%3D%27translate%28336%2096%29%20scale%282%29%27%3E%3Cpath%20d%3D%27M0%208Q32%2018%2064%208L61%2015Q32%2024%203%2015Z%27%20fill%3D%27%23D63A2F%27%2F%3E%3Cpath%20d%3D%27M3%2015Q32%2024%2061%2015V19Q32%2028%203%2019Z%27%20fill%3D%27%239E241C%27%2F%3E%3Crect%20x%3D%279%27%20y%3D%2726%27%20width%3D%2746%27%20height%3D%275%27%20fill%3D%27%23D63A2F%27%2F%3E%3Crect%20x%3D%2714%27%20y%3D%2718%27%20width%3D%276%27%20height%3D%2742%27%20fill%3D%27%23D63A2F%27%2F%3E%3Crect%20x%3D%2744%27%20y%3D%2718%27%20width%3D%276%27%20height%3D%2742%27%20fill%3D%27%23D63A2F%27%2F%3E%3C%2Fg%3E%3Ctext%20x%3D%27400%27%20y%3D%27300%27%20text-anchor%3D%27middle%27%20fill%3D%27%23fff%27%20font-size%3D%2736%27%20font-weight%3D%27600%27%20font-family%3D%27Prompt%2CThonburi%2CSarabun%2Csans-serif%27%3E%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87%E0%B8%81%E0%B8%B3%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%A1%E0%B8%B2%3C%2Ftext%3E%3Ctext%20x%3D%27400%27%20y%3D%27346%27%20text-anchor%3D%27middle%27%20fill%3D%27%23C9A24B%27%20font-size%3D%2720%27%20letter-spacing%3D%276%27%20font-family%3D%27Prompt%2CHelvetica%2CArial%2Csans-serif%27%3EBAAN%20TA%20PHAI%3C%2Ftext%3E%3C%2Fsvg%3E';
  function stock(src) { return /images\.unsplash\.com/i.test(src || ''); }
  function swap(img) {
    var s = img.getAttribute('src') || '';
    if (s === PH) return;
    if (stock(s) || (!s && img.classList.contains('needs-photo'))) { img.dataset.stockSrc = s; img.setAttribute('src', PH); }
  }
  function scan(root) { (root || document).querySelectorAll('img').forEach(swap); }
  scan(document);
  new MutationObserver(function (list) {
    list.forEach(function (m) {
      if (m.type === 'attributes') { if (m.target.tagName === 'IMG') swap(m.target); return; }
      m.addedNodes.forEach(function (n) { if (n.nodeType !== 1) return; if (n.tagName === 'IMG') swap(n); else if (n.querySelectorAll) scan(n); });
    });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
})();

// ===== Floating buttons stay out of the way while the hero is on screen; the notice can be dismissed for the session =====
(function () {
  function sync() {
    var hero = document.getElementById('hero');
    document.body.classList.toggle('in-hero', !!hero && window.scrollY < hero.offsetHeight - 120);
  }
  sync();
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  document.addEventListener('click', function (e) {
    var x = e.target.closest && e.target.closest('#socialProofClose');
    if (!x) return;
    var t = document.getElementById('socialProofToast');
    if (t) { t.classList.remove('toast-visible'); t.classList.add('hidden'); }
    try { sessionStorage.setItem('bt_toast_off', '1'); } catch (err) {}
  });
})();

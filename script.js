/* =========================================================
   MM | Portfolio scripts
   ========================================================= */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  links.forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
      setMenu(false);
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 820) { setMenu(false); }
  });

  /* ---------- Header border on scroll ---------- */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Active link highlighting ---------- */
  var sections = links
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (l) {
      var on = l.getAttribute('href') === '#' + id;
      l.classList.toggle('active', on);
      if (on) { l.setAttribute('aria-current', 'true'); } else { l.removeAttribute('aria-current'); }
    });
  }

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { setActive(entry.target.id); }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    var toggleTop = function () { toTop.classList.toggle('show', window.scrollY > 600); };
    toggleTop();
    window.addEventListener('scroll', toggleTop, { passive: true });
  }

  /* ---------- Soft 3D tilt on hover (mouse devices only) ---------- */
  var canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
                !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canTilt) {
    document.querySelectorAll('.card, .facts, .job, .code-window, .about-photo').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') { return; }
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        var max = r.width > 520 ? 2.5 : 5;          /* wide blocks tilt less */
        el.style.setProperty('--ry', ((x - 0.5) * 2 * max).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - y) * 2 * max).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', function () {
        el.style.removeProperty('--rx');
        el.style.removeProperty('--ry');
      });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) { year.textContent = new Date().getFullYear(); }
})();

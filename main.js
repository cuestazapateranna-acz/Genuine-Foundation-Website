/* main.js — Genuine Foundation shared JavaScript */
(function () {
  'use strict';

  /* ── Custom Cursor ─────────────────────────────────────── */
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouchDevice) {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (dot && ring) {
      let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

      document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = e.clientX + 'px';
        dot.style.top  = e.clientY + 'px';
      });

      (function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
      })();

      document.querySelectorAll('a, button, .card, .init-card, .pillar-card, .involve-card, .audience-item, .involvement-item, .form__chip label').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    }
  } else {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (dot)  dot.remove();
    if (ring) ring.remove();
    document.body.style.cursor = 'auto';
    document.querySelectorAll('button').forEach(b => b.style.cursor = 'pointer');
    document.querySelectorAll('a').forEach(a => a.style.cursor = 'pointer');
  }

  /* ── Navbar Scroll ─────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── Mobile Menu ───────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburgerBtn');
  const mobileClose = document.getElementById('mobileClose');
  const mobileMenu  = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll Reveal ─────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  if (revealEls.length) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => ro.observe(el));
  }

  /* ── Counter Animation ─────────────────────────────────── */
  function runCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const decimals = (el.dataset.target || '').includes('.') ? 1 : 0;
    const duration = 1800;
    const start    = performance.now();

    function ease(p) { return 1 - Math.pow(1 - p, 3); }

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const v = target * ease(p);
      el.textContent = prefix + (decimals ? v.toFixed(1) : Math.round(v)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const co = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => co.observe(el));
  }

  /* ── Form Submission ───────────────────────────────────── */
  document.querySelectorAll('[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const inner   = form.querySelector('.form__fields-inner');
      const success = form.querySelector('.form__success');
      if (inner)   inner.style.display = 'none';
      if (success) success.classList.add('visible');
    });
  });

  /* ── Active Nav Link ───────────────────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href && href !== 'index.html' && page.includes(href.replace('.html', ''))) {
      a.classList.add('active');
    }
  });
  document.querySelectorAll('.mobile-menu__links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href && href !== 'index.html' && page.includes(href.replace('.html', ''))) {
      a.style.color = '#fff';
    }
  });

  /* ── Smooth scroll for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Coming Soon Modal ─────────────────────────────────── */
  (function () {
    const modal = document.createElement('div');
    modal.className = 'cs-modal';
    modal.id = 'csModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Coming Soon');
    modal.innerHTML = [
      '<div class="cs-modal__card">',
      '  <div class="cs-modal__heading">We\'re working on this</div>',
      '  <div class="cs-modal__sub">Coming soon</div>',
      '  <button class="cs-modal__close" id="csModalClose">Got it</button>',
      '</div>'
    ].join('');
    document.body.appendChild(modal);

    function openCS()  { modal.classList.add('open');    document.body.style.overflow = 'hidden'; }
    function closeCS() { modal.classList.remove('open'); document.body.style.overflow = ''; }

    document.getElementById('csModalClose').addEventListener('click', closeCS);
    modal.addEventListener('click', e => { if (e.target === modal) closeCS(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCS(); });

    document.querySelectorAll('a[href="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        openCS();
      });
    });
  })();

})();

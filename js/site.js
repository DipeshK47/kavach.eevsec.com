/* Standalone services-site behavior. This file intentionally has no dependency
   on the CyberRange app, its analytics, or its backend. */
(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const nav = $('#nav');
  const burger = $('#navBurger');
  const menu = $('#navMenu');
  const year = $('#year');

  if (year) year.textContent = new Date().getFullYear();

  const closeMenu = () => {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    menu.classList.remove('open');
  };

  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      menu.classList.toggle('open', !open);
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  if (nav) {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('is-stuck', y > 24);
      if (y > lastY && y > 80) nav.classList.add('nav--hidden');
      else nav.classList.remove('nav--hidden');
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();

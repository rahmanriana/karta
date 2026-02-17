(function () {
  const root = document.documentElement;
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme
  const THEME_KEY = 'malta_theme';
  const storedTheme = localStorage.getItem(THEME_KEY);
  const initialTheme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';
  if (initialTheme === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');

  const modeToggle = document.querySelector('[data-mode-toggle]');

  const syncThemeButton = () => {
    if (!modeToggle) return;
    const icon = modeToggle.querySelector('.mode-toggle__icon');
    const text = modeToggle.querySelector('.mode-toggle__text');
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (icon) icon.textContent = isDark ? '☾' : '☀';
    if (text) text.textContent = isDark ? 'Gelap' : 'Terang';
    modeToggle.setAttribute('aria-label', isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap');
  };

  syncThemeButton();

  modeToggle?.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem(THEME_KEY, 'dark');
    }
    syncThemeButton();
  });

  // Mobile nav
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('navMenu');

  const setNavOpen = (open) => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navMenu.classList.toggle('is-open', open);
  };

  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    setNavOpen(!expanded);
  });

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const isNavClick = target.closest('.nav') || target.closest('.nav-toggle');
    if (!isNavClick) setNavOpen(false);
  });

  // Close nav when link clicked
  document.querySelectorAll('.nav__link').forEach((a) => {
    a.addEventListener('click', () => setNavOpen(false));
  });

  // Active link on scroll
  const links = Array.from(document.querySelectorAll('.nav__link'));
  const sections = links
    .map((l) => document.querySelector(l.getAttribute('href') || ''))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

      if (!visible?.target) return;
      const id = visible.target.getAttribute('id');
      links.forEach((l) => {
        const href = l.getAttribute('href');
        l.classList.toggle('is-active', href === `#${id}`);
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: [0.05, 0.12, 0.2, 0.35] }
  );

  sections.forEach((s) => observer.observe(s));

  // Counters
  const counterEls = Array.from(document.querySelectorAll('[data-counter]'));

  const animateCounter = (el) => {
    const target = Number(el.getAttribute('data-counter') || '0');
    const durationMs = 900;
    const start = performance.now();
    const startValue = 0;

    const step = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(startValue + (target - startValue) * eased);
      el.textContent = value.toLocaleString('id-ID');
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        animateCounter(el);
        counterObs.unobserve(el);
      });
    },
    { threshold: 0.35 }
  );

  counterEls.forEach((el) => counterObs.observe(el));

  // Gallery modal
  const modal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');

  const openModal = (src, title) => {
    if (!modal || !modalImg || !modalCaption) return;
    modalImg.src = src;
    modalImg.alt = title || 'Preview';
    modalCaption.textContent = title || '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modalImg) modalImg.src = '';
    if (modalCaption) modalCaption.textContent = '';
  };

  document.querySelectorAll('[data-gallery-item]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-src');
      const title = btn.getAttribute('data-title');
      if (!src) return;
      openModal(src, title || '');
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Suggestion form (demo)
  const form = document.getElementById('suggestionForm');
  const hint = document.getElementById('formHint');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (hint) hint.textContent = 'Makasih! Pesan tersimpan sementara (demo).';
    form.reset();
  });
})();

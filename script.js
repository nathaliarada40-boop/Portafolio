const progressFills = document.querySelectorAll('.progress-fill');
const revealElements = document.querySelectorAll('.section');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const fill = entry.target;
      const raw = fill.dataset.value;
      const value = Number(raw);

      if (!Number.isFinite(value)) return;

      const percent = clamp(value, 0, 100);
      fill.style.width = `${percent}%`;

      progressObserver.unobserve(fill);
    });
  },
  { threshold: 0.5 }
);

progressFills.forEach((fill) => progressObserver.observe(fill));

function applyTheme(theme) {
  document.body.dataset.theme = theme;

  const btn = document.querySelector('.theme-chip');
  if (btn) {
    const isFinanzas = theme === 'finanzas';
    btn.setAttribute('aria-pressed', String(isFinanzas));
  }
}

function initThemeToggle() {
  const btn = document.querySelector('.theme-chip');
  if (!btn) return;

  const storageKey = 'theme';
  const stored = window.localStorage ? window.localStorage.getItem(storageKey) : null;

  applyTheme(stored === 'finanzas' ? 'finanzas' : '');

  btn.addEventListener('click', () => {
    const current = document.body.dataset.theme === 'finanzas' ? 'finanzas' : '';
    const next = current === 'finanzas' ? '' : 'finanzas';
    applyTheme(next);

    if (window.localStorage) window.localStorage.setItem(storageKey, next === 'finanzas' ? 'finanzas' : '');
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      event.preventDefault();

      const target = document.querySelector(href);
      if (!target) return;

      // Unificar movimiento: respetar reduced motion.
      const behavior = prefersReducedMotion.matches ? 'auto' : 'smooth';
      target.scrollIntoView({ behavior, block: 'start' });

      // Mantener hash en historial.
      if (window.location.hash !== href) {
        history.pushState(null, '', href);
      }
    });
  });
});

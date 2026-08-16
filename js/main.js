// Shared behavior: mobile nav toggle and active-link marking.

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initStarfield();
});

function initStarfield() {
  const field = document.querySelector('.stars');
  if (!field) return;

  const area = window.innerWidth * window.innerHeight;
  const count = Math.min(220, Math.max(90, Math.round(area / 9000)));

  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    star.className = 'star';

    const isBright = Math.random() < 0.15;
    const size = isBright ? 1.6 + Math.random() * 1.2 : 0.8 + Math.random() * 1;
    const maxOpacity = isBright ? 0.55 + Math.random() * 0.25 : 0.25 + Math.random() * 0.25;

    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty('--max-op', maxOpacity.toFixed(2));
    star.style.setProperty('--dur', `${(2.5 + Math.random() * 3).toFixed(2)}s`);
    star.style.setProperty('--delay', `${(Math.random() * 4).toFixed(2)}s`);

    frag.appendChild(star);
  }
  field.appendChild(frag);
}

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const here = document.body.dataset.page;
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    if (a.dataset.page === here) a.classList.add('is-active');
  });
}

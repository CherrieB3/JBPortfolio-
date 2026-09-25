// Shared behavior: mobile nav toggle, active-link marking, the
// home-page comet trail (only runs where the markup for it exists), and
// the custom star/"click me" cursor.

document.addEventListener('DOMContentLoaded', () => {
  initCalmMode();
  initNav();
  initScrollSpy();
  initCometTrail();
  initStarfield();
  initCustomCursor();
  initScrollReveal();
  initTiltCards();
  initRabbitEgg();
  initMascotToggle();
  initContactForm();
  initAnimationHoverPlay();
  initAnimationTheater();
});

// Calm mode: one switch in the nav that stops animation, dims the busy
// background layers, and raises text contrast (the CSS lives under
// html.calm in css/style.css). The class itself is set by a tiny inline
// script in each page's <head> before first paint, defaulting to on when
// the OS asks for reduced motion; this wires up the button and remembers
// the visitor's choice. localStorage can throw (private windows, blocked
// storage), so every access is guarded and the page still works without it.
function isCalm() {
  return document.documentElement.classList.contains('calm') ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initCalmMode() {
  const root = document.documentElement;
  const btn = document.querySelector('.calm-toggle');
  if (!btn) return;
  const sync = () => btn.setAttribute('aria-pressed', String(root.classList.contains('calm')));
  sync();
  btn.addEventListener('click', () => {
    const on = !root.classList.contains('calm');
    root.classList.toggle('calm', on);
    try { localStorage.setItem('calm', on ? '1' : '0'); } catch (e) { /* choice just won't persist */ }
    sync();
  });
}

// Clicking (or tapping/keyboard-activating) the hero mascot swaps its
// expression for MASCOT_ALT_DURATION_MS, then reverts on its own — a
// small "boop" easter egg in the same spirit as the rabbit hop. Driven by
// data attributes on the <img> so the source/alt pairs live in the markup
// rather than duplicated here.
const MASCOT_ALT_DURATION_MS = 500;

function initMascotToggle() {
  const btn = document.querySelector('.mascot-btn');
  const img = btn && btn.querySelector('.mascot');
  if (!btn || !img) return;

  // The mascot's square crop has a lot of transparent padding around the
  // floating pose — .mascot-btn covers that whole square (so the hover
  // target stays generous), but a real mouse click should only register
  // on the drawing itself. Sampled against an offscreen canvas rather
  // than a fixed CSS hit-box since the pose is irregular/diagonal, not a
  // shape a simple inset rectangle or circle could approximate.
  const hitCanvas = document.createElement('canvas');
  const hitCtx = hitCanvas.getContext('2d', { willReadFrequently: true });

  function hitsDrawing(clientX, clientY) {
    const rect = img.getBoundingClientRect();
    const px = Math.floor((clientX - rect.left) / rect.width * img.naturalWidth);
    const py = Math.floor((clientY - rect.top) / rect.height * img.naturalHeight);
    if (px < 0 || py < 0 || px >= img.naturalWidth || py >= img.naturalHeight) return false;
    hitCanvas.width = img.naturalWidth;
    hitCanvas.height = img.naturalHeight;
    hitCtx.clearRect(0, 0, hitCanvas.width, hitCanvas.height);
    hitCtx.drawImage(img, 0, 0);
    return hitCtx.getImageData(px, py, 1, 1).data[3] > 10;
  }

  let revertTimer = null;

  btn.addEventListener('click', (e) => {
    // Keyboard/AT activation (Enter/Space on the button) fires a click
    // with no real pointer position — MouseEvent.detail is 0 for those,
    // vs. >=1 for an actual mouse click — so let those through untested
    // rather than pixel-testing a coordinate that isn't meaningful here.
    if (e.detail !== 0 && !hitsDrawing(e.clientX, e.clientY)) return;

    img.src = img.dataset.altSrc;
    img.alt = img.dataset.altAlt;

    // A second click while already showing the alt expression just
    // restarts the revert window instead of stacking timers.
    clearTimeout(revertTimer);
    revertTimer = setTimeout(() => {
      img.src = img.dataset.defaultSrc;
      img.alt = img.dataset.defaultAlt;
    }, MASCOT_ALT_DURATION_MS);
  });
}

// The Contact section's form, wired to Jasmine's Formspree endpoint.
// Submitted via fetch rather than a plain HTML POST so a visitor gets an
// inline success/error message and stays on the page, instead of being
// bounced to Formspree's own default "thanks" page.
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const sendBtn = document.getElementById('contactSendBtn');
  const statusEl = document.getElementById('contactFormStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    sendBtn.disabled = true;
    statusEl.textContent = '';
    statusEl.className = 'contact-form-status';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Form submission failed');
      statusEl.textContent = "Thanks for reaching out! I'll get back to you soon.";
      statusEl.className = 'contact-form-status is-success';
      form.reset();
    } catch (err) {
      console.error('Contact form submission failed:', err);
      statusEl.textContent = "That didn't go through. Mind trying again, or emailing me directly?";
      statusEl.className = 'contact-form-status is-error';
    } finally {
      sendBtn.disabled = false;
    }
  });
}

// playground/animations.html's gallery: the small tile previews play on
// hover — the "hover and it just plays" feel of a GIF, without actually
// being one (a real animated GIF of a clip this long would be far
// heavier than the compressed .mp4 already is, and there's no video
// tool in this environment to generate one anyway). No-ops if the
// gallery markup isn't on the page. Only on hover-capable, fine-pointer
// devices with no prefers-reduced-motion — video starting to play on
// hover is a stronger motion trigger than the site's usual subtle hover
// transforms, and touch/no-hover pointers have no hover to trigger it
// with anyway. Every device can still watch each clip full-size via
// initAnimationTheater() below regardless of hover support, so this is
// purely a bonus preview, never the only way to play one.
function initAnimationHoverPlay() {
  const videos = document.querySelectorAll('.animation-tile video');
  // A GIF can't be paused, so its tile shows a still poster frame and only
  // swaps to the animated file on hover (never in Calm mode). A looping
  // GIF left running in the grid would ignore reduced motion entirely.
  const gifs = document.querySelectorAll('.animation-tile img[data-hover-src]');
  if (!videos.length && !gifs.length) return;

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;

  gifs.forEach(img => {
    const still = img.getAttribute('src');
    img.addEventListener('mouseenter', () => { if (!isCalm()) img.src = img.dataset.hoverSrc; });
    img.addEventListener('mouseleave', () => { img.src = still; });
  });

  videos.forEach(video => {
    // Checked on each hover rather than once, so turning Calm mode on
    // takes effect without a reload.
    video.addEventListener('mouseenter', () => { if (!isCalm()) video.play(); });
    video.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

// Theater mode: clicking any .animation-tile opens its clip full-size in
// the shared #theaterModal overlay (a fresh <video>/<img> built into
// .theater-stage per open, rather than moving the tile's own element —
// so the small tile's own poster/hover-preview is untouched) instead of
// playing inline in the small gallery tile. No-ops if the gallery/modal
// markup isn't on the page.
function initAnimationTheater() {
  const modal = document.getElementById('theaterModal');
  const tiles = document.querySelectorAll('.animation-tile');
  if (!modal || !tiles.length) return;

  const stage = modal.querySelector('.theater-stage');
  const closeBtn = modal.querySelector('.theater-close');
  let lastTrigger = null;

  function onKeydown(e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    // Focus trap: cycle between the close button and the theater
    // video's own native controls (its only other focusable child) —
    // the GIF case has just the close button, so the trap collapses to
    // that one element rather than needing special-casing.
    const media = stage.querySelector('video');
    const focusables = media ? [closeBtn, media] : [closeBtn];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  function open(tile) {
    // Stop the small tile's own hover-preview so it isn't still playing
    // (silently) behind the modal.
    const tileVideo = tile.querySelector('video');
    if (tileVideo) { tileVideo.pause(); tileVideo.currentTime = 0; }

    stage.innerHTML = '';
    if (tile.dataset.theaterType === 'image') {
      const img = document.createElement('img');
      img.src = tile.dataset.theaterSrc;
      img.alt = tile.getAttribute('aria-label') || '';
      stage.appendChild(img);
    } else {
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.poster = tile.dataset.theaterPoster || '';
      const source = document.createElement('source');
      source.src = tile.dataset.theaterSrc;
      source.type = 'video/mp4';
      video.appendChild(source);
      stage.appendChild(video);
      video.play().catch(() => {}); // real user click, so autoplay-with-sound is allowed
    }

    lastTrigger = tile;
    modal.hidden = false;
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    modal.hidden = true;
    stage.innerHTML = ''; // stops playback/downloading rather than just hiding it
    document.removeEventListener('keydown', onKeydown);
    if (lastTrigger) lastTrigger.focus();
  }

  tiles.forEach(tile => tile.addEventListener('click', () => open(tile)));
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
}

// A magnetic tilt toward the cursor on .card — the card leans as if it
// were a rigid plate pivoting under your pointer, on top of (not instead
// of) its existing lift hover. Only on real mouse pointers — touch has no
// continuous hover position to tilt against. Sets --tilt-x/--tilt-y
// (consumed inside the .card:hover transform in CSS) rather than
// transform directly, so this never fights the CSS transition already
// driving the lift. .sticker-card used to share this (removed at
// Jasmine's request in favor of a plain lift — see its :hover rule in
// css/style.css) so it's no longer in the selector below.
function initTiltCards() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const MAX_TILT = 8; // degrees at the card's edge; halved near its center

  // Only cards that are links or buttons tilt; static cards stay still.
  document.querySelectorAll('a.card, button.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (isCalm()) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${(px * MAX_TILT * 2).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(-py * MAX_TILT * 2).toFixed(2)}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

// A small hidden easter egg grounded in something real about Jasmine (the
// "rabbit enthusiast" line in the hero) rather than an arbitrary gimmick:
// type "rabbit" anywhere on the page and a little hop of sparks bounds
// across the screen. Keydown-sequence detection, the same idea as a
// Konami code, reset on any wrong key.
function initRabbitEgg() {
  const WORD = 'rabbit';
  let progress = 0;

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return; // don't hijack real shortcuts
    // Don't fire while someone's actually typing into a field — e.g.
    // writing "rabbit" into the contact form shouldn't launch a hop
    // mid-sentence.
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) { progress = 0; return; }
    const key = e.key.toLowerCase();
    progress = (key === WORD[progress]) ? progress + 1 : (key === WORD[0] ? 1 : 0);
    if (progress === WORD.length) {
      progress = 0;
      hopRabbit();
    }
  });
}

function hopRabbit() {
  if (isCalm()) return;
  const colors = ['#dc7bf0', '#6cbeef', '#efd96e', '#90e369', '#b79ff4', '#eea663', '#7ce3bd'];
  const hop = document.createElement('div');
  hop.className = 'rabbit-hop';
  hop.setAttribute('aria-hidden', 'true');
  // Same line-art rabbit silhouette used elsewhere on the site — no emoji.
  hop.innerHTML = `
    <svg class="rabbit-hop-glyph" viewBox="0 0 60 60" fill="none">
      <path d="M20,25 C15,10 8,0 15,2 C24,5 26,18 24,28" stroke="#b79ff4" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M32,25 C30,8 26,-2 34,2 C41,6 40,18 36,28" stroke="#b79ff4" stroke-width="3" fill="none" stroke-linecap="round" />
      <ellipse cx="30" cy="45" rx="24" ry="18" stroke="#b79ff4" stroke-width="3" fill="none" />
      <circle cx="22" cy="42" r="2.5" fill="#b79ff4" />
      <circle cx="34" cy="42" r="2.5" fill="#b79ff4" />
    </svg>`;
  document.body.appendChild(hop);

  // A few sparks trailing the hop, spawned partway through its bound
  // across the screen rather than all at once, so they read as a trail.
  const trailColors = colors;
  [300, 500, 700, 900].forEach((delay, i) => {
    setTimeout(() => {
      const spark = document.createElement('div');
      spark.className = 'doodle-burst';
      const x = window.innerWidth * (0.15 + i * 0.22);
      const y = window.innerHeight * 0.5;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.color = trailColors[i % trailColors.length];
      spark.style.setProperty('--dx', `${(Math.random() * 60 - 30).toFixed(1)}px`);
      spark.style.setProperty('--dy', `${(-40 - Math.random() * 40).toFixed(1)}px`);
      spark.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill="currentColor"/></svg>';
      spark.addEventListener('animationend', () => spark.remove());
      document.body.appendChild(spark);
    }, delay);
  });

  hop.addEventListener('animationend', () => hop.remove());
}

// Fades/rises .reveal, .reveal-fade, and .reveal-right elements in as they
// enter the viewport. The "hidden" state is applied here, in JS, rather than as a
// CSS default — so a visitor whose JS fails to load (or who has it
// disabled) sees every element in its normal, fully visible resting
// state instead of content that never appears. Fires once per element,
// then stops observing it.
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-fade, .reveal-right');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) return; // leave everything visible

  els.forEach(el => el.classList.add('is-hidden'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-hidden');
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  // threshold 0, not a fraction: a case-study chapter on a phone can be
  // 3,000px+ tall, so "15% of it in view" left its first screenful blank
  // and, on short phones, was never reached at all. Revealing as soon as
  // its top edge clears the bottom 8% of the viewport works at any height.
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

  els.forEach(el => io.observe(el));
}

function initStarfield() {
  const field = document.querySelector('.stars');
  if (!field) return;

  // Denser and a bit sparklier than before — leaning into the busy star
  // scatter from Jasmine's cosmic-creature moodboard reference. .stars is
  // fixed to the viewport (the same background stays put throughout the
  // whole site, rather than scrolling through a much taller canvas), so
  // density is based on viewport area, not document height.
  const area = window.innerWidth * window.innerHeight;
  const count = Math.min(300, Math.max(120, Math.round(area / 7000)));

  // A few soft pastel hues instead of plain white — leans coral/teal/
  // lavender, weighted toward coral, matching a moodboard reference
  // Jasmine shared (coral-pink stars, glowing teal clouds, deep indigo
  // night) more than the earlier gold-heavy mix.
  // Mostly white and periwinkle, like the sparkles on Jasmine's Carrd site,
  // with a few pops of the vivid rainbow.
  const STAR_COLORS = ['#ffffff', '#e2e7fc', '#e2e7fc', '#9aa9f4', '#dc7bf0', '#6cbeef'];

  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    star.className = 'star';

    const isBright = Math.random() < 0.2;
    const size = isBright ? 1.6 + Math.random() * 1.2 : 0.8 + Math.random() * 1;
    const maxOpacity = isBright ? 0.55 + Math.random() * 0.25 : 0.25 + Math.random() * 0.25;

    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty('--max-op', maxOpacity.toFixed(2));
    star.style.setProperty('--dur', `${(2.5 + Math.random() * 3).toFixed(2)}s`);
    star.style.setProperty('--delay', `${(Math.random() * 4).toFixed(2)}s`);
    star.style.setProperty('--star-color', STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]);

    frag.appendChild(star);
  }
  field.appendChild(frag);
}

// A custom cursor: the site's spark mark by default, growing into a
// spinning "CLICK ME!" badge over anything clickable. Only on real mouse
// pointers —
// touch devices have no cursor to replace, and forcing this on them would
// just hide the page's real interactive affordances for no benefit.
function initCustomCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // Only real action-triggering elements — a link that actually navigates
  // somewhere, a button, or an ARIA role="button" — get the "click me"
  // cursor. Static panels like .card/.sticker-card (never links, just
  // content) and plain text-entry fields (input/textarea/select/label —
  // clicking just focuses them to type, not an interaction) don't
  // qualify, even though they're hoverable/have their own styling.
  const CLICKABLE_SELECTOR = ['a[href]', 'button', '[role="button"]'].join(', ');

  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = `
    <div class="cursor-flash">
      <svg class="cursor-icon cursor-icon--star" viewBox="0 0 24 24">
        <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill="currentColor" />
      </svg>
      <svg class="cursor-icon cursor-icon--badge" viewBox="0 0 100 100">
        <defs>
          <path id="cursorBadgePath" d="M50,50 m-38,0 a38,38 0 1,0 76,0 a38,38 0 1,0 -76,0" />
        </defs>
        <circle cx="50" cy="50" r="38" />
        <circle class="cursor-badge-dot" cx="50" cy="50" r="4" fill="currentColor" />
        <text>
          <textPath href="#cursorBadgePath" startOffset="0%">CLICK ME! &#8226; CLICK ME! &#8226; </textPath>
        </text>
      </svg>
    </div>
  `;
  document.body.appendChild(cursor);
  // The flash's scale animation lives on its own wrapper, not on .cursor
  // itself — .cursor's transform is driven directly by mousemove below, and
  // the badge icon already has its own transform (the spin animation), so
  // a third thing fighting over the same property would glitch all three.
  const flash = cursor.querySelector('.cursor-flash');

  window.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    cursor.classList.toggle('is-pointer', !!e.target.closest(CLICKABLE_SELECTOR));
  }, { passive: true });

  // Hide it when the pointer leaves the window entirely (moves onto
  // browser chrome, another app, etc.) rather than leaving it stranded at
  // the last in-page position.
  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) cursor.style.opacity = '0';
  });
  document.addEventListener('mouseover', () => { cursor.style.opacity = '1'; });

  const BURST_COLORS = ['#dc7bf0', '#6cbeef', '#efd96e', '#90e369', '#b79ff4', '#eea663', '#7ce3bd'];
  const BURST_COUNT = 7;

  function spawnBurst(x, y) {
    for (let i = 0; i < BURST_COUNT; i++) {
      const angle = (i / BURST_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = 26 + Math.random() * 22;
      const spark = document.createElement('div');
      spark.className = 'cursor-burst';
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.color = BURST_COLORS[i % BURST_COLORS.length];
      spark.style.setProperty('--dx', `${(Math.cos(angle) * dist).toFixed(1)}px`);
      spark.style.setProperty('--dy', `${(Math.sin(angle) * dist).toFixed(1)}px`);
      spark.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill="currentColor"/></svg>';
      spark.addEventListener('animationend', () => spark.remove());
      document.body.appendChild(spark);
    }
  }

  document.addEventListener('click', (e) => {
    if (isCalm()) return;
    // Remove-reflow-readd so back-to-back clicks always restart the
    // animation instead of a second click landing mid-animation doing
    // nothing (same trick as the comet star's scroll pulse).
    flash.classList.remove('is-flashing');
    void flash.offsetWidth;
    flash.classList.add('is-flashing');
    spawnBurst(e.clientX, e.clientY);
  });
}

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    const setOpen = (open) => {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    // Escape closes the open menu and hands focus back to the button that
    // opened it, so keyboard users aren't left stranded inside it.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  const here = document.body.dataset.page;
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    if (a.dataset.page === here) a.classList.add('is-active');
  });
}

// The site is a single page (About/Projects/Playground/Contact are anchor
// sections, not separate URLs), so "which nav link is active" has to track
// scroll position instead of a per-page data-page match. No-ops on pages
// that don't have these section ids (the case-study pages), where the
// static match in initNav() above already highlights "Projects".
function initScrollSpy() {
  const sections = ['projects', 'about', 'playground', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  const links = document.querySelectorAll('.nav-links a[data-page]');
  const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;

  const setActive = (id) => {
    links.forEach(a => a.classList.toggle('is-active', a.dataset.page === id));
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting);
    if (!visible.length) return;
    const topmost = visible.reduce((a, b) => a.boundingClientRect.top <= b.boundingClientRect.top ? a : b);
    setActive(topmost.target.id);
  }, { rootMargin: `-${navH}px 0px -65% 0px`, threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

function initCometTrail() {
  const trail = document.querySelector('.comet-trail');
  const star = document.querySelector('.comet-star');
  if (!trail || !star) return;

  const svg = trail.querySelector('svg');
  const gradient = trail.querySelector('#trailGradient');
  const revealRect = trail.querySelector('#trailRevealRect');
  const fadeGradient = trail.querySelector('#trailFadeGradient');
  const fadeRect = trail.querySelector('#trailFadeRect');
  const FADE_PX = 100; // how long a stretch, just before the reveal boundary, the ribbon takes to fade to nothing

  const STEP = 12; // vertical scan resolution, px — finer steps make the relaxed curve smoother

  let samples = []; // sampled centerline, in document coordinates
  let totalLength = 0;

  // A single straight vertical line down the page, hugging the right edge
  // — no obstacle dodging, no sway, constant width throughout. Still
  // builds `samples` at the same STEP resolution and with the same shape
  // (x, y, width, normal, dist) the rest of this file (pointAtY, the star
  // tracking, the rainbow flow) reads, so nothing downstream needs to know
  // the path is straight now.
  function buildRibbon(w, h) {
    const isNarrow = w < 700;
    const width = isNarrow ? 11 : 20; // constant stroke width — nothing to widen at, since there are no turns
    const restFraction = 0.025; // how far in from the right edge the line sits — right up against the edge
    const centerX = w * (1 - restFraction) - width / 2;

    samples = [];
    for (let y = 0; y <= h; y += STEP) {
      samples.push({ x: centerX, y, width, nx: -1, ny: 0 });
    }
    if (samples[samples.length - 1].y < h) {
      samples.push({ x: centerX, y: h, width, nx: -1, ny: 0 });
    }

    samples[0].dist = 0;
    for (let i = 1; i < samples.length; i++) {
      samples[i].dist = samples[i - 1].dist + (samples[i].y - samples[i - 1].y);
    }
    totalLength = samples[samples.length - 1].dist || 1;

    window.__trailDebug = { samples: samples.map(p => ({ x: p.x, y: p.y, width: p.width })) };

    const fmt = n => n.toFixed(1);
    const left = centerX - width / 2;
    const right = centerX + width / 2;
    return `M ${fmt(left)} 0 L ${fmt(left)} ${fmt(h)} L ${fmt(right)} ${fmt(h)} L ${fmt(right)} 0 Z`;
  }

  const RAINBOW_REPEAT = 600; // px of one full color cycle, tiled via spreadMethod="reflect" — 25% longer than before, so the hue shifts 25% less per px of travel
  const RAINBOW_SPEED = 1.6; // how much faster the rainbow flows than you scroll
  const IDLE_FLOW_SPEED = 0.02; // px/ms the rainbow keeps drifting even at rest — a full cycle every ~24s
  const EASE = 0.5; // how quickly the star catches up to its scroll target — still enough glide to
  // feel alive rather than snapping instantly, but tight enough that it doesn't visibly lag behind
  const WOBBLE_X = 5, WOBBLE_Y = 3.5; // px — a small orbiting drift, so the star never sits perfectly still

  // Eased/wobbled star position. displayX is in document coordinates (X
  // doesn't depend on scroll, so no viewport-space equivalent is needed).
  // displayViewportY is different: it's the star's eased VIEWPORT-relative
  // Y, tracked separately rather than derived from pointAtY()'s result,
  // because that result is clamped to the document's real bounds
  // (0..docHeight) — necessary for X, but it would otherwise pin the star
  // at the very top/bottom edge of the frame instead of letting it
  // actually pass beyond it. Both null until the first tick, so that tick
  // can hard-set them (no glide-in from empty state).
  let displayX = null, displayViewportY = null;
  let idleFlowOffset = 0;
  let lastTick = null;

  function layout() {
    // Collapse first so .comet-trail's own (possibly stale) height isn't
    // counted in the measurement below — it's position:absolute, so its
    // height directly contributes to document.documentElement.scrollHeight.
    // The <svg> child needs the same treatment: its own height attribute
    // still overflows the zeroed-out wrapper (overflow:visible on
    // .comet-trail svg) and would still get counted otherwise. Skipping
    // this would create a feedback loop: once it grows to match a taller
    // page (e.g. one of the Playground panels), switching back to shorter
    // content could never shrink it, since every recalculation would just
    // measure its own leftover inflated height again.
    trail.style.height = '0';
    svg.setAttribute('height', 0);
    const docHeight = document.documentElement.scrollHeight;
    const w = window.innerWidth;

    trail.style.height = `${docHeight}px`;
    svg.setAttribute('width', w);
    svg.setAttribute('height', docHeight);
    svg.setAttribute('viewBox', `0 0 ${w} ${docHeight}`);
    // A short repeating band, not one gradient stretched over the whole
    // document — tick() then slides it continuously, so the rainbow
    // itself flows rather than sitting fixed to a document position.
    gradient.setAttribute('x1', '0'); gradient.setAttribute('y1', '0');
    gradient.setAttribute('x2', '0'); gradient.setAttribute('y2', RAINBOW_REPEAT);
    revealRect.setAttribute('width', w);
    fadeRect.setAttribute('width', w);
    fadeRect.setAttribute('height', docHeight);

    const d = buildRibbon(w, docHeight);

    svg.querySelectorAll('.trail-seg').forEach(el => el.remove());
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', d);
    el.setAttribute('class', 'trail-seg');
    el.setAttribute('mask', 'url(#trailFadeMask)');
    svg.appendChild(el);

    // The path geometry just changed (resize/font-load), so the eased
    // position from the old path is meaningless — reset it and let tick()
    // hard-snap to the new target on its next frame instead of gliding
    // across an unrelated shape.
    displayX = displayViewportY = null;
    tick(performance.now());
  }

  // Looks up the ribbon's x at a given document y (samples are already in
  // ascending-y order, one per scan row, so a binary search on y works
  // directly). Used instead of an arc-length lookup so the star's position
  // can be driven straight from "where should it sit in the viewport"
  // rather than "what fraction of the document have you scrolled" — a
  // heavily obstacle-dodging stretch of ribbon has more arc length per
  // pixel of page than a straight stretch, so an arc-length-fraction
  // mapping would let the star drift ahead of or behind where you're
  // actually reading, sometimes off-screen entirely.
  function pointAtY(targetY) {
    if (targetY <= samples[0].y) return samples[0];
    if (targetY >= samples[samples.length - 1].y) return samples[samples.length - 1];
    let lo = 0, hi = samples.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (samples[mid].y < targetY) lo = mid; else hi = mid;
    }
    const a = samples[lo], b = samples[hi];
    const f = (targetY - a.y) / ((b.y - a.y) || 1);
    return {
      x: a.x + (b.x - a.x) * f,
      y: targetY,
      width: a.width + (b.width - a.width) * f,
    };
  }

  // Paints one frame — called continuously by the rAF loop below (not just
  // on scroll), so the comet keeps drifting and the rainbow keeps flowing
  // even at rest, instead of freezing solid the instant scrolling stops.
  // Also called directly (not via the loop) from layout(), so a resize
  // repaints immediately instead of waiting on the next scheduled frame.
  // Small and positive on purpose: at the very top of the page (pct 0)
  // the star already sits just inside the frame, near the top edge —
  // there's something to see right from scrollY 0, rather than the star
  // starting fully off-screen and only becoming visible after scrolling.
  const TOP_MARGIN = 0.03;
  // Capped well short of the bottom edge (not a symmetric top/bottom
  // margin, and deliberately asymmetric with TOP_MARGIN) so the star
  // stays ahead of your scroll position — leading into the content below
  // rather than drifting down to trail behind wherever you've already
  // read. Past 1 (the viewport's bottom edge) on purpose — at the very
  // bottom of the page the star exits off-screen below, rather than
  // parking in view forever once there's nothing left to lead into.
  const AHEAD_CAP = 1.08;
  // Pulls the reveal back from the star's exact center (not past it) so the
  // ribbon's end always sits tucked under the star's own glow/body instead
  // of poking out past it. Comfortably within the star's radius (52px
  // wide desktop, 34px mobile — fixed, doesn't vary), so it stays covered.
  const REVEAL_PULLBACK_PX = 12;
  // A small dead zone at the very top: the star (already visible, near the
  // top edge, per TOP_MARGIN) holds that resting position through the
  // first few pixels of scroll, rather than starting to creep the instant
  // the page moves at all — movement proper only kicks in past this point.
  const SCROLL_START_PX = 5;

  function tick(now) {
    if (samples.length) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = Math.max(0, window.scrollY - SCROLL_START_PX);
      const pct = max > SCROLL_START_PX ? Math.min(1, scrolled / (max - SCROLL_START_PX)) : 0;
      // Anchored to "where in the viewport should the star sit" (off
      // frame above at the very start of the page, off frame below by the
      // very end, sliding through the visible band ahead of center in
      // between) rather than "what % of the document have you scrolled"
      // — guarantees the star tracks ahead of your reading position
      // regardless of how much the ribbon's actual arc length is
      // stretched by dodging.
      const topY = window.innerHeight * TOP_MARGIN;
      const bottomY = window.innerHeight * AHEAD_CAP;
      const viewportY = topY + (bottomY - topY) * pct;
      const target = pointAtY(window.scrollY + viewportY);

      if (displayX === null) {
        displayX = target.x;
        displayViewportY = viewportY;
      } else {
        // Ease toward the scroll target rather than snapping straight to
        // it, so the star glides/trails behind fast scrolling like
        // something with a little inertia, instead of teleporting.
        displayX += (target.x - displayX) * EASE;
        // Eased toward the raw (unclamped) viewportY, not toward
        // target.y - scrollY — target.y is clamped to the document's real
        // bounds by pointAtY(), which would otherwise pin the star at the
        // very top/bottom edge of the frame instead of letting it actually
        // pass beyond it.
        displayViewportY += (viewportY - displayViewportY) * EASE;
      }

      // A slow, gentle orbit layered on top of the eased position — keeps
      // the star lightly adrift even when scroll is perfectly still,
      // instead of parking dead motionless.
      const t = now / 1000;
      const wobbleX = Math.sin(t * 0.9) * WOBBLE_X;
      const wobbleY = Math.cos(t * 0.6) * WOBBLE_Y;

      const x = displayX + wobbleX;
      // -20px so the star sits higher than its raw tracked position —
      // applied here (not just in the transform below) so the reveal
      // calculation further down, which reads screenY too, shifts up
      // right along with it and the trail's end stays covered by the star
      // instead of drifting out from under it.
      const screenY = displayViewportY + wobbleY - 20;
      // Fixed size — the star itself never scales (only its glow pulses,
      // in CSS). It used to grow/shrink with the ribbon's stroke width at
      // that point; kept simple and constant instead.
      star.style.transform = `translate(${x.toFixed(1)}px, ${screenY.toFixed(1)}px) translate(-50%, -50%)`;

      // Slide the repeating rainbow band with scroll position, plus a
      // constant slow drift of its own, so the colors keep flowing even
      // while the page sits still. Modulo keeps the offset bounded.
      const dt = lastTick === null ? 0 : now - lastTick;
      idleFlowOffset = (idleFlowOffset + dt * IDLE_FLOW_SPEED) % RAINBOW_REPEAT;
      const offset = (window.scrollY * RAINBOW_SPEED + idleFlowOffset) % RAINBOW_REPEAT;
      gradient.setAttribute('gradientTransform', `translate(0, ${-offset})`);

      // Reveal the ribbon up to just under the star's actual rendered
      // position — window.scrollY + screenY is the exact document-space
      // equivalent of the same screenY used to draw the star above, pulled
      // back by REVEAL_PULLBACK_PX so the ribbon's end stays covered by
      // the star's own body rather than sticking out past it. At rest
      // (TOP_MARGIN, near the top edge) this already comes out positive,
      // so a bit of trail is visible right from scrollY 0, then grows in
      // step with the star as you scroll.
      const docHeight = document.documentElement.scrollHeight;
      const revealY = window.scrollY + screenY - REVEAL_PULLBACK_PX;
      const clampedReveal = Math.min(docHeight, Math.max(0, revealY));
      revealRect.setAttribute('height', clampedReveal);

      // Tapers the ribbon to transparent over the FADE_PX stretch just
      // before the reveal boundary — see the fade gradient's own comment
      // in index.html for how the pad-spread endpoints do the rest.
      fadeGradient.setAttribute('y1', clampedReveal - FADE_PX);
      fadeGradient.setAttribute('y2', clampedReveal);
    }
    lastTick = now;
  }

  // The one persistent rAF chain — started once below, in initCometTrail,
  // never re-started by layout()/resize (that would stack up duplicate
  // chains, each repainting every frame for no reason).
  function loop(now) {
    tick(now);
    requestAnimationFrame(loop);
  }

  // A quick glow pulse on the star each time a new scroll gesture begins —
  // not on every scroll frame (that would just read as a constant throb),
  // and not via re-adding a class that's already present (CSS animations
  // only (re)play when the animation-name actually (re)attaches, so a
  // forced reflow between remove and re-add is what makes it restart).
  // is-pulsing has to come back off once the one-shot burst finishes —
  // .is-pulsing .star-glyph overrides the star's normal *continuous*
  // glow-pulse animation for as long as the class is present, so leaving
  // it on would silently kill the star's resting glow after the very
  // first scroll of the session.
  let scrollActive = false;
  let scrollIdleTimer;
  function pulseStar() {
    star.classList.remove('is-pulsing');
    void star.offsetWidth; // force reflow so the next class add restarts the animation
    star.classList.add('is-pulsing');
  }
  star.querySelector('.star-glyph').addEventListener('animationend', (e) => {
    if (e.animationName === 'scroll-pulse') star.classList.remove('is-pulsing');
  });

  // The persistent loop() above already repaints every frame regardless of
  // scroll, so this listener only needs to track "is a scroll gesture
  // active" for the pulse effect — not trigger a repaint itself.
  window.addEventListener('scroll', () => {
    if (!scrollActive) {
      scrollActive = true;
      pulseStar();
    }
    clearTimeout(scrollIdleTimer);
    scrollIdleTimer = setTimeout(() => { scrollActive = false; }, 150);
  }, { passive: true });

  window.addEventListener('resize', layout);
  window.addEventListener('load', layout);
  if (document.fonts && document.fonts.ready) {
    // web-font swap can reflow heading/paragraph heights after first layout
    document.fonts.ready.then(layout);
  }
  layout();
  requestAnimationFrame(loop);

  star.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


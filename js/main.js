// Shared behavior: mobile nav toggle, active-link marking, the
// home-page comet trail (only runs where the markup for it exists), and
// the custom star/"click me" cursor.

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollSpy();
  initCometTrail();
  initStarfield();
  initCustomCursor();
  initScrollReveal();
  initPlaygroundTabs();
  initTiltCards();
  initRabbitEgg();
  initConstellation();
});

// A magnetic tilt toward the cursor on .card/.sticker-card — the card
// leans as if it were a rigid plate pivoting under your pointer, on top
// of (not instead of) each one's existing lift/scale hover. Only on real
// mouse pointers — touch has no continuous hover position to tilt
// against. Sets --tilt-x/--tilt-y (consumed inside the .card:hover /
// .sticker-card:hover transform in CSS) rather than transform directly,
// so this never fights the CSS transition already driving the lift.
function initTiltCards() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const MAX_TILT = 8; // degrees at the card's edge; halved near its center

  document.querySelectorAll('.card, .sticker-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
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

// Projects' constellation map: hovering/focusing any project card
// brightens the decorative constellation lines and stars behind the whole
// section (one shared .is-active toggle, not per-card proximity math) —
// the "nearby stars glow, lines illuminate" part of the hover brief. A
// no-op if the constellation markup isn't on the page.
function initConstellation() {
  const section = document.querySelector('.constellation');
  if (!section) return;
  const cards = section.querySelectorAll('.constellation-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => section.classList.add('is-active'));
    card.addEventListener('mouseleave', () => section.classList.remove('is-active'));
    card.addEventListener('focus', () => section.classList.add('is-active'));
    card.addEventListener('blur', () => section.classList.remove('is-active'));
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
    // writing "rabbit" into the Doodle Mail message box shouldn't launch
    // a hop mid-sentence.
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
  const colors = ['#f0a8c9', '#b3dcf0', '#eddb9c', '#bfe8d4', '#d6c6f0', '#f7d4ab', '#a8e0cf'];
  const hop = document.createElement('div');
  hop.className = 'rabbit-hop';
  hop.setAttribute('aria-hidden', 'true');
  // Same line-art rabbit silhouette used elsewhere on the site — no emoji.
  hop.innerHTML = `
    <svg class="rabbit-hop-glyph" viewBox="0 0 60 60" fill="none">
      <path d="M20,25 C15,10 8,0 15,2 C24,5 26,18 24,28" stroke="#d6c6f0" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M32,25 C30,8 26,-2 34,2 C41,6 40,18 36,28" stroke="#d6c6f0" stroke-width="3" fill="none" stroke-linecap="round" />
      <ellipse cx="30" cy="45" rx="24" ry="18" stroke="#d6c6f0" stroke-width="3" fill="none" />
      <circle cx="22" cy="42" r="2.5" fill="#d6c6f0" />
      <circle cx="34" cy="42" r="2.5" fill="#d6c6f0" />
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

// Fades/rises .reveal and .reveal-fade elements in as they enter the
// viewport. The "hidden" state is applied here, in JS, rather than as a
// CSS default — so a visitor whose JS fails to load (or who has it
// disabled) sees every element in its normal, fully visible resting
// state instead of content that never appears. Fires once per element,
// then stops observing it.
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-fade');
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
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

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
  const STAR_COLORS = ['#f0a89a', '#f0a89a', '#7fd9e6', '#d6c6f0', '#f0a8c9', '#e0bd5a'];

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

  const CLICKABLE_SELECTOR = [
    'a', 'button', 'input', 'textarea', 'select', 'label',
    '.btn', '.card', '.planet', '.sticker-card', '.view-case',
    '[role="button"]', '[onclick]',
  ].join(', ');

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

  const BURST_COLORS = ['#f0a8c9', '#b3dcf0', '#eddb9c', '#bfe8d4', '#d6c6f0', '#f7d4ab', '#a8e0cf'];
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

// The site is a single page (About/Projects/Playground/Contact are anchor
// sections, not separate URLs), so "which nav link is active" has to track
// scroll position instead of a per-page data-page match. No-ops on pages
// that don't have these section ids (the case-study pages), where the
// static match in initNav() above already highlights "Projects".
function initScrollSpy() {
  const sections = ['about', 'projects', 'playground', 'contact']
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

// =========================================================
// Playground tabs — a small local tab pattern (Experiments / Doodle Mail)
// scoped entirely inside #playground, following the WAI-ARIA APG tabs
// pattern (roving tabindex, arrow-key navigation, automatic activation).
// Independent of the site-wide #about/#projects/#playground/#contact
// scroll-spy nav — this never touches the URL or scroll position.
// =========================================================
function initPlaygroundTabs() {
  const tabs = Array.from(document.querySelectorAll('.playground-tab'));
  const panels = Array.from(document.querySelectorAll('.playground-panel'));
  if (!tabs.length) return;

  let doodleMailReady = false;

  function activate(tab, { focus = true } = {}) {
    tabs.forEach(t => {
      const selected = t === tab;
      t.classList.toggle('is-active', selected);
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(p => { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
    if (focus) tab.focus();

    // The doodle canvas needs real, visible layout dimensions to size
    // itself against — initializing it while its panel is still [hidden]
    // (0×0) would leave it permanently the wrong size. Set up lazily, once,
    // the first time this tab is actually shown.
    if (tab.id === 'tab-doodlemail' && !doodleMailReady) {
      doodleMailReady = true;
      initDoodleMail();
    }
    // The comet trail only recomputes what it needs to dodge on
    // resize/load — nudge it to re-lay-out now that this panel's content
    // just changed the page's visible obstacles.
    window.dispatchEvent(new Event('resize'));
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(tab, { focus: false }));
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); activate(next); }
    });
  });
}

// =========================================================
// Doodle Mail — draw-and-send guestbook. Everything here (canvas drawing,
// undo, eraser, clear) is fully functional client-side. Only the actual
// emailing depends on EmailJS, a small serverless send-from-the-browser
// service — see EMAILJS_CONFIG below. The SDK is loaded lazily, from
// EmailJS's CDN, only at the moment someone actually presses Send, so
// visitors who never open this tab (or who just doodle without sending)
// never pay for that request. Until Jasmine drops her own EmailJS keys in
// below, Send shows an honest "not set up yet" message rather than
// silently failing or pretending to succeed — same pattern as the
// Contact section's unwired form.
// =========================================================

// Fill these in from a free https://www.emailjs.com account: an Email
// Service, an Email Template (with template params from_name, from_email,
// message, doodle_image — map doodle_image to a dynamic attachment in the
// template, and set the template's "To" address to Jasmine's own inbox
// there, not here), and the account's Public Key.
const EMAILJS_CONFIG = {
  publicKey: '[TBD: EmailJS public key]',
  serviceId: '[TBD: EmailJS service ID]',
  templateId: '[TBD: EmailJS template ID]',
};

function isEmailJSConfigured() {
  return Object.values(EMAILJS_CONFIG).every(v => !v.startsWith('[TBD'));
}

// --- Per-browser daily send limit ---
// This is a courtesy speed bump, not real spam protection — it lives in
// localStorage, so anyone can clear it, use a private window, or switch
// browsers to get around it. It's here to stop a single well-behaved
// visitor from accidentally (or a bored one from casually) firing off a
// pile of doodles in one sitting, not to stop a determined spammer.
// Actual abuse protection needs to live server-side — EmailJS's own
// account dashboard has its own monthly send quota and can require
// reCAPTCHA on top of it; set those up there once EMAILJS_CONFIG is
// filled in, rather than relying on this.
const DOODLE_DAILY_LIMIT = 3;
const DOODLE_SEND_LOG_KEY = 'doodlemail_sends';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getDoodleSendCount() {
  try {
    const raw = JSON.parse(localStorage.getItem(DOODLE_SEND_LOG_KEY) || '{}');
    return raw.day === todayKey() ? (raw.count || 0) : 0;
  } catch (_) {
    return 0; // localStorage unavailable (e.g. some private-browsing modes) — don't block sending over it
  }
}

function recordDoodleSend() {
  try {
    localStorage.setItem(DOODLE_SEND_LOG_KEY, JSON.stringify({ day: todayKey(), count: getDoodleSendCount() + 1 }));
  } catch (_) { /* nothing to persist to — the limit just won't carry across reloads this session */ }
}

let emailjsLoadPromise = null;
function loadEmailJS() {
  if (window.emailjs) return Promise.resolve();
  if (emailjsLoadPromise) return emailjsLoadPromise;
  emailjsLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('EmailJS failed to load'));
    document.head.appendChild(script);
  });
  return emailjsLoadPromise;
}

function initDoodleMail() {
  const canvas = document.getElementById('doodleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const colorInput = document.getElementById('doodleColor');
  const sizeInput = document.getElementById('doodleSize');
  const eraserBtn = document.getElementById('doodleEraser');
  const undoBtn = document.getElementById('doodleUndo');
  const clearBtn = document.getElementById('doodleClear');
  const form = document.getElementById('doodlemailForm');
  const sendBtn = document.getElementById('doodleSendBtn');
  const sendLabel = sendBtn.querySelector('.doodle-send-label');
  const statusEl = document.getElementById('doodlemailStatus');

  let drawing = false;
  let erasing = false;
  let hasDrawn = false;
  let cssW = 0, cssH = 0;
  const history = []; // snapshots (PNG data URLs) captured before each stroke, for Undo
  const HISTORY_LIMIT = 25;

  // Sizes the canvas's backing store to match how big it's actually
  // rendered (times devicePixelRatio, capped, for crisp strokes without an
  // unbounded texture on very high-DPI screens), and restores whatever was
  // drawn before — so a resize/orientation-change doesn't wipe the page.
  function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return; // still hidden — nothing to size yet
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const prevData = (canvas.width && canvas.height && hasDrawn) ? canvas.toDataURL('image/png') : null;
    cssW = rect.width;
    cssH = rect.height;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (prevData) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, cssW, cssH);
      img.src = prevData;
    }
  }

  function pushHistory() {
    history.push(canvas.toDataURL('image/png'));
    if (history.length > HISTORY_LIMIT) history.shift();
    undoBtn.disabled = false;
  }

  function undo() {
    if (!history.length) return;
    const dataUrl = history.pop();
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.drawImage(img, 0, 0, cssW, cssH);
    };
    img.src = dataUrl;
    if (!history.length) undoBtn.disabled = true;
  }

  function clearCanvas() {
    if (!hasDrawn) return;
    pushHistory();
    ctx.clearRect(0, 0, cssW, cssH);
    hasDrawn = false;
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  let lastX = 0, lastY = 0;

  function markStart(x, y) {
    ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
    ctx.fillStyle = colorInput.value;
    ctx.beginPath();
    ctx.arc(x, y, Number(sizeInput.value) / 2, 0, Math.PI * 2);
    ctx.fill();
    hasDrawn = true;
  }

  function strokeTo(x, y) {
    ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
    ctx.strokeStyle = colorInput.value;
    ctx.lineWidth = Number(sizeInput.value);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x; lastY = y;
    hasDrawn = true;
  }

  canvas.addEventListener('pointerdown', (e) => {
    drawing = true;
    canvas.setPointerCapture(e.pointerId);
    pushHistory();
    const { x, y } = getPos(e);
    lastX = x; lastY = y;
    markStart(x, y);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    const { x, y } = getPos(e);
    strokeTo(x, y);
  });

  function stopDrawing(e) {
    if (!drawing) return;
    drawing = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) { /* already released */ }
  }
  canvas.addEventListener('pointerup', stopDrawing);
  canvas.addEventListener('pointercancel', stopDrawing);

  eraserBtn.addEventListener('click', () => {
    erasing = !erasing;
    eraserBtn.classList.toggle('is-active', erasing);
    eraserBtn.setAttribute('aria-pressed', String(erasing));
  });

  undoBtn.addEventListener('click', undo);
  clearBtn.addEventListener('click', clearCanvas);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitCanvas, 150);
  });

  fitCanvas();

  // Reflects today's send count in the UI: disables Send and swaps in a
  // "come back tomorrow" message once DOODLE_DAILY_LIMIT is reached, and
  // otherwise leaves a quiet reminder of how many are left. Returns
  // whether the limit has been hit, so the submit handler can gate on it.
  function updateDoodleLimitUI() {
    const remaining = DOODLE_DAILY_LIMIT - getDoodleSendCount();
    if (remaining <= 0) {
      sendBtn.disabled = true;
      sendLabel.textContent = "That's the limit for today ✦";
      statusEl.textContent = `You've sent ${DOODLE_DAILY_LIMIT} doodles today — thank you! Come back tomorrow for more.`;
      statusEl.className = 'doodlemail-status';
      return true;
    }
    sendBtn.disabled = false;
    sendLabel.textContent = 'Send Me Your Doodle';
    statusEl.textContent = remaining < DOODLE_DAILY_LIMIT
      ? `${remaining} of ${DOODLE_DAILY_LIMIT} doodles left today.`
      : '';
    statusEl.className = 'doodlemail-status';
    return false;
  }

  updateDoodleLimitUI();

  // --- Send ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (updateDoodleLimitUI()) return; // at today's limit — message is already showing

    if (!hasDrawn) {
      statusEl.textContent = "The page is still blank — draw something first!";
      statusEl.className = 'doodlemail-status is-error';
      return;
    }

    if (!isEmailJSConfigured()) {
      statusEl.textContent = "Doodle sending isn't set up on this site yet — but no worries, your drawing is staying right here.";
      statusEl.className = 'doodlemail-status is-error';
      return;
    }

    sendBtn.disabled = true;
    sendBtn.classList.add('is-loading');
    sendLabel.textContent = 'Sending your doodle…';
    statusEl.textContent = '';
    statusEl.className = 'doodlemail-status';

    try {
      await loadEmailJS();
      window.emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
      await window.emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
        from_name: document.getElementById('doodleName').value || 'Someone from the cosmos',
        from_email: document.getElementById('doodleEmail').value || 'not provided',
        message: document.getElementById('doodleMessage').value || '(no message)',
        doodle_image: canvas.toDataURL('image/png'),
      });

      recordDoodleSend();

      sendBtn.classList.remove('is-loading');
      sendBtn.classList.add('is-success');
      sendLabel.textContent = 'Doodle sent! ✦';
      statusEl.textContent = "Your doodle just landed in Jasmine's cosmic guestbook. Thank you!";
      statusEl.className = 'doodlemail-status is-success';
      spawnDoodleBurst(sendBtn);

      setTimeout(() => {
        sendBtn.classList.remove('is-success');
        updateDoodleLimitUI(); // re-enables Send and resets the label, unless this send just hit the daily cap
      }, 4000);
    } catch (err) {
      sendBtn.classList.remove('is-loading');
      sendBtn.disabled = false;
      sendLabel.textContent = 'Send Me Your Doodle';
      statusEl.textContent = "That didn't go through — mind trying again in a moment?";
      statusEl.className = 'doodlemail-status is-error';
    }
  });
}

// A small celebratory sparkle burst from the Send button on success —
// deliberately separate from the custom cursor's own burst effect (that
// one only exists on hover-capable pointers), so this still fires on the
// touch devices most doodles will actually come from.
function spawnDoodleBurst(originEl) {
  const rect = originEl.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const colors = ['#f0a8c9', '#b3dcf0', '#eddb9c', '#bfe8d4', '#d6c6f0', '#f7d4ab', '#a8e0cf'];
  const count = 10;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const dist = 40 + Math.random() * 34;
    const spark = document.createElement('div');
    spark.className = 'doodle-burst';
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.color = colors[i % colors.length];
    spark.style.setProperty('--dx', `${(Math.cos(angle) * dist).toFixed(1)}px`);
    spark.style.setProperty('--dy', `${(Math.sin(angle) * dist).toFixed(1)}px`);
    spark.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill="currentColor"/></svg>';
    spark.addEventListener('animationend', () => spark.remove());
    document.body.appendChild(spark);
  }
}

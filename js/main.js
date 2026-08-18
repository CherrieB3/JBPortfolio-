// Shared behavior: mobile nav toggle, active-link marking, and the
// home-page comet trail (only runs where the markup for it exists).

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollSpy();
  initCometTrail();
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

  const TAPER_FRACTION = 0.09; // fraction of total length eased to a point at each end — a real comet
  // tail dissolves gradually rather than wedging to a point in the last few percent
  const STEP = 12; // vertical scan resolution, px — finer steps make the relaxed curve smoother

  const OBSTACLE_SELECTOR = [
    'main h1', 'main h2', 'main h3', 'main p', 'main a', 'main .card',
    'main .mascot-wrap', 'main .avatar-frame', 'main .galaxy', 'main .sticker-card',
    'main form', 'main .rabbit-icon', 'main .lines',
    'footer h2', 'footer .footer-email', 'footer .socials',
  ].join(', ');

  // Deterministic per-page "random": same page always produces the same
  // curve on every reload.
  function seededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }
  function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h || 1;
  }
  const rand = seededRandom(hashString(document.body.dataset.page || 'page'));
  // Drawn once, not inside buildRibbon: layout() re-runs on resize, on
  // 'load', and once fonts are ready, and buildRibbon runs again each
  // time. Rolling freq/phase from `rand` on every call would advance the
  // shared sequence each time and give a different curve after every
  // relayout, breaking the "same shape every load" guarantee.
  const freq = 0.35 + rand() * 0.25; // slow, gentle undulation down the page
  // Start dead-center (swinging left or right at random) rather than at an
  // arbitrary phase: the ribbon is also zero-width at y=0 (start of the
  // taper), so if the sine's starting point is far from center the path
  // has to sprint sideways before it's even visible — that sprint is what
  // reads as a knot once it fattens into full width a few rows later.
  const phase = rand() < 0.5 ? 0 : Math.PI;

  let samples = []; // sampled centerline, in document coordinates
  let totalLength = 0;

  // Content blocks the trail should route around, in document coordinates.
  function collectObstacles(pad, lookahead) {
    const rects = [];
    document.querySelectorAll(OBSTACLE_SELECTOR).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      rects.push({
        // Extra clearance above the obstacle only: the ribbon can only
        // move sideways at a capped rate per row, so if the constraint
        // only started exactly at the obstacle's edge, a curve already
        // swinging back toward center right at that boundary has no room
        // to react and grazes the text before the cap can pull it clear.
        // Starting the constraint a bit earlier gives it that room.
        top: r.top + window.scrollY - pad - (lookahead || 0),
        bottom: r.bottom + window.scrollY + pad,
        left: r.left - pad,
        right: r.right + pad,
      });
    });
    return rects;
  }

  // Free horizontal spans at a given y, after subtracting every obstacle
  // whose vertical range covers it.
  function freeIntervals(y, obstacles, w) {
    let intervals = [[0, w]];
    for (const o of obstacles) {
      if (y < o.top || y > o.bottom) continue;
      const next = [];
      for (const [s, e] of intervals) {
        if (o.right <= s || o.left >= e) { next.push([s, e]); continue; }
        if (o.left > s) next.push([s, o.left]);
        if (o.right < e) next.push([o.right, e]);
      }
      intervals = next;
    }
    return intervals.filter(([s, e]) => e - s > 1);
  }

  function clampToFree(x, intervals, fallback) {
    if (!intervals.length) return fallback;
    for (const [s, e] of intervals) {
      if (x >= s && x <= e) return x;
    }
    // Score each gutter by width, but heavily penalize how far it is from
    // the ribbon's actual current position (fallback) — distance dominates
    // width by a wide margin. The ribbon now rests in a narrow lane near
    // one edge with only a slight wave, so a blocked obstacle typically
    // leaves one huge gutter open on the far side of the page; a mild
    // distance penalty (as used for the old edge-to-edge sweep, where a
    // wide graceful detour was the goal) lets that raw width win and drags
    // the ribbon away from the edge it's supposed to be hugging. Weighting
    // distance this heavily means a narrow gutter right next to the ribbon
    // beats a huge one far away, and — just as importantly — keeps every
    // pass's decision anchored to continuity, so a later smoothing pass
    // can't independently re-pick a distant gutter and reintroduce a jump
    // an earlier pass already resolved.
    let best = intervals[0], bestScore = -Infinity;
    for (const iv of intervals) {
      const w = iv[1] - iv[0];
      const dist = fallback < iv[0] ? iv[0] - fallback : fallback > iv[1] ? fallback - iv[1] : 0;
      const score = w - dist * 5;
      if (score > bestScore) { bestScore = score; best = iv; }
    }
    if (fallback >= best[0] && fallback <= best[1]) return fallback;
    // Land as close as possible to the original desired x within the
    // chosen gutter, not its midpoint. The ribbon now rests in a narrow
    // lane near one edge with only a slight wave, so a blocked obstacle
    // typically leaves one huge open gutter on the other side — taking
    // its midpoint would drag the ribbon halfway across the page just to
    // clear a small obstruction. Clamping the smoothly-varying desired x
    // into the interval keeps the detour as small as it can be, and stays
    // stable since desired doesn't jump between rows.
    const inset = Math.min(24, (best[1] - best[0]) / 2);
    return Math.max(best[0] + inset, Math.min(best[1] - inset, x));
  }

  // Scan down the page in bands, hugging the right edge as a side rail with
  // only a slight wave to it (not the old edge-to-edge sweep), steering
  // around any content block that's in the way.
  function buildRibbon(w, h) {
    const isNarrow = w < 700;
    const pad = isNarrow ? 20 : 44; // clearance kept from every obstacle
    const width = isNarrow ? 11 : 20; // constant ribbon thickness
    const edgePad = isNarrow ? 26 : 64; // clearance kept from the viewport edges
    const amp = isNarrow ? 7 : 13; // a slight wave, not a full-width swing
    const laneX = w - edgePad - width / 2; // resting position, hugging the right edge
    const centerX = laneX - amp; // shift inward so the wave's outer edge still respects edgePad

    // Cap how far the centerline can move sideways in one scan row. Without
    // this, a steep point on the sine (or a sudden obstacle-dodge jump to a
    // different gutter) can swing the path further sideways than down —
    // and once the turn is tighter than the ribbon's own half-width, the
    // left/right offset edges cross and the ribbon self-intersects into a
    // little knot instead of curving. Capping the per-row delta forces
    // every direction change to unfurl gradually, which is what actually
    // reads as a clean swirl instead of a scribble.
    const maxDeltaPerStep = STEP * 2.2;

    // Obstacles get extra warning room above their top edge, sized to how
    // far the capped ribbon can travel in a handful of rows — enough to
    // reach clear of a typical obstacle's gutter before actually reaching
    // it, instead of arriving at the boundary mid-swing and grazing it.
    const obstacles = collectObstacles(pad, maxDeltaPerStep * 4);

    const raw = [];
    let lastX = centerX;
    for (let y = 0; y <= h; y += STEP) {
      const desired = centerX + amp * Math.sin((y / Math.max(h, 1)) * Math.PI * 2 * freq + phase);
      const intervals = freeIntervals(y, obstacles, w);
      const x = clampToFree(desired, intervals, lastX);
      lastX = Math.max(lastX - maxDeltaPerStep, Math.min(lastX + maxDeltaPerStep, x));
      raw.push({ x: lastX, y });
    }
    if (raw[raw.length - 1].y < h) raw.push({ x: raw[raw.length - 1].x, y: h });

    // Relax the curve toward smoothness in several rounds, re-clamping to the
    // free gutters after each pass — this rounds off every step left by
    // obstacle-hugging into a continuous, springy curve with no hard corners,
    // without letting the curve drift back into content.
    let points = raw;
    for (let pass = 0; pass < 9; pass++) {
      points = points.map((p, i) => {
        const win = points.slice(Math.max(0, i - 11), Math.min(points.length, i + 12));
        const x = win.reduce((s, q) => s + q.x, 0) / win.length;
        return { x: clampToFree(x, freeIntervals(p.y, obstacles, w), x), y: p.y };
      });
    }

    // The relax passes above re-clamp each point in isolation, so a point
    // that averaged into an obstacle can still snap straight to that
    // obstacle's far gutter edge in one step — the same sharp-turn problem
    // the raw pass's delta cap was meant to prevent, reintroduced by
    // smoothing. Walk the relaxed curve once more, sequentially, so no
    // consecutive pair is ever further apart than the cap allows.
    let seqX = points[0].x;
    points = points.map((p, i) => {
      if (i === 0) return p;
      const bounded = Math.max(seqX - maxDeltaPerStep, Math.min(seqX + maxDeltaPerStep, p.x));
      seqX = clampToFree(bounded, freeIntervals(p.y, obstacles, w), seqX);
      return { x: seqX, y: p.y };
    });

    // A light final polish: the cap above can still leave a single-row
    // spike-and-rebound where it kicked in for just one row (the fastest
    // the ribbon is allowed to react to a newly-blocked gutter). A small
    // moving average erases that without undoing the broad shape.
    for (let pass = 0; pass < 3; pass++) {
      points = points.map((p, i) => {
        const win = points.slice(Math.max(0, i - 2), Math.min(points.length, i + 3));
        const x = win.reduce((s, q) => s + q.x, 0) / win.length;
        return { x: clampToFree(x, freeIntervals(p.y, obstacles, w), x), y: p.y };
      });
    }

    // The polish pass above clamps each point in isolation again too, so
    // right at a boundary where an obstacle starts or ends — the exact
    // spot the averaging window straddles — it can re-pick a completely
    // different gutter and reintroduce the same jump the sequential pass
    // upstream already fixed. Walk it sequentially one more time.
    seqX = points[0].x;
    points = points.map((p, i) => {
      if (i === 0) return p;
      const bounded = Math.max(seqX - maxDeltaPerStep, Math.min(seqX + maxDeltaPerStep, p.x));
      seqX = clampToFree(bounded, freeIntervals(p.y, obstacles, w), seqX);
      return { x: seqX, y: p.y };
    });

    samples = points;

    samples[0].dist = 0;
    for (let i = 1; i < samples.length; i++) {
      const dx = samples[i].x - samples[i - 1].x;
      const dy = samples[i].y - samples[i - 1].y;
      samples[i].dist = samples[i - 1].dist + Math.hypot(dx, dy);
    }
    totalLength = samples[samples.length - 1].dist || 1;

    samples.forEach((p, i) => {
      const prev = samples[Math.max(0, i - 1)];
      const next = samples[Math.min(samples.length - 1, i + 1)];
      const tx = next.x - prev.x, ty = next.y - prev.y;
      const len = Math.hypot(tx, ty) || 1;
      p.nx = -ty / len;
      p.ny = tx / len;

      const gt = p.dist / totalLength;
      // Smoothstep, not a linear ramp, so the tail thins with a gentle curve
      // (fast to a point) rather than a straight wedge.
      const smoothstep = t => t * t * (3 - 2 * t);
      const endTaper = gt < TAPER_FRACTION
        ? smoothstep(gt / TAPER_FRACTION)
        : gt > 1 - TAPER_FRACTION
          ? smoothstep((1 - gt) / TAPER_FRACTION)
          : 1;
      p.width = width * endTaper;
    });

    const leftPts = samples.map(p => ({ x: p.x + p.nx * p.width / 2, y: p.y + p.ny * p.width / 2 }));
    const rightPts = samples.slice().reverse().map(p => ({ x: p.x - p.nx * p.width / 2, y: p.y - p.ny * p.width / 2 }));

    const fmt = n => n.toFixed(1);
    // Catmull-Rom -> cubic bezier, so the outline is a true curve rather
    // than a polyline through the sample points.
    function curveThrough(pts) {
      const cmds = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i === 0 ? 0 : i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
        const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
        cmds.push(`C ${fmt(c1x)} ${fmt(c1y)}, ${fmt(c2x)} ${fmt(c2y)}, ${fmt(p2.x)} ${fmt(p2.y)}`);
      }
      return cmds.join(' ');
    }

    window.__trailDebug = { samples: samples.map(p => ({ x: p.x, y: p.y })), obstacles };

    return `M ${fmt(leftPts[0].x)} ${fmt(leftPts[0].y)} ${curveThrough(leftPts)} `
      + `L ${fmt(rightPts[0].x)} ${fmt(rightPts[0].y)} ${curveThrough(rightPts)} Z`;
  }

  const RAINBOW_REPEAT = 480; // px of one full color cycle, tiled via spreadMethod="repeat"
  const RAINBOW_SPEED = 1.6; // how much faster the rainbow flows than you scroll
  const IDLE_FLOW_SPEED = 0.02; // px/ms the rainbow keeps drifting even at rest — a full cycle every ~24s
  const EASE = 0.1; // how quickly the star catches up to its scroll target — <1 so it glides, not snaps
  const WOBBLE_X = 5, WOBBLE_Y = 3.5; // px — a small orbiting drift, so the star never sits perfectly still

  // Eased/wobbled star position, in document coordinates. null until the
  // first tick, so that tick can hard-set it (no glide-in from empty state).
  let displayX = null, displayY = null;
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

    const d = buildRibbon(w, docHeight);

    svg.querySelectorAll('.trail-seg').forEach(el => el.remove());
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', d);
    el.setAttribute('class', 'trail-seg');
    svg.appendChild(el);

    // The path geometry just changed (resize/font-load), so the eased
    // position from the old path is meaningless — reset it and let tick()
    // hard-snap to the new target on its next frame instead of gliding
    // across an unrelated shape.
    displayX = displayY = null;
    tick(performance.now());
  }

  function pointAtLength(target) {
    if (target <= 0) return samples[0];
    if (target >= totalLength) return samples[samples.length - 1];
    let lo = 0, hi = samples.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (samples[mid].dist < target) lo = mid; else hi = mid;
    }
    const a = samples[lo], b = samples[hi];
    const f = (target - a.dist) / ((b.dist - a.dist) || 1);
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
  }

  // Paints one frame — called continuously by the rAF loop below (not just
  // on scroll), so the comet keeps drifting and the rainbow keeps flowing
  // even at rest, instead of freezing solid the instant scrolling stops.
  // Also called directly (not via the loop) from layout(), so a resize
  // repaints immediately instead of waiting on the next scheduled frame.
  function tick(now) {
    if (samples.length) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const target = pointAtLength(totalLength * pct);

      if (displayX === null) {
        displayX = target.x;
        displayY = target.y;
      } else {
        // Ease toward the scroll target rather than snapping straight to
        // it, so the star glides/trails behind fast scrolling like
        // something with a little inertia, instead of teleporting.
        displayX += (target.x - displayX) * EASE;
        displayY += (target.y - displayY) * EASE;
      }

      // A slow, gentle orbit layered on top of the eased position — keeps
      // the star lightly adrift even when scroll is perfectly still,
      // instead of parking dead motionless.
      const t = now / 1000;
      const wobbleX = Math.sin(t * 0.9) * WOBBLE_X;
      const wobbleY = Math.cos(t * 0.6) * WOBBLE_Y;

      const x = displayX + wobbleX;
      const y = displayY + wobbleY;
      star.style.transform = `translate(${x.toFixed(1)}px, ${(y - window.scrollY).toFixed(1)}px) translate(-50%, -50%)`;

      // Slide the repeating rainbow band with scroll position, plus a
      // constant slow drift of its own, so the colors keep flowing even
      // while the page sits still. Modulo keeps the offset bounded.
      const dt = lastTick === null ? 0 : now - lastTick;
      idleFlowOffset = (idleFlowOffset + dt * IDLE_FLOW_SPEED) % RAINBOW_REPEAT;
      const offset = (window.scrollY * RAINBOW_SPEED + idleFlowOffset) % RAINBOW_REPEAT;
      gradient.setAttribute('gradientTransform', `translate(0, ${-offset})`);

      // Reveal the ribbon only up to just past the star's current (eased)
      // position — a small lead so the trail reads as continuing under the
      // star rather than stopping short of it. Using the eased position
      // rather than the raw scroll target keeps this in sync with where
      // the star is actually drawn, so the trail never appears ahead of it.
      const docHeight = document.documentElement.scrollHeight;
      revealRect.setAttribute('height', Math.min(docHeight, Math.max(0, y + 30)));
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
  let scrollActive = false;
  let scrollIdleTimer;
  function pulseStar() {
    star.classList.remove('is-pulsing');
    void star.offsetWidth; // force reflow so the next class add restarts the animation
    star.classList.add('is-pulsing');
  }

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

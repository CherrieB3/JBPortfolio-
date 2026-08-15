// Shared behavior: mobile nav toggle, active-link marking, and the
// comet scroll-rail (rainbow trail + twinkling star as scroll wayfinder).

document.addEventListener('DOMContentLoaded', () => {
  initNav();
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

function initCometTrail() {
  const trail = document.querySelector('.comet-trail');
  const star = document.querySelector('.comet-star');
  if (!trail || !star) return;

  const svg = trail.querySelector('svg');
  const gradient = trail.querySelector('#trailGradient');

  const TAPER_FRACTION = 0.03; // fraction of total length pinched to a point at each end
  const STEP = 16; // vertical scan resolution, px — finer steps make the relaxed curve smoother

  const OBSTACLE_SELECTOR = [
    'main h1', 'main h2', 'main h3', 'main p', 'main a', 'main .card',
    'main .mascot-wrap', 'main .avatar-frame', 'main .galaxy', 'main .sticker-card',
    'main form', 'main .rabbit-icon', 'main .lines',
    'footer h2', 'footer .footer-email', 'footer .socials',
  ].join(', ');

  // Deterministic per-page "random": same page always produces the same
  // curve on every reload, but different pages still get their own shape
  // instead of one identical wave repeated site-wide.
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

  let samples = []; // sampled centerline, in document coordinates
  let totalLength = 0;

  // Content blocks the trail should route around, in document coordinates.
  function collectObstacles(pad) {
    const rects = [];
    document.querySelectorAll(OBSTACLE_SELECTOR).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      rects.push({
        top: r.top + window.scrollY - pad,
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
    let best = intervals[0], bestDist = Infinity;
    for (const iv of intervals) {
      const d = x < iv[0] ? iv[0] - x : x - iv[1];
      if (d < bestDist) { bestDist = d; best = iv; }
    }
    const inset = Math.min(10, (best[1] - best[0]) / 2);
    return x < best[0] ? best[0] + inset : best[1] - inset;
  }

  // Scan down the page in bands: coil left-to-right in a broad, spring-like
  // swirl by default, but steer around any content block that's in the way,
  // hugging the nearest clear gutter instead of crossing through it.
  function buildRibbon(w, h) {
    const isNarrow = w < 700;
    const pad = isNarrow ? 16 : 36; // clearance kept from every obstacle
    const width = isNarrow ? 11 : 20; // constant ribbon thickness
    const amp = isNarrow ? Math.max(16, w * 0.16) : Math.max(28, Math.min(w * 0.22, 220));
    const centerX = isNarrow ? w * 0.72 : w * 0.68;
    const freq = 0.6 + rand() * 0.4; // a few full coils down the page
    const phase = rand() * Math.PI * 2;

    const obstacles = collectObstacles(pad);

    const raw = [];
    let lastX = centerX;
    for (let y = 0; y <= h; y += STEP) {
      const desired = centerX + amp * Math.sin((y / Math.max(h, 1)) * Math.PI * 2 * freq + phase);
      const intervals = freeIntervals(y, obstacles, w);
      lastX = clampToFree(desired, intervals, lastX);
      raw.push({ x: lastX, y });
    }
    if (raw[raw.length - 1].y < h) raw.push({ x: raw[raw.length - 1].x, y: h });

    // Relax the curve toward smoothness in several rounds, re-clamping to the
    // free gutters after each pass — this rounds off every step left by
    // obstacle-hugging into a continuous, springy coil with no hard corners,
    // without letting the curve drift back into content.
    let points = raw;
    for (let pass = 0; pass < 7; pass++) {
      points = points.map((p, i) => {
        const win = points.slice(Math.max(0, i - 7), Math.min(points.length, i + 8));
        const x = win.reduce((s, q) => s + q.x, 0) / win.length;
        return { x: clampToFree(x, freeIntervals(p.y, obstacles, w), x), y: p.y };
      });
    }

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
      const endTaper = gt < TAPER_FRACTION
        ? gt / TAPER_FRACTION
        : gt > 1 - TAPER_FRACTION
          ? (1 - gt) / TAPER_FRACTION
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

    return `M ${fmt(leftPts[0].x)} ${fmt(leftPts[0].y)} ${curveThrough(leftPts)} `
      + `L ${fmt(rightPts[0].x)} ${fmt(rightPts[0].y)} ${curveThrough(rightPts)} Z`;
  }

  function layout() {
    const docHeight = document.documentElement.scrollHeight;
    const w = window.innerWidth;

    trail.style.height = `${docHeight}px`;
    svg.setAttribute('width', w);
    svg.setAttribute('height', docHeight);
    svg.setAttribute('viewBox', `0 0 ${w} ${docHeight}`);
    gradient.setAttribute('x1', '0'); gradient.setAttribute('y1', '0');
    gradient.setAttribute('x2', '0'); gradient.setAttribute('y2', docHeight);

    const d = buildRibbon(w, docHeight);

    svg.querySelectorAll('.trail-seg').forEach(el => el.remove());
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', d);
    el.setAttribute('class', 'trail-seg');
    svg.appendChild(el);

    update();
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

  function update() {
    if (!samples.length) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    const point = pointAtLength(totalLength * pct);
    star.style.transform = `translate(${point.x}px, ${point.y - window.scrollY}px) translate(-50%, -50%)`;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });

  window.addEventListener('resize', layout);
  window.addEventListener('load', layout);
  if (document.fonts && document.fonts.ready) {
    // web-font swap can reflow heading/paragraph heights after first layout
    document.fonts.ready.then(layout);
  }
  layout();

  star.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

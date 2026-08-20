// Shared behavior: mobile nav toggle, active-link marking, the
// home-page comet trail (only runs where the markup for it exists), and
// the custom star/"click me" cursor.

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollSpy();
  initCometTrail();
  initStarfield();
  initCustomCursor();
});

function initStarfield() {
  const field = document.querySelector('.stars');
  if (!field) return;

  // Denser and a bit sparklier than before — leaning into the busy star
  // scatter from Jasmine's cosmic-creature moodboard reference.
  const area = window.innerWidth * window.innerHeight;
  const count = Math.min(300, Math.max(120, Math.round(area / 7000)));

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

  const BURST_COLORS = ['#ff3fd8', '#4d5bff', '#ffd93d', '#4ade80', '#a78bfa', '#ff9f1c', '#2dd4bf'];
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

  const STEP = 12; // vertical scan resolution, px — finer steps make the relaxed curve smoother

  const OBSTACLE_SELECTOR = [
    'main h1', 'main h2', 'main h3', 'main p', 'main a', 'main .card',
    'main .mascot-wrap', 'main .avatar-frame', 'main .galaxy', 'main .sticker-card',
    'main form', 'main .rabbit-icon', 'main .lines',
    'footer h2', 'footer .footer-email', 'footer .socials',
  ].join(', ');

  let samples = []; // sampled centerline, in document coordinates
  let totalLength = 0;
  let baseWidth = 20; // the reference (unscaled) stroke width, set by buildRibbon each run — tick() scales the star against this

  // Content blocks the trail should route around, in document coordinates.
  function collectObstacles(pad, lookahead) {
    const rects = [];
    document.querySelectorAll(OBSTACLE_SELECTOR).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      rects.push({
        // Extra clearance above AND below the obstacle: the ribbon can only
        // move sideways at a capped rate per row, so if the constraint
        // only started exactly at the obstacle's edge, a curve already
        // swinging back toward center right at that boundary has no room
        // to react and grazes the text before the cap can pull it clear.
        // Starting the constraint a bit earlier gives it that room on entry
        // — and the same cushion is needed on exit too: without it, the
        // instant the obstacle's row ends, the raw (unconstrained) desired
        // position — which kept evolving the whole time it was being
        // suppressed — reasserts itself in a single row, producing a sharp
        // spike-and-rebound "knot" in the ribbon right at that boundary
        // instead of a gradual ease back toward center.
        top: r.top + window.scrollY - pad - (lookahead || 0),
        bottom: r.bottom + window.scrollY + pad + (lookahead || 0),
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
    // width by a wide margin. The ribbon now rests in a narrow straight
    // lane near one edge, so a blocked obstacle typically leaves one huge
    // gutter open on the far side of the page; a mild
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
    // straight lane near one edge, so a blocked obstacle typically leaves
    // one huge open gutter on the other side — taking
    // its midpoint would drag the ribbon halfway across the page just to
    // clear a small obstruction. Clamping the smoothly-varying desired x
    // into the interval keeps the detour as small as it can be, and stays
    // stable since desired doesn't jump between rows.
    const inset = Math.min(24, (best[1] - best[0]) / 2);
    return Math.max(best[0] + inset, Math.min(best[1] - inset, x));
  }

  // Scan down the page in bands, steering around any content block that's
  // in the way. The resting lane is one consistent middle-right position
  // held for the whole scroll, with a short, gentle sway along its length
  // — like a wire loosely held vertically, not a taut straight line and
  // not the old wide edge-to-edge sweep either — only otherwise deviating
  // from that to dodge content.
  function buildRibbon(w, h) {
    const isNarrow = w < 700;
    const pad = isNarrow ? 20 : 44; // clearance kept from every obstacle
    const width = isNarrow ? 11 : 20; // reference thickness on straight/low-curvature stretches
    baseWidth = width; // shared with tick(), so the star can scale against the same reference
    const restFraction = 0.35; // how far in from the right edge the resting lane sits — middle-right, not edge-hugging
    const centerX = w * (1 - restFraction) - width / 2;
    const WAVE_AMPLITUDE = isNarrow ? 3 : 5; // px either side of centerX — short and subtle, not a wide swing
    const WAVE_LENGTH = isNarrow ? 190 : 250; // px of travel per full sway cycle
    // Cap how far the centerline can move sideways in one scan row. Without
    // this, a sudden obstacle-dodge jump to a different gutter can swing
    // the path further sideways than down — and once the turn is tighter
    // than the ribbon's own half-width, the
    // left/right offset edges cross and the ribbon self-intersects into a
    // little knot instead of curving. Capping the per-row delta forces
    // every direction change to unfurl gradually, which is what actually
    // reads as a clean swirl instead of a scribble. Kept low (rather than
    // just relying on the relax passes below) so obstacle dodges themselves
    // start out as a gentle lean instead of a sharp jag that smoothing then
    // has to round the corners off of.
    const maxDeltaPerStep = STEP * 1.1;

    // Obstacles get extra warning room above their top edge, sized to how
    // far the capped ribbon can travel in a handful of rows — enough to
    // reach clear of a typical obstacle's gutter before actually reaching
    // it, instead of arriving at the boundary mid-swing and grazing it.
    const obstacles = collectObstacles(pad, maxDeltaPerStep * 4);

    const raw = [];
    let lastX = centerX;
    for (let y = 0; y <= h; y += STEP) {
      // Straight down at this stage — the sway is layered on at the very
      // end (see below), after smoothing, since the relax passes further
      // down would otherwise average a wave this short right back out.
      const desired = centerX;
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
    for (let pass = 0; pass < 12; pass++) {
      points = points.map((p, i) => {
        const win = points.slice(Math.max(0, i - 16), Math.min(points.length, i + 17));
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
    for (let pass = 0; pass < 4; pass++) {
      points = points.map((p, i) => {
        const win = points.slice(Math.max(0, i - 4), Math.min(points.length, i + 5));
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

    // Right at an obstacle's boundary, clampToFree can return the same
    // "wrong" x on every pass above — averaging never erodes it because
    // each pass reclamps back to that same point, so it isn't actually an
    // average converging on the truth, it's a stable fixed point that
    // happens to be a one-row spike. A single isolated row whose neighbors
    // are close to each other but far from it is unambiguously that spike
    // (a real turn moves its neighbors too, not just one row in the
    // middle) — snap it to its neighbors' midpoint instead of relying on
    // more rounds of the same averaging to fix it. Run it three times:
    // fixing the worst spike can leave a smaller one-row echo right next to
    // where it was, below the previous pass's own threshold — verified
    // against dense, closely-packed obstacle layouts (stacked paragraph
    // lines, card grids) down to a low-single-digit-px residual.
    for (let pass = 0; pass < 3; pass++) {
      points = points.map((p, i) => {
        if (i === 0 || i === points.length - 1) return p;
        const a = points[i - 1], b = points[i + 1];
        const neighborMid = (a.x + b.x) / 2;
        const neighborGap = Math.abs(a.x - b.x);
        const deviation = Math.abs(p.x - neighborMid);
        if (deviation > maxDeltaPerStep * 0.2 && neighborGap < maxDeltaPerStep * 0.8) {
          return { x: clampToFree(neighborMid, freeIntervals(p.y, obstacles, w), neighborMid), y: p.y };
        }
        return p;
      });
    }

    // The despike above can, in principle, still leave a step slightly
    // over the per-row cap (its replacement value isn't cap-checked against
    // its neighbors). One more sequential walk guarantees the final output
    // never violates it.
    seqX = points[0].x;
    points = points.map((p, i) => {
      if (i === 0) return p;
      const bounded = Math.max(seqX - maxDeltaPerStep, Math.min(seqX + maxDeltaPerStep, p.x));
      seqX = clampToFree(bounded, freeIntervals(p.y, obstacles, w), seqX);
      return { x: seqX, y: p.y };
    });

    // The short sway is layered on last, after the curve is fully settled
    // — not baked into the original scan (the wide relax passes above span
    // most of one wave cycle and would average it back out almost
    // entirely). The wave's own per-row swing is tiny, but reclamping each
    // point in isolation against a tightly-packed obstacle can still pick
    // a completely different gutter (the same failure mode the despike
    // pass earlier exists to fix) — so this needs the same delta-capped
    // sequential walk, not just a reclamp.
    points = points.map((p) => {
      const waveX = p.x + WAVE_AMPLITUDE * Math.sin((p.y / WAVE_LENGTH) * Math.PI * 2);
      return { x: clampToFree(waveX, freeIntervals(p.y, obstacles, w), waveX), y: p.y };
    });

    seqX = points[0].x;
    points = points.map((p, i) => {
      if (i === 0) return p;
      const bounded = Math.max(seqX - maxDeltaPerStep, Math.min(seqX + maxDeltaPerStep, p.x));
      seqX = clampToFree(bounded, freeIntervals(p.y, obstacles, w), seqX);
      return { x: seqX, y: p.y };
    });

    points = points.map((p, i) => {
      if (i === 0 || i === points.length - 1) return p;
      const a = points[i - 1], b = points[i + 1];
      const neighborMid = (a.x + b.x) / 2;
      const neighborGap = Math.abs(a.x - b.x);
      const deviation = Math.abs(p.x - neighborMid);
      if (deviation > maxDeltaPerStep * 0.2 && neighborGap < maxDeltaPerStep * 0.8) {
        return { x: clampToFree(neighborMid, freeIntervals(p.y, obstacles, w), neighborMid), y: p.y };
      }
      return p;
    });

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

    // How many samples on each side to look when measuring a bend — wider
    // than the immediate neighbor (used for the normal below) so the width
    // responds to the actual shape of a turn/dodge rather than single-row
    // noise, and doesn't fire on the short sway's own gentle drift.
    const CURVE_SPAN = 5;
    const MAX_TURN = 0.5; // radians of direction change (over that span) that maxes out the width
    const EXTRA_WIDTH = width * 0.75; // how much wider than the reference at a full turn

    samples.forEach((p, i) => {
      const prev = samples[Math.max(0, i - 1)];
      const next = samples[Math.min(samples.length - 1, i + 1)];
      const tx = next.x - prev.x, ty = next.y - prev.y;
      const len = Math.hypot(tx, ty) || 1;
      p.nx = -ty / len;
      p.ny = tx / len;

      // Thicker only where the path is actually turning — not tied to
      // absolute direction (a calligraphy nib) and not fluctuating on its
      // own along straight stretches (a pulse) — everywhere else it just
      // holds the reference width.
      const back = samples[Math.max(0, i - CURVE_SPAN)];
      const fwd = samples[Math.min(samples.length - 1, i + CURVE_SPAN)];
      // Right at the very top/bottom of the page, the lookback/lookahead
      // clamps to the point itself — a zero-length span has no real
      // direction to measure, and atan2(0, 0) would otherwise read as a
      // spurious full turn. Just hold the reference width there.
      if (back === p || fwd === p) {
        p.width = width;
      } else {
        const dirIn = Math.atan2(p.y - back.y, p.x - back.x);
        const dirOut = Math.atan2(fwd.y - p.y, fwd.x - p.x);
        let turn = dirOut - dirIn;
        while (turn > Math.PI) turn -= Math.PI * 2;
        while (turn < -Math.PI) turn += Math.PI * 2;
        const curvature = Math.min(1, Math.abs(turn) / MAX_TURN);
        p.width = width + EXTRA_WIDTH * curvature;
      }
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

    window.__trailDebug = { samples: samples.map(p => ({ x: p.x, y: p.y, width: p.width })), obstacles };

    return `M ${fmt(leftPts[0].x)} ${fmt(leftPts[0].y)} ${curveThrough(leftPts)} `
      + `L ${fmt(rightPts[0].x)} ${fmt(rightPts[0].y)} ${curveThrough(rightPts)} Z`;
  }

  const RAINBOW_REPEAT = 600; // px of one full color cycle, tiled via spreadMethod="reflect" — 25% longer than before, so the hue shifts 25% less per px of travel
  const RAINBOW_SPEED = 1.6; // how much faster the rainbow flows than you scroll
  const IDLE_FLOW_SPEED = 0.02; // px/ms the rainbow keeps drifting even at rest — a full cycle every ~24s
  const EASE = 0.4; // how quickly the star catches up to its scroll target — still enough glide to
  // feel alive rather than snapping instantly, but tight enough that it doesn't visibly lag behind
  const WOBBLE_X = 5, WOBBLE_Y = 3.5; // px — a small orbiting drift, so the star never sits perfectly still

  // Eased/wobbled star position, in document coordinates. null until the
  // first tick, so that tick can hard-set it (no glide-in from empty state).
  let displayX = null, displayY = null;
  let displayWidth = null; // eased ribbon width at the star's position — drives its scale
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
    displayX = displayY = displayWidth = null;
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
  const TOP_MARGIN = 0.12; // how close to the viewport's top edge the star can get, at the very start of the page
  // Capped well short of the bottom edge (not a symmetric top/bottom
  // margin) so the star stays ahead of your scroll position — leading
  // into the content below rather than drifting down to trail behind
  // wherever you've already read.
  const AHEAD_CAP = 0.5;

  function tick(now) {
    if (samples.length) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      // Anchored to "where in the viewport should the star sit" (near the
      // top edge at the very start of the page, capped at AHEAD_CAP by
      // the very end, sliding between as you scroll) rather than "what %
      // of the document have you scrolled" — guarantees the star is
      // always on screen and ahead of center, regardless of how much the
      // ribbon's actual arc length is stretched by dodging.
      const topY = window.innerHeight * TOP_MARGIN;
      const bottomY = window.innerHeight * AHEAD_CAP;
      const viewportY = topY + (bottomY - topY) * pct;
      const target = pointAtY(window.scrollY + viewportY);

      if (displayX === null) {
        displayX = target.x;
        displayY = target.y;
        displayWidth = target.width;
      } else {
        // Ease toward the scroll target rather than snapping straight to
        // it, so the star glides/trails behind fast scrolling like
        // something with a little inertia, instead of teleporting.
        displayX += (target.x - displayX) * EASE;
        displayY += (target.y - displayY) * EASE;
        displayWidth += (target.width - displayWidth) * EASE;
      }

      // A slow, gentle orbit layered on top of the eased position — keeps
      // the star lightly adrift even when scroll is perfectly still,
      // instead of parking dead motionless.
      const t = now / 1000;
      const wobbleX = Math.sin(t * 0.9) * WOBBLE_X;
      const wobbleY = Math.cos(t * 0.6) * WOBBLE_Y;

      const x = displayX + wobbleX;
      const y = displayY + wobbleY;
      // The star grows and shrinks with the ribbon's own stroke width at
      // that point — wherever the calligraphy stroke swells, the star
      // riding it swells too, instead of staying a fixed size regardless
      // of how thick the trail is there. Clamped so it never nears zero
      // or balloons absurdly at the extremes of the width range.
      const widthScale = Math.max(0.6, Math.min(1.6, displayWidth / baseWidth));
      star.style.transform = `translate(${x.toFixed(1)}px, ${(y - window.scrollY).toFixed(1)}px) translate(-50%, -50%) scale(${widthScale.toFixed(3)})`;

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

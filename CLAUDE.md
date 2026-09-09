# JBPortfolio — Jasmine Bontha's UX & Graphic Design Portfolio

## Who this is for

This site belongs to Jasmine Bontha, a senior UX design student who is also a
practicing graphic artist. The portfolio needs to read as **both**: rigorous
about process (research, IA, usability, accessibility) and confident about
visual craft (illustration, motion, typography, color). When acting on this
project, hold both bars at once — a beautiful section with no rationale, or a
well-reasoned case study that looks generic, both fall short of the goal.

Treat every change as portfolio work itself: a hiring manager or grad-school
reviewer may judge Jasmine's design skill by the site's own execution, not
just its content.

## Tech stack & constraints

- Static single-page site: `index.html` holds Home/About/Projects/
  Playground/Contact as one continuous page with anchor sections
  (`#about`, `#projects`, `#playground`, `#contact`); nav links scroll to
  them instead of loading separate URLs (see "Single-page navigation"
  below). `case-studies/*.html` are the exception — full project write-ups
  stay as separate detail pages linked out from the Projects section, the
  way a one-pager still needs somewhere to put real depth. Shared
  `css/style.css` + `js/main.js`. No build step, no framework, no
  package.json — keep it that way unless a real need arises (see rule 3).
- Fonts are self-hosted (`fonts/*.woff2`, declared in `css/style.css`), not
  linked from `fonts.googleapis.com`: privacy-focused browsers and
  extensions (Brave's shields, Safari's cross-site tracking prevention, many
  ad blockers) block Google Fonts requests by default, which silently falls
  back to a generic system font — self-hosting removes that third-party
  request entirely. `Baloo 2` (variable, weights 400/700) for headings,
  nav, and the logo's mark; `Inter` (variable, 300–500) for body copy —
  both Latin-subset `.woff2` only, same files Google itself would have
  served. Display-font history: `Syne` → `Kalam` (redesigned from
  Jasmine's storyboards, `Untitled_Artwork 2.pdf`, Aug 2026, for a looser
  hand-drawn/marker feel) → `Shantell Sans` (Kalam read too casual/comic
  once real case studies were added) → `Handjet` (a blocky, pixel-grid
  display face) → `Space Grotesk` (a geometric, technical/monospace-
  influenced sans) → `Baloo 2` (current — a rounded, storybook/children's-
  book-adjacent display face, chosen for the Bee and PuppyCat-inspired
  pastel-dreamy redesign; see "Art direction: Bee and PuppyCat mood"
  below). This is friendlier/warmer than Space Grotesk but still not the
  bouncy-comic register Kalam had — closer in spirit to the original
  hand-drawn/marker voice than any of the intervening choices were.
- Vanilla JS only (`js/main.js`): mobile nav toggle, active-nav-link
  marking, and the home-page comet trail (see below). Prefer extending this
  file over adding a library for new interactivity.
- No raster image assets by default — the spark mark and planets
  are inline SVG/CSS. This was a deliberate choice (avoids an asset
  pipeline, keeps everything crisp and themeable) as well as the fix for the
  old dangling `astronaut.png` reference. Keep new illustration work in this
  same inline-SVG, line-art style rather than introducing image files unless
  Jasmine explicitly wants to swap in real artwork/photography.
- Exception: `images/doodle-1.svg` through `doodle-5.svg` are real files (not
  inline) on purpose — they're floating placeholder sketch slots on the About
  page (see below) that Jasmine can overwrite directly with her own drawings
  without touching any HTML/CSS. Any future "swap this for my own art" request
  should follow this same pattern (a real file in `images/`, referenced by
  `<img src>`) rather than going back to inline SVG.
- Exception: `images/mascot-astronaut.png` is Jasmine's own real character
  art for the hero mascot (a chibi astronaut with bunny ears), replacing
  what was originally a placeholder SVG referenced the same way. This is
  the same swap-the-file pattern as the doodle slots, just already
  fulfilled rather than still pending — a template for future "here's my
  real art for X" requests: drop the file in `images/`, point `<img src>`
  at it, no inline SVG. `images/mascot-astronaut-alt.png` is a second real
  file alongside it — an alternate expression (mid-sneeze/scrunched-eyes)
  in the same pose/crop, swapped in on click (see the mascot-click entry
  under "Texture & interaction" below). Same resize-on-intake treatment as
  the primary file (source was 2048px, saved at 1400px into `images/`).

## Design system

Reuse these tokens rather than inventing new ones so the site stays visually
coherent as pages are added. Defined as CSS custom properties at the top of
`css/style.css`.

### Art direction: Bee and PuppyCat mood

The rainbow palette was repainted from vivid neon to soft, dusty pastel
hues, at Jasmine's direction: capture the atmosphere, palette, softness,
whimsy, and dreamy sci-fi feel of *Bee and PuppyCat* — "a magical mailbox
floating in space" — without copying the show's characters/assets. **This
was first tried as a full light-mode flip (cream background, dark plum
text) and Jasmine rejected it** ("I don't like it") — the background is
back to the site's original dark cosmic void (`#050314`). What survived
from that attempt, by her explicit follow-up direction: the pastel accent
palette itself, `Baloo 2` as the display font, and reworked/recolored
versions of the decorative extras added alongside the light-mode attempt
(drifting clouds, occasional shooting stars, the floating mail envelope,
warm plum-tinted shadows instead of flat black). **Do not reintroduce a
light/cream background** — that direction was tried and explicitly turned
down; this is a dark theme with a pastel accent palette, not a light-mode
palette. Every rainbow color token kept its **original name** (`--c-red`,
`--d-blue`, `--text`, etc.) even though the hue changed, so every rule
reading `var(--c-red)` picked up the new palette with zero changes to
that rule — keep extending the palette this same way (new value, same
slot) rather than introducing parallel new tokens.

**Color** — two tiers of the same rainbow, now pastel, back to their
original functional meaning now that the background is dark again:
soft/light (`--c-*`) is the vivid-on-dark decorative tier (glows, thin
borders, small dots, planet fills); deep/muted (`--d-*`) is for AA-safe
text on the light nav/paper surfaces, and for white text sitting on top
of a button/badge fill — **the soft tier is too light for white text to
sit on** (that's what broke during the brief light-mode attempt: `.btn`,
`.playground-tab.is-active`, etc. were pointing at the soft tier and
failed contrast; always reach for the deep tier for that). Every pair
below was checked against both white and `#fdf3e7` (the paper/nav color)
at build time — if you introduce a new slot, verify it the same way
rather than eyeballing it.

| Slot | Soft (`--c-*`, decorative on dark) | Deep (`--d-*`, AA text-on-nav / white-on-fill) |
|---|---|---|
| Coral (was red) | `#f0a89a` | `#a8455f` |
| Peach (was orange) | `#f7d4ab` | `#9c5620` |
| Muted gold (was yellow) | `#eddb9c` | `#7a611e` |
| Pale mint (was green) | `#bfe8d4` | `#357a5a` |
| Sky blue (was blue) | `#b3dcf0` | `#2f6488` |
| Soft lavender (was purple) | `#d6c6f0` | `#6f5498` |
| Rose pink (accent only) | `#f0a8c9` | — (reuse `--d-red` if a deep pink is needed) |
| Glowing teal/cyan (accent only) | `#7fd9e6` | — |

Background `#1c1840` — a deep indigo-violet "moonlit" night, not a flat
near-black void (nudged there from `#050314` per a moodboard reference
Jasmine shared: a glowing cyan/teal night scene). Nav/paper surfaces
`#fffbf4`; body text on dark: `#ffffff` / `#d3d4e6` / `#9d9fc0` (heading /
subhead / muted). Shadows (`rgba(61, 51, 79, …)`) are tinted warm plum
rather than neutral black. The red slot leans coral-salmon (not
dusty-rose-pink) and teal leans a more vivid glowing cyan (not muted
mint-teal) specifically to match that reference — both the ambient
`body::before`/`body::after` glow layers and the starfield's color mix
(`STAR_COLORS` in `js/main.js`, weighted toward coral) were rebalanced to
feature them more, alongside lavender, with gold/peach as a secondary
warm accent rather than the dominant note. Star/spark glyphs that used to
be a flat `fill="white"` are now warm gold (`#e0bd5a`) — kept deliberately
as that secondary warm accent; don't "fix" them back to white.

`--gradient-rainbow` (rose→peach→gold→mint→sky→lavender) is the site's
signature: nav underline, comet trail, hero ribbon, `.gradient` text
accent. Buttons are deliberately solid color (`var(--d-blue)`), not
gradient — a past `--gradient-cta` two-hue gradient was removed from
`.btn` on purpose, so don't reintroduce a gradient fill there. Don't
introduce off-palette colors — extend by opacity/tint of the rainbow set
instead.

**Type**
- Display / headings / nav / logo: `Baloo 2`, weight 700 (400 for lighter
  accents) — rounded, friendly, storybook-adjacent, chosen for the Bee
  and PuppyCat-inspired pass. This reads warmer than either Space
  Grotesk (previous) or the hand-marker voice from earlier in the site's
  history — closer to "picture-book" than either.
- Body: `Inter`, weights 300–500.
- Hero H1 is intentionally oversized (`clamp(3.2rem, 7.5vw, 6rem)`) — this
  is the site's visual signature, not a bug to "fix" for looking large.
- A third voice, `var(--font-mono)` (system monospace, no extra font
  file), is reserved for "meta" marks: `.eyebrow` labels and the
  `.section-mark` running-head labels below. Deliberate — a technical/
  editorial mono against the display and body faces is what keeps the
  type system reading as considered rather than one sans-everywhere
  template. Don't reuse it for body copy or headings.

**Editorial asymmetry** — a deliberate reaction against "generic AI
portfolio" tells (perfectly centered layouts, identical padding on every
section, symmetric everything): section padding is intentionally uneven
(see the `section[aria-label=...]` / `.contact-body` overrides just below
the base `section` rule in `css/style.css`, rather than one flat value
everywhere), and `.section-mark` prints a small sideways running-head
label (`№ 01 — About`, etc., `writing-mode: vertical-rl`) in the left
margin of About/Projects/Playground/Contact — a magazine gutter-number
device, opposite the comet trail's right-edge rail, so the page reads as
having two considered margins instead of one centered column. Extend this
pattern (uneven rhythm, a numbered mark) for any new top-level section
rather than giving it the same padding as its neighbors. `.contact-grid`
is a deliberately asymmetric `.82fr 1.18fr` split (not an even 1fr/1fr)
for the same reason. Playground's Experiments tiles (`.playground-deck`)
are a horizontal scroll-snap "slide deck" rather than a static grid —
`display: flex; overflow-x: auto; scroll-snap-type: x proximity`, each
`.sticker-card` a fixed-width flex item (`.sticker-card--wide` just a
wider `flex-basis`, not a column span), so you scroll/swipe sideways
through them like flipping through a stack. Native CSS scroll-snap, no
carousel library (rule 3) — trackpad, wheel, touch, and keyboard (the
deck is `tabindex="0"`) all just work without JS. Limited to 3 placeholder
tiles by request; extend by adding more `.sticker-card`s to the deck
rather than reverting to a fixed grid.

**Type weight scale** — `h1`/`.hand` 800, `h2` 700, `h3` 600 (all
`Baloo 2`) — a real step down in weight per level, not one flat 700
everywhere, so hierarchy reads from weight as well as size. Follow this
scale for any new heading level rather than defaulting new headings to
700.

**Cards: solid and bordered, not glass** — `.card`/`.sticker-card` use a
visible `1.5px` border and a moderately opaque fill (`rgba(255,255,255,.07)`
background over the dark bg), and their hover state is a color-changed
border + a plain shadow lift rather than a diffuse colored glow — keep
new panel components in this register (clearly bordered, not a soft
blurred glow standing in for definition). The signature glow effects
(comet trail, planet halos, aurora, star pulses) stay as deliberate
focal-point moments elsewhere on the page; this is specifically about
card/panel treatment, not removing glow from the site altogether.

**Icon stroke weight** — the hand-drawn line-art marks (avatar-face,
mail-envelope, city-skyline antenna, the doodle-placeholder/rabbit
line art) all use `stroke-width="3"`. Keep any new stroke-based icon at
3 too, rather than picking a new value per icon — this is what keeps
them reading as one consistent set rather than a grab-bag of styles.
(Purely decorative background strokes — the big ribbon squiggles,
hero-ribbon, squiggle-underline — are a different, much thicker "brush
stroke" register and aren't part of this icon-consistency rule.)

**Royal gold trim** — a small "royal" flourish, at Jasmine's request. It
was first tried broadly (a crown glyph + trailing gold rule on all four
main section headings, plus a gold top-trim band on `.card`/
`.sticker-card`/`.constellation-card`), then pulled back after a
whole-site "too much going on" pass — the crown/heading treatment and the
per-card trim were removed entirely. What's left is just a slim gold
hairline on the nav (just above `.nav-underline`'s rainbow strip) and a
matching one at the top of the footer (`footer::before`), bookending the
page — reusing the existing `--c-yellow` token (rule 4 — no new color
introduced), which is the vivid-on-dark decorative tier appropriate for
both those dark surfaces. Don't re-add the crown glyph or per-card trim
without checking with Jasmine first; that combination read as too busy
stacked on top of the rest of the site's existing motion/decoration.

**Texture & interaction**
- `.grain` (procedural SVG feTurbulence, not a raster asset) sits over the
  whole page at very low opacity with `mix-blend-mode: overlay` — a
  constant, subtle film-grain so nothing reads as a flat, untextured
  gradient. Disabled under `prefers-reduced-motion` and on narrow
  viewports (perf).
- `.card` and `.sticker-card` get a magnetic cursor-tilt on hover
  (`initTiltCards()` in `js/main.js`, mouse-only) — they lean toward the
  pointer via `--tilt-x`/`--tilt-y` custom properties consumed inside
  each element's own `:hover` transform, layered on top of (not
  replacing) its existing lift/scale. `--tilt-x`/`--tilt-y` are declared
  via `@property` as `<angle>` so the lean animates smoothly; reuse this
  same custom-property-inside-the-hover-transform pattern for any new
  hover motion rather than setting `transform` directly from JS, which
  would permanently win over the CSS `:hover` rule.
- A hidden easter egg: typing "rabbit" anywhere on the page (not while
  focused in a text field) triggers a small hop animation
  (`initRabbitEgg()`/`hopRabbit()` in `js/main.js`) — grounded in the real
  "rabbit enthusiast" detail in the hero rather than an arbitrary gimmick.
  Reuses the site's existing line-art rabbit silhouette (no emoji, no new
  illustration asset).
- The hero mascot is a click/tap/keyboard-activatable `<button>`
  (`.mascot-btn`, wrapping the `<img class="mascot">`) that swaps to
  `mascot-astronaut-alt.png` on activation, then reverts to
  `mascot-astronaut.png` on its own after `MASCOT_ALT_DURATION_MS` (0.5s) —
  a timed swap rather than a manual toggle, so the alt expression always
  reads as a momentary reaction rather than a persistent state
  (`initMascotToggle()` in `js/main.js`, driven by `data-default-src`/
  `data-alt-src`/`-alt` attributes on the `<img>` so the two source/alt
  pairs live in the markup, not duplicated in JS; a second click while
  already showing the alt expression restarts the timer rather than
  stacking one). A real mouse click only counts on the actual drawing,
  not the square crop's transparent padding around the floating pose —
  `hitsDrawing()` samples the clicked pixel's alpha channel against an
  offscreen canvas rather than approximating a smaller CSS hit-box, since
  the pose is diagonal/irregular (an inset rectangle or circle would
  either clip a limb or still catch empty corners). Keyboard/AT activation
  (`MouseEvent.detail === 0`) always goes through untested, since there's
  no meaningful pointer coordinate to sample in that case. Both images
  share the same square crop/pose, so the swap holds size exactly — no
  separate sizing logic needed. A small hover/active scale lives on
  `.mascot-btn`, not `.mascot` itself, since `.mascot` already drives its
  own `transform` via the float animation and a second directly-set
  `transform` on the same element would just be overridden every frame;
  follow that split (transform the wrapper, not an already-animating
  child) for any future hover effect on an element with its own running
  transform animation.
- Full page loads (`index.html` <-> `case-studies/*.html`, and case study
  <-> case study via the prev/next links) get a quiet wormhole feel instead
  of the browser's default hard cut: the outgoing page eases down and
  brightens slightly as if receding into a point of light, then the new
  page eases in from that same soft glow and settles — a restrained
  "shrink into light / emerge from light" beat, deliberately subtle rather
  than a showy zoom (an earlier, much more dramatic spin/funnel/overshoot
  version was tried and toned down). Built on the native cross-document
  View Transitions API (`@view-transition { navigation: auto; }` +
  `wormhole-suck-in`/`wormhole-burst-out` keyframes driving
  `::view-transition-old/new(root)`, top of `css/style.css`). Pure CSS, no
  router or JS — see rule 3. Browsers without support just navigate
  normally with no transition, so this is enhancement-only and never
  blocks a click; `prefers-reduced-motion` disables it back to an instant
  cut. It's declared once in the shared stylesheet, so it applies to every
  internal navigation on the site, not just the links into case studies —
  keep it that way rather than trying to scope it to one flow, so
  navigating never jumps for some links and warps for others. If asked to
  make it more dramatic again, nudge the existing keyframes' scale/blur/
  brightness values rather than reintroducing rotation/saturate/overshoot
  wholesale — that combination was what read as too much.

**Motif**
- Cosmic theme, dark background with the pastel Bee-and-PuppyCat accent
  palette (see "Art direction" above): starfield background (`.stars`,
  pastel-colored dots, not plain white), soft radial-gradient glows,
  background planets/moons (`.bg-planets`), slow-drifting clouds in the
  hero (`.hero-clouds` — pale lavender-white, low opacity, read as
  moonlit clouds against the dark sky), occasional shooting stars
  (`.shooting-star` — long idle cycle, brief streak, so they're rare
  rather than a constant repeating effect), and a chibi
  astronaut-with-bunny-ears mascot (nods to "rabbit enthusiast").
- **The sky stays put**: `.stars`, `.grain`, `.bg-planets`, and the
  `body::before`/`body::after` glow layers are all `position: fixed` —
  the same background is visible from the moment the page loads and stays
  that way for the whole scroll, rather than scrolling through a much
  taller canvas. (A version where these scrolled with the page — the
  ambient layers spanning the full document, deep space at the top fading
  to a warm horizon glow at the true bottom — was tried and reverted;
  Jasmine wanted the background kept consistent throughout instead.
  `initStarfield()` in `js/main.js` sizes star count off viewport area
  (`window.innerWidth * window.innerHeight`), not document height, to
  match — don't switch that back to document-height sizing without also
  reverting these to `fixed`.) `body::after` uses `mix-blend-mode: screen`
  (correct since the background is dark; a past light-mode attempt
  briefly needed `multiply` instead — don't copy that back in now).
- `.horizon-glow` + `.city-skyline` in the footer — a warm dawn/dusk glow
  and a simple hand-drawn building-silhouette skyline — are a separate,
  deliberate exception: unlike the fixed sky above, these live inside
  `<footer>` (`position: relative`) and scroll normally with it, so they
  only ever appear once, right at the true bottom of the page — "landing
  back home on Earth" after a whole page of space. Present on `index.html`
  and all three case-study footers.
- A floating mail envelope (`.mail-envelope`, gently bobbing) sits by the
  Doodle Mail panel — a literal nod to "a magical mailbox floating in
  space," the site's stated personality; a good template for where a new
  hand-drawn touch should attach to something real on the page rather than
  floating decoratively with no connection to content.
- The 4-point spark/sparkle mark (`✦`, drawn as a small inline SVG) is a
  recurring accent — logo, galaxy core, hero ribbon tip. Reuse it as a
  bullet/flourish rather than inventing a new icon for the same job.
- Cards (`.card`): translucent white fill, soft border, rounded corners
  (`30px`), lift + glow on hover.

**Spacing & layout**
- Horizontal page padding: `8%`–`10%` (`6%` on mobile).
- Nav is fixed, `76px` tall, with the rainbow gradient as a 4px strip
  along its bottom edge. Nav links read About / Projects / **logo** /
  Playground / Contact — the logo sits in the middle slot as one evenly
  spaced row (a specific storyboard detail — don't move the logo back to
  the left without checking with Jasmine).
- **Nav color**: `var(--nav-bg)` (`#161233`, a smidge darker than
  `var(--bg)`) with light text (`var(--text)`, and the per-link accents
  use the `--c-*` soft/pastel tier) — **not** the light `--paper` surface
  used elsewhere (planet-card tooltips, Doodle Mail's paper texture).
  Those two are deliberately different surfaces now; don't merge the nav
  back onto `--paper` or its text back onto `--ink`/`--d-*`, which were
  calibrated for a light background. Below the nav, `.site-nav::after`
  hangs a puffy scalloped fringe (same color as the nav, a repeating row
  of circles, not an SVG/raster asset) so the bottom edge reads as a
  cloud silhouette instead of a hard flat line — "make it look like
  clouds." Reuse that repeating-radial-gradient-circle technique for any
  future cloud-edge treatment rather than hand-drawing an SVG cloud path.

## Single-page navigation

`index.html` is one continuous page — About/Projects/Playground/Contact are
`<section id="about|projects|playground|contact">` anchors, not separate
URLs, and nav/footer links point at `#about` etc. (the logo points at
`#top`, an id on `<body>`). Two mechanics make this work and matter if you
touch nav or section markup:
- `#about, #projects, #playground, #contact { scroll-margin-top: var(--nav-h); }`
  in `css/style.css` — without it, a clicked anchor lands with its heading
  hidden under the fixed nav.
- `initScrollSpy()` in `js/main.js` (IntersectionObserver-based) toggles
  `.is-active` on the nav link matching whichever section is currently in
  view, replacing the old "highlight based on which page you're on" logic.
  It only activates if those section ids exist in the DOM, so it's a no-op
  elsewhere.

`case-studies/*.html` are the one exception to "single page" — full project
write-ups stay as separate pages linked from the Projects section (a
one-pager still needs somewhere to put real depth). Their nav/footer/back
links point at `../index.html#about` etc.; keep that pattern for any new
case-study page. Their own `initNav()` still uses the older
`body[data-page]` static match (they set `data-page="projects"`), since
scroll-spying doesn't apply to a page that isn't the anchor-section one.

## Comet trail

The nav-underline's rainbow strip visually continues down `index.html` as
one filled ribbon (`.comet-trail` markup, driven by `initCometTrail()` in
`js/main.js`, guarded so it's a no-op if that markup isn't present — which
is why it's absent from `case-studies/*.html`). Because the whole site is
now one page, the trail runs the full length of it — hero through footer,
including the About/Projects/Playground/Contact sections — not just a short
home-page hero anymore. It's a single straight vertical line hugging the
right edge of the page, one constant width its whole length — no sway,
no obstacle-dodging (an earlier version steered around headings/cards/
forms; that was deliberately dropped for a plain straight line, so it now
runs straight through/behind whatever's in front of it, relying on
z-index — the ribbon sits behind main content — to stay out of the way of
readability). A star rides the ribbon at the current scroll position and
scrolls to top on click, pulsing its own glow continuously (not just while
scrolling) rather than growing/shrinking in size; the ribbon itself only
reveals up to just under the star's position, so it reads as a trail the
comet leaves behind rather than a path already laid out ahead of it, and
the star always sits right at the trail's leading edge rather than the two
drifting out of sync.

## Content & voice

- Case study copy should be concrete and process-forward: problem framed
  first, then research/method, then decisions with rationale, then outcome
  (metrics, learnings, or reflection if no metrics exist — never fabricate
  numbers).
- Never invent client names, user quotes, research data, or metrics that
  weren't provided. If a case study needs a stat or quote to feel complete,
  ask Jasmine for the real one or clearly mark it as a placeholder (e.g.
  `[metric TBD]`) rather than writing something plausible-sounding.
- Keep the tagline voice ("UX DESIGNER • PRODUCT DESIGNER • ARTIST") — short,
  uppercase, letter-spaced labels for meta info; warmer sentence-case for
  body copy.

## Engineering & design rules

1. **Accessibility is non-negotiable.** All body text must meet WCAG AA
   contrast (4.5:1) against its background; large display text meets AA
   large-text contrast (3:1). Every `<img>` needs meaningful `alt` text
   (decorative images get `alt=""`). Use semantic HTML (`nav`, `section`,
   `footer`, heading levels in order) — don't reach for `div`-soup.
2. **Mobile-first responsiveness.** Any new page or section must be checked
   at mobile widths (~375px) before being called done; add media queries
   rather than letting content overflow or truncate. The galaxy/planet
   layout on Projects is hover-driven and hidden below 700px in favor of
   `.projects-list-fallback` — follow that pattern (a touch-friendly
   fallback, not just a squeezed version) for any other hover-only UI.
3. **No dependency creep.** Don't add a CSS/JS framework, icon library, or
   build tool to solve a problem that plain CSS/HTML already solves. If a
   real need arises (e.g. multi-page routing, a CMS for case studies),
   surface the tradeoff to Jasmine before adding it. One exception exists
   today: Playground's Doodle Mail tab lazy-loads the EmailJS SDK from its
   CDN, but only at the moment someone presses Send — surfaced here as
   that tradeoff, not silently added. See the Doodle Mail entry below.
4. **Stay on-system.** New colors, fonts, radii, or motion patterns should
   be justified against the design system above, not introduced ad hoc.
   If a new page genuinely needs to break the system (e.g. a distinct
   "playground" section for looser experiments), say so explicitly rather
   than drifting silently.
5. **Performance.** Keep the site lightweight — no unnecessary large
   images, no unused fonts/weights, no render-blocking scripts. This is a
   portfolio; load speed is itself a UX signal.
6. **Don't fabricate portfolio content.** Placeholder projects, testimonials,
   or metrics must be clearly marked as placeholders, never presented as
   real work.

## Repo structure

- `index.html` — the entire site as one page. In scroll order: hero (comet
  trail, mascot) → `#about` (real bio pulled from Jasmine's
  previous Framer portfolio, hover avatar frame, a
  "sketchbook" of 5 doodles floating around the bio/avatar content — each
  one will be a drawing of a personal object, with its hover/focus tooltip
  a fun fact about Jasmine tied to that object; below 700px it becomes a
  static list; both the art and the fun-fact captions are still
  placeholder, see `images/` below) → `#projects`
  (Project Orbit — a drag/swipe/wheel/arrow-key/button carousel of the 4
  projects — Comet Commute, Elevator Accessibility, DreamScape, Lucky's
  First Day — as large circular "planet" cards, the active one centered
  and biggest, each linking out to a full write-up, see `case-studies/`
  below and the entry further down for how it works) → `#playground` (two
  tabs: "Experiments", a horizontal scroll-snap deck of loose-experiment
  tiles — explicitly allowed to feel rougher than the rest of the site,
  see rule 4; content is placeholder — and "Doodle Mail", a real
  HTML5-Canvas draw-and-send guestbook, see the entry below) → `#contact`
  (direct links + a contact form **not yet wired to a backend**, marked
  inline; LinkedIn is now a real link, Behance/Dribbble are still `[TBD]` —
  Jasmine's previous portfolio didn't expose them in a fetchable form) →
  one shared footer. See "Single-page navigation" above for how the
  anchors/scrollspy work.

  Projects has gone through two redesigns: an original hover-only
  "galaxy of planet" interaction (content hidden until hover/focus) was
  replaced with an always-visible `.constellation-card` grid (every
  project titled/described/clickable in normal document flow, a
  deliberate accessibility/recruiter-scanning call) — which was then
  itself replaced with **Project Orbit**, at Jasmine's explicit request,
  after she saw it built first as a Playground experiment and decided she
  wanted it as the primary navigation instead of an addition. That's a
  real, knowingly-accepted step back from "every project visible without
  an interaction": only the active planet's full details show at once,
  with neighbors as peek-only circles. See the **Project Orbit** entry
  below for how it works; `.planet-card` and `.view-case` are still
  shared with the About section's `.doodle` tooltips (see below) — don't
  delete them when touching Projects, even though Projects itself no
  longer uses `.planet-card`.
- `case-studies/` — one HTML page per case study (`comet-commute.html`,
  `elevator-accessibility.html`, `dreamscape.html`), real UT Dallas
  coursework/designathon projects with real research, decisions, and
  outcomes. Each sets `--case-accent` on `<body>` (a rainbow token matching
  its planet's color) that themes its back-link, chapter numerals, quote
  marks, and list bullets. Reuses `.page-hero`, `.card`, `.btn`, and the
  shared nav/footer rather than introducing new page chrome. Lucky's First
  Day has no page here — it's an existing standalone site, linked to
  directly.

  The layout is a wide "presentation deck" (redesigned per a reference
  Jasmine shared, laurenlangdesign.com/supplierone) rather than a narrow
  centered blog column — a ~1320px-wide stage, large numbered chapter
  headers, alternating full-width/split/text sections, and generous
  spacing, so the page reads like a UX design review instead of an
  article. It's **deliberately kept on the site's own dark cosmic
  background + pastel accent palette** rather than that reference's white
  one — a full light-mode version of the whole site was tried earlier and
  explicitly rejected ("I don't like it"), so this widens/re-paces the
  layout without touching that decision; don't reintroduce a white/light
  background here even if a future reference calls for one without
  checking first.

  Every case study follows the same 7-chapter structure — Hero → Overview
  → Research → Process → Design Iterations → Final Solution → Results →
  Reflection — via a shared `.case-chapter` component system:
  - `.case-mockup` (full-bleed, 16:9) for the hero's featured image and
    Final Solution's large edge-to-edge mockup.
  - `.case-quickfacts` — Role/Timeline/Team/Tools as a wide underlined
    strip under the hero, not a boxed card.
  - `.case-chapter` / `.case-chapter--tint` — one wide section per
    chapter, alternating a faint background wash every other chapter (the
    brief's "background changes between sections," done as a soft wash
    rather than a hard block). `.case-chapter-header` is the large
    numbered heading (`<span class="num">01</span><h2>…</h2>` + a
    trailing rule) that acts as the chapter break.
  - `.case-overview-grid` — Problem/Goal/Impact as three `.card`s in
    Overview, instead of paragraphs. "Impact" is honestly marked
    `.tbd`/`[TBD]` on all 3 pages, since none of these projects have
    shipped — never invent a metric here (rule 6).
  - `.case-callout-grid` + `.case-quote` — Research findings as callout
    cards, plus a large quote-block device. Since no real user quotes
    exist yet for any of the 3 projects, every `.case-quote` used for an
    actual quote is filled with `[TBD — add a real quote…]` text and a
    generic `<cite>Research participant</cite>` rather than a fabricated
    line; `.case-quote` is also reused (without the `<blockquote>`/`cite`)
    for pulling an *existing* sentence out of the surrounding prose into
    a mid-chapter standout — that reuse is fine, inventing the quoted
    words is not.
  - `.case-split-visual` / `.case-split-visual--reverse` — Process's
    alternating image-left/text-right and text-left/image-right layout.
  - `.case-visual-box` (4:3) — the general-purpose placeholder image box:
    process diagrams, `.case-gallery` design-iteration tiles, research
    artifacts. Each `<img>` points at a small placeholder SVG in
    `images/` (a dashed frame + the site's spark glyph, in that page's
    accent color) — see the `images/` entry below for the swap-the-file
    pattern.
  - `.case-feature-split` — Final Solution's feature highlights, in
    `.card`s under the big mockup.
  - `.case-impact-grid` — Results' large numbers/impact cards. Same rule
    as Overview's Impact card: no real metrics exist for any of these
    projects, so every `.num` holds `<span class="tbd">[TBD]</span>`,
    never an invented figure.
  - `.case-reflection` / a closing `.case-list` — Reflection's lessons
    learned, kept as whatever real form each case study already had
    (prose for Comet Commute/Elevator, a bullet list for DreamScape).

  Apply this same chapter structure to any new case study rather than
  inventing a different format per page — and if a case study doesn't
  cleanly have all 7 beats yet (e.g. no real "Results" data), keep the
  chapter and mark its content `[TBD]` rather than skipping the chapter
  or fabricating content to fill it.
- `images/` — the one exception to "no raster/external image assets": 5
  small swappable placeholder SVGs (`doodle-1.svg`…`doodle-5.svg`) used in
  the About section; 9 more for the case studies —
  `case-<project>-research.svg`, `case-<project>-solution.svg` (or
  `-prototype.svg` for DreamScape), and `case-<project>-wide.svg`, for
  `comet`/`elevator`/`dreamscape`; and 4 more (`orbit-comet.svg`,
  `orbit-elevator.svg`, `orbit-dreamscape.svg`, `orbit-lucky.svg`) for
  Project Orbit's planets — these reuse the exact motif from each
  project's Projects-section thumbnail (circle, elevator shaft, crescent
  moon, zigzag path) recomposed to fill a square so it crops well into a
  circle, rather than a generic placeholder shared across all 4. All are
  meant to be directly overwritten with Jasmine's own art or real
  screenshots — no HTML/CSS edits needed, just replace the file, the same
  swap-the-file pattern as the About page's doodle slots. Each is a
  dashed frame + the site's spark glyph in that page's accent color;
  `object-fit: cover` on `.case-mockup img`/`.case-visual-box img`/
  `.orbit-planet img` crops any real image cleanly regardless of its
  actual aspect ratio, so the same placeholder file can be (and currently
  is) reused across more than one slot on a page. Follow this same "real
  file in `images/`, referenced by `<img src>`"
  pattern for any future image slot rather than an inline-SVG placeholder
  or a text-only callout. `mascot-astronaut.png` (hero section) is the one
  file in this directory that isn't a placeholder — it's Jasmine's real,
  final character art, resized/compressed on intake (from a 2048px/1.3MB
  source down to 1024px/~390KB, since the mascot never displays wider than
  ~380px) rather than served at its original resolution.
- **Doodle Mail** (`#panel-doodlemail` in `index.html`, `initDoodleMail()`
  in `js/main.js`) — a draw-and-send guestbook on Playground's second tab.
  The canvas (color picker, brush size, eraser, undo, clear, pointer-event
  drawing so mouse/trackpad/touch all work) is fully real and needs no
  setup. Sending the doodle by email depends on
  [EmailJS](https://www.emailjs.com) — a free serverless send-from-the-
  browser service, chosen so this stays a static site with no backend to
  host. `EMAILJS_CONFIG` in `js/main.js` holds three `[TBD: ...]`
  placeholders (public key, service ID, template ID) that only resolve
  once Jasmine creates her own EmailJS account, an Email Service, and an
  Email Template with `from_name`/`from_email`/`message`/`doodle_image`
  params (`doodle_image` mapped to a dynamic attachment in the template;
  the template's own "To" address is where her inbox is set, not in this
  code). Until those are filled in, Send shows an honest "not set up yet"
  message — same pattern as the Contact section's unwired form — rather
  than silently failing or faking success. The EmailJS SDK itself is
  lazy-loaded from its CDN only at the moment someone presses Send, so
  visitors who never open the tab (or who doodle without sending) never
  pay for that request; see rule 3 above for why this dependency exists.
  A `DOODLE_DAILY_LIMIT` constant (`js/main.js`, default 3) caps sends per
  browser per day via `localStorage` — this is a courtesy speed bump
  against casual over-sending, explicitly **not** real spam protection
  (clearing storage, a private window, or a different browser all get
  around it). Actual abuse protection belongs server-side, i.e. in
  EmailJS's own account dashboard (its monthly send quota, optionally
  reCAPTCHA) once `EMAILJS_CONFIG` is filled in — don't present the
  client-side counter as more than what it is if extending it.
- **Project Orbit** (`class="orbit-section"` in `index.html`'s `#projects`,
  `initProjectOrbit()` in `js/main.js`) — the Projects section's project
  navigation: a drag/swipe/wheel/arrow-key/button carousel of the 4
  projects as large circular "planet" cards, the active one centered and
  biggest with neighbors peeking in on either side. First built as an
  *additional*, exploratory Playground-tab experiment alongside the
  always-visible `.constellation-card` grid that was Projects' section at
  the time (so a recruiter skimming the page never had to discover an
  interaction to see what Jasmine had built) — then, once Jasmine had
  actually seen it running, she asked for it to fully replace that grid
  instead, a real and knowingly-accepted step back from "every project
  visible without an interaction." **If asked to redo Projects again,
  Project Orbit is the current, intended state — don't reintroduce the
  constellation grid without being asked.** Each planet is currently
  placeholder line-art (`images/orbit-*.svg` — the same abstract-icon
  language the old Projects-grid thumbnails used: a circle for Comet
  Commute, an elevator shaft, a crescent moon, a zigzag path — in that
  project's accent color), not a real screenshot, since none of the 4
  projects have a real hero image/mockup/screenshot yet (rule 6); swap
  the file for a real circular crop later, `object-fit: cover` handles
  any aspect ratio. Sizing and centering math lives in JS (not pure CSS):
  `render()` computes each planet's *target* width from its distance
  from the active index, then translates `.orbit-track` so the active
  planet's center lands in the deck's horizontal center — done from
  target widths rather than read-mid-transition layout, so the centering
  is correct even while the resize/scale transition is still animating.
  The "cinematic zoom" into a case study on click is the same sitewide
  cross-document View Transition used everywhere else (top of
  `css/style.css`) rather than a bespoke one-off animation — reuse that
  instead of building a parallel transition system if this needs to feel
  more dramatic later. A `dragMoved` flag suppresses the native click a
  browser still fires on an `<a>` right after a drag-release, so swiping
  to browse never accidentally opens a project.
- `css/style.css` — the entire design system and every component's styles.
- `js/main.js` — nav toggle/scrollspy active-link logic, the comet trail,
  starfield generation, Project Orbit, the Playground tabs, and Doodle
  Mail.
- `README.md` — one-line project description.
- Remaining placeholder content: the About section's sketchbook doodle art
  (each should become a drawing of a personal object) and fun-fact
  captions (each a fun fact about Jasmine tied to that object), the
  Experiments tab of Playground, Doodle Mail's EmailJS keys (see above),
  and the contact form's backend wiring — see rule 6.

## Available skills

See `.claude/skills/` for task-specific helpers:
- `ux-case-study` — draft or restructure a case study section in this
  site's voice and visual system.
- `design-audit` — check a change against the design tokens and
  accessibility rules above before calling it done.
- `add-project-card` — scaffold a new project card or section that reuses
  existing component patterns.

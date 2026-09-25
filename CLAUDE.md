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

## Current state (Sept 2026 overhaul): read this first

A five-phase pass (placeholders, test plans, positioning, accessibility,
cleanup) changed several decisions described further down. Where an
older entry below conflicts with this list, **this list wins**:

- **Positioning**: Jasmine is a senior (ATEC, UT Dallas) positioning as a
  *product designer focused on accessibility and inclusive design*
  (Jasmine asked not to lead with "neuroinclusive": she is neurodivergent
  but doesn't want it as the portfolio's main focus, so keep it out of
  headlines and taglines),
  seeking Summer 2027 UX/Product Design internships. Title everywhere is
  "Product Designer ✦ Illustrator" (`<title>`, hero eyebrow, meta).
- **Hero**: no "Hi! I'm". The `<h1>` is her hand-drawn wordmark
  (`alt="Jasmine"`) plus "Bontha" in type, tucked into the empty space
  under "asmine" (`.hero-surname`; see its CSS comment before resizing).
  Then a lede, an ATEC/internship line, and "View my work" + "Resume"
  (`.btn--ghost`) buttons.
- **Page order**: hero → Projects → About → Playground → Contact →
  footer. Project order (homepage and case-study prev/next):
  Elevator Accessibility → DreamScape → EcoLink → Comet Commute → back.
- **Nav**: one left-to-right row in page order: hand-drawn logo, Projects,
  About, Playground, Contact, Resume, then Calm mode. At Jasmine's request
  (Sept 2026) the logo moved from the centered middle slot to the far
  left; this supersedes the "keep the logo in the middle" notes under
  "Spacing & layout" below. `.nav-inner` is a 7-column grid with
  `justify-content: space-between` and the `<ul>` joins it as a
  `subgrid`, so every item gets the same gap. Keep that when adding or
  removing a link (update the `repeat(5, auto)` counts and `grid-column`
  spans). The logo is also first in the markup, outside the `<ul>`. The
  menu button has `aria-controls="primary-links"`, closes on Escape, and a
  closed mobile menu uses `visibility: hidden` so it can't be tabbed into.
  Same markup on all 7 pages. On mobile: logo left, menu + Calm buttons right.
- **Nav logo**: `images/logo-jb.png`, Jasmine's hand-drawn "JB" monogram
  with a star. Her source file (`Untitled_Artwork 16.png`) also has a
  white handwritten "you matter." beside it; she asked for that removed,
  so only the monogram's connected shape was kept (the letters were
  separate shapes in the art). Saved at 192px tall (3x), displayed at
  `height: 56px` (48px on mobile). The nav has less left padding
  (`3.5%`) than the rest of the page so the logo sits near the left edge,
  at her request. The hero `<h1>` still uses the separate
  `images/logo-jasmine.png` "Jasmine" wordmark; don't merge the two.
- **Calm mode**: `.calm-toggle` in the nav (`aria-pressed`), class
  `html.calm` set by an inline `<head>` script on every page before first
  paint (localStorage key `calm`, try/catch; defaults on under
  `prefers-reduced-motion`). Stops all motion, hides shooting stars/grain/
  glows/comet trail/custom cursor, dims stars and squiggles, raises
  `--text-dim`/`--text-mute`. JS effects check `isCalm()` at event time.
  Any new animation or motion effect must respect both `html.calm` and
  `prefers-reduced-motion` (the global rules cover CSS animations and
  transitions, including pseudo-elements; JS-driven motion needs its own
  `isCalm()` check).
- **Contrast**: the aurora (`body::after`), bottom glows (`body::before`)
  and `.hero-glow` were dimmed about 40% so `--text-mute` stays at or above
  4.5:1 even over the brightest glow. `.project-spread` and `.sticker-card`
  have solid backgrounds (`color-mix(in srgb, white 7%, var(--bg))`), not
  translucent ones. Form fields have a `--text-mute` border (3:1). Re-check
  contrast before brightening any glow or making a text panel translucent.
- **Playground**: a responsive grid (`repeat(auto-fit, minmax(260px,
  1fr))`), not the horizontal scroll-snap deck, and no "scroll for more"
  label. The deck description further down is history.
- **Experience section**: doesn't exist; its markup, CSS and scroll-spy
  entry are gone. If it comes back, use the real internships on her resume
  (`files/Jasmine-Bontha-Resume.pdf`), not placeholders.
- **About**: new bio plus a `.about-facts` list (Currently / Tools /
  Outside design). Only three finished fun-fact doodles remain (sewing,
  heritage, horror), still on the placeholder spark art, which Jasmine
  chose to keep for now.
- **Case studies**: "Results" became **"What I'd test next"** (prose test
  plans, no metric blocks). The Impact card says there's no usage data and
  points there. Real, credited-without-names interview quotes are in Comet
  Commute and Elevator. Quick facts: four short facts, then a
  `.qf-wide`/`.qf-full` second row for "My contributions"/"Feedback".
  Comet Commute and Elevator share the same team (Pj Jones, Jackson Lux,
  Neal Tembe, Jasmine). DreamScape was a 4-person team; Jasmine led visual
  design and hand-sketched the wireframes (`case-dreamscape-sketches.jpg`).
  Its placeholder research image was replaced by four "how a nightmare
  feels" cards from the team's research doc.
- **EcoLink** has no asterisk anywhere (it's still baked into the app
  screenshots themselves, which can't be fixed in code).
- **Footer**: a minimal footer on every page (links incl. Email/LinkedIn/
  Resume, an accessibility note, copyright). The "Thanks for stopping by /
  GET IN TOUCH" block is gone; contact lives in `#contact`.
- **Resume**: `files/Jasmine-Bontha-Resume.pdf`, opens in a new tab, linked
  from hero, nav, contact and footer. Jasmine chose to publish it with her
  phone number on it.
- **Testing without Playwright**: headless Chrome works
  (`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  --headless=new --screenshot`). Its minimum window width is 500px, so
  check phone widths by loading the page in a 375px `<iframe>`.
  `--enable-logging=stderr` prints console errors.

## Tech stack & constraints

- Static single-page site: `index.html` holds Home/About/Projects/
  Playground/Contact as one continuous page with anchor sections
  (`#about`, `#projects`, `#playground`, `#contact`); nav links scroll to
  them instead of loading separate URLs (see "Single-page navigation"
  below). `case-studies/*.html` and `playground/*.html` are the exception
  — full project write-ups and Experiments-tile detail pages stay as
  separate pages linked out from the Projects and Playground sections
  respectively, the way a one-pager still needs somewhere to put real
  depth. Shared
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
- Exception: `videos/` (new top-level folder, sibling to `images/`) holds
  Jasmine's own real animation clips (`.mp4`/`.gif`) for the Playground
  Animations page — the site's first video assets. Same "real file,
  reference it directly, no build step" philosophy as the image
  exceptions above, just a different media type; see the `playground/`
  entry further down for the full detail (file list, poster-frame
  generation, why `preload="metadata"` matters here).

## Design system

Reuse these tokens rather than inventing new ones so the site stays visually
coherent as pages are added. Defined as CSS custom properties at the top of
`css/style.css`.

### Art direction: Jasmine's own Carrd site (current palette)

The whole palette was shifted to match a site Jasmine designed herself,
**sqeakerz.carrd.co** (she shared a screenshot, since the site's CSS
couldn't be fetched from this environment): a deep, saturated **cobalt
navy** night sky with white/periwinkle four-point sparkles, a **vivid**
rainbow (lime → sky → violet → magenta banner, full saturated rainbow in
her art), electric cobalt accents, and **violet buttons**. This replaced
the earlier *Bee and PuppyCat* dusty-pastel palette (and before that, a
deep indigo `#1c1840`). What did NOT change: it's still a dark theme
(a full light/cream mode was tried long ago and rejected, so don't bring
that back), `Baloo 2` is still the display font, and every token kept
its **original name** (`--c-red`, `--d-blue`, `--text`, etc.) with a new
value, so every rule reading `var(--c-red)` picked up the new palette
with no other changes. Keep extending the palette this same way (new
value, same slot) rather than adding parallel tokens.

**Color** — two tiers of the same rainbow. Soft (`--c-*`) is the vivid
decorative tier for use on the dark background (glows, thin borders,
dots, text accents); deep (`--d-*`) is for white text sitting on a
button/badge fill and for text on the light `--paper` surface. **Never put
white text on the soft tier.** Every pair below was contrast-checked at
build time (soft tier ≥ 5.8:1 on `--bg`; deep tier ≥ 5.1:1 against both
white and `--paper`); verify any new slot the same way rather than
eyeballing it. After the first pass Jasmine asked to "tone down the
saturation a little bit": every color in this palette (surfaces, both
tiers, glows, stars, shadows, mockup backgrounds) was scaled to 80% of
its HSL saturation with hue and lightness held, and the values below are
that toned version. Nudge by that same kind of uniform scaling if asked
again, rather than changing individual hues.

| Slot | Soft (`--c-*`, decorative on dark) | Deep (`--d-*`, white-on-fill / text-on-paper) |
|---|---|---|
| Red | `#f17d89` | `#b13556` |
| Orange | `#eea663` | `#98521c` |
| Yellow | `#efd96e` | `#6e580c` |
| Lime green | `#90e369` | `#28713e` |
| Sky / cobalt blue | `#6cbeef` | `#3058c3` |
| Violet | `#b79ff4` | `#7253d0` |
| Magenta (accent only) | `#dc7bf0` | — (reuse `--d-red` if needed) |
| Cyan (accent only) | `#60dbed` | — |

Surfaces: `--bg` `#161966` (cobalt navy), `--bg-soft` `#1f247b`,
`--nav-bg` `#0e1045` (the darker navy of the Carrd site's center column;
also the top of the `.card` gradient), `--paper` `#f4faf8` (the Carrd
card's pale mint-white), `--ink` `#1d2162`. Text on dark: `#ffffff` /
`#dde0fb` / `#b0b6e5` (heading / subhead / muted, all ≥ 7.7:1 on `--bg`).
Shadows are tinted deep navy (`rgba(7, 8, 36, …)`), not plum or black.
Spark glyphs and the starfield (`STAR_COLORS` in `js/main.js`) are mostly
white and periwinkle (`#e2e7fc`, `#9aa9f4`) like the Carrd sparkles, with
a few magenta/sky pops; the old warm-gold sparks are gone. The baked-in
backgrounds of the case-study mockup JPGs were remapped from the old
indigo `(36, 31, 71)` to the new navy with a Pillow 3D LUT that only
touched that background and its drop shadows, so the mockups still sit
flush on the page. Any new composited image should use `(22, 25, 102)` as
its background.

`--gradient-rainbow` (red→orange→yellow→lime→sky→violet) is the site's
signature: nav underline, comet trail, hero ribbon, `.gradient` text
accent. Buttons are deliberately solid color, now `var(--d-purple)`
(violet, like the Carrd buttons), not gradient; a past `--gradient-cta`
two-hue gradient was removed from `.btn` on purpose, so don't reintroduce
a gradient fill there. Don't introduce off-palette colors; extend by
opacity/tint of the rainbow set instead.

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
  file), is reserved for "meta" marks like `.eyebrow` labels. Deliberate — a technical/
  editorial mono against the display and body faces is what keeps the
  type system reading as considered rather than one sans-everywhere
  template. Don't reuse it for body copy or headings.

**Editorial asymmetry** — a deliberate reaction against "generic AI
portfolio" tells (perfectly centered layouts, identical padding on every
section, symmetric everything): section padding is intentionally uneven
(see the `section[aria-label=...]` / `.contact-body` overrides just below
the base `section` rule in `css/style.css`, rather than one flat value
everywhere). Extend that uneven rhythm to any new top-level section rather
than giving it the same padding as its neighbors. (There used to also be a
`.section-mark`, a small sideways "№ 01 — About" running-head label in the
left margin of each section. Jasmine asked for those removed, markup and
CSS both, so don't bring them back.) `.contact-grid`
is a deliberately asymmetric `.82fr 1.18fr` split (not an even 1fr/1fr)
for the same reason. Playground's Experiments tiles (`.playground-deck`)
are a horizontal scroll-snap "slide deck" rather than a static grid —
`display: flex; overflow-x: auto; scroll-snap-type: x proximity`, each
`.sticker-card` a fixed-width flex item (`.sticker-card--wide` just a
wider `flex-basis`, not a column span), so you scroll/swipe sideways
through them like flipping through a stack. Native CSS scroll-snap, no
carousel library (rule 3) — trackpad, wheel, touch, and keyboard (the
deck is `tabindex="0"`) all just work without JS. 3 tiles currently:
**Animations** (`playground/animations.html`) is real — a gallery of 6
of Jasmine's own animation clips, real one-line tile summary too (see
the `playground/` entry further down for the full detail); it's the
deck's plain-link-to-a-`playground/*.html`-page pattern (same as
`.project-visual` in Projects) but no longer a `[TBD]` placeholder
behind that link. **Color Studies** (`playground/color-studies.html`)
has a real one-line summary on its tile ("Some studies I've done on
color!") even though the page it links to is still the same
`[TBD]`/"Coming soon" placeholder template — a tile's `<p>` can be real
ahead of its page being real; don't assume the two stay in lockstep. It
replaced an earlier **Sketch Dump** tile/page, which was itself removed
once **Lucky's First Day** took its slot in the deck (see below) — the
`sketch-dump.html` file and its tile no longer exist; don't re-add a
dangling link to it. **Lucky's First Day** is the deck's other exception
to the placeholder pattern: real, finished illustration work moved here
from the Projects list (see the EcoLink/Lucky's First Day entry above)
rather than a `[TBD]` experiment — it links straight out to its existing
standalone site (`target="_blank" rel="noopener"`, the same real title
and summary it had in Projects) since there's no page for it in this
repo, instead of to a `playground/*.html` placeholder. Every tile carries
a `.sticker-thumb` — a small full-bleed placeholder line-art SVG per
tile, in each tile's own accent color (`images/playground-animations.svg`
teal, `-color-studies.svg` gold — overlapping color-swatch circles,
replacing the old `-sketch-dump.svg` purple-pencil motif once Sketch
Dump's tile/page were removed, since that motif no longer matched
anything — `-lucky.svg` rose pink), pulled flush to the card's top edge
via negative margin, `object-fit: cover` at a 16:9 aspect ratio,
`.sticker-card` given `overflow: hidden` so the bleed clips to the card's
own radius — same "real file in `images/`, swap the file" pattern used
everywhere else on the site (rule 4). This was briefly removed by a
round of hand-edits mid-session and re-added — if it goes missing again,
re-add the `<img class="sticker-thumb" src="images/playground-*.svg"
alt="...">` as the first child of each `.sticker-card` rather than
assuming it was intentionally dropped. `.sticker-card` picked up
`display:block;
text-decoration:none; color:inherit;` to still read as a card rather than
a link, plus a small `.sticker-view` "View →" line so the tile's
clickability is legible at a glance rather than relying on the hover-lift
alone. Tiles originally alternated a slight scattered-sticker tilt
(`.sticker-card:nth-child(odd)`/`(even)`, a few degrees each way, echoing
the "sticker" name) before Jasmine asked for that removed in favor of a
straight, level deck — the same call she'd already made for the Projects
list (see its entry further down) — don't reintroduce the alternating
tilt without checking with her first. The hover interaction itself was
then simplified too: `.sticker-card:hover` used to also carry the
sitewide magnetic cursor-tilt (`perspective`/`rotateX`/`rotateY` off
`--tilt-x`/`--tilt-y`) plus a `scale(1.02)`, layered on top of its lift;
Jasmine asked for that pared back further, so it's now just the lift
(`translateY(-7px)`) with the existing border/shadow color change —
`initTiltCards()` in `js/main.js` no longer includes `.sticker-card` in
its selector (`.card` only now), so no unused tilt math runs for tiles
that don't render it. Don't re-add the magnetic tilt/scale to
`.sticker-card` without checking with her first; `.card` elsewhere is
unaffected and keeps the full effect. Each `playground/*.html` page
reuses the same nav/
footer/view-transition boilerplate as `case-studies/*.html` (`data-page=
"playground"` so the nav highlights correctly, `--case-accent` set to a
rainbow token per page — teal for Animations, gold for Color Studies)
but deliberately skips the full 7-chapter
case-study structure (Role/Timeline/Team/Tools etc. would be fabricated
for a loose experiments category that isn't a project) — just a
`.page-hero` title/hook and a single `.card` marked `[TBD]`/"Coming soon"
explaining the page is a placeholder, per rule 6. Follow this same
lightweight template (not the full case-study chapter system) for any
other Playground sub-page.

**Type weight scale** — `h1`/`.hand` 800, `h2` 700, `h3` 600 (all
`Baloo 2`) — a real step down in weight per level, not one flat 700
everywhere, so hierarchy reads from weight as well as size. Follow this
scale for any new heading level rather than defaulting new headings to
700.

**Cards: solid and bordered, not glass** — `.card`/`.sticker-card` use a
visible `1.5px` border, except `.card` itself, which Jasmine asked to have
**no outline at all** (`border: none`; the darker fill alone separates it
from the page, so don't add a border back). `.card` is a **solid fill darker than
the page**, not a translucent white wash, at Jasmine's request: a slight
160deg gradient from `var(--nav-bg)` (`#161233`) down to
`color-mix(in srgb, var(--nav-bg) 78%, black)`, derived from existing
tokens rather than a new color. (`.sticker-card` keeps its own
translucent fill.) Their hover state (clickable cards only) is a color-changed
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
- **No hover on things that don't do anything.** Jasmine's rule: only
  cards/tiles that are real links or buttons react to the mouse. A hover
  lift promises a click, so a static card that moves and then does
  nothing on click feels broken. `.card:hover` is scoped to
  `a.card:hover, button.card:hover`, `initTiltCards()` only selects
  `a.card, button.card`, the About fallback list's dot glow was removed,
  and `.project-spread` no longer lifts as a whole (see the Projects list
  entry). Static content cards (case-study Overview/Research/feature
  cards, `playground/color-studies.html`'s placeholder card) stay still.
  Decide whether a new card is clickable before giving it any hover state.
- Clickable `.card`s (links/buttons) get a magnetic cursor-tilt on hover
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
- Cosmic theme, dark cobalt-navy background with the Carrd-inspired
  accent palette (see "Art direction" above): starfield background
  (`.stars`, mostly white/periwinkle sparkles), soft radial-gradient glows,
  occasional shooting stars (`.shooting-star`, in the fixed `.shooting-stars` layer
  on `index.html` only — long idle cycle, brief streak, so they're rare
  rather than a constant repeating effect), and a chibi
  astronaut-with-bunny-ears mascot (nods to "rabbit enthusiast").
  The hero's drifting clouds (`.hero-clouds`) were removed at Jasmine's
  request, markup and CSS both; don't reintroduce them without
  checking. Background planets/moons (formerly `.bg-planets`) were removed at
  Jasmine's request — don't reintroduce them without checking with her
  first.
- **The sky stays put**: `.stars`, `.grain`, `.shooting-stars`, and the
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
- The 4-point spark/sparkle mark (`✦`, drawn as a small inline SVG) is a
  recurring accent — logo, galaxy core, hero ribbon tip. Reuse it as a
  bullet/flourish rather than inventing a new icon for the same job.
- Cards (`.card`): translucent white fill, soft border, rounded corners
  (`30px`), lift + glow on hover only when the card is a link or button.

**Spacing & layout**
- Horizontal page padding: `8%`–`10%` (`6%` on mobile).
- Nav is fixed, `76px` tall, with the rainbow gradient as a 4px strip
  along its bottom edge. Nav links read About / Experience / Projects /
  **logo** / Playground / Contact — the logo sits in the middle slot,
  which was originally an evenly-spaced 2-before/2-after row (a specific
  storyboard detail) until the Experience link was added between About
  and Projects, making it 3-before/2-after; that's an accepted, expected
  consequence of an odd number of links around a fixed-position logo, not
  something to "fix" back to even by moving the logo. Don't move the logo
  out of the middle slot without checking with Jasmine. The logo itself
  (`images/logo-jasmine.png`, `.logo-mark` in `css/style.css`) is
  Jasmine's own hand-drawn signature wordmark — a rainbow-gradient
  cursive "Jasmine" with a comet swoosh and the site's spark glyph above
  it — real art, not a system-font rendering of her name. It replaced the
  original plain-text `Jasmine` + inline spark-SVG logo (which is why the
  old `.spark`/`.logo .spark` CSS rules and `class="spark"` SVG markup
  were removed sitewide once nothing referenced them anymore — don't
  reintroduce that pattern for the nav logo specifically without
  checking; the general spark *glyph* itself is still very much in use
  elsewhere under other class names like `.hero-spark`/`.mini-spark`/
  `.ribbon-spark`). `.logo-mark` is sized by `height` (currently `52px`,
  bumped up from an original `44px` at Jasmine's request so her name reads
  a bit more prominently against the rest of the nav text), not `width`,
  so the source art's own proportions (a wide signature with a swoosh
  well above the letterforms) stay intact rather than being stretched
  into a fixed box — if this ever needs to be bigger/smaller, adjust that
  one `height` value rather than adding a `width`. The same `<img>`
  markup is repeated in `index.html` and all 4 `case-studies/*.html`
  pages (each with its own relative `../images/` path) — update every
  copy if the logo file or its markup ever changes. The hero's `<h1>`
  ("Hi! I'm" + the name) swaps in this same wordmark image
  (`.hero-name-mark`) in place of what used to be a plain-text `Jasmine`
  styled solid periwinkle (`.name-solid`, now removed as dead CSS since
  nothing else used it) — keep both nav and hero pointed at the same
  `images/logo-jasmine.png` file rather than exporting a separate crop
  for the hero. The name sits on its own line below "Hi! I'm" — `display:
  block` alone forces that break (no `<br>` in the markup; a trailing
  `<br>` immediately before a block box is redundant and risks an extra
  blank line in some browsers) — and noticeably larger than the
  surrounding text (`height: 2.2em`, sized off the heading's own
  responsive `clamp()` font-size rather than a fixed pixel height) so it
  reads as the focal point of the greeting. `margin-top: -.25em` pulls it
  up toward "Hi! I'm": the source PNG's own canvas is roughly 36% dead
  space above the actual letterforms (the comet swoosh arcs well above
  "Jasmine" before the letters begin — measured directly off the file's
  alpha channel, not eyeballed), so without that negative margin the
  image's *box* sits close but the visible *letters* end up floating well
  below "Hi! I'm" with an oversized gap; the negative margin compensates
  for that dead space so the letters — not the empty swoosh area — are
  what visually aligns with the line above. A first pass used `-.55em`,
  which read as too much overlap; Jasmine asked for just a slight overlap
  instead, so it was dialed back to `-.25em`, paired with `text-indent:
  .2em` on `.hero-text h1` to nudge "Hi! I'm" itself right (that
  text-indent only touches the h1's first line, so it doesn't also shift
  the wordmark below it). Re-balance both together if this needs another
  pass, not just the margin alone — and re-measure the dead-space ratio
  before changing `.hero-name-mark`'s height again, rather than reusing
  either value at a different size. This whole treatment (own line,
  sized up, pulled up to align) came out of a few rounds of Jasmine's
  direct feedback — earlier versions kept the name inline with "Hi! I'm"
  at a smaller size with a trailing spark glyph (`✦`) after it, both of
  which she asked removed; don't reintroduce either without checking with
  her first.
- **Nav color**: `var(--nav-bg)` (`#161233`, a smidge darker than
  `var(--bg)`) with light text (`var(--text)`, and the per-link accents
  use the `--c-*` soft/pastel tier) — **not** the light `--paper` surface
  used elsewhere (planet-card tooltips). Those two are deliberately
  different surfaces now; don't merge the nav back onto `--paper` or its
  text back onto `--ink`/`--d-*`, which were calibrated for a light
  background. Below the nav, `.site-nav::after`
  hangs a puffy scalloped fringe (same color as the nav, a repeating row
  of circles, not an SVG/raster asset) so the bottom edge reads as a
  cloud silhouette instead of a hard flat line — "make it look like
  clouds." Reuse that repeating-radial-gradient-circle technique for any
  future cloud-edge treatment rather than hand-drawing an SVG cloud path.

## Single-page navigation

`index.html` is one continuous page — About/Experience/Projects/Playground/
Contact are `<section id="about|experience|projects|playground|contact">`
anchors, not separate URLs, and nav/footer links point at `#about` etc.
(the logo points at `#top`, an id on `<body>`). Two mechanics make this
work and matter if you touch nav or section markup:
- `#about, #experience, #projects, #playground, #contact { scroll-margin-top: var(--nav-h); }`
  in `css/style.css` — without it, a clicked anchor lands with its heading
  hidden under the fixed nav.
- `initScrollSpy()` in `js/main.js` (IntersectionObserver-based) toggles
  `.is-active` on the nav link matching whichever section is currently in
  view, replacing the old "highlight based on which page you're on" logic.
  It only activates if those section ids exist in the DOM, so it's a no-op
  elsewhere.

`case-studies/*.html` and `playground/*.html` are the exceptions to
"single page" — full project write-ups and Experiments-tile detail pages
stay as separate pages linked from the Projects and Playground sections
respectively (a one-pager still needs somewhere to put real depth). Their
nav/footer/back links point at `../index.html#about` etc. (case studies)
or `../index.html#playground` (playground pages); keep that pattern for
any new page in either set. Their own `initNav()` still uses the older
`body[data-page]` static match (case studies set `data-page="projects"`,
playground pages set `data-page="playground"`), since scroll-spying
doesn't apply to a page that isn't the anchor-section one.

## Comet trail

The nav-underline's rainbow strip visually continues down `index.html` as
one filled ribbon (`.comet-trail` markup, driven by `initCometTrail()` in
`js/main.js`, guarded so it's a no-op if that markup isn't present — which
is why it's absent from `case-studies/*.html`). Because the whole site is
now one page, the trail runs the full length of it — hero through footer,
including the About/Experience/Projects/Playground/Contact sections — not just a short
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
- Project writing (case studies, Projects cards, captions, alt text, page
  titles) should sound natural and human, lead with the people and how
  they feel before the features, and use **no em dashes** (use commas,
  periods, colons, or parentheses instead, not en dashes as a stand-in).
  Jasmine asked for this across all 4 case studies. Warmer never means
  invented: the no-fabrication rule below still applies.
- Keep the tagline voice ("UX DESIGNER • PRODUCT DESIGNER • ARTIST") — short,
  uppercase, letter-spaced labels for meta info; warmer sentence-case for
  body copy.

## Engineering & design rules

1. **Accessibility is non-negotiable.** All body text must meet WCAG AA
   contrast (4.5:1) against its background; large display text meets AA
   large-text contrast (3:1). Every `<img>` needs meaningful `alt` text
   (decorative images get `alt=""`). Use semantic HTML (`nav`, `section`,
   `footer`, heading levels in order) — don't reach for `div`-soup. A full
   pass found and fixed several real violations of this rule (Jasmine
   asked "is my site ADA compliant" — in practice ADA compliance is
   measured against WCAG, so this is that audit): (a) the About section's
   `.planet-card` hover/focus tooltips used `<h4>` directly under the
   "About" `<h2>` with no `<h3>` between them — changed to `<h3>` to match
   the level `.doodles-fallback` already correctly used for the same
   content; (b) `.tbd`'s sitewide color (`--text-mute`) is calibrated for
   the dark page background (6.5:1 there) but dropped to ~2.5:1 inside
   `.planet-card`'s light `--paper` surface — added a scoped
   `.planet-card .tbd` override (`#5c5780`) landing at an equivalent
   ~6.5:1 against paper; any other spot that puts `.tbd` on a light/paper
   surface needs the same kind of override, not the bare sitewide color;
   (c) the main contact form (`#contact`) was missing `id="contactForm"`,
   an `action`, and the `#contactFormStatus` element entirely, so
   `initContactForm()` in `js/main.js` could never find and wire it up —
   it was silently submitting nowhere. Fixed with `id="contactForm"`,
   `action="https://formspree.io/f/xrpgwbwo"`, `id="contactSendBtn"`, and
   `<p class="contact-form-status" id="contactFormStatus" role="status"
   aria-live="polite">` in place of a stale, inaccurate "[TBD: uses
   EmailJS]" note — don't reintroduce that note, the form is real now;
   (d) added a `.skip-link` ("Skip to content", WCAG 2.4.1 Bypass Blocks)
   as the first element after `<body>` on all 8 pages (`index.html` + all
   4 `case-studies/*.html` + all 3 `playground/*.html`), jumping to a new
   `id="main-content"` on each page's `<main>` — off-screen (`top:-100px`)
   until `:focus` (`top:16px`), `z-index:1000` so it clears the fixed
   nav. Any new top-level page needs this same skip-link + `id=
   "main-content"` pair, not just the pages that existed at audit time.
2. **Mobile-first responsiveness.** Any new page or section must be checked
   at mobile widths (~375px) before being called done; add media queries
   rather than letting content overflow or truncate. The About section's
   sketchbook doodles are hover/focus-driven and hidden below 700px in
   favor of `.doodles-fallback` (a plain static list) — follow that
   pattern (a touch-friendly fallback, not just a squeezed version) for
   any other hover-only UI.
3. **No dependency creep.** Don't add a CSS/JS framework, icon library, or
   build tool to solve a problem that plain CSS/HTML already solves. If a
   real need arises (e.g. multi-page routing, a CMS for case studies),
   surface the tradeoff to Jasmine before adding it. (Playground once had
   a second tab, a canvas drawing space, that itself replaced an earlier
   "Doodle Mail" feature which briefly depended on EmailJS + Imgur to
   email drawings to Jasmine — see the "Playground" entry further down
   for that whole history. Both the email dependency and, later, the
   drawing space itself were removed; Playground is back to a single
   Experiments deck with no tabs.)
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
  previous Framer portfolio, a real photo of Jasmine (`images/
  avatar-jasmine.png`, see the `images/` entry below) displayed static in
  `.avatar-frame` — no tilt, no hover motion, at Jasmine's explicit
  request — a
  "sketchbook" of 5 doodles floating around the bio/avatar content — each
  one will be a drawing of a personal object, with its hover/focus tooltip
  a fun fact about Jasmine tied to that object; below 700px it becomes a
  static list; both the art and the fun-fact captions are still
  placeholder, see `images/` below) → `#experience` (a compact "My
  experience" strip — intro line + a row of past roles, company/role/date
  range each — adapted from a reference Jasmine shared
  (mkilgoredesign.com); every entry is `[TBD]` since this is real
  biographical content Jasmine hasn't supplied yet, not something to
  invent, see rule 6 and the entry further down) → `#projects`
  (a stacked list of the 4 projects — Comet Commute, Elevator
  Accessibility, DreamScape, EcoLink — each a "project spread": one
  unified bordered card split into a text half (title, one-line summary,
  tag pills, CTA) and a photo half sharing the same outline, every
  project fully visible without an interaction, each linking out to a
  full write-up; see `case-studies/` below and the entry further down for
  how it works) → `#playground` (a
  single horizontal scroll-snap deck of loose-experiment tiles,
  "Experiments" — explicitly allowed to feel rougher than the rest of the
  site, see rule 4; content is placeholder, each tile linking to its own
  `playground/*.html` page, see the entry below. Playground used to have
  a second tab, "Free Draw," a real HTML5-Canvas drawing space — removed
  at Jasmine's explicit request; see its entry further down for the full
  history. Don't reintroduce the tab UI for a single remaining panel if
  Playground ever grows a second thing again — reconsider from scratch
  whether tabs are still the right pattern) → `#contact`
  (direct links + a contact form wired to Jasmine's own Formspree endpoint,
  see the entry below; LinkedIn is now a real link, Behance/Dribbble are
  still `[TBD]` — Jasmine's previous portfolio didn't expose them in a
  fetchable form) →
  one shared footer. See "Single-page navigation" above for how the
  anchors/scrollspy work.

  Projects has gone through three redesigns. An original hover-only
  "galaxy of planets" interaction (content hidden until hover/focus) was
  replaced with an always-visible `.constellation-card` grid (every
  project titled/described/clickable in normal document flow, a
  deliberate accessibility/recruiter-scanning call) — which was then
  itself replaced with **Project Orbit**, a drag/swipe/wheel/arrow-key/
  button carousel of circular "planet" cards, at Jasmine's explicit
  request, after she saw it built first as a Playground experiment and
  decided she wanted it as the primary navigation instead of an addition.
  That was a real, knowingly-accepted step back from "every project
  visible without an interaction": only the active planet's full details
  showed at once, with neighbors as peek-only circles. **Project Orbit
  was then itself replaced** by the current stacked `.project-spread`
  list (see the entry further down) at Jasmine's explicit request, after
  she shared a reference (wallofportfolios.in's "selected works" layout)
  — this restores "every project visible without an interaction" while
  keeping a more editorial, less grid-like presentation than the old
  `.constellation-card` version. **If asked to redo Projects again, the
  `.project-spread` list is the current, intended state** — don't
  reintroduce Project Orbit's carousel or the constellation grid without
  being asked. `.planet-card` and `.view-case` are still shared with the
  About section's `.doodle` tooltips (see below) — don't delete them when
  touching Projects, even though Projects itself doesn't use them.
- `case-studies/` — one HTML page per case study (`comet-commute.html`,
  `elevator-accessibility.html`, `dreamscape.html`, `ecolink.html`), real
  UT Dallas coursework/designathon/solo-research projects with real
  research, decisions, and outcomes. Each sets `--case-accent` on `<body>`
  (a rainbow token matching its project's accent color on the Projects
  list) that themes its back-link, chapter numerals, quote marks, and
  list bullets. Reuses `.page-hero`, `.card`, `.btn`, and the shared
  nav/footer rather than introducing new page chrome. The prev/next
  footer nav (`.case-prevnext`) cycles through all 4 in Projects-list
  order (Comet Commute → Elevator Accessibility → DreamScape → EcoLink →
  back to Comet Commute) — update all the affected `.case-prevnext` links
  in both neighboring pages if this order ever changes, not just the
  page(s) being added/removed.

  **EcoLink** (`ecolink.html`) replaced **Lucky's First Day** in the
  Projects list at Jasmine's request — Lucky's First Day had no case-study
  page here (it was an existing standalone illustration site, linked to
  directly). Lucky's First Day itself wasn't dropped from the site: at
  Jasmine's later request it moved into the Playground Experiments deck
  as a `.sticker-card` (`https://cherrieb3.github.io/Luckys-First-Day/`,
  the same external link and real one-line summary — "A non-linear visual
  narrative confronting autism stereotypes and the discomfort of new
  situations" — it had in Projects), `target="_blank" rel="noopener"`
  since it still has no page in this repo — it took the slot of a
  removed "Sketch Dump" tile, so the deck stayed at 3 tiles rather than
  growing to 4. See the Experiments-tiles entry below for how that tile
  differs from its siblings. EcoLink is a full
  UX case study built from a real
  slide deck Jasmine provided (`Bontha_Jasmine_Final.pptx`) covering
  mission, problem framing, research/evidence, competitive analysis, user
  segments, a user narrative, and real designed app screens. Unlike the
  other 3 case studies (which use abstract placeholder line-art
  throughout, since none of those projects have real screens yet), most
  of EcoLink's imagery is real: the three app screens she actually
  designed (dashboard, Climate Monitor, Drone Fleet — extracted from the
  deck and cropped into `images/case-ecolink-gallery-*.jpg`, and combined
  into `images/case-ecolink-wide.jpg` for the Hero/Final Solution mockup
  and `images/orbit-ecolink.jpg` for the Projects-list thumbnail). The
  Research/Process chapters use stock photography from the same deck
  (a camera-trap-style wildlife photo, a researcher-with-tablet photo, a
  park-ranger photo) captioned honestly as "representative imagery," not
  implied to be Jasmine's own field photography.

  **DreamScape** later got the same treatment once Jasmine sent its own
  slide deck (`DreamScape.pptx`). Comet Commute and Elevator Accessibility
  later got real imagery too (see their entries just below), so no case
  study uses abstract placeholder line-art throughout anymore.
  DreamScape's deck's screens (`image-7-1`/`image-7-2`/`image-9-1` in the
  deck's media) already came pre-rendered as phone-mockup exports from her
  design tool (a real bezel/notch baked into the PNG on a solid black
  canvas) rather than flat rectangular UI crops like EcoLink's — see the
  "polishing pre-framed screenshots" note below for how those differ from
  EcoLink's raw-crop pipeline. `images/case-dreamscape-wide.jpg` (hero +
  Final Solution) composites 3 of those screens (sleep dashboard,
  emotions/dream-story, Security & Privacy); the two Process split-visuals
  and the 3 Design Iterations gallery tiles use the same screens
  individually, captioned by what they actually show (e.g. "The Security
  & Privacy screen — two-factor authentication and biometric lock"), not
  the old placeholder captions ("Snoozy concept sketch," "early wireframe")
  which described content that was never actually provided — don't
  reintroduce those specific captions if this page changes again unless
  that specific content (e.g. an actual Snoozy sketch) actually exists.
  `images/case-dreamscape-research.svg` is the one slot still on
  placeholder art — no real research-board image exists for it.
  `images/orbit-dreamscape.svg` (the Projects-list thumbnail) is
  *also* still placeholder — swapping the case-study page's internal
  images doesn't update that separate thumbnail slot, which would need
  its own real square/circular crop if Jasmine wants that updated too.

  **Comet Commute** got real imagery from its team deck (`Comet Commute -
  Team WIP (Copy).pptx`), and its copy was filled out from the deck's own
  text (interview method, full persona details, "key points we kept in
  mind," the pressure-plate/own-app/honor-system iterations, the
  wireframe notes, the storyboard captions, the final-solution
  rationale). Every image slot is real now: `case-comet-journey-local.jpg`
  / `-journey-distance.jpg` (the two hand-drawn Do/Think/Feel persona
  journey maps), `case-comet-map.jpg` (UTD's color-coded parking map),
  `case-comet-garage.jpg` (a garage's per-level availability sign —
  captioned as a *reference* photo, since its sign reads "Gates E20–E38"
  and it isn't a UTD structure), `case-comet-wireframe.jpg` (the parking
  screen, phone-framed), `case-comet-storyboard.jpg` (the 7-panel "Alfred"
  storyboard, re-laid out 4-over-3 in reading order and numbered — the
  source's second row reads right-to-left), `case-comet-wide.jpg`
  (hero + Final Solution: the wireframe phone beside 3 storyboard panels),
  and `orbit-comet.jpg` (Projects-list thumbnail, 3:4 crop of the phone).
  The wireframe on the deck's slide was built from native PowerPoint
  shapes rather than one exported image, and Keynote couldn't be scripted
  to render slides, so it was **rebuilt with Pillow** from the slide's own
  parts (its orange header, UTD logo, bottom tab bar, and the exact lot
  names/counts/dot colors) — the same content, re-laid out cleanly, not a
  new design. Every 4:3 slot image was pre-composited onto the indigo
  background at its box's own aspect ratio ("contain," not relying on
  `object-fit: cover`), since the journey maps are wide and the campus map
  is tall and either would lose content to a center crop. Results and the
  interview quote stay `[TBD]` (rule 6) — the "Think" lines on the journey
  maps are persona-journey writing, not real participant quotes, so don't
  promote them into the `.case-quote` slot.

  **Elevator Accessibility** got the same treatment from its team deck
  (`Elevator Accessibility Project.pdf`, by Pj Jones, Jackson Lux, Neal
  Tembe, and Jasmine, for ATCM 3337 Interaction Design I). The deck set
  the project in the **Empire State Building** and split it into three
  ideas for two audiences: employee RFID keycards, tourist headphones,
  and quality-of-life elevator changes, each with its own real tradeoffs
  (kept on the page as "The catch"). No PDF tools were installed, so pages
  were rendered to PNG via PDFKit from JXA (`osascript -l JavaScript`),
  then cropped with Pillow: `case-elevator-panel.jpg` (an elevator floor
  panel photo), `-rfid.jpg` (stock keycard photo, captioned as
  representative), `-buttons.jpg` (the team's arrow call-button mockup),
  `-headphones.jpg` (the team's 3D headphone model, pulled apart),
  `-storyboard-headphones.jpg` (9-panel "Jeff" storyboard) and
  `-storyboard-rfid.jpg` (the RFID storyboard; its one empty 6th panel
  and stray arrow were filled with the board's own gray so it reads as a
  finished 5-panel board), `-wide.jpg` (hero + Final Solution), and
  `orbit-elevator.jpg` (thumbnail, a 3:4 crop of the headphone model).
  The earlier haptic-wristband/multi-sensory research paragraph wasn't in
  the deck but was kept, since it was already real content on the page.

  **Polishing pre-framed vs. raw-crop screenshots** — both EcoLink and
  DreamScape's real screens went through a Pillow-based "make it look
  like a real device mockup" pass (done once, offline, output files
  committed as static JPGs — not a build step, nothing runs this at
  request time) rather than being used as flat screenshot crops, since
  flat crops read as noticeably less polished than the rest of the site's
  crafted-not-generic aesthetic. The two decks needed different handling:
  - **EcoLink's** screens were flat rectangular UI exports with no
    device chrome at all, so the phone bezel/notch/shadow had to be drawn
    from scratch around each one (rounded-rect bezel, a notch pill,
    `ImageFilter.GaussianBlur` drop shadow), then composited onto a solid
    indigo background (`(36, 31, 71)`, close to `--bg`) matching the
    site's own dark theme.
  - **DreamScape's** screens already came bezel-framed from Jasmine's own
    design tool, but on an opaque solid-black square canvas — pasting
    those directly next to each other would show visible black
    rectangles. Instead: threshold the image to find the actual phone
    silhouette's bounding box (anything above a low luminance cutoff),
    crop tight to it, then apply a rounded-rect alpha mask at roughly the
    phone's own visible corner radius so the remaining black corner
    triangles (from the original square canvas) become transparent — only
    *then* add the same drop-shadow/indigo-background treatment as
    EcoLink. Don't skip the corner-masking step for pre-framed exports
    like this — without it, faint black corner triangles show through
    against the site's non-black background.
  - In both cases, `object-fit: cover` inside `.case-visual-box` (a 4:3,
    landscape-ish box) will center-crop a tall portrait phone image and
    cut off its header/title — add `style="object-position: top"` on
    that `<img>` (or `left` for a wide, landscape flow image like
    DreamScape's BCI setup screens) rather than accepting the default
    center crop, the same fix already needed for EcoLink's gallery.

  As with the other case
  studies, Results/Impact stayed `[TBD]` (rule 6) since this was a
  research/design project, never a shipped product — don't invent
  metrics for it either. `--case-accent: var(--c-green)` — the one
  rainbow slot none of the other 3 projects used, and thematically fits
  an environmental/conservation project.

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
  the About section; and 1 more (`case-dreamscape-research.svg`) for
  DreamScape's one remaining placeholder slot (see its entry above). Comet
  Commute's and Elevator Accessibility's old placeholder SVGs (including
  their `orbit-*.svg` Projects-list thumbnails) were replaced by real
  `.jpg`s and deleted — see their entries above. All placeholders are
  meant to be directly overwritten with Jasmine's own art or real
  screenshots — no HTML/CSS edits needed, just replace the file, the same
  swap-the-file pattern as the About page's doodle slots. `object-fit:
  cover` on `.case-mockup img`/`.case-visual-box img`/`.project-visual
  img` crops any real image cleanly regardless of its actual aspect
  ratio, so the same placeholder file can be (and currently is) reused
  across more than one slot on a page. Follow this same "real file in
  `images/`, referenced by `<img src>`" pattern for any future image slot
  rather than an inline-SVG placeholder or a text-only callout.

  Four sets are real, final assets rather than placeholders:
  `mascot-astronaut.png` (hero section) — Jasmine's own character art,
  resized/compressed on intake (from a 2048px/1.3MB source down to
  1024px/~390KB, since the mascot never displays wider than ~380px)
  rather than served at its original resolution; `avatar-jasmine.png`
  (About section) — a real photo of Jasmine, already composited (by her)
  inside a hand-illustrated rainbow shooting-star ring, on a *transparent*
  background (an earlier version she sent had this same composite on an
  opaque dark square, which was used briefly before she sent this
  transparent version instead — don't go back to compositing it onto a
  solid card/box). Because it's transparent, `.avatar-frame` displays it
  at natural size with no crop, no border-radius, and — at Jasmine's
  explicit request — no tilt or hover motion at all, the same static,
  frame-free treatment as the hero mascot art; don't reintroduce the
  tilt-and-straighten-on-hover interaction the placeholder version had
  without checking with her first. `.avatar-frame`'s size
  (`width: min(78vw, 400px)`, up from an initial `min(70vw, 340px)` — bump
  the source resolution to match if this grows again, see below) is the
  one thing that does still stay in Jasmine's control; it also gets its
  own scroll-triggered entrance, `.reveal-right` (fade + slide in from the
  right, `translateX(70px)` → `0`, at Jasmine's explicit request — an
  earlier fade+scale+rise variant, `.reveal-pop`, was tried first and
  replaced by this one; don't reintroduce the scale/rise version without
  checking with her first). Defined next to `.reveal`/`.reveal-fade` in
  `css/style.css`, wired into the same `initScrollReveal()` observer in
  `js/main.js` — just another class name added to its selector, not a
  separate mechanism. Safe to use a transform-based reveal here (unlike
  the plain-fade `.reveal-fade` other elements use) since this element
  carries no hover transform of its own to compete with (unlike the cards
  `.reveal-fade` was written for). Resized/
  compressed on intake the same way as the mascot (from a 1254px/2.5MB PNG
  source down to an 800px/~980KB PNG — kept as PNG rather than converted
  to JPEG, since the transparency has to survive — sized for roughly 2x
  its current 400px display cap so it still reads crisp on retina
  screens) — and the `case-ecolink-*`/`orbit-ecolink.jpg` and
  `case-dreamscape-*` sets (see their entries
  above), both extracted from Jasmine's own slide decks, resized, and
  (for the real UI screens specifically) run through the phone-mockup
  polishing pass described above. If a tall portrait screenshot needs to
  sit inside a landscape-ish box like `.case-visual-box` (4:3), add
  `style="object-position: top"` on that `<img>` (or `left` for a wide
  landscape flow image) rather than leaving the default center crop,
  which cuts off the screen's header/title — center-crop is fine for
  ordinary photography, not for UI screenshots where the top/leading edge
  matters.
- **Free Draw (removed)** — Playground used to have a second tab, a
  simple no-strings-attached HTML5-Canvas drawing space (color picker,
  brush size, eraser, undo, clear), before Jasmine asked for the whole
  tab removed. Playground is back to just the single "Experiments" deck
  with no tab UI (a single-tab tablist wasn't meaningful, so the
  `role="tablist"`/`.playground-tabs` markup and `initPlaygroundTabs()`/
  `initFreeDraw()` in `js/main.js` were removed too, not just hidden) —
  don't reintroduce any of that scaffolding for a single panel.

  Before that removal, Free Draw itself had replaced an even earlier
  feature, **Doodle Mail**, a draw-and-email-it-to-Jasmine guestbook. That
  was torn out — not just descoped — after a real, hands-on attempt to
  wire it up ran into a wall worth remembering if anything like it comes
  up again: **every free-tier path for getting a browser-drawn image into
  an email hit a dead end.** EmailJS (the send-from-the-browser service
  used) hard-caps combined template variables at 50KB, so a real canvas
  PNG never fit. Compressing it down and embedding it as `<img
  src="data:...">` technically fit, but Gmail silently strips inline
  data-URI images regardless of size — so nothing showed up, with no
  error to debug. Real email attachments would have sidestepped that, but
  both EmailJS's and Formspree's attachment features are paywalled on
  their free plans (confirmed directly against each service's own
  docs/UI, not assumed). Routing the image through Imgur's free anonymous
  upload API and emailing a real image URL instead of embedding one *did*
  work end-to-end — but at that point, given how much infrastructure
  (EmailJS + Imgur, two API keys, a compression step) it took just to
  email a doodle, Jasmine's call was to drop the send-to-email idea
  entirely and keep only the actually-fun part: the canvas — which she
  later had removed too, per above. **If a future request wants doodles
  to reach Jasmine again, don't restart from EmailJS** — re-read this
  note first, since the constraint is the free tier landscape itself, not
  a bug in any one attempt.
- **Experience** (`#experience` + `class="experience-list"` in
  `index.html`, between About and Projects) — a compact "My experience"
  strip added at Jasmine's request after she shared a reference
  (mkilgoredesign.com's "My experience" section: an intro line, then a
  plain multi-column row of past roles — company, role, date range —
  rather than a boxed timeline graphic). Reuses the site's existing
  `.page-hero` header pattern (`<h2>`, eyebrow) then a separate content section, same two-section
  split as Projects/Playground. `.experience-row` is a
  `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` grid —
  collapses to one column on mobile automatically, no dedicated media
  query needed. Every entry (`.experience-entry`: company `<h3>`, role
  `<p>`, date-range `<span>`) is wrapped in `.tbd` and reads `[TBD:
  Company]`/`[TBD: Role]`/`[TBD: Month Year — Month Year]`, and the intro
  line above the row is `[TBD: a short intro...]` too — this is real
  biographical content (employers, titles, dates) that only Jasmine can
  supply, so per rule 6 it's scaffolded as explicit placeholders rather
  than invented. Don't fill these in with plausible-sounding companies or
  dates; wait for Jasmine's real work history. Adding this section meant:
  adding `#experience` to the `scroll-margin-top`
  selector in `css/style.css` and to `initScrollSpy()`'s `sections` array
  in `js/main.js`; adding an `Experience` link to both the nav (`data-page
  ="experience"`) and the footer `.socials` list; and the nav-balance
  consequence noted in "Spacing & layout" above (3 links before the logo
  now, not 2).
- **Projects list** (`class="projects-list"` in `index.html`'s
  `#projects`, pure HTML/CSS — no JS driving it) — the Projects section's
  content: all 4 projects as `.project-spread`s in a 2x2 grid
  (`display: grid; grid-template-columns: repeat(2, 1fr);`), collapsing
  to a single column under 760px (same breakpoint where each
  `.project-spread` card itself switches to a stacked internal layout —
  see "Card shape" below). This was a stacked single-column list at full
  row width before Jasmine asked for it sized down (the unified card
  redesign just below read as "too big" at that width) — 2 columns halves
  each card's width, and since `.project-spread` has no fixed height,
  height follows from that automatically rather than needing separate
  tuning. Replaced **Project Orbit** (a drag/swipe/wheel/arrow-key/button
  carousel of circular "planet" cards) at Jasmine's explicit request,
  after she shared a reference (wallofportfolios.in's "selected works"
  layout) and asked for something similar; restores "every project
  visible without an interaction," undoing Project Orbit's tradeoff in
  the other direction. **If asked to redo Projects again, this 2x2 grid
  of unified cards is the current, intended state** — don't reintroduce
  Project Orbit's carousel, the constellation grid, or the single-column
  stacked list without being asked. Cards and photos originally
  alternated a slight scattered-page tilt per spread; Jasmine asked for
  that removed in favor of a straight, level layout — don't reintroduce
  it without checking with her first.

  **Card shape**: each `.project-spread` is now one unified bordered/
  rounded card (border, translucent dark fill, `overflow:hidden` so both
  halves clip to one outline) split into a `.project-card` text half
  (title, one-line summary, `.project-tags` pills, CTA button) and a
  `.project-visual` photo half filling the rest — adapted from a
  reference Jasmine shared (mkilgoredesign.com's project cards: a solid-
  color text panel + photo sharing one card outline), at her explicit
  request to "borrow the card shape" while keeping this stacked
  single-column list rather than adopting that reference's 2-column
  grid. The card's border/background/radius/shadow used to live on
  `.project-card` alone, with `.project-visual` a separate smaller
  photo floating beside it (`max-width:200px`, its own shadow/radius,
  `gap: 44px` between the two) — all of that moved up to `.project-spread`
  itself; `.project-card`/`.project-visual` are now just its two flex
  halves (`flex: 1.15 1 320px` / `flex: 1 1 260px`, `align-items:
  stretch` so the photo matches the text panel's content-driven height,
  `object-fit: cover` on the `<img>` handling whatever height results).
  Adapted rather than copied literally (rule 4): the reference's solid
  saturated panel fill would put white text directly on the soft/pastel
  accent tier, which fails contrast (see the color table above) — instead
  `.project-card`'s background is a low-opacity `color-mix(in srgb,
  var(--accent) 15%, transparent)` wash layered over the existing dark
  card background, reading as a colored tint rather than an opaque fill.
  The spread itself has **no hover state**: clicking its text does
  nothing (only the button and the photo are links), so per Jasmine's
  "no interaction on things that don't do anything" rule it no longer
  lifts. Only the link parts react: the photo zooms when the photo itself
  is hovered or focused (`.project-visual:hover img`), and `.btn` has its
  own hover.
  All 4 Projects-list photos are real now (`orbit-comet.jpg`,
  `orbit-elevator.jpg`, `orbit-dreamscape.jpg`, and `orbit-ecolink.jpg`). On mobile (`flex-direction:
  column`, `max-width: 760px`) there's no row to stretch the photo
  against, so it gets its own `aspect-ratio: 16/10; min-height: 180px`
  there instead.

  **Watch the section's own `padding`**: `.projects-list` sets it
  explicitly (`36px 8% 24px`) rather than inheriting the base `section`
  rule's `8%` horizontal padding — a version of this that set the
  horizontal value to `0` shipped briefly and pinned every card flush
  against the viewport edge with no margin at all ("getting cut off on
  the sides"). If you touch this rule again, keep a real horizontal
  value, don't drop it to `0`. The vertical gap between spreads
  (`.projects-list`'s `gap`) was originally `80px`; Jasmine asked for it
  tightened (now `28px`, `32px` on mobile) so more of the list stays
  visible at once while scrolling instead of one project filling the
  whole viewport.

  **`.project-spread`'s `justify-content`** (from when the card and photo
  were still two separate elements): `space-between` read fine on the
  ~760px mobile layout it was checked at, but on a wide desktop viewport
  it stretched the *leftover* row space into a large dead gap between the
  card and the photo, splitting the pairing apart (Jasmine flagged this
  as the section "looking odd"). This whole concern is now moot — the
  unified-card redesign above removed the `justify-content`/`gap` model
  entirely (the two halves are flex children of one bordered container
  with no gap between them) — kept here as history in case a future
  redesign reintroduces two separate elements and the same trap.
- **Contact form** (`#contactForm` in `index.html`, `initContactForm()` in
  `js/main.js`) — submits to Jasmine's own Formspree endpoint
  (`https://formspree.io/f/xrpgwbwo`) via `fetch` rather than a plain HTML
  POST, so a visitor sees an inline success/error message
  (`#contactFormStatus`) and stays on the page instead of being bounced to
  Formspree's default "thanks" page. No daily-limit counter here (unlike
  the old Doodle Mail) — Formspree's own free-tier submission cap is the
  real abuse guard for this form.
- `playground/` — `color-studies.html` is still a placeholder page (see
  above), `animations.html` is real (see below). Both linked from
  `.sticker-card` in `index.html`'s Experiments deck.
  `sketch-dump.html` was removed along with its tile once Lucky's First
  Day took that slot in the deck; don't recreate it without a tile
  linking to it. `color-studies.html` follows the shared nav/footer,
  no-chapter-structure template described in the Experiments-tiles entry
  above; `animations.html` (below) breaks from that template since it
  has real content to show.

  **Animations** (`playground/animations.html`) went from a `[TBD]`
  placeholder to a real gallery of 6 clips Jasmine provided (originals in
  `/Users/jasmine/Downloads/New Folder With Items` — not part of the
  repo), at her request. Files copied into a new `videos/` directory at
  the repo root (a new top-level folder, alongside `images/` — the first
  real video assets on the site) under clean names rather than their
  original `BonthaJasmine_*`/`assignment04`/`(1)` filenames:
  `animation-flour-sack.mp4`, `animation-fox-character.mp4`,
  `animation-road-trip.mp4`, `animation-construction-study.mp4`,
  `animation-weight-test.mp4`, `animation-ball-bounce.gif`. The page's
  `.animation-gallery` (new component, see `css/style.css`) replaced the
  old single "Coming soon" `.card` with a grid of `.card animation-tile`
  elements — no per-clip captions (Jasmine asked for them removed); each
  tile's `aria-label` carries the same descriptive text instead, so the
  info survives for screen readers without a visible caption. Two
  layered interactions, both at Jasmine's request:
  - **Hover preview** — the small tile's `<video muted loop playsinline
    preload="metadata" poster="...">` plays on hover, the "hover and it
    just plays" feel of a GIF without actually being one.
    `initAnimationHoverPlay()` in `js/main.js` wires
    `mouseenter`→`play()`/`mouseleave`→`pause()` + reset to frame 0, only
    when `(hover: hover) and (pointer: fine)` matches and
    `prefers-reduced-motion` doesn't (video starting to play on hover is
    a stronger motion trigger than the site's usual subtle hover
    transforms). Purely a bonus on capable devices — see theater mode
    below for how every device actually watches a clip.
  - **Theater mode** — clicking (or Enter/Space-activating) any tile
    opens that clip full-size in `#theaterModal`, a single shared
    fixed-position overlay (dark backdrop, the clip centered with real
    `controls` and sound) — the site's first true modal.
    `initAnimationTheater()` in `js/main.js` builds a fresh `<video>` (or
    `<img>` for the GIF tile) into `.theater-stage` per open rather than
    moving the tile's own element, so the small tile's hover-preview is
    untouched. Each `.animation-tile` is a `<button>` (not a `<figure>`
    — the whole tile is now a click target, and there's no caption to
    anchor a figure to), carrying `data-theater-src`/`data-theater-
    poster`/`data-theater-type="image"` (GIF only) read by
    `initAnimationTheater()`. Closes via the × button, clicking the
    backdrop, or Escape — all three discard the theater video
    (`stage.innerHTML = ''`, not just hiding it, so playback actually
    stops) and return focus to the tile that opened it; a small focus
    trap keeps Tab cycling within the modal (close button ↔ the video's
    native controls, or just the close button alone for the GIF tile,
    which has nothing else focusable).
    **`.theater-modal` is a sibling of `<main>` in the HTML, not nested
    inside it** — `<main>` has its own `position: relative; z-index: 1`,
    which would trap the modal's `z-index: 2000` inside that stacking
    context (capped at main's own level, 1) and it could never actually
    paint above `.site-nav` (z-index 200) — the same reason `.skip-link`
    sits outside `<main>` too. This is easy to get wrong silently (the
    modal still *works* — opens, plays, closes — just renders under the
    nav with an invisible close button), so if theater mode or any
    future modal goes back to being nested inside `<main>`, re-check
    this.

  Real animated GIFs weren't used for either interaction (despite
  Jasmine's initial ask for "gifs that play on hover") since there's no
  video-compression tool in this environment to keep GIF file sizes
  reasonable for clips this long, and GIF is a much heavier format than
  compressed video for the same content anyway — a muted/looping
  hover-`<video>` (small tile) plus a real `<video controls>` (theater
  mode) together cover the same ground at a fraction of the size; if
  literal `.gif` files are ever truly required, that needs real
  video-to-GIF tooling this environment doesn't have.
  `preload="metadata"` (not `"auto"`, no autoplay) on the small tile's
  video keeps initial page load light despite the real file sizes —
  totaling ~23MB, `animation-flour-sack.mp4` alone is 16.7MB, since no
  video-compression tool (`ffmpeg`) is available in this environment to
  re-encode them (unlike the Pillow-based one-time image-processing pass
  used for EcoLink/DreamScape's screenshots — there was no equivalent
  option here); if that ever becomes a real problem, re-encoding these
  down is the fix, not switching the loading strategy. Poster frames
  (`images/poster-animation-*.jpg`, one per clip) were extracted with
  `qlmanage -t` (macOS Quick Look, no `ffmpeg` needed) and compressed
  with `sips`, so each video shows a real frame instead of a blank/black
  box before playing. The Experiments deck's Animations tile
  (`index.html`) got the same treatment as EcoLink's Projects
  thumbnail once real content existed: its `[TBD]` paragraph became a
  real one-liner, and its `.sticker-thumb` swapped from the old
  `images/playground-animations.svg` line-art icon to
  `images/playground-animations.jpg` — a real frame (the road-trip
  clip's mountain scene, chosen for how cleanly a landscape composition
  fills the tile's 16:9 crop) extracted and compressed the same way as
  the poster frames — following the sitewide "real file in `images/`,
  swap the file" pattern rather than keeping a placeholder icon next to
  real content.
- `css/style.css` — the entire design system and every component's styles.
- `js/main.js` — nav toggle/scrollspy active-link logic, the comet trail,
  starfield generation, and the contact form.
- `README.md` — one-line project description.
- Remaining placeholder content: the About section's sketchbook doodle art
  (each should become a drawing of a personal object) and fun-fact
  captions (each a fun fact about Jasmine tied to that object — some
  already filled in, see the markup), and Color Studies
  (`playground/color-studies.html`) — its tile has a real one-line
  summary but the page itself is still the `[TBD]`/"Coming soon"
  template, since no actual color-study images exist yet — see rule 6.
  Animations (`playground/animations.html`) is no longer placeholder: see
  its own entry below.

## Available skills

See `.claude/skills/` for task-specific helpers:
- `ux-case-study` — draft or restructure a case study section in this
  site's voice and visual system.
- `design-audit` — check a change against the design tokens and
  accessibility rules above before calling it done.
- `add-project-card` — scaffold a new project card or section that reuses
  existing component patterns.

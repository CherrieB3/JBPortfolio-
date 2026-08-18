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
- Google Fonts loaded via `<link>` on every page: `Shantell Sans` (weights
  400/700) for headings, nav, and the logo's handwritten mark; `Inter`
  (300–500) for body copy. The original `Syne` display font was replaced
  with `Kalam` when the site was redesigned from Jasmine's storyboards (see
  `Untitled_Artwork 2.pdf`, Aug 2026) to match their looser, hand-drawn/
  marker aesthetic; `Kalam` was then swapped for `Shantell Sans` (still a
  handwriting-derived, marker-inspired face, so the hand-drawn voice holds)
  because Kalam's thick, bouncy letterforms read as too casual/comic for a
  site now carrying real professional case studies — Shantell Sans keeps
  the personal, sketchbook feel while reading more like a considered
  designer's brand mark.
- Vanilla JS only (`js/main.js`): mobile nav toggle, active-nav-link
  marking, and the home-page comet trail (see below). Prefer extending this
  file over adding a library for new interactivity.
- No raster image assets — the mascot, spark mark, rabbit icon, and planets
  are all inline SVG/CSS. This was a deliberate choice (avoids an asset
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

## Design system

Reuse these tokens rather than inventing new ones so the site stays visually
coherent as pages are added. Defined as CSS custom properties at the top of
`css/style.css`.

**Color** — two tiers of the same rainbow: vivid for decorative use on the
dark background, and deeper/darker equivalents for text on the light nav bar
(chosen for AA contrast; pure vivid yellow, for example, fails on white).

| Slot | Vivid (`--c-*`, dark bg) | Deep (`--d-*`, on white nav) |
|---|---|---|
| Red | `#ff4b3e` | `#c62828` |
| Orange | `#ff9f1c` | `#b24b00` |
| Yellow/gold | `#ffd93d` | `#8a6d00` |
| Green | `#4ade80` | `#1e7a46` |
| Blue | `#4d5bff` | `#2a3fcc` |
| Purple | `#a78bfa` | `#6b3fa0` |
| Pink (accent only) | `#ff3fd8` | — |

Background `#050314` (deep space); nav/paper surfaces `#fdfdfb`; body text
on dark: `#ffffff` / `#d3d4e6` / `#9d9fc0` (heading / subhead / muted).

`--gradient-rainbow` (red→orange→yellow→green→blue→purple) is the site's
signature: nav underline, comet trail, hero ribbon, `.gradient` text accent.
Don't introduce off-palette colors — extend by opacity/tint of these instead.

**Type**
- Display / headings / nav / logo: `Shantell Sans`, weight 700 (400 for
  lighter accents). This is the "hand-marker" voice of the site — keep
  headings feeling written, not typeset, but note it's meant to read as a
  refined, considered hand rather than a bouncy comic one.
- Body: `Inter`, weights 300–500.
- Hero H1 is intentionally oversized (`clamp(3rem, 7vw, 5.5rem)`) — this is
  the site's visual signature, not a bug to "fix" for looking large.

**Motif**
- Cosmic theme: starfield background, soft radial-gradient glows, and a
  chibi astronaut-with-bunny-ears mascot (nods to "rabbit enthusiast"). New
  sections should feel like part of the same universe rather than
  introducing a different visual language.
- The 4-point spark/sparkle mark (`✦`, drawn as a small inline SVG) is a
  recurring accent — logo, galaxy core, hero ribbon tip. Reuse it as a
  bullet/flourish rather than inventing a new icon for the same job.
- Cards (`.card`): translucent white fill, soft border, rounded corners
  (`30px`), lift + glow on hover.

**Spacing & layout**
- Horizontal page padding: `8%`–`10%` (`6%` on mobile).
- Nav is fixed, white, `76px` tall, with the rainbow gradient as a 4px strip
  along its bottom edge. Nav links read About / Projects / **logo** /
  Playground / Contact — the logo sits in the middle slot as one evenly
  spaced row (a specific storyboard detail — don't move the logo back to
  the left without checking with Jasmine).

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
home-page hero anymore. It sweeps in a smooth, spring-like S-curve from
edge to edge of the viewport rather than hugging one side, and actively
steers around every heading, paragraph, link, card, and form on the page
(`OBSTACLE_SELECTOR` in the JS) so it never overlaps or sits under text —
if a new section's element should also be avoided, add its selector there.
A twinkling star rides the ribbon at the current scroll position and
scrolls to top on click; the ribbon itself only reveals up to the star's
position, so it reads as a trail the comet leaves behind rather than a
path already laid out ahead of it.

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
   surface the tradeoff to Jasmine before adding it.
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
  trail, mascot, tagline strip, featured-projects teaser) → `#about` (real
  bio pulled from Jasmine's previous Framer portfolio, hover avatar frame,
  rabbit icon, a "sketchbook" of 5 floating placeholder doodles — hover/
  focus shows an info tooltip, below 700px it becomes a static list; the
  doodle art itself is still placeholder, see `images/` below) → `#projects`
  (galaxy of hover/focus-able "planet" project cards — Comet Commute,
  Elevator Accessibility, DreamScape, Lucky's First Day — each linking out
  to a full write-up, see `case-studies/` below, with a list fallback for
  small screens) → `#playground` (grid of loose-experiment tiles; explicitly
  allowed to feel rougher than the rest of the site, see rule 4; content is
  placeholder) → `#contact` (direct links + a contact form **not yet wired
  to a backend**, marked inline; social links LinkedIn/Behance/Dribbble are
  still `[TBD]` — Jasmine's previous portfolio didn't expose them in a
  fetchable form) → one shared footer. See "Single-page navigation" above
  for how the anchors/scrollspy work. Every planet's tooltip and fallback
  card includes a "View case study" link (`.view-case`); keep tooltip cards
  positioned adjacent to/overlapping their planet (not detached) — CSS
  `:hover` drops the instant the pointer leaves `.planet`, and
  `.planet-card` is `pointer-events: none` at rest, so a gap between planet
  and card breaks the ability to mouse from one onto the other.
- `case-studies/` — one HTML page per case study (`comet-commute.html`,
  `elevator-accessibility.html`, `dreamscape.html`), real UT Dallas
  coursework/designathon projects with real research, decisions, and
  outcomes. Each sets `--case-accent` on `<body>` (a rainbow token matching
  its planet's color) that themes its back-link, section-heading
  underlines, and list bullets. Reuses `.page-hero`, `.card`, `.btn`, and
  the shared nav/footer rather than introducing new page chrome. Lucky's
  First Day has no page here — it's an existing standalone site, linked to
  directly.
- `images/` — the one exception to "no raster/external image assets": 5
  small swappable placeholder SVGs (`doodle-1.svg`…`doodle-5.svg`) used in
  the About section, meant to be directly overwritten with Jasmine's own art.
- `css/style.css` — the entire design system and every component's styles.
- `js/main.js` — nav toggle/scrollspy active-link logic, the comet trail,
  and starfield generation.
- `README.md` — one-line project description.
- Remaining placeholder content: the About section's sketchbook doodle
  captions/art, all of Playground, and the contact form's backend wiring —
  see rule 6.

## Available skills

See `.claude/skills/` for task-specific helpers:
- `ux-case-study` — draft or restructure a case study section in this
  site's voice and visual system.
- `design-audit` — check a change against the design tokens and
  accessibility rules above before calling it done.
- `add-project-card` — scaffold a new project card or section that reuses
  existing component patterns.

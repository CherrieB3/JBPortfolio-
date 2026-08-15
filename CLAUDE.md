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

- Static multi-page site: `css/style.css` (shared stylesheet) + `js/main.js`
  (shared behavior) + one HTML file per page. No build step, no framework,
  no package.json — keep it that way unless a real need arises (see rule 3).
- Google Fonts loaded via `<link>` on every page: `Kalam` (weights 400/700)
  for headings, nav, and the logo's handwritten mark; `Inter` (300–500) for
  body copy. This replaced the original `Syne` display font when the site
  was redesigned from Jasmine's storyboards (see `Untitled_Artwork 2.pdf`,
  Aug 2026) to match their looser, hand-drawn/marker aesthetic.
- Vanilla JS only (`js/main.js`): mobile nav toggle, active-nav-link
  marking, and the comet scroll-rail (see below). Prefer extending this file
  over adding a library for new interactivity.
- No raster image assets — the mascot, spark mark, rabbit icon, and planets
  are all inline SVG/CSS. This was a deliberate choice (avoids an asset
  pipeline, keeps everything crisp and themeable) as well as the fix for the
  old dangling `astronaut.png` reference. Keep new illustration work in this
  same inline-SVG, line-art style rather than introducing image files unless
  Jasmine explicitly wants to swap in real artwork/photography.

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
signature: nav underline, comet rail, hero ribbon, `.gradient` text accent.
Don't introduce off-palette colors — extend by opacity/tint of these instead.

**Type**
- Display / headings / nav / logo: `Kalam`, weight 700 (400 for lighter
  accents). This is the "hand-marker" voice of the site — keep headings
  feeling written, not typeset.
- Body: `Inter`, weights 300–500.
- Hero H1 is intentionally oversized (`clamp(3rem, 7vw, 5.5rem)`) — this is
  the site's visual signature, not a bug to "fix" for looking large.

**Motif**
- Cosmic theme: starfield background, soft radial-gradient glows, a rainbow
  "comet trail" ribbon, and a chibi astronaut-with-bunny-ears mascot (nods
  to "rabbit enthusiast"). New sections should feel like part of the same
  universe rather than introducing a different visual language.
- The 4-point spark/sparkle mark (`✦`, drawn as a small inline SVG) is a
  recurring accent — logo, galaxy core, hero ribbon tip, comet-star. Reuse
  it as a bullet/flourish rather than inventing a new icon for the same job.
- Cards (`.card`): translucent white fill, soft border, rounded corners
  (`30px`), lift + glow on hover.

**Spacing & layout**
- Horizontal page padding: `8%`–`10%` (`6%` on mobile).
- Nav is fixed, white, `76px` tall, with the rainbow gradient as a 4px strip
  along its bottom edge. Nav links read About / Projects / **logo** /
  Playground / Contact — the logo sits in the middle slot as one evenly
  spaced row (a specific storyboard detail — don't move the logo back to
  the left without checking with Jasmine).

## Comet scroll-rail (site-wide component)

A fixed vertical rainbow rail runs down the right edge of every page
(`.comet-rail` in every HTML file, driven by `initCometRail()` in
`js/main.js`). It fills in with the rainbow gradient as the user scrolls
(SVG `stroke-dasharray`/`dashoffset` against real scroll percentage) and a
twinkling spark (`.comet-star`, CSS-animated — a stand-in for the "gif star"
originally requested, since the project has no image-asset pipeline) rides
the exact point on the path via `path.getPointAtLength()`. Clicking the star
scrolls to top. This is the literal implementation of "the rainbow trail
acts as scroll navigation" — treat it as a persistent site-wide fixture, not
a per-page decoration; if a future page doesn't include the same
`.comet-rail` markup block, the scroll wayfinding breaks on that page.

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

- `index.html` — home (hero with mascot + comet ribbon, tagline strip,
  featured-projects teaser, footer).
- `about.html` — bio copy (placeholder, marked `[TBD]`), hover avatar frame,
  rabbit icon.
- `projects.html` — galaxy of hover/focus-able "planet" project cards, with
  a list fallback for small screens.
- `playground.html` — grid of loose-experiment tiles; explicitly allowed to
  feel rougher than the rest of the site (see rule 4). Content is placeholder.
- `contact.html` — direct links + a contact form that is **not yet wired to
  a backend** (marked inline; needs a form service or endpoint before launch).
- `css/style.css` — the entire design system and every component's styles.
- `js/main.js` — nav toggle/active-link logic + the comet scroll-rail.
- `README.md` — one-line project description.
- Real content (bios, case studies, project details, social links) still
  needs to replace the `[TBD]` placeholders throughout — see rule 6.

## Available skills

See `.claude/skills/` for task-specific helpers:
- `ux-case-study` — draft or restructure a case study section in this
  site's voice and visual system.
- `design-audit` — check a change against the design tokens and
  accessibility rules above before calling it done.
- `add-project-card` — scaffold a new project card or section that reuses
  existing component patterns.

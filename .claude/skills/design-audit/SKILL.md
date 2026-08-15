---
name: design-audit
description: Audit HTML/CSS changes in this portfolio against its design tokens and accessibility rules before calling work done. Use after adding or editing any section, page, or component, or when the user asks for a design/accessibility review.
---

# Design & accessibility audit

Run this before treating any visual or markup change as finished. Read
`CLAUDE.md` first for the current design tokens and rules — this skill is
the checklist for enforcing them, not a restatement of them.

## Checklist

**Design system conformance**
- [ ] Colors used are from the documented palette (background `#050314`,
      accents `#FF3FD8` / `#4D5BFF` / `#7FFF00`, text `#ffffff`/`#d9d9d9`/
      `#c8c8c8`) or clear tints/opacities of them — no unexplained new hexes.
- [ ] Headings use `Syne` (700–800); body copy uses `Inter` (300–500).
- [ ] New cards/sections reuse existing patterns (`.project-card`,
      `.section-title`, `.gradient`) instead of parallel one-off styles.
- [ ] Motion (hover lifts, floats, spins, glows) is consistent in feel with
      existing animations — not jarring or mismatched in duration/easing.

**Accessibility (WCAG AA)**
- [ ] Body text contrast ≥ 4.5:1 against its background; large/display text
      ≥ 3:1. Check gradient text and text-over-image cases specifically —
      these are the easiest to accidentally fail.
- [ ] Every `<img>` has meaningful `alt` text, or `alt=""` if purely
      decorative.
- [ ] Heading levels are sequential (no skipping from `h1` to `h3`); one
      `h1` per page.
- [ ] Interactive elements (`button`, `a`) are reachable and usable via
      keyboard, with a visible focus state.
- [ ] Semantic elements used where appropriate (`nav`, `section`, `footer`)
      instead of generic `div`s for structural regions.

**Responsiveness**
- [ ] Content checked at a mobile width (~375px): no horizontal overflow,
      no illegible oversized type, no elements crowding off-screen.
- [ ] Large fixed-size elements (e.g. the hero's `6rem` heading, `420px`
      astronaut image) have a mobile fallback via media query.

**Content integrity**
- [ ] No fabricated metrics, quotes, or client names — placeholders are
      explicitly marked (e.g. `[metric TBD]`), not written as if real.

**Scope discipline**
- [ ] No new framework, build tool, or dependency was introduced without
      flagging the tradeoff to Jasmine first.

## Reporting

Summarize findings as a short pass/fail list grouped by the sections above.
For each failure, name the file/line and the specific fix — don't just say
"contrast issue," say which two colors fail and what value would pass.

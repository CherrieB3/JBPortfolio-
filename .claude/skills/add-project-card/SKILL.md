---
name: add-project-card
description: Scaffold a new project card or featured-work section on the portfolio, reusing existing component patterns and design tokens. Use when the user wants to add a new project, case study preview, or grid item to index.html or a future work page.
---

# Add a project card / section

Use this when Jasmine wants to add a new item to the "Featured Projects"
grid (or an equivalent grid on a future page) without drifting from the
site's existing patterns.

## Steps

1. Read `CLAUDE.md` for the design system and rules.
2. Find the nearest existing example to copy from (e.g. `.project-card` in
   `index.html`) rather than writing a new component from scratch.
3. Reuse existing classes (`.project-card`, `.section-title`, `.gradient`)
   for anything that is visually/structurally the same kind of element.
   Only introduce a new class when the new item is genuinely a different
   pattern — and note that it's a deliberate addition, not an oversight.
4. Fill content following the case-study voice rules in `CLAUDE.md`: no
   fabricated project names, descriptions, or outcomes — ask Jasmine for
   real copy, or insert clearly marked placeholders (`[project name TBD]`).
5. If the card should link to a full case study page that doesn't exist
   yet, either link to an anchor/section on the same page, or confirm with
   Jasmine before creating a new file/route.
6. After adding the card, run through the `design-audit` skill's checklist
   (contrast, alt text, mobile width, heading order) before calling it done.

## Example pattern (from index.html)

```html
<div class="project-card">
    <h3>🪐 UX Case Study</h3>
    <p>Research, wireframes, prototyping, and usability testing.</p>
</div>
```

Keep the emoji + short title + one-sentence description format unless
Jasmine asks for a richer card (e.g. thumbnail image, tags, link) — in that
case extend the pattern consistently across all cards in the grid, not just
the new one.

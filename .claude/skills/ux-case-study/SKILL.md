---
name: ux-case-study
description: Draft or restructure a UX case study section for this portfolio (problem, research, process, decisions, outcome) in the site's voice and visual system. Use when the user wants to write up a project, turn research/process notes into a case study, or add a new case study page.
---

# UX case study writer

Use this when Jasmine wants to turn a project (finished, in progress, or
just notes/screenshots) into a portfolio-ready case study for this site.

## Before writing

1. Read `CLAUDE.md` at the project root for the design system, voice, and
   rules (especially "Content & voice" and rule 6 on never fabricating
   content).
2. Ask Jasmine for whatever is missing rather than inventing it: the real
   problem statement, who the users/audience were, what research or
   constraints shaped decisions, what the actual outcome was (metrics,
   qualitative feedback, or an honest reflection if there's no metric).
   Never invent client names, quotes, or numbers — mark unknowns as
   `[TBD: ...]` instead.

## Structure to produce

A case study section should generally cover, in this order:
1. **Framing** — one or two sentences: what the project was, who it was for,
   what problem it solved. This is the "hook."
2. **Context/constraints** — timeline, team, tools, or limitations that
   shaped the work (skip if not provided rather than guessing).
3. **Process** — research method(s), key insights, and how they led to
   design decisions. Show the reasoning, not just the artifact.
4. **Decisions & rationale** — key UI/flow choices and *why*, especially any
   tradeoffs made.
5. **Outcome** — result, metric, or reflection. If no metric exists, write
   an honest outcome/learning statement instead of a fabricated number.

## Voice

- Meta labels (category tags, role, tools used) are short, uppercase,
  letter-spaced — matching the hero's "UX DESIGNER • PRODUCT DESIGNER •
  ARTIST" pattern.
- Body copy is warm, concrete, first-person, sentence-case. Avoid resume
  buzzwords ("synergy", "leveraged") — favor specific, plain descriptions of
  what was done and why.

## Implementation

- Match existing markup patterns in `index.html` (`.section-title`,
  `.project-card`, gradient text via `.gradient`) rather than inventing new
  class names for the same kind of element.
- Follow the design tokens and accessibility rules in `CLAUDE.md` (contrast,
  alt text, semantic headings, mobile responsiveness).
- If this is a new page (not just a section on `index.html`), propose a file
  location under a `case-studies/` folder and confirm with Jasmine before
  restructuring the repo.

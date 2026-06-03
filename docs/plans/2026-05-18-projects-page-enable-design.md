# Projects Page — Enable + Real Project List

**Date:** 2026-05-18
**Scope:** Make the existing `/projects` page reachable from the nav and replace the placeholder project data with three real projects.

## Motivation

The portfolio's `/projects` route exists with the right markup but is unreachable: the nav link in `BaseLayout.astro` is commented out, and the page itself renders three placeholder cards (`Project Atlas`, `Signal Console`, `Edge Toolkit`) with `https://example.com` links. Turn it into a real page that links to actual work.

## Changes

### 1. Enable the nav link
`src/layouts/BaseLayout.astro` — uncomment the `Projects` entry in `navItems` so the link renders in the header on every page.

### 2. Replace placeholder project data
`src/pages/projects.astro` — swap the three placeholder objects for:

| Name              | Link                                            | Description |
|-------------------|-------------------------------------------------|-------------|
| Seshat            | https://seshat-app.com                          | Web tool that infers a relational SQL schema from a JSON file and lets you query the resulting SQLite database in the browser. |
| Eloria            | https://eloria-rsvp.com                         | Wedding invitation platform with customizable templates, link/email/PDF sharing, and real-time RSVP tracking. Built on Nuxt 3, Drizzle, Stripe, and Resend. |
| mojo-plugin-vue   | https://github.com/Janmuixi/mojo-plugin-vue     | A mojo.js plugin that adds Vue template rendering — supports static files and `{{ data }}` interpolation. |

Card markup (`{name, description, link}` → `<article data-project-card>` with a "View Project" anchor) stays as-is.

### 3. Update the build test
`tests/portfolio-pages.test.mjs` — the existing `projects page renders three cards` test asserts `href="https://example.com"`, which will no longer exist. Replace it with assertions for the three real URLs so the build test continues to verify card content.

## Non-goals

- No CSS / layout changes.
- No second link (GitHub repo) per card — single "View Project" anchor remains.
- No new pages or routes.

## Verification

- `npm run build` succeeds.
- `npm test` passes (including updated projects-page assertion).
- Manual: `npm run dev`, confirm `Projects` link appears in header, `/projects` shows three real cards, each link opens in a new tab.

# Portfolio Design (Astro)

## Goal
Create a dark-only, clean, software-engineer style portfolio with separate pages for About (home), Career, Projects, and Contact. Use a minimalist grid aesthetic with subtle terminal cues.

## Information Architecture
- / (About): hero intro + short bio + focus badges
- /career: timeline with 3 placeholder roles
- /projects: grid of 3 placeholder project cards
- /contact: on-page form that opens a mailto

All pages share a common layout with a top nav linking to each route.

## Visual System
- Theme: dark-only, no light toggle
- Background: deep charcoal with faint grid + soft low-contrast gradient
- Colors:
  - Background: #0e1116
  - Text: #e6edf3
  - Muted: #9aa4b2
  - Accent: cool blue/teal for links and active states
- Typography:
  - Sans for headings/body (e.g., Space Grotesk or Sora)
  - Mono for labels and metadata (e.g., JetBrains Mono)
- Surfaces: 1px borders, subtle hover lift or glow

## Components
- Global layout: top nav, page title band, content container
- About hero: name/role, short bio, focus badges
- Career timeline: vertical line with dots, left column date/role, right column company/description
- Project card: title, description, external link button
- Contact form: name, email, message; styled like a compact console panel; submit via mailto

## Motion
- Staggered fade-up on page load
- Hover transitions for cards and links

## Constraints and Notes
- Astro pages per section (no single-page layout)
- Placeholder content for now (3 career entries, 3 projects)
- Clean engineering feel, minimal ornamentation

## Success Criteria
- Each page is accessible via nav and renders correctly on desktop and mobile
- Dark-only aesthetic with clear hierarchy and readable typography
- Placeholder content fills all required sections
- Contact form triggers mailto with filled subject/body

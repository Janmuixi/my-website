# Multi-Page Portfolio Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Follow @test-driven-development for every change.

**Goal:** Build a dark-only, multi-page Astro portfolio with About at `/` and separate Career, Projects, Contact pages, following the approved design.

**Architecture:** Use a shared `BaseLayout.astro` with global styles and a consistent nav. Each page supplies its content through the layout. A lightweight Node test file builds the site and asserts key HTML content per page.

**Tech Stack:** Astro, CSS, Node.js built-in test runner (`node:test`).

---

### Task 1: About page layout + base tests

**Files:**
- Modify: `package.json`
- Create: `tests/portfolio-pages.test.mjs`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro`

**Step 1: Write the failing test**

Add a test that expects the About page to exist with a nav and hero. Use the Node test runner and build output.

```js
// tests/portfolio-pages.test.mjs
import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');

before(() => {
  execSync('npm run build', { stdio: 'inherit' });
});

async function readPage(pathname) {
  return readFile(join(distDir, pathname), 'utf8');
}

test('about page renders hero and nav', async () => {
  const html = await readPage('index.html');
  assert.match(html, /data-section="about"/);
  assert.match(html, /About Me/);
  assert.match(html, /href="\/career"/);
  assert.match(html, /aria-current="page"/);
});
```

Add test script:

```json
// package.json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "test": "node --test"
}
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because `index.html` does not contain `data-section="about"` or `About Me`.

**Step 3: Write minimal implementation**

Create `src/layouts/BaseLayout.astro`:

```astro
---
const { title, label } = Astro.props;
const pathname = Astro.url.pathname;
const navItems = [
  { href: '/', label: 'About' },
  { href: '/career', label: 'Career' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' }
];
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
    />
    <link rel="stylesheet" href="/styles/global.css" />
  </head>
  <body>
    <div class="bg-grid" aria-hidden="true"></div>
    <header class="site-header">
      <a class="logo" href="/">Your Name</a>
      <nav class="nav">
        {navItems.map((item) => (
          <a
            class={`nav-link ${pathname === item.href ? 'is-active' : ''}`}
            href={item.href}
            aria-current={pathname === item.href ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
    <main class="page">
      <div class="page-title">
        <span class="page-label">{label}</span>
        <h1>{title}</h1>
      </div>
      <slot />
    </main>
  </body>
</html>
```

Create `src/styles/global.css` (include variables, background, nav, type, and animation):

```css
:root {
  color-scheme: dark;
  --bg: #0e1116;
  --bg-muted: #141a22;
  --text: #e6edf3;
  --muted: #9aa4b2;
  --accent: #53d3d1;
  --border: #1f2733;
  --shadow: 0 10px 30px rgba(8, 12, 18, 0.55);
  --radius: 14px;
  font-family: "Space Grotesk", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: radial-gradient(circle at top, #13202b 0%, var(--bg) 60%);
  color: var(--text);
  min-height: 100vh;
}

.bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.35;
  pointer-events: none;
  z-index: -1;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 6vw 12px;
}

.logo {
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.nav {
  display: flex;
  gap: 18px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9rem;
}

.nav-link {
  color: var(--muted);
  text-decoration: none;
  padding-bottom: 4px;
  border-bottom: 1px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.nav-link:hover,
.nav-link.is-active {
  color: var(--text);
  border-color: var(--accent);
}

.page {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px 6vw 80px;
  animation: rise 0.6s ease both;
}

.page-title {
  margin-bottom: 32px;
}

.page-label {
  font-family: "JetBrains Mono", monospace;
  color: var(--accent);
  letter-spacing: 0.2em;
  font-size: 0.75rem;
}

h1 {
  margin: 12px 0 0;
  font-size: clamp(2rem, 3vw, 2.8rem);
}

.section {
  background: var(--bg-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  box-shadow: var(--shadow);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 720px) {
  .site-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .nav {
    flex-wrap: wrap;
  }
}
```

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About" label="PROFILE">
  <section class="section" data-section="about">
    <p class="eyebrow">Software Engineer</p>
    <h2>About Me</h2>
    <p>
      I build clean, reliable web systems with a focus on performance, clarity,
      and thoughtful engineering.
    </p>
    <div class="badges">
      <span>Backend</span>
      <span>Frontend</span>
      <span>DevOps</span>
    </div>
  </section>
</BaseLayout>
```

Also add the required CSS for `.eyebrow` and `.badges` in `src/styles/global.css`.

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS for the About page test.

**Step 5: Commit**

```bash
git add package.json tests/portfolio-pages.test.mjs src/layouts/BaseLayout.astro src/styles/global.css src/pages/index.astro
git commit -m "feat: add base layout and about page"
```

---

### Task 2: Career page + timeline tests

**Files:**
- Modify: `tests/portfolio-pages.test.mjs`
- Create: `src/pages/career.astro`
- Modify: `src/styles/global.css`

**Step 1: Write the failing test**

```js
test('career page renders timeline entries', async () => {
  const html = await readPage('career/index.html');
  assert.match(html, /data-section="career"/);
  assert.match(html, /Career Timeline/);
  assert.equal((html.match(/data-timeline-item/g) || []).length, 3);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because `career/index.html` does not exist yet.

**Step 3: Write minimal implementation**

Create `src/pages/career.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
const roles = [
  {
    period: '2022 — Present',
    role: 'Senior Software Engineer',
    company: 'Company One',
    summary: 'Built scalable services and improved reliability across teams.'
  },
  {
    period: '2019 — 2022',
    role: 'Software Engineer',
    company: 'Company Two',
    summary: 'Delivered web apps and performance optimizations.'
  },
  {
    period: '2016 — 2019',
    role: 'Junior Engineer',
    company: 'Company Three',
    summary: 'Maintained systems and automated workflows.'
  }
];
---

<BaseLayout title="Career" label="EXPERIENCE">
  <section class="section" data-section="career">
    <h2>Career Timeline</h2>
    <div class="timeline">
      {roles.map((entry) => (
        <div class="timeline-item" data-timeline-item>
          <div class="timeline-meta">
            <span>{entry.period}</span>
            <strong>{entry.role}</strong>
          </div>
          <div class="timeline-body">
            <h3>{entry.company}</h3>
            <p>{entry.summary}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
</BaseLayout>
```

Add timeline styles in `src/styles/global.css`.

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS for the Career page test.

**Step 5: Commit**

```bash
git add tests/portfolio-pages.test.mjs src/pages/career.astro src/styles/global.css
git commit -m "feat: add career page"
```

---

### Task 3: Projects page + card tests

**Files:**
- Modify: `tests/portfolio-pages.test.mjs`
- Create: `src/pages/projects.astro`
- Modify: `src/styles/global.css`

**Step 1: Write the failing test**

```js
test('projects page renders three cards', async () => {
  const html = await readPage('projects/index.html');
  assert.match(html, /data-section="projects"/);
  assert.equal((html.match(/data-project-card/g) || []).length, 3);
  assert.match(html, /href="https:\/\/example.com"/);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because `projects/index.html` does not exist yet.

**Step 3: Write minimal implementation**

Create `src/pages/projects.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
const projects = [
  {
    name: 'Project Atlas',
    description: 'A scalable service platform with clear observability.',
    link: 'https://example.com'
  },
  {
    name: 'Signal Console',
    description: 'A monitoring dashboard for distributed systems.',
    link: 'https://example.com'
  },
  {
    name: 'Edge Toolkit',
    description: 'A set of utilities for performant edge deployments.',
    link: 'https://example.com'
  }
];
---

<BaseLayout title="Projects" label="WORK">
  <section class="section" data-section="projects">
    <div class="cards">
      {projects.map((project) => (
        <article class="card" data-project-card>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <a class="card-link" href={project.link} target="_blank" rel="noreferrer">
            View Project
          </a>
        </article>
      ))}
    </div>
  </section>
</BaseLayout>
```

Add card styles in `src/styles/global.css`.

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS for the Projects page test.

**Step 5: Commit**

```bash
git add tests/portfolio-pages.test.mjs src/pages/projects.astro src/styles/global.css
git commit -m "feat: add projects page"
```

---

### Task 4: Contact page + form tests

**Files:**
- Modify: `tests/portfolio-pages.test.mjs`
- Create: `src/pages/contact.astro`
- Modify: `src/styles/global.css`

**Step 1: Write the failing test**

```js
test('contact page renders mailto form', async () => {
  const html = await readPage('contact/index.html');
  assert.match(html, /data-section="contact"/);
  assert.match(html, /action="mailto:hello@example.com"/);
  assert.match(html, /name="email"/);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because `contact/index.html` does not exist yet.

**Step 3: Write minimal implementation**

Create `src/pages/contact.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Contact" label="CONNECT">
  <section class="section" data-section="contact">
    <form class="contact-form" action="mailto:hello@example.com" method="post" enctype="text/plain">
      <label>
        Name
        <input type="text" name="name" placeholder="Your name" />
      </label>
      <label>
        Email
        <input type="email" name="email" placeholder="you@email.com" required />
      </label>
      <label>
        Message
        <textarea name="message" rows="5" placeholder="Tell me about your project"></textarea>
      </label>
      <button type="submit">Send Email</button>
    </form>
  </section>
</BaseLayout>
```

Add form styles in `src/styles/global.css`.

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS for the Contact page test.

**Step 5: Commit**

```bash
git add tests/portfolio-pages.test.mjs src/pages/contact.astro src/styles/global.css
git commit -m "feat: add contact page"
```

---

### Task 5: Navigation polish tests (optional)

**Files:**
- Modify: `tests/portfolio-pages.test.mjs`
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Write the failing test**

```js
test('career page highlights active nav item', async () => {
  const html = await readPage('career/index.html');
  assert.match(html, /href="\/career"[^>]+aria-current="page"/);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL if the active state is not applied on non-root routes.

**Step 3: Write minimal implementation**

Ensure `BaseLayout.astro` compares `pathname` to each item and sets `aria-current` and `is-active` class.

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

**Step 5: Commit**

```bash
git add tests/portfolio-pages.test.mjs src/layouts/BaseLayout.astro
git commit -m "test: cover active nav state"
```

---

## Notes
- Replace placeholder content later as needed.
- When text changes, update tests or switch to stable `data-*` selectors.

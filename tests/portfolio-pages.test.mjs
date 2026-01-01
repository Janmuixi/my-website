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

test('career page renders timeline entries', async () => {
  const html = await readPage('career/index.html');
  assert.match(html, /data-section="career"/);
  assert.match(html, /Career Timeline/);
  assert.equal((html.match(/data-timeline-item/g) || []).length, 3);
});

test('projects page renders three cards', async () => {
  const html = await readPage('projects/index.html');
  assert.match(html, /data-section="projects"/);
  assert.equal((html.match(/data-project-card/g) || []).length, 3);
  assert.ok(html.includes('href="https://example.com"'));
});

test('contact page renders mailto form', async () => {
  const html = await readPage('contact/index.html');
  assert.match(html, /data-section="contact"/);
  assert.match(html, /action="mailto:hello@example.com"/);
  assert.match(html, /name="email"/);
});

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

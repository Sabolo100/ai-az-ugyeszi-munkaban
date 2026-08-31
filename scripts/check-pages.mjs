import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import redirects from '../content/redirects.json' with { type: 'json' };

const output = path.resolve(import.meta.dirname, '../out');
const info = JSON.parse(await readFile(path.join(output, 'build-info.json'), 'utf8'));
const base = info.basePath;
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}
const files = await walk(output);
let pages = 0;
const checked = new Set();
for (const file of files.filter((f) => f.endsWith('index.html'))) {
  const relative = path.relative(output, path.dirname(file)).replaceAll('\\', '/');
  const html = await readFile(file, 'utf8');
  if (relative === '404' || relative === '_not-found') continue;
  if (redirects[relative]) {
    assert.ok(html.includes(`${base}${redirects[relative]}/`), relative);
    continue;
  }
  pages++;
  assert.match(html, /<html[^>]+lang="hu"/);
  assert.match(html, /<h1[\s>]/);
  assert.ok(!html.includes('content="noindex'), `${relative}: must be indexable`);
  assert.ok(!html.includes('http://localhost:3000'), `${relative}: local canonical`);
  assert.ok(html.includes(info.siteUrl), `${relative}: canonical origin`);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"<>]+)"/g)) {
    const url = match[1].replaceAll('&amp;', '&');
    if (url.startsWith('//')) continue;
    assert.ok(url === base || url.startsWith(base + '/'), `${relative}: missing base path: ${url}`);
    const resource = decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]);
    if (checked.has(resource)) continue;
    const target = path.join(output, resource);
    const s = await stat(target).catch(() => null);
    assert.ok(s, `${relative}: missing target: ${url}`);
    if (s.isDirectory()) await stat(path.join(target, 'index.html'));
    checked.add(resource);
  }
}
assert.equal(pages, 31, 'all content pages exported');
for (const from of Object.keys(redirects)) await stat(path.join(output, from, 'index.html'));
for (const file of ['404.html', 'index.txt', 'robots.txt', 'sitemap.xml', 'og.png', 'favicon.svg', '.nojekyll'])
  assert.ok((await stat(path.join(output, file))).isFile(), file);
assert.ok((await readFile(path.join(output, 'robots.txt'), 'utf8')).includes('Allow: /'));
console.log(`PASS: ${pages} static pages, ${Object.keys(redirects).length} redirects, ${checked.size} local targets, base path, metadata and 404.`);

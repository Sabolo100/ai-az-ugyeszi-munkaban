import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import redirects from '../content/redirects.json' with { type: 'json' };

const root = path.resolve(import.meta.dirname, '..');
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '/ai-az-ugyeszi-munkaban';
if (base && !/^\/[a-zA-Z0-9_-]+$/.test(base)) throw new Error('Invalid Pages base path');
const env = {
  ...process.env,
  PAGES_BUILD: '1',
  SITE_PUBLIC: '1',
  NEXT_TELEMETRY_DISABLED: '1',
  NEXT_PUBLIC_BASE_PATH: base,
  SITE_ORIGIN: process.env.SITE_ORIGIN || `https://sabolo100.github.io${base}`,
};
// Native Next.js export supports project-subdirectory hosting on GitHub Pages.
// The existing Vinext/Worker build remains available through npm run build.
const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build', '--webpack'], {
  cwd: root, env, stdio: 'inherit', windowsHide: true,
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);

const output = path.join(root, 'out');
for (const [from, to] of Object.entries(redirects)) {
  const target = `${base}${to}/`;
  const directory = path.join(output, from);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), `<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><title>Átirányítás</title>
<meta name="robots" content="noindex"><link rel="canonical" href="${env.SITE_ORIGIN}${to}/">
<meta http-equiv="refresh" content="0;url=${target}"></head>
<body><p>Az oldal új helyre költözött. <a href="${target}">Tovább az oldalra</a></p>
<script>location.replace(${JSON.stringify(target)}+location.search+location.hash)</script></body></html>`);
}
await writeFile(path.join(output, '.nojekyll'), '');
await writeFile(path.join(output, 'build-info.json'), JSON.stringify({
  basePath: base, siteUrl: env.SITE_ORIGIN, builtAt: new Date().toISOString(),
}));
console.log(`GitHub Pages export ready: ${output}`);

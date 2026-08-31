import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const origin = process.env.CHECK_ORIGIN || 'http://localhost:3000';
const tasks = [
  'emailek',
  'szerzodesek',
  'hanganyagok',
  'vallomasok',
  'belso-iratok',
  'penzmozgasok',
  'jogi-kutatas',
  'ugyirat',
];
const methods = [
  'promptolas',
  'sajat-alkalmazas',
  'agentek',
  'kesz-rendszerek',
];
const chapters = [
  'vezetoi-attekintes',
  'jogi-keret-es-munkafolyamat',
  'tenyallasok-es-bizonyitasi-terv',
  'ai-eszkozok-es-biztonsagos-hasznalat',
  'bevezetes-meres-es-dontesi-terv',
  'forrasjegyzek-es-kutatasi-korlatok',
];
const routes = [
  '/',
  '/feladatok',
  '/modszerek',
  '/eszkozok',
  '/eszkozok/intezmenyi-peldak',
  '/mintaugy',
  '/indulas',
  '/hatter',
  '/hatter/folyamat-es-ido',
  '/hatter/tenyallasok',
  '/hatter/biztonsagos-hasznalat',
  '/tanulmany',
  '/forrasok',
  ...tasks.map((x) => '/feladatok/' + x),
  ...methods.map((x) => '/modszerek/' + x),
  ...chapters.map((x) => '/tanulmany/' + x),
];
const known = new Set(routes);
const results = [];
const links = new Set();
for (const route of routes) {
  const res = await fetch(origin + route);
  const html = await res.text();
  assert.equal(res.status, 200, route);
  assert.match(html, /<html[^>]+lang="hu"/, route + ' language');
  assert.match(html, /<h1[\s>]/, route + ' h1');
  assert.doesNotMatch(
    html,
    /Build Error|Internal Server Error|Untitled site/,
    route + ' no placeholder',
  );
  assert.match(
    html,
    /<meta name="description" content="[^"]+"/,
    route + ' description',
  );
  for (const m of html.matchAll(/href="(\/[^"?#]*)(?:[^" ]*)"/g))
    if (
      !m[1].startsWith('/@') &&
      !m[1].startsWith('/node_modules') &&
      !m[1].startsWith('/assets')
    )
      links.add(m[1]);
  results.push({ route, status: res.status });
}
for (const link of links) {
  if (known.has(link)) continue;
  const res = await fetch(origin + link);
  assert.ok(res.status < 400, `Broken link ${link}: ${res.status}`);
}
for (const route of [
  '/tudastar',
  '/tudastar/ugyeszi-munka',
  '/tudastar/idoveszteseg-es-gyorsitas',
  '/tudastar/tenyek-es-bizonyitas',
  '/tudastar/ai-a-gyakorlatban',
  '/tudastar/eszkozok-es-beszerzes',
  '/tudastar/jogi-es-adatvedelmi-garanciak',
  '/tudastar/kilencven-napos-proba',
  '/tudastar/mintaugy',
]) {
  const r = await fetch(origin + route, { redirect: 'manual' });
  assert.ok([301, 302, 307, 308].includes(r.status), route + ' redirect');
  const loc = r.headers.get('location');
  assert.ok(loc, route + ' location');
  results.push({ route, status: r.status, redirect: loc });
}
const missing = await fetch(origin + '/nem-letezo-oldal');
assert.equal(missing.status, 404, 'unknown route status');
for (const asset of [
  '/og.png',
  '/favicon.svg',
  '/robots.txt',
  '/sitemap.xml',
  '/letoltesek/level-prompt.txt',
  '/letoltesek/fejlesztesi-keres.txt',
  '/letoltesek/teljes-tanulmany.html',
  '/letoltesek/teljes-tanulmany.docx',
]) {
  const r = await fetch(origin + asset);
  assert.equal(r.status, 200, asset);
}
const refs = JSON.parse(
  await readFile(
    new URL('../content/references.json', import.meta.url),
    'utf8',
  ),
);
assert.equal(refs.length, 11, 'R01–R11 complete');
await mkdir(new URL('../qa/', import.meta.url), { recursive: true });
await writeFile(
  new URL('../qa/routes.json', import.meta.url),
  JSON.stringify(
    {
      date: new Date().toISOString(),
      origin,
      routes: results,
      checkedInternalLinks: links.size,
      missingRouteStatus: missing.status,
      references: refs.length,
    },
    null,
    2,
  ),
);
console.log(
  `PASS: ${routes.length} pages, 9 legacy redirects, ${links.size} internal links, 8 assets, 404 status, 11 reference records.`,
);

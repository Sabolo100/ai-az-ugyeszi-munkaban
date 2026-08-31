import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { marked } from 'marked';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const base = path.resolve(root, '..');
await mkdir(path.join(root, 'content'), { recursive: true });
await mkdir(path.join(root, 'public', 'letoltesek'), { recursive: true });
const names = [
  '00_vezetoi_attekintes',
  '01_jogi_keret_es_munkafolyamat',
  '02_tenyallasok_es_bizonyitasi_terv',
  '03_ai_eszkozok_es_biztonsagos_hasznalat',
  '04_bevezetes_meres_es_dontesi_terv',
  '05_forrasjegyzek_es_kutatasi_korlatok',
];
const docs = {};
for (const name of names) {
  const md = await readFile(
    path.join(base, 'munkaanyag', name + '.md'),
    'utf8',
  );
  let html = await marked.parse(md);
  let index = 0;
  html = html.replace(
    /<h([1-6])>(.*?)<\/h\1>/g,
    (_, level, text) =>
      `<h${Math.min(6, Number(level) + 1)} id="szakasz-${++index}">${text}</h${Math.min(6, Number(level) + 1)}>`,
  );
  html = html.replace(/<table>([\s\S]*?)<\/table>/g, (_, table) => {
    const labels = [...table.matchAll(/<th[^>]*>(.*?)<\/th>/g)].map((m) =>
      m[1].replace(/<[^>]*>/g, '').replace(/"/g, '&quot;'),
    );
    const withLabels = table.replace(/<tr>([\s\S]*?)<\/tr>/g, (_, row) => {
      let i = 0;
      return (
        '<tr>' +
        row.replace(
          /<td([^>]*)>/g,
          (_, attrs) => `<td${attrs} data-label="${labels[i++] || ''}">`,
        ) +
        '</tr>'
      );
    });
    return (
      '<table class="reader-table">' +
      withLabels.replace(/<th>/g, '<th scope="col">') +
      '</table>'
    );
  });
  html = html.replace(/\[F(\d\d)\]/g, '[<a href="/forrasok#F$1">F$1</a>]');
  if (name.startsWith('05_'))
    html = html.replace(
      /<strong>\[<a href="\/forrasok#F(\d\d)">F\1<\/a>\]/g,
      '<strong id="F$1">[F$1]',
    );
  docs[name + '.md'] = {
    html,
    headings: [...html.matchAll(/<h[23] id="([^"]+)">(.*?)<\/h[23]>/g)].map(
      (m) => ({ id: m[1], text: m[2].replace(/<[^>]+>/g, '') }),
    ),
  };
}
const spec = await readFile(
  path.join(base, 'weboldal_specifikacio_v2', '02_Fooldal_es_bemutatok.md'),
  'utf8',
);
const prompts = [...spec.matchAll(/```text\r?\n([\s\S]*?)```/g)].map((m) =>
  m[1].trim(),
);
await writeFile(path.join(root, 'content', 'study.json'), JSON.stringify(docs));
await writeFile(
  path.join(root, 'content', 'prompts.json'),
  JSON.stringify({ email: prompts[0], contract: prompts[1] }),
);
const refs = await readFile(
  path.join(
    base,
    'weboldal_specifikacio_v2',
    '03_Eszkozok_es_intezmenyi_peldak.md',
  ),
  'utf8',
);
await writeFile(
  path.join(root, 'content', 'references.json'),
  JSON.stringify(
    [
      ...refs.matchAll(
        /- \*\*(R\d+) — (.*?)\*\* (.*?)\[([^\]]+)\]\(([^)]+)\)/g,
      ),
    ].map((m) => ({
      id: m[1],
      title: m[2],
      description: m[3],
      label: m[4],
      url: m[5],
    })),
  ),
);
for (const ext of ['md', 'html', 'docx'])
  await copyFile(
    path.join(
      base,
      'munkaanyag',
      `Kozpenzugyi_korrupcio_AI_munkaanyag_2026-08-30.${ext}`,
    ),
    path.join(root, 'public', 'letoltesek', `teljes-tanulmany.${ext}`),
  );
await writeFile(
  path.join(root, 'public', 'letoltesek', 'level-prompt.txt'),
  prompts[0],
);
await writeFile(
  path.join(root, 'public', 'letoltesek', 'fejlesztesi-keres.txt'),
  prompts[1],
);
console.log(
  `Imported ${names.length} complete chapters and ${prompts.length} original prompts.`,
);

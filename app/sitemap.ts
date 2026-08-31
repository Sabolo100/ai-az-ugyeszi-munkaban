import { tasks, methods, studyChapters } from '@/lib/content';
export const dynamic = 'force-static';
export default function sitemap() {
  const origin = process.env.SITE_ORIGIN || 'http://localhost:3000';
  return [
    '',
    'feladatok',
    'modszerek',
    'eszkozok',
    'eszkozok/intezmenyi-peldak',
    'mintaugy',
    'indulas',
    'hatter',
    'hatter/folyamat-es-ido',
    'hatter/tenyallasok',
    'hatter/biztonsagos-hasznalat',
    'tanulmany',
    'forrasok',
    ...tasks.map((t) => 'feladatok/' + t.id),
    ...methods.map((m) => 'modszerek/' + m.id),
    ...studyChapters.map((c) => 'tanulmany/' + c.id),
  ].map((p) => ({ url: `${origin}/${p}` }));
}

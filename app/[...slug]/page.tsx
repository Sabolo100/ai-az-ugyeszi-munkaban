import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import {
  TaskCatalog,
  TaskDetail,
  MethodsPage,
  MethodDetail,
  ToolCatalog,
  Institutions,
  CasePage,
  StartPage,
  BackgroundPage,
} from '@/components/pages';
import { Reader, SourcesPage } from '@/components/reader';
import { tasks, methods, studyChapters } from '@/lib/content';
const legacy: Record<string, string> = {
  tudastar: '/hatter',
  'tudastar/ugyeszi-munka': '/hatter/folyamat-es-ido',
  'tudastar/idoveszteseg-es-gyorsitas': '/hatter/folyamat-es-ido',
  'tudastar/tenyek-es-bizonyitas': '/hatter/tenyallasok',
  'tudastar/ai-a-gyakorlatban':
    '/tanulmany/ai-eszkozok-es-biztonsagos-hasznalat',
  'tudastar/eszkozok-es-beszerzes':
    '/tanulmany/bevezetes-meres-es-dontesi-terv',
  'tudastar/jogi-es-adatvedelmi-garanciak': '/hatter/biztonsagos-hasznalat',
  'tudastar/kilencven-napos-proba':
    '/tanulmany/bevezetes-meres-es-dontesi-terv',
  'tudastar/mintaugy': '/mintaugy',
  'tanulmany/00_vezetoi_attekintes': '/tanulmany/vezetoi-attekintes',
  'tanulmany/01_jogi_keret_es_munkafolyamat':
    '/tanulmany/jogi-keret-es-munkafolyamat',
  'tanulmany/02_tenyallasok_es_bizonyitasi_terv':
    '/tanulmany/tenyallasok-es-bizonyitasi-terv',
  'tanulmany/03_ai_eszkozok_es_biztonsagos_hasznalat':
    '/tanulmany/ai-eszkozok-es-biztonsagos-hasznalat',
  'tanulmany/04_bevezetes_meres_es_dontesi_terv':
    '/tanulmany/bevezetes-meres-es-dontesi-terv',
  'tanulmany/05_forrasjegyzek_es_kutatasi_korlatok':
    '/tanulmany/forrasjegyzek-es-kutatasi-korlatok',
};
const pageTitles: Record<string, string> = {
  feladatok: 'Melyik munkájában segíthet az AI?',
  modszerek: 'Négy módszer az AI használatához',
  eszkozok: 'Eszközök és rendszerek',
  'eszkozok/intezmenyi-peldak': 'SFO és STF — intézményi tapasztalatok',
  mintaugy: 'Öt iratcsomag. Egy beszerzés.',
  indulas: 'Induljon egyetlen feladattal',
  hatter: 'A munkalap mögötti tudás',
  'hatter/folyamat-es-ido': 'Melyik időt tudjuk rövidíteni?',
  'hatter/tenyallasok': 'Tényállások és bizonyítás',
  'hatter/biztonsagos-hasznalat': 'Biztonságos AI-használat',
  tanulmany: 'Teljes tanulmány',
  forrasok: 'Forrásjegyzék',
};
export function generateStaticParams() {
  return [
    ...Object.keys(pageTitles),
    ...tasks.map((t) => `feladatok/${t.id}`),
    ...methods.map((m) => `modszerek/${m.id}`),
    ...studyChapters.map((c) => `tanulmany/${c.id}`),
  ].map((path) => ({ slug: path.split('/') }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join('/');
  const t =
    slug[0] === 'feladatok' ? tasks.find((t) => t.id === slug[1]) : undefined;
  const m =
    slug[0] === 'modszerek' ? methods.find((t) => t.id === slug[1]) : undefined;
  const c =
    slug[0] === 'tanulmany'
      ? studyChapters.find((t) => t.id === slug[1])
      : undefined;
  const title =
    t?.title ||
    m?.title ||
    c?.title ||
    pageTitles[path] ||
    'Az oldal nem található';
  const description =
    t?.description ||
    m?.description ||
    `${title}. Konkrét feladatok, ellenőrizhető minták és szakmai összefüggések az AI ügyészi alkalmazásához.`;
  const origin = process.env.SITE_ORIGIN || 'http://localhost:3000';
  return {
    title,
    description,
    alternates: { canonical: `${origin}/${path}` },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'hu_HU',
      images: [],
    },
    twitter: { title, description, card: 'summary', images: [] },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.join('/');
  if (legacy[path]) redirect(legacy[path]);
  if (path === 'feladatok') return <TaskCatalog />;
  if (
    slug.length === 2 &&
    slug[0] === 'feladatok' &&
    tasks.some((t) => t.id === slug[1])
  )
    return <TaskDetail id={slug[1]} />;
  if (path === 'modszerek') return <MethodsPage />;
  if (
    slug.length === 2 &&
    slug[0] === 'modszerek' &&
    methods.some((t) => t.id === slug[1])
  )
    return <MethodDetail id={slug[1]} />;
  if (path === 'eszkozok') return <ToolCatalog />;
  if (path === 'eszkozok/intezmenyi-peldak') return <Institutions />;
  if (path === 'mintaugy') return <CasePage />;
  if (path === 'indulas') return <StartPage />;
  if (path === 'hatter') return <BackgroundPage />;
  if (
    slug.length === 2 &&
    slug[0] === 'hatter' &&
    ['folyamat-es-ido', 'tenyallasok', 'biztonsagos-hasznalat'].includes(
      slug[1],
    )
  )
    return <BackgroundPage kind={slug[1]} />;
  if (path === 'forrasok') return <SourcesPage />;
  if (path === 'tanulmany') return <Reader />;
  if (
    slug.length === 2 &&
    slug[0] === 'tanulmany' &&
    studyChapters.some((t) => t.id === slug[1])
  )
    return <Reader chapter={slug[1]} />;
  notFound();
}

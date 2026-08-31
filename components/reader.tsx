import Link from 'next/link';
import { ArrowUpRight, Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { PageHeading, Note } from '@/components/pages';
import { studyChapters } from '@/lib/content';
import study from '@/content/study.json';
import references from '@/content/references.json';
const docs = study as Record<
  string,
  { html: string; headings: { id: string; text: string }[] }
>;
// Imported HTML does not pass through next/link, so its internal source links
// need the same repository prefix as the GitHub Pages application.
function readerHtml(html: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return html.replace(/href="\/(?!\/)/g, `href="${base}/`);
}
export function Reader({
  chapter = 'vezetoi-attekintes',
}: {
  chapter?: string;
}) {
  const index = studyChapters.findIndex((c) => c.id === chapter);
  const c = studyChapters[index] || studyChapters[0];
  const d = docs[c.file];
  return (
    <main id="main" className="page-shell reader-shell">
      <PageHeading
        section="TELJES TANULMÁNY / OLVASÓNÉZET"
        title={c.title}
        description="Az eredeti döntés-előkészítő munkaanyag változatlan tartalma. Kutatási zárónap: 2026. augusztus 30. A jogállapot és az intézményi működés konkrét felhasználás előtt újraellenőrzendő."
      />
      <div className="reader-layout">
        <aside className="reader-sidebar">
          <nav aria-label="Tanulmány fejezetei">
            <span className="eyebrow">TARTALOMJEGYZÉK</span>
            {studyChapters.map((s, i) => (
              <Link
                prefetch={false}
                key={s.id}
                href={`/tanulmany/${s.id}`}
                aria-current={s.id === c.id ? 'page' : undefined}
              >
                <span>0{i}</span>
                {s.title}
              </Link>
            ))}
          </nav>
          <details className="reader-outline">
            <summary>Ezen az oldalon</summary>
            {d.headings.map((h) => (
              <Link prefetch={false} key={h.id} href={`#${h.id}`}>
                {h.text}
              </Link>
            ))}
          </details>
          <Link
            prefetch={false}
            className="download-link"
            href="/letoltesek/teljes-tanulmany.docx"
            download
          >
            <Download size={15} /> Teljes anyag · Word
          </Link>
          <Link
            prefetch={false}
            className="download-link"
            href="/letoltesek/teljes-tanulmany.html"
            download
          >
            <Download size={15} /> Teljes anyag · HTML
          </Link>
        </aside>
        <div className="reader-main">
          <Note>
            A fejezet az átadott kutatási anyagot őrzi meg. Nem önálló,
            naprakész jogi szakvélemény; a benne szereplő becslések és
            forgatókönyvek nem magyar intézményi teljesítménymérések.
          </Note>
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: readerHtml(d.html) }}
          />
          <nav className="reader-next" aria-label="Fejezetváltás">
            {index > 0 ? (
              <Link
                prefetch={false}
                href={`/tanulmany/${studyChapters[index - 1].id}`}
              >
                <ArrowLeft size={16} />
                {studyChapters[index - 1].title}
              </Link>
            ) : (
              <span />
            )}
            {index < studyChapters.length - 1 && (
              <Link
                prefetch={false}
                href={`/tanulmany/${studyChapters[index + 1].id}`}
              >
                {studyChapters[index + 1].title}
                <ArrowRight size={16} />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </main>
  );
}
export function SourcesPage() {
  return (
    <main id="main" className="page-shell">
      <PageHeading
        section="FORRÁSJEGYZÉK"
        title="Az állításoktól az eredeti forrásig."
        description="Az eredeti kutatás F-sorozatát külön egészítik ki az új eszköz- és intézményi példák R01–R11 forrásai. Gyártói leírás, intézményi közlés és jogszabály eltérő szerepű forrás."
      />
      <Note>
        A linkek az eredeti dokumentumokhoz vezetnek. A források változhatnak; a
        kutatási anyag szerinti ellenőrzési dátum 2026. augusztus 30. A
        forráslista nem terméktanúsítás vagy engedélyezési jegyzék.
      </Note>
      <section className="content-section">
        <h2>Kiegészítő eszköz- és intézményi források</h2>
        <div className="reference-list">
          {references.map((r) => (
            <article id={r.id} key={r.id}>
              <span>{r.id}</span>
              <div>
                <h3>{r.title}</h3>
                <p>{r.description}</p>
                <Link
                  prefetch={false}
                  href={r.url}
                  className="text-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {r.label}
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="content-section">
        <h2>Az eredeti kutatás forrásai</h2>
        <article
          className="prose source-prose"
          dangerouslySetInnerHTML={{
            __html: readerHtml(docs['05_forrasjegyzek_es_kutatasi_korlatok.md'].html),
          }}
        />
      </section>
    </main>
  );
}

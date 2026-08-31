'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
  Files,
  AudioLines,
  MessagesSquare,
  Network,
  Receipt,
  Search,
  ListChecks,
  Terminal,
  Workflow,
  Layers,
  Quote,
  FileText,
} from 'lucide-react';
import { tasks, methods, toolsData, type Task } from '@/lib/content';
import { Eyebrow, DemoLabel } from '@/components/site';
const icons = [
  Mail,
  Files,
  AudioLines,
  MessagesSquare,
  Network,
  Receipt,
  Search,
  ListChecks,
];
export function TaskCard({ task }: { task: Task }) {
  const Icon = icons[tasks.indexOf(task)] || FileText;
  return (
    <Link prefetch={false} href={`/feladatok/${task.id}`} className="task-card">
      <div className="task-card-top">
        <Icon size={23} strokeWidth={1.5} />
        <span className="mono">
          {String(tasks.indexOf(task) + 1).padStart(2, '0')}
        </span>
      </div>
      <h3>{task.short}</h3>
      <p>{task.description}</p>
      <div className="task-card-result">
        <span>{task.output}</span>
        <ArrowUpRight size={18} />
      </div>
    </Link>
  );
}
export function TaskCards() {
  return (
    <div className="task-grid">
      {tasks.slice(0, 6).map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
export function MethodExplorer() {
  const [active, setActive] = useState(0);
  const m = methods[active];
  const Icon = [MessagesSquare, Terminal, Workflow, Layers][active];
  return (
    <div className="method-explorer">
      <div className="method-list" role="tablist" aria-label="AI-módszerek">
        {methods.map((item, i) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={active === i}
            aria-controls="method-preview"
            id={`method-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              let next = i;
              if (e.key === 'ArrowDown' || e.key === 'ArrowRight')
                next = (i + 1) % 4;
              else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft')
                next = (i + 3) % 4;
              else if (e.key === 'Home') next = 0;
              else if (e.key === 'End') next = 3;
              else return;
              e.preventDefault();
              setActive(next);
              document.getElementById(`method-${next}`)?.focus();
            }}
          >
            <span>0{i + 1}</span>
            {item.name}
            <ArrowUpRight size={18} />
          </button>
        ))}
      </div>
      <div
        className="method-preview"
        id="method-preview"
        role="tabpanel"
        aria-labelledby={`method-${active}`}
        tabIndex={0}
      >
        <div className="method-preview-label">
          <span className="eyebrow">{m.tag}</span>
          <Icon size={29} strokeWidth={1.3} />
        </div>
        <h3>{m.title}</h3>
        <p>{m.description}</p>
        <div className="method-example">
          <span className="overline">EGY KONKRÉT PÉLDA</span>
          <p>{m.example}</p>
        </div>
        <Link
          prefetch={false}
          className="text-link"
          href={`/modszerek/${m.id}`}
        >
          Megnézem a módszert <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
export function ProcessStrip() {
  return (
    <div className="process-strip">
      {[
        'Ügyindítás',
        'Adatbeszerzés',
        'Feldolgozás',
        'Bizonyítás ellenőrzése',
        'Ügyészi döntés',
      ].map((x, i) => (
        <Link
          prefetch={false}
          key={x}
          className={i === 2 ? 'highlight' : ''}
          href="/hatter/folyamat-es-ido"
        >
          <span>0{i + 1}</span>
          <strong>{x}</strong>
          {i === 2 ? (
            <small>Itt segíthet közvetlenül az AI</small>
          ) : (
            <ArrowRight size={15} />
          )}
        </Link>
      ))}
    </div>
  );
}
export function HomeSections() {
  return (
    <>
      <section className="section methods-section" id="modszerek">
        <Eyebrow>02 / HOGYAN HASZNÁLJAM?</Eyebrow>
        <div className="section-heading">
          <h2>
            Négy út.
            <br />
            <em>Ugyanaz a cél: jobb munkalap.</em>
          </h2>
          <p>
            A pontos kéréstől a saját alkalmazáson át a szakmai platformig. Nem
            kötelező fejlődési létra: a feladat dönti el, mire van szükség.
          </p>
        </div>
        <MethodExplorer />
      </section>
      <section className="section tools-section" id="eszkozok">
        <div className="section-heading">
          <div>
            <Eyebrow>03 / ESZKÖZÖK ÉS RENDSZEREK</Eyebrow>
            <h2>
              A módszer mellé
              <br />
              <em>válasszon eszközt.</em>
            </h2>
          </div>
          <Link prefetch={false} className="text-link" href="/eszkozok">
            A teljes eszközkatalógus <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="tools-editorial">
          {[
            [
              'Mintafeladatokhoz',
              'Egy pontos kérésből strukturált eredmény.',
              ['chatgpt'],
            ],
            [
              'Saját megoldásokhoz',
              'Fejlesztés és összekapcsolt munkalépések.',
              ['codex', 'claude-code', 'n8n'],
            ],
            [
              'Szakmai munkakörnyezethez',
              'Nagy iratanyag, csapatmunka és jogi kutatás.',
              ['relativity', 'nuix', 'libra'],
            ],
          ].map(([title, desc, ids]) => (
            <div key={title as string}>
              <span className="overline">{title as string}</span>
              <div className="tool-name-list">
                {(ids as string[]).map((id) => {
                  const t = toolsData.find((t) => t.id === id)!;
                  return (
                    <Link prefetch={false} href={`/eszkozok#${id}`} key={id}>
                      {t.name}
                      <ArrowUpRight size={16} />
                    </Link>
                  );
                })}
              </div>
              <p>{desc as string}</p>
            </div>
          ))}
        </div>
        <p className="fine-print">
          Gyártói funkcióleírásokra épülő tájékozódási pontok, nem magyar
          hatósági engedélyezettséget igazoló lista. Valós ügyadatnál a konkrét
          szolgáltatás és az intézményi feltételek külön ellenőrizendők.
        </p>
      </section>
      <section className="section experience-section">
        <Eyebrow>04 / DOKUMENTÁLT INTÉZMÉNYI PÉLDÁK</Eyebrow>
        <div className="section-heading">
          <h2>
            Ez már nem
            <br />
            <em>csak gondolatkísérlet.</em>
          </h2>
          <Link
            prefetch={false}
            className="text-link"
            href="/eszkozok/intezmenyi-peldak"
          >
            Mit tanulhatunk belőlük? <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="experience-grid">
          <article className="sfo-feature">
            <span className="overline">
              EGYESÜLT KIRÁLYSÁG · SERIOUS FRAUD OFFICE
            </span>
            <div className="sfo-stat">
              <span>akár</span>
              <strong>
                40<em>%</em>
              </strong>
            </div>
            <h3>Gyorsabb iratátvizsgálás egy pilotban.</h3>
            <p>
              Az SFO 2025-ös közlése a disclosure célú dokumentumvizsgálatra
              vonatkozik. Nem a teljes büntetőeljárás rövidülése, és nem magyar
              teljesítményígéret.
            </p>
            <Link
              prefetch={false}
              className="text-link"
              href="https://www.gov.uk/government/news/serious-fraud-office-sets-out-next-steps-in-ambitious-plan"
              target="_blank"
              rel="noreferrer"
            >
              Intézményi forrás · 2025. 04. 03. <ArrowUpRight size={16} />
            </Link>
          </article>
          <article className="stf-feature">
            <span className="overline">
              BRAZÍLIA · SUPREMO TRIBUNAL FEDERAL
            </span>
            <Quote size={40} strokeWidth={1} className="quote-icon" />
            <h3>
              Hasonló ügyek.
              <br />
              <em>Felismerhető mintázatok.</em>
            </h3>
            <p>
              A VitórIA hasonló témájú ügyek csoportosítását segíti. Az STF
              2023-ban engedélyezte az integrációját digitális platformjába. A
              példa bírósági ügycsoportosításról szól, nem korrupciós bűnösség
              megállapításáról.
            </p>
            <Link
              prefetch={false}
              className="text-link"
              href="https://stj.jus.br/internet_docs/biblioteca/clippinglegislacao/Res_800_2023_STF.pdf"
              target="_blank"
              rel="noreferrer"
            >
              800/2023. határozat <ArrowUpRight size={16} />
            </Link>
          </article>
        </div>
      </section>
      <section className="case-banner" id="pelda">
        <div className="case-banner-copy">
          <Eyebrow>05 / NÉZZÜK EGY ÜGYÖN!</Eyebrow>
          <h2>
            Öt iratcsomag.
            <br />
            Egy beszerzés.
            <br />
            <em>Ön mit kérdezne?</em>
          </h2>
          <p>
            Egy tervezet módosul. Levelek utalnak az egyeztetésre. Később eltérő
            beszámolók születnek, majd kifizetnek egy számlát. Járja végig a
            fiktív ügyet, és nézze meg, hol segíthet az AI.
          </p>
          <Link prefetch={false} className="button light" href="/mintaugy">
            Elindítom a fiktív bemutatót <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="case-index">
          <div className="case-index-header">
            <span>OKTATÁSI ÜGY / 2026–01</span>
            <FileText size={24} />
          </div>
          {[
            'Levelezés',
            'Szerződésmódosítás',
            'Vallomások',
            'Teljesítés és kifizetés',
            'Bizonyítási kérdések',
          ].map((title, i) => (
            <Link
              prefetch={false}
              href={`/mintaugy?lepes=${i + 1}&ful=forrasok`}
              key={title}
            >
              <span>0{i + 1}</span>
              <strong>{title}</strong>
              <ArrowUpRight size={17} />
            </Link>
          ))}
          <DemoLabel />
        </div>
      </section>
      <section className="section" id="folyamat">
        <span id="ido" />
        <Eyebrow>06 / A MUNKÁTÓL AZ ELJÁRÁSIG</Eyebrow>
        <div className="section-heading">
          <h2>
            Gyorsabb feldolgozás.
            <br />
            <em>És rövidebb eljárás?</em>
          </h2>
          <p>
            Nem minden időveszteség olvasási idő. Külön mérjük az emberi munkát
            és az ügy teljes átfutását.
          </p>
        </div>
        <ProcessStrip />
        <div className="process-bottom">
          <p>
            Az AI főként a már hozzáférhető anyag feldolgozásában és az
            ellenőrzés előkészítésében segíthet. Egy külföldi válasz vagy
            szakértői vizsgálat várakozási idejét önmagában nem szünteti meg.
          </p>
          <Link
            prefetch={false}
            href="/hatter/folyamat-es-ido"
            className="text-link"
          >
            A folyamat részletesen <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="start-section" id="probaterv">
        <Eyebrow>07 / AZ ELSŐ SAJÁT LÉPÉS</Eyebrow>
        <h2>
          Melyik feladattal
          <br />
          <em>kezdené?</em>
        </h2>
        <p>
          Nem kell rögtön rendszert választania. Elég egy kérdés, egy ismétlődő
          feladat vagy egy közösen megtervezett próba.
        </p>
        <div className="start-options">
          <Link prefetch={false} href="/indulas?ut=prompt">
            Megnéznék egy jó promptot <ArrowUpRight size={20} />
          </Link>
          <Link prefetch={false} href="/indulas?ut=otlet">
            Van egy ismétlődő feladatom <ArrowUpRight size={20} />
          </Link>
          <Link prefetch={false} href="/indulas?ut=pilot">
            A kollégákkal próbálnánk ki <ArrowUpRight size={20} />
          </Link>
        </div>
        <small>
          Kizárólag mintadatok. Regisztráció és ügyiratfeltöltés nélkül.
        </small>
      </section>
    </>
  );
}

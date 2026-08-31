'use client';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Download,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Info,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import {
  tasks,
  methods,
  toolsData,
  toolTypes,
  readiness,
  agentSteps,
  studyChapters,
  taskPrompt,
  type Task,
} from '@/lib/content';
import prompts from '@/content/prompts.json';
import {
  Eyebrow,
  DemoLabel,
  Workbench,
  sources,
  SourcePanel,
  SourceButton,
} from '@/components/site';
import {
  TaskCard,
  MethodExplorer,
  ProcessStrip,
} from '@/components/home-sections';

export function PageHeading({
  section,
  title,
  description,
}: {
  section: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <Link prefetch={false} className="breadcrumb" href="/">
        Főoldal <span>/</span>
      </Link>
      <Eyebrow>{section}</Eyebrow>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="notice">
      <Info size={18} />
      <p>{children}</p>
    </div>
  );
}
export function CopyBlock({
  text,
  title = 'Teljes mintakérés',
  download,
}: {
  text: string;
  title?: string;
  download?: string;
}) {
  const [status, setStatus] = useState('');
  const [fallback, setFallback] = useState(false);
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Másolva — a teljes fiktív bemenettel együtt.');
    } catch {
      setFallback(true);
      setStatus(
        'A vágólap nem elérhető. Jelölje ki és másolja a szöveget az alábbi mezőből.',
      );
    }
  }
  useEffect(() => {
    if (fallback) {
      ref.current?.focus();
      ref.current?.select();
    }
  }, [fallback]);
  return (
    <section className="copy-block">
      <div className="copy-heading">
        <span className="eyebrow">{title}</span>
        <Button className="copy-button" onClick={copy}>
          {status.startsWith('Másolva') ? (
            <Check size={15} />
          ) : (
            <Copy size={15} />
          )}
          Másolás mintadatokkal
        </Button>
      </div>
      <details>
        <summary>A teljes szöveg megnyitása</summary>
        <pre>{text}</pre>
      </details>
      {fallback && (
        <>
          <label htmlFor={id}>Kijelölhető mintakérés</label>
          <Textarea
            id={id}
            ref={ref}
            value={text}
            readOnly
            className="fallback-text"
          />
        </>
      )}
      <output className="copy-status" aria-live="polite">
        {status || 'A gomb nem küld adatot külső AI-szolgáltatásnak.'}
      </output>
      {download && (
        <Link
          prefetch={false}
          className="download-link"
          href={download}
          download
        >
          <Download size={14} /> Szövegfájl letöltése
        </Link>
      )}
    </section>
  );
}
export function ShareButton() {
  const [status, setStatus] = useState('');
  return (
    <div className="share-action">
      <Button
        variant="outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(location.href);
            setStatus('Hivatkozás másolva.');
          } catch {
            setStatus(location.href);
          }
        }}
      >
        <LinkIcon size={14} /> Nézet megosztása
      </Button>
      <output>{status}</output>
    </div>
  );
}
function useQuery(initial: Record<string, string>) {
  const [defaults] = useState(initial);
  const [state, setState] = useState(initial);
  useEffect(() => {
    const read = () => {
      const q = new URLSearchParams(location.search);
      setState(
        Object.fromEntries(
          Object.entries(defaults).map(([k, v]) => [k, q.get(k) || v]),
        ),
      );
    };
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, [defaults]);
  function update(patch: Record<string, string>) {
    const next = { ...state, ...patch };
    const q = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v && v !== 'all') q.set(k, v);
    });
    history.pushState(
      null,
      '',
      `${location.pathname}${q.size ? '?' + q.toString() : ''}${location.hash}`,
    );
    setState(next);
  }
  return [state, update] as const;
}
export function TaskCatalog() {
  const [q, update] = useQuery({ tipus: 'all' });
  const shown = tasks.filter((t) => q.tipus === 'all' || t.type === q.tipus);
  return (
    <main id="main" className="page-shell">
      <PageHeading
        section="01 / FELADATKATALÓGUS"
        title="Melyik munkájában segíthet az AI?"
        description="Nyolc ismerős feladat, nyolc kézzelfogható kimenet. Válasszon irattípust, majd nézze meg a forrást, az eredményt és a használható mintakérést."
      />
      <div className="filter-bar">
        <label>
          Irattípus
          <NativeSelect
            value={q.tipus}
            onChange={(e) => update({ tipus: e.target.value })}
          >
            <NativeSelectOption value="all">
              Minden irattípus
            </NativeSelectOption>
            {tasks.map((t) => (
              <NativeSelectOption key={t.id} value={t.type}>
                {t.type}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
        <output>{shown.length} feladat</output>
      </div>
      <div className="task-grid">
        {shown.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      {!shown.length && <Empty reset={() => update({ tipus: 'all' })} />}
      <Note>
        Az eredmények ellenőrzendő munkadarabok. A bemutatók előre
        elkészítettek, és nem egy termék teszteredményei.
      </Note>
    </main>
  );
}
export function Empty({ reset }: { reset: () => void }) {
  return (
    <div className="empty-state">
      <Search size={30} />
      <h2>Nincs találat ezekkel a szűrőkkel.</h2>
      <p>Próbáljon másik feladatot, vagy nézze meg az összes lehetőséget.</p>
      <Button onClick={reset}>Szűrők törlése</Button>
    </div>
  );
}
function getPrompt(t: Task) {
  if (t.id === 'emailek') return prompts.email;
  if (t.id === 'szerzodesek') return prompts.contract;
  if (t.id === 'vallomasok')
    return taskPrompt({
      ...t,
      sample: ['T01', 'T02', 'T03']
        .map((id) => `${sources[id].title}\n${sources[id].text}`)
        .join('\n\n'),
    });
  return taskPrompt(t);
}
export function SampleView({ task }: { task: Task }) {
  return (
    <div className="custom-sample">
      <div className="sample-heading">
        <span className="eyebrow">NÉZZÜNK BELE!</span>
        <DemoLabel />
      </div>
      <Tabs defaultValue="output">
        <TabsList className="detail-tabs" aria-label="Feladat mintanézete">
          <TabsTrigger value="output">AI-munkalap</TabsTrigger>
          <TabsTrigger value="input">Teljes forrás</TabsTrigger>
          <TabsTrigger value="check">Ellenőrzés</TabsTrigger>
        </TabsList>
        <TabsContent value="output">
          <h3>{task.output}</h3>
          <pre>{task.result}</pre>
        </TabsContent>
        <TabsContent value="input">
          <h3>Teljes fiktív bemenet</h3>
          <pre>{task.sample}</pre>
        </TabsContent>
        <TabsContent value="check">
          <h3>Mit kell tisztázni?</h3>
          <ul>
            {task.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export function TaskDetail({ id }: { id: string }) {
  const t = tasks.find((t) => t.id === id)!;
  const m = methods.find((m) => m.id === t.method)!;
  return (
    <main id="main" className="page-shell">
      <PageHeading
        section={`FELADAT / ${t.type}`}
        title={t.title}
        description={t.description}
      />
      <div className="detail-lead">
        <div>
          <span className="overline">AZ AI-VAL KÉSZÜLŐ MUNKADARAB</span>
          <h2>{t.output}</h2>
          <p>{t.context}</p>
          <Link prefetch={false} className="text-link" href="#jogi-kontextus">
            Miért érdekes ez? <ArrowUpRight size={16} />
          </Link>
          <div className="mini-facts">
            <span>Kapcsolódó módszer</span>
            <Link prefetch={false} href={`/modszerek/${t.method}`}>
              {m.name} <ArrowRight size={15} />
            </Link>
          </div>
          <Link prefetch={false} className="button primary" href="#mintakeres">
            Megnézem a mintakérést <ArrowDownIcon />
          </Link>
        </div>
        {t.demo === 'custom' ? (
          <SampleView task={t} />
        ) : (
          <Workbench key={t.id} initial={t.demo} />
        )}
      </div>
      <div className="detail-columns">
        <section>
          <Eyebrow>01 / MI VISZI EL AZ IDŐT?</Eyebrow>
          <h2>
            Ismerős műveletek,
            <br />
            <em>ismétlődő munka.</em>
          </h2>
          <ol className="number-list">
            {t.time.map((x, i) => (
              <li key={x}>
                <span>0{i + 1}</span>
                {x}
              </li>
            ))}
          </ol>
        </section>
        <section>
          <Eyebrow>02 / MIT VÉGEZHET A RENDSZER?</Eyebrow>
          <h2>
            Bemenetből
            <br />
            <em>ellenőrizhető kimenet.</em>
          </h2>
          <ol className="number-list">
            {t.steps.map((x, i) => (
              <li key={x}>
                <span>0{i + 1}</span>
                {x}
              </li>
            ))}
          </ol>
          <p className="fine-print">
            Az OCR, a duplikációszűrés és a pontos számítás nem feltétlenül
            generatív AI. Az előkészítés is része a munkának.
          </p>
        </section>
      </div>
      <section id="mintakeres" className="content-section">
        <Eyebrow>03 / HOGYAN PRÓBÁLHATÓ KI?</Eyebrow>
        <h2>Induljon egy teljes mintából.</h2>
        <p>
          Másolja ki a kérést a kitalált bemenettel együtt. Nem kell saját
          ügyiratot keresnie. Külön futtatásnál az eredmény eltérhet; a
          mintakimenet nem teljesítménygarancia.
        </p>
        <CopyBlock
          text={getPrompt(t)}
          download={
            t.id === 'emailek'
              ? '/letoltesek/level-prompt.txt'
              : t.id === 'szerzodesek'
                ? '/letoltesek/fejlesztesi-keres.txt'
                : undefined
          }
        />
      </section>
      <div className="detail-columns">
        <section>
          <Eyebrow>04 / ESZKÖZVÁLASZTÁS</Eyebrow>
          <h2>Milyen eszköz kell hozzá?</h2>
          {t.tools.length ? (
            <div className="related-tools">
              {t.tools.map((id) => {
                const tool = toolsData.find((x) => x.id === id)!;
                return (
                  <Link
                    prefetch={false}
                    key={id}
                    href={`/eszkozok?feladat=${t.id}#${id}`}
                  >
                    <strong>{tool.name}</strong>
                    <span>{tool.type}</span>
                    <ArrowUpRight size={17} />
                  </Link>
                );
              })}
            </div>
          ) : (
            <p>
              A hangfeldolgozás beszédfelismerést, keresést és összefoglalást
              kombinál. A magyar beszédfelismerési minőséget külön mintán kell
              vizsgálni; itt nem ajánlunk ellenőrizetlen terméket.
            </p>
          )}
        </section>
        <section id="jogi-kontextus">
          <Eyebrow>05 / MIÉRT SZÁMÍT EZ AZ ÜGYBEN?</Eyebrow>
          <h2>{t.context}</h2>
          <p>{t.legal}</p>
          <details className="disclosure">
            <summary>Ügyészi feladat és szakmai korlátok</summary>
            <p>
              A munkalap javaslat: a forráshűség, a megszerzés törvényessége és
              az alternatív magyarázatok ellenőrzése emberi feladat. Az
              alkalmazandó jog időállapota konkrét ügyben újraellenőrzendő.
            </p>
            <Link
              prefetch={false}
              className="text-link"
              href="/hatter/tenyallasok"
            >
              Tényállási és bizonyítási térkép <ArrowUpRight size={16} />
            </Link>
          </details>
        </section>
      </div>
      <section className="measurement">
        <Eyebrow>06 / HOGYAN MÉRJÜK A HASZNOT?</Eyebrow>
        <h2>Az ellenőrzéssel együtt számoljon.</h2>
        <p>{t.measure}</p>
        <Link
          prefetch={false}
          href="/tanulmany/bevezetes-meres-es-dontesi-terv"
          className="text-link"
        >
          Teljes mérési és bevezetési terv <ArrowUpRight size={16} />
        </Link>
      </section>
      <NextLinks />
    </main>
  );
}
function ArrowDownIcon() {
  return <ArrowRight size={16} style={{ transform: 'rotate(90deg)' }} />;
}
export function NextLinks() {
  return (
    <div className="next-links">
      <Link prefetch={false} href="/feladatok">
        Másik feladatot keresek <ArrowUpRight size={17} />
      </Link>
      <Link prefetch={false} href="/mintaugy">
        Végigjárom a mintaugyet <ArrowUpRight size={17} />
      </Link>
      <Link prefetch={false} href="/indulas">
        Megtervezem az első próbát <ArrowUpRight size={17} />
      </Link>
    </div>
  );
}
export function MethodsPage() {
  return (
    <main id="main" className="page-shell">
      <PageHeading
        section="02 / MÓDSZEREK"
        title="Hogyan állítsa munkába az AI-t?"
        description="Négy megközelítés, eltérő feladatokra. Válasszon a kívánt kimenet és a szükséges támogatás alapján; egyik út sem kötelező előfeltétele a másiknak."
      />
      <MethodExplorer />
      <div className="method-comparison">
        {methods.map((m) => (
          <Link prefetch={false} key={m.id} href={`/modszerek/${m.id}`}>
            <span className="overline">{m.tag}</span>
            <h2>{m.name}</h2>
            <p>{m.description}</p>
            <dl>
              <dt>Eredmény</dt>
              <dd>{m.output}</dd>
              <dt>Szükséges támogatás</dt>
              <dd>{m.support}</dd>
            </dl>
            <span className="text-link">
              Részletes módszer és minta <ArrowUpRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
export function AgentDemo() {
  const [step, setStep] = useState(0);
  const s = agentSteps[step];
  return (
    <div className="agent-demo">
      <DemoLabel />
      <div className="agent-step-nav" aria-label="Agent munkalépései">
        {agentSteps.map((x, i) => (
          <button
            key={x.name}
            aria-pressed={step === i}
            onClick={() => setStep(i)}
          >
            <span>0{i + 1}</span>
            {x.name}
          </button>
        ))}
      </div>
      <div className="agent-detail">
        <h3>
          {String(step + 1).padStart(2, '0')} / {s.name}
        </h3>
        <dl>
          <dt>Bemenet</dt>
          <dd>{s.input}</dd>
          <dt>Kimenet</dt>
          <dd>{s.output}</dd>
          <dt>Emberi ellenőrzési pont</dt>
          <dd>{s.check}</dd>
        </dl>
      </div>
      <div className="step-controls">
        <Button
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
        >
          <ArrowLeft size={15} /> Előző lépés
        </Button>
        <span>{step + 1} / 5</span>
        <Button disabled={step === 4} onClick={() => setStep(step + 1)}>
          Következő lépés <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  );
}
export function MethodDetail({ id }: { id: string }) {
  const m = methods.find((x) => x.id === id)!;
  return (
    <main id="main" className="page-shell">
      <PageHeading
        section={`MÓDSZER / ${m.name}`}
        title={m.title}
        description={m.description}
      />
      {id === 'promptolas' ? (
        <>
          <div className="prompt-transformation">
            <div>
              <span className="overline">TÚL TÁG KÉRÉS</span>
              <p>„Foglald össze a leveleket!”</p>
              <small>
                Nem mondja meg a kimeneti formát, a forráskezelést és a hiányok
                jelölését.
              </small>
            </div>
            <ArrowRight />
            <div>
              <span className="overline">ELLENŐRIZHETŐ KÉRÉS</span>
              <p>„Készíts forrásos eseménytáblát.”</p>
              <small>
                Esemény dátuma · irat kelte · szereplő · állítás · idézet ·
                bizonytalanság · kérdés
              </small>
            </div>
          </div>
          <div className="detail-lead">
            <div>
              <h2>
                Egy jó prompt
                <br />
                <em>láthatóvá teszi a hiányt is.</em>
              </h2>
              <p>
                Az E01 „tegnap” utalása március 2-i eseményt jelöl, miközben a
                levél március 3-án kelt. Az E03 a kizárólagos hozzáférés
                feltevését gyengíti. Mindkét részletet meg kell őrizni.
              </p>
              <ol className="number-list">
                {[
                  'Mondja meg a pontos feladatot és a forráskört.',
                  'Rögzítse a kimenet oszlopait.',
                  'Kérje a hiány és a bizonytalanság jelölését.',
                  'Tiltsa a találgatást; kérjen alternatív magyarázatot.',
                ].map((x, i) => (
                  <li key={x}>
                    <span>0{i + 1}</span>
                    {x}
                  </li>
                ))}
              </ol>
            </div>
            <Workbench />
          </div>
          <CopyBlock
            text={prompts.email}
            download="/letoltesek/level-prompt.txt"
          />
        </>
      ) : id === 'sajat-alkalmazas' ? (
        <>
          <div className="detail-lead">
            <div>
              <Eyebrow>SZAKMAI IGÉNY → FEJLESZTÉSI KÉRÉS</Eyebrow>
              <h2>
                „Mindig ugyanazokat
                <br />
                <em>az adatokat másolom.”</em>
              </h2>
              <p>
                Egy saját összehasonlító nézet megmutathatja a két szerződés
                díját, határidejét és feladatát. Az AI a program elkészítésében
                segít; a különbségeket pontos, hagyományos számítás is adhatja.
              </p>
              <Note>
                Ez a webes minta képernyőterv, nem itt generált alkalmazás.
                Valós ügyadat kezelésére nem értékelt.
              </Note>
            </div>
            <Workbench initial="contract" />
          </div>
          <CopyBlock
            text={prompts.contract}
            title="MÁSOLHATÓ FEJLESZTÉSI KÉRÉS"
            download="/letoltesek/fejlesztesi-keres.txt"
          />
          <section className="content-section">
            <h2>AI-val fejlesztett ≠ AI-val működő.</h2>
            <p>
              A két összehasonlítható nettó összeg különbsége 24 000 000 Ft,
              növekedése 20%. Ehhez nem kell nyelvi modell. Összetett
              szerződéseknél AI-adatkinyerés is hozzáadható, külön
              ellenőrzéssel. Az éles rendszerhez fejlesztői ellenőrzés,
              tesztelés és intézményi feltételek kellenek.
            </p>
            <div className="idea-chips">
              {[
                'Iratjegyzék rendezése',
                'Hiányzó mellékletek listája',
                'Dátumok egységesítése',
                'Vallomás-összevető',
                'Ellenőrzött idővonal',
              ].map((x) => (
                <Link prefetch={false} key={x} href="/indulas?ut=otlet">
                  {x}
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : id === 'agentek' ? (
        <>
          <AgentDemo />
          <div className="detail-columns">
            <section>
              <h2>Automatizmus vagy agent?</h2>
              <p>
                Az automatizmus előre rögzített lépéseket követ. Az agent a
                célhoz engedélyezett keresési és összevetési eszközökből
                választhat. Egyszerű ismétlődő munkához az előbbi is elég lehet.
              </p>
              <p>
                A forrásiratban szereplő „küldd tovább” vagy „hagyd figyelmen
                kívül” szöveg adat marad, nem végrehajtandó utasítás.
              </p>
            </section>
            <section>
              <h2>A felügyelet több egy gombnál.</h2>
              <p>
                A forrásnak és az eltéréseknek közvetlenül megnyithatónak kell
                lennie. Kötelező az ügyenkénti hozzáférés, a műveleti napló, a
                feldolgozási hibák jelzése és a futási korlát.
              </p>
              <Note>
                A bemutatott agent nem hoz eljárási döntést, nem küld
                megkeresést, és nem módosítja az eredeti iratot.
              </Note>
            </section>
          </div>
        </>
      ) : (
        <>
          <div className="platform-map">
            <div>
              <span className="overline">BEMENET</span>
              <h2>
                Nagy iratállomány.
                <br />
                Több munkatárs.
              </h2>
              <p>
                E-mailek, dokumentumok és kommunikációs adatok, elkülönített
                hozzáférésekkel.
              </p>
            </div>
            <div>
              <span className="overline">KÖZÖS MUNKAKÖRNYEZET</span>
              {[
                'Iratkezelés és keresés',
                'Ügyenkénti jogosultságok',
                'Forráshivatkozás és visszakeresés',
                'Naplózás és export',
                'AI-javaslat és emberi felülvizsgálat',
              ].map((x) => (
                <p className="platform-layer" key={x}>
                  <Check size={15} />
                  {x}
                </p>
              ))}
            </div>
          </div>
          <SampleView task={tasks[7]} />
          <section className="content-section">
            <h2>Hogyan próbálható összehasonlíthatóan?</h2>
            <p>
              Ugyanazt a fiktív iratcsomagot és kérdéslistát adja minden
              rendszernek. Legyen benne rossz szkennelt oldal, ékezetes név,
              dátumutalás, hiányzó melléklet és mentő adat. A javítással és
              emberi ellenőrzéssel együtt mérjen.
            </p>
            <CopyBlock text={taskPrompt(tasks[7])} />
          </section>
        </>
      )}
      <section className="content-section">
        <Eyebrow>KAPCSOLÓDÓ ESZKÖZÖK</Eyebrow>
        <div className="related-tools">
          {toolsData
            .filter((t) => t.method === id)
            .map((t) => (
              <Link prefetch={false} key={t.id} href={`/eszkozok#${t.id}`}>
                <strong>{t.name}</strong>
                <span>{t.type}</span>
                <ArrowUpRight size={17} />
              </Link>
            ))}
        </div>
      </section>
      <NextLinks />
    </main>
  );
}
export function ToolCatalog() {
  const [q, update] = useQuery({
    feladat: 'all',
    tipus: 'all',
    keszultseg: 'all',
  });
  const filtered = toolsData.filter(
    (t) =>
      (q.feladat === 'all' || t.tasks.includes(q.feladat)) &&
      (q.tipus === 'all' || t.type === q.tipus) &&
      (q.keszultseg === 'all' || t.ready === q.keszultseg),
  );
  return (
    <main id="main" className="page-shell">
      <PageHeading
        section="03 / ESZKÖZÖK ÉS RENDSZEREK"
        title="A feladathoz válasszon eszközt."
        description="Hét megoldás, eltérő szerepben. A módszer és a termék külön fogalom: egy platform több megközelítést is megvalósíthat. A leírások tájékozódási pontok, nem vásárlási ajánlások."
      />
      <div className="filter-bar tool-filters">
        <SlidersHorizontal size={21} />
        <label>
          Feladat
          <NativeSelect
            value={q.feladat}
            onChange={(e) => update({ feladat: e.target.value })}
          >
            <NativeSelectOption value="all">Minden feladat</NativeSelectOption>
            {tasks.map((t) => (
              <NativeSelectOption key={t.id} value={t.id}>
                {t.short}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
        <label>
          Eszköztípus
          <NativeSelect
            value={q.tipus}
            onChange={(e) => update({ tipus: e.target.value })}
          >
            <NativeSelectOption value="all">Minden típus</NativeSelectOption>
            {toolTypes.map((t) => (
              <NativeSelectOption key={t} value={t}>
                {t}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
        <label>
          A bemutatott megoldás
          <NativeSelect
            value={q.keszultseg}
            onChange={(e) => update({ keszultseg: e.target.value })}
          >
            <NativeSelectOption value="all">
              Bármely készültség
            </NativeSelectOption>
            {readiness.map((t) => (
              <NativeSelectOption key={t} value={t}>
                {t}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
        <output>{filtered.length} / 7 eszköz</output>
      </div>
      <Note>
        A készültség a bemutatott feladatra szabott megoldást jelzi, nem a
        termék érettségét. Az intézményi bevezetés feltételeit minden esetben
        külön kell teljesíteni.
      </Note>
      <div className="tool-catalog">
        {filtered.map((t) => (
          <article key={t.id} id={t.id} className="tool-entry">
            <div className="tool-entry-name">
              <span className={`tool-monogram ${t.id}`}>{t.monogram}</span>
              <div>
                <h2>{t.name}</h2>
                <span>{t.type}</span>
              </div>
              <span className="ready-label">{t.ready}</span>
            </div>
            <p>{t.description}</p>
            <div className="tool-sample">
              <span className="overline">PÉLDAKIMENET</span>
              {t.example}
            </div>
            <details className="disclosure">
              <summary>Mi kell a kipróbáláshoz? Mi nem igazolt?</summary>
              <h3>Kipróbálás</h3>
              <p>{t.needs}</p>
              <h3>Korlát és magyar alkalmasság</h3>
              <p>{t.limit}</p>
            </details>
            <div className="tool-entry-footer">
              <Link prefetch={false} href={`/modszerek/${t.method}`}>
                Kapcsolódó módszer <ArrowRight size={15} />
              </Link>
              <Link
                prefetch={false}
                href={t.source}
                target="_blank"
                rel="noreferrer"
              >
                Gyártói forrás · {t.ref} <ExternalLink size={13} />
              </Link>
            </div>
            <p className="date-note">
              Alapanyag szerinti ellenőrzés: 2026. 08. 30.
            </p>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <Empty
          reset={() =>
            update({ feladat: 'all', tipus: 'all', keszultseg: 'all' })
          }
        />
      )}
      <Link
        prefetch={false}
        href="/eszkozok/intezmenyi-peldak"
        className="wide-next"
      >
        <span>És mit próbáltak ki valódi intézmények?</span>
        <strong>
          SFO és STF VitórIA <ArrowUpRight />
        </strong>
      </Link>
      <Note>
        Gyakori kombináció a kész iratkezelési alap, a saját feladatsablon és az
        ellenőrzött AI-feldolgozás. A „saját vagy kész” nem mindig kizáró
        választás.
      </Note>
    </main>
  );
}
export function Institutions() {
  return (
    <main id="main" className="page-shell">
      <PageHeading
        section="DOKUMENTÁLT INTÉZMÉNYI PÉLDÁK"
        title="Mit tanulhatunk a valódi próbákból?"
        description="Két eltérő feladat, két intézményi tapasztalat. A dokumentált állapotot és az abból levonható következtetés határait együtt mutatjuk."
      />
      <section className="institution-detail" id="sfo">
        <div className="institution-meta">
          <span>01 / ÜGYÉSZSÉGI PÉLDA</span>
          <h2>
            Serious
            <br />
            Fraud Office
          </h2>
          <p>
            Egyesült Királyság
            <br />
            2025. április 3.
          </p>
          <strong className="large-figure">akár 40%</strong>
        </div>
        <div>
          <Eyebrow>TECHNOLOGY ASSISTED REVIEW · PILOT</Eyebrow>
          <h2>Gyorsabb disclosure célú iratátvizsgálás.</h2>
          <p>
            Az SFO a hagyományos módszeréhez képest akár 40%-kal gyorsabb
            dokumentumvizsgálatról számolt be egy pilotban, és a kiterjesztés
            tervét ismertette.
          </p>
          <h3>Mit érdemes átvenni?</h3>
          <p>
            Egy körülhatárolt iratátvizsgálási feladatot hasonlítsunk össze a
            korábbi munkamóddal. Az eredmény és a hibajavítás együttesen számít.
          </p>
          <h3>Mit nem következtethetünk belőle?</h3>
          <p>
            A közlés nem a teljes eljárás 40%-os rövidülése, nem magyar eredmény
            és nem minden ügyre szóló megtakarítás. A nyilvános módszertan nem
            elég saját hatásbecsléshez. A TAR megnevezés önmagában nem generatív
            chatbotot vagy agentet jelent.
          </p>
          <Link
            prefetch={false}
            className="text-link"
            href="https://www.gov.uk/government/news/serious-fraud-office-sets-out-next-steps-in-ambitious-plan"
            target="_blank"
            rel="noreferrer"
          >
            Eredeti SFO-közlemény <ExternalLink size={15} />
          </Link>
          <details className="disclosure">
            <summary>
              OpenText Axcelerate: a feldolgozás minőségének tanulsága
            </summary>
            <p>
              Az SFO 2025. február 3-án az akkori rendszerként az OpenText
              Axcelerate-et nevezte meg, és egy kijavított szövegkódolási
              hibáról számolt be. Nem állítjuk, hogy a hiba ma is fennáll, vagy
              hogy ez volt a későbbi TAR-pilot konkrét megoldása.
            </p>
            <Link
              prefetch={false}
              className="text-link"
              href="https://www.gov.uk/government/news/initial-findings-of-our-e-discovery-review"
              target="_blank"
              rel="noreferrer"
            >
              A felülvizsgálat közleménye <ExternalLink size={15} />
            </Link>
          </details>
        </div>
      </section>
      <section className="institution-detail" id="stf">
        <div className="institution-meta">
          <span>02 / BÍRÓSÁGI PÉLDA</span>
          <h2>
            STF
            <br />
            VitórIA
          </h2>
          <p>
            Brazília
            <br />
            2023. május 17.
          </p>
        </div>
        <div>
          <Eyebrow>ÜGYCSOPORTOSÍTÁS · INTEGRÁCIÓS DÖNTÉS</Eyebrow>
          <h2>Hasonló témájú ügyek csoportosítása.</h2>
          <p>
            A 800/2023. határozat engedélyezte a VitórIA integrálását az STF
            Digital platformba, és felelősséget rendelt a fenntartáshoz és
            frissítéshez.
          </p>
          <h3>Mit érdemes továbbgondolni?</h3>
          <p>
            Nagy állományban az ismétlődő témák és iratcsoportok felismerése
            önállóan hasznos feladat lehet. A magyar adaptáció itt szerkesztői
            ötlet, amely külön vizsgálatot igényel.
          </p>
          <h3>Mit nem állít a példa?</h3>
          <p>
            Nem korrupciós bűnösséget megállapító rendszer és nem megvásárolható
            magyar ügyészségi csomag. A forrásokból nem vezethető le 2026-os
            használati volumen vagy időmegtakarítás.
          </p>
          <div className="inline-links">
            <Link
              prefetch={false}
              className="text-link"
              href="https://stj.jus.br/internet_docs/biblioteca/clippinglegislacao/Res_800_2023_STF.pdf"
              target="_blank"
              rel="noreferrer"
            >
              800/2023. határozat <ExternalLink size={15} />
            </Link>
            <Link
              prefetch={false}
              className="text-link"
              href="https://www.youtube.com/watch?v=xuw1U1OredQ"
              target="_blank"
              rel="noreferrer"
            >
              Hivatalos videóbemutató <ExternalLink size={15} />
            </Link>
          </div>
        </div>
      </section>
      <NextLinks />
    </main>
  );
}

const caseStages = [
  {
    name: 'Levelezés',
    task: 'emailek',
    sourceIds: ['E01', 'E02', 'E03'],
    summary: 'Ki tudott a módosításról?',
    result:
      'Március 2. — az E01 előző napi egyeztetésre utal.\nMárcius 3. — módosítást kérnek (E01).\nMárcius 5. — C megkapja a tervezetet (E02).\nMárcius 7. — az E03 szerint valamennyi meghívott hozzáfér.\n\nGyengítő adat: a szélesebb kiküldés a kizárólagosság feltevését gyengíti.\nHiány: melléklet, meghívotti lista, kézbesítési adatok.',
  },
  {
    name: 'Szerződésmódosítás',
    task: 'szerzodesek',
    sourceIds: ['S01', 'S02'],
    summary: 'Több pénzért mi változott?',
    result:
      'Nettó díj: 120 000 000 → 144 000 000 Ft.\nKülönbség: +24 000 000 Ft, +20%.\nHatáridő: június 30. → augusztus 31.\nFeladat: három hónap támogatással bővül.\n\nA díj és a szolgáltatás is változott. Ez önmagában nem bizonyít kárt. A módosítás indoka és a piaci ellenérték hiányzik.',
  },
  {
    name: 'Vallomások',
    task: 'vallomasok',
    sourceIds: ['T01', 'T02', 'T03'],
    summary: 'Ellentmondás vagy két külön találkozó?',
    result:
      'T01: keddi műszaki egyeztetés.\nT02: szerdai üzemeltetési egyeztetés.\nT03: két külön találkozó szerepel a feljegyzésben.\n\nAlternatív magyarázat: eltérő eseményekről beszélnek. A két beszámoló eltérése nem alapoz meg hazugságmegállapítást.',
  },
  {
    name: 'Teljesítés és kifizetés',
    task: 'penzmozgasok',
    sourceIds: [],
    summary: 'Mi támasztja alá a kifizetést?',
    result: tasks[5].result,
  },
  {
    name: 'Bizonyítási kérdések',
    task: 'ugyirat',
    sourceIds: [],
    summary: 'Mit tudunk, és mit kell még tisztázni?',
    result: tasks[7].result,
  },
];
export function CasePage() {
  const [q, update] = useQuery({ lepes: '1', ful: 'forrasok' });
  const step = Math.max(0, Math.min(4, (parseInt(q.lepes) || 1) - 1));
  const stage = caseStages[step];
  const task = tasks.find((t) => t.id === stage.task)!;
  const validTabs = ['forrasok', 'munkalap', 'ellenorzes', 'modszer'];
  const tab = validTabs.includes(q.ful) ? q.ful : 'forrasok';
  const [source, setSource] = useState<string | null>(null);
  return (
    <main id="main" className="page-shell">
      <PageHeading
        section="04 / INTERAKTÍV MINTAÜGY"
        title="Öt iratcsomag. Egy beszerzés."
        description="Egy fiktív közbeszerzés története a tervezett konzultációtól a kifizetésig. Válasszon állomást, olvassa el az iratokat, majd vesse össze a munkalappal. Minden szereplő, irat és összeg kitalált."
      />
      <div className="case-toolbar">
        <DemoLabel />
        <ShareButton />
      </div>
      <div className="case-workspace">
        <nav className="case-stage-nav" aria-label="A mintaugy állomásai">
          {caseStages.map((s, i) => (
            <button
              key={s.name}
              aria-current={step === i ? 'step' : undefined}
              onClick={() => {
                setSource(null);
                update({ lepes: String(i + 1) });
              }}
            >
              <span>0{i + 1}</span>
              <div>
                {s.name}
                <small>{s.summary}</small>
              </div>
              <ArrowRight size={16} />
            </button>
          ))}
        </nav>
        <div className="case-stage-content">
          <span className="overline">ÁLLOMÁS {step + 1} / 5</span>
          <h2>{stage.summary}</h2>
          <Tabs value={tab} onValueChange={(v) => update({ ful: String(v) })}>
            <TabsList
              className="detail-tabs case-tabs"
              aria-label="Mintaugy nézete"
            >
              <TabsTrigger value="forrasok">Források</TabsTrigger>
              <TabsTrigger value="munkalap">AI-munkalap</TabsTrigger>
              <TabsTrigger value="ellenorzes">Emberi ellenőrzés</TabsTrigger>
              <TabsTrigger value="modszer">Így készülhet el</TabsTrigger>
            </TabsList>
            <TabsContent value="forrasok">
              {stage.sourceIds.length ? (
                <div className="case-source-list">
                  {stage.sourceIds.map((id) => (
                    <article key={id}>
                      <div>
                        <h3>{sources[id].title}</h3>
                        <SourceButton id={id} onSelect={setSource} />
                      </div>
                      <p className="source-quote">{sources[id].text}</p>
                      <p className="source-note">{sources[id].note}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <pre className="result-pre">{task.sample}</pre>
              )}
            </TabsContent>
            <TabsContent value="munkalap">
              <div className="result-title">
                <Check size={18} />
                <strong>Előre elkészített, ellenőrizendő munkalap</strong>
              </div>
              <pre className="result-pre">{stage.result}</pre>
              <Note>
                A forrástartalom és a bizonyított tény külön fogalom. Nincs
                automatikus bűnösségi értékelés.
              </Note>
            </TabsContent>
            <TabsContent value="ellenorzes">
              <h3>A következő kérdéseket vinnénk tovább</h3>
              <ul className="checklist">
                {task.questions.map((t) => (
                  <li key={t}>
                    <Check size={17} />
                    {t}
                  </li>
                ))}
              </ul>
              <p>{task.measure}</p>
              {step === 4 && (
                <Note>
                  A történet nem automatikus vádemeléssel végződik. A következő
                  lépés a hiányok tisztázása és az alternatív magyarázatok
                  ellenőrzése.
                </Note>
              )}
            </TabsContent>
            <TabsContent value="modszer">
              <p>{methods.find((m) => m.id === task.method)?.description}</p>
              <CopyBlock text={getPrompt(task)} />
              <Link
                prefetch={false}
                href={`/modszerek/${task.method}`}
                className="text-link"
              >
                A módszer részletesen <ArrowUpRight size={16} />
              </Link>
            </TabsContent>
          </Tabs>
          {source && (
            <SourcePanel id={source} onClose={() => setSource(null)} />
          )}
          <details className="disclosure legal-panel">
            <summary>Miért fontos jogilag?</summary>
            <h3>{task.context}</h3>
            <p>{task.legal}</p>
            <Link
              prefetch={false}
              href="/hatter/tenyallasok"
              className="text-link"
            >
              Szakmai háttér <ArrowUpRight size={16} />
            </Link>
          </details>
          <div className="step-controls">
            <Button
              variant="outline"
              disabled={step === 0}
              onClick={() => {
                setSource(null);
                update({ lepes: String(step) });
              }}
            >
              <ArrowLeft size={15} /> Előző
            </Button>
            <span>{step + 1} / 5</span>
            {step < 4 ? (
              <Button
                onClick={() => {
                  setSource(null);
                  update({ lepes: String(step + 2) });
                }}
              >
                Következő állomás <ArrowRight size={15} />
              </Button>
            ) : (
              <Link
                prefetch={false}
                className="button primary small"
                href="/indulas"
              >
                Saját próba tervezése <ArrowUpRight size={15} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
const ideaFields = [
  ['bemenet', 'Miből dolgozna?', 'Például: két fiktív szerződés szövege'],
  [
    'kimenet',
    'Milyen munkadarabot szeretne?',
    'Például: mezőnkénti eltéréslista',
  ],
  [
    'ellenorzes',
    'Hogyan ellenőrizné?',
    'Például: eredeti bekezdések egymás mellett',
  ],
  [
    'hibak',
    'Mely hibákat kell észrevenni?',
    'Például: hiányzó melléklet, eltérő pénznem',
  ],
  ['felhasznalo', 'Ki használná?', 'Például: az elemzést végző szakember'],
];
export function IdeaForm() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState('');
  return (
    <section className="idea-form">
      <h2>Az Ön mini-eszközének ötletlapja.</h2>
      <p>
        Csak a munkafolyamat általános leírását adja meg, személyes és ügyadat
        nélkül. A szöveg ebben a böngészőnézetben marad; nem mentjük és nem
        továbbítjuk.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setGenerated(
            'Készíts fiktív adatokkal használható oktatási prototípust. Ne küldj adatot külső szolgáltatásnak, ne hívj AI-modellt, ne módosítsd a forrásokat.\n\n' +
              ideaFields
                .map(
                  ([key, label]) =>
                    `${label}\n${values[key] || 'Még meghatározandó.'}`,
                )
                .join('\n\n') +
              '\n\nJelöld a hiányzó adatokat. A felület legyen magyar, billentyűzettel használható. Adj működési magyarázatot és ellenőrzési listát. Fiktív oktatási prototípus; valós ügyadat kezelésére nem értékelt.',
          );
        }}
      >
        {ideaFields.map(([key, label, placeholder]) => (
          <label key={key} htmlFor={`idea-${key}`}>
            {label}
            <Textarea
              id={`idea-${key}`}
              value={values[key] || ''}
              required
              maxLength={1000}
              placeholder={placeholder}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
            />
          </label>
        ))}
        <Button type="submit" className="button primary">
          Ötletlap összeállítása <ArrowRight size={16} />
        </Button>
      </form>
      {generated && (
        <>
          <Note>
            Az ötletlap elkészült a megadott szövegekből, AI-hívás nélkül.
          </Note>
          <CopyBlock text={generated} title="AZ ÖN FEJLESZTÉSI ÖTLETLAPJA" />
        </>
      )}
    </section>
  );
}
export function PilotPlan() {
  return (
    <div className="pilot-plan">
      <h2>Egy feladat. Egy összehasonlítható próba.</h2>
      <p>
        A 90 napos próba az adat-, jogi és biztonsági előfeltételek biztosítása
        után indulhat. Ezek megteremtése nem ígért része a 90 napnak.
      </p>
      <div className="pilot-grid">
        {[
          [
            'Előfeltételek',
            'Szakmai felelős, engedélyezett környezet, hozzáférési rend, jogi és információbiztonsági értékelés.',
          ],
          [
            '1–30. nap / Alapmérés',
            'Azonos feladat kézi feldolgozása, referenciaeredmény, hibakategóriák és munkanapló.',
          ],
          [
            '31–60. nap / Összehasonlítás',
            'Ugyanaz az anyag AI-támogatással; hibajavítás és szakmai ellenőrzés időmérése.',
          ],
          [
            '61–90. nap / Döntési pont',
            'Minőség, emberi munkaidő, kihagyott fontos adat és teljes költség alapján folytatás, javítás vagy leállítás.',
          ],
        ].map(([title, body]) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <h3>Mit vezessenek a munkanaplóban?</h3>
      <ul className="checklist">
        {[
          'Aktív emberi munka, technikai feldolgozás és külső várakozás külön',
          'Hibák, javításigény, kihagyott releváns és mentő adatok',
          'Visszakereshető források és az eredmény elfogadhatósága',
          'A munkacsomag ideje mellett az ügy teljes átfutása',
        ].map((x) => (
          <li key={x}>
            <Check size={16} />
            {x}
          </li>
        ))}
      </ul>
      <Link
        prefetch={false}
        href="/tanulmany/bevezetes-meres-es-dontesi-terv"
        className="text-link"
      >
        A teljes 90 napos terv és munkalapok <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
export function StartPage() {
  const [q, update] = useQuery({ ut: 'prompt' });
  const path = ['prompt', 'otlet', 'pilot'].includes(q.ut) ? q.ut : 'prompt';
  return (
    <main id="main" className="page-shell">
      <PageHeading
        section="05 / KIPRÓBÁLNÁM"
        title="Induljon egyetlen feladattal."
        description="Nincs regisztráció, ügyiratfeltöltés vagy háttérben futó AI. A kipróbálás itt a minták tanulmányozását és a saját munkafolyamat megtervezését jelenti."
      />
      <Tabs value={path} onValueChange={(v) => update({ ut: String(v) })}>
        <TabsList className="start-tabs" aria-label="Kipróbálási útvonal">
          <TabsTrigger value="prompt">01 · Egy jó prompt</TabsTrigger>
          <TabsTrigger value="otlet">02 · Saját mini-eszköz</TabsTrigger>
          <TabsTrigger value="pilot">03 · Intézményi próba</TabsTrigger>
        </TabsList>
        <TabsContent value="prompt">
          <div className="detail-lead">
            <div>
              <h2>
                Három levéllel
                <br />
                <em>már el lehet kezdeni.</em>
              </h2>
              <p>
                A mintacsomag teljesen fiktív. Olvassa el a leveleket, nézze meg
                az elvárt munkalapot, majd másolja ki a pontos kérést. Ha külön
                asszisztensben futtatja, ellenőrizze az eltéréseket.
              </p>
              <Link
                prefetch={false}
                className="text-link"
                href="/modszerek/promptolas"
              >
                Mitől jó ez a prompt? <ArrowUpRight size={16} />
              </Link>
            </div>
            <Workbench />
          </div>
          <CopyBlock
            text={prompts.email}
            download="/letoltesek/level-prompt.txt"
          />
        </TabsContent>
        <TabsContent value="otlet">
          <IdeaForm />
        </TabsContent>
        <TabsContent value="pilot">
          <PilotPlan />
        </TabsContent>
      </Tabs>
    </main>
  );
}
export function BackgroundPage({ kind }: { kind?: string }) {
  if (kind === 'folyamat-es-ido')
    return (
      <main id="main" className="page-shell">
        <PageHeading
          section="SZAKMAI HÁTTÉR / FOLYAMAT ÉS IDŐ"
          title="Melyik időt tudjuk rövidíteni?"
          description="Oktatási egyszerűsítés: az ügyindítástól az ügyészi döntésig. A felderítés és a vizsgálat ügyészi szerepe eltér; a részletes intézményi és eljárási keretet a tanulmány tárgyalja."
        />
        <ProcessStrip />
        <section className="content-section">
          <h2>Négy időtípus, eltérő mozgástér.</h2>
          <div className="time-grid">
            {[
              [
                'Aktív emberi munka',
                'Olvasás, keresés, összevetés, ellenőrzés.',
                'Az AI közvetlenül támogathatja, de a javítást is mérni kell.',
              ],
              [
                'Technikai feldolgozás',
                'OCR, indexelés, átalakítás, modellfutás.',
                'Automatizálható; minőség- és kapacitásfüggő.',
              ],
              [
                'Külső válaszra várás',
                'Szakértő, bank, nemzetközi megkeresés.',
                'A jobb előkészítés segíthet, de az AI önmagában nem szünteti meg.',
              ],
              [
                'Eljárási határidő',
                'Jogszabályhoz és konkrét ügyhöz kötött idő.',
                'Nem AI-beállítás; a releváns jogállapot alapján ellenőrizendő.',
              ],
            ].map(([a, b, c]) => (
              <article key={a}>
                <h3>{a}</h3>
                <p>{b}</p>
                <strong>{c}</strong>
              </article>
            ))}
          </div>
          <Note>
            Ellenőrzött magyar intézményi mérés nélkül nem állítunk átlagos
            napértékeket, és nem rajzolunk azokból arányos idődiagramot.
          </Note>
          <h3>Felderítés és vizsgálat</h3>
          <p>
            A felderítésben az ügyészi törvényességi felügyelet, a vizsgálatban
            az ügyészi irányítás szerepe külön kezelendő. A hatáskör és az
            ügyállapot tisztázása megelőzi az eszközhasználatot. Az AI nem
            változtatja meg az eljárási jogosultságokat.
          </p>
          <Link
            prefetch={false}
            href="/tanulmany/jogi-keret-es-munkafolyamat"
            className="text-link"
          >
            A teljes folyamat- és jogi fejezet <ArrowUpRight size={16} />
          </Link>
        </section>
      </main>
    );
  if (kind === 'tenyallasok')
    return (
      <main id="main" className="page-shell">
        <PageHeading
          section="SZAKMAI HÁTTÉR / BIZONYÍTÁS"
          title="Egy mintázat még nem jogi minősítés."
          description="Minden jelzés mögött külön vizsgálandó tények, források és alternatív magyarázatok állnak. A közbeszerzési, versenyjogi és büntetőjogi vizsgálat nem felcserélhető."
        />
        <div className="legal-matrix">
          {[
            [
              'Árváltozás és teljesítés',
              'Több pénzért több szolgáltatás?',
              'Kötelezettség, vagyoni hátrány, szerep és szándék.',
              'szerzodesek',
            ],
            [
              'Döntés előtti kommunikáció',
              'Ki, mikor és miről egyeztetett?',
              'Előny, magatartás, szerep és összefüggés.',
              'emailek',
            ],
            [
              'Ajánlatok hasonlósága',
              'Függetlenül készültek?',
              'Konkrét egyeztetés; közös sablon vagy nyilvános adat mint alternatíva.',
              'belso-iratok',
            ],
            [
              'Eltérő beszámolók',
              'Ugyanarról az eseményről beszélnek?',
              'Külső ellenőrző adat és tisztázó kérdések; nem automatikus hazugság.',
              'vallomasok',
            ],
          ].map(([a, b, c, id]) => (
            <article key={id}>
              <span className="overline">{a}</span>
              <h2>{b}</h2>
              <p>{c}</p>
              <Link
                prefetch={false}
                href={`/feladatok/${id}`}
                className="text-link"
              >
                Kapcsolódó AI-feladat <ArrowUpRight size={16} />
              </Link>
            </article>
          ))}
        </div>
        <Note>
          Konkrét ügyben az elkövetéskori jogállapot és a tényállási elemek
          külön ellenőrizendők. Ez oktatási térkép, nem jogi szakvélemény.
        </Note>
        <div className="inline-links">
          <Link
            prefetch={false}
            className="text-link"
            href="https://njt.jog.gov.hu/jogszabaly/2012-100-00-00"
            target="_blank"
            rel="noreferrer"
          >
            Btk. — NJT <ExternalLink size={14} />
          </Link>
          <Link
            prefetch={false}
            className="text-link"
            href="https://njt.jog.gov.hu/jogszabaly/1996-57-00-00"
            target="_blank"
            rel="noreferrer"
          >
            Tpvt. — NJT <ExternalLink size={14} />
          </Link>
          <Link
            prefetch={false}
            className="text-link"
            href="/tanulmany/tenyallasok-es-bizonyitasi-terv"
          >
            Teljes bizonyítási fejezet <ArrowUpRight size={16} />
          </Link>
        </div>
      </main>
    );
  if (kind === 'biztonsagos-hasznalat')
    return (
      <main id="main" className="page-shell">
        <PageHeading
          section="SZAKMAI HÁTTÉR / BIZTONSÁGOS HASZNÁLAT"
          title="A forrás maradjon ellenőrizhető."
          description="A bemutató fiktív adatokkal tanít. Valós bűnügyi adat feldolgozása intézményi, jogi és információbiztonsági értékelést igényel; egy általános megfelelőségi ígéret nem elég."
        />
        <div className="safety-list">
          {[
            [
              'Adatkezelés',
              'Vizsgálja a célt, a jogalapot, az adatútvonalat, a megőrzést és a modell szolgáltatóját. A bűnüldözési adatvédelmi és eljárási szabályok külön értékelendők.',
            ],
            [
              'Forráshűség',
              'Az eredeti irat és a gépi munkapéldány különüljön el. Minden érdemi állítás vezessen vissza a pontos eredeti részlethez.',
            ],
            [
              'Jogosultság',
              'Az ügyenkénti hozzáférés az indexre, a modellhívásra, a naplóra és az exportra is vonatkozzon.',
            ],
            [
              'Naplózás és hibák',
              'Látszódjon a feldolgozott, kihagyott és hibás irat, a használt változat és a javítás története.',
            ],
            [
              'Szakmai ellenőrzés',
              'Terhelő és mentő adat azonos figyelmet kapjon. Az AI ne döntsön bűnösségről, vádról vagy jogkorlátozásról.',
            ],
            [
              'Utasítás az iratban',
              'A forrásban található szöveg nem rendszerutasítás. Az agent eszközei és adatútjai korlátozottak, az eredeti iratok változatlanok.',
            ],
          ].map(([a, b], i) => (
            <article key={a}>
              <span>0{i + 1}</span>
              <div>
                <h2>{a}</h2>
                <p>{b}</p>
              </div>
            </article>
          ))}
        </div>
        <Note>
          Ezen az oldalon nincs ügyiratfeltöltés, külső AI-hívás, regisztráció,
          analitika vagy automatikus videóbeágyazás. A betűkészletet is helyben
          szolgáljuk ki. A külső források csak kattintásra nyílnak meg.
        </Note>
        <Link
          prefetch={false}
          className="text-link"
          href="/tanulmany/ai-eszkozok-es-biztonsagos-hasznalat"
        >
          Teljes adatkezelési és biztonsági háttér <ArrowUpRight size={16} />
        </Link>
      </main>
    );
  return (
    <main id="main" className="page-shell">
      <PageHeading
        section="SZAKMAI HÁTTÉR"
        title="A munkalap mögötti tudás."
        description="A módszerek és példák mellett a magyar eljárási keret, a bizonyítás és a biztonságos használat összefüggései is elérhetők. Az eredeti kutatási anyagot teljes terjedelmében megőriztük."
      />
      <div className="background-links">
        {[
          [
            'folyamat-es-ido',
            'Folyamat és idő',
            'Mit gyorsíthat az AI, és mitől függ az ügy teljes átfutása?',
          ],
          [
            'tenyallasok',
            'Tényállások és bizonyítás',
            'Mely tényhez milyen irat, AI-feladat és ellenőrzés tartozik?',
          ],
          [
            'biztonsagos-hasznalat',
            'Biztonságos használat',
            'Adatkezelés, jogosultság, naplózás és szakmai felügyelet.',
          ],
        ].map(([id, title, desc]) => (
          <Link prefetch={false} key={id} href={`/hatter/${id}`}>
            <h2>{title}</h2>
            <p>{desc}</p>
            <ArrowUpRight />
          </Link>
        ))}
      </div>
      <section className="study-intro">
        <div>
          <Eyebrow>TELJES TANULMÁNY</Eyebrow>
          <h2>
            Olvassa el
            <br />
            <em>a teljes összefüggést.</em>
          </h2>
          <p>
            Magyar jogi, nyomozati és technológiai döntés-előkészítő munkaanyag.
            Kutatási zárónap: 2026. augusztus 30.
          </p>
        </div>
        <div>
          {studyChapters.map((c, i) => (
            <Link prefetch={false} key={c.id} href={`/tanulmany/${c.id}`}>
              <span>0{i}</span>
              {c.title}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
      </section>
      <Link prefetch={false} className="text-link" href="/forrasok">
        Eredeti és kiegészítő forrásjegyzék <ArrowUpRight size={16} />
      </Link>
    </main>
  );
}

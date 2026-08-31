'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { HomeSections, TaskCards } from '@/components/home-sections';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Mail,
  GitCompareArrows,
  MessagesSquare,
  Menu,
  X,
  Check,
  CornerDownRight,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
export const nav = [
  ['/feladatok', 'Mire használható?'],
  ['/modszerek', 'Hogyan használjam?'],
  ['/eszkozok', 'Eszközök és rendszerek'],
  ['/mintaugy', 'Nézzük egy ügyön!'],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="site-header">
      <Link
        prefetch={false}
        className="brand"
        href="/"
        aria-label="AI az ügyészi munkában — főoldal"
      >
        <span className="brand-mark">
          <span />
          <span />
          <span />
        </span>
        <span>
          AI az ügyészi
          <br />
          <strong>munkában.</strong>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label="Fő navigáció">
        {nav.map(([href, label]) => (
          <Link
            prefetch={false}
            key={href}
            href={href}
            aria-current={pathname.startsWith(href) ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <Link prefetch={false} className="background-link" href="/hatter">
          Szakmai háttér
        </Link>
        <Link prefetch={false} className="button primary small" href="/indulas">
          Kipróbálnám <ArrowUpRight size={16} />
        </Link>
        <Button
          className="mobile-toggle"
          variant="ghost"
          aria-label={open ? 'Menü bezárása' : 'Menü megnyitása'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav
          className="mobile-nav"
          id="mobile-nav"
          aria-label="Mobil navigáció"
        >
          {[
            ...nav,
            ['/hatter', 'Szakmai háttér'],
            ['/indulas', 'Kipróbálnám'],
          ].map(([href, label]) => (
            <Link
              prefetch={false}
              key={href}
              onClick={() => setOpen(false)}
              href={href}
            >
              {label}
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link prefetch={false} className="footer-brand" href="/">
          AI az ügyészi munkában<span>.</span>
        </Link>
        <p>Az iratoktól az összefüggésekig.</p>
      </div>
      <div className="footer-links">
        <Link prefetch={false} href="/tanulmany">
          Teljes tanulmány
        </Link>
        <Link prefetch={false} href="/forrasok">
          Forrásjegyzék
        </Link>
        <Link prefetch={false} href="/hatter/biztonsagos-hasznalat">
          Biztonságos használat
        </Link>
      </div>
      <div className="footer-bottom">
        <span>Szakmai tudásműhely · 2026. augusztus 30.</span>
        <span>
          Oktatási bemutató. Nincs ügyiratfeltöltés vagy élő AI-hívás.
        </span>
      </div>
    </footer>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="tiny-square" />
      {children}
    </p>
  );
}
export function DemoLabel() {
  return (
    <span className="demo-label">
      <span /> Fiktív bemutató · előre elkészített minta
    </span>
  );
}
export const sources: Record<
  string,
  { title: string; text: string; note: string }
> = {
  E01: {
    title: 'E01 · 2026. március 3. · 09:10',
    text: 'Előkészítő A → Ügyintéző B\n„Kérlek, a műszaki tervezet második változatába építsd be a tegnap egyeztetett üzemeltetési szempontokat. A szempontlista külön mellékletben van.”',
    note: 'A melléklet nincs a mintában. A „tegnap” március 2-ra utal; az irat kelte március 3.',
  },
  E02: {
    title: 'E02 · 2026. március 5. · 14:20',
    text: 'Ügyintéző B → Szállító C\n„Küldöm a tervezet második változatát a tervezett piaci konzultációhoz. Kérjük, jelezzék az észrevételeiket.”',
    note: 'A tervezet nincs a mintában. A címzetti szereplés nem bizonyítja az elolvasást.',
  },
  E03: {
    title: 'E03 · 2026. március 7. · 10:00',
    text: 'Ügyintéző B → Belső munkacsoport\n„A második változatot ma valamennyi meghívott résztvevőnek elküldtem. C részére már csütörtökön továbbítottam; észrevétele még nem érkezett.”',
    note: 'A meghívotti lista és a kézbesítési adatok nincsenek a mintában. A szélesebb hozzáférés gyengíti a kizárólagosság feltételezését.',
  },
  S01: {
    title: 'S01 · Eredeti szerződés · fiktív',
    text: 'Nettó díj: 120 000 000 Ft.\nTeljesítési határidő: 2026. június 30.\nFeladat: telepítés és dokumentáció.',
    note: 'Az eredeti szerződés oktatási kivonata.',
  },
  S02: {
    title: 'S02 · Módosított szerződés · fiktív',
    text: 'Nettó díj: 144 000 000 Ft.\nTeljesítési határidő: 2026. augusztus 31.\nFeladat: telepítés, dokumentáció és három hónap támogatás.',
    note: 'A díj és a szolgáltatás tartalma is változott. A 20% növekedés nem azonos kárral vagy túlárazással.',
  },
  T01: {
    title: 'T01 · Első beszámoló · fiktív',
    text: '„Kedden találkoztunk, és átbeszéltük a tervezet műszaki részét.”',
    note: 'A beszámoló nem azonosít egyedi találkozót.',
  },
  T02: {
    title: 'T02 · Második beszámoló · fiktív',
    text: '„Az egyeztetés szerdán volt. Én az üzemeltetés kérdéseiről beszéltem.”',
    note: 'Az eltérő nap önmagában nem bizonyít megtévesztést.',
  },
  T03: {
    title: 'T03 · Találkozói feljegyzés · fiktív',
    text: 'Kedd: műszaki egyeztetés.\nSzerda: üzemeltetési egyeztetés.\nKét külön találkozó szerepel a feljegyzésben.',
    note: 'Alternatív magyarázat: a két beszámoló külön eseményre vonatkozhat.',
  },
};
export function SourceButton({
  id,
  onSelect,
}: {
  id: string;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className="source-link"
      onClick={() => onSelect(id)}
      aria-label={`${id} forrás megnyitása`}
    >
      {id}
      <ArrowUpRight size={11} />
    </button>
  );
}
export function SourcePanel({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const s = sources[id];
  return (
    <aside className="source-panel" aria-label="Eredeti forrás">
      <div className="source-panel-top">
        <span className="eyebrow">Eredeti iratrészlet · fiktív</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Forrás bezárása"
        >
          <X size={17} />
        </Button>
      </div>
      <h4>{s.title}</h4>
      <p className="source-quote">{s.text}</p>
      <p className="source-note">{s.note}</p>
    </aside>
  );
}
export function Workbench({ initial = 'email' }: { initial?: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="workbench">
      <div className="workbench-top">
        <span className="eyebrow">AZ IRATOKTÓL AZ ÖSSZEFÜGGÉSEKIG</span>
        <span className="mono">MINTA / 01</span>
      </div>
      <Tabs defaultValue={initial} onValueChange={() => setSelected(null)}>
        <TabsList className="demo-tabs" aria-label="Bemutató típusa">
          <TabsTrigger value="email">
            <Mail />
            Levelezés
          </TabsTrigger>
          <TabsTrigger value="contract">
            <GitCompareArrows />
            Szerződés
          </TabsTrigger>
          <TabsTrigger value="witness">
            <MessagesSquare />
            Vallomás
          </TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <div className="sheet">
            <div className="sheet-heading">
              <span className="sheet-icon">
                <Mail size={20} />
              </span>
              <span>
                <span className="overline">3 FORRÁSIRAT → 1 MUNKALAP</span>
                <h3>Három levél. Egy idővonal.</h3>
              </span>
            </div>
            <div className="timeline">
              {[
                [
                  '03',
                  'Változtatást kérnek a tervezetben.',
                  'A levél egy előző napi egyeztetésre utal.',
                  'E01',
                ],
                [
                  '05',
                  'Egy szereplő megkapja a változatot.',
                  'A levél szerint piaci konzultáció céljából.',
                  'E02',
                ],
                [
                  '07',
                  'A változatot minden meghívottnak elküldik.',
                  'Az E03 állítása; kézbesítési adatok nélkül.',
                  'E03',
                ],
              ].map(([day, title, desc, id]) => (
                <div className="timeline-row" key={id}>
                  <div className="timeline-date">
                    <span>MÁRC.</span>
                    <strong>{day}</strong>
                  </div>
                  <div className="timeline-dot" />
                  <div className="timeline-copy">
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                  <SourceButton id={id} onSelect={setSelected} />
                </div>
              ))}
            </div>
            <div className="check-note">
              <CornerDownRight size={19} />
              <p>
                <strong>A következő kérdés</strong>Kinek, mikor és milyen
                jogcímen volt hozzáférése a tervezethez?
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="contract">
          <div className="sheet">
            <div className="sheet-heading">
              <span className="sheet-icon">
                <GitCompareArrows size={20} />
              </span>
              <span>
                <span className="overline">2 VÁLTOZAT → 3 ELTÉRÉS</span>
                <h3>Mi változott a szerződésben?</h3>
              </span>
            </div>
            <div className="contract-grid">
              <div>
                <span className="overline">
                  EREDETI <SourceButton id="S01" onSelect={setSelected} />
                </span>
                <strong>120 M Ft</strong>
                <p>2026. június 30.</p>
                <p>Telepítés és dokumentáció</p>
              </div>
              <div>
                <span className="overline">
                  MÓDOSÍTOTT <SourceButton id="S02" onSelect={setSelected} />
                </span>
                <strong>144 M Ft</strong>
                <p>2026. augusztus 31.</p>
                <p>+ Három hónap támogatás</p>
              </div>
            </div>
            <div className="delta-line">
              + 24 000 000 Ft <span>+20% nettó díjváltozás</span>
            </div>
            <div className="check-note">
              <CornerDownRight size={19} />
              <p>
                <strong>Több pénzért több szolgáltatás?</strong>A díj mellett a
                feladat is változott. Ez önmagában nem kár vagy túlárazás.
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="witness">
          <div className="sheet">
            <div className="sheet-heading">
              <span className="sheet-icon">
                <MessagesSquare size={20} />
              </span>
              <span>
                <span className="overline">3 FORRÁS → 1 ÖSSZEVETÉS</span>
                <h3>Eltérés vagy másik esemény?</h3>
              </span>
            </div>
            <div className="witness-row">
              <SourceButton id="T01" onSelect={setSelected} />
              <p>
                „Kedden találkoztunk.”<small>Műszaki egyeztetés</small>
              </p>
            </div>
            <div className="witness-row">
              <SourceButton id="T02" onSelect={setSelected} />
              <p>
                „Az egyeztetés szerdán volt.”
                <small>Üzemeltetési kérdések</small>
              </p>
            </div>
            <div className="witness-row alternative">
              <SourceButton id="T03" onSelect={setSelected} />
              <p>
                A feljegyzés két találkozót sorol fel.
                <small>
                  Alternatív magyarázat, amely gyengíti az ellentmondás
                  feltevését.
                </small>
              </p>
            </div>
            <div className="check-note">
              <CornerDownRight size={19} />
              <p>
                <strong>Ugyanarról az eseményről beszélnek?</strong>Az eltérés
                nem automatikus hazugságmegállapítás.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      {selected && (
        <SourcePanel id={selected} onClose={() => setSelected(null)} />
      )}
      <div className="workbench-foot">
        <DemoLabel />
        <span className="source-hint">
          Nyissa meg a forrásokat <ArrowUpRight size={12} />
        </span>
      </div>
    </div>
  );
}
export function HomePage() {
  return (
    <main id="main">
      <section className="hero">
        <div className="hero-copy">
          <Eyebrow>SZAKMAI TUDÁSMŰHELY · ÜGYÉSZEKNEK, NYOMOZÓKNAK</Eyebrow>
          <h1>
            Hogyan gyorsíthatók a korrupciós eljárások <em>AI segítségével?</em>
          </h1>
          <p className="hero-intro">
            Kevesebb idő az iratokra.
            <br />
            Több figyelem az összefüggésekre.
          </p>
          <p className="hero-description">
            E-mailek, szerződések, vallomások. Fedezze fel, hogyan lesz a
            nehezen áttekinthető anyagból forrásokkal ellenőrizhető munkalap —
            és hogyan kezdhet hozzá.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} href="/mintaugy" className="button primary">
              Mutassa egy példán <ArrowUpRight size={18} />
            </Link>
            <Link prefetch={false} href="/eszkozok" className="text-link">
              Milyen eszközök vannak? <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-note">
            <Check size={14} /> Konkrét feladatok. Kipróbálható minták. Emberi
            ellenőrzés.
          </div>
        </div>
        <Workbench />
      </section>
      <div className="journey-strip">
        <span>EGY FELADATTÓL A SAJÁT MÓDSZERIG</span>
        <div>
          <b>01</b> Feladat <ArrowRight />
          <b>02</b> AI-kimenet <ArrowRight />
          <b>03</b> Módszer <ArrowRight />
          <b>04</b> Eszköz
        </div>
        <Link
          prefetch={false}
          href="#feladatok"
          aria-label="Tovább a feladatokhoz"
        >
          <ArrowDown size={18} />
        </Link>
      </div>
      <section className="section" id="feladatok">
        <Eyebrow>01 / MIRE HASZNÁLHATÓ?</Eyebrow>
        <div className="section-heading">
          <h2>
            Melyik feladat
            <br />
            <em>viszi el az idejét?</em>
          </h2>
          <p>
            Válasszon ismerős munkát. Megmutatjuk a kiinduló iratot, az AI-val
            készíthető eredményt és a kipróbálás módját.
          </p>
        </div>
        <TaskCards />
        <Link
          prefetch={false}
          href="/feladatok"
          className="text-link all-tasks"
        >
          Összes feladat: jogi kutatás és ügyirat-összeállítás is{' '}
          <ArrowUpRight size={18} />
        </Link>
      </section>
      <HomeSections />
    </main>
  );
}

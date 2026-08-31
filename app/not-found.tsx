import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="page-shell not-found">
      <span className="eyebrow">404 / HIÁNYZÓ OLDAL</span>
      <h1>
        Ezt az iratot
        <br />
        <em>nem találjuk.</em>
      </h1>
      <p>
        Lehet, hogy a hivatkozás megváltozott. A feladatkatalógusból vagy a
        szakmai háttérből újra elindulhat.
      </p>
      <div className="inline-links">
        <Link prefetch={false} className="button primary" href="/feladatok">
          Feladatkatalógus →
        </Link>
        <Link prefetch={false} className="text-link" href="/">
          Vissza a főoldalra →
        </Link>
      </div>
    </main>
  );
}

# AI az ügyészi munkában

Interaktív, magyar nyelvű szakmai tudásműhely az AI ügyészi alkalmazásáról.
31 tartalmi oldal, nyolc feladatterület, négy módszer, szűrhető eszközkatalógus,
ötállomásos fiktív ügy és hatrészes tanulmány.

**Weboldal:** https://sabolo100.github.io/ai-az-ugyeszi-munkaban/

A bemutatók előre elkészített fiktív minták. Nincs éles AI-hívás, ügyiratfeltöltés
vagy regisztráció. A saját ötletlap nem küld adatot háttérszolgáltatásnak.

## Helyi fejlesztés

Node.js 22 vagy újabb szükséges.

```sh
npm ci
npm run dev
```

Helyi előnézet: http://localhost:3000/

Ellenőrzés: `npm run lint`, `npm run typecheck`, `npm run build`.
A lefordított csomag helyi indítása: `npm start` (alapértelmezésben http://localhost:8787/).

Futó fejlesztői szerver mellett: `npm run check:routes`.
Másik helyi szerver ellenőrzéséhez a `CHECK_ORIGIN` környezeti változó használható.

[Ellenőrzési jegyzőkönyv](qa/ELLENORZES.md).

## GitHub Pages

```sh
npm run build:pages
npm run check:pages
```

A statikus kiadás az `out` mappába kerül. A Pages-kiadás a forrás Next.js-kompatibilitását
használja: natív Next.js statikus export készül, szerver és külön adatbázis nélkül.
Az eredeti Vinext/Cloudflare kiadás továbbra is elérhető az `npm run build` paranccsal.

A `.github/workflows/pages.yml` minden `main` ágra történő push után telepíti a weboldalt.
A folyamat telepíti a zárolt függőségeket, ellenőrzi a kódot, elkészíti és ellenőrzi
az összes statikus oldalt, majd a GitHub Pages-re tölti az `out` mappát.
Az Actions felületén kézzel is indítható.

A repó nevéből adódó alkönyvtárat a `NEXT_PUBLIC_BASE_PATH`, a teljes nyilvános címet
a `SITE_ORIGIN` adja meg. A munkafolyamat ezeket a Pages beállításaiból olvassa.
A helyi Pages-build alapértéke ennek a repónak a címe. A `SITE_PUBLIC` és `PAGES_BUILD`
jelzőket az exportáló állítja; a helyi előnézet továbbra sem indexelhető.

A régi címek statikus átirányító oldalakat kapnak, mivel a Pages nem futtat szerveroldali
átirányításokat. A mintaugy és a katalógus URL-paraméterei megmaradnak.

## Tartalom és karbantartás

- Közös feladatok, módszerek és eszközök: `lib/content.ts`.
- Felület: `components/`; arculat: `app/globals.css`.
- A teljes tanulmány és mintakérések: `content/`; letöltések: `public/letoltesek/`.
- [Projektismertető és sajtóanyag](docs/PROJEKTISMERTETO.md).

A tartalmat a repo már tartalmazza; a futtatáshoz nem kell újraimportálni.
Az opcionális `import:content` parancs az eredeti átadási csomagban lévő szomszédos
`munkaanyag` és `weboldal_specifikacio_v2` mappát használja.

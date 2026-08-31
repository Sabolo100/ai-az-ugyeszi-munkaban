# GitHub Pages kiadás — 2026. augusztus 31.

A felhasználó kérésére a korábbi helyi változat GitHub Pages-kiadást kapott.

- Forrás: `Sabolo100/ai-az-ugyeszi-munkaban`, `main` ág.
- Tervezett cím: https://sabolo100.github.io/ai-az-ugyeszi-munkaban/
- A Pages-kiadás natív Next.js statikus export, a korábbi Vinext/Worker build megmaradt.
- `npm run build:pages`: sikeres, 31 tartalmi oldal exportálva.
- `npm run check:pages`: 31 oldal, 15 örökölt cím, 49 helyi hivatkozási cél,
  a repó útvonalelőtagja, nyilvános metaadatok és a 404-oldal ellenőrizve.
- `npm run lint` és `npm run typecheck`: sikeres.
- Beépített Chromium böngésző: a statikus előnézeten a szerződésfül aktiválása
  és a főoldalról a mintaugyre történő kliensoldali navigáció sikeres.
- A teljes repo helyett kizárólag az `out` könyvtár kerül a Pages-re.
  A repo nem tartalmaz node_modules-t, helyi környezeti fájlt, build-gyorsítótárat
  vagy hozzáférési kulcsot. A forrásokban végzett kulcsminta-keresés nem talált kulcsot.

A történeti `ELLENORZES.md` a helyi kiadás 2026. augusztus 30-i ellenőrzését írja le.
A nyilvános kiadásban az indexelés engedélyezett. A telepítés eredménye az Actions
és a `github-pages` environment felületén követhető.

# Ellenőrzési jegyzőkönyv

Dátum: 2026. augusztus 30. A helyi változat ellenőrzése; nem nyilvános élesítés.

## Technikai ellenőrzés

- `npm run lint`: sikeres.
- `npm run typecheck`: sikeres.
- `npm run build`: sikeres; elkészült a Worker-alapú szerver és a klienscsomag.
- A lefordított csomag külön helyi Wrangler-szerveren is elindult.
- `npm run check:routes`: 31 tartalmi oldal HTTP 200, magyar nyelvi jelölés, főcím és leíró metaadat; 9 régi útvonal átirányítása; 44 belső hivatkozás a kiadási változatban; 8 letölthető/statikus erőforrás; ismeretlen címre HTTP 404; 11 R-forrás. Gépi eredmény: `routes.json`.
- `npm audit`: az ellenőrzés időpontjában 0 ismert sérülékenység. Gépi eredmény: `audit.json`. Ez nem teljes alkalmazásbiztonsági tanúsítás.

## Böngészőben ellenőrzött működés

Az ellenőrzés a Codex beépített, Chromium-alapú böngészőjében történt.

- Nyitó bemutató: levelezés, szerződés és vallomás; E01 forrásrészlet megnyitása és bezárása; a forrásdátum és a hivatkozott előző nap megkülönböztetése; a 120 és 144 millió forintos szerződésösszevetés.
- A nyílbillentyűkkel fókuszba kerülő lapfül azonnal aktiválódik; látható fókuszjelzés. A lapfülek hozzáférhető névvel és kijelölt állapottal rendelkeznek.
- Mobilmenü megnyitása, bezárása és navigáció utáni bezáródása.
- Katalógus: feladatszűrés, kombinált szűrés, üres találati állapot, szűrőtörlés. A választás megjelenik az URL-ben.
- Mintaugy: állomás- és fülváltás, a harmadik állomás munkalapja, a kiválasztott állapot visszaállása újratöltés után.
- Agent: lépésenkénti haladás az ötödik ellenőrzési pontig, a végállapotban letiltott továbbgomb.
- Prompt: a teljes mintabemenet a másolandó szöveg része; a másolás sikerjelzése megjelenik; a teljes szöveg külön megnyitható és letölthető. A böngészőautomatizálás virtuális vágólapja nem tükrözi az operációs rendszer vágólapját, ezért a tényleges külső alkalmazásba beillesztést ez az ellenőrzés nem igazolja.
- Ötletlap: mind az öt mező fiktív adattal kitöltve; a generált, megnyitott szöveg a megadott értékeket tartalmazza. Nincs adatküldés vagy tartós mentés.
- Teljes tanulmány: fejezetek, fejezeten belüli tartalomjegyzék, forráslinkek és letöltések. Mobilon a széles táblázatok címkézett kártyákká alakulnak.
- Főoldali szélességek: 320, 375, 430, 768, 1024, 1280, 1440 és 1920 képpont; nem jelentkezett oldalszintű vízszintes túlcsordulás. A mintaugy, az agent és a tanulmányolvasó 375 képponton is ellenőrizve.

## Tartalmi és adatkezelési ellenőrzés

- Az eredeti specifikáció és kutatási állományok változatlanul megmaradtak. A hat kutatási fejezet teljes szövege importált tartalomként szerepel az olvasóban.
- A főoldal nyolc tartalmi egysége a feladat → kimenet → módszer → eszköz → háttér szerkezetet követi. A főszöveg körülbelül 725 szó.
- A fiktív minta, gyártói állítás és intézményi példa megkülönböztetett; a hiányzó adat és az alternatív magyarázat megjelenik.
- Az SFO „akár 40%” közlése a dokumentumvizsgálatra korlátozott; nincs belőle számított magyar vagy teljeseljárás-hatás. A TAR-pilot és az Axcelerate történeti hibaközlése elkülönül.
- A hét termékhez közvetlen gyártói forrás, az intézményi példákhoz elsődleges forrás tartozik. A megadott termékoldalak és az SFO/STF hivatkozásai az ellenőrzéskor elérhetők voltak.
- Nincs ügyiratfeltöltés, éles modellhívás, regisztráció, analitika vagy automatikus külső beágyazás. A betűkészlet helyben betöltött.

## Az ellenőrzés korlátai

- Safari, Firefox és külön Edge-motoron nem történt futtatás; ezekhez külön böngészőteszt szükséges.
- A csökkentett mozgást kezelő CSS és a nyomtatási stílus elkészült; külön operációsrendszer-beállítással, nyomtatóval vagy képernyőolvasóval nem történt teljes körű teszt.
- Nincs független WCAG-audit vagy Lighthouse-teljesítményminősítés. A mobilvizsgálat viewport-emuláció, nem fizikai telefonos teszt.
- A helyi változat `noindex` beállítású. Élesítéskor a domain, indexelés és a fogadó környezet felülvizsgálandó; a jogi tartalom felhasználáskor ismét ellenőrizendő.

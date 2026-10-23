# Úpravy webu Tvoj Webík

Najprv obsahové zmeny (body 1–6 a 8). Export z Lovable riešime ako samostatný krok potom.

## 1. Premenovanie služby
Všade na webe nahradiť „Logá & Webový dizajn“ za „Logá & grafika“ (hero, služby, pätička, texty pre vyhľadávače).

## 2. Nový popis služby
V sekcii „Čo pre vás vieme postaviť“ dostane karta Logá & grafika popis:
„Tvorba vizuálnej identity, reklamných bannerov a atraktívneho obsahu pre sociálne siete.“

## 3. Termín
„Web do 3 týždňov“ → „Web do 2 týždňov“ (hero aj titulok stránky pre vyhľadávače).

## 4. Dopytový formulár
- Do prvého kroku pridať možnosť „Logá & grafika“ (spolu: Webstránka, Redizajn, E-shop, Logá & grafika, Iné).
- Krok rozpočet sa prispôsobí vybranej službe:
  - Webstránka: do 300 €, 300 – 500 €, 500+ €
  - Redizajn: do 100 €, 150+ €
  - E-shop: do 500 €, 500 – 700 €, 700+ €
  - Logá & grafika: 50 €, 50 – 100 €, 100+ €
  - Iné: pôvodné možnosti + „Zatiaľ neviem“
- Pri zmene služby sa už zvolený rozpočet vynuluje, aby nezostala nesúvisiaca suma.

## 5. Portfólio
Zostanú dve položky:
1. **WEB – ZEPPA** — „Moderná prezentácia pre elektroinštalačnú firmu so zameraním na ponuku služieb a jednoduchý kontakt.“ Karta odkazuje na https://zeppa-web.vercel.app/ (otvorí sa v novom okne).
2. **Logá & grafika** — po kliknutí sa otvorí galéria (okno cez celý web) s dvoma albumami:
   - **LOGO** — AB interiér (nahraný obrázok AB interier)
   - **Marketingová grafika** — Marketingová grafika1, Marketingová grafika2, Marketingová grafika3
   Kliknutie na obrázok ho zobrazí vo veľkom, s možnosťou zatvorenia.
Nahrané obrázky pridám ako obrázky webu; nepoužité ukážkové obrázky projektov odstránim.

## 6. Kontakty
E-mail všade na potrebujes@tvojwebik.sk, telefón na +421 940 120 339 (pätička, chat, texty asistenta).

## 8. Odpoveď asistenta, keď nevie
Webík dostane pokyn: keď odpoveď nepozná, napíše presne
„Som tu nový, ešte neviem všetko, ale neváhaj sa obrátiť na kolegov cez mail potrebujes@tvojwebik.sk“.

## Technické detaily
- Zmeny v `Hero.tsx`, `Services.tsx`, `Footer.tsx`, `Brief.tsx`, `Portfolio.tsx`, `routes/index.tsx`, `routes/api/chat.ts` (systémový prompt) a `ChatWidget.tsx` (chybová správa s e-mailom).
- Rozpočty ako mapa `service -> string[]` nad komponentom Brief; `canContinue` zostáva.
- Galéria ako `Dialog` (shadcn) v `Portfolio.tsx`, albumy ako dátové polia; obrázky pripojené cez asset pointery (`lovable-assets`).
- Portfólio prejde z pevnej mriežky 4 kariet na 2 karty; nepoužité `work-*.jpg` zmažem.

## Ďalší krok (bod 7)
Po odsúhlasení obsahových zmien pripravím samostatný plán exportu: odstránenie väzieb na Lovable, čisto statický build cez `npm run build`, chat volajúci AI priamo z prehliadača s kľúčom z `.env` (`VITE_AI_API_KEY`) a súbor `.env.example`. Upozorňujem, že takýto kľúč je na webe verejne viditeľný — pri exporte to ešte raz zvážime.

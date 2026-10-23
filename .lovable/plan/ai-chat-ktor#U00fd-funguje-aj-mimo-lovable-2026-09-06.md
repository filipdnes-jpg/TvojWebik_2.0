# AI chat, ktorý funguje aj mimo Lovable

Cieľ: Webík (chatovacie okienko) má odpovedať aj keď web beží na Verceli alebo na Websupporte, s vlastným Google Gemini kľúčom.

## Ako to bude fungovať

Chat má dve časti: okienko na stránke (to funguje všade) a malú serverovú časť, ktorá sa pýta AI a drží kľúč v bezpečí. Kľúč nesmie byť nikdy v stránke, inak ho môže zneužiť ktokoľvek.

**Vercel** – zvládne obe časti. Do nastavení projektu na Verceli vložíš svoj Gemini kľúč a chat funguje rovnako ako teraz.

**Websupport** – bežný webhosting serverovú časť spustiť nedokáže. Preto sa okienko na Websupporte bude pýtať serverovej časti, ktorá beží na Verceli (jedna adresa navyše v nastavení). Web teda môže bývať na Websupporte a chat aj tak funguje. Ak máš na Websupporte Node.js hosting (VPS/Cloud), pošli mi to a nasadíme tam aj serverovú časť priamo.

## Čo urobím

1. Chat prepnem na tvoj vlastný Gemini kľúč: ak je nastavený `GEMINI_API_KEY`, použije sa priamo Google; ak nie je, použije sa doterajšia Lovable cesta. Nič sa tým v Lovable náhľade nerozbije.
2. Okienko chatu doplním o možnosť volať chat na inej adrese (`VITE_CHAT_API_URL`) – pre prípad Websupportu. Keď nie je nastavená, používa sa vlastný web ako doteraz.
3. Doplním povolenie cudzej domény (CORS) na chatovom endpointe, aby volanie z Websupportu prešlo.
4. Chybové stavy nechám zrozumiteľné: pri prekročení limitu / chýbajúcom kľúči sa v okienku ukáže ľudská správa s mailom, nie prázdna odpoveď.
5. Napíšem ti krátky návod (`DEPLOY.md`): kde na Verceli vložiť kľúč, ako nasadiť a čo nastaviť na Websupporte.
6. Chat otestujem cez skutočné odoslanie správy, aby sme videli, že odpovedá.

## Technické detaily

- `src/routes/api/chat.ts`: vetvenie providera. `GEMINI_API_KEY` → `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions` (OpenAI-kompatibilné, `Authorization: Bearer`), model `gemini-2.5-flash`, `stream: true`; inak existujúca Lovable gateway cesta. Rovnaký SSE formát, takže klient sa nemení.
- Pridám `OPTIONS` handler + `Access-Control-Allow-Origin` (obmedzené na zoznam domén z `ALLOWED_ORIGINS`, default `*` pri nenastavení).
- `src/components/site/ChatWidget.tsx`: `const api = import.meta.env.VITE_CHAT_API_URL ?? "/api/chat"`.
- Kľúč `GEMINI_API_KEY` uložím do Lovable secrets (bezpečný formulár), aby chat fungoval aj v náhľade; na Verceli ho pridáš do Environment Variables s rovnakým názvom.
- Build je štandardný TanStack Start / Vite → na Verceli funguje bez úprav; pre Websupport sa nasadzuje len statická časť.

## Čo budem od teba potrebovať

Gemini kľúč z Google AI Studio (aistudio.google.com → API keys). Vyžiadam si ho bezpečným formulárom, keď plán schváliš.

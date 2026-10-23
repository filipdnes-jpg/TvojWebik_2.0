# Nasadenie mimo Lovable

Web je štandardná TanStack Start / Vite aplikácia. AI chat potrebuje serverovú
časť (`/api/chat`), ktorá drží API kľúč mimo prehliadača.

## Premenné prostredia

| Názov               | Kde              | Načo                                                               |
| ------------------- | ---------------- | ------------------------------------------------------------------ |
| `GEMINI_API_KEY`    | server           | Tvoj Google Gemini kľúč (aistudio.google.com → API keys)           |
| `ALLOWED_ORIGINS`   | server, voliteľné| Zoznam domén oddelený čiarkou, ktoré smú volať chat                |
| `VITE_CHAT_API_URL` | build, voliteľné | Plná adresa chatu, keď web beží inde než server (napr. Websupport) |

Ak `GEMINI_API_KEY` nie je nastavený, chat sa pokúsi použiť Lovable AI
(`LOVABLE_API_KEY`) – to funguje len v Lovable prostredí.

## Vercel (web aj chat)

1. Naimportuj repozitár na vercel.com.
2. Build command `npm run build`, framework sa deteguje automaticky.
3. Settings → Environment Variables → pridaj `GEMINI_API_KEY`.
4. Voliteľne `ALLOWED_ORIGINS=https://tvojadomena.sk,https://www.tvojadomena.sk`.
5. Deploy. Chat beží na `https://<projekt>.vercel.app/api/chat`.

## Websupport (web na Websupporte, chat na Verceli)

Bežný webhosting nespustí serverovú časť, preto:

1. Nasaď projekt na Vercel podľa krokov vyššie (stačí kvôli chatu).
2. Na Verceli nastav `ALLOWED_ORIGINS` na svoju Websupport domému.
3. Pre build určený na Websupport nastav
   `VITE_CHAT_API_URL=https://<projekt>.vercel.app/api/chat`.
4. `npm run build` a obsah výstupného adresára nahraj na Websupport (FTP).

Ak máš na Websupporte Node.js hosting (VPS / Cloud), server sa dá spustiť aj
tam: `npm ci && npm run build`, potom spustiť server výstup s nastaveným
`GEMINI_API_KEY`, a `VITE_CHAT_API_URL` netreba.

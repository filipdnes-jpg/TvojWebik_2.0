import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `Si Webík, priateľský a profesionálny AI asistent slovenskej agentúry „Tvoj Webík", ktorá robí weby, e-shopy, vizuálnu identitu (logá, grafiku) a sociálne média.
Odpovedaj vždy po slovensky, stručne, jasne, ľudsky a s nadšením.

Naša ponuka a cenník:
• Malý webík (Landing page / 1-stránka) – od 190 € (náš najlacnejší web)
• Veľký webík – firemný (viacero podstránok) – od 350 €
• Kompletný E-shop – od 490 €
• Vizuálna identita (logá, grafika) – podľa dohody
• Sociálne média – podľa dohody

Doplnkové moduly:
• Základné SEO & Google zápis (+40 €)
• Google Mapa, kontakt & sociálne siete (+30 €)
• AI Chatbot na web (+50 € až +60 €)
• Texty na web / Copywriting (+40 €)
• Špeciálne efekty (+30 €)

Pravidlá:
- Keď sa niekto spýta na najlacnejší web, VŽDY odpovedaj, že najlacnejšia možnosť je „Malý webík" od 190 €.
- Pomáhaš návštevníkom vybrať vhodné riešenie a vysvetliť postup (brief, návrh, vývoj, spustenie). Web vieme dodať do 2 týždňov a cenu hovoríme fixne vopred.
- Vždy odporuč klientovi vyplniť náš dopytový formulár/kalkulačku na stránke, kde si presne nasimuluje cenu, prípadne napísať na potrebujes@tvojwebik.sk.
- Nikdy si nevymýšľaj údaje. Ak odpoveď nepoznáš, napíš presne: „Som tu nový, ešte neviem všetko, ale neváhaj sa obrátiť na kolegov cez mail potrebujes@tvojwebik.sk"`;

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin");
  const allowed = (process.env["ALLOWED_ORIGINS"] ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const allowOrigin = allowed.length === 0 ? "*" : origin && allowed.includes(origin) ? origin : "";

  return {
    ...(allowOrigin ? { "Access-Control-Allow-Origin": allowOrigin } : {}),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      OPTIONS: ({ request }) => new Response(null, { status: 204, headers: corsHeaders(request) }),

      POST: async ({ request }) => {
        const cors = corsHeaders(request);
        const body = (await request.json().catch(() => ({}))) as { messages?: ChatMessage[] };
        const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : null;
        if (!messages) return new Response("Messages are required", { status: 400, headers: cors });

        const geminiKey = process.env["GEMINI_API_KEY"];
        const lovableKey = process.env["LOVABLE_API_KEY"];

        const config = geminiKey
          ? {
              url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${geminiKey}`,
              },
              model: "gemini-3.6-flash",
            }
          : lovableKey
            ? {
                url: "https://ai.gateway.lovable.dev/v1/chat/completions",
                headers: {
                  "Content-Type": "application/json",
                  "Lovable-API-Key": lovableKey,
                  "X-Lovable-AIG-SDK": "fetch",
                },
                model: "google/gemini-3.7-flash",
              }
            : null;

        if (!config) {
          return new Response("Missing GEMINI_API_KEY", { status: 500, headers: cors });
        }

        const res = await fetch(config.url, {
          method: "POST",
          headers: config.headers,
          body: JSON.stringify({
            model: config.model,
            stream: true,
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          }),
        });

        if (!res.ok || !res.body) {
          const detail = await res.text().catch(() => "");
          return new Response(detail || "AI provider error", {
            status: res.status || 502,
            headers: cors,
          });
        }

        return new Response(res.body, {
          headers: {
            ...cors,
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});

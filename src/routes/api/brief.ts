import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const TO_EMAIL = "potrebujes@tvojwebik.sk";
// Kým nie je v Resend overená domána tvojwebik.sk, Resend povolí len adresu vlastníka účtu.
const FALLBACK_TO_EMAIL = "tvojwebik@gmail.com";
const FROM_EMAIL = process.env["RESEND_FROM"] ?? "Tvoj Webík <onboarding@resend.dev>";


const briefSchema = z.object({
  service: z.string().min(1).max(100),
  packageTitle: z.string().max(200).optional().default(""),
  addons: z.array(z.string().max(200)).max(20).optional().default([]),
  total: z.number().min(0).max(100000).optional().default(0),
  idea: z.string().min(1).max(5000),
  budget: z.string().max(100).optional().default(""),
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
});

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const Route = createFileRoute("/api/brief")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = briefSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return Response.json({ error: "Neplatné údaje." }, { status: 400 });
        }
        const d = parsed.data;

        const apiKey = process.env["RESEND_API_KEY"];
        if (!apiKey) {
          console.error("RESEND_API_KEY is not configured");
          return Response.json({ error: "E-mailová služba nie je nastavená." }, { status: 500 });
        }

        const rows: [string, string][] = [
          ["Meno", d.name],
          ["E-mail", d.email],
          ["Služba", d.service],
          ["Balík", d.packageTitle || "—"],
          ["Doplnkové moduly", d.addons.length ? d.addons.join(", ") : "—"],
          ["Odhadovaná cena", d.total ? `${d.total} €` : "—"],
          ["Rozpočet", d.budget || "—"],
          ["Predstava", d.idea],
        ];

        const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1f1a14">
<h2 style="margin:0 0 16px">Nový dopyt z webu</h2>
<table cellpadding="6" style="border-collapse:collapse">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="background:#faf3e6;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`,
  )
  .join("\n")}
</table>
</div>`;

        const send = (to: string) =>
          fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              from: FROM_EMAIL,
              to: [to],
              reply_to: d.email,
              subject: `Nový dopyt: ${d.service} – ${d.name}`,
              html,
              text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
            }),
          });

        let res = await send(TO_EMAIL);

        if (res.status === 403) {
          const first = await res.text();
          console.error(`Resend request failed [403]: ${first}`);
          // Resend v testovacom režime doručí len na adresu vlastníka účtu.
          res = await send(FALLBACK_TO_EMAIL);
        }

        if (!res.ok) {
          const errorBody = await res.text();
          console.error(`Resend request failed [${res.status}]: ${errorBody}`);
          return Response.json(
            { error: `Odoslanie e-mailu zlyhalo [${res.status}]: ${errorBody}` },
            { status: 502 },
          );
        }

        return Response.json({ ok: true });

      },
    },
  },
});

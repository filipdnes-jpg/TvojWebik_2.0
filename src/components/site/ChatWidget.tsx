import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import mascot from "@/assets/mascot.png";

type ChatMessage = { role: "user" | "assistant"; content: string };

const CHAT_API_URL = import.meta.env["VITE_CHAT_API_URL"] || "/api/chat";

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Ahoj, som Webík! 👋 Poraď sa so mnou o webe, e-shope alebo logu – na čo sa chceš spýtať?",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });

      if (!res.ok || !res.body) {
        setError(
          res.status === 429
            ? "Priveľa otázok naraz, skús to prosím o chvíľu."
            : "Nepodarilo sa mi odpovedať. Napíš nám na potrebujes@tvojwebik.sk.",
        );
        setLoading(false);
        return;
      }

      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) {
              setMessages((m) => {
                const copy = [...m];
                const last = copy[copy.length - 1];
                if (!last) return copy;
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: last.content + delta,
                };
                return copy;
              });
            }
          } catch {
            // ignore partial chunks
          }
        }
      }
    } catch {
      setError("Spojenie sa prerušilo. Skús to prosím znova.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="flex h-[26rem] w-[21rem] max-w-[calc(100vw-2.5rem)] flex-col rounded-3xl border border-border bg-card shadow-lift">
          <div className="flex items-center justify-between gap-3 border-b border-border p-4">
            <div className="flex items-center gap-3">
              <img
                src={mascot}
                alt="Maskot Webík"
                loading="lazy"
                width={1024}
                height={1024}
                className="size-9 object-contain"
              />
              <div>
                <p className="text-sm font-semibold">Webík</p>
                <p className="text-xs text-muted-foreground">
                  {loading ? "píše…" : "online"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Zavrieť"
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-primary px-3.5 py-2 text-sm text-primary-foreground"
                    : "w-fit max-w-[90%] rounded-2xl bg-muted px-3.5 py-2 text-sm text-foreground"
                }
              >
                {m.content || "…"}
              </div>
            ))}
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Napíš správu…"
              aria-label="Správa pre Webíka"
              className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Odoslať"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 rounded-full border border-border bg-card py-2 pl-2 pr-5 text-sm font-medium shadow-lift transition-transform hover:-translate-y-0.5"
        >
          <img
            src={mascot}
            alt="Maskot Webík"
            loading="lazy"
            width={1024}
            height={1024}
            className="size-9 rounded-full bg-cream object-contain p-1"
          />
          Potrebuješ poradiť?
        </button>
      )}
    </div>
  );
}

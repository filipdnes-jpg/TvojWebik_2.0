import { ArrowRight, Sparkles, Timer, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import mascot from "@/assets/mascot.png";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-grid">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-cream blur-3xl opacity-70" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-xs font-semibold text-accent-foreground">
            <Sparkles className="size-3.5" />
            Weby, e-shopy a Logá & grafika na mieru
          </span>

          <h1 className="mt-6 text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
            Váš nový web rýchlo, moderne a bez starostí.
          </h1>

          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Náš AI asistent – maskot Webík – vás prevedie celým zadaním. Stačí pár odpovedí a hneď
            vieme, aký web potrebujete.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <a href="#brief">
                Navrhnúť vlastný web <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="soft" size="xl">
              <a href="#portfolio">Pozrieť portfólio</a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Timer className="size-4 text-primary" /> Web do 2 týždňov
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" /> Fixná cena vopred
            </span>
          </div>
        </div>

        <div className="rounded-4xl border border-border bg-card p-4 shadow-lift">
          <div className="rounded-3xl bg-warm p-5">
            <div className="relative mx-auto max-w-sm rounded-2xl bg-card px-5 py-4 text-sm shadow-soft">
              Ahoj! Som tvoj sprievodca Webík.&nbsp;Posuňme tvoj biznisík o krok ďalej!
              <span className="absolute -bottom-2 left-8 size-4 rotate-45 rounded-sm bg-card" />
            </div>
            <img
              src={mascot}
              alt="Maskot Webík – tvoj AI sprievodca"
              width={1024}
              height={1024}
              className="mx-auto mt-6 h-72 w-auto animate-float object-contain"
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-muted-foreground">
            <span>Webík · AI sprievodca</span>
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" /> online
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

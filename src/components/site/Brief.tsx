import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import serviceMascot from "@/assets/brief-service.png";
import ideaMascot from "@/assets/brief-idea.png";
import budgetMascot from "@/assets/brief-budget.png";
import contactMascot from "@/assets/brief-contact.png";

const stepLabels = ["Služba", "Predstava", "Rozpočet", "Kontakt"];
const serviceOptions = ["Webstránka", "E-shop", "Logá & grafika", "Iné"];

type Pkg = { id: string; title: string; note: string; price: number };
type Addon = { id: string; title: string; price: number; recommended?: boolean };

const webPackages: Pkg[] = [
  { id: "maly", title: "Malý webík", note: "Landing page / 1-stránka", price: 190 },
  {
    id: "velky",
    title: "Veľký webík – firemný",
    note: "Viacero podstránok: O nás, Služby, Kontakt…",
    price: 350,
  },
];

const eshopPackage: Pkg = {
  id: "eshop",
  title: "Kompletný E-shop",
  note: "Katalóg, košík, platby, doprava",
  price: 490,
};

const webAddons: Addon[] = [
  { id: "seo", title: "Základné SEO & Google zápis", price: 40, recommended: true },
  { id: "mapa", title: "Google Mapa, kontakt & sociálne siete", price: 30, recommended: true },
  { id: "chatbot", title: "AI Chatbot", price: 50 },
  { id: "copy", title: "Texty na web (Copywriting)", price: 40 },
  { id: "special", title: "Špeciálne požiadavky (efekt Predtým / Potom)", price: 30 },
];

const eshopAddons: Addon[] = [
  { id: "seo", title: "Základné SEO & Google zápis", price: 40, recommended: true },
  { id: "chatbot-eshop", title: "AI Chatbot pre e-shop", price: 60 },
  { id: "import", title: "Import produktov (ak ich je veľa)", price: 50 },
];

const budgetsByService: Record<string, string[]> = {
  Webstránka: ["do 300 €", "300 – 500 €", "500+ €"],
  "E-shop": ["do 500 €", "500 – 700 €", "700+ €"],
  "Logá & grafika": ["50 €", "50 – 100 €", "100+ €"],
  Iné: ["do 300 €", "300 – 500 €", "500+ €", "Zatiaľ neviem"],
};

const prompts = [
  "Aké služby potrebuješ?",
  "Povedz mi viac o svojej predstave.",
  "Aký rozpočet máš v hlave?",
  "Kam ti môžeme poslať návrh?",
];

export function Brief() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState("");
  const [pkgId, setPkgId] = useState("");
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [idea, setIdea] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);


  const isWeb = service === "Webstránka";
  const isEshop = service === "E-shop";
  const hasCalculator = isWeb || isEshop;

  const packages = isWeb ? webPackages : isEshop ? [eshopPackage] : [];
  const addons = isWeb ? webAddons : isEshop ? eshopAddons : [];
  const selectedPkg = packages.find((p) => p.id === pkgId);
  const showAddons = isEshop ? Boolean(selectedPkg) : Boolean(selectedPkg);

  const total =
    (selectedPkg?.price ?? 0) +
    addons.filter((a) => addonIds.includes(a.id)).reduce((sum, a) => sum + a.price, 0);

  const budgetOptions = budgetsByService[service] ?? budgetsByService["Iné"]!;

  const resetService = (o: string) => {
    setService(o);
    setBudget("");
    setAddonIds([]);
    setPkgId(o === "E-shop" ? eshopPackage.id : "");
  };

  const toggleAddon = (id: string) =>
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const canContinue = [
    hasCalculator ? Boolean(service && selectedPkg) : Boolean(service),
    idea.trim().length > 3,
    Boolean(budget),
    Boolean(name && email),
  ][step];

  const next = async () => {
    if (!canContinue || sending) return;
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          packageTitle: selectedPkg?.title ?? "",
          addons: addons.filter((a) => addonIds.includes(a.id)).map((a) => `${a.title} (${a.price} €)`),
          total,
          idea,
          budget,
          name,
          email,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSent(true);
      toast.success("Dopyt odoslaný! Ozveme sa do 24 hodín.");
    } catch {
      toast.error("Dopyt sa nepodarilo odoslať. Napíš nám na potrebujes@tvojwebik.sk.");
    } finally {
      setSending(false);
    }
  };


  return (
    <section id="brief" className="scroll-mt-20 bg-warm py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-3xl font-bold sm:text-4xl">Napíš nám svoju predstavu</h2>
        <p className="mt-3 text-muted-foreground">Štyri krátke kroky. Webík sa postará o zvyšok.</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="rounded-2xl bg-cream px-4 py-3 text-sm font-medium">
              {sent ? "Hotovo, ďakujem! Už to čítam." : prompts[step]}
            </div>
            {(() => {
              const phaseImages = [
                { src: serviceMascot, alt: "Webík – výber služby" },
                { src: ideaMascot, alt: "Webík – premýšľa o tvojej predstave" },
                { src: budgetMascot, alt: "Webík – rozpočet" },
                { src: contactMascot, alt: "Webík – kontakt" },
              ];
              const current = sent ? phaseImages[3]! : phaseImages[step]!;
              return (
                <img
                  src={current.src}
                  alt={current.alt}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="mx-auto mt-5 h-40 w-auto object-contain"
                />
              );
            })()}
            <ol className="mt-6 space-y-2 text-sm">
              {stepLabels.map((label, i) => (
                <li
                  key={label}
                  className={
                    i === step && !sent
                      ? "flex items-center gap-3 font-semibold text-foreground"
                      : "flex items-center gap-3 text-muted-foreground"
                  }
                >
                  <span
                    className={
                      i < step || sent
                        ? "flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
                        : i === step
                          ? "flex size-6 items-center justify-center rounded-full bg-primary/25 text-xs"
                          : "flex size-6 items-center justify-center rounded-full bg-muted text-xs"
                    }
                  >
                    {i < step || sent ? <Check className="size-3.5" /> : i + 1}
                  </span>
                  {label}
                </li>
              ))}
            </ol>
          </aside>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
            {sent ? (
              <div className="flex h-full flex-col items-start justify-center gap-4">
                <h3 className="text-2xl font-semibold">Dopyt je na ceste k nám</h3>
                <p className="text-muted-foreground">
                  Ďakujeme, {name}. Ozveme sa na {email} do 24 hodín s návrhom aj cenou.
                </p>
                <Button
                  variant="soft"
                  size="xl"
                  onClick={() => {
                    setSent(false);
                    setStep(0);
                    setService("");
                    setPkgId("");
                    setAddonIds([]);
                    setIdea("");
                    setBudget("");
                    setName("");
                    setEmail("");
                  }}
                >
                  Vyplniť nový dopyt
                </Button>
              </div>
            ) : (
              <>
                {step === 0 && (
                  <div className="space-y-8">
                    <fieldset>
                      <legend className="text-xl font-semibold">Čo potrebuješ?</legend>
                      <div className="mt-5 flex flex-wrap gap-3">
                        {serviceOptions.map((o) => (
                          <Button
                            key={o}
                            variant={service === o ? "hero" : "soft"}
                            size="xl"
                            onClick={() => resetService(o)}
                          >
                            {o}
                          </Button>
                        ))}
                      </div>
                    </fieldset>

                    {packages.length > 0 && (
                      <fieldset>
                        <legend className="text-lg font-semibold">
                          {isEshop ? "Balík" : "Vyber si balík"}
                        </legend>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {packages.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setPkgId(p.id)}
                              className={
                                pkgId === p.id
                                  ? "rounded-2xl border-2 border-primary bg-cream p-5 text-left shadow-soft"
                                  : "rounded-2xl border border-border bg-card p-5 text-left transition-shadow hover:shadow-soft"
                              }
                            >
                              <span className="block font-semibold">{p.title}</span>
                              <span className="mt-1 block text-sm text-muted-foreground">
                                {p.note}
                              </span>
                              <span className="mt-3 block text-sm font-semibold">
                                cena od {p.price} €
                              </span>
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    )}

                    {showAddons && addons.length > 0 && (
                      <fieldset>
                        <legend className="text-lg font-semibold">Doplnkové moduly</legend>
                        <div className="mt-4 space-y-3">
                          {addons.map((a) => (
                            <label
                              key={a.id}
                              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4"
                            >
                              <Checkbox
                                checked={addonIds.includes(a.id)}
                                onCheckedChange={() => toggleAddon(a.id)}
                                className="mt-0.5"
                              />
                              <span className="text-sm">
                                <span className="font-medium">{a.title}</span> – +{a.price} €
                                {a.recommended && (
                                  <span className="ml-2 rounded-full bg-cream px-2 py-0.5 text-xs font-medium">
                                    odporúčané
                                  </span>
                                )}
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    )}

                    {hasCalculator && selectedPkg && (
                      <div className="rounded-2xl bg-cream p-5">
                        <p className="text-sm text-muted-foreground">Priebežná cena</p>
                        <p className="mt-1 text-2xl font-bold">od {total} €</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {selectedPkg.title} ({selectedPkg.price} €)
                          {addons
                            .filter((a) => addonIds.includes(a.id))
                            .map((a) => ` + ${a.title} (${a.price} €)`)
                            .join("")}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h3 className="text-xl font-semibold">Aká je tvoja predstava?</h3>
                    <Textarea
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      rows={6}
                      placeholder="Napr. potrebujem web pre kaviareň s menu a fotkami interiéru…"
                      className="mt-5 rounded-2xl"
                    />
                  </div>
                )}

                {step === 2 && (
                  <fieldset>
                    <legend className="text-xl font-semibold">Aký rozpočet zvažuješ?</legend>
                    {hasCalculator && selectedPkg && (
                      <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm font-medium">
                        Predpokladaný rozpočet pre Váš {isEshop ? "E-shop" : "web"} je: {total} €
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap gap-3">
                      {budgetOptions.map((o) => (
                        <Button
                          key={o}
                          variant={budget === o ? "hero" : "soft"}
                          size="xl"
                          onClick={() => setBudget(o)}
                        >
                          {o}
                        </Button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 3 && (
                  <div>
                    <h3 className="text-xl font-semibold">Kontakt</h3>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Meno"
                        className="h-12 rounded-2xl"
                      />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        className="h-12 rounded-2xl"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between gap-3">
                  <Button
                    variant="soft"
                    size="xl"
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                  >
                    <ArrowLeft className="size-4" /> Späť
                  </Button>
                  <Button variant="hero" size="xl" onClick={next} disabled={!canContinue || sending}>
                    {step === 3 ? (sending ? "Odosielam…" : "Odoslať dopyt") : "Pokračovať"}{" "}
                    <ArrowRight className="size-4" />
                  </Button>

                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

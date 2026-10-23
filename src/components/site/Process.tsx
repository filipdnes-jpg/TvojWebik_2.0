import mascot from "@/assets/mascot.png";

const steps = [
  { n: "01", title: "Dopyt", text: "Vyplníte krátky brief, Webík sa vás na všetko spýta." },
  { n: "02", title: "Návrh", text: "Do 3 dní posielame vizuálny návrh a cenovú ponuku." },
  { n: "03", title: "Vývoj", text: "Programujeme, plníme obsahom a ladíme rýchlosť." },
  { n: "04", title: "Spustenie", text: "Web ide online, vy dostanete návod aj podporu." },
];

export function Process() {
  return (
    <section id="ako-to-funguje" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
      <h2 className="text-3xl font-bold sm:text-4xl">Ako to funguje</h2>
      <p className="mt-3 text-muted-foreground">Štyri kroky od nápadu k spustenému webu.</p>

      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <img
                src={mascot}
                alt="Maskot Webík"
                loading="lazy"
                width={1024}
                height={1024}
                className="size-10 object-contain"
              />
              <span className="font-display text-2xl font-bold text-primary">{s.n}</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

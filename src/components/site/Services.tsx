import { LayoutTemplate, ShoppingCart, Rocket } from "lucide-react";

const services = [
  {
    icon: LayoutTemplate,
    title: "Webstránky na mieru",
    text: "Prezentačné weby, ktoré rýchlo načítavajú a prinášajú dopyty.",
  },
  {
    icon: ShoppingCart,
    title: "E-shopy",
    text: "Predaj online s platbami, dopravou a jednoduchou správou produktov.",
  },
  {
    icon: Rocket,
    title: "Logá & grafika",
    text: "Tvorba vizuálnej identity, reklamných bannerov a atraktívneho obsahu pre sociálne siete.",
  },
];

export function Services() {
  return (
    <section id="sluzby" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
      <h2 className="text-3xl font-bold sm:text-4xl">Čo pre vás vieme postaviť</h2>
      <p className="mt-3 text-muted-foreground">
        Od jednoduchej vizitky až po e-shop s tisíckami produktov.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <article
            key={s.title}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-cream text-accent-foreground">
              <s.icon className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

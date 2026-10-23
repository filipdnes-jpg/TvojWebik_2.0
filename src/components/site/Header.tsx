import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/logo.png";

const links = [
  { href: "#sluzby", label: "Služby" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#ako-to-funguje", label: "Ako to funguje" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2.5 font-display text-lg font-semibold">
          <img
            src={logoAsset}
            alt="Tvoj Webík logo"
            width={36}
            height={36}
            className="size-9 rounded-full object-cover"
          />
          Tvoj Webík
        </a>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>

        <Button asChild variant="hero" size="sm">
          <a href="#brief">Nezáväzný dopyt</a>
        </Button>
      </div>
    </header>
  );
}

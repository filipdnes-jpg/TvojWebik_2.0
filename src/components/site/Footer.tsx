import { Mail, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 font-display text-lg font-semibold">
            <img
              src={logo}
              alt="Tvoj Webík logo"
              width={36}
              height={36}
              className="size-9 rounded-full object-cover"
            />
            Tvoj Webík
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Weby, e-shopy a Logá & grafika na mieru. Fixná cena, jasné termíny.
          </p>
        </div>

        <nav className="text-sm">
          <h3 className="font-semibold">Odkazy</h3>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>
              <a href="#sluzby" className="hover:text-foreground">
                Služby
              </a>
            </li>
            <li>
              <a href="#portfolio" className="hover:text-foreground">
                Portfólio
              </a>
            </li>
            <li>
              <a href="#ako-to-funguje" className="hover:text-foreground">
                Ako to funguje
              </a>
            </li>
            <li>
              <a href="#brief" className="hover:text-foreground">
                Nezáväzný dopyt
              </a>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <h3 className="font-semibold">Kontakt</h3>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li className="inline-flex items-center gap-2">
              <Mail className="size-4 text-primary" /> potrebujes@tvojwebik.sk
            </li>
            <li className="inline-flex items-center gap-2">
              <Phone className="size-4 text-primary" /> +421 940 120 339
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Tvoj Webík. Všetky práva vyhradené.
      </div>
    </footer>
  );
}

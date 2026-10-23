import { useState } from "react";
import { ArrowUpRight, Images, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import abInterier from "@/assets/ab-interier.png";
import saethii from "@/assets/saethii.png";
import grafika1 from "@/assets/grafika-1.png";
import grafika2 from "@/assets/grafika-2.png";
import grafika3 from "@/assets/grafika-3.png";

const albums = [
  {
    title: "LOGO",
    photos: [
      { src: abInterier, title: "AB interiér" },
      { src: saethii, title: "Saethii – vizuálna identita" },
    ],
  },
  {
    title: "Marketingová grafika",
    photos: [
      { src: grafika1, title: "Marketingová grafika1" },
      { src: grafika2, title: "Marketingová grafika2" },
      { src: grafika3, title: "Marketingová grafika3" },
    ],
  },
];

export function Portfolio() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);

  return (
    <section id="portfolio" className="scroll-mt-20 bg-warm py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-3xl font-bold sm:text-4xl">Naše posledné projekty</h2>
        <p className="mt-3 text-muted-foreground">
          Weby a grafika, ktoré už dnes pracujú pre svojich majiteľov.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <a
            href="https://zeppa-web.vercel.app/"
            target="_blank"
            rel="noreferrer noopener"
            className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-7 shadow-soft transition-shadow hover:shadow-lift"
          >
            <div>
              <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-accent-foreground">
                WEB
              </span>
              <h3 className="mt-5 text-xl font-semibold">ZEPPA</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Moderná prezentácia pre elektroinštalačnú firmu so zameraním na ponuku služieb a
                jednoduchý kontakt.
              </p>
            </div>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Otvoriť web <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5" />
            </span>
          </a>

          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-7 text-left shadow-soft transition-shadow hover:shadow-lift"
          >
            <div>
              <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-accent-foreground">
                Logá & grafika
              </span>
              <h3 className="mt-5 text-xl font-semibold">Vizuálna identita a grafika</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Logá, vizuálne identity a marketingová grafika pre sociálne siete a reklamu.
              </p>
            </div>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Otvoriť galériu <Images className="size-4" />
            </span>
          </button>
        </div>
      </div>

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle>Logá & grafika</DialogTitle>
            <DialogDescription>Galéria našich vizuálnych prác.</DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            {albums.map((album) => (
              <div key={album.title}>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {album.title}
                </h4>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {album.photos.map((photo) => (
                    <button
                      key={photo.title}
                      type="button"
                      onClick={() => setLightbox(photo)}
                      className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
                    >
                      <img
                        src={photo.src}
                        alt={photo.title}
                        loading="lazy"
                        className="aspect-square w-full bg-muted object-contain"
                      />
                      <span className="block px-3 py-2 text-xs text-muted-foreground">
                        {photo.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {lightbox && (
        <div
          role="dialog"
          aria-label={lightbox.title}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/80 p-6"
        >
          <button
            type="button"
            aria-label="Zavrieť"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 rounded-full bg-card p-2 text-foreground shadow-lift"
          >
            <X className="size-5" />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.title}
            className="max-h-[85vh] w-auto rounded-2xl object-contain"
          />
        </div>
      )}
    </section>
  );
}

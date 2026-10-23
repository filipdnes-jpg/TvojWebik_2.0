import { createFileRoute } from "@tanstack/react-router";
const title = "Tvoj Webík – weby a e-shopy na mieru do 2 týždňov";
const description =
  "Moderné webstránky, e-shopy a grafika s fixnou cenou. Maskot Webík vás prevedie krátkym briefom a do 3 dní posielame návrh.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  // Nový vzhľad webu je samostatná stránka v public/webik.html (volá /api/chat a /api/brief).
  return (
    <iframe
      src="/webik.html"
      title="Tvoj Webík"
      className="fixed inset-0 h-full w-full border-0 bg-[#03041a]"
    />
  );
}

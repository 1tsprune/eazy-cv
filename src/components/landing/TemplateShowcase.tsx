import { themeColors } from "@/lib/colors";
import Link from "next/link";

const templates = [
  {
    id: "elegant",
    name: "Elegant",
    desc: "Border accent & tag skills — klasik tapi modern",
    color: "indigo" as const,
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Tipografi besar, whitespace luas — clean & premium",
    color: "slate" as const,
  },
  {
    id: "professional",
    name: "Professional",
    desc: "Sidebar berwarna — ideal untuk tech & corporate",
    color: "emerald" as const,
  },
  {
    id: "executive",
    name: "Executive",
    desc: "Header bold full-width — untuk posisi senior",
    color: "violet" as const,
  },
  {
    id: "creative",
    name: "Creative",
    desc: "Top bar berwarna & skill pills — untuk kreatif & startup",
    color: "rose" as const,
  },
  {
    id: "compact",
    name: "Compact",
    desc: "Layout padat — muat lebih banyak dalam 1 halaman",
    color: "slate" as const,
  },
  {
    id: "academic",
    name: "Academic",
    desc: "Formal & education-first — untuk riset & akademisi",
    color: "amber" as const,
  },
];

export function TemplateShowcase() {
  return (
    <section className="bg-zinc-950 py-24 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            7 Template · 6 Tema Warna
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Pilih Gaya CV Kamu
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-400">
            Setiap template dirancang untuk industri berbeda. Switch template &
            warna secara real-time di builder.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((t) => {
            const c = themeColors[t.color];
            return (
              <div
                key={t.id}
                className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:border-zinc-600 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="p-4">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white p-3 shadow-inner">
                    {t.id === "professional" ? (
                      <div className="flex h-full">
                        <div
                          className="w-1/3 p-2 text-[6px] text-white"
                          style={{ backgroundColor: c.primary }}
                        >
                          <div className="font-bold">Nama</div>
                          <div className="mt-2 opacity-70">SKILLS</div>
                        </div>
                        <div className="flex-1 p-2">
                          <div className="mb-2 h-1 w-full rounded" style={{ backgroundColor: c.primary }} />
                          <div className="space-y-1">
                            <div className="h-1 w-full rounded bg-zinc-200" />
                            <div className="h-1 w-3/4 rounded bg-zinc-200" />
                          </div>
                        </div>
                      </div>
                    ) : t.id === "executive" ? (
                      <div>
                        <div
                          className="-mx-3 -mt-3 mb-2 p-2 text-center text-[7px] font-bold text-white"
                          style={{ backgroundColor: c.primary }}
                        >
                          NAMA LENGKAP
                        </div>
                        <div className="space-y-1">
                          <div className="h-1 w-full rounded bg-zinc-200" />
                          <div className="h-1 w-4/5 rounded bg-zinc-200" />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          className="mb-2 text-[8px] font-bold"
                          style={{ color: c.primary }}
                        >
                          Nama Lengkap
                        </div>
                        <div
                          className="mb-2 border-b-2 pb-1"
                          style={{ borderColor: c.primary }}
                        />
                        <div className="space-y-1">
                          <div className="h-1 w-full rounded bg-zinc-200" />
                          <div className="h-1 w-3/4 rounded bg-zinc-200" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t border-zinc-800 px-4 py-3">
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="mt-0.5 text-xs text-zinc-500">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/builder"
            className="inline-flex rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold transition hover:bg-indigo-500"
          >
            Coba Semua Template →
          </Link>
        </div>
      </div>
    </section>
  );
}
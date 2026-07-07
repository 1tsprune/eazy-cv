import { Check, X } from "lucide-react";
import { APP } from "@/lib/config";

const rows = [
  { feature: "Gratis tanpa login", eazycv: true, others: false },
  { feature: "100% data di browser", eazycv: true, others: false },
  { feature: "Template modern", eazycv: "7 template", others: "1-2" },
  { feature: "Simpan / muat file JSON", eazycv: true, others: false },
  { feature: "Section custom", eazycv: true, others: false },
  { feature: "Mode ATS + sanitasi", eazycv: true, others: "Terbatas" },
  { feature: "ATS Score real-time", eazycv: true, others: false },
  { feature: "Live preview", eazycv: true, others: true },
  { feature: "Konsultasi CV gratis", eazycv: true, others: false },
  { feature: "Tracking / analytics", eazycv: false, others: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true)
    return <Check className="mx-auto h-5 w-5 text-emerald-500" />;
  if (value === false)
    return <X className="mx-auto h-5 w-5 text-zinc-300" />;
  return <span className="text-sm font-medium text-zinc-700">{value}</span>;
}

export function Comparison() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
            Kenapa {APP.name}?
          </h2>
          <p className="mt-4 text-zinc-500">
            Dibanding CV builder lain, {APP.name} memberikan lebih banyak tanpa
            minta apa pun dari kamu.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-6 py-4 text-left font-medium text-zinc-500">
                  Fitur
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-bold text-white">
                    {APP.name}
                  </span>
                </th>
                <th className="px-6 py-4 text-center font-medium text-zinc-400">
                  Lainnya
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}
                >
                  <td className="px-6 py-3.5 font-medium text-zinc-800">
                    {row.feature}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <Cell value={row.eazycv} />
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <Cell value={row.others} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
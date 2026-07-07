"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SITE } from "@/lib/site";

const faqs = [
  {
    q: "Apakah Eazy CV benar-benar gratis?",
    a: "Ya, 100% gratis selamanya. Tidak ada biaya tersembunyi, tidak ada premium tier, tidak perlu login atau daftar akun.",
  },
  {
    q: "Apakah data CV saya aman?",
    a: "Sangat aman. Semua data diproses di browser kamu. Tidak ada yang dikirim ke server. Kamu bisa verifikasi sendiri lewat DevTools → Network tab.",
  },
  {
    q: "Apa bedanya mode Modern dan ATS?",
    a: "Modern menggunakan desain visual dengan template & warna kustom — cocok untuk lamaran langsung. ATS menggunakan format single-column, font Helvetica, dan sanitasi teks otomatis agar mudah dibaca mesin rekrutmen.",
  },
  {
    q: "Bagaimana cara konsultasi CV?",
    a: `Hubungi kami via WhatsApp di ${SITE.whatsappDisplay}. Kami bantu review CV, kasih saran ATS, dan strategi lamaran kerja.`,
  },
  {
    q: "Bisa pakai bahasa Inggris?",
    a: "Ya! Toggle bahasa ID/EN di toolbar builder. Section heading otomatis berubah sesuai bahasa yang dipilih.",
  },
  {
    q: "Bisa simpan CV untuk nanti?",
    a: "Data otomatis tersimpan di browser kamu. Kamu juga bisa export/import file JSON untuk backup atau pindah perangkat.",
  },
  {
    q: "Apa itu Section Custom?",
    a: "Kamu bisa tambah section sendiri seperti Volunteer Work, Publications, atau Awards. Centang 'Tampilkan di ATS' jika section tersebut relevan untuk lamaran formal.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-zinc-100 bg-white py-24">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="text-center text-3xl font-bold text-zinc-900">
          Pertanyaan Umum
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="overflow-hidden rounded-xl border border-zinc-200"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                {faq.q}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-zinc-400 transition ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="border-t border-zinc-100 px-5 py-4 text-sm leading-relaxed text-zinc-500">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
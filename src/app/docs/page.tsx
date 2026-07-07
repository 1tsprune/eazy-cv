import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SITE, whatsappUrl } from "@/lib/site";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          ← Kembali ke Home
        </Link>
        <h1 className="mt-6 text-4xl font-bold text-zinc-900">Dokumentasi</h1>
        <p className="mt-4 text-lg text-zinc-500">
          Eazy CV adalah aplikasi pembuat CV yang berjalan{" "}
          <strong>100% di browser</strong>. Tidak ada data yang dikirim ke
          server manapun.
        </p>

        <section className="mt-12 space-y-8 text-zinc-600">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Cara Kerja
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
              <li>Kamu mengisi form CV di browser. Data disimpan di React State.</li>
              <li>
                Eazy CV otomatis menyimpan ke Local Storage setiap ada perubahan.
              </li>
              <li>
                Saat download PDF, library @react-pdf/renderer membuat file
                langsung di browser tanpa server.
              </li>
              <li>
                Fitur Save/Load JSON untuk backup dan restore data CV kamu.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Mode Export PDF
            </h2>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed">
              <li>
                <strong className="text-zinc-800">Modern PDF</strong> — 7
                template (Elegant, Minimal, Professional, Executive, Creative,
                Compact, Academic) dengan 6 tema warna.
                Cocok untuk lamaran langsung ke HR atau portfolio.
              </li>
              <li>
                <strong className="text-zinc-800">ATS-Friendly PDF</strong> —
                Format single-column, font Helvetica, sanitasi teks otomatis.
                Dioptimasi untuk Applicant Tracking System.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Simpan & Backup
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              Data CV otomatis tersimpan di Local Storage browser. Untuk backup
              atau pindah perangkat, export file JSON dan import kembali kapan
              saja.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Section Custom
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              Tambah section bebas seperti Volunteer, Publications, atau Awards.
              Centang &quot;Tampilkan di ATS&quot; agar section muncul di PDF
              mode ATS.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900">ATS Score</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Fitur eksklusif Eazy CV yang tidak ada di CV builder lain. Skor
              dihitung berdasarkan kelengkapan data: nama, email, ringkasan,
              pengalaman, pendidikan, skills, dan kata kunci. Targetkan skor 80+.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Keamanan Data
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              <li>Tidak ada cookies tracking atau analytics</li>
              <li>Tidak ada login atau akun pengguna</li>
              <li>Tidak ada database atau backend</li>
              <li>Data hanya di Local Storage browser kamu</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Konsultasi CV
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              Mau konsultasi lebih soal CV, review CV kamu, atau tips strategi
              ATS? Hubungi kami via WhatsApp di{" "}
              <a
                href={whatsappUrl()}
                className="font-semibold text-emerald-600 hover:underline"
              >
                {SITE.whatsappDisplay}
              </a>
              . Gratis konsultasi awal.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900">Teknologi</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Next.js 16 · @react-pdf/renderer · Tailwind CSS · React Context ·
              Local Storage
            </p>
          </div>
        </section>
      </article>
      <Footer />
    </div>
  );
}
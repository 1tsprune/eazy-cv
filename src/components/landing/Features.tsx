import {
  CheckCircle,
  Download,
  Eye,
  Layers,
  Layout,
  GripVertical,
  MessageCircle,
  Target,
  Wand2,
} from "lucide-react";

const features = [
  {
    icon: <Layout className="h-6 w-6" />,
    title: "7 Template Modern",
    description:
      "Elegant, Minimal, Professional, Executive, Creative, Compact, Academic — dengan 6 tema warna.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "ATS Score Real-time",
    description:
      "Skor kesiapan ATS langsung ter-update. Tips spesifik + badge 'Siap Lamar' saat skor 80+.",
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: "Live Preview + Zoom",
    description:
      "Preview real-time fixed & center. Lihat persis seperti hasil PDF sebelum download.",
  },
  {
    icon: <GripVertical className="h-6 w-6" />,
    title: "Drag & Drop Urutan",
    description:
      "Atur urutan section dan item CV dengan drag. Pendidikan, pengalaman, proyek — sesuai kebutuhan kamu.",
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Section Custom",
    description:
      "Tambah section bebas: Volunteer, Publications, Awards, dll. Bisa ditampilkan di mode ATS juga.",
  },
  {
    icon: <Wand2 className="h-6 w-6" />,
    title: "Contoh CV Instan",
    description:
      "Muat contoh CV profesional sekali klik. Pelajari struktur yang benar sebelum isi data sendiri.",
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: "PDF Client-side",
    description:
      "PDF dibuat di browser. Data tidak pernah keluar dari perangkat kamu. Zero server.",
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Konsultasi CV Gratis",
    description:
      "Butuh bantuan review CV atau tips ATS? Hubungi via WhatsApp. Gratis konsultasi awal.",
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Mode ATS-Friendly",
    description:
      "Sanitasi teks otomatis, layout single-column, font Helvetica. Lolos mesin rekrutmen.",
  },
];

export function Features() {
  return (
    <section className="border-t border-zinc-100 bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
            Terbaik dari yang Pernah Ada
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-500">
            Setiap fitur dirancang untuk satu tujuan: CV kamu dilirik recruiter
            dan lolos sistem ATS.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-zinc-100 p-6 transition hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-700 group-hover:text-white">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
# Eazy CV — Claude handoff guide

> Dokumen ini mirror `AGENTS.md`. Baca section **Status terkini** sebelum coding.

---

## Project

| Item | Value |
|------|--------|
| Nama produk | **Eazy CV** (`eazycv`) |
| Repo | `https://github.com/1tsprune/eazy-cv` |
| Path kerja | `D:\codevibe\cvforge` |
| Production | `https://cv.1tsprune.com` |
| Referensi layout ATS (Prune) | `https://1tsprune.com/cv.html` |
| **Referensi utama (EZCV)** | `https://ezcv.kentuot.com` |

Static export Next.js 16 — tanpa backend. Data CV di `localStorage`.

## Dev (Windows)

```bash
cd D:\codevibe\cvforge
npm.cmd install
npm.cmd run dev
npm.cmd run build
npm.cmd run pdf:samples
```

- PowerShell: pakai `npm.cmd`, chain dengan `;` bukan `&&`.
- Compare PDF: `samples/Your Full Name_*.pdf` (EZCV) vs `samples/eazycv-output/Alex Morgan_*.pdf` (kita).

---

## Status terkini (update 2026-07-07, commit `15a38b6`)

### Sudah beres ✅

- **Template picker kini nyata** — modern mode dispatch ke `ModernResumeDocument` (7 template beda-beda: `elegant`, `minimal`, `professional`, `executive`, `creative`, `compact`, `academic`). Pilih template di menu = desain PDF berubah. Dulu `build-resume-pdf-document.tsx` selalu render satu layout EZCV → itu penyebab "pilih template kok hasil sama".
- **Layout PDF terverifikasi mirip EZCV** — ATS & Modern dibandingkan langsung dengan `samples/Your Full Name_*.pdf`. Format `perusahaan | tanggal`, tidak overflow, semua 7 template muat 1 halaman (fix `PDF_MAIN_BOTTOM_PAD` 28→16 + spacing header executive/academic + `lineHeight` nama creative).
- **Layout EZCV modern lama (`PDFResumeDocument.tsx`) DIHAPUS** — sudah tak dipakai setelah wiring. Jangan cari file ini.
- **Nav bawah tak geser** saat pindah ke tab Skor — `scrollbar-gutter: stable` di `globals.css` (dulu scrollbar hilang di tab pendek → viewport melebar → nav `fixed` recenter).

### Masih terbuka / belum diverifikasi ⚠️

1. **Preview blank di iOS/HP** — preview pakai `<PDFViewer>` = iframe PDF-viewer **native browser**. Andal di desktop, tapi bisa blank di iOS Safari / in-app browser / sebagian Chrome. **Belum ada laporan pasti dari user di device asli.** Kalau kejadian: ganti ke render **canvas pdf.js** dari blob yang sama (`react-pdf` + `public/pdf.worker.min.mjs` + `pdfjs-setup.ts` sudah tersedia, tinggal wire). JANGAN generate PDF dua kali.
2. **Font** — masih Helvetica built-in, belum embed Inter seperti EZCV. Tipografi belum 100% identik.
3. **`sectionOrder`** — urutan section masih hardcoded di PDF, belum menghormati pilihan user.

### Arsitektur PDF (single source of truth — pertahankan)

```
buildResumePdfDocument(data, config)   ← satu-satunya sumber PDF
    ├── exportMode "ats"    → ATSResumeDocument
    └── exportMode "modern" → ModernResumeDocument  (dispatch per config.template)

ResumePdfProvider
    usePDF({ document })
    → blob, url, waitForBlob, document

ResumePdfPreview
    PDFViewer { document }     ← preview
    waitForBlob() → download   ← file
```

**Jangan** buat preview HTML terpisah untuk builder. **Jangan** generate PDF dua kali dengan builder berbeda.

### EZCV reverse-engineering (dari `806.*.js`)

> Spec ini dulu dipakai untuk `PDFResumeDocument` (sudah dihapus). Simpan sebagai referensi kalau nanti mau menambah template "EZCV" ke `ModernResumeDocument`.

**Modern (`PDFResume` / component Y):**

- Font: Inter (kita: Helvetica)
- Colors: primary `#1a1a2e`, text `#333`, muted `#555`
- Page padding: 30pt
- Header: foto 64px centered, nama 18pt bold, profession 13pt, kontak centered
- Divider dashed
- Kolom: kiri 33% (summary, education, skills, languages, certs), kanan 67% (workExperience, projects)
- Experience: **company bold kiri | date kanan**, position di bawah, bullets `•`

**ATS (component J):**

- Helvetica, pageMargin 36pt
- Nama UPPERCASE centered 18pt
- Kontak: `lokasi · email · phone` baris 1, social baris 2
- Section heading border bottom 0.75pt
- Experience: company | date, position, description, bullets `•`

---

## Export modes (state saat ini)

| Mode | Preview | PDF |
|------|---------|-----|
| ATS | `ResumePdfPreview` → `PDFViewer` | `ATSResumeDocument` |
| Modern | `ResumePdfPreview` → `PDFViewer` | `ModernResumeDocument` (7 template via `config.template`) |

Legacy tidak dipakai di builder: `ResumePreview.tsx` (HTML preview lama). `PDFResumeDocument.tsx` sudah **dihapus**.

## File penting

| File | Peran |
|------|--------|
| `src/lib/build-resume-pdf-document.tsx` | Builder tunggal |
| `src/context/ResumePdfContext.tsx` | PDF state + blob |
| `src/components/builder/ResumePdfPreview.tsx` | Preview + download toolbar |
| `src/components/pdf/ModernResumeDocument.tsx` | Modern PDF — dispatch 7 template |
| `src/components/pdf/ATSResumeDocument.tsx` | ATS PDF |
| `src/components/builder/TemplatePicker.tsx` | UI pilih ATS + 7 template modern |
| `src/lib/pdf-modern-layout.ts` | Token layout modern (padding, sidebar width) |
| `src/lib/ezcv-pdf-layout.ts` | Token/helper EZCV (dipakai ATS) |
| `src/lib/pdf-download.ts` | Download + iOS share |
| `src/components/builder/PdfDownloadOverlay.tsx` | Overlay 10s |
| `src/lib/ui-i18n.ts` | Copy overlay (sudah dipendekkan) |

## App flow

`CVApp.tsx`: Coinfest popup → Welcome → Builder (`ResumePdfProvider` wraps header + workspace).

## Mobile

- Tab: Isi CV / Preview / Skor
- Download di Preview toolbar + menu Gaya (desktop)

## Konvensi

- TypeScript strict, `@/` imports
- Setelah ubah PDF: build + pdf:samples + visual compare
- `@react-pdf`: no `gap` in StyleSheet; careful with flex %

## Git

```bash
git add ...
git commit -m "fix(pdf): description"
git push origin main
```

Deploy: Vercel dari `main` → `https://cv.1tsprune.com`

## Commit relevan

- `15a38b6` — wire 7 template modern, hapus layout EZCV, fix pagination + nav
- `f56517f` — rewrite PDF EZCV + PDFViewer preview
- `0699a54` — shared blob iframe
- `c26b337` — react-pdf canvas pipeline
- `0d1c620` — iOS share

---

*Untuk detail lengkap app (Coinfest, ATS tap-to-fix, i18n, folder structure): lihat juga `AGENTS.md`.*
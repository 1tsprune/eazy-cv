# Eazy CV — Claude handoff guide

> Dokumen ini mirror `AGENTS.md` dengan penekanan pada **masalah aktif** dan konteks untuk melanjutkan fix PDF/preview. Baca section **Masalah aktif** sebelum coding.

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

## ⚠️ MASALAH AKTIF — ini yang harus kamu selesaikan

### Konteks dari user

User sudah frustrasi sejak sore: **preview ancur, download ancur, tidak mirip EZCV**. Beberapa commit sudah di-push (`f56517f` terakhir) tapi user **belum konfirmasi fix**.

### Gejala

1. Tab Preview kosong / berantakan / tidak mirip file download.
2. PDF ATS dan Modern layout rusak (teks numpuk, kolom salah, tidak seperti EZCV).
3. Harapan: **preview = download 100%** (WYSIWYG), sama seperti EZCV.

### Apa yang sudah dicoba (jangan ulang tanpa analisis)

| Pendekatan | Hasil |
|------------|-------|
| HTML `ResumePreview` + metrics | Preview ≠ PDF; diganti |
| `react-pdf` canvas + CDN worker | Preview blank (worker gagal) |
| iframe `blob:` URL | Jelek, mobile bermasalah |
| Shared blob `usePDF` + canvas | Masih komplain |
| Rewrite layout + `PDFViewer` (`f56517f`) | Build OK, **belum verified user** |

### Root cause teridentifikasi

1. **Layout PDF salah** — kolom pt fixed overflow; entry format `posisi·perusahaan` vs EZCV `perusahaan|tanggal`. Sudah rewrite di `PDFResumeDocument.tsx` / `ATSResumeDocument.tsx` tapi perlu visual QA.

2. **Template picker menipu user** — UI punya 7 template (`elegant`, `professional`, …) dengan thumbnail, tapi `build-resume-pdf-document.tsx` **selalu** pakai `PDFResumeDocument` (satu layout EZCV). `ModernResumeDocument.tsx` (7 template PDF) **tidak dipakai**.

3. **Font beda** — EZCV embed Inter (~22KB PDF modern). Kita Helvetica built-in (~5KB). Tipografi tidak identik.

4. **`sectionOrder` user diabaikan** di modern PDF — split kolom EZCV fixed (kiri: summary/edu/skills/lang/certs, kanan: exp/projects/orgs).

5. **Preview pipeline** — sekarang `PDFViewer` render `document` dari `ResumePdfContext`. Download pakai `usePDF` blob dari `document` yang sama. Secara arsitektur benar; jika masih beda, bug di timing (`loading` state) atau di browser tertentu.

6. **File legacy membingungkan agent** — `ResumePreview.tsx`, `ModernResumeDocument.tsx`, `pdf-ats-layout.ts` (metrics HTML lama) masih ada.

### Arsitektur yang BENAR (pertahankan)

```
buildResumePdfDocument(data, config)   ← satu-satunya sumber PDF
    ├── exportMode "ats"    → ATSResumeDocument
    └── exportMode "modern" → PDFResumeDocument

ResumePdfProvider
    usePDF({ document })
    → blob, url, waitForBlob, document

ResumePdfPreview
    PDFViewer { document }     ← preview
    waitForBlob() → download   ← file
```

**Jangan** buat preview HTML terpisah untuk builder. **Jangan** generate PDF dua kali dengan builder berbeda.

### Task list prioritas untuk Claude

- [ ] Jalankan app, buka `/builder`, screenshot Preview ATS + Modern
- [ ] Download PDF, buka file, bandingkan dengan preview (harus identik)
- [ ] Bandingkan dengan `samples/Your Full Name_ATS.pdf` dan `Your Full Name_CV.pdf`
- [ ] Fix layout `@react-pdf` yang masih pecah (hindari `gap`, cek `%` width, `wrap={false}` pada entry)
- [ ] Putuskan: hapus/sync 7 template UI dengan PDF, atau wire `ModernResumeDocument` kembali
- [ ] Optional: register Inter font (`public/fonts/`) seperti EZCV chunk `806.*.js`
- [ ] Test iPhone Safari: preview, download, share sheet
- [ ] Setelah fix: `npm.cmd run build`, `npm.cmd run pdf:samples`, commit, push

### EZCV reverse-engineering (dari `806.*.js`)

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
| Modern | `ResumePdfPreview` → `PDFViewer` | `PDFResumeDocument` |

Legacy tidak dipakai di builder: `ResumePreview.tsx`, `ModernResumeDocument.tsx`.

## File penting

| File | Peran |
|------|--------|
| `src/lib/build-resume-pdf-document.tsx` | Builder tunggal |
| `src/context/ResumePdfContext.tsx` | PDF state + blob |
| `src/components/builder/ResumePdfPreview.tsx` | Preview + download toolbar |
| `src/components/pdf/PDFResumeDocument.tsx` | Modern PDF |
| `src/components/pdf/ATSResumeDocument.tsx` | ATS PDF |
| `src/lib/ezcv-pdf-layout.ts` | EZCV tokens/helpers |
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

- `f56517f` — rewrite PDF EZCV + PDFViewer preview
- `0699a54` — shared blob iframe
- `c26b337` — react-pdf canvas pipeline
- `0d1c620` — iOS share

---

*Untuk detail lengkap app (Coinfest, ATS tap-to-fix, i18n, folder structure): lihat juga `AGENTS.md`.*
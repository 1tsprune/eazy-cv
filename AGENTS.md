<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Eazy CV — agent guide

Panduan untuk AI/agent yang mengedit repo ini. Baca **seluruh dokumen** sebelum mengubah PDF, preview, atau mobile download.

## Project

| Item | Value |
|------|--------|
| Nama produk | **Eazy CV** (`eazycv`) |
| Repo | `https://github.com/1tsprune/eazy-cv` |
| Path kerja | `D:\codevibe\cvforge` |
| Production | `https://cv.1tsprune.com` |
| Referensi layout ATS (Prune) | `https://1tsprune.com/cv.html` |
| Referensi utama (EZCV) | `https://ezcv.kentuot.com` |

Static export Next.js 16 — **tanpa backend**. Data CV hanya di `localStorage` browser.

## Dev environment (Windows)

- Pakai **`npm.cmd`**, bukan `npm` mentah di PowerShell (execution policy).
- Chain command di PowerShell: **`;`** bukan `&&`.
- Build wajib sebelum push: `npm.cmd run build`.
- Render PDF sample untuk bandingkan dengan EZCV: `npm.cmd run pdf:samples` → output di `samples/eazycv-output/`.

```bash
cd D:\codevibe\cvforge
npm.cmd install
npm.cmd run dev
npm.cmd run build
npm.cmd run pdf:samples
```

Referensi PDF EZCV (manual compare):

- `samples/Your Full Name_ATS.pdf`
- `samples/Your Full Name_CV.pdf`

Output kita:

- `samples/eazycv-output/Alex Morgan_ATS.pdf`
- `samples/eazycv-output/Alex Morgan_CV.pdf`

---

## ⚠️ Masalah aktif (handoff — baca ini dulu)

**Status user (Jul 2026):** Preview dan hasil download PDF masih dilaporkan **ancur** / tidak mirip EZCV, meski sudah beberapa iterasi fix.

### Gejala yang dilaporkan

1. Preview tidak tampil atau tampil berantakan.
2. File PDF hasil download tidak match preview.
3. Layout ATS & Modern tidak mirip EZCV (`ezcv.kentuot.com`).
4. User expect **preview = download 100% WYSIWYG** seperti EZCV.

### Root cause yang sudah teridentifikasi

| # | Masalah | Detail |
|---|---------|--------|
| 1 | **Banyak iterasi preview gagal** | Sudah dicoba: `react-pdf` canvas + CDN worker (blank), iframe blob URL (jelek/mobile), `PDFViewer` (commit `f56517f`). User masih belum puas — **perlu verifikasi di production + iPhone Safari**. |
| 2 | **PDF layout pernah overflow** | Kolom modern pakai width pt fixed + padding → konten keluar halaman. Sudah rewrite ke `%` width (33/67) di `PDFResumeDocument.tsx` — **belum dikonfirmasi user**. |
| 3 | **Entry format salah** | Dulu: `posisi · perusahaan`. EZCV: **perusahaan \| tanggal** (baris atas), posisi di bawah. Sudah diperbaiki di rewrite `f56517f`. |
| 4 | **Template picker ≠ PDF export** | UI masih punya **7 template modern** (`TemplatePicker`, `ModernResumeDocument.tsx`, `ResumePreview.tsx` HTML). Tapi **export modern selalu `PDFResumeDocument`** (layout EZCV tunggal). User pilih "Professional" di UI, PDF tetap layout EZCV — **mismatch UX**. |
| 5 | **Font tidak sama EZCV** | EZCV embed Inter/Roboto TTF (~22KB modern PDF). Kita pakai Helvetica built-in (~5KB). Ukuran file beda jauh; tipografi tidak identik. |
| 6 | **`sectionOrder` diabaikan sebagian** | `PDFResumeDocument` pakai split EZCV fixed: kiri = summary/education/skills/languages/certs, kanan = experience/projects/orgs. Urutan section user di form tidak sepenuhnya dihormati. |
| 7 | **ATS rewrite belum diverifikasi** | `ATSResumeDocument.tsx` ditulis ulang ikut EZCV component J (margin 36pt, nama UPPERCASE, bullet `•`). Perlu compare visual dengan `samples/Your Full Name_ATS.pdf`. |
| 8 | **iOS download** | Sudah ada share sheet via `deliverPdfBlob()` — terpisah dari masalah layout, tapi perlu retest. |

### Arsitektur PDF saat ini (commit `f56517f`)

```
ResumeContext (data + config)
    └── ResumePdfProvider
            ├── buildResumePdfDocument()  ← single source of truth
            │       ├── ATS  → ATSResumeDocument.tsx   (EZCV-style rewrite)
            │       └── Modern → PDFResumeDocument.tsx (EZCV PDFResume rewrite)
            ├── usePDF({ document }) → blob + url (download)
            └── document exposed to preview

BuilderWorkspace
    └── ResumePdfPreview
            └── PDFViewer (@react-pdf/renderer) ← render document yang SAMA
            └── download via waitForBlob() → deliverPdfBlob()
```

**Prinsip:** Preview dan download **harus** dari `buildResumePdfDocument()` yang sama. Jangan buat pipeline preview terpisah (HTML `ResumePreview` untuk builder sudah **tidak dipakai**).

### Yang harus dilakukan agent berikutnya (prioritas)

1. **Buka production / dev**, screenshot preview + download PDF — ATS dan Modern.
2. **Bandingkan side-by-side** dengan `samples/Your Full Name_*.pdf` (EZCV).
3. Jika masih ancur: debug `@react-pdf/renderer` styles — hindari `gap`, `minWidth: 0`, cek `%` width di flex.
4. **Keputusan produk:** apakah 7 template HTML tetap ada (preview visual saja) atau PDF ikut template? Saat ini **tidak sinkron**.
5. Pertimbangkan register font Inter di `public/fonts/` seperti EZCV (chunk `806.*.js` register `/fonts/Inter/...`).
6. Test **iPhone Safari**: `PDFViewer`, download overlay 10s, share sheet.
7. Jalankan `npm.cmd run pdf:samples` setelah setiap perubahan PDF.

### Commit history relevan (PDF)

| Commit | Isi |
|--------|-----|
| `f56517f` | Rewrite PDF EZCV layout + PDFViewer preview |
| `0699a54` | Shared blob, iframe preview |
| `c26b337` | react-pdf canvas, ResumePdfContext |
| `0d1c620` | iOS share + sanitize stylesheet |

---

## App flow (`/`)

Urutan render di `src/components/CVApp.tsx`:

1. **Coinfest popup** — jika `isCoinfestPromoActive()`
2. **WelcomeScreen**
3. **Builder** — `ResumePdfProvider` → `AppHeader` + `BuilderWorkspace` + `TrakteerFab`

## Export modes

| Mode | Preview (builder) | PDF export | Catatan |
|------|-------------------|------------|---------|
| **ATS** | `ResumePdfPreview` + `PDFViewer` | `ATSResumeDocument` | EZCV ATS rewrite: margin 36pt, nama UPPERCASE tengah, perusahaan \| tanggal, bullet `•` |
| **Modern** | `ResumePdfPreview` + `PDFViewer` | `PDFResumeDocument` | EZCV PDFResume: header tengah, divider, kolom 33%/67%, Helvetica |

**Legacy (tidak dipakai di builder/export):**

- `ResumePreview.tsx` — HTML/CSS preview lama (7 template + ATS metrics). Masih ada di repo, **tidak** di-mount di `BuilderWorkspace`.
- `ModernResumeDocument.tsx` — 7 template PDF lama. **Tidak** dipanggil dari `build-resume-pdf-document.tsx`.

### PDF — file penting

| File | Peran |
|------|--------|
| `src/lib/build-resume-pdf-document.tsx` | Single builder: ATS / Modern |
| `src/context/ResumePdfContext.tsx` | `usePDF`, `waitForBlob`, expose `document` |
| `src/components/builder/ResumePdfPreview.tsx` | `PDFViewer` + zoom + download overlay |
| `src/components/pdf/PDFResumeDocument.tsx` | Modern CV (EZCV layout) |
| `src/components/pdf/ATSResumeDocument.tsx` | ATS CV (EZCV layout) |
| `src/lib/ezcv-pdf-layout.ts` | Token + helper period/bullets |
| `src/lib/pdf-download.ts` | `deliverPdfBlob`, iOS share sheet |
| `src/components/builder/PdfDownloadButton.tsx` | Overlay 10s + Trakteer |
| `src/components/builder/PdfDownloadOverlay.tsx` | UI overlay download |
| `public/pdf.worker.min.mjs` | Worker lokal (untuk react-pdf canvas — saat ini preview pakai PDFViewer) |

### Download flow (EZCV-style)

- Overlay 10 detik: greeting + Trakteer + progress bar.
- Filename: `{nama}_ATS.pdf` / `{nama}_CV.pdf`
- iOS: Web Share API → "Simpan ke File"
- Copy overlay: `src/lib/ui-i18n.ts` (`downloadOverlay*` — sudah dipersingkat)

## Mobile UX

- Bottom nav: **Isi CV / Preview / Skor**
- PDF unduh: tab Preview (toolbar) + menu Gaya desktop (`PDFDownload.tsx`)
- Form tanggal: `MonthYearInput`, `DateInput` — stack vertikal di HP

## ATS tap-to-fix

- `src/lib/ats-scroll-targets.ts`
- `AtsScorePanel` — tap item gagal → scroll ke section form

## Promo Coinfest (sementara)

| File | Peran |
|------|--------|
| `src/lib/config.ts` | `COINFEST_PROMO`, `isCoinfestPromoActive()` |
| `src/components/CoinfestPopup.tsx` | Overlay promo |
| `src/components/CVApp.tsx` | Mount popup |

## i18n & copy

- UI: `src/lib/ui-i18n.ts`
- CV labels: `src/lib/i18n.ts`, `tAts()`
- **6 preset tema warna** — jangan tambah color picker kecuali diminta

## Struktur folder (ringkas)

```
src/
  app/              # /, /builder, /docs, /privacy, /ig-story-preview
  components/
    builder/        # Form, ResumePdfPreview, PDF download, ATS panel
    pdf/            # ATSResumeDocument, PDFResumeDocument (+ legacy Modern*)
  context/          # ResumeContext, ResumePdfContext, ThemeContext
  lib/              # types, storage, ATS, ezcv-pdf-layout, pdf-download
samples/            # EZCV reference PDFs + eazycv-output/
public/
  pdf.worker.min.mjs
```

## Konvensi kode

- TypeScript strict; imports `@/`, Tailwind, `"use client"` where needed
- Jangan refactor besar di luar scope
- Setelah ubah PDF: **`npm.cmd run build`** + **`npm.cmd run pdf:samples`** + bandingkan preview vs download
- `@react-pdf/renderer`: hindari `gap` di StyleSheet; prefer `%` width atau flex dengan padding; sidebar multi-page pakai `fixed` + `marginLeft` (lihat `ModernResumeDocument` legacy)

## Fitur ada tapi belum / partial

- `CompletionBar.tsx` — belum di-wire
- `LinkedInImport` — belum di builder
- 7 template modern — UI ada, PDF export tidak ikut template
- `ResumePreview.tsx` — legacy HTML preview

## Git

```bash
git add ...
git commit -m "type(scope): description"
git push origin main
```

Vercel deploy otomatis dari `main`. Production: `https://cv.1tsprune.com`.
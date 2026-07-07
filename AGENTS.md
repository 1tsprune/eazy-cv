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

## Status terkini (handoff — baca ini dulu, update 2026-07-07)

### Sudah beres ✅

| # | Item | Detail |
|---|------|--------|
| 1 | **Template picker nyata** | Modern mode dispatch ke `ModernResumeDocument` (7 template: elegant, minimal, professional, executive, creative, compact, academic). Pilih template = desain PDF berubah. Dulu selalu render satu layout EZCV → itu keluhan "pilih template kok hasil sama". |
| 2 | **Layout mirip EZCV & tak overflow** | ATS + Modern dibandingkan langsung dengan `samples/Your Full Name_*.pdf`. Format `perusahaan \| tanggal`, semua 7 template muat 1 halaman (`PDF_MAIN_BOTTOM_PAD` 28→16 + rapikan header executive/academic + `lineHeight` nama creative). |
| 3 | **Layout EZCV modern dihapus** | `PDFResumeDocument.tsx` sudah **dihapus** (tak dipakai setelah wiring). |
| 4 | **Nav bawah stabil** | `scrollbar-gutter: stable` di `globals.css` — pindah ke tab Skor (pendek) tak lagi menggeser bottom nav. |

### Masih terbuka / belum diverifikasi ⚠️

| # | Item | Detail |
|---|------|--------|
| A | **Preview blank di iOS/HP** | Preview pakai `<PDFViewer>` = iframe PDF-viewer **native browser**. Andal di desktop, bisa blank di iOS Safari / in-app browser / sebagian Chrome. **Belum ada laporan pasti dari user di device asli.** Jika kejadian: ganti ke render **canvas pdf.js** dari blob yang sama (`react-pdf` + `public/pdf.worker.min.mjs` + `pdfjs-setup.ts` sudah siap). JANGAN generate PDF dua kali. |
| B | **Font ≠ EZCV** | Masih Helvetica built-in, belum embed Inter (`public/fonts/`). Tipografi belum identik. |
| C | **`sectionOrder` diabaikan** | Urutan section masih hardcoded di tiap template PDF. |

### Arsitektur PDF (commit `15a38b6`)

```
ResumeContext (data + config)
    └── ResumePdfProvider
            ├── buildResumePdfDocument()  ← single source of truth
            │       ├── ATS    → ATSResumeDocument.tsx   (EZCV-style)
            │       └── Modern → ModernResumeDocument.tsx (dispatch per config.template)
            ├── usePDF({ document }) → blob + url (download)
            └── document exposed to preview

BuilderWorkspace
    └── ResumePdfPreview
            └── PDFViewer (@react-pdf/renderer) ← render document yang SAMA
            └── download via waitForBlob() → deliverPdfBlob()
```

**Prinsip:** Preview dan download **harus** dari `buildResumePdfDocument()` yang sama. Jangan buat pipeline preview terpisah (HTML `ResumePreview` untuk builder sudah **tidak dipakai**).

### Kalau lanjut kerja (prioritas)

1. Register font **Inter** di `public/fonts/` (via `Font.register` di `pdf-setup.ts`) biar tipografi = EZCV.
2. Kalau user lapor **preview blank di HP**: ganti `PDFViewer` → canvas pdf.js (blob yang sama).
3. Hormati `config.sectionOrder` di template modern.
4. Selalu `npm.cmd run build` + `npm.cmd run pdf:samples` + visual compare setelah ubah PDF.

### Commit history relevan (PDF)

| Commit | Isi |
|--------|-----|
| `15a38b6` | Wire 7 template modern, hapus layout EZCV, fix pagination + nav |
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
| **ATS** | `ResumePdfPreview` + `PDFViewer` | `ATSResumeDocument` | EZCV ATS: margin 36pt, nama UPPERCASE tengah, perusahaan \| tanggal, bullet `•` |
| **Modern** | `ResumePdfPreview` + `PDFViewer` | `ModernResumeDocument` (dispatch per `config.template`) | 7 template: elegant, minimal, professional (sidebar), executive (header block), creative (top-bar), compact, academic |

**Legacy (tidak dipakai di builder/export):**

- `ResumePreview.tsx` — HTML/CSS preview lama. Masih ada di repo, **tidak** di-mount di `BuilderWorkspace`.
- `PDFResumeDocument.tsx` — **sudah dihapus** (layout EZCV modern tunggal).

### PDF — file penting

| File | Peran |
|------|--------|
| `src/lib/build-resume-pdf-document.tsx` | Single builder: ATS / Modern |
| `src/context/ResumePdfContext.tsx` | `usePDF`, `waitForBlob`, expose `document` |
| `src/components/builder/ResumePdfPreview.tsx` | `PDFViewer` + zoom + download overlay |
| `src/components/pdf/ModernResumeDocument.tsx` | Modern CV — dispatch 7 template |
| `src/components/pdf/ATSResumeDocument.tsx` | ATS CV (EZCV layout) |
| `src/lib/pdf-modern-layout.ts` | Token layout modern (padding, sidebar width) |
| `src/lib/ezcv-pdf-layout.ts` | Token + helper period/bullets (dipakai ATS) |
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
    pdf/            # ATSResumeDocument, ModernResumeDocument (7 template)
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
- `@react-pdf/renderer`: hindari `gap` di StyleSheet; prefer `%` width atau flex dengan padding; sidebar multi-page pakai `fixed` + `marginLeft` (lihat template `professional` di `ModernResumeDocument`)

## Fitur ada tapi belum / partial

- `CompletionBar.tsx` — belum di-wire
- `LinkedInImport` — belum di builder
- `ResumePreview.tsx` — legacy HTML preview (tidak dipakai)
- Font Inter belum di-embed; `sectionOrder` belum dihormati di PDF

## Git

```bash
git add ...
git commit -m "type(scope): description"
git push origin main
```

Vercel deploy otomatis dari `main`. Production: `https://cv.1tsprune.com`.
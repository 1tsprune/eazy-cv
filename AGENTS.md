<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Eazy CV — agent guide

Panduan untuk AI/agent yang mengedit repo ini. Baca sebelum mengubah fitur besar (PDF, preview, mobile, promo).

## Project

| Item | Value |
|------|--------|
| Nama produk | **Eazy CV** (`eazycv`) |
| Repo | `https://github.com/1tsprune/eazy-cv` |
| Path kerja | `D:\codevibe\cvforge` |
| Production | `https://cv.1tsprune.com` |
| Referensi CV ATS (Prune) | `https://1tsprune.com/cv.html` |

Static export Next.js 16 — **tanpa backend**. Data CV hanya di `localStorage` browser.

## Dev environment (Windows)

- Pakai **`npm.cmd`**, bukan `npm` mentah di PowerShell.
- Chain command: **`;`** bukan `&&` (PowerShell lama).
- Build wajib sebelum push: `npm.cmd run build`.

```bash
cd D:\codevibe\cvforge
npm.cmd install
npm.cmd run dev
npm.cmd run build
```

## App flow (`/`)

Urutan render di `src/components/CVApp.tsx`:

1. **Coinfest popup** (overlay `fixed`, welcome tetap di belakang) — jika `isCoinfestPromoActive()`
2. **WelcomeScreen** — lowercase copy; **GRATIS** / **DILARANG** tetap caps
3. **Builder** — `AppHeader` + `BuilderWorkspace` + `TrakteerFab`

Popup Coinfest: **tiap refresh** muncul lagi (tanpa `localStorage`). Tutup = hilang sampai refresh berikutnya. Mati otomatis setelah `COINFEST_PROMO.endsAt` di `src/lib/config.ts`.

## Export modes

| Mode | Preview | PDF | Catatan |
|------|---------|-----|---------|
| **ATS** | `ResumePreview` + `getAtsPreviewMetrics` | `ATSResumeDocument` | Layout mengikuti `1tsprune.com/cv.html`: margin 12mm, exp header row (role kiri / tanggal kanan), ▸ bullets, skill 2 kolom, cert tanggal kanan |
| **Modern** | Template visual (7) | `ModernResumeDocument` | A4, padding `MODERN_PAD_PT` (18pt), Professional sidebar 32% fixed |

Layout metrics ATS: `src/lib/pdf-ats-layout.ts`. Layout modern: `src/lib/pdf-modern-layout.ts`.

### PDF — file penting

- `src/components/builder/PDFDownload.tsx` — `prepareModernPdfData()` untuk modern; `sanitizeResumeData` untuk ATS
- `src/components/pdf/ATSResumeDocument.tsx` + `ats-pdf-blocks.tsx`
- `src/components/pdf/ModernResumeDocument.tsx` + `pdf-modern-sections.tsx` + `modern-pdf-blocks.tsx`
- `src/components/pdf/pdf-contact.tsx` — link kontak **inherit warna tema**, bukan biru paksa (`CONTACT_LINK_DECORATION`)
- Preview WYSIWYG: `ResumePreview.tsx` harus selaras dengan PDF (ATS + modern row headers)

### Modern template quirks

- **Professional**: sidebar `fixed` + `PDF_SIDEBAR_WIDTH_PT` (32% A4), skills di sidebar, link putih
- **Executive / Creative**: header berwarna, kontak `linkColor="#ffffff"`
- Experience default PDF: layout **row** (`ModernPdfEntryHeader`), separator ` — `

## Mobile UX

- Bottom nav: `src/components/builder/BuilderBottomNav.tsx` — 3 tab: **Isi CV / Preview / Skor** (bukan tab Unduh)
- PDF unduh di tab **Preview** (mobile) dan menu **Gaya** (desktop)
- Form tanggal: `MonthYearInput`, `DateInput` — stack vertikal di HP

## ATS tap-to-fix

- `src/lib/ats-scroll-targets.ts` — map check id → section DOM
- `AtsScorePanel` — item gagal bisa diklik → scroll ke section form

## Promo Coinfest (sementara)

| File | Peran |
|------|--------|
| `src/lib/config.ts` | `COINFEST_PROMO`, `isCoinfestPromoActive()` |
| `src/components/CoinfestPopup.tsx` | UI overlay; compact di mobile, `md:max-w-md` di desktop |
| `src/components/CVApp.tsx` | Mount popup + welcome bersamaan |

Tiket: `https://coinfest.asia/with/EkyJanuarta`. Nonaktifkan promo: hapus/ubah `endsAt` atau conditional di `CVApp`.

## i18n & copy

- UI strings: `src/lib/ui-i18n.ts`
- CV section labels: `src/lib/i18n.ts`, `tAts()` untuk label profil CV
- Welcome / landing: lowercase kecuali penekanan yang disepakati (GRATIS, DILARANG)
- **6 preset tema warna** — jangan tambah color picker kecuali user minta

## Struktur folder (ringkas)

```
src/
  app/              # Routes: /, /docs, /privacy, /ig-story-preview
  components/
    builder/        # Form, preview, PDF download, ATS panel, bottom nav
    pdf/            # @react-pdf documents
    landing/        # Marketing sections (home embedded in CVApp flow)
  context/          # ResumeContext, ThemeContext
  lib/              # types, storage, ATS score, PDF layout, skill-groups
```

## Konvensi kode

- TypeScript strict; match gaya file sekitar (imports `@/`, Tailwind, client `"use client"` where needed)
- Jangan refactor besar di luar scope task
- Jangan commit `node_modules` / `.next`
- Setelah perubahan PDF/preview: **build + bandingkan preview vs unduhan PDF**
- `@react-pdf/renderer`: hindari `gap` di flex; sidebar jangan `flexDirection: row` % multi-page — pakai `fixed` + `marginLeft`

## Fitur ada tapi belum / partial

- `CompletionBar.tsx` — ada, belum di-wire ke UI
- `LinkedInImport` — ada, belum dipakai di builder
- Landing hero sudah menyebut 7 template + ATS

## IG story

- Private preview: `/ig-story-preview` — pakai komponen `Logo`, bukan placeholder "CV"

## Git

```bash
git add ...
git commit -m "type(scope): description"
git push origin main
```

Vercel deploy otomatis dari `main`.
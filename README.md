<p align="center">
  <img src="public/brand/logo.svg" alt="Eazy CV" width="220" />
</p>

<h1 align="center">Eazy CV</h1>

<p align="center">
  <strong>Bikin CV gratis, no ribet.</strong><br />
  Pembuat CV & surat lamaran di browser — tanpa login, tanpa upload ke server.
</p>

<p align="center">
  <a href="https://x.com/itsprune">@itsprune</a>
  ·
  <a href="https://trakteer.id/prunepruneprune/gift">Traktir ☕</a>
</p>

---

## Tentang

**Eazy CV** adalah CV builder gratis untuk siapa saja yang butuh bikin CV dengan cepat. Isi form, lihat preview langsung, cek skor ATS, download PDF — semuanya jalan di browser kamu. Data CV **tidak pernah dikirim ke server**; disimpan di `localStorage` perangkat kamu.

## Fitur

- **Tanpa login** — langsung pakai, zero friction
- **Preview real-time** — lihat hasil CV sambil ngetik
- **7 template modern** — Elegant, Minimal, Professional, Executive, Creative, Compact, Academic
- **Mode ATS** — export CV plain-text friendly untuk sistem rekrutmen
- **Skor ATS + tips** — 13 pengecekan dengan saran perbaikan (ID/EN)
- **Surat lamaran** — tab khusus cover letter + download PDF
- **Bilingual** — UI & label CV Indonesia / English
- **Dark mode** — light default, toggle gelap
- **Drag & drop** — urutkan section & item CV
- **Foto opsional** — upload foto untuk template modern
- **Backup JSON** — simpan / muat / reset data CV
- **6 tema warna** — indigo, emerald, rose, slate, amber, violet
- **Privacy-first** — data cuma di browser kamu

## Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_PDF-4-E53E3E?style=for-the-badge&logo=adobeacrobatreader&logoColor=white" alt="React PDF" />
  <img src="https://img.shields.io/badge/Lucide_Icons-React-F56565?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide" />
  <img src="https://img.shields.io/badge/Static_Export-Yes-10B981?style=for-the-badge" alt="Static Export" />
</p>

| Layer | Teknologi |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, static export) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| PDF | [@react-pdf/renderer](https://react-pdf.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Storage | Browser `localStorage` (no backend) |
| Font | [Outfit](https://fonts.google.com/specimen/Outfit) via `next/font` |

## Quick Start

### Prasyarat

- Node.js 20+
- npm

### Install & jalankan

```bash
git clone https://github.com/1tsprune/eazy-cv.git
cd eazy-cv
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Port lain? Pakai:

```bash
npm run dev:local
```

### Build production

```bash
npm run build
```

Output static ada di folder `out/` — siap di-deploy ke GitHub Pages, Cloudflare Pages, Netlify, Vercel, atau hosting static lainnya.

## Scripts

| Command | Keterangan |
|---------|------------|
| `npm run dev` | Dev server (`0.0.0.0`, cocok untuk LAN) |
| `npm run dev:local` | Dev server localhost |
| `npm run build` | Build static export → `out/` |
| `npm run start` | Serve hasil build (butuh server Node) |
| `npm run lint` | ESLint |
| `npm run icons` | Regenerate favicon & PNG dari SVG logo |

## Struktur Project

```
eazycv/
├── public/brand/          # Logo & aset brand
├── src/
│   ├── app/               # Routes (/, /builder, /docs, /privacy)
│   ├── components/        # UI, builder, PDF, landing
│   ├── context/           # Resume & theme state
│   └── lib/               # Types, storage, ATS, i18n, config
├── scripts/               # Generate favicon / icon
└── next.config.ts         # Static export config
```

## Privasi

Eazy CV **tidak** menyimpan CV kamu di server. Semua data (form CV, surat lamaran, preferensi tema) disimpan lokal di browser. Kamu bisa backup manual lewat menu **Data → Simpan JSON**.

Halaman privasi lengkap: `/privacy`

## Dukung Project

Kalau Eazy CV membantu kamu, dukungan kecil sangat dihargai:

- **Trakteer** — [trakteer.id/prunepruneprune/gift](https://trakteer.id/prunepruneprune/gift)
- **X** — [@itsprune](https://x.com/itsprune)

## Author

Dibuat dengan ☕ oleh **[Prune](https://x.com/itsprune)** ([@itsprune](https://x.com/itsprune))

---

<p align="center">
  <img src="public/brand/logo-icon.svg" alt="Eazy CV icon" width="48" />
  <br />
  <sub>Eazy CV — gratis, cepat, privat.</sub>
</p>
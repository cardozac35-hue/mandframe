# Konkani Music Mega Convention 2026 — Photo Frame Generator

A production-ready, responsive web application for the **First World Konkani Music Mega Convention 2026**, organized by **Mandd Sobhann** (3rd–15th November 2026 at Town Hall, Mangalore).

**Developed by TechHarmonix Consulting Pvt. Ltd.**

---

## 🌟 Key Features

1. **Official Event Branding & Artwork**:
   - Faithful reproduction of the official event frame badge.
   - Mandd Sobhann official logo (`https://www.manddsobhann.org/logo-transparent.png`) integrated into the header and footer.
   - Original event text, musical notes, golden ribbons, church illustration, and vinyl record artwork preserved with high-definition rendering.

2. **Circular Photo Composition Engine**:
   - High-precision 1024×1024 canvas composition with dual clipping mask.
   - Places visitor photos inside the official circular photo window (center: `512, 512`, radius: `512`).
   - `object-fit: cover` scaling ensures photographs are never stretched or distorted.
   - Foreground banner layers seamlessly above the photo, preserving event details.

3. **Interactive Photo Studio Controls**:
   - **Zoom Controls**: Smooth zoom slider and +/- buttons (0.5× to 3.0×).
   - **Pan / Repositioning**: Mouse drag and multi-touch gestures (with pinch-to-zoom support).
   - **Rotation**: 90° clockwise and counter-clockwise orientation adjustments.
   - **Reset**: Independent position reset and total edit reset.
   - **Output Styles**: Choice between Transparent Badge PNG (ideal for circular WhatsApp/social profile pictures) and Pure White background (for prints).
   - **Accent Border**: Optional circular gold rim accent.

4. **High-Resolution PNG Download**:
   - Off-screen canvas rendering at full 1024×1024 resolution.
   - Native browser download of `Konkani-Music-Convention-2026.png`.
   - Celebratory confetti on download completion.
   - Zero watermarks added to the downloaded artwork.

5. **WhatsApp Integration**:
   - Web Share API file sharing on supported mobile devices.
   - Direct WhatsApp fallback with pre-filled event invitation text and instructions.

6. **100% Client-Side Privacy**:
   - All image processing occurs strictly in the visitor's browser.
   - No photos are ever uploaded to any server or database.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run

```bash
# Navigate to project directory
cd konkani-frame-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```
Production assets are generated in the `dist/` directory, ready to deploy to any static hosting provider (Vercel, Netlify, GitHub Pages, AWS S3, Cloudflare Pages).

---

## 📁 Project Architecture

```
konkani-frame-generator/
├── public/
│   └── assets/
│       ├── event-frame-overlay.png     # Official foreground event frame overlay
│       ├── event-frame-white.jpg       # Reference frame 1 (white background)
│       ├── event-frame-placeholder.jpg # Reference frame 2 (cloud placeholder)
│       ├── mandd-sobhann-logo.png      # Official Mandd Sobhann transparent logo
│       ├── event-logo.png              # Official circular event emblem
│       └── sample-avatar.jpg           # Sample photo for instant 1-click testing
├── src/
│   ├── components/
│   │   ├── Header.tsx                  # Top navigation with Mandd Sobhann logo
│   │   ├── Hero.tsx                    # Hero banner with live frame preview
│   │   ├── HowItWorks.tsx              # 3-step user guide
│   │   ├── PhotoUploader.tsx           # Drag & drop, camera selfie, file browse
│   │   ├── FramePreview.tsx            # Interactive canvas with drag/touch/wheel
│   │   ├── PhotoControls.tsx           # Zoom slider, rotate, reset, corner toggle
│   │   ├── DownloadButton.tsx          # 1024px PNG export with confetti
│   │   ├── WhatsAppShareButton.tsx     # Web Share API & WhatsApp integration
│   │   ├── AboutEvent.tsx              # Event dates, venue, and cultural background
│   │   └── Footer.tsx                  # Mandd Sobhann & TechHarmonix credit
│   ├── utils/
│   │   ├── imageComposition.ts         # Canvas composition and export math
│   │   └── imageValidation.ts          # File size & MIME type validation
│   ├── types/
│   │   └── index.ts                    # TypeScript interfaces
│   ├── App.tsx                         # Main stateful application component
│   ├── main.tsx                        # React 19 entrypoint
│   └── index.css                       # Tailwind v4 theme styling
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📐 Frame Geometry & Calibration

- **Canvas Size**: `1024 × 1024` px
- **Photo Circle Center**: `X = 512, Y = 512`
- **Photo Circle Radius**: `512` px
- **Photo Window Depth**: y = 0 down to y ≈ 740 px (tucked cleanly under the foreground banner)
- **Foreground Overlay**: `event-frame-overlay.png` contains the opaque banner artwork and transparent photo window.

---

## 🏢 Credits

- **Event**: First World Konkani Music Mega Convention 2026
- **Organizer**: Mandd Sobhann (Town Hall, Mangalore • 3rd–15th November 2026)
- **Developer**: Developed by **TechHarmonix Consulting Pvt. Ltd.**

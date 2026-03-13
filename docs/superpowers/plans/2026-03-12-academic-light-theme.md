# Academic Light Theme Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dark lab-software theme with a clean, academic paper aesthetic using Latin Modern Roman typography, off-white backgrounds, and monochrome UI chrome while preserving data visualization colors.

**Architecture:** CSS custom properties in `globals.css` drive the entire theme — changing token values there auto-updates ~20 components. Only ~14 files need hardcoded color edits. Font loading uses `@font-face` with bundled .woff2 files, overriding Tailwind's `--font-sans` via `@theme inline`.

**Tech Stack:** Next.js 16, Tailwind CSS v4, React 19, Latin Modern Roman .woff2 fonts

**Spec:** `docs/superpowers/specs/2026-03-12-academic-theme-design.md`

---

## Chunk 1: Foundation — Fonts, Tokens, Layout

### Task 1: Download Latin Modern font files

**Files:**
- Create: `public/fonts/lmroman10-regular.woff2`
- Create: `public/fonts/lmroman10-bold.woff2`
- Create: `public/fonts/lmroman10-italic.woff2`
- Create: `public/fonts/lmmono10-regular.woff2`

- [ ] **Step 1: Create fonts directory and download .woff2 files**

Download Latin Modern Roman/Mono .woff2 files from a CDN mirror. The official source is GUST (gust.org.pl). Use curl to download each file:

```bash
mkdir -p public/fonts
# Download from CDN (e.g., fontsource, cdn.jsdelivr, or GUST mirrors)
# Files needed:
#   lmroman10-regular.woff2
#   lmroman10-bold.woff2
#   lmroman10-italic.woff2
#   lmmono10-regular.woff2
```

If CDN downloads fail, convert from OTF using a woff2 tool, or find pre-built .woff2 from the Latin Modern distribution.

- [ ] **Step 2: Verify font files exist and are valid**

```bash
ls -la public/fonts/
# Expected: 4 .woff2 files, each > 10KB
```

- [ ] **Step 3: Commit**

```bash
git add public/fonts/
git commit -m "chore: add Latin Modern Roman/Mono .woff2 font files"
```

---

### Task 2: Update globals.css — tokens, font-face, scrollbar, selection

**Files:**
- Modify: `src/app/globals.css` (entire file)

- [ ] **Step 1: Replace CSS custom property values with light palette**

In `:root`, replace all token values:

```css
:root {
  /* Background layers */
  --bg-base: #faf9f6;
  --bg-surface: #ffffff;
  --bg-elevated: #f5f4f1;
  --bg-hover: #eeedea;

  /* Borders */
  --border-subtle: #e0dfdc;
  --border-default: #cccbc8;

  /* Text */
  --text-primary: #1a1a1a;
  --text-secondary: #555555;
  --text-muted: #999999;

  /* Accents */
  --accent-primary: #2a2a2a;
  --accent-primary-hover: #000000;
  --accent-success: #16a34a;
  --accent-warning: #d97706;
  --accent-danger: #dc2626;
}
```

- [ ] **Step 2: Add @font-face declarations before @theme inline**

Insert after `@import "tailwindcss";` and before `:root`:

```css
@font-face {
  font-family: 'Latin Modern Roman';
  src: url('/fonts/lmroman10-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Latin Modern Roman';
  src: url('/fonts/lmroman10-bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Latin Modern Roman';
  src: url('/fonts/lmroman10-italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'Latin Modern Mono';
  src: url('/fonts/lmmono10-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 3: Update @theme inline font references**

Change lines 37-38 in the `@theme inline` block:

```css
@theme inline {
  /* ...existing color mappings stay the same... */
  --font-sans: 'Latin Modern Roman', Georgia, 'Times New Roman', serif;
  --font-mono: 'Latin Modern Mono', ui-monospace, monospace;
}
```

This makes Tailwind's `font-sans` utility resolve to Latin Modern Roman — the body class in `layout.tsx` picks it up automatically.

- [ ] **Step 4: Update selection highlight**

Change the `background` property inside `::selection` (line 66-69):

```css
::selection {
  background: rgba(42, 42, 42, 0.15);
  color: var(--text-primary);
}
```

- [ ] **Step 5: Update scrollbar track token**

The scrollbar track currently uses `var(--bg-base)` which will become `#faf9f6`. The spec calls for `#f5f4f1` (which is `--bg-elevated`). Change line 53 in `::-webkit-scrollbar-track`:

```css
::-webkit-scrollbar-track {
  background: var(--bg-elevated);
}
```

Range input styles all use CSS vars (`var(--bg-elevated)`, `var(--accent-primary)`, `var(--bg-surface)`) so they auto-update. No manual changes needed for range inputs.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: switch to light academic theme tokens and Latin Modern fonts"
```

---

### Task 3: Update layout.tsx — remove Geist imports

**Files:**
- Modify: `src/app/layout.tsx:1-30`

- [ ] **Step 1: Remove Geist font imports and variables**

Remove the Geist import (line 2) and both font instantiations (lines 7-15):

```tsx
// DELETE these lines:
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

- [ ] **Step 2: Update body className**

Change body className (line 30) from:
```tsx
className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-[var(--bg-base)] text-[var(--text-primary)]`}
```
to:
```tsx
className="antialiased font-sans bg-[var(--bg-base)] text-[var(--text-primary)]"
```

The `font-sans` class now resolves to Latin Modern Roman via the `@theme inline` override.

- [ ] **Step 3: Verify app loads**

```bash
npm run dev
# Open http://localhost:3000 — should see off-white background with serif font
```

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "refactor: remove Geist font imports, use Latin Modern via @theme inline"
```

---

## Chunk 2: Component Color Updates — UI Elements

### Task 4: Update Badge.tsx — light badge colors

**Files:**
- Modify: `src/components/ui/Badge.tsx:1-11`

- [ ] **Step 1: Replace TYPE_COLORS with light palette**

```tsx
const TYPE_COLORS: Record<string, string> = {
  XRD: "bg-blue-50 text-blue-800 border border-blue-200",
  AFM: "bg-green-50 text-green-800 border border-green-200",
  PFM: "bg-purple-50 text-purple-800 border border-purple-200",
  SEM: "bg-orange-50 text-orange-800 border border-orange-200",
  XRR: "bg-cyan-50 text-cyan-800 border border-cyan-200",
  Raman: "bg-rose-50 text-rose-800 border border-rose-200",
  profilometry: "bg-amber-50 text-amber-800 border border-amber-200",
  electrical: "bg-indigo-50 text-indigo-800 border border-indigo-200",
  Other: "bg-slate-100 text-slate-700 border border-slate-200",
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Badge.tsx
git commit -m "style: update badge colors for light theme"
```

---

### Task 5: Update Button.tsx — danger hover direction

**Files:**
- Modify: `src/components/ui/Button.tsx:12-13`

- [ ] **Step 1: Change danger variant hover**

Change line 13 from:
```tsx
"bg-red-600 text-white hover:bg-red-500 disabled:opacity-50",
```
to:
```tsx
"bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
```

On light backgrounds, hover should darken (red-700) rather than lighten (red-500).

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Button.tsx
git commit -m "style: darken danger button hover for light theme"
```

---

### Task 6: Update star colors across 4 files

**Files:**
- Modify: `src/components/depositions/DepositionTable.tsx:134`
- Modify: `src/components/sidebar/DepositionList.tsx:18`
- Modify: `src/components/forms/DepositionForm.tsx:55`
- Modify: `src/app/analyses/[id]/page.tsx:235`

- [ ] **Step 1: DepositionTable.tsx — change star color**

Line 134: change `text-amber-400` → `text-amber-600`

- [ ] **Step 2: DepositionList.tsx — change star color**

Line 18: change `text-amber-400` → `text-amber-500`

- [ ] **Step 3: DepositionForm.tsx — change star color**

Line 55: change `text-amber-400` → `text-amber-500`

- [ ] **Step 4: analyses/[id]/page.tsx — change star color**

Line 235: change `text-amber-400` → `text-amber-500`

- [ ] **Step 5: Commit**

```bash
git add src/components/depositions/DepositionTable.tsx \
       src/components/sidebar/DepositionList.tsx \
       src/components/forms/DepositionForm.tsx \
       src/app/analyses/\[id\]/page.tsx
git commit -m "style: adjust star rating amber tones for light background"
```

---

## Chunk 3: Component Color Updates — Visualizations & Camera

### Task 7: Update DepositionDot.tsx — stroke colors

**Files:**
- Modify: `src/components/disk/DepositionDot.tsx:34`

- [ ] **Step 1: Invert stroke colors**

Line 34: change:
```tsx
stroke={isHovered ? "#0f172a" : "#fff"}
```
to:
```tsx
stroke={isHovered ? "#ffffff" : "#1a1a1a"}
```

On a light wafer background, non-hovered dots need dark outlines (were white), and hovered dots need white outlines (were dark).

- [ ] **Step 2: Commit**

```bash
git add src/components/disk/DepositionDot.tsx
git commit -m "style: invert dot stroke colors for light disk background"
```

---

### Task 8: Update PositionIndicator.tsx — accent stroke

**Files:**
- Modify: `src/components/detail/PositionIndicator.tsx:45`

- [ ] **Step 1: Change stroke color**

Line 45: change `stroke="#4f46e5"` → `stroke="#2a2a2a"`

- [ ] **Step 2: Commit**

```bash
git add src/components/detail/PositionIndicator.tsx
git commit -m "style: update position indicator accent stroke for light theme"
```

---

### Task 9: Update ScatterPlot.tsx — chart colors

**Files:**
- Modify: `src/components/explorer/charts/ScatterPlot.tsx:55-70`

- [ ] **Step 1: Replace all hardcoded chart colors**

| Line | Old | New |
|------|-----|-----|
| 55 | `stroke="#2a2d3a"` | `stroke="#e0dfdc"` |
| 60 | `fill: "#9ba1b0"` | `fill: "#555555"` |
| 61 | `fill: "#6b7280"` | `fill: "#999999"` |
| 62 | `stroke="#363a4a"` | `stroke="#cccbc8"` |
| 68 | `fill: "#9ba1b0"` | `fill: "#555555"` |
| 69 | `fill: "#6b7280"` | `fill: "#999999"` |
| 70 | `stroke="#363a4a"` | `stroke="#cccbc8"` |

- [ ] **Step 2: Commit**

```bash
git add src/components/explorer/charts/ScatterPlot.tsx
git commit -m "style: update scatter plot axis/grid colors for light theme"
```

---

### Task 10: Update Histogram.tsx — chart and bar colors

**Files:**
- Modify: `src/components/explorer/charts/Histogram.tsx:74-102,119`

- [ ] **Step 1: Replace hardcoded chart colors**

Same axis/grid mapping as ScatterPlot:
| Line | Old | New |
|------|-----|-----|
| 74 | `stroke="#2a2d3a"` | `stroke="#e0dfdc"` |
| 82 | `fill: "#9ba1b0"` | `fill: "#555555"` |
| 84 | `fill: "#6b7280"` | `fill: "#999999"` |
| 89 | `stroke="#363a4a"` | `stroke="#cccbc8"` |
| 98 | `fill: "#9ba1b0"` | `fill: "#555555"` |
| 100 | `fill: "#6b7280"` | `fill: "#999999"` |
| 102 | `stroke="#363a4a"` | `stroke="#cccbc8"` |

- [ ] **Step 2: Change bar fill color**

Line 119: change `fill="#6366f1"` → `fill="#2a2a2a"`

- [ ] **Step 3: Commit**

```bash
git add src/components/explorer/charts/Histogram.tsx
git commit -m "style: update histogram colors for light theme"
```

---

### Task 11: Update colors.ts — GRAY constant

**Files:**
- Modify: `src/lib/utils/colors.ts:17`

- [ ] **Step 1: Update GRAY**

Line 17: change `const GRAY = "#94a3b8"` → `const GRAY = "#9ca3af"`

- [ ] **Step 2: Commit**

```bash
git add src/lib/utils/colors.ts
git commit -m "style: adjust GRAY constant for light background visibility"
```

---

### Task 12: Update Camera components — StatusBadge + CameraView

**Files:**
- Modify: `src/components/camera/StatusBadge.tsx:3-7`
- Modify: `src/components/camera/CameraView.tsx:96,101,126`

- [ ] **Step 1: Update StatusBadge colors**

Change `STATUS_CONFIG` (lines 3-8):

```tsx
const STATUS_CONFIG: Record<CameraStatus, { color: string; bg: string; label: string }> = {
  connected: { color: "text-emerald-600", bg: "bg-emerald-600", label: "Connected" },
  connecting: { color: "text-amber-600", bg: "bg-amber-600", label: "Connecting" },
  disconnected: { color: "text-[var(--text-muted)]", bg: "bg-[var(--text-muted)]", label: "Disconnected" },
  error: { color: "text-red-600", bg: "bg-red-600", label: "Unavailable" },
};
```

- [ ] **Step 2: Update CameraView error colors**

Line 96: change `text-red-400` → `text-red-600`
Line 101: change `text-red-400/70` → `text-red-600/70`

- [ ] **Step 3: Update CameraView capture button**

Line 126: change `bg-emerald-600 text-white hover:bg-emerald-500` → `bg-emerald-700 text-white hover:bg-emerald-600`

- [ ] **Step 4: Commit**

```bash
git add src/components/camera/StatusBadge.tsx src/components/camera/CameraView.tsx
git commit -m "style: update camera component colors for light theme"
```

---

## Chunk 4: Final Verification

### Task 13: Visual verification

- [ ] **Step 1: Run dev server and check all pages**

```bash
npm run dev
```

Check each page visually:
- `/` — Dashboard: off-white background, serif font, color mode bar fully visible
- `/depositions/[id]` — Detail view: white cards, dark text, disk has dark dot outlines
- `/explorer` — Charts: light grid lines, dark axis labels, dark histogram bars
- `/camera` — Dark video container, green capture button, status badges readable
- `/analyses` — Badges have light backgrounds with dark text and borders

- [ ] **Step 2: Verify no remaining dark-theme artifacts**

```bash
# Search for any remaining dark-specific colors that may have been missed
grep -rn "#0f1117\|#1a1d27\|#242736\|#6366f1\|#818cf8" src/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Expected: only `globals.css` comment references (if any) and data visualization colors in `colors.ts`.

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: builds without errors.

- [ ] **Step 4: Final commit if any fixups needed**

```bash
# Only if Step 2 found issues that needed fixing
git add -A
git commit -m "fix: clean up remaining dark theme artifacts"
```

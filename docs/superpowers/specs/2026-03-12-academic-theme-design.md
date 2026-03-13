# PLD Tracker — Academic Light Theme

## Overview

Replace the current dark-neutral lab-software theme with a clean, academic paper aesthetic using Latin Modern Roman (the LaTeX typeface), off-white backgrounds, and restrained use of color. Data visualization colors (disk map, charts) are preserved; all UI chrome becomes monochrome.

## Design Decisions

- **Typography:** Latin Modern Roman (bundled .woff2), with Georgia serif fallback
- **Surface treatment:** Off-white base (`#faf9f6`), white cards, subtle 4px border-radius
- **Color philosophy:** Data colors preserved for visualizations; all chrome is black/gray/white
- **Accent color:** Black (`#2a2a2a`) for interactive elements instead of indigo
- **Font loading:** `@font-face` with Latin Modern Roman Regular, Bold, Italic bundled in `public/fonts/`

## Token Palette

### globals.css — CSS Custom Properties

| Token | Current (dark) | New (light) |
|-------|---------------|-------------|
| `--bg-base` | `#0f1117` | `#faf9f6` |
| `--bg-surface` | `#1a1d27` | `#ffffff` |
| `--bg-elevated` | `#242736` | `#f5f4f1` |
| `--bg-hover` | `#2a2d3a` | `#eeedea` |
| `--border-subtle` | `#2a2d3a` | `#e0dfdc` |
| `--border-default` | `#363a4a` | `#cccbc8` |
| `--text-primary` | `#e8eaed` | `#1a1a1a` |
| `--text-secondary` | `#9ba1b0` | `#555555` |
| `--text-muted` | `#6b7280` | `#999999` |
| `--accent-primary` | `#6366f1` | `#2a2a2a` |
| `--accent-primary-hover` | `#818cf8` | `#000000` |
| `--accent-success` | `#22c55e` | `#16a34a` |
| `--accent-warning` | `#f59e0b` | `#d97706` |
| `--accent-danger` | `#ef4444` | `#dc2626` |

### Font Stack

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

--font-serif: 'Latin Modern Roman', Georgia, 'Times New Roman', serif;
--font-mono: 'Latin Modern Mono', 'Geist Mono', ui-monospace, monospace;
```

Body and headings use `--font-serif`. Tabular data, code, run IDs use `--font-mono`.

### Scrollbar & Range Input

Scrollbar track becomes `#f5f4f1`, thumb becomes `#cccbc8`. Range input track becomes `#e0dfdc`, thumb becomes `#2a2a2a` with white border. Selection highlight becomes `rgba(42, 42, 42, 0.15)`.

## Component-Level Changes

### 1. globals.css
- Replace all token values with light palette
- Add `@font-face` declarations for Latin Modern Roman + Mono
- Update `@theme inline`: change `--font-sans: var(--font-geist-sans)` → `--font-sans: 'Latin Modern Roman', Georgia, 'Times New Roman', serif`
- Update `@theme inline`: change `--font-mono: var(--font-geist-mono)` → `--font-mono: 'Latin Modern Mono', ui-monospace, monospace`
- Restyle scrollbar, range input, selection for light theme
- Note: The `@theme inline` `--font-sans` override means `font-sans` utility class in layout.tsx body automatically picks up the serif font — no class name change needed there

### 2. layout.tsx
- Remove both Geist Sans and Geist Mono imports (no longer referenced by `@theme inline`)
- Body className `font-sans` stays — it now resolves to Latin Modern Roman via the `@theme inline` override
- Toaster style props already use CSS vars — no change needed

### 3. NavBar.tsx
- Currently uses `var()` tokens — will auto-update
- The `bg-[var(--bg-surface)]/80 backdrop-blur-sm` stays but will now be white/80 with blur — looks good on light
- Note: "New Deposition" button uses `text-white` on `bg-[var(--accent-primary)]` — keep `text-white` (white text on dark button is correct for light theme)

### 4. Badge.tsx — Analysis type badges
**Current:** Dark backgrounds like `bg-blue-900/50 text-blue-300`
**New:** Light backgrounds with dark text:
| Type | Current | New |
|------|---------|-----|
| XRD | `bg-blue-900/50 text-blue-300` | `bg-blue-50 text-blue-800 border border-blue-200` |
| AFM | `bg-green-900/50 text-green-300` | `bg-green-50 text-green-800 border border-green-200` |
| PFM | `bg-purple-900/50 text-purple-300` | `bg-purple-50 text-purple-800 border border-purple-200` |
| SEM | `bg-orange-900/50 text-orange-300` | `bg-orange-50 text-orange-800 border border-orange-200` |
| XRR | `bg-cyan-900/50 text-cyan-300` | `bg-cyan-50 text-cyan-800 border border-cyan-200` |
| Raman | `bg-rose-900/50 text-rose-300` | `bg-rose-50 text-rose-800 border border-rose-200` |
| profilometry | `bg-amber-900/50 text-amber-300` | `bg-amber-50 text-amber-800 border border-amber-200` |
| electrical | `bg-indigo-900/50 text-indigo-300` | `bg-indigo-50 text-indigo-800 border border-indigo-200` |
| Other | `bg-slate-700/50 text-slate-300` | `bg-slate-100 text-slate-700 border border-slate-200` |

### 5. Button.tsx
- Primary: `bg-[var(--accent-primary)]` → will auto-become `#2a2a2a` (dark button on light bg)
- Ghost variant: uses `var()` tokens — auto-updates
- Danger: `bg-red-600 hover:bg-red-500` → `bg-red-600 hover:bg-red-700` (darken on hover for light)

### 6. DepositionDot.tsx (disk visualization)
- Hovered stroke: `#0f172a` → `#ffffff` (white outline on light wafer)
- Non-hovered stroke: `#fff` → `#1a1a1a` (dark outline on light wafer)

### 7. DiskHeatmap.tsx
- RGB interpolation values stay the same (these are data colors, preserved per design decision)
- Default fallback `rgb(148,163,184)` (slate-400) — keep as-is (data color for unknown state)

### 8. PositionIndicator.tsx
- Accent stroke `#4f46e5` → `#2a2a2a` (matches new accent)

### 9. ScatterPlot.tsx — Chart colors
| Element | Current | New |
|---------|---------|-----|
| CartesianGrid stroke | `#2a2d3a` | `#e0dfdc` |
| Axis label fill | `#9ba1b0` | `#555555` |
| Axis tick fill | `#6b7280` | `#999999` |
| Axis stroke | `#363a4a` | `#cccbc8` |

### 10. Histogram.tsx — Chart colors
Same mapping as ScatterPlot, plus:
- Bar fill: `#6366f1` → `#2a2a2a`

### 11. DepositionTable.tsx
- `text-amber-400` stars → `text-amber-600` (darker amber for light bg)

### 12. DepositionList.tsx (sidebar)
- Star SVG `text-amber-400` → `text-amber-500`
- Star empty `text-[var(--border-subtle)]` — auto-updates

### 13. DepositionForm.tsx
- Star rating `text-amber-400` → `text-amber-500`

### 14. ImageGallery.tsx
- `from-black/60` gradient → keep (dark overlay on images is correct for readability)

### 15. Lightbox.tsx
- `bg-black/90` overlay → keep (lightbox overlays should be dark regardless of theme)
- `text-white` elements inside lightbox → keep (white text on dark overlay is correct)
- `text-amber-400/80` highlight note → keep (displayed on dark overlay, amber is appropriate)

### 16. ScaleBadge.tsx
- `bg-black/60 text-white` → keep (badge overlaid on images needs dark bg for contrast)

### 17. Camera components
- CameraView: `bg-black` video container → keep (camera feed bg should be black)
- CameraView: `bg-emerald-600` capture button → `bg-emerald-700 hover:bg-emerald-600`
- CameraView: `text-red-400` error → `text-red-600`, `text-red-400/70` subtext → `text-red-600/70`
- CaptureCard: `bg-black` preview → keep
- CaptureCard: `bg-black/60` delete button → keep (overlaid on image)
- StatusBadge: `text-emerald-400` → `text-emerald-600`, `bg-emerald-400` → `bg-emerald-600`
- StatusBadge: `text-amber-400` → `text-amber-600`, `bg-amber-400` → `bg-amber-600`
- StatusBadge: `text-red-400` → `text-red-600`, `bg-red-400` → `bg-red-600`

### 18. DiskLegend.tsx
- Quality legend colors: keep (data colors)
- Material legend colors: keep (data colors)
- GradientBar: passed as props from DiskLegend — keep as-is

### 19. colors.ts
- `GRAY` constant `#94a3b8` → `#9ca3af` (slightly adjusted for light bg visibility)
- Material/quality color arrays: keep (data colors)

### 20. analyses/[id]/page.tsx
- Star colors `text-amber-400` → `text-amber-500`

## Font Files

Download Latin Modern Roman .woff2 files from GUST (the official source) and place in `public/fonts/`:
- `lmroman10-regular.woff2`
- `lmroman10-bold.woff2`
- `lmroman10-italic.woff2`
- `lmmono10-regular.woff2`

Source: https://www.gust.org.pl/projects/e-foundry/latin-modern or CDN mirrors.

## Files Changed (complete list)

1. `public/fonts/` — new directory with 4 .woff2 files
2. `src/app/globals.css` — token values, font-face, scrollbar, range input
3. `src/app/layout.tsx` — font imports
4. `src/components/ui/Badge.tsx` — light badge colors
5. `src/components/ui/Button.tsx` — danger hover direction
6. `src/components/disk/DepositionDot.tsx` — stroke colors inverted
7. `src/components/detail/PositionIndicator.tsx` — accent stroke
8. `src/components/explorer/charts/ScatterPlot.tsx` — chart axis/grid colors
9. `src/components/explorer/charts/Histogram.tsx` — chart axis/grid/bar colors
10. `src/components/depositions/DepositionTable.tsx` — star color
11. `src/components/sidebar/DepositionList.tsx` — star color
12. `src/components/forms/DepositionForm.tsx` — star color
13. `src/components/camera/CameraView.tsx` — button/status colors
14. `src/components/camera/StatusBadge.tsx` — status indicator colors
15. `src/lib/utils/colors.ts` — GRAY constant
16. `src/app/analyses/[id]/page.tsx` — star color

**Files NOT changed** (use CSS vars, auto-update):
- NavBar.tsx, Dashboard.tsx, DiskVisualization.tsx, DiskTooltip.tsx, DiskLegend.tsx, DiskHeatmap.tsx, DepositionDetail.tsx, DepositionFilters.tsx, SearchBar.tsx, AnalysisListView.tsx, AnalysisUpload.tsx, AnalysisCard.tsx, QuickMetrics.tsx, Card.tsx, Input.tsx, Select.tsx, RangeInput.tsx, CaptureCard.tsx (mostly), all page.tsx server components

**Files kept dark intentionally:**
- Lightbox.tsx (dark overlay for image viewing)
- ScaleBadge.tsx (dark badge overlaid on images)
- ImageGallery.tsx (dark gradient overlay on image hover)
- Camera video containers (black background for camera feed)

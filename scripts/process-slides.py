"""
Process slide deck images: rotate 90 CW and crop individual panels.

Slide layout (after 90 CW rotation to landscape 2200x1700):
- Title bar at top: "PFM/XRD Data: AORLXX (5%@LBFO/DSO)"
- Orange separator line below title
- Berkeley bar at bottom
- Content panels in center

6-panel pages (2, 4, 5, 7, 9, 11, 12, 13, 14):
  Layout: 2 rows x 3 columns
  Col 1: AFM Topography | Col 2: PFM Amplitude | Col 3: PFM Phase
  Row 1: large scan size | Row 2: zoomed scan size

3-panel pages (3, 6, 8):
  Layout: 1 row x 3 columns
  Col 1: AFM Topography | Col 2: PFM Amplitude | Col 3: PFM Phase

XRD page (10): single theta-2theta plot
"""

import os
from PIL import Image

SRC_DIR = r"c:\Dev\pldtracker\public\analysis-slides"
OUT_DIR = r"c:\Dev\pldtracker\public\analysis"

PAGE_MAP = {
    2: "AORL45", 3: "AORL45",
    4: "AORL46",
    5: "AORL47", 6: "AORL47",
    7: "AORL48",
    8: "AORL49",
    9: "AORL55", 10: "AORL55",
    11: "AORL56",
    12: "AORL57",
    13: "PGRL419",
    14: "AORL58",
}

SIX_PANEL_PAGES = {2, 4, 5, 7, 9, 11, 12, 13, 14}
THREE_PANEL_PAGES = {3, 6, 8}
XRD_PAGES = {10}

# Labels for 2-row x 3-col grid (row-major: row0 left-to-right, then row1)
SIX_PANEL_LABELS = [
    ("AFM Topography", "AFM"),
    ("PFM Amplitude", "PFM"),
    ("PFM Phase", "PFM"),
    ("AFM Topography (zoomed)", "AFM"),
    ("PFM Amplitude (zoomed)", "PFM"),
    ("PFM Phase (zoomed)", "PFM"),
]

THREE_PANEL_LABELS = [
    ("AFM Topography", "AFM"),
    ("PFM Amplitude", "PFM"),
    ("PFM Phase", "PFM"),
]


def rotate_image(src_path):
    img = Image.open(src_path)
    return img.rotate(-90, expand=True)


def auto_trim(img, bg_threshold=245, min_margin=4):
    """Trim whitespace around content. Keeps a small margin."""
    import numpy as np
    arr = np.array(img.convert("RGB"))
    # Mask: pixel is "content" if any channel < threshold
    mask = np.any(arr < bg_threshold, axis=2)
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    if not rows.any() or not cols.any():
        return img
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    # Add margin
    h, w = arr.shape[:2]
    rmin = max(0, rmin - min_margin)
    rmax = min(h - 1, rmax + min_margin)
    cmin = max(0, cmin - min_margin)
    cmax = min(w - 1, cmax + min_margin)
    return img.crop((cmin, rmin, cmax + 1, rmax + 1))


def crop_panels_6(img):
    """Crop 6 panels from 2-row x 3-col layout using explicit boundaries."""
    w, h = img.size  # ~2200 x 1700

    # Pixel-calibrated boundaries for Berkeley PFM slide template (2200x1700).
    # Measured from AORL55 page-9 rotated image.
    # Title at top (~y=90), orange line (~y=180), Berkeley bar at bottom (~y=1357).
    # No right sidebar — Berkeley bar is horizontal at bottom.
    col_bounds = [
        (0.007, 0.252),  # Col 0: AFM topography + colorbar (x=15-555)
        (0.264, 0.511),  # Col 1: PFM amplitude + colorbar (x=580-1125)
        (0.520, 0.764),  # Col 2: PFM phase + colorbar (x=1145-1680)
    ]
    row_bounds = [
        (0.112, 0.424),  # Row 0: large scan (y=190-720)
        (0.435, 0.791),  # Row 1: zoomed scan (y=740-1345)
    ]

    panels = []
    for ri, (ry1, ry2) in enumerate(row_bounds):
        for ci, (cx1, cx2) in enumerate(col_bounds):
            x1 = int(w * cx1)
            y1 = int(h * ry1)
            x2 = int(w * cx2)
            y2 = int(h * ry2)
            panel = auto_trim(img.crop((x1, y1, x2, y2)))
            idx = ri * 3 + ci
            label, atype = SIX_PANEL_LABELS[idx]
            panels.append((panel, label, atype))

    return panels


def crop_panels_3(img):
    """Crop 3 panels from 1-row x 3-col layout (continuation slides)."""
    w, h = img.size

    col_bounds = [
        (0.007, 0.252),
        (0.264, 0.511),
        (0.520, 0.764),
    ]
    # Single row of panels in upper half
    ry1, ry2 = 0.112, 0.55

    panels = []
    for ci, (cx1, cx2) in enumerate(col_bounds):
        x1 = int(w * cx1)
        y1 = int(h * ry1)
        x2 = int(w * cx2)
        y2 = int(h * ry2)
        panel = auto_trim(img.crop((x1, y1, x2, y2)))
        label, atype = THREE_PANEL_LABELS[ci]
        panels.append((panel, label, atype))

    return panels


def process_page(page_num):
    src_path = os.path.join(SRC_DIR, f"page-{page_num}.png")
    if not os.path.exists(src_path):
        print(f"  SKIP: {src_path} not found")
        return []

    sample = PAGE_MAP[page_num]
    sample_dir = os.path.join(OUT_DIR, sample)
    os.makedirs(sample_dir, exist_ok=True)

    rotated = rotate_image(src_path)

    # Save rotated full page
    full_path = os.path.join(sample_dir, f"page-{page_num}.png")
    rotated.save(full_path, optimize=True)
    print(f"  Full page: {rotated.size[0]}x{rotated.size[1]}")

    results = [{
        "file": f"/analysis/{sample}/page-{page_num}.png",
        "label": "Full page",
        "type": "full_page",
        "analysis_type": None,
    }]

    if page_num in SIX_PANEL_PAGES:
        panels = crop_panels_6(rotated)
    elif page_num in THREE_PANEL_PAGES:
        panels = crop_panels_3(rotated)
    elif page_num in XRD_PAGES:
        # XRD: crop the plot area
        w, h = rotated.size
        plot = rotated.crop((int(w * 0.08), int(h * 0.06), int(w * 0.93), int(h * 0.88)))
        fname = f"page-{page_num}-xrd.png"
        plot.save(os.path.join(sample_dir, fname), optimize=True)
        print(f"  XRD: {plot.size[0]}x{plot.size[1]}")
        results.append({
            "file": f"/analysis/{sample}/{fname}",
            "label": "XRD theta-2theta",
            "type": "panel",
            "analysis_type": "XRD",
            "panel_index": 1,
        })
        return results
    else:
        return results

    for i, (panel_img, label, atype) in enumerate(panels):
        fname = f"page-{page_num}-panel-{i+1}.png"
        panel_img.save(os.path.join(sample_dir, fname), optimize=True)
        print(f"  Panel {i+1}: {panel_img.size[0]}x{panel_img.size[1]} - {label}")
        results.append({
            "file": f"/analysis/{sample}/{fname}",
            "label": label,
            "type": "panel",
            "analysis_type": atype,
            "panel_index": i + 1,
        })

    return results


def main():
    print("Processing slide deck images...\n")

    all_results = {}
    for page_num in sorted(PAGE_MAP.keys()):
        sample = PAGE_MAP[page_num]
        print(f"Page {page_num} -> {sample}:")
        results = process_page(page_num)
        if sample not in all_results:
            all_results[sample] = []
        all_results[sample].extend(results)

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    total = 0
    for sample in sorted(all_results.keys()):
        entries = all_results[sample]
        panels = [e for e in entries if e["type"] == "panel"]
        fulls = [e for e in entries if e["type"] == "full_page"]
        print(f"\n{sample}: {len(fulls)} full pages, {len(panels)} panels")
        for e in panels:
            print(f"  {e['file']} -> {e['label']} [{e['analysis_type']}]")
        total += len(entries)
    print(f"\nTotal: {total} files")


if __name__ == "__main__":
    main()

"""
PLD Sample Position Detector

Detects the sample position on the PLD heater stage from a USB camera image.

Usage:
    python detect_position.py                     # Live camera feed
    python detect_position.py --image photo.png   # From saved image
    python detect_position.py --calibrate         # Run calibration

Output:
    Prints x, y position in mm relative to disk center.
"""

import argparse
import json
import sys
from pathlib import Path

import cv2
import numpy as np

CALIBRATION_FILE = Path(__file__).parent / "calibration.json"
DEFAULT_PIXELS_PER_MM = 10.0  # Fallback if not calibrated


def load_calibration() -> dict:
    """Load calibration data from file."""
    if CALIBRATION_FILE.exists():
        with open(CALIBRATION_FILE) as f:
            return json.load(f)
    return {"pixels_per_mm": DEFAULT_PIXELS_PER_MM}


def detect_disk(gray: np.ndarray) -> tuple[int, int, int] | None:
    """Detect the circular heater stage boundary.

    Returns (cx, cy, radius) in pixels, or None if not found.
    """
    blurred = cv2.GaussianBlur(gray, (9, 9), 2)
    circles = cv2.HoughCircles(
        blurred,
        cv2.HOUGH_GRADIENT,
        dp=1.2,
        minDist=100,
        param1=100,
        param2=50,
        minRadius=50,
        maxRadius=500,
    )
    if circles is None:
        return None

    # Take the largest circle as the disk
    circles = np.uint16(np.around(circles[0]))
    largest = max(circles, key=lambda c: c[2])
    return int(largest[0]), int(largest[1]), int(largest[2])


def detect_sample(
    gray: np.ndarray, disk_cx: int, disk_cy: int, disk_r: int
) -> tuple[int, int] | None:
    """Detect the sample position within the disk.

    Uses edge detection and contour analysis.
    Returns (sx, sy) in pixels, or None if not found.
    """
    # Create mask for the disk area
    mask = np.zeros_like(gray)
    cv2.circle(mask, (disk_cx, disk_cy), disk_r - 5, 255, -1)
    masked = cv2.bitwise_and(gray, gray, mask=mask)

    # Edge detection
    edges = cv2.Canny(masked, 50, 150)

    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        return None

    # Filter contours by area (sample should be a reasonable size)
    valid = [c for c in contours if 100 < cv2.contourArea(c) < disk_r * disk_r]
    if not valid:
        return None

    # Take the largest valid contour
    largest = max(valid, key=cv2.contourArea)
    M = cv2.moments(largest)
    if M["m00"] == 0:
        return None

    cx = int(M["m10"] / M["m00"])
    cy = int(M["m01"] / M["m00"])
    return cx, cy


def pixel_to_mm(
    px: int,
    py: int,
    disk_cx: int,
    disk_cy: int,
    pixels_per_mm: float,
) -> dict:
    """Convert pixel coordinates to mm relative to disk center."""
    dx = (px - disk_cx) / pixels_per_mm
    dy = -(py - disk_cy) / pixels_per_mm  # Flip Y axis

    r = np.sqrt(dx**2 + dy**2)
    angle = np.degrees(np.arctan2(dy, dx))
    if angle < 0:
        angle += 360

    return {
        "x_mm": round(dx, 2),
        "y_mm": round(dy, 2),
        "r_mm": round(r, 2),
        "angle_deg": round(angle, 1),
    }


def process_image(image: np.ndarray, calibration: dict) -> dict | None:
    """Process an image and return position data."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    disk = detect_disk(gray)
    if disk is None:
        print("Error: Could not detect heater stage disk.", file=sys.stderr)
        return None

    disk_cx, disk_cy, disk_r = disk
    print(f"Disk detected: center=({disk_cx}, {disk_cy}), radius={disk_r}px")

    sample = detect_sample(gray, disk_cx, disk_cy, disk_r)
    if sample is None:
        print("Error: Could not detect sample.", file=sys.stderr)
        return None

    sx, sy = sample
    print(f"Sample detected at pixel: ({sx}, {sy})")

    result = pixel_to_mm(sx, sy, disk_cx, disk_cy, calibration["pixels_per_mm"])
    return result


def run_calibration():
    """Interactive calibration: place a reference at known distance."""
    print("Calibration mode")
    print("Place a reference object of known size on the disk.")
    print("Press 'c' to capture, 'q' to quit.")

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Cannot open camera.", file=sys.stderr)
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        cv2.imshow("Calibration - Press 'c' to capture", frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord("c"):
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            disk = detect_disk(gray)
            if disk:
                disk_cx, disk_cy, disk_r = disk
                known_mm = float(input("Enter the disk diameter in mm (e.g. 76.2): "))
                pixels_per_mm = (disk_r * 2) / known_mm
                cal = {"pixels_per_mm": round(pixels_per_mm, 4)}
                with open(CALIBRATION_FILE, "w") as f:
                    json.dump(cal, f, indent=2)
                print(f"Calibration saved: {pixels_per_mm:.4f} px/mm")
            else:
                print("Could not detect disk. Try again.")
        elif key == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


def main():
    parser = argparse.ArgumentParser(description="PLD Sample Position Detector")
    parser.add_argument("--image", type=str, help="Path to image file")
    parser.add_argument(
        "--calibrate", action="store_true", help="Run calibration mode"
    )
    args = parser.parse_args()

    if args.calibrate:
        run_calibration()
        return

    calibration = load_calibration()

    if args.image:
        image = cv2.imread(args.image)
        if image is None:
            print(f"Error: Cannot read image '{args.image}'", file=sys.stderr)
            sys.exit(1)
        result = process_image(image, calibration)
    else:
        # Live camera mode
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Error: Cannot open camera.", file=sys.stderr)
            sys.exit(1)

        print("Live mode. Press 'c' to capture position, 'q' to quit.")
        result = None

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            cv2.imshow("PLD Position Detector - Press 'c' to capture", frame)
            key = cv2.waitKey(1) & 0xFF

            if key == ord("c"):
                result = process_image(frame, calibration)
                if result:
                    print(f"\nPosition detected:")
                    print(f"  x = {result['x_mm']} mm")
                    print(f"  y = {result['y_mm']} mm")
                    print(f"  r = {result['r_mm']} mm")
                    print(f"  theta = {result['angle_deg']}°")
            elif key == ord("q"):
                break

        cap.release()
        cv2.destroyAllWindows()

    if result:
        print(f"\nPosition:")
        print(f"  x = {result['x_mm']} mm")
        print(f"  y = {result['y_mm']} mm")
        print(f"  r = {result['r_mm']} mm")
        print(f"  theta = {result['angle_deg']}°")


if __name__ == "__main__":
    main()

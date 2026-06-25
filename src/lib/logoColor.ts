/**
 * Sample the background colour of a logo image (its opaque corners) so the
 * surrounding container can be set to the same colour — making the image's
 * edges blend in instead of sitting on a visible white border.
 *
 * Returns a CSS `rgb()` string, or null when the corners are transparent
 * (the caller can then keep a sensible default). The image must be same-origin
 * (ours live under /uploads) for the canvas pixel read-back to be allowed.
 */
export function extractEdgeColor(img: HTMLImageElement): string | null {
  try {
    const size = 16;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    const at = (x: number, y: number) => (y * size + x) * 4;
    const corners = [at(0, 0), at(size - 1, 0), at(0, size - 1), at(size - 1, size - 1)];

    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    for (const i of corners) {
      if (data[i + 3] > 200) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        n++;
      }
    }
    if (n === 0) return null;
    return `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;
  } catch {
    return null;
  }
}

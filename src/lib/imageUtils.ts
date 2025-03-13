export type Resolution = "original" | "25" | "50" | "75";

export function getBaseName(fileName: string): string {
  const idx = fileName.lastIndexOf(".");
  if (idx >= 0) {
    return fileName.substring(0, idx);
  }
  return fileName;
}
/**
 * Convert and compress an image using an offscreen canvas.
 *
 * This function uses modern APIs (createImageBitmap) for faster, high-quality image decoding
 * and applies image smoothing when resizing.
 *
 * @param dataUrl - The original image as a data URL.
 * @param format - The desired output format ('webp', 'jpeg', or 'png').
 * @param quality - The desired quality (1-100).
 * @param resolution - The desired resolution: "original" or a percentage string ("25", "50", "75").
 * @returns A promise that resolves with the converted image as a data URL.
 */
export async function convertImage(
  dataUrl: string,
  format: "webp" | "jpeg" | "png",
  quality: number,
  resolution: Resolution
): Promise<string> {
  try {
    let source: ImageBitmap | HTMLImageElement;

    // Use createImageBitmap if available for better performance; fallback to Image if needed.
    if ("createImageBitmap" in window) {
      const blob = await fetch(dataUrl).then((res) => res.blob());
      source = await createImageBitmap(blob);
    } else {
      source = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = dataUrl;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load the image."));
      });
    }

    // Calculate new dimensions based on resolution
    let width = source.width;
    let height = source.height;
    if (resolution !== "original") {
      const scale = parseInt(resolution, 10) / 100;
      width = Math.floor(source.width * scale);
      height = Math.floor(source.height * scale);
    }

    // Create an offscreen canvas and set high-quality image smoothing
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to obtain canvas context.");
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw the source image onto the canvas with the new dimensions
    ctx.drawImage(source, 0, 0, width, height);

    // Convert quality (1-100) to a fraction (0-1) for canvas.toDataURL.
    const qualityFraction = quality / 100;
    // Generate the new data URL for the desired format with the specified quality.
    return canvas.toDataURL(`image/${format}`, qualityFraction);
  } catch (error) {
    throw new Error("Image conversion failed: " + error);
  }
}

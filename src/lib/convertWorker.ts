/// <reference lib="webworker" />

self.onmessage = async (event) => {
  try {
    const { dataUrl, format, quality, resolution } = event.data;
    // 1. Convert the base64 Data URL into a Blob.
    const response = await fetch(dataUrl);
    const inputBlob = await response.blob();

    // 2. Create an ImageBitmap from the Blob (Web Worker-friendly).
    const bitmap = await createImageBitmap(inputBlob);

    // 3. Decide the target width/height based on the resolution.
    //    For example, “25” => scale to 25% of original.
    const originalWidth = bitmap.width;
    const originalHeight = bitmap.height;

    let scale = 1;
    if (resolution === "25") scale = 0.25;
    if (resolution === "50") scale = 0.5;
    if (resolution === "75") scale = 0.75;

    const targetWidth = Math.round(originalWidth * scale);
    const targetHeight = Math.round(originalHeight * scale);

    // 4. Draw onto an OffscreenCanvas (available in workers).
    const offscreen = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = offscreen.getContext("2d");
    if (ctx) {
      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    } else {
      throw new Error("Failed to get 2D context");
    }

    // 5. Convert the canvas to a Blob with the desired MIME type and quality.
    //    (You can also use toDataURL, but convertToBlob is more modern.)
    let mimeType = "image/webp";
    if (format === "jpeg") mimeType = "image/jpeg";
    else if (format === "png") mimeType = "image/png";

    const outputBlob = await offscreen.convertToBlob({
      type: mimeType,
      quality: quality / 100, // if “90”, pass in 0.9
    });

    // 6. Convert that Blob back to a base64 data URL.
    const arrayBuffer = await outputBlob.arrayBuffer();
    const base64String = arrayBufferToBase64(arrayBuffer);
    const finalDataUrl = `data:${mimeType};base64,${base64String}`;

    // 7. Post it back to the main thread.
    self.postMessage({ converted: finalDataUrl, error: null });
  } catch (err) {
    self.postMessage({ converted: null, error: (err as Error).message || String(err) });
  }
};

/** Utility to convert ArrayBuffer -> base64. */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
// Compare this snippet from src/lib/imageUtils.ts:
//  * @param buffer - The ArrayBuffer to convert.
//  * @returns The base64 string.   
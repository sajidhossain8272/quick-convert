/// <reference lib="webworker" />

self.onmessage = async (event) => {
  try {
    const { dataUrl, format, quality, resolution } = event.data;
    console.log("Received message:", event.data);

    // 1. Convert the base64 Data URL into a Blob.
    const response = await fetch(dataUrl);
    const inputBlob = await response.blob();
    console.log("Converted data URL to Blob:", inputBlob);

    // 2. Create an ImageBitmap from the Blob (Web Worker-friendly).
    const bitmap = await createImageBitmap(inputBlob);
    console.log("Created ImageBitmap:", bitmap);

    // 3. Decide the target width/height based on the resolution.
    const originalWidth = bitmap.width;
    const originalHeight = bitmap.height;
    console.log("Original dimensions:", originalWidth, originalHeight);

    let scale = 1;
    if (resolution === "25") scale = 0.25;
    if (resolution === "50") scale = 0.5;
    if (resolution === "75") scale = 0.75;

    const targetWidth = Math.round(originalWidth * scale);
    const targetHeight = Math.round(originalHeight * scale);
    console.log("Target dimensions:", targetWidth, targetHeight);

    // 4. Draw onto an OffscreenCanvas (available in workers).
    const offscreen = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = offscreen.getContext("2d");
    if (ctx) {
      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
      console.log("Drew image on canvas");
    } else {
      throw new Error("Failed to get 2D context");
    }

    // 5. Convert the canvas to a Blob with the desired MIME type and quality.
    let mimeType = "image/webp";
    if (format === "jpeg") mimeType = "image/jpeg";
    else if (format === "png") mimeType = "image/png";

    const outputBlob = await offscreen.convertToBlob({
      type: mimeType,
      quality: quality / 100, // if “90”, pass in 0.9
    });
    console.log("Converted canvas to Blob:", outputBlob);

    // 6. Convert that Blob back to a base64 data URL.
    const arrayBuffer = await outputBlob.arrayBuffer();
    const base64String = arrayBufferToBase64(arrayBuffer);
    const finalDataUrl = `data:${mimeType};base64,${base64String}`;
    console.log("Converted Blob to base64 data URL");

    // 7. Post it back to the main thread.
    self.postMessage({ converted: finalDataUrl, error: null });
    console.log("Posted message back to main thread");
  } catch (err) {
    console.error("Error during conversion:", err);
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
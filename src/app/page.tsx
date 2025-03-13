"use client";

import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FaCheckCircle, FaSpinner, FaHourglass, FaTrash } from "react-icons/fa";
import Dropzone from "./components/Dropzone";
import ConversionControls from "./components/ConversionControls";
import { getBaseName } from "@/lib/imageUtils";

interface ImageItem {
  id: number;
  originalBase64: string;
  originalFileName: string;
  convertedBase64?: string;
  isLoading: boolean;
  selected: boolean; // For selecting this image to convert
}

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [conversionSettings, setConversionSettings] = useState({
    format: "webp" as "webp" | "jpeg" | "png",
    quality: 90,
    resolution: "original" as "original" | "25" | "50" | "75",
  });

  /**
   * Add images from dropzone.
   */
  const addImages = (fileData: { base64: string; fileName: string }[]) => {
    const newItems = fileData.map((data, idx) => ({
      id: Date.now() + idx,
      originalBase64: data.base64,
      originalFileName: data.fileName,
      isLoading: false,
      selected: true, // Default to selected when first added
    }));
    setImages((prev) => [...prev, ...newItems]);
  };

  /**
   * Toggle selection of an image
   */
  const toggleSelectImage = (id: number) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    );
  };

  /**
   * Remove an image from the list
   */
  const removeImage = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  /**
   * Convert selected images.
   */
  const handleConvert = async () => {
    const selectedImages = images.filter((img) => img.selected);
    if (selectedImages.length === 0) return;

    // Mark selected images as loading, clear old conversions
    setImages((prev) =>
      prev.map((img) =>
        img.selected
          ? { ...img, isLoading: true, convertedBase64: undefined }
          : img
      )
    );

    // Convert each image using a separate Web Worker
    const convertImage = (image: ImageItem) => {
      return new Promise<ImageItem>((resolve) => {
        const worker = new Worker(
          new URL("@/lib/convertWorker", import.meta.url)
        );

        worker.postMessage({
          dataUrl: image.originalBase64,
          format: conversionSettings.format,
          quality: conversionSettings.quality,
          resolution: conversionSettings.resolution,
        });

        worker.onmessage = (e) => {
          const { converted } = e.data;
          resolve({
            ...image,
            convertedBase64: converted,
            isLoading: false,
          });
          worker.terminate();
        };
      });
    };

    const results = await Promise.all(selectedImages.map(convertImage));

    // Update state for all images with new data for the converted ones
    setImages((prev) =>
      prev.map((img) => {
        const updated = results.find((r) => r.id === img.id);
        return updated ? updated : img;
      })
    );
  };

  /**
   * Download logic:
   * - If there is only one *converted* image (and presumably selected), download it directly.
   * - If multiple images, download a ZIP.
   */
  const handleDownloadAll = async () => {
    const convertedItems = images.filter((img) => img.convertedBase64);

    if (convertedItems.length === 0) {
      return; // nothing to download
    }

    // Single image scenario
    if (convertedItems.length === 1) {
      const item = convertedItems[0];
      const ext = conversionSettings.format;
      const baseName = getBaseName(item.originalFileName);
      await downloadSingleImage(item.convertedBase64!, `${baseName}.${ext}`);
      return;
    }

    // Otherwise, build a ZIP
    const zip = new JSZip();
    convertedItems.forEach((item) => {
      const base64Data = item.convertedBase64!.split(",")[1];
      const ext = conversionSettings.format;
      const baseName = getBaseName(item.originalFileName);
      zip.file(`${baseName}.${ext}`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "converted-images.zip");
  };

  /**
   * Helper to download a single base64 image as a file.
   */
  const downloadSingleImage = async (dataUrl: string, fileName: string) => {
    const parts = dataUrl.split(",");
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    saveAs(blob, fileName);
  };

  const selectedCount = images.filter((img) => img.selected).length;
  const hasSelectedImages = selectedCount > 0;
  const hasConverted = images.some((img) => !!img.convertedBase64);

  return (
    <div className='py-8 px-4'>
      <div className='max-w-5xl mx-auto space-y-8'>
        {/* Title / Intro */}
        <div className='text-center space-y-2'>
          <h1 className='text-3xl md:text-4xl font-bold'>Quick Convert</h1>
          <p className='text-gray-600'>
            Convert single or multiple images right in your browser.
          </p>
        </div>

        {/* Conversion Controls */}
        <ConversionControls
          settings={conversionSettings}
          setSettings={setConversionSettings}
          onConvert={handleConvert}
          hasSelectedImages={hasSelectedImages}
          selectedCount={selectedCount}
        />

        {/* Dropzone */}
        <Dropzone onDrop={addImages} multiple />

        {/* Table of images */}
        {images.length > 0 && (
          <div className='overflow-x-auto border border-gray-200 rounded'>
            <table className='min-w-full text-left text-sm'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='p-3 border-b w-12 text-center'>Select</th>
                  <th className='p-3 border-b'>File Name</th>
                  <th className='p-3 border-b'>Status</th>
                  <th className='p-3 border-b'>Converted File Name</th>
                  <th className='p-3 border-b'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {images.map((img) => {
                  const baseName = getBaseName(img.originalFileName);
                  const ext = conversionSettings.format;

                  let statusIcon = <FaHourglass className='text-gray-400' />;
                  if (img.isLoading) {
                    statusIcon = (
                      <FaSpinner className='animate-spin text-blue-600' />
                    );
                  } else if (img.convertedBase64) {
                    statusIcon = <FaCheckCircle className='text-green-500' />;
                  }

                  return (
                    <tr key={img.id} className='border-b'>
                      {/* Checkbox */}
                      <td className='p-3 text-center'>
                        <input
                          type='checkbox'
                          checked={img.selected}
                          onChange={() => toggleSelectImage(img.id)}
                          className='h-4 w-4'
                        />
                      </td>
                      {/* Original Filename */}
                      <td className='p-3'>{img.originalFileName}</td>
                      {/* Status icon */}
                      <td className='p-3'>
                        <div className='flex items-center gap-2'>
                          {statusIcon}
                          {!img.isLoading && !img.convertedBase64 && "Pending"}
                          {img.isLoading && "Converting..."}
                          {img.convertedBase64 && "Converted"}
                        </div>
                      </td>
                      {/* Converted File Name */}
                      <td className='p-3'>
                        {img.convertedBase64 ? `${baseName}.${ext}` : "N/A"}
                      </td>
                      {/* Actions */}
                      <td className='p-3'>
                        <button
                          onClick={() => removeImage(img.id)}
                          className='text-red-500 hover:text-red-600'
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Download Button */}
        {images.length > 0 && (
          <div className='mt-4 flex justify-center'>
            <button
              onClick={handleDownloadAll}
              disabled={!hasConverted}
              className={`px-6 py-2 rounded-lg transition-colors text-white ${
                hasConverted
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Download Converted Images
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

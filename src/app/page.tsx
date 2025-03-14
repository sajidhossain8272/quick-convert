"use client";

import { useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FaCheckCircle, FaSpinner, FaHourglass, FaTrash } from "react-icons/fa";
import Dropzone from "./components/Dropzone";
import ConversionControls from "./components/ConversionControls";
import { getBaseName } from "@/lib/imageUtils";
import Features from "./components/Features";
import Hero from "./components/Hero";
import ConversionTable from "./components/ConversionTable";

interface ImageItem {
  id: number;
  originalBase64: string;
  originalFileName: string;
  convertedBase64?: string;
  isUploading: boolean; // New: shows upload progress
  isLoading: boolean;   // Shows conversion progress
  selected: boolean;    // For selecting this image to convert
}

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [conversionSettings, setConversionSettings] = useState({
    format: "webp" as "webp" | "jpeg" | "png",
    quality: 90,
    resolution: "original" as "original" | "25" | "50" | "75",
  });

  // Create a ref for the main conversion section
  const mainRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll to the main conversion section
  const scrollToMain = () => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  /**
   * Add images from dropzone with upload progress.
   * Each file is added immediately with isUploading true,
   * and then updated when its processing (and optional HEIC conversion) is complete.
   */
  const addImages = (fileData: { base64: string; fileName: string }[]) => {
    fileData.forEach(async (data, idx) => {
      const id = Date.now() + idx;
      // Immediately add a placeholder image with isUploading true
      setImages((prev) => [
        ...prev,
        {
          id,
          originalBase64: "",
          originalFileName: data.fileName,
          isUploading: true,
          isLoading: false,
          selected: true,
        },
      ]);

      let base64 = data.base64;

      // If the file is HEIC/HEIF, convert it first
      if (data.fileName.endsWith(".heic") || data.fileName.endsWith(".heif")) {
        const response = await fetch(data.base64);
        const blob = await response.blob();
        const heic2any = (await import("heic2any")).default;
        const convertedBlob = await heic2any({ blob, toType: "image/jpeg" });
        base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(convertedBlob as Blob);
        });
      }

      // Update the image with the processed base64 and mark uploading as complete
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, originalBase64: base64, isUploading: false }
            : img
        )
      );
    });
  };

  /**
   * Toggle selection of an image.
   */
  const toggleSelectImage = (id: number) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    );
  };

  /**
   * Remove an image from the list.
   */
  const removeImage = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  /**
   * Convert selected images and update status individually.
   * Each image conversion is handled in its own Web Worker.
   */
  const handleConvert = async () => {
    const selectedImages = images.filter(
      (img) => img.selected && !img.isUploading
    );
    if (selectedImages.length === 0) return;

    // Mark selected images as loading and clear old conversion data.
    setImages((prev) =>
      prev.map((img) =>
        img.selected && !img.isUploading
          ? { ...img, isLoading: true, convertedBase64: undefined }
          : img
      )
    );

    // Process each selected image individually.
    selectedImages.forEach((image) => {
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
        // Update the image with the conversion result
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? { ...img, convertedBase64: converted, isLoading: false }
              : img
          )
        );
        worker.terminate();
      };
    });
  };

  /**
   * Download logic:
   * - If only one converted image exists, download it directly.
   * - If multiple images are converted, pack them in a ZIP.
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

    // Otherwise, build a ZIP archive
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero onConvertNowClick={scrollToMain} />

      {/* Main Conversion Tool Section */}
      <main ref={mainRef} className="max-w-7xl mx-auto py-10 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-2xl font-extrabold text-gray-800 tracking-tight pb-1">
              <span>
                To <span className="text-blue-600">Convert</span>
              </span>
            </div>
            <p className="text-gray-600">
              Upload your images, adjust conversion settings, and download your optimized images.
              Built for speed and simplicity.
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

          {/* Table of Images */}
          {images.length > 0 && (
            <div className="overflow-x-auto mt-6 border border-gray-200 rounded">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 border-b w-12 text-center">Select</th>
                    <th className="p-3 border-b">File Name</th>
                    <th className="p-3 border-b">Status</th>
                    <th className="p-3 border-b">Converted File Name</th>
                    <th className="p-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((img) => {
                    const baseName = getBaseName(img.originalFileName);
                    const ext = conversionSettings.format;

                    let statusIcon;
                    let statusText;
                    if (img.isUploading) {
                      statusIcon = (
                        <FaSpinner className="animate-spin text-orange-500" />
                      );
                      statusText = "Uploading...";
                    } else if (img.isLoading) {
                      statusIcon = (
                        <FaSpinner className="animate-spin text-blue-600" />
                      );
                      statusText = "Converting...";
                    } else if (img.convertedBase64) {
                      statusIcon = <FaCheckCircle className="text-green-500" />;
                      statusText = "Converted";
                    } else {
                      statusIcon = <FaHourglass className="text-gray-400" />;
                      statusText = "Ready To Convert";
                    }

                    return (
                      <tr key={img.id} className="border-b">
                        {/* Checkbox */}
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={img.selected}
                            onChange={() => toggleSelectImage(img.id)}
                            className="h-4 w-4"
                            disabled={img.isUploading || img.isLoading}
                          />
                        </td>
                        {/* Original Filename */}
                        <td className="p-3">{img.originalFileName}</td>
                        {/* Status */}
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {statusIcon}
                            <span>{statusText}</span>
                          </div>
                        </td>
                        {/* Converted File Name */}
                        <td className="p-3">
                          {img.convertedBase64 ? `${baseName}.${ext}` : "N/A"}
                        </td>
                        {/* Actions */}
                        <td className="p-3">
                          <button
                            onClick={() => removeImage(img.id)}
                            className="text-red-500 hover:text-red-600"
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
            <div className="mt-4 flex justify-center">
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
      </main>
      <ConversionTable />
      {/* Features Section */}
      <Features />
    </div>
  );
}

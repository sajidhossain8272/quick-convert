'use client';
import { saveAs } from 'file-saver';
import Image from 'next/image';

interface ImagePreviewProps {
  original: string | null;
  converted: string | null;
  isLoading: boolean;
  format: string;
  quality: number;
  resolution: string;
}

export default function ImagePreview({
  original,
  converted,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLoading,
  format,
  quality,
  resolution
}: ImagePreviewProps) {
  const handleDownload = async () => {
    if (!converted) return;

    try {
      let blob;
      if (converted.startsWith("data:") && converted.includes(",")) {
        const parts = converted.split(",");
        const byteString = atob(parts[1]);
        const mimeString = parts[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        blob = new Blob([ab], { type: mimeString });
      } else {
        const response = await fetch(converted);
        blob = await response.blob();
      }
      const filename = `converted-${quality}q-${resolution}.${format}`;
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error during image download", error);
    }
  };

  return (
    <div className="mt-8 space-y-8">
      {original && converted ? (
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2">Before</h2>
            <Image src={original} alt="Before" className="max-w-full rounded" />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2">After</h2>
            <Image src={converted} alt="After" className="max-w-full rounded" />
            <div className="flex justify-center mt-4">
              <button
                onClick={handleDownload}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Download Converted Image
              </button>
            </div>
          </div>
        </div>
      ) : (
        original && (
          <div>
            <h2 className="text-xl font-bold mb-2">Preview</h2>
            <Image src={original} alt="Preview" className="max-w-full rounded" />
          </div>
        )
      )}
    </div>
  );
}

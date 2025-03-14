"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaArrowUpFromBracket } from "react-icons/fa6";

interface DropzoneProps {
  onDrop: (fileData: { base64: string; fileName: string }[]) => void;
  multiple?: boolean;
}

export default function Dropzone({ onDrop, multiple = false }: DropzoneProps) {
  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      const readers = acceptedFiles.map(
        (file) =>
          new Promise<{ base64: string; fileName: string }>((resolve, reject) => {
            // Validate that it's an image
            if (!file.type.startsWith("image/") && !file.type.startsWith("image/heic") && !file.type.startsWith("image/heif")) {
              reject(new Error("Invalid file type. Please upload an image."));
              return;
            }
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                base64: reader.result as string,
                fileName: file.name,
              });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      );

      Promise.all(readers)
        .then((files) => onDrop(files))
        .catch((err) => console.error(err));
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: { "image/*": [], "image/heic": [], "image/heif": [] },
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-4 border-dashed rounded-xl p-8 mb-8 text-center cursor-pointer transition-all 
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <FaArrowUpFromBracket
          className={`h-12 w-12 mx-auto ${
            isDragActive ? "text-blue-500" : "text-gray-400"
          }`}
        />
        <p className="text-gray-600">
          {isDragActive
            ? "Drop the images here"
            : "Drag & drop images, or click to select"}
        </p>
        <p className="text-sm text-gray-500">
          You can upload a single image or multiple images in one go.
        </p>
      </div>
    </div>
  );
}
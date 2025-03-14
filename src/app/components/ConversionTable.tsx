"use client";

import React from "react";

const supportedFormats = ["JPEG", "PNG", "WEBP"];
const uploadFormats = [
  "PNG",
  "JPEG",
  "WEBP",
  "GIF",
  "BMP",
  "ICO",
  "HEIC",
  "HEIF",
];

const ConversionTable = () => {
  return (
    <section className='max-w-7xl mx-auto px-4 py-10'>
      <h3 className='text-3xl font-bold text-center text-gray-800 mb-4'>
        Supported Image Conversions
      </h3>
      <p className='text-center text-gray-600 mb-6'>
        Below are the supported image format conversions available in Quick
        Convert.
      </p>

      <div className='overflow-x-auto border border-gray-100 rounded-lg shadow-lg '>
        <table className='w-full text-left text-sm divide-y divide-gray-100'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='p-3 border-b border-gray-100'>Upload Format</th>
              <th className='p-3 border-b border-gray-100'>Can Convert To</th>
            </tr>
          </thead>
          <tbody>
            {uploadFormats.map((format) => (
              <tr
                key={format}
                className='border-b border-gray-200 hover:bg-gray-50 transition-colors'
              >
                <td className='p-3 font-medium '>{format}</td>
                <td className='p-3'>
                  {supportedFormats.includes(format)
                    ? supportedFormats.filter((f) => f !== format).join(", ")
                    : "WEBP, PNG, JPEG"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-6 text-sm text-gray-700 bg-yellow-100 p-4 rounded-lg shadow-sm'>
        <p className='mb-2 font-semibold'>⚠ Important Disclaimers:</p>
        <ul className='list-disc list-inside'>
          <li>
            <span className="font-bold">HEIC</span> and <span className="font-bold">HEIF</span> formats may take longer to process due to additional
            decoding requirements.
          </li>
          <li>
            This software is compatible with mobile devices, but due to lower
            processing power, conversions may take longer. High file size or
            bulk conversions may cause instability, except on high-end devices.
          </li>
          <li>We currently do not support <span className="font-bold">SVG</span> file format at this time. </li>
        </ul>
      </div>
    </section>
  );
};

export default React.memo(ConversionTable);

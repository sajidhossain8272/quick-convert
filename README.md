# Quick Convert

Quick Convert is a fast, secure, and entirely client-side image conversion tool. It enables users to upload images, adjust conversion settings (such as format, quality, and resolution), and download optimized images without ever sending your files to a server. Built for speed and simplicity, Quick Convert leverages the power of modern browsers for efficient bulk processing.

## Features

- **Fast & Efficient**: Perform lightning-fast image conversions directly in your browser.
- **User Friendly**: Enjoy an intuitive, easy-to-use interface designed for seamless image conversion.
- **Client-Side Conversion**: Your images never leave your computer, ensuring complete privacy and security.
- **Bulk Uploads**: Upload and convert multiple images at once (up to 1,000 images in under a minute).
- **Unlimited Conversions**: Convert as many images as you need, leveraging your device’s processing power.
- **Multi-format Support**: Supports popular image formats including WebP, JPEG, and PNG.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React framework)
- **Language**: TypeScript / JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **File Handling & Conversion**:
  - [react-dropzone](https://github.com/react-dropzone/react-dropzone) for drag-and-drop uploads
  - [file-saver](https://github.com/eligrey/FileSaver.js/) for downloading images/files
  - [JSZip](https://stuk.github.io/jszip/) for packaging multiple files into a ZIP archive
- **Icons**: [react-icons](https://react-icons.github.io/react-icons/)
- **Web Workers**: Offload image conversion processing to keep the UI responsive
- **Analytics**: Google Analytics integration via Next.js Script component

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/quick-convert.git
   cd quick-convert

2. **Install dependencies**

   **npm install**
   **or**
   **yarn install**

3. **Run Locally**

   ```bash
   npm run dev
   # or
   yarn dev

## Usage

- **Upload Images**: Drag & drop images or click to select files using the interactive dropzone.
- **Adjust Settings**: Choose the desired format (WebP, JPEG, PNG), quality level (High/Medium/Low), and resolution.
- **Convert**: Select images to convert and click the "Convert" or "Convert All" button.
- **Download**: After conversion, download the images individually or as a ZIP archive if multiple images are converted.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.



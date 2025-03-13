import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Script from "next/script";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quick Convert - Fast, Secure, Client-side Image Conversion",
  description:
    "Quick Convert is a lightweight, client-side image conversion tool that ensures your images never leave your browser. Convert images quickly and securely with support for WebP, JPEG, and PNG formats.",
  keywords: [
    "image conversion",
    "jpg to webp",
    "png to webp",
    "jpeg to webp",
    "webp converter",
    "webp to jpg",
    "webp to png",
    "png to jpg",
    "jpg to png",
    "jpeg to png",
    "png converter",
    "jpg converter",
    "jpeg converter",
    "webp conversion",
    "webp image converter",
    "webp image conversion",
    "webp image optimization",
    "webp image compression",
    "webp image format",
    "webp image conversion tool",
    "webp image conversion service",
    "webp image conversion software",
    "webp image conversion online",
    "webp image conversion website",
    "image converter",
    "image conversion tool",
    "image conversion service",
    "image conversion software",
    "image conversion online",
    "image conversion website",
    "webp conversion",
    "image optimization",
    "image compression",
    "image converter",
    "image format conversion",
    "client-side image conversion",
    "secure image conversion",
    "fast image conversion",
    "quick image conversion",
    "Quick Convert",
    "Next.js",
    "image optimization",
    "online image converter",
    "bulk image converter",
    "jpg to webp converter bulk",
    "img to webp",
    "image to webp",
    "img to webp converter",
    "img to png",
    "image to png",
    "img to png converter",
    "img to jpg",
    "image to jpg",
    "img to jpg converter",
    "image to jpg converter",
    "jpg to webp online",
    "jpg to web online",
    "jpg to png online",
    "png to webp online",
    "png to web online",
    "png to jpg online",
    "webp to jpg online",
    "webp to png online",
    "webp to jpg converter",
    "webp to png converter",
    "jpeg to jpg online",
    "jpeg to png online",
    "jpeg to webp online",
    "jpeg to jpg converter",
    "jpeg to png converter",
    "jpeg to webp converter",
    "new image converter", 
    "latest image converter",
    "best image converter",
    "top image converter",
    "image converter 2022",
    "image converter 2023",
    "image converter 2024",
    "image converter 2025",
    "image converter 2026",
    "image converter 2027",
    "image converter 2028",
    "image converter 2029",
    "image converter 2030",
    "best image converter 2022",
    "best image converter 2023",
    "best image converter 2024",
    "best image converter 2025",
    "best image converter 2026",
    "best image converter 2027",
    "best image converter 2028",
    "best image converter 2029",
    "best image converter 2030",

  ],
  themeColor: "#ffffff",
  alternates: {
    canonical: "https://quick-convert-img.vercel.app/",
  },
  openGraph: {
    title: "Quick Convert - Fast, Secure, Client-side Image Conversion",
    description:
      "Convert your images quickly and securely in your browser with Quick Convert. No uploads to a server, ensuring privacy and speed.",
    url: "https://quick-convert-img.vercel.app/",
    siteName: "Quick Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://quick-convert-img.vercel.app/og-image.jpg", // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "Quick Convert - Image Conversion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick Convert - Fast, Secure, Client-side Image Conversion",
    description:
      "Experience fast and secure image conversion directly in your browser with Quick Convert. No server uploads for enhanced privacy.",
    images: ["https://quick-convert-img.vercel.app/og-image.jpg"], // Replace with your actual image URL
    creator: "@your_twitter_handle", // Replace with your Twitter handle
  },
  metadataBase: new URL("https://quick-convert-img.vercel.app/"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Quick Convert",
            "url": "https://quick-convert-img.vercel.app/",
            "description":
              "Quick Convert is a client-side image conversion tool that converts images quickly and securely.",
            "applicationCategory": "Utilities",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
            },
          })}
        </Script>
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <NavBar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

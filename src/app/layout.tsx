import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppChrome from "./components/AppChrome";
import Script from "next/script";


// 🔹 Hardcoded Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quick Convert - Fast, Secure & Private Image Converter",
  description:
    "Quick Convert is a high-performance, client-side image converter supporting WebP, JPEG, PNG, HEIC, and HEIF. Privacy-first image processing directly in your browser.",
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
    "Plzwork",
    "Quick Convert by Plzwork",
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
    "merge pdf",
    "merge pdf free",
    "merge pdf online client side",
    "secure pdf merge",
    "split pdf",
    "extract pdf pages",
    "secure pdf splitter",
    "split pdf free",
    "image to pdf converter",
    "jpg to pdf free",
    "png to pdf online",
    "offline image to pdf",
    "convert images to pdf",
  ],
  alternates: {
    canonical: "https://quickconvert.plzwork.app/",
  },
  openGraph: {
    title: "Quick Convert - Fast, Secure & Private Image Converter",
    description:
      "Quick Convert is a fast, private, universal conversion engine — convert images, units, currencies, and developer utilities directly in your browser.",
    url: "https://quickconvert.plzwork.app/",
    siteName: "Quick Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://quickconvert.plzwork.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quick Convert products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick Convert - Fast, Secure & Private Image Converter",
    description:
      "Quick Convert is a fast, private, universal conversion engine — convert images, units, currencies, and developer utilities directly in your browser.",
    images: ["https://quickconvert.plzwork.app/og-image.png"],
    creator: "@your_twitter_handle", // Replace with your Twitter handle
  },
  metadataBase: new URL("https://quickconvert.plzwork.app/"),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
     <meta name="apple-mobile-web-app-title" content="Quick Convert" />


      <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        {/* Structured Data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Plzwork",
            "url": "https://quickconvert.plzwork.app/",
            "description":
              "Plzwork builds useful products including Quick Convert, a client-side image conversion tool.",
          })}
        </Script>
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}

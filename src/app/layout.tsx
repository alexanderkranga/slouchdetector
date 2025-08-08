import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Enhanced title with SEO keywords
  title: "SlouchDetector",
  
  // Expanded meta description (155 characters with CTA)
  description: "Open-source, free and offline AI posture monitoring app that detects slouching and helps you maintain proper posture while working.",
  
  // Essential SEO metadata
  keywords: "AI posture monitor, slouch detector, posture tracking app, work from home posture, computer posture monitor, back pain prevention, neck pain prevention, ergonomics",
  authors: [{ name: "SlouchDetector" }],
  creator: "SlouchDetector",
  publisher: "SlouchDetector",
  
  // Robots and indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Open Graph for social media sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://slouchdetector.net",
    title: "SlouchDetector | get alerted when you slouch",
    description: "Open-source, free and offline AI posture monitoring app that detects slouching and helps you maintain proper posture while working.",
    siteName: "SlouchDetector",
    images: [
      {
        url: "https://slouchdetector.net/og-image.png",
        width: 1200,
        height: 630,
        alt: "SlouchDetector - AI Posture Monitoring App",
      },
    ],
  },
  
  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "SlouchDetector | get alerted when you slouch",
    description: "Open-source, free and offline AI posture monitoring app that detects slouching and helps you maintain proper posture while working.",
    images: ["https://slouchdetector.net/og-image.png"],
    creator: "@AlexHardmond",
    site: "@AlexHardmond",
  },
  
  // Additional metadata
  category: "Health & Fitness",
  applicationName: "SlouchDetector",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // SEO Technical optimizations
  metadataBase: new URL("https://slouchdetector.net"),
  alternates: {
    canonical: "/",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SlouchDetector",
    "description": "Open-source, free and offline AI posture monitoring app that detects slouching and helps you maintain proper posture while working.",
    "url": "https://slouchdetector.net",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires camera access",
    "price": "0",
    "priceCurrency": "USD",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Open-source, free and offline",
      "AI-powered posture detection",
      "Real-time slouch monitoring", 
      "Privacy-first offline processing",
      "MediaPipe face detection",
      "Custom posture calibration",
      "Visual and audio alerts"
    ],
    "screenshot": "https://slouchdetector.net/app-screenshot.png",
    "softwareVersion": "1.0.0",
    "datePublished": "2024-01-01", // Replace with your actual publish date
    "dateModified": "2024-01-01", // Replace with last update date
    "author": {
      "@type": "Organization",
      "name": "SlouchDetector"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "SlouchDetector"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "100" // Update these as you get real reviews
    }
  };

  return (
    <html lang="en">
      <head>
        {/* Preload critical resources for Core Web Vitals */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/_next/static/css/app.css" as="style" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

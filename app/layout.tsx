import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { RqProvider } from "@/components/query-client-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StockFlow - Advanced Stock Market Dashboard",
  description: "Professional real-time stock market tracking and analytics platform. Monitor your portfolio, analyze trends, and make informed investment decisions with our modern dashboard.",
  keywords: ["stocks", "trading", "finance", "portfolio", "market", "analytics", "dashboard"],
  authors: [{ name: "StockFlow Team" }],
  creator: "StockFlow",
  publisher: "StockFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://stockflow.app'),
  openGraph: {
    title: "StockFlow - Advanced Stock Market Dashboard",
    description: "Professional real-time stock market tracking and analytics platform",
    url: "https://stockflow.app",
    siteName: "StockFlow",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StockFlow Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StockFlow - Advanced Stock Market Dashboard",
    description: "Professional real-time stock market tracking and analytics platform",
    images: ["/og-image.png"],
  },
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <RqProvider>{children}</RqProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

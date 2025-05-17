import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import React from "react";
import I18nProvider from "@/i18n/i18nProvidedr";

const outfitSans = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Arzonic",
    template: "%s | Arzonic",
  },
  description:
    "We specialize in building high-performance websites and immersive 3D experiences using modern, custom-built technology",
  metadataBase: new URL("https://arzonic.com"),
  manifest: "/manifest.json",
  openGraph: {
    title: "Arzonic",
    description:
      "We specialize in building high-performance websites and immersive 3D experiences using modern, custom-built technology",
    url: "https://arzonic.com",
    siteName: "Arzonic",
    images: [
      {
        url: "/custom-websites.jpg",
        width: 1200,
        height: 630,
        alt: "Arzonic preview image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arzonic",
    description:
      "We specialize in building high-performance websites and immersive 3D experiences using modern, custom-built technology",
    images: ["/custom-websites.jpg"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#171717",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Arzonic Agency",
              url: "https://arzonic.com",
              logo: "https://arzonic.com/icon-search-512x512.png",
            }),
          }}
        />
      </head>
      <body className={outfitSans.className}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}

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
    default: "Arzonic Agency",
    template: "%s | Arzonic",
  },
  description: "Custom web apps and 3D-powered websites for modern businesses.",
  metadataBase: new URL("https://arzonic.com"),
  manifest: "/manifest.json",
  openGraph: {
    title: "Arzonic Agency",
    description:
      "Custom web apps and 3D-powered websites for modern businesses.",
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
    title: "Arzonic Agency",
    description:
      "Custom web apps and 3D-powered websites for modern businesses.",
    images: ["/custom-websites.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
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
      <body className={outfitSans.className}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}

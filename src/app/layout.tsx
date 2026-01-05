import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import React from "react";
import I18nProvider from "@/i18n/i18nProvider";

const outfitSans = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Arzonic",
    template: "%s - Arzonic",
  },
  description:
    "Building modern web applications, dashboards, and custom digital solutions for ambitious small and medium-sized businesses.",
  metadataBase: new URL("https://arzonic.com"),
  manifest: "/manifest.json",
  openGraph: {
    title: "Arzonic",
    description:
      "Building modern web applications, dashboards, and custom digital solutions for ambitious small and medium-sized businesses.",
    url: "https://arzonic.com",
    siteName: "Arzonic",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Arzonic OpenGraph preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arzonic",
    description:
      "Building modern web applications, dashboards, and custom digital solutions for ambitious small and medium-sized businesses.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
    <html lang="en" suppressHydrationWarning data-theme="arzonicdark">
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

// next-seo.config.ts
import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  titleTemplate: "%s - Arzonic",
  defaultTitle: "Arzonic",
  description:
    "Vi udvikler intelligente webapps til ambitiøse virksomheder. Specialister i skræddersyede løsninger, kraftfulde dashboards og engagerende 3D-oplevelser.",
  openGraph: {
    type: "website",
    locale: "da_DK",
    url: "https://arzonic.com",
    siteName: "Arzonic",
  },
  additionalMetaTags: [
    {
      name: "keywords",
      content:
        "webapps, dashboard, cms, softwarebureau, udvikling, integrationer, 3D, digital løsning",
    },
  ],
  twitter: {
    handle: "@arzonic",
    site: "@arzonic",
    cardType: "summary_large_image",
  },
};

// Function to generate SEO config based on language and translations
export function generateSeoConfig(seoTranslations: any): DefaultSeoProps {
  const twitter = seoTranslations?.twitter || {};

  return {
    titleTemplate: seoTranslations?.titleTemplate as string,
    defaultTitle: seoTranslations?.defaultTitle as string,
    description: seoTranslations?.description as string,
    openGraph: {
      type: "website",
      locale: seoTranslations?.locale as string,
      url: "https://arzonic.com",
      siteName: seoTranslations?.siteName as string,
    },
    additionalMetaTags: [
      {
        name: "keywords",
        content: seoTranslations?.keywords as string,
      },
    ],
    twitter: {
      handle: twitter?.handle as string,
      site: twitter?.site as string,
      cardType: "summary_large_image",
    },
  };
}

export default config;

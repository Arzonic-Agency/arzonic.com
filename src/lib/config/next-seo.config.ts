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
  return {
    titleTemplate: seoTranslations.titleTemplate,
    defaultTitle: seoTranslations.defaultTitle,
    description: seoTranslations.description,
    openGraph: {
      type: "website",
      locale: seoTranslations.locale,
      url: "https://arzonic.com",
      siteName: seoTranslations.siteName,
    },
    additionalMetaTags: [
      {
        name: "keywords",
        content: seoTranslations.keywords,
      },
    ],
    twitter: {
      handle: seoTranslations.twitter.handle,
      site: seoTranslations.twitter.site,
      cardType: "summary_large_image",
    },
  };
}

export default config;

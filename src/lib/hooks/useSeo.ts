import { useTranslation } from "react-i18next";
import { generateSeoConfig } from "@/lib/config/next-seo.config";
import { DefaultSeoProps } from "next-seo";

interface UseSeoProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export function useSeo(customSeo?: UseSeoProps): DefaultSeoProps {
  const { t } = useTranslation();

  // Get base SEO config from translations
  const baseSeoConfig = generateSeoConfig(t("seo", { returnObjects: true }));

  // Merge with custom SEO if provided
  if (customSeo) {
    return {
      ...baseSeoConfig,
      title: customSeo.title || baseSeoConfig.defaultTitle,
      description: customSeo.description || baseSeoConfig.description,
      additionalMetaTags: [
        ...(baseSeoConfig.additionalMetaTags || []),
        ...(customSeo.keywords
          ? [
              {
                name: "keywords",
                content: customSeo.keywords,
              },
            ]
          : []),
      ],
    };
  }

  return baseSeoConfig;
}

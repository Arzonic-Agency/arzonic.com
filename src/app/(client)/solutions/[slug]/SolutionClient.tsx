"use client";

import { useTranslation } from "react-i18next";
import { NextSeo } from "next-seo";

const SolutionClient = ({
  slug,
  countryName,
}: {
  slug: string;
  countryName: string;
}) => {
  const { t } = useTranslation();
  const tKey = `solutionsPage.${slug}`;

  const title = `${t(`${tKey}.h1`)} in ${countryName}`;
  const description = `${t(
    `${tKey}.intro`
  )} We're now available in ${countryName}.`;
  const canonicalUrl = `https://arzonic.agency/solutions/${slug}`;

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          title,
          description,
        }}
      />

      <div className="max-w-4xl mx-auto px-6 py-42 h-[700px]">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-lg mb-6">{description}</p>
      </div>
    </>
  );
};

export default SolutionClient;

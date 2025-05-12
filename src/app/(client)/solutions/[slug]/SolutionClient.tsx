"use client";

import { useTranslation } from "react-i18next";
import { NextSeo } from "next-seo";

type Props = {
  slug:
    | "custom-websites"
    | "web-applications"
    | "3d-visualization"
    | "design-animation";
  countryName: string;
};

const SolutionClient = ({ slug, countryName }: Props) => {
  const { t } = useTranslation();

  const seoTitleStart = t(`solutionsPage.${slug}.titleStart`);
  const seoTitleEnd = t(`solutionsPage.${slug}.titleEnd`);
  const seoHero = t(`solutionsPage.${slug}.hero`);
  const seoDescription = t(`solutionsPage.${slug}.body`).replace(/\n/g, " ");
  const localizedCountry = t(
    `countries.${countryName.toLowerCase()}`,
    countryName
  );
  const processSteps = t(`solutionsPage.${slug}.process`, {
    returnObjects: true,
  }) as string[];
  const cta = t(`solutionsPage.${slug}.cta`);

  return (
    <>
      <NextSeo
        title={`${seoTitleStart} | Arzonic`}
        description={seoDescription}
        canonical={`https://arzonic.agency/solutions/${slug}`}
        openGraph={{
          url: `https://arzonic.agency/solutions/${slug}`,
          title: `${seoTitleStart} | Arzonic`,
          description: seoDescription,
        }}
      />

      {/* Hero Section */}
      <section
        className="relative w-full h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('/backgrounds/${slug}.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-base-100 opacity-6 z-10" />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {seoTitleStart}
            <span className="text-primary"> {seoTitleEnd}</span>
          </h1>
          <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto">{seoHero}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="p-5 sm:p-7 w-full flex flex-col items-center gap-10 max-w-4xl mx-auto my-20">
        <p className="text-lg mb-6 whitespace-pre-line">{seoDescription}</p>

        <div className="mb-6 w-full">
          <h2 className="text-2xl font-semibold mb-2">
            {t("common.processTitle", "Processen")}
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            {processSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>

        <div className="text-xl font-medium mt-8 text-center">{cta}</div>

        <div className="text-sm text-gray-500 mt-4">
          ({t("common.availableIn", "Tilgængelig i")} {localizedCountry})
        </div>
      </section>
    </>
  );
};

export default SolutionClient;

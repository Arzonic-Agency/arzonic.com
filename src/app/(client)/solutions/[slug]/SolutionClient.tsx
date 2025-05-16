"use client";

import { useTranslation } from "react-i18next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { FaCaretRight } from "react-icons/fa6";

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
  const seoProcessTitle = t(`solutionsPage.${slug}.processTitle`);
  const seoHero = t(`solutionsPage.${slug}.hero`);
  const seoBtn = t(`solutionsPage.common.btn`);
  const seoDescription = t(`solutionsPage.${slug}.body`).replace(/\n/g, " ");
  const seoCountryAllTitle = t(`solutionsPage.common.countryAllTitle`);
  const allCountries = t("countries", { returnObjects: true }) as Record<
    string,
    string
  >;
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
      <section
        className="relative w-full h-[25vh] md:h-[35vh] flex items-center justify-center bg-cover bg-center opacity-90"
        style={{
          backgroundImage: `url('/backgrounds/${slug}.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-tranparent to-transparent z-10" />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl pt-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {seoTitleStart}
            <span className="text-secondary"> {seoTitleEnd}</span>
          </h1>
          <p className="text-lg mt-2">
            {countryName !== "default" ? countryName : ""}
          </p>
        </div>
      </section>

      <section className="p-5 sm:p-7 w-full flex flex-col items-start gap-10 max-w-6xl mx-auto my-10 md:my-7">
        <p className="text-base sm:text-lg md:text-2xl font-bold">{seoHero}</p>
        <p className="text-sm md:text-lg mb-6 whitespace-pre-line">
          {seoDescription}
        </p>

        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center flex-row gap-3">
            <div className="flex flex-col gap-5">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold ">
                {seoProcessTitle}
              </h3>
              <ul className=" list-none space-y-4">
                {processSteps.map((step, i) => (
                  <li key={i} className="flex gap-2 items-center">
                    <FaCaretRight className="text-secondary text-xl" /> {step}
                  </li>
                ))}
              </ul>
            </div>
            <div className=""></div>
          </div>

          <div className="mt-5 flex flex-col items-start gap-5">
            {cta}
            <Link href="/get-started" className="btn btn-primary">
              {seoBtn}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-5 max-w-4xl mt-20">
          <h4 className="text-base font-semibold text-zinc-400">
            {seoCountryAllTitle}
          </h4>
          <ul className="flex flex-wrap gap-3">
            {Object.entries(allCountries).map(([code, name]) => (
              <div key={code}>
                <Link
                  href={`/solutions/${slug}/${code}`}
                  className="badge badge-primary badge-soft badge-sm md:badge-md"
                >
                  {name}
                </Link>
              </div>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default SolutionClient;

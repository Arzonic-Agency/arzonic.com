"use client";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { FaCaretRight, FaPlay } from "react-icons/fa6";
import Spline from "@splinetool/react-spline";
import WebAppProducts from "@/components/client/solutions/WebAppProducts";

function VideoWithPlayButton({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <div className="relative w-full max-w-2xl rounded-xl overflow-hidden bg-base-300 aspect-video group">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={src}
        controls={playing}
        playsInline
        preload="metadata"
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
      >
        Din browser understøtter ikke videoafspilning.
      </video>
      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Afspil video"
        >
          <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/90 text-primary-content shadow-lg transition group-hover:scale-105 group-hover:bg-primary">
            <FaPlay className="ml-1 h-6 w-6 sm:h-8 sm:w-8 text-current" />
          </span>
        </button>
      )}
    </div>
  );
}

type Props = {
  slug:
    | "web-applications"
    | "design-ux"
    | "3d-visualization"
    | "systems-integrations";
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
  const processStepsRaw = t(`solutionsPage.${slug}.process`, {
    returnObjects: true,
  }) as unknown;
  const processSteps = Array.isArray(processStepsRaw)
    ? (processStepsRaw as string[])
    : typeof processStepsRaw === "object" && processStepsRaw !== null
      ? Object.values(processStepsRaw as Record<string, string>)
      : [];
  const cta = t(`solutionsPage.${slug}.cta`);

  const CustomContent: Partial<Record<Props["slug"], React.ReactNode>> = {
    "3d-visualization": (
      <Spline scene="https://prod.spline.design/7L07tDETuES9U9Si/scene.splinecode" />
    ),
  };

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
        <div className="absolute inset-0 bg-linear-to-t from-base-100 via-tranparent to-transparent z-10" />
        <div className="relative z-20 text-center text-white px-4 w-full pt-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {seoTitleStart}
            <span className="text-secondary"> {seoTitleEnd}</span>
          </h1>
          <p className="text-lg mt-2">
            {countryName !== "default" ? countryName : ""}
          </p>
        </div>
      </section>

      <section className="p-5 md:p-8 w-full flex flex-col items-start gap-10  mx-auto my-10 md:my-7 relative">
        <p className="text-base sm:text-lg md:text-2xl font-bold">{seoHero}</p>
        <p className="text-sm md:text-lg mb-6 whitespace-pre-line">
          {seoDescription}
        </p>
        {slug === "web-applications" && (
          <div className="w-full">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-6">
              {t("webAppProducts.title", "Products we develop")}
            </h3>
            <WebAppProducts />
          </div>
        )}
        <div className="flex flex-col gap-5">
          {slug === "3d-visualization" && (
            <VideoWithPlayButton
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/video/teaser-3d.mp4`}
            />
          )}
          <div className="flex flex-col md:flex-row md:flex-wrap gap-5 md:gap-8 mt-20 relative w-full">
            {/* Mobil: liste → CTA → 3D. Desktop: liste + 3D ved siden af, derefter CTA */}
            <div className="order-1 flex flex-col gap-5 flex-1 min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold ">
                {seoProcessTitle}
              </h3>
              <ul className="list-none space-y-4">
                {processSteps.map((step, i) => (
                  <li key={i} className="flex gap-2 items-center">
                    <FaCaretRight className="text-secondary text-xl shrink-0" />{" "}
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-2 md:order-3 w-full md:basis-full flex flex-col items-start gap-5">
              {cta}
              <Link href="/get-started" className="btn btn-primary">
                {seoBtn}
              </Link>
            </div>
            {CustomContent[slug] && (
              <div className="order-3 md:order-2 md:w-80 lg:w-96 xl:w-md shrink-0 h-96 md:h-80 lg:h-[500px] rounded-xl overflow-hidden lg:absolute lg:-right-80 lg:-top-20">
                {CustomContent[slug]}
              </div>
            )}
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

"use client";

import SolutionCards from "@/components/client/solutions/SolutionCards";
import { NextSeo } from "next-seo";
import React from "react";
import { useTranslation } from "react-i18next";

const SolutionsPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <NextSeo
        title="Solutions"
        description="Explore our innovative solutions designed to meet your needs."
        openGraph={{
          title: "Solutions",
          description:
            "Explore our innovative solutions designed to meet your needs.",
          url: "https://example.com/solutions",
          images: [
            {
              url: "https://example.com/images/solutions.jpg",
              width: 800,
              height: 600,
              alt: "Solutions Image",
            },
          ],
        }}
      />
      <div className="p-5 sm:p-7 w-full h-full flex flex-col gap-10 md:gap-15 xl:gap-28 justify-center items-center relative my-20">
        <div className="max-w-md md:max-w-[470px]">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
            {t("SolutionsPage.title")}
            <span className="text-primary">
              {" "}
              {t("SolutionsPage.highlight")}{" "}
            </span>
          </h1>
        </div>
        <div>
          <SolutionCards />
        </div>
      </div>
    </>
  );
};

export default SolutionsPage;

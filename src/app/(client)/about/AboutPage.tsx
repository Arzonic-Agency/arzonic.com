"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import Image from "next/image";

const AboutPage = () => {
  const { t } = useTranslation();

  const title = `${t("SEO.titleAbout")} | ${t("SEO.title")}`;
  const description = t("SEO.description");

  const team = t("aboutPage.team", { returnObjects: true }) as {
    name: string;
    role: string;
    image: string;
  }[];

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          url: "https://arzonic.com/about",
          siteName: "Arzonic",
          type: "website",
        }}
      />

      <div className="p-5 md:p-8 w-full h-full flex flex-col gap-10 md:gap-15 xl:gap-28 justify-center items-center relative my-20">
        <div className="max-w-[260px] md:max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold text-center">
            {t("aboutPage.titleStart")}
            <span className="text-primary"> {t("aboutPage.titleEnd")} </span>
          </h1>
        </div>

        <motion.div
          className="flex flex-col items-center justify-center gap-20 max-w-3xl p-5 md:p-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col gap-5 tracking-wide text-sm md:text-base">
            <p>{t("aboutPage.textOne")}</p>
            <p>{t("aboutPage.textTwo")}</p>
          </div>

          <div className="flex flex-col gap-10 items-center md:flex-row justify-between w-full">
            {team.map((member, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 items-center justify-center flex-1"
              >
                <div className="avatar">
                  <div className="mask mask-hexagon-2 w-28 h-28">
                    <Image
                      src={member.image}
                      alt={`${member.name} – ${member.role}`}
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
                <h4>{member.name}</h4>
                <span className="text-xs">{member.role}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AboutPage;

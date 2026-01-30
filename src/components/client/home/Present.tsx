"use client";

import React from "react";
import { FaArrowUpRightDots } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Present = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  const iconVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        delay: 0.3,
      },
    },
  };

  return (
    <div className="flex items-center justify-center h-full w-full p-3 py-12 md:py-20">
      <div className="max-w-6xl w-full flex flex-col gap-8 md:gap-12">
        {/* Header Section */}
        <motion.div
          className="hidden md:flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="badge badge-secondary badge-soft badge-base md:badge-xl uppercase"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {t("Present.badge") || "OUR EXPERTISE"}
          </motion.span>
          <motion.h2
            className="text-2xl md:text-4xl lg:text-5xl text-center max-w-sm md:max-w-4xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="text-base-content">
              {t("Present.title")?.split(" ").slice(0, -2).join(" ")}
            </span>{" "}
            <span className="text-primary">
              {t("Present.title")?.split(" ").slice(-2).join(" ")}
            </span>
          </motion.h2>
        </motion.div>

        {/* Grid Layout - Top Row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          layout
        >
          {/* Large Card - Left (2 columns) */}
          <motion.div
            className="md:col-span-2 rounded-xl bg-base-200 ring-2 ring-base-300 min-h-[280px] md:min-h-[360px] p-6 md:p-8 flex flex-col gap-4 shadow-lg relative overflow-hidden cursor-pointer group"
            variants={cardVariants}
            layout
            layoutId="present-card-customDesign"
            whileHover={{
              y: -4,
              scale: 1.01,
              transition: { duration: 0.2 },
            }}
            transition={{
              layout: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
            }}
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <span className="badge badge-secondary badge-soft badge-base md:badge-lg uppercase">
                {t("Present.customDesign.badge") || "DEVELOPMENT"}
              </span>
              <span className="text-xs text-zinc-400">
                {t("Present.customDesign.stats") || "15+ Projects"}
              </span>
            </div>
            <motion.h3
              className="text-base md:text-2xl font-semibold relative z-10"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {t("Present.customDesign.title")}
            </motion.h3>
            <motion.p
              className="text-sm md:text-base text-zinc-400 font-light relative z-10 flex-1 w-full max-w-[250px] md:max-w-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {t("Present.customDesign.description")}
            </motion.p>
            <Link
              className="btn btn-accent md:btn-primary flex items-center gap-2 w-fit group-hover:bg-primary/90 transition-colors relative z-10"
              href="/cases"
            >
              {t("Present.customDesign.button") || "View Cases"}
            </Link>
            <motion.div
              className="absolute bottom-6 right-6 text-secondary z-10"
              variants={iconVariants}
              whileHover={{
                rotate: [0, -15, 15, -15, 0],
                transition: { duration: 0.6 },
              }}
            >
              <Image
                src="/mobile3.png"
                alt="Phone"
                width={500}
                height={500}
                className="w-30 md:w-50 h-auto"
              />
            </motion.div>
          </motion.div>

          {/* Medium Card - Right */}
          <motion.div
            className="md:col-span-1 rounded-xl bg-base-200 ring-2 ring-base-300 min-h-[280px] md:min-h-[360px] p-6 md:p-8 flex flex-col gap-4 shadow-lg relative overflow-hidden cursor-pointer group"
            variants={cardVariants}
            layout
            layoutId="present-card-landingPages"
            whileHover={{
              y: -4,
              scale: 1.01,
              transition: { duration: 0.2 },
            }}
            transition={{
              layout: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
            }}
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
              initial={false}
            />
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <span className="badge badge-secondary badge-soft badge-base md:badge-lg uppercase">
                {t("Present.landingPages.badge") || "LANDING PAGES"}
              </span>
            </div>
            <motion.h3
              className="text-base md:text-2xl font-semibold relative z-10"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {t("Present.landingPages.title")}
            </motion.h3>
            <motion.p
              className="text-sm md:text-base text-zinc-400 font-light relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {t("Present.landingPages.description")}
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-2 mt-4 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {(
                t("Present.landingPages.examples", {
                  returnObjects: true,
                }) as string[]
              )?.map((example: string, index: number) => (
                <motion.button
                  key={index}
                  className="btn btn-sm text-xs "
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <FaCheckCircle className="text-sm text-secondary" /> {example}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Grid Layout - Bottom Row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          layout
        >
          {/* Call to Action - Left */}
          <motion.div
            className="md:col-span-1 rounded-xl bg-linear-to-br from-accent via-primary/15 to-accent ring-2 ring-accent/30 min-h-[280px] md:min-h-[320px] p-6 md:p-8 flex-col gap-4 shadow-lg relative overflow-hidden cursor-pointer group hidden md:flex items-start"
            variants={cardVariants}
            layout
            layoutId="present-card-cta"
            whileHover={{
              y: -4,
              scale: 1.01,
              transition: { duration: 0.2 },
            }}
            transition={{
              layout: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
            }}
          >
            <motion.h3
              className="text-2xl md:text-3xl font-semibold text-base-content relative z-10"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {t("Present.cta.title") || "Ready to Transform?"}
            </motion.h3>
            <motion.p
              className="text-base md:text-lg text-base-content/80 font-light relative z-10 flex-1 max-w-[250px] md:max-w-[410px]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {t("Present.cta.description")}
            </motion.p>
            <Link className="btn btn-accent " href="/contact">
              {t("Present.cta.button")}
            </Link>
            {/* <Image
              src="/team/marc2.png"
              alt="Phone"
              width={180}
              height={180}
              className="absolute bottom-0 right-10 w-34 h-34 transition-all duration-300"
            /> */}
            {/* <Image
              src="/test.png"
              alt="Phone"
              fill
              className="absolute bottom-0 right-10 w-full h-full object-cover blur-xs group-hover:blur-none transition-all duration-300"
            /> */}
          </motion.div>

          {/* Medium Card - Right */}
          <motion.div
            className="md:col-span-1 rounded-xl bg-base-200 ring-2 ring-base-300 min-h-[280px] md:min-h-[320px] p-6 md:p-8 hidden md:flex flex-col gap-4 shadow-lg relative overflow-hidden cursor-pointer group"
            variants={cardVariants}
            layout
            layoutId="present-card-builtToGrow"
            whileHover={{
              y: -4,
              scale: 1.01,
              transition: { duration: 0.2 },
            }}
            transition={{
              layout: {
                type: "spring",
                stiffness: 300,
                damping: 40,
              },
            }}
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <span className="badge badge-secondary badge-soft badge-base md:badge-lg uppercase">
                {t("Present.builtToGrow.badge") || "GROWTH"}
              </span>
            </div>
            <motion.h3
              className="text-base md:text-2xl font-bold relative z-10"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {t("Present.builtToGrow.title")}
            </motion.h3>
            <Image
              src="/seo.png"
              alt="Phone"
              width={180}
              height={180}
              className="w-20 h-auto absolute bottom-10 left-10 grayscale group-hover:grayscale-0 transition-all duration-300"
            />
            <Image
              src="/ads.png"
              alt="Phone"
              width={180}
              height={180}
              className="w-33 h-auto absolute bottom-9 left-40 grayscale group-hover:grayscale-0 transition-all duration-300"
            />
            <motion.p
              className="text-sm md:text-base text-zinc-400 font-light relative z-10 flex-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {t("Present.builtToGrow.description")}
            </motion.p>
            <motion.div
              className="absolute bottom-6 right-6 text-secondary z-10"
              variants={iconVariants}
              whileHover={{
                rotate: [0, 15, -15, 15, 0],
                scale: 1.15,
                transition: { duration: 0.5 },
              }}
            >
              <FaArrowUpRightDots className="text-4xl md:text-5xl" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Present;

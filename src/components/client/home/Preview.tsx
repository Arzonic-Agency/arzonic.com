"use client";

import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Preview = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 items-start md:items-center justify-center h-full w-full relative overflow-hidden px-3 py-8 md:py-20">
      {/* Header Section */}
      <motion.div
        className="flex flex-col items-start md:items-center gap-4 px-5 md:px-0 pb-2"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.span
          className="badge badge-secondary badge-soft badge-lg md:badge-xl uppercase"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {t("Preview.badge") || "PREVIEW"}
        </motion.span>
        <motion.h3
          className="text-xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl text-start md:text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {t("Preview.title")}
        </motion.h3>
        <motion.span
          className="tracking-wide text-sm md:text-base text-zinc-400 md:max-w-md text-start md:text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {t("Preview.subtitle")}
        </motion.span>
      </motion.div>

      {/* Image Section */}
      <motion.div
        className="relative w-full max-w-[900px] mx-auto group"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
      >
        {/* Animated gradient background */}
        <div className="absolute -inset-6 md:-inset-10 rounded-4xl overflow-hidden ">
          {/* Primary animated gradient orb */}
          <motion.div
            className="absolute top-0 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-accent md:bg-accent rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Secondary animated gradient orb */}
          <motion.div
            className="absolute bottom-0 right-1/4 w-40 h-40 md:w-80 md:h-80 bg-secondary/10 md:bg-accent rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, -20, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          {/* Accent gradient orb */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-md md:h-112 bg-linear-to-br from-primary/10 md:from-primary/20 via-transparent to-secondary/10 md:to-secondary/20 rounded-full blur-3xl"
            animate={{
              rotate: [0, 360],
              scale: [0.9, 1.05, 0.9],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute -inset-6 md:-inset-10 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_50%,var(--color-base-100)_100%)] opacity-60" />
        
        <motion.div
          className="relative rounded-2xl overflow-hidden  p-10 md:p-16 shadow-2xl shadow-accent"
          whileHover={{ scale: 1.01, y: -2 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src="/backgrounds/mockup-preview.png"
            alt={t("Preview.aria.imageAlt")}
            aria-label={t("Preview.aria.imageAlt")}
            width={1200}
            height={1000}
            className="w-full h-auto"
            quality={75}
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Preview;
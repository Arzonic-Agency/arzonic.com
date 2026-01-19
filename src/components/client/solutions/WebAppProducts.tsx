"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaChartLine, FaTicket, FaGlobe } from "react-icons/fa6";
import { FaCalendarAlt, FaShoppingCart, FaTools } from "react-icons/fa";

const WebAppProducts = () => {
  const { t } = useTranslation();

  const products = [
    {
      key: "dashboard",
      icon: FaChartLine,
    },
    {
      key: "booking",
      icon: FaCalendarAlt,
    },
    {
      key: "events",
      icon: FaTicket,
    },
    {
      key: "landingpage",
      icon: FaGlobe,
    },
    {
      key: "ecommerce",
      icon: FaShoppingCart,
    },
    {
      key: "internalTools",
      icon: FaTools,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  const iconVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      layout
    >
      {products.map((product, index) => {
        const Icon = product.icon;
        return (
          <motion.div
            key={product.key}
            id={product.key}
            layout
            layoutId={`product-card-${product.key}`}
            variants={cardVariants}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
            transition={{
              layout: {
                type: "spring" as const,
                stiffness: 300,
                damping: 30,
              },
            }}
          >
            <motion.a
              className="flex flex-col gap-3 rounded-xl bg-accent ring-2 ring-base-200 p-4 md:p-5 hover:ring-primary transition-all duration-300 ease-in-out shadow-lg h-full cursor-pointer overflow-hidden relative"
              layout
              href={`/solutions/web-applications`}
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
                initial={false}
                layout
              />
              <div className="flex items-center gap-3 relative z-10">
                <motion.div
                  className="p-3 rounded-lg bg-primary/10 text-primary"
                  layout
                  variants={iconVariants}
                  whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1,
                    transition: { duration: 0.5 },
                  }}
                >
                  <Icon className="text-xl sm:text-2xl" />
                </motion.div>
                <motion.h3
                  className="text-base sm:text-lg font-semibold"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {t(`webAppProducts.${product.key}.title`)}
                </motion.h3>
              </div>
              <motion.p
                className="text-xs sm:text-sm text-zinc-400 relative z-10"
                layout
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {t(`webAppProducts.${product.key}.description`)}
              </motion.p>
            </motion.a>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default WebAppProducts;

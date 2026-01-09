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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {products.map((product, index) => {
        const Icon = product.icon;
        return (
          <motion.div
            key={product.key}
            id={product.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <div className="flex flex-col gap-3 rounded-xl bg-base-200 ring-2 ring-base-200 p-4 md:p-5 hover:ring-primary transition-all duration-300 ease-in-out shadow-lg h-full cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Icon className="text-xl sm:text-2xl" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold">
                  {t(`webAppProducts.${product.key}.title`)}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">
                {t(`webAppProducts.${product.key}.description`)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WebAppProducts;

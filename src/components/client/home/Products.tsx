import React from 'react'
import WebAppProducts from '../solutions/WebAppProducts'
import { useTranslation } from 'react-i18next';

const Products = () => {
    const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-15 h-full"> 
        <span className="text-2xl md:text-4xl lg:text-5xl max-w-sm md:max-w-4xl">{t("webAppProducts.title2")}{" "}
        <span className="text-rotate text-2xl md:text-4xl lg:text-5xl">
            <span className="justify-items-start text-secondary text-uppercase">
                <span>{t("webAppProducts.dashboard.title")} </span>
                <span>{t("webAppProducts.booking.title")} </span>
                <span>{t("webAppProducts.events.title")} </span>
                <span>{t("webAppProducts.landingpage.title")} </span>
                <span>{t("webAppProducts.ecommerce.title")} </span>
                <span>{t("webAppProducts.internalTools.title")} </span>
            </span>
        </span>
        </span>
        <div className="relative z-10 w-full max-w-7xl">
            <WebAppProducts />
        </div>
    </div>
  );
};

export default Products;
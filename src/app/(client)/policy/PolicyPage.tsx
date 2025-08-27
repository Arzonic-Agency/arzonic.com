"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const PolicyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-5 md:p-8 w-full h-full flex flex-col gap-10 md:gap-15 xl:gap-28 justify-center items-center my-10 md:my-20">
      {/* Title */}
      <div className="max-w-xl md:max-w-3xl">
        <h1 className="text-2xl md:text-5xl font-bold text-center">
          {t("Policy.title")}
        </h1>
      </div>

      <div className="py-4 text-sm flex flex-col gap-12 max-w-3xl">
        {/* Section 1 – Indsamling af personoplysninger */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section1.title")}
          </h4>
          <p>{t("Policy.section1.description")}</p>
          <ul className="list-disc pl-5 my-4">
            <li>{t("Policy.section1.list.name")}</li>
            <li>{t("Policy.section1.list.phone")}</li>
            <li>{t("Policy.section1.list.email")}</li>
            <li>{t("Policy.section1.list.details")}</li>
          </ul>
          <p>{t("Policy.section1.note")}</p>
        </div>

        {/* Section 2 – Facebook og Instagram data */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section2.title")}
          </h4>
          <p>{t("Policy.section2.description1")}</p>
          <ul className="list-disc pl-5 my-4">
            <li>{t("Policy.section2.list.access")}</li>
            <li>{t("Policy.section2.list.pages")}</li>
            <li>{t("Policy.section2.list.publish")}</li>
          </ul>
          <p>{t("Policy.section2.description2")}</p>
        </div>

        {/* Section 3 – Opbevaring og sletning */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section3.title")}
          </h4>
          <p>{t("Policy.section3.description")}</p>
          <ul className="list-disc pl-5 my-4">
            <li>{t("Policy.section3.list.noCustomer")}</li>
            <li>{t("Policy.section3.list.customer")}</li>
          </ul>
          <p>
            {t("Policy.section3.note")}{" "}
            <strong>
              <a href="mailto:mail@arzonic.com" target="_blank">
                mail@arzonic.com
              </a>
            </strong>
            .
          </p>
        </div>

        {/* Section 4 – Videregivelse */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section4.title")}
          </h4>
          <p>{t("Policy.section4.description")}</p>
        </div>

        {/* Section 5 – Rettigheder */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section5.title")}
          </h4>
          <p>{t("Policy.section5.description")}</p>
          <ul className="list-disc pl-5 my-3">
            <li>{t("Policy.section5.list.access")}</li>
            <li>{t("Policy.section5.list.correct")}</li>
            <li>{t("Policy.section5.list.delete")}</li>
            <li>{t("Policy.section5.list.withdraw")}</li>
          </ul>
          <p>
            {t("Policy.section5.note")}{" "}
            <strong>
              <a href="mailto:mail@arzonic.com" target="_blank">
                mail@arzonic.com
              </a>
            </strong>
            .
          </p>
        </div>

        {/* Section 6 – Samtykke */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section6.title")}
          </h4>
          <p>{t("Policy.section6.description1")}</p>
          <p>{t("Policy.section6.description2")}</p>
        </div>

        {/* Section 7 – Datasikkerhed */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section7.title")}
          </h4>
          <p>{t("Policy.section7.description")}</p>
        </div>

        {/* Section 8 – Ændringer */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section8.title")}
          </h4>
          <p>{t("Policy.section8.description")}</p>
        </div>

        {/* Section 9 – Kontaktinformation */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section9.title")}
          </h4>
          <ul className="list-none gap-2 flex flex-col my-4">
            <li>{t("Policy.section9.list.company")}</li>
            <li>{t("Policy.section9.list.access")}</li>
            <li>{t("Policy.section9.list.email")}</li>
            <li>{t("Policy.section9.list.phone")}</li>
          </ul>
        </div>

        {/* Sidst opdateret */}
        <p className="mt-2 text-xs">{t("Policy.lastUpdated")}</p>
      </div>
    </div>
  );
};

export default PolicyPage;

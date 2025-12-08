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
        {/* Intro */}
        <div>
          <p>{t("Policy.intro")}</p>
        </div>

        {/* Section 1 – Hvornår vi indsamler oplysninger / When we collect information */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section1.title")}
          </h4>
          <p>{t("Policy.section1.description")}</p>
          <ul className="list-disc pl-5 my-4">
            <li>{t("Policy.section1.list.contact")}</li>
            <li>{t("Policy.section1.list.calculator")}</li>
            <li>{t("Policy.section1.list.job")}</li>
          </ul>
          <p>{t("Policy.section1.note")}</p>
        </div>

        {/* Section 2 – Hvilke oplysninger vi indsamler / What information we collect */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section2.title")}
          </h4>
          <p>{t("Policy.section2.description")}</p>
          <ul className="list-disc pl-5 my-4">
            <li>{t("Policy.section2.list.common")}</li>
            <li>{t("Policy.section2.list.calculator")}</li>
            <li>{t("Policy.section2.list.job")}</li>
          </ul>
          <p>{t("Policy.section2.note")}</p>
        </div>

        {/* Section 3 – Hvordan vi bruger dine oplysninger / How we use your information */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section3.title")}
          </h4>
          <p>{t("Policy.section3.description")}</p>
          <ul className="list-disc pl-5 my-4">
            <li>{t("Policy.section3.list.inquiry")}</li>
            <li>{t("Policy.section3.list.offer")}</li>
            <li>{t("Policy.section3.list.job")}</li>
            <li>{t("Policy.section3.list.improvement")}</li>
          </ul>
          <p>{t("Policy.section3.note")}</p>
        </div>

        {/* Section 4 – Job- og praktikansøgninger / Job and internship applications */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section4.title")}
          </h4>
          <p>{t("Policy.section4.description")}</p>
          <ul className="list-disc pl-5 my-4">
            <li>{t("Policy.section4.list.access")}</li>
            <li>{t("Policy.section4.list.noAutomated")}</li>
            <li>{t("Policy.section4.list.references")}</li>
            <li>{t("Policy.section4.list.unsolicited")}</li>
          </ul>
          <p>{t("Policy.section4.retention")}</p>
        </div>

        {/* Section 5 – Facebook / Instagram (System User) */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section5.title")}
          </h4>
          <p>{t("Policy.section5.description1")}</p>
          <ul className="list-disc pl-5 my-4">
            <li>{t("Policy.section5.list.pages")}</li>
            <li>{t("Policy.section5.list.publish")}</li>
          </ul>
          <p>{t("Policy.section5.description2")}</p>
        </div>

        {/* Section 6 – Opbevaring og sletning / Storage and deletion */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section6.title")}
          </h4>
          <p>{t("Policy.section6.description")}</p>
          <ul className="list-disc pl-5 my-4">
            <li>{t("Policy.section6.list.noCustomer")}</li>
            <li>{t("Policy.section6.list.customer")}</li>
            <li>{t("Policy.section6.list.job")}</li>
          </ul>
          <p>{t("Policy.section6.note")}</p>
        </div>

        {/* Section 7 – Deling med tredjeparter / Sharing with third parties */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section7.title")}
          </h4>
          <p>{t("Policy.section7.description")}</p>
          <ul className="list-disc pl-5 my-4">
            <li>{t("Policy.section7.list.providers")}</li>
            <li>{t("Policy.section7.list.legal")}</li>
          </ul>
          <p>{t("Policy.section7.note")}</p>
        </div>

        {/* Section 8 – Dine rettigheder / Your rights */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section8.title")}
          </h4>
          <p>{t("Policy.section8.description")}</p>
          <ul className="list-disc pl-5 my-3">
            <li>{t("Policy.section8.list.access")}</li>
            <li>{t("Policy.section8.list.correct")}</li>
            <li>{t("Policy.section8.list.delete")}</li>
            <li>{t("Policy.section8.list.limit")}</li>
            <li>{t("Policy.section8.list.object")}</li>
            <li>{t("Policy.section8.list.withdraw")}</li>
          </ul>
          <p>{t("Policy.section8.note")}</p>
        </div>

        {/* Section 9 – Samtykke / Consent */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section9.title")}
          </h4>
          <p>{t("Policy.section9.description1")}</p>
          <p className="mt-2">{t("Policy.section9.description2")}</p>
        </div>

        {/* Section 10 – Datasikkerhed / Data security */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section10.title")}
          </h4>
          <p>{t("Policy.section10.description")}</p>
        </div>

        {/* Section 11 – Opdateringer / Updates */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section11.title")}
          </h4>
          <p>{t("Policy.section11.description")}</p>
        </div>

        {/* Section 12 – Kontakt / Contact */}
        <div>
          <h4 className="font-semibold md:text-lg mb-3">
            {t("Policy.section12.title")}
          </h4>
          <p>{t("Policy.section12.description")}</p>
          <ul className="list-none gap-2 flex flex-col my-4">
            <li>{t("Policy.section12.list.company")}</li>
            <li>{t("Policy.section12.list.cvr")}</li>
            <li>{t("Policy.section12.list.email")}</li>
            <li>{t("Policy.section12.list.phone")}</li>
          </ul>
        </div>

        {/* Sidst opdateret / Last updated */}
        <p className="mt-2 text-xs">{t("Policy.lastUpdated")}</p>
      </div>
    </div>
  );
};

export default PolicyPage;

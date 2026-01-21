import React from "react";
import { useTranslation } from "react-i18next";

const Policy = () => {
  const { t } = useTranslation();

  return (
    <>
      <h3 className="font-bold text-xl md:text-2xl py-2">
        {t("Policy.title")}
      </h3>

      <p className="text-sm opacity-80 mb-5">
        {t("Policy.company")} · {t("Policy.lastUpdated")}
      </p>

      <div className="py-4 text-sm max-h-96 md:max-h-[40vh] overflow-y-auto flex flex-col gap-5">
        {/* Section 1 */}
        <div>
          <h4 className="font-semibold md:text-base mb-2">
            {t("Policy.section1.title")}
          </h4>
          <p>{t("Policy.section1.description")}</p>
          <ul className="list-disc pl-5 my-2">
            <li>{t("Policy.section1.list.contact")}</li>
            <li>{t("Policy.section1.list.calculator")}</li>
            <li>{t("Policy.section1.list.job")}</li>
          </ul>
          <p>{t("Policy.section1.note")}</p>
        </div>

        {/* Section 2 */}
        <div>
          <h4 className="font-semibold md:text-base mb-2">
            {t("Policy.section2.title")}
          </h4>
          <p>{t("Policy.section2.description")}</p>
          <ul className="list-disc pl-5 my-2">
            <li>{t("Policy.section2.list.common")}</li>
            <li>{t("Policy.section2.list.calculator")}</li>
            <li>{t("Policy.section2.list.job")}</li>
          </ul>
          <p>{t("Policy.section2.note")}</p>
        </div>

        {/* Section 3 */}
        <div>
          <h4 className="font-semibold md:text-base mb-2">
            {t("Policy.section3.title")}
          </h4>
          <p>{t("Policy.section3.description")}</p>
          <ul className="list-disc pl-5 my-2">
            <li>{t("Policy.section3.list.inquiry")}</li>
            <li>{t("Policy.section3.list.offer")}</li>
            <li>{t("Policy.section3.list.job")}</li>
            <li>{t("Policy.section3.list.improvement")}</li>
          </ul>
          <p>{t("Policy.section3.note")}</p>
        </div>

        {/* Section 4 */}
        <div>
          <h4 className="font-semibold md:text-base mb-2">
            {t("Policy.section4.title")}
          </h4>
          <p>{t("Policy.section4.description")}</p>
          <ul className="list-disc pl-5 my-2">
            <li>{t("Policy.section4.list.access")}</li>
            <li>{t("Policy.section4.list.noAutomated")}</li>
            <li>{t("Policy.section4.list.references")}</li>
            <li>{t("Policy.section4.list.unsolicited")}</li>
          </ul>
          <p>{t("Policy.section4.retention")}</p>
        </div>

        {/* Section 5 */}
        <div>
          <h4 className="font-semibold md:text-base mb-2">
            {t("Policy.section5.title")}
          </h4>
          <p>{t("Policy.section5.description1")}</p>
          <ul className="list-disc pl-5 my-2">
            <li>{t("Policy.section5.list.pages")}</li>
            <li>{t("Policy.section5.list.publish")}</li>
          </ul>
          <p>{t("Policy.section5.description2")}</p>
        </div>

        {/* Section 6 */}
        <div>
          <h4 className="font-semibold md:text-base mb-2">
            {t("Policy.section6.title")}
          </h4>
          <p>{t("Policy.section6.description")}</p>
          <ul className="list-disc pl-5 my-2">
            <li>{t("Policy.section6.list.noCustomer")}</li>
            <li>{t("Policy.section6.list.customer")}</li>
            <li>{t("Policy.section6.list.job")}</li>
          </ul>
          <p>{t("Policy.section6.note")}</p>
        </div>

        {/* Section 7 */}
        <div>
          <h4 className="font-semibold md:text-base mb-2">
            {t("Policy.section7.title")}
          </h4>
          <p>{t("Policy.section7.description")}</p>
          <ul className="list-disc pl-5 my-2">
            <li>{t("Policy.section7.list.providers")}</li>
            <li>{t("Policy.section7.list.legal")}</li>
          </ul>
          <p>{t("Policy.section7.note")}</p>
        </div>

        {/* Section 8 */}
        <div>
          <h4 className="font-semibold md:text-base mb-2">
            {t("Policy.section8.title")}
          </h4>
          <p>{t("Policy.section8.description")}</p>
          <ul className="list-disc pl-5 my-2">
            <li>{t("Policy.section8.list.access")}</li>
            <li>{t("Policy.section8.list.correct")}</li>
            <li>{t("Policy.section8.list.delete")}</li>
            <li>{t("Policy.section8.list.limit")}</li>
            <li>{t("Policy.section8.list.object")}</li>
            <li>{t("Policy.section8.list.withdraw")}</li>
          </ul>
          <p>{t("Policy.section8.note")}</p>
        </div>

        {/* Section 9 */}
        <div>
          <h4 className="font-semibold md:text-base mb-2">
            {t("Policy.section9.title")}
          </h4>
          <p>{t("Policy.section9.description1")}</p>
          <p className="mt-1">{t("Policy.section9.description2")}</p>
        </div>

        {/* Section 10 */}
        <div>
          <h4 className="font-semibold md:text-base mb-2">
            {t("Policy.section10.title")}
          </h4>
          <p>{t("Policy.section10.description")}</p>
        </div>

        {/* Section 11 */}
        <div>
          <h4 className="font-semibold md:text-base mb-2">
            {t("Policy.section11.title")}
          </h4>
          <p>{t("Policy.section11.description")}</p>
        </div>

        {/* Section 12 */}
        <div>
          <h4 className="font-semibold md:text-base mb-2">
            {t("Policy.section12.title")}
          </h4>
          <p>{t("Policy.section12.description")}</p>
          <ul className="list-disc pl-5 my-2">
            <li>{t("Policy.section12.list.company")}</li>
            <li>{t("Policy.section12.list.cvr")}</li>
            <li>{t("Policy.section12.list.email")}</li>
            <li>{t("Policy.section12.list.phone")}</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Policy;

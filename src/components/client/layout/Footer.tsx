import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaHashtag, FaInstagram } from "react-icons/fa6";
import ConsentModal from "../modal/ConsentModal";
import TermsModal from "../modal/TermsModal";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div>
      <footer className="footer sm:footer-horizontal bg-base-100 text-base-content p-10 border-base-300 border-t">
        <nav>
          <h6 className="footer-title">{t("Footer.services")}</h6>
          <Link href="/solutions/custom-websites" className="link link-hover">
            {t("Header.dropdown.customWebsites")}
          </Link>
          <Link href="/solutions/web-applications" className="link link-hover">
            {t("Header.dropdown.webApplications")}
          </Link>
          <Link href="/solutions/3d-visualization" className="link link-hover">
            {t("Header.dropdown.visualization")}
          </Link>
          <Link href="/solutions/design-animation" className="link link-hover">
            {t("Header.dropdown.designAnimation")}
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">{t("Footer.aboutUs")}</h6>
          <Link href="/about" className="link link-hover">
            {t("about")}
          </Link>
          <Link href="/contact" className="link link-hover">
            {t("contact")}
          </Link>
          <Link href="/jobs" className="link link-hover">
            {t("Footer.jobs", "Jobs")}
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">{t("Footer.legal", "Legal")}</h6>
          <TermsModal buttonText={t("terms_of_service")} variant="hover" />
          <ConsentModal buttonText={t("privacy_policy")} variant="hover" />
        </nav>
      </footer>
      <footer className="footer bg-base-100 text-base-content px-10 py-4">
        <aside className="flex items-center">
          <FaHashtag className="text-3xl -rotate-12 text-secondary" />
          <p>
            {t("Footer.brandName", "Arzonic Agency")}
            <br />
            {t("Footer.reliableTech", "Providing reliable tech since 2024")}
          </p>
        </aside>
        <nav className="md:place-self-center md:justify-self-end mb-5">
          <div className="grid grid-flow-col gap-4 text-3xl">
            <Link
              href="https://www.facebook.com/profile.php?id=61575249251500"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={30} />
            </Link>

            <Link
              href="https://www.instagram.com/arzonic.agency/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={33} />
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;

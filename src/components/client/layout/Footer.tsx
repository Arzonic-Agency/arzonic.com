import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FaFacebook,
  FaHashtag,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa6";
import ConsentModal from "../modal/ConsentModal";
import TermsModal from "../modal/TermsModal";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div>
      <footer className="footer sm:footer-horizontal bg-base-100 text-base-content p-10 border-base-300 border-t">
        <nav>
          <h6 className="footer-title">{t("Footer.services")}</h6>
          <a className="link link-hover">
            {t("Header.dropdown.customWebsites")}
          </a>
          <a className="link link-hover">
            {t("Header.dropdown.webApplications")}
          </a>
          <a className="link link-hover">
            {t("Header.dropdown.visualization")}
          </a>
          <a className="link link-hover">
            {t("Header.dropdown.designAnimation")}
          </a>
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
            <a>
              <FaLinkedin />
            </a>
            <a>
              <FaFacebook />
            </a>
            <a>
              <FaInstagram />
            </a>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;

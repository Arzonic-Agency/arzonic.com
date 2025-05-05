import React from "react";

import {
  FaFacebook,
  FaHashtag,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <div>
      <footer className="footer sm:footer-horizontal bg-base-100 text-base-content p-10 border-base-300 border-t">
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Custom Websites</a>
          <a className="link link-hover">Web Applications</a>
          <a className="link link-hover">3D Design</a>
          <a className="link link-hover">Marketing</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
        </nav>
      </footer>
      <footer className="footer bg-base-100 text-base-content  px-10 py-4">
        <aside className="grid-flow-col items-center">
          <FaHashtag className="text-3xl -rotate-12 text-secondary" />
          <p>
            Arzonic Agency
            <br />
            Providing reliable tech since 2024
          </p>
        </aside>
        <nav className="md:place-self-center md:justify-self-end">
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

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "../ui/separator";

export const Footer = (): JSX.Element => {
  const location = useLocation();
  const isStaticPage = ['/about', '/privacy', '/terms'].includes(location.pathname);

  const footerLinks = [
    { title: "About Us", path: "/about" },
    { title: "Privacy Policy", path: "/privacy" },
    { title: "Terms", path: "/terms" },
  ];

  const socialIcons = [
    { src: "/icon-essential-instagram.svg", alt: "Instagram" },
    { src: "/icon-essential-instagram.svg", alt: "Instagram" },
    { src: "/icon-essential-instagram.svg", alt: "Instagram" },
    { src: "/icon-crypto-facebook.svg", alt: "Facebook" },
  ];

  return (
    <footer className={`flex flex-col items-center justify-center w-full border-t border-[#a4a7ae] py-4 md:py-6 px-3 ${
      isStaticPage ? 'bg-[#0A4428]' : ''
    }`}>
      <p className={`text-sm md:text-base ${isStaticPage ? 'text-white' : 'text-gray-400'} text-center mb-3 md:mb-4`}>
        Create and stream the coolest music event with FaNect
      </p>

      <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
        {footerLinks.map((link, index) => (
          <React.Fragment key={index}>
            <Link
              to={link.path}
              className={`px-1 md:px-1.5 py-0.5 text-xs md:text-sm ${
                isStaticPage 
                  ? 'text-white hover:text-gray-200' 
                  : 'text-gray-400 hover:text-gray-600'
              } transition-colors`}
            >
              {link.title}
            </Link>
            {index < footerLinks.length - 1 && (
              <Separator orientation="vertical" className={`h-3 md:h-4 ${
                isStaticPage ? 'bg-white' : 'bg-[#a4a7ae]'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {socialIcons.map((icon, index) => (
          <button key={index} className="p-0.5">
            <img
              className={`w-4 h-4 md:w-5 md:h-5 ${isStaticPage ? 'brightness-0 invert' : ''}`}
              alt={icon.alt}
              src={icon.src}
            />
          </button>
        ))}
      </div>
    </footer>
  );
};
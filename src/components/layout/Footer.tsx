import React from "react";
import { Separator } from "../ui/separator";

export const Footer = (): JSX.Element => {
  const footerLinks = [
    { title: "About Us" },
    { title: "Privacy Policy" },
    { title: "Terms" },
  ];

  const socialIcons = [
    { src: "/icon-essential-instagram.svg", alt: "Instagram" },
    { src: "/icon-essential-instagram.svg", alt: "Instagram" },
    { src: "/icon-essential-instagram.svg", alt: "Instagram" },
    { src: "/icon-crypto-facebook.svg", alt: "Facebook" },
  ];

  return (
    <footer className="flex flex-col items-center justify-center w-full border-t border-[#a4a7ae] py-4 md:py-6 px-3">
      <p className="text-sm md:text-base text-gray-400 text-center mb-3 md:mb-4">
        Create and stream the coolest music event with FaNect
      </p>

      <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
        {footerLinks.map((link, index) => (
          <React.Fragment key={index}>
            <button className="px-1 md:px-1.5 py-0.5">
              <span className="text-xs md:text-sm text-gray-400">
                {link.title}
              </span>
            </button>
            {index < footerLinks.length - 1 && (
              <Separator orientation="vertical" className="h-3 md:h-4 bg-[#a4a7ae]" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {socialIcons.map((icon, index) => (
          <button key={index} className="p-0.5">
            <img
              className="w-4 h-4 md:w-5 md:h-5"
              alt={icon.alt}
              src={icon.src}
            />
          </button>
        ))}
      </div>
    </footer>
  );
};
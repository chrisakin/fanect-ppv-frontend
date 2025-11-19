import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "../ui/separator";

/**
 * Footer Component
 * 
 * Renders a responsive footer section with navigation links, tagline, and social media icons.
 * Dynamically adjusts styling based on whether the user is on a static page (about, privacy, terms).
 * 
 * Features:
 * - Responsive layout (mobile: py-4 px-3, desktop: py-6)
 * - Dynamic background color (green #0A4428 on static pages, transparent otherwise)
 * - Navigation links with separators (About Us, Privacy Policy, Terms)
 * - Social media icon buttons (Instagram, Facebook)
 * - Text color adaptation based on page context
 * 
 * @returns {JSX.Element} Footer element with navigation, tagline, and social icons
 */
export const Footer = (): JSX.Element => {
  const location = useLocation();
  
  /**
   * Determines if current page is a static informational page
   * @type {boolean}
   */
  const isStaticPage = ['/about', '/privacy', '/terms'].includes(location.pathname);

  /**
   * Navigation links displayed in footer
   * Links include About Us, Privacy Policy, and Terms pages
   * @type {Array<{title: string, path: string}>}
   */
  const footerLinks = [
    { title: "About Us", path: "/about" },
    { title: "Privacy Policy", path: "/privacy" },
    { title: "Terms", path: "/terms" },
  ];

  /**
   * Social media icon objects for footer social buttons
   * Contains Instagram and Facebook icon paths with alt text
   * @type {Array<{src: string, alt: string}>}
   */
  const socialIcons = [
    { src: "/icon-essential-instagram.svg", alt: "Instagram" },
    { src: "/icon-essential-instagram.svg", alt: "Instagram" },
    { src: "/icon-essential-instagram.svg", alt: "Instagram" },
    { src: "/icon-crypto-facebook.svg", alt: "Facebook" },
  ];

  return (
    // Main footer container
    // Responsive padding: mobile (py-4 px-3) → desktop (py-6)
    // Dynamic background: green (#0A4428) on static pages, transparent otherwise
    // Border top in neutral gray (#a4a7ae)
    <footer className={`flex flex-col items-center justify-center w-full border-t border-[#a4a7ae] py-4 md:py-6 px-3 ${
      isStaticPage ? 'bg-[#0A4428]' : ''
    }`}>
      {/* Tagline section */}
      {/* Text color: white on static pages, gray-400 on other pages */}
      {/* Responsive font size: text-sm mobile → text-base desktop */}
      {/* Tagline section */}
      {/* Text color: white on static pages, gray-400 on other pages */}
      {/* Responsive font size: text-sm mobile → text-base desktop */}
      <p className={`text-sm md:text-base ${isStaticPage ? 'text-white' : 'text-gray-400'} text-center mb-3 md:mb-4`}>
        Create and stream the coolest music event with FaNect
      </p>

      {/* Navigation links section */}
      {/* Flex layout with gap responsive: gap-1.5 mobile → gap-2 desktop */}
      {/* Renders each link with separator between them (except after last link) */}
      {/* Link styling: white text on static pages, gray-400 on others with hover effects */}
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
            {/* Vertical separator between links */}
            {/* Separator color: white on static pages, gray (#a4a7ae) otherwise */}
            {index < footerLinks.length - 1 && (
              <Separator orientation="vertical" className={`h-3 md:h-4 ${
                isStaticPage ? 'bg-white' : 'bg-[#a4a7ae]'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Social media icons section */}
      {/* Flex layout with gap responsive: gap-2 mobile → gap-3 desktop */}
      {/* Renders social media icon buttons (Instagram, Facebook) */}
      {/* Icon brightness inverted on static pages (dark background) for visibility */}
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
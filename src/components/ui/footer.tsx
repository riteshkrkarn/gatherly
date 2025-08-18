import Link from "next/link";
import {
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-4 mt-auto" style={{ backgroundColor: "#262E40" }}>
      <div className="container mx-auto px-6">
        {/* Main Footer Section */}
        <div className="flex flex-col items-center gap-6 mb-6">
          {/* Brand Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              gatherly
            </h2>
            <p className="text-sm text-gray-300 font-medium mt-1">
              BY GATHERLY TEAM
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            <Link
              href="/terms-conditions"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact-us"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Contact Us
            </Link>
            <Link
              href="/create-event"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              List your events
            </Link>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 pt-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Legal Text */}
            <div className="flex-1 max-w-4xl text-center lg:text-left">
              <p className="text-sm text-gray-400 leading-relaxed">
                By accessing this page, you confirm that you have read,
                understood, and agreed to our Terms of Service, Cookie Policy,
                Privacy Policy, and Content Guidelines. All rights reserved.
              </p>
            </div>

            {/* Social Media Section */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link
                href="#"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

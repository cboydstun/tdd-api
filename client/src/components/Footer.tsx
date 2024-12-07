import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-blue">SATX Bounce</h3>
            <p className="text-gray-600">
              Making your events memorable with safe and clean bounce house
              rentals in San Antonio.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary-blue transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="text-gray-600 hover:text-primary-blue transition"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-600 hover:text-primary-blue transition"
                >
                  Products
                </Link>
              </li>
              <li>
              <Link
                  to="/about"
                  className="text-gray-600 hover:text-primary-blue transition"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                (210) 555-0123
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                info@satxbounce.com
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                San Antonio, TX
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-primary-blue transition"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary-blue transition"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary-blue transition"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} SATX Bounce. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary-blue">
              SATX Bounce
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-blue transition"
            >
              Home
            </Link>
            <Link
              to="/blogs"
              className="text-gray-600 hover:text-primary-blue transition"
            >
              Blog
            </Link>
            <Link
              to="/inventory"
              className="text-gray-600 hover:text-primary-blue transition"
            >
              Inventory
            </Link>
            <Link
              to="/products"
              className="text-gray-600 hover:text-primary-blue transition"
            >
              Products
            </Link>
            <a
              href="#"
              className="text-gray-600 hover:text-primary-blue transition"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary-blue transition"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary-blue transition"
            >
              Contact
            </a>
          </div>
          <div>
            <button className="bg-primary-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary-indigo transition">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

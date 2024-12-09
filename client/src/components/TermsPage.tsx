import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";

const TermsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | SATX Bounce House Rentals</title>
        <meta
          name="description"
          content="Read our terms of service for bounce house rentals in San Antonio, TX. Learn about our rental agreement, safety requirements, delivery policies, and more."
        />
        <meta
          name="keywords"
          content="bounce house rental terms, rental agreement, safety requirements, delivery policy, weather policy, San Antonio bounce house terms"
        />

        {/* Open Graph tags */}
        <meta
          property="og:title"
          content="Terms of Service | SATX Bounce House Rentals"
        />
        <meta
          property="og:description"
          content="Read our terms of service for bounce house rentals in San Antonio, TX. Learn about our rental agreement, safety requirements, delivery policies, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />

        {/* Legal specific meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="7 days" />
      </Helmet>

      <div className="w-full bg-secondary-blue/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-primary-blue hover:text-primary-purple transition-colors duration-300 mb-8 group"
              >
                <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Home
              </Link>

              <h1 className="text-4xl font-bold mb-8">
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                  Terms of Service
                </span>
              </h1>

              <div className="space-y-8 text-gray-600">
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    1. Rental Agreement
                  </h2>
                  <p>
                    By renting equipment from SATX Bounce House Rentals, you
                    agree to these terms and conditions. Our rental agreement
                    constitutes a legal contract between SATX Bounce House
                    Rentals and the customer.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    2. Safety Requirements
                  </h2>
                  <p>
                    All equipment must be used in accordance with safety
                    guidelines provided. Adult supervision is required at all
                    times when equipment is in use.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Maximum capacity must be observed for all equipment</li>
                    <li>No food or drinks inside bounce houses</li>
                    <li>Remove shoes before entering</li>
                    <li>No rough play or flips</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    3. Delivery and Setup
                  </h2>
                  <p>
                    We provide free delivery within Loop 1604. Setup and
                    takedown are included in the rental price. A clear, flat
                    area must be provided for installation.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access to electrical outlet within 100 feet</li>
                    <li>Clear path for delivery and setup</li>
                    <li>Minimum space requirements must be met</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    4. Weather Policy
                  </h2>
                  <p>
                    For safety reasons, equipment must not be used in severe
                    weather conditions including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Winds exceeding 15 mph</li>
                    <li>Heavy rain or thunderstorms</li>
                    <li>Extreme temperatures</li>
                  </ul>
                  <p>
                    We reserve the right to cancel or postpone rentals due to
                    adverse weather conditions.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    5. Damage and Liability
                  </h2>
                  <p>
                    Customers are responsible for any damage to equipment during
                    the rental period beyond normal wear and tear. SATX Bounce
                    House Rentals maintains liability insurance for equipment
                    malfunction.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    6. Cancellation Policy
                  </h2>
                  <p>
                    Cancellations must be made at least 24 hours in advance for
                    a full refund. Weather-related cancellations may be
                    rescheduled without penalty.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    7. Payment Terms
                  </h2>
                  <p>
                    Full payment is required to confirm bookings. We accept
                    major credit cards, cash, and digital payment methods.
                  </p>
                </section>

                <div className="bg-secondary-blue/5 p-6 rounded-lg mt-12">
                  <p className="text-sm">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2">
                    For questions about these terms, please{" "}
                    <Link
                      to="/contact"
                      className="text-primary-blue hover:text-primary-purple transition-colors duration-300"
                    >
                      contact us
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;

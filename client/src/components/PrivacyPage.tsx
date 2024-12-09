import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";

const PrivacyPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | SATX Bounce House Rentals</title>
        <meta
          name="description"
          content="Learn about how SATX Bounce House Rentals protects your privacy. Read our privacy policy to understand how we collect, use, and protect your personal information."
        />
        <meta
          name="keywords"
          content="privacy policy, data protection, personal information, customer privacy, SATX Bounce House privacy"
        />

        {/* Open Graph tags */}
        <meta
          property="og:title"
          content="Privacy Policy | SATX Bounce House Rentals"
        />
        <meta
          property="og:description"
          content="Learn about how SATX Bounce House Rentals protects your privacy. Read our privacy policy to understand how we collect, use, and protect your personal information."
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
                  Privacy Policy
                </span>
              </h1>

              <div className="space-y-8 text-gray-600">
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    1. Information We Collect
                  </h2>
                  <p>
                    We collect information that you provide directly to us,
                    including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name and contact information</li>
                    <li>Delivery address and event details</li>
                    <li>Payment information</li>
                    <li>Communications with our team</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    2. How We Use Your Information
                  </h2>
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Process your rental orders</li>
                    <li>Communicate about your rental</li>
                    <li>Provide customer support</li>
                    <li>Send important updates and notices</li>
                    <li>Improve our services</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    3. Information Sharing
                  </h2>
                  <p>
                    We do not sell or share your personal information with third
                    parties except:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>With your consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights and safety</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    4. Data Security
                  </h2>
                  <p>
                    We implement appropriate security measures to protect your
                    personal information, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of sensitive data</li>
                    <li>Secure payment processing</li>
                    <li>Regular security assessments</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    5. Your Rights
                  </h2>
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal information</li>
                    <li>Request corrections to your data</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    6. Cookies and Tracking
                  </h2>
                  <p>We use cookies and similar technologies to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Improve website functionality</li>
                    <li>Analyze website traffic</li>
                    <li>Remember your preferences</li>
                    <li>Provide personalized content</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    7. Children's Privacy
                  </h2>
                  <p>
                    Our services are not intended for children under 13. We do
                    not knowingly collect information from children under 13.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary-purple">
                    8. Changes to Privacy Policy
                  </h2>
                  <p>
                    We may update this privacy policy from time to time. We will
                    notify you of any changes by posting the new policy on this
                    page.
                  </p>
                </section>

                <div className="bg-secondary-blue/5 p-6 rounded-lg mt-12">
                  <p className="text-sm">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2">
                    For questions about our privacy practices, please{" "}
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

export default PrivacyPage;

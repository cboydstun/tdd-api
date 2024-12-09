import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";

const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Where do you offer bounce house rentals?",
      answer:
        "We offer bounce rentals in San Antonio, TX. We also offer bounce rentals in other parts of Bexar County. Please contact us for more information.",
    },
    {
      question: "When do you deliver the bounce houses and waterslide rentals?",
      answer:
        "We like deliver the bounce houses early between 8 am and 10 am, right to your door! However, we often have open availability and are happy to work out a time that is best for you.",
    },
    {
      question:
        "What payment methods do you accept for bounce houses and water slide rentals?",
      answer:
        "We accept cash, CashApp, and credit card payments through PayPal.",
    },
    {
      question: "Do I need a generator for the bounce houses?",
      answer:
        "No, you don't need a generator unless your party location is far from an electrical outlet.",
    },
    {
      question: "Can I make a bounce house rental overnight?",
      answer:
        "Yes, we offer overnight rentals for an additional fee. Please let us know in advance if you'd like to keep them longer.",
    },
    {
      question: "Is a bounce house safe?",
      answer:
        "Absolutely! Safety is our top priority. However, we do ask that you keep an eye on the bouncers at all times to ensure everyone's safety.",
    },
    {
      question: "Can we wear shoes inside SATX bounce houses?",
      answer:
        "For safety reasons, we kindly request that you jump in with bare or socked feet only. No shoes allowed!",
    },
    {
      question: "How long can we rent the bounce houses or jumping place for?",
      answer:
        "Our rentals are for the entire day! You can enjoy the bounce houses from the time of delivery until pickup.",
    },
    {
      question: "What if there's bad weather on the day of my party?",
      answer:
        "In the event of bad weather, we offer a flexible rescheduling policy. Please contact us as soon as possible to discuss alternate arrangements.",
    },
    {
      question: "Can I cancel my reservation?",
      answer:
        "We understand that plans can change. If you need to cancel, please notify us at least 48 hours before your scheduled delivery time for a full refund.",
    },
    {
      question:
        "Is there a minimum age requirement for using the bounce houses?",
      answer:
        "While there is no strict minimum age requirement, we recommend that children using the bounce houses are supervised and of appropriate age for safe enjoyment.",
    },
    {
      question: "Do you offer discounts for multiple rentals?",
      answer:
        "Yes, we offer discounts for multiple rentals. Please contact us for more information.",
    },
    {
      question:
        "Do you offer discounts for non-profit organizations for bounce house and water slide rentals?",
      answer:
        "Yes, we offer discounts for non-profit organizations. Please contact us for more information.",
    },
    {
      question:
        "Do you offer discounts on inflatable castles and waterslides for military personnel?",
      answer:
        "Yes, we offer discounts for military personnel. Please contact us for more information.",
    },
    {
      question:
        "Do you offer discounts for first responders in San Antonio on bounce houses and water slides?",
      answer:
        "Yes, we offer discounts for first responders. Please contact us for more information.",
    },
    {
      question:
        "What about discounts for teachers and other community organizations in San Antonio?",
      answer:
        "Yes, we offer discounts for teachers. Please contact us for more information.",
    },
    {
      question: "Do you offer discounts for healthcare workers?",
      answer:
        "Yes, we offer discounts for healthcare workers. Please contact us for more information.",
    },
    {
      question: "How do I book San Antonio bounce house rentals?",
      answer:
        "You can book a bounce house by calling us at (512) 210-0194 or by filling out the contact form on our website.",
    },
    {
      question: "How far in advance should I book a bounce house near me?",
      answer:
        "We recommend booking at least a week in advance to ensure availability. However, we can sometimes accommodate last-minute requests. Please contact us for more information.",
    },
    {
      question: "Do you offer gift certificates?",
      answer: "No, we do not offer gift certificates at this time.",
    },
    {
      question: "Are there deals on party packages?",
      answer:
        "Yes, we offer party packages and discounts on inflatable bounce houses and waterslides. Please contact us for more information.",
    },
    {
      question: "What about party supplies?",
      answer:
        "Yes, we have cotton candy machines, popcorn machines, snow cone maker and more. Please contact us for more information.",
    },
    {
      question:
        "Are tables and chairs available with bounce house rentals in San Antonio, TX?",
      answer:
        "Yes, we offer tables and chairs. Each folding table comes with six folding chairs. Please contact us for more information.",
    },
    {
      question:
        "Do you offer pony rides or petting zoos with bounce house rental in San Antonio, TX?",
      answer:
        "Yes, we are partnered with GIDDY UP PONY PARTIES AND PETTING ZOOS, LLC to offer pony rides and petting zoo experiences!",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Create FAQ structured data for SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | SATX Bounce House Rentals</title>
        <meta
          name="description"
          content="Find answers to common questions about bounce house rentals in San Antonio, TX. Learn about delivery times, safety measures, pricing, and more."
        />
        <meta
          name="keywords"
          content="bounce house rentals FAQ, San Antonio bounce house questions, party rental FAQ, waterslide rental questions, bounce house safety, rental pricing, delivery information"
        />

        {/* Open Graph tags */}
        <meta
          property="og:title"
          content="Frequently Asked Questions | SATX Bounce House Rentals"
        />
        <meta
          property="og:description"
          content="Find answers to common questions about bounce house rentals in San Antonio, TX. Learn about delivery times, safety measures, pricing, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />

        {/* Structured Data for FAQ Page */}
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
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
                  Frequently Asked Questions
                </span>
              </h1>

              <div className="space-y-4 text-gray-600">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-300"
                      onClick={() => toggleFaq(index)}
                    >
                      <span className="font-medium text-primary-purple">
                        {faq.question}
                      </span>
                      {openIndex === index ? (
                        <Minus className="w-5 h-5 text-primary-blue flex-shrink-0" />
                      ) : (
                        <Plus className="w-5 h-5 text-primary-blue flex-shrink-0" />
                      )}
                    </button>
                    {openIndex === index && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-secondary-blue/5 p-6 rounded-lg mt-12">
                <p className="text-sm">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                <p className="text-sm mt-2">
                  Have more questions? Please{" "}
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
    </>
  );
};

export default FaqPage;

import React from "react";
import { Helmet } from "react-helmet";
import ContactForm from "./ContactForm";

const ContactPage: React.FC = () => {
  // Contact page structured data
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact SATX Bounce House Rentals",
    description:
      "Contact us for bounce house rentals in San Antonio. Free delivery within Loop 1604!",
    url: window.location.href,
    mainEntity: {
      "@type": "LocalBusiness",
      name: "SATX Bounce House Rentals",
      telephone: "512-210-0194",
      openingHours: "Mo-Su 08:00-20:00",
      areaServed: {
        "@type": "City",
        name: "San Antonio",
        sameAs: "https://en.wikipedia.org/wiki/San_Antonio",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Antonio",
        addressRegion: "TX",
        addressCountry: "US",
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | SATX Bounce House Rentals San Antonio</title>
        <meta
          name="description"
          content="Contact SATX Bounce House Rentals for party equipment rentals in San Antonio. Free delivery within Loop 1604! Call us at 512-210-0194 or fill out our contact form."
        />
        <meta
          name="keywords"
          content="contact SATX Bounce House, bounce house rental contact, San Antonio party rentals, rental inquiry, free delivery, party equipment contact"
        />

        {/* Open Graph tags */}
        <meta
          property="og:title"
          content="Contact SATX Bounce House Rentals | San Antonio Party Equipment Rental"
        />
        <meta
          property="og:description"
          content="Contact us for bounce house rentals in San Antonio. Free delivery within Loop 1604! Available 7 days a week from 8am to 8pm."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />

        {/* Location specific meta tags */}
        <meta name="geo.region" content="US-TX" />
        <meta name="geo.placename" content="San Antonio" />
        <meta name="geo.position" content="29.4241;-98.4936" />
        <meta name="ICBM" content="29.4241, -98.4936" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(contactPageSchema)}
        </script>
      </Helmet>

      <div className="w-full bg-secondary-blue/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-6 text-white">
                Get in{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                  Touch
                </span>
              </h1>
              <p className="text-xl text-white max-w-2xl mx-auto">
                Ready to make your event unforgettable? Let's start planning
                your perfect party!
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
              <div className="grid md:grid-cols-2 gap-12 mb-8">
                <div className="space-y-6">
                  <div className="bg-secondary-blue/5 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-primary-purple mb-2">
                      📍 Location
                    </h3>
                    <p className="text-gray-600">San Antonio, TX</p>
                  </div>

                  <div className="bg-secondary-blue/5 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-primary-purple mb-2">
                      📞 Phone
                    </h3>
                    <p className="text-gray-600">
                      <a
                        href="tel:512-210-0194"
                        className="hover:text-primary-blue transition-colors"
                      >
                        512-210-0194
                      </a>
                    </p>
                  </div>

                  <div className="bg-secondary-blue/5 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-primary-purple mb-2">
                      ⏰ Hours
                    </h3>
                    <p className="text-gray-600">Monday - Sunday: 8am - 8pm</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-400 to-purple-600 text-white p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-2">🎉 Free Delivery</h3>
                    <p>Within Loop 1604 for all rentals!</p>
                  </div>

                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      title="San Antonio Service Area Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d222334.34533324622!2d-98.57211767968823!3d29.45876528364436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865c58af04d00eaf%3A0x856e13b10a016bc!2sSan%20Antonio%2C%20TX!5e0!3m2!1sen!2sus!4v1733607158689!5m2!1sen!2sus"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>

                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;

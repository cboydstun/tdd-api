import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet";
import CustomerReviews from "./CustomerReviews";
import ContactForm from "./ContactForm";
import ProductCarousel from "./ProductCarousel";
import InfoSections from "./InfoSections";
import OccasionsSection from "./OccasionsSection";
import HeroSection from "./HeroSection";

const HomePage: React.FC = () => {
  // Local business structured data
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "SATX Bounce House Rentals",
    image: "https://media3.giphy.com/media/wZQ8RoZAfj82CQFQyW/giphy.gif",
    description:
      "San Antonio's premier bounce house and party rental service offering inflatable bounce houses, water slides, and party equipment with free delivery.",
    "@id": "https://satxbounce.com",
    url: "https://satxbounce.com",
    telephone: "(512) 210-0194",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "San Antonio",
      addressLocality: "San Antonio",
      addressRegion: "TX",
      postalCode: "78201",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 29.4241,
      longitude: -98.4936,
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 29.4241,
        longitude: -98.4936,
      },
      geoRadius: "30000",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "20:00",
    },
  };

  return (
    <>
      <Helmet>
        <title>
          SATX Bounce House Rentals | San Antonio Party Equipment Rental
        </title>
        <meta
          name="description"
          content="San Antonio's premier bounce house rental service. Professional and timely bounce house rentals with free delivery and no deposit required. Water slides, party equipment, and more!"
        />
        <meta
          name="keywords"
          content="bounce house rental, San Antonio party rentals, water slides, inflatable rentals, party equipment, event rentals, free delivery"
        />

        {/* Open Graph tags */}
        <meta
          property="og:title"
          content="SATX Bounce House Rentals | San Antonio Party Equipment Rental"
        />
        <meta
          property="og:description"
          content="San Antonio's premier bounce house rental service. Professional and timely bounce house rentals with free delivery and no deposit required."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:image"
          content="https://media3.giphy.com/media/wZQ8RoZAfj82CQFQyW/giphy.gif"
        />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="SATX Bounce House Rentals | San Antonio Party Equipment Rental"
        />
        <meta
          name="twitter:description"
          content="San Antonio's premier bounce house rental service. Professional and timely bounce house rentals with free delivery and no deposit required."
        />
        <meta
          name="twitter:image"
          content="https://media3.giphy.com/media/wZQ8RoZAfj82CQFQyW/giphy.gif"
        />

        {/* Location specific meta tags */}
        <meta name="geo.region" content="US-TX" />
        <meta name="geo.placename" content="San Antonio" />
        <meta name="geo.position" content="29.4241;-98.4936" />
        <meta name="ICBM" content="29.4241, -98.4936" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <HeroSection />

      {/* Customer REviews */}
      <div className="animate-fade-in-up">
        <CustomerReviews />
      </div>

      {/* Product Carousel */}
      <ProductCarousel />

      {/* Occasions Section */}
      <div className="flex justify-center items-center py-4 my-4">

      <div className="w-full max-w-[80%] bg-primary-blue rounded-xl px-8 py-8 text-center">

      <OccasionsSection />
      </div>
      </div>


      {/* Contact Form Section */}
      <div id="contact-form" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Get in Touch
        </h2>
        <div className="max-w-[1000px] mx-auto">
          <ContactForm />
        </div>
      </div>

      {/* Info Sections */}
      <InfoSections />

      {/* CTA Section */}
      <div className="flex justify-center items-center py-4 my-4">
        <div className="w-full max-w-[80%] bg-primary-blue rounded-xl px-8 py-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Ready to Make Your Event Unforgettable?
          </h2>
          <p className="text-xl mb-8 text-secondary-blue">
            Book now and get free delivery within Loop 1604!
          </p>
          <Link
            to="/contact"
            className="bg-white text-primary-blue px-8 py-3 rounded-lg font-semibold hover:bg-secondary-blue transition inline-flex items-center gap-2"
          >
            Contact Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomePage;

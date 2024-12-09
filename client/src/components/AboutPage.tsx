import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const AboutPage: React.FC = () => {
  // Organization structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SATX Bounce House Rentals",
    "description": "Premier bounce house and party rental service in San Antonio, TX, offering inflatable bounce houses, water slides, and party equipment with free delivery.",
    "url": "https://satxbounce.com",
    "areaServed": {
      "@type": "City",
      "name": "San Antonio",
      "sameAs": "https://en.wikipedia.org/wiki/San_Antonio"
    },
    "telephone": "(512) 210-0194",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Antonio",
      "addressRegion": "TX",
      "addressCountry": "US"
    }
  };

  return (
    <>
      <Helmet>
        <title>About Us | SATX Bounce House Rentals San Antonio</title>
        <meta name="description" content="Learn about SATX Bounce House Rentals, San Antonio's trusted provider of bounce houses, water slides, and party equipment. Discover our story, values, and commitment to safety and customer satisfaction." />
        <meta name="keywords" content="about SATX Bounce House, San Antonio party rentals, bounce house company, inflatable rentals history, party equipment provider, customer service, safety commitment" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="About SATX Bounce House Rentals | San Antonio's Premier Party Rental Service" />
        <meta property="og:description" content="Learn about SATX Bounce House Rentals, San Antonio's trusted provider of bounce houses, water slides, and party equipment. Discover our story, values, and commitment to safety and customer satisfaction." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        
        {/* Location specific meta tags */}
        <meta name="geo.region" content="US-TX" />
        <meta name="geo.placename" content="San Antonio" />
        <meta name="geo.position" content="29.4241;-98.4936" />
        <meta name="ICBM" content="29.4241, -98.4936" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      <div className="w-full bg-secondary-blue/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-center mb-12 text-white">
              About <span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">SATX Bounce House Rentals</span>
            </h1>
            
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Family Photo</h2>
              {/* Photo placeholder - add actual photo later */}
            </div>

            {/* Story Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold text-primary-purple mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>We began our journey with a clear vision: to elevate every San Antonio event with fun and engaging bounce houses and water slide rentals.</p>
                <p>At SATX Bounce, we quickly became synonymous with unparalleled service and an expansive inventory.</p>
                <p>As time passed, not only did our collection of bounce house rentals in San Antonio grow, but so did our dedication to our cherished customers.</p>
                <p>From wet inflatables to dry slides, combo units, and even unique party additions like popcorn makers and petting zoos, SATX Bounce House Rentals always seeks to surpass expectations.</p>
                <p>Today, we take pride in being the foremost name in bounce house rental San Antonio, TX, and the neighboring regions trust.</p>
              </div>
            </div>

            {/* Promise Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold text-primary-purple mb-6">Our Promise</h2>
              <div className="space-y-6">
                <div className="bg-secondary-blue/5 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text mb-4">Safety First</h3>
                  <div className="space-y-4 text-gray-600 text-lg">
                    <p>Ensuring the well-being of your guests is our utmost priority.</p>
                    <p>At SATX Bounce, we meticulously maintain our equipment, especially our water slide rentals, adhering to stringent safety protocols.</p>
                    <p>This commitment ensures a joyous and carefree experience for everyone.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Satisfaction Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold text-primary-purple mb-6">Customer Satisfaction</h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>Our customers are the essence of everything we do at San Antonio bounce house rentals.</p>
                <p>We're unwavering in our mission to offer the peak of service, from the initial booking to the event day.</p>
                <p>Your confidence and satisfaction are paramount to us.</p>
              </div>
            </div>

            {/* Why Us Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold text-primary-purple mb-6">Why us?</h2>
              <div className="bg-secondary-blue/5 p-6 rounded-lg">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text mb-4">Flexibility</h3>
                <div className="space-y-4 text-gray-600 text-lg">
                  <p>Life's unpredictable nature, especially when planning events, is something we fully recognize.</p>
                  <p>That's why our team at SATX Bounce House Rentals emphasizes flexibility, ensuring we're always ready to adapt with you.</p>
                  <p>We believe in treating people the way our family wants to be treated.</p>
                </div>
              </div>
            </div>

            {/* Rental Terms Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold text-primary-purple mb-6">Rental Terms</h2>
              <div className="bg-secondary-blue/5 p-6 rounded-lg">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text mb-4">Transparency</h3>
                <div className="space-y-4 text-gray-600 text-lg">
                  <p>Absolutely no hidden fees or unpleasant surprises.</p>
                  <p>Our transparent and affordable inflatable party rental pricing model means you'll always be clear on what you're getting, streamlining your event preparations.</p>
                  <p>We are always happy to answer any questions you may have! Just ask!</p>
                </div>
              </div>
            </div>

            {/* Why Choose SATX Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold text-primary-purple mb-6">Why Choose SATX?</h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>Beyond our premier inventory, which includes top-notch water slide rentals San Antonio relies on, and our unwavering service commitment, we believe in nurturing lasting relationships.</p>
                <p>Choosing us means you're not just opting for a bounce house rental; you're partnering with a dedicated team passionate about ensuring your event's triumph.</p>
                <p>Our legacy stands on the countless joyous laughter and memories we've facilitated, and we're excited to be a part of your next memorable event.</p>
              </div>
            </div>

            {/* Join Us Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold text-primary-purple mb-6">Join Us in Our Journey</h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>Whether it's a cozy backyard gathering or a grand festivity, each celebration holds its own charm.</p>
                <p>Let's join forces to make your next event the buzz of San Antonio!</p>
                <p>We cordially invite you to delve into our offerings, pose queries, and get in touch with us.</p>
                <p>At SATX Bounce House Rentals, we're not just about bounce houses or waterslide rentals San Antonio cherishes; we're your comrades in crafting indelible memories.</p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-400 to-purple-600 text-white rounded-xl shadow-lg p-8 mb-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Create Memories?</h2>
              <p className="text-xl mb-6">Let's make your next event unforgettable!</p>
              <Link
                to="/contact"
                className="inline-block bg-white text-primary-purple px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
              >
                Contact Us Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;

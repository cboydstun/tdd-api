import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">


        <h1 className="text-4xl font-bold text-primary-purple mb-8">About SATX Bounce House Rentals</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Family Photo</h2>
          {/* Photo placeholder - add actual photo later */}
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="mb-4">We began our journey with a clear vision: to elevate every San Antonio event with fun and engaging bounce houses and water slide rentals.</p>
          <p className="mb-4">At SATX Bounce, we quickly became synonymous with unparalleled service and an expansive inventory.</p>
          <p className="mb-4">As time passed, not only did our collection of bounce house rentals in San Antonio grow, but so did our dedication to our cherished customers.</p>
          <p className="mb-4">From wet inflatables to dry slides, combo units, and even unique party additions like popcorn makers and petting zoos, SATX Bounce House Rentals always seeks to surpass expectations.</p>
          <p className="mb-4">Today, we take pride in being the foremost name in bounce house rental San Antonio, TX, and the neighboring regions trust.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Promise</h2>
          <h3 className="text-xl font-semibold mb-2">Safety First</h3>
          <p className="mb-4">Ensuring the well-being of your guests is our utmost priority.</p>
          <p className="mb-4">At SATX Bounce, we meticulously maintain our equipment, especially our water slide rentals, adhering to stringent safety protocols.</p>
          <p className="mb-4">This commitment ensures a joyous and carefree experience for everyone.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Customer Satisfaction</h2>
          <p className="mb-4">Our customers are the essence of everything we do at San Antonio bounce house rentals.</p>
          <p className="mb-4">We're unwavering in our mission to offer the peak of service, from the initial booking to the event day.</p>
          <p className="mb-4">Your confidence and satisfaction are paramount to us.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why us?</h2>
          <h3 className="text-xl font-semibold mb-2">Flexibility</h3>
          <p className="mb-4">Life's unpredictable nature, especially when planning events, is something we fully recognize.</p>
          <p className="mb-4">That's why our team at SATX Bounce House Rentals emphasizes flexibility, ensuring we're always ready to adapt with you.</p>
          <p className="mb-4">We believe in treating people the way our family wants to be treated.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Rental Terms</h2>
          <h3 className="text-xl font-semibold mb-2">Transparency</h3>
          <p className="mb-4">Absolutely no hidden fees or unpleasant surprises.</p>
          <p className="mb-4">Our transparent and affordable inflatable party rental pricing model means you'll always be clear on what you're getting, streamlining your event preparations.</p>
          <p className="mb-4">We are always happy to answer any questions you may have! Just ask!</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why Choose SATX?</h2>
          <p className="mb-4">Beyond our premier inventory, which includes top-notch water slide rentals San Antonio relies on, and our unwavering service commitment, we believe in nurturing lasting relationships.</p>
          <p className="mb-4">Choosing us means you're not just opting for a bounce house rental; you're partnering with a dedicated team passionate about ensuring your event's triumph.</p>
          <p className="mb-4">Our legacy stands on the countless joyous laughter and memories we've facilitated, and we're excited to be a part of your next memorable event.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Join Us in Our Journey</h2>
          <p className="mb-4">Whether it's a cozy backyard gathering or a grand festivity, each celebration holds its own charm.</p>
          <p className="mb-4">Let's join forces to make your next event the buzz of San Antonio!</p>
          <p className="mb-4">We cordially invite you to delve into our offerings, pose queries, and get in touch with us.</p>
          <p className="mb-4">At SATX Bounce House Rentals, we're not just about bounce houses or waterslide rentals San Antonio cherishes; we're your comrades in crafting indelible memories.</p>
        </section>

        <div className="flex justify-between items-center mt-16 border-t pt-8">
          <div className="text-sm">© 2023 SATX Bounce</div>
          <div className="text-sm">📞 512-210-0194</div>
          <div className="space-x-4 text-sm">
            <Link to="/terms" className="hover:text-secondary-indigo">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-secondary-indigo">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

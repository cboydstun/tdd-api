import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CustomerReviews from "./CustomerReviews";
import { Feature, features } from "../data/features";
import ContactForm from "./ContactForm";
import ProductCarousel from "./ProductCarousel";

const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <div 
        className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center overflow-hidden" 
        style={{ 
          backgroundImage: 'url("https://media3.giphy.com/media/wZQ8RoZAfj82CQFQyW/giphy.gif?cid=6c09b9529ffd590a91ec0c1478287543484f520c19b1d63c&rid=giphy.gif&ct=g")',
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/20"></div>
        
        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-white animate-fade-in-down drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            San Antonio's Premier
            <span className="block mt-2 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
              Bounce House Rentals
            </span>
          </h1>
          
          <p className="text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] animate-fade-in-up">
            Professional and timely bounce house rentals with 
            <span className="font-bold text-blue-300"> free delivery </span> 
            and 
            <span className="font-bold text-purple-300"> no deposit required</span>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up">
            <a 
              href="#contact-form"
              className="group relative px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl overflow-hidden transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10">Contact Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            
            <Link
              to="/products"
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-bold rounded-xl border-2 border-white/30 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-xl hover:border-white/50"
            >
              View Products
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
        <div className="container mx-auto">
                {/* Customer REviews */}
                <div className="animate-fade-in-up">
            <div className="flex justify-center items-center gap-8 mb-8">
              <CustomerReviews />
            </div>
            <ProductCarousel />
          </div>
      </div>

      {/* Problem Section */}
      <div className="py-16 bg-secondary-blue/10 rounded-xl px-8 my-16 container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary-purple">
          Planning a Party Shouldn't Be Stressful
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow hover:border-secondary-indigo transition duration-300 border-2 border-transparent">
            <p className="text-lg text-gray-600">
              Worried about safety and cleanliness?
            </p>
            <p className="mt-4 text-gray-600">
              We prioritize the safety of your guests and maintain strict
              cleaning protocols for all our equipment.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:border-secondary-indigo transition duration-300 border-2 border-transparent">
            <p className="text-lg text-gray-600">
              Need reliable and punctual service?
            </p>
            <p className="mt-4 text-gray-600">
              Count on our dedicated team for prompt delivery and professional
              setup, every time.
            </p>
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="container mx-auto px-4 space-y-24 my-24">
        {/* About Us */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-primary-purple">
            Choose Us
          </h2>
          <p className="text-gray-600 text-lg">
            When you choose our party service, we are committed to offering the
            highest level of customer satisfaction. From the moment you book
            with us, you can expect a seamless and enjoyable experience with our
            water slides, bounce houses, or both! Our goal is to make your event
            memorable and fun with our wide range of wet inflatables, dry
            inflatables, and bounce houses.
          </p>
        </section>

        {/* Safety Section */}
        <section className="max-w-4xl mx-auto bg-secondary-blue/5 p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-6 text-primary-purple">
            Safe & Clean Inflatable Rentals
          </h2>
          <p className="text-gray-600 text-lg mb-4">
            At SATX Bounce House Rentals, we understand that planning a party
            can be stressful, with numerous details to consider. To ease your
            worries, we prioritize the safety of your guests during your event
            in San Antonio. We take safety seriously with our water slides, dry
            slides, combo units, and bounce houses.
          </p>
          <p className="text-gray-600 text-lg">
            Our commitment to safety includes using high-quality,
            well-maintained equipment for all our party rentals. We follow
            strict safety protocols for our wet and dry inflatables ensuring a
            successful and secure event. With SATX Bounce House Rentals, you can
            rest easy knowing we've done everything in our power to create a fun
            and safe environment for your party.
          </p>
        </section>

        {/* Customer Service */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-primary-purple">
            Great Customer Service for Event Rentals
          </h2>
          <p className="text-gray-600 text-lg mb-4">
            At SATX Bounce House Rentals, we recognize that life can be
            unpredictable, and plans may change. That's why we emphasize
            flexibility for our party rentals in San Antonio, including water
            slides, wet and dry combo units, and great slide options. If you
            encounter unexpected changes and need to adjust your rental, we will
            collaborate with you to find the best solution for your needs.
          </p>
          <p className="text-gray-600 text-lg">
            Our commitment to exceptional customer service ensures that you can
            rely on us to be there when you need us. Whether it's a minor issue
            or a major challenge, we will do everything in our power to make
            things right. With SATX Bounce House Rentals, you can trust that our
            wet and dry inflatables, slides, and party rentals will adapt to
            your changing circumstances.
          </p>
        </section>

        {/* Pricing */}
        <section className="max-w-4xl mx-auto bg-secondary-blue/5 p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-6 text-primary-purple">
            Affordable Daily Pricing
          </h2>
          <p className="text-gray-600 text-lg mb-4">
            At SATX Bounce House Rentals, we pride ourselves on transparency in
            pricing for our bounce house rentals, chair rentals, and great combo
            units near you. We clearly state that all our prices are based on
            daily rates. If you need your rental for more than one day, we're
            more than happy to work with you to find a budget-friendly solution.
          </p>
          <p className="text-gray-600 text-lg">
            Our goal is to ensure you feel comfortable with your rental
            agreement and fully understand what you're paying for. If you have
            any questions about pricing for our wet and dry inflatables, or
            water slides, please don't hesitate to ask.
          </p>
        </section>

        {/* Delivery & Setup */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-primary-purple">
            Free Delivery & Setup for Party Rentals
          </h2>
          <p className="text-gray-600 text-lg mb-4">
            At SATX Bounce House Rentals, we believe in providing a hassle-free
            experience for our customers in San Antonio. That's why we include
            delivery and setup in the price of your bounce houses and slide
            rentals. We will collaborate with you to schedule a convenient
            delivery time, and our team will arrive promptly before 8 am to set
            up your rental.
          </p>
          <p className="text-gray-600 text-lg">
            Once your event has concluded, we will return after 6 pm to pick up
            the slide or bounce house. With us, you won't have to worry about a
            thing; we've got you covered from start to finish, ensuring a smooth
            and enjoyable party rental experience.
          </p>
        </section>
      </div>

      {/* Solution Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary-purple">
          Your One-Stop Party Solution
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature: Feature, index: number) => (
            <div
              key={index}
              className="p-6 border rounded-lg hover:border-secondary-indigo transition duration-300"
            >
              <feature.icon className="w-12 h-12 text-primary-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-primary-purple">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary-purple">
          Perfect For Any Occasion
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "Birthday Parties",
            "School Events",
            "Church Functions",
            "Community Gatherings",
          ].map((event: string, index: number) => (
            <div
              key={index}
              className="p-6 bg-secondary-blue/10 rounded-lg text-center hover:bg-secondary-purple/10 transition duration-300"
            >
              <h3 className="font-semibold text-primary-blue">{event}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form Section */}
      <div id="contact-form" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary-purple">
          Get in Touch
        </h2>
        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-blue rounded-xl px-8 my-16 text-center">
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
    </>
  );
};

export default HomePage;
